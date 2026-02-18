/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminData(
  page: number = 1,
  pageSize: number = 30,
  searchTerm: string = "",
  role: string = "all"
) {
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*", { count: "exact" });

  if (searchTerm) {
    query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
  }

  if (role !== "all") {
    query = query.eq("role", role);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: users, count: totalUsers, error: usersError } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (usersError) {
    console.error("Error fetching users:", usersError);
    return null;
  }

  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  const { count: newSignups } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", yesterday.toISOString());

  interface Profile {
    id: string;
    badges_created: number;
    full_name: string;
    email: string;
    is_admin: boolean;
    role: string;
    created_at: string;
    updated_at: string;
    score?: number;
  }


  return {
    stats: {
      totalUsers: totalUsers || 0,
      newSignups: newSignups || 0,
    },
    users: (users as Profile[]) || [],
  };
}

import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) {
    return { success: false, error: "Authentication required" };
  }

  // Verify requester is a super admin (is_admin flag or admin role)
  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", requester.id)
    .single();

  if (!requesterProfile?.is_admin && requesterProfile?.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin privileges required" };
  }

  // If promoting to Admin or Project Admin, reset all contributor metrics to 0
  const updates: any = { role, updated_at: new Date().toISOString() };
  if (role === "admin" || role === "project-admin") {
    updates.score = 0;
    updates.merged_prs = 0;
    updates.projects_count = 0;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }

  console.log(`[AUDIT] Role Updated: Super Admin ${requester.email} changed User ${userId} role to ${role}`);
  revalidatePath("/admin");
  return { success: true };
}

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function updateUserScore(userId: string, score: number) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) {
    return { success: false, error: "Authentication required" };
  }

  // Verify requester is an admin or project-admin
  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", requester.id)
    .single();

  if (!requesterProfile?.is_admin && requesterProfile?.role !== "admin" && requesterProfile?.role !== "project-admin") {
    return { success: false, error: "Unauthorized: Admin privileges required" };
  }

  // 1. Block self-scoring
  if (requester.id === userId) {
    return { success: false, error: "Self-scoring is strictly prohibited." };
  }

  // 2. Check the target user's role - only contributors can have scores
  const { data: targetProfile } = await supabaseAdmin
    .from("profiles")
    .select("role, is_admin")
    .eq("id", userId)
    .single();

  if (targetProfile?.is_admin || targetProfile?.role === "admin" || targetProfile?.role === "project-admin") {
    return { success: false, error: "Scores cannot be assigned to administrative roles." };
  }

  // Use admin client to bypass RLS for updating scores
  const { data, error, status } = await supabaseAdmin
    .from("profiles")
    .update({
      score,
      merged_prs: targetProfile?.role === 'contributor' ? undefined : 0, // Ensure PRs are 0 if role changed
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
    .select();

  if (error) {
    console.error("Error updating user score:", error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    console.warn("No profile found with ID or no rows updated:", userId);
    return { success: false, error: "Profile not found or no update applied" };
  }

  console.log(`[AUDIT] Score Updated: Admin ${requester.email} (${requester.id}) set score for User ${userId} to ${score}. Status: ${status}`);
  return { success: true };
}

import { syncGitHubContribution } from "@/lib/actions/github";

export async function syncAllUsers() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from("profiles")
      .select("id, github")
      .eq("role", "contributor")
      .not("github", "is", null);

    if (error) throw error;
    if (!users || users.length === 0) return { success: true, count: 0 };

    console.log(`[AdminSync] Found ${users.length} contributors to sync.`);

    const BATCH_SIZE = 1;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const user = users[i];

      if (user.github) {
        console.log(`[AdminSync] Syncing user ${i + 1}/${users.length}: ${user.github}`);
        try {
          const result = await syncGitHubContribution(user.id, user.github);
          if (result.success) successCount++;
          else failCount++;
        } catch (err) {
          console.error(`[AdminSync] Error syncing ${user.github}:`, err);
          failCount++;
        }
      }

      if (i + 1 < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return { success: true, count: users.length, successCount, failCount };

  } catch (error) {
    console.error("[AdminSync] Error:", error);
    return { success: false, error: "Failed to sync users" };
  }
}

export async function syncUser(userId: string) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("profiles")
      .select("id, github")
      .eq("id", userId)
      .single();

    if (error || !user) throw new Error("User not found");
    if (!user.github) return { success: false, error: "User has no GitHub handle linked" };

    const result = await syncGitHubContribution(user.id, user.github);
    return result;

  } catch (error: any) {
    console.error("[AdminSync] Single User Error:", error);
    return { success: false, error: error.message || "Failed to sync user" };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { PROJECTS } from "@/data/projects";

/**
 * Syncs a user's GitHub contribution data (merged PRs and projects)
 * and updates their profile and score in the database.
 */
export async function syncGitHubContribution(userId: string, githubHandle: string) {
    const normalizedHandle = githubHandle.toLowerCase().trim();
    if (!normalizedHandle) return { success: false, error: "No GitHub handle provided" };

    // 1. Ownership & Role check
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role, id, github, score")
        .eq("id", userId)
        .single();

    if (!profile) return { success: false, error: "Profile not found" };

    // Check if handle is taken by another account
    const { data: existingHandleAccount } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("github", normalizedHandle)
        .neq("id", userId)
        .maybeSingle();

    if (existingHandleAccount) {
        return { success: false, error: "This GitHub handle is already linked to another account." };
    }

    // Admins and Project Admins should NOT have any metrics or be on the leaderboard
    if (profile.role !== "contributor") {
        await supabaseAdmin
            .from("profiles")
            .update({
                score: 0,
                merged_prs: 0,
                projects_count: 0,
                updated_at: new Date().toISOString()
            })
            .eq("id", userId);

        return {
            success: true,
            data: {
                mergedPRs: 0,
                projectsCount: 0,
                score: 0,
                message: "Admins are excluded from stats"
            }
        };
    }

    // 2. Get all project repository identifiers (e.g., "owner/repo")
    // We extract these from the githubRepo URLs in our PROJECTS data
    const competitionRepos = PROJECTS.map(p => {
        try {
            // Remove trailing slash and .git suffix
            const url = p.githubRepo.trim().replace(/\/$/, "").replace(/\.git$/, "");
            const parts = url.split("/");
            if (parts.length >= 2) {
                const owner = parts[parts.length - 2].toLowerCase();
                const repo = parts[parts.length - 1].toLowerCase();
                return `${owner}/${repo}`;
            }
            return null;
        } catch {
            return null;
        }
    }).filter(Boolean) as string[];

    // 2. Fetch merged PRs for this user from GitHub API
    // We search for PRs authored by the user that are merged.
    // Note: For a real production app, you should use a GITHUB_TOKEN in env
    // to avoid strict rate limits.
    const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

    try {
        // Search Query: Involves the user (author or assignee), is closed, 
        // across the entire account (we filter repos locally).
        const query = `involves:${normalizedHandle.replace('@', '')} is:closed`;
        const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

        const response = await fetch(searchUrl, {
            headers: GITHUB_TOKEN ? {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            } : {
                Accept: "application/vnd.github.v3+json",
            },
            next: { revalidate: 0 } // No cache for immediate updates (Debugging)
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("GitHub API Error:", err);
            return { success: false, error: "GitHub API rate limit or error" };
        }

        const searchData = await response.json();
        const items = searchData.items || [];

        // 3. Process Items: Group by Repo & Item Type
        const prs: any[] = [];
        const issuesByRepo: Record<string, any[]> = {};

        for (const item of items) {
            const repoUrl = (item.repository_url || "").toLowerCase();
            const repoSuffix = repoUrl.split("/repos/")[1];
            if (!repoSuffix || !competitionRepos.includes(repoSuffix)) continue;

            const isPR = !!item.pull_request;
            const isAuthored = item.user?.login.toLowerCase() === normalizedHandle;
            const isAssignee = item.assignees?.some((a: any) => a.login.toLowerCase() === normalizedHandle);

            if (isPR && isAuthored) {
                prs.push({ ...item, repoSuffix });
            } else if (!isPR && isAssignee) {
                if (!issuesByRepo[repoSuffix]) issuesByRepo[repoSuffix] = [];
                issuesByRepo[repoSuffix].push(item);
            }
        }

        let mergedCount = 0;
        const difficultyCounts: Record<string, number> = { easy: 0, med: 0, hard: 0, exp: 0 };
        const uniqueProjectRepos = new Set<string>();

        // Helper to extract difficulty from a context string
        const getDifficulty = (labels: string[], title: string, body: string) => {
            const context = [...labels, title.toLowerCase(), body.toLowerCase()].join(" ");
            if (/expert|exp|advanced/.test(context)) return 'exp';
            if (/hard|high/.test(context)) return 'hard';
            if (/medium|med|intermediate|mid/.test(context)) return 'med';
            if (/easy|beginner|starter/.test(context)) return 'easy';
            return 'easy';
        };

        for (const pr of prs) {
            mergedCount++;
            uniqueProjectRepos.add(pr.repoSuffix);

            // 1. Get PR difficulty
            const prLabels = pr.labels?.map((l: any) => l.name.toLowerCase()) || [];
            let level = getDifficulty(prLabels, pr.title, pr.body || "");

            // 2. Try to find a linked issue to inherit a higher difficulty
            // Look for "fixes #123" or similar in PR body
            const linkedIssueMatch = (pr.body || "").match(/(?:fixes|closes|resolves)\s+#(\d+)/i);
            const linkedIssueNumber = linkedIssueMatch ? parseInt(linkedIssueMatch[1]) : null;

            const repoIssues = issuesByRepo[pr.repoSuffix] || [];
            const linkedIssue = repoIssues.find(i =>
                i.number === linkedIssueNumber ||
                (i.title.toLowerCase().includes(pr.title.toLowerCase().substring(0, 20)))
            );

            if (linkedIssue) {
                const issueLabels = linkedIssue.labels?.map((l: any) => l.name.toLowerCase()) || [];
                const issueLevel = getDifficulty(issueLabels, linkedIssue.title, linkedIssue.body || "");

                // Inherit higher difficulty
                const weight: Record<string, number> = { exp: 4, hard: 3, med: 2, easy: 1 };
                if (weight[issueLevel] > weight[level]) {
                    level = issueLevel;
                }
            }

            difficultyCounts[level]++;
        }

        const projectsCount = uniqueProjectRepos.size;

        // 4. Calculate Score based on Weighted Difficulty
        const calculatedScore = (difficultyCounts.easy * 10) +
            (difficultyCounts.med * 20) +
            (difficultyCounts.hard * 30) +
            (difficultyCounts.exp * 50);

        // 5. Update Database
        // We use Math.max to ensure that manual score updates by admins are preserved
        // if the calculated score from GitHub is lower.
        // Also ensure merged_prs and projects_count are updated.
        const { error } = await supabaseAdmin
            .from("profiles")
            .update({
                merged_prs: mergedCount,
                projects_count: projectsCount,
                score: Math.max(profile?.score || 0, calculatedScore),
                updated_at: new Date().toISOString()
            })
            .eq("id", userId);

        if (error) {
            console.error("Database Update Error:", error);
            return { success: false, error: "Failed to update database" };
        }

        return {
            success: true,
            data: {
                mergedPRs: mergedCount,
                projectsCount: projectsCount,
                difficultyCounts,
                score: Math.max(profile?.score || 0, calculatedScore)
            }
        };


    } catch (error) {
        console.error("Error loading projects:", error); // Updated console.error message
        return { success: false, error: "Configuration Error" }; // Updated error message
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { PROJECTS } from "@/data/projects";

/**
 * Syncs a user's GitHub contribution data (merged PRs and projects)
 * and updates their profile and score in the database.
 */
export async function syncGitHubContribution(userId: string, githubHandle: string) {
    // Clean up the handle: remove @, whitespace, and extract from URL if present
    let normalizedHandle = githubHandle.toLowerCase().trim().replace("@", "");

    // Handle full URL case (e.g. https://github.com/username)
    if (normalizedHandle.includes("github.com/")) {
        const parts = normalizedHandle.split("github.com/");
        if (parts.length > 1) {
            normalizedHandle = parts[1].split("/")[0]; // Get the part after github.com/ and before next /
        }
    }

    if (!normalizedHandle) return { success: false, error: "No GitHub handle provided" };

    console.log(`[Sync] Starting sync for user: ${userId}, handle: ${normalizedHandle}`);


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

    // Debug: Log parsed repos
    console.log('[Sync] Competition Repos:', competitionRepos);

    // 2. Fetch merged PRs and Assigned Issues from GitHub API
    // We split this into two queries to avoid 422 "Validation Failed" (GitHub allows broad "involves" but sometimes restricts it).
    // Query 1: Authored PRs that are closed
    // Query 2: Assigned Issues that are closed
    const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
    const items: any[] = [];

    const fetchAllItems = async (query: string) => {
        const fetchedItems: any[] = [];
        let page = 1;
        const PER_PAGE = 100;
        let hasNextPage = true;

        while (hasNextPage) {
            const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;
            console.log(`[Sync] Fetching ${query} Page ${page}`);

            const response = await fetch(searchUrl, {
                headers: GITHUB_TOKEN ? {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                } : {
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 0 }
            });

            if (!response.ok) {
                const err = await response.json();
                console.error(`[Sync] GitHub API Error for query "${query}":`, err);
                if (page === 1) throw new Error("GitHub API Error");
                break;
            }

            const searchData = await response.json();
            const pageItems = searchData.items || [];
            fetchedItems.push(...pageItems);

            if (pageItems.length < PER_PAGE) {
                hasNextPage = false;
            } else {
                page++;
                if (page > 5) hasNextPage = false; // Safety cap
            }
            // Optional small delay
            if (!GITHUB_TOKEN) await new Promise(res => setTimeout(res, 500));
        }
        return fetchedItems;
    };

    try {
        // Fetch PRs
        const prQuery = `author:${normalizedHandle.replace('@', '')} type:pr is:closed`;
        const prItems = await fetchAllItems(prQuery);
        items.push(...prItems);

        // Fetch Issues
        // Small delay between queries
        await new Promise(res => setTimeout(res, 1000));

        const issueQuery = `assignee:${normalizedHandle.replace('@', '')} type:issue is:closed`;
        const issueItems = await fetchAllItems(issueQuery);
        items.push(...issueItems);

        console.log(`[Sync] Found Total ${items.length} items (PRs: ${prItems.length}, Issues: ${issueItems.length}) from GitHub.`);

        // 3. Process Items: Group by Repo & Item Type
        const prs: any[] = [];
        const issuesByRepo: Record<string, any[]> = {};

        console.log(`[Sync] Competition Repos (Count: ${competitionRepos.length}):`, competitionRepos.slice(0, 5));


        for (const item of items) {
            // Parse repo from URL (api.github.com/repos/OWNER/REPO/...)
            const repoUrl = (item.repository_url || "").toLowerCase();
            const repoSuffix = repoUrl.split("/repos/")[1];

            if (!repoSuffix) {
                console.log(`[Sync] Skipping item: No repo suffix found. URL: ${repoUrl}`);
                continue;
            }

            if (!competitionRepos.includes(repoSuffix)) {
                // specific debug for potential casing mismatches
                const partialMatch = competitionRepos.find(r => r.includes(repoSuffix) || repoSuffix.includes(r));
                if (partialMatch) {
                    console.log(`[Sync] NEAR MISS: ${repoSuffix} vs ${partialMatch}`);
                }
                continue;
            }


            const isPR = !!item.pull_request;
            const isAuthored = item.user?.login.toLowerCase() === normalizedHandle;
            const isAssignee = item.assignees?.some((a: any) => a.login.toLowerCase() === normalizedHandle);

            if (isPR && isAuthored) {
                prs.push({ ...item, repoSuffix });
            } else if (!isPR && isAssignee) {
                if (!issuesByRepo[repoSuffix]) issuesByRepo[repoSuffix] = [];
                issuesByRepo[repoSuffix].push(item);
            } else {
                console.log(`[Sync] Skipping valid repo item: Not authored PR or assigned issue. PR: ${isPR}, Authored: ${isAuthored}, Assignee: ${isAssignee}`);
            }
        }

        console.log(`[Sync] Processed PRs: ${prs.length}`);

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
            const linkedIssueMatch = (pr.body || "").match(/(?:fixes|closes|resolves|linked to)\s+#(\d+)/i);
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

        console.log(`[Sync] Calculated Score: ${calculatedScore}, Merged PRs: ${mergedCount}`);

        // 5. Update Database
        // UPDATED: Removed Math.max() to allow scores to correct downwards if needed
        const { error } = await supabaseAdmin
            .from("profiles")
            .update({
                merged_prs: mergedCount,
                projects_count: projectsCount,
                score: calculatedScore, // Direct assignment
                updated_at: new Date().toISOString()
            })
            .eq("id", userId);

        if (error) {
            console.error("[Sync] Database Update Error:", error);
            return { success: false, error: "Failed to update database" };
        }

        console.log(`[Sync] Database Updated Successfully for user ${userId}`);

        return {
            success: true,
            data: {
                mergedPRs: mergedCount,
                projectsCount: projectsCount,
                difficultyCounts,
                score: calculatedScore
            }
        };


    } catch (error) {
        console.error("Error loading projects:", error); // Updated console.error message
        return { success: false, error: "Configuration Error" }; // Updated error message
    }
}

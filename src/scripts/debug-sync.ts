/**
 * Standalone debug script for GitHub Sync Logic.
 * Run with: npx tsx src/scripts/debug-sync.ts <username>
 */

import { syncGitHubContribution } from "../lib/actions/github";
import { config } from "dotenv";

config({ path: ".env.local" });

const main = async () => {
    const handle = process.argv[2];
    // Mock user ID since we can't easily get it without DB access in standalone script
    // unless we use supabase admin.
    // For now, let's just use a dummy ID and see if the GitHub fetching works.
    const userId = "debug-user-id";

    if (!handle) {
        console.error("Please provide a GitHub handle.");
        process.exit(1);
    }

    console.log(`Debugging Sync for handle: ${handle}`);

    // We might need to mock or stub DB calls if supabaseAdmin fails in this context on windows
    // But let's try calling it directly first.

    try {
        const result = await syncGitHubContribution(userId, handle);
        console.log("Sync Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Sync Failed:", e);
    }
};

main();

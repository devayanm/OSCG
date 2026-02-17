"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { syncAllUsers } from "@/lib/actions/admin";

export default function SyncButton() {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        toast.info("Starting global sync...");

        try {
            const result = await syncAllUsers();

            if (result.success) {
                toast.success(`Sync Complete: ${result.successCount} updated, ${result.failCount} failed.`);
            } else {
                toast.error("Sync failed: " + result.error);
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B0F17] border border-white/5 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">{loading ? 'Syncing...' : 'Sync All Users'}</span>
        </button>
    );
}

import { Suspense } from "react";
import {
  Users,
  ShieldAlert,
} from "lucide-react";
import { getAdminData } from "@/lib/actions/admin";
import UserManagement from "@/components/admin/UserManagement";

import SyncButton from "@/components/admin/SyncButton";

export const metadata = {
  title: "Admin Command Center | OSCG",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const pageSize = parseInt(params.pageSize as string) || 30;
  const search = (params.search as string) || "";
  const role = (params.role as string) || "all";

  const data = await getAdminData(page, pageSize, search, role);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-slate-400 max-w-md">Failed to connect to the participant database.</p>
      </div>
    );
  }

  const { stats, users } = data;

  return (
    <div className="p-8 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Community Oversight</h1>
          <p className="text-slate-400 font-medium">Manage OSCG participants and export data for email outreach.</p>
        </div>
        <SyncButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Participants"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-5 h-5 text-[#11D392]" />}
          description="Verified members in database"
        />
      </div>


      <div className="pt-4">
        <Suspense fallback={
          <div className="w-full h-64 bg-[#0B0F17]/50 rounded-2xl border border-white/5 flex items-center justify-center text-slate-500">
            Loading participants...
          </div>
        }>
          <UserManagement
            initialUsers={users}
            totalCount={stats.totalUsers}
            currentPage={page}
            pageSize={pageSize}
            initialSearch={search}
            initialRole={role}
          />
        </Suspense>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: {
  title: string,
  value: string,
  icon: React.ReactNode,
  description: string
}) {
  return (
    <div className="bg-[#0B0F17] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 shadow-inner">
          {icon}
        </div>
        <div>
          <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-none mb-2">{title}</h3>
          <p className="text-2xl font-bold text-white leading-none tracking-tight">{value}</p>
          <p className="text-slate-600 text-[11px] mt-2 font-medium">{description}</p>
        </div>
      </div>
    </div>
  );
}

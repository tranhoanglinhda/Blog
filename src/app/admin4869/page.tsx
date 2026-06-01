import AdminShell from "@/components/admin/AdminShell";
import DashboardView from "@/components/admin/DashboardView";

export default function Page() {
  return (
    <AdminShell active="dashboard">
      <DashboardView />
    </AdminShell>
  );
}

import AdminShell from "@/components/admin/AdminShell";
import SettingsView from "@/components/admin/SettingsView";

export default function Page() {
  return (
    <AdminShell active="settings">
      <SettingsView />
    </AdminShell>
  );
}

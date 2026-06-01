import AdminShell from "@/components/admin/AdminShell";
import CommentsView from "@/components/admin/CommentsView";

export default function Page() {
  return (
    <AdminShell active="comments">
      <CommentsView />
    </AdminShell>
  );
}

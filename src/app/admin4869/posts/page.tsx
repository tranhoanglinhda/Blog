import AdminShell from "@/components/admin/AdminShell";
import PostsView from "@/components/admin/PostsView";

export default function Page() {
  return (
    <AdminShell active="posts">
      <PostsView />
    </AdminShell>
  );
}

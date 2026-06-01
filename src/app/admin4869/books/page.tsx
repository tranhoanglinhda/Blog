import AdminShell from "@/components/admin/AdminShell";
import BooksView from "@/components/admin/BooksView";

export default function Page() {
  return (
    <AdminShell active="books">
      <BooksView />
    </AdminShell>
  );
}

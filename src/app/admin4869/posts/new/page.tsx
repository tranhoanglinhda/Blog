import AdminShell from "@/components/admin/AdminShell";
import EditorView from "@/components/admin/EditorView";

export default function Page() {
  return (
    <AdminShell active="editor">
      <EditorView />
    </AdminShell>
  );
}

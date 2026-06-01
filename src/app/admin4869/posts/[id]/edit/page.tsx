import AdminShell from "@/components/admin/AdminShell";
import EditorView from "@/components/admin/EditorView";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <AdminShell active="editor">
      <EditorView id={params.id} />
    </AdminShell>
  );
}

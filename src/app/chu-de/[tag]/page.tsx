import PublicShell from "@/components/public/PublicShell";
import TagView from "@/components/public/TagView";

export default function Page({ params }: { params: { tag: string } }) {
  return (
    <PublicShell>
      <TagView slug={decodeURIComponent(params.tag)} />
    </PublicShell>
  );
}

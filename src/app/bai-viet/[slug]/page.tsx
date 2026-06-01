import PublicShell from "@/components/public/PublicShell";
import PostDetailView from "@/components/public/PostDetailView";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <PublicShell>
      <PostDetailView slug={decodeURIComponent(params.slug)} />
    </PublicShell>
  );
}

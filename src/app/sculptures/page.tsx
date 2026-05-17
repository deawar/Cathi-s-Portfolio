import { sanityClient, getImageRefId } from "@/lib/sanity";
import { sculpturesQuery, sculptureSeriesQuery } from "@/lib/queries";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export const metadata = {
  title: "Sculptures — Cathi Warren",
  description: "Browse Cathi Warren's original sculptures.",
};

function toWatermarkedUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  return `/api/image/${getImageRefId(image.asset._ref)}`;
}

export default async function SculpturesPage() {
  const [rawArtworks, categories] = await Promise.all([
    sanityClient.fetch(sculpturesQuery).catch(() => []),
    sanityClient.fetch(sculptureSeriesQuery).catch(() => []),
  ]);

  const artworks = rawArtworks.map((a: Record<string, unknown>) => ({
    ...a,
    watermarkedUrl: toWatermarkedUrl(a.image as { asset?: { _ref?: string } }),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">Sculptures</h1>
      <div className="section-divider" />
      <GalleryGrid artworks={artworks} categories={categories.filter(Boolean)} />
    </div>
  );
}

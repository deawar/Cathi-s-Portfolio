import { sanityClient, getImageRefId } from "@/lib/sanity";
import { stainedGlassQuery, stainedGlassSeriesQuery } from "@/lib/queries";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export const metadata = {
  title: "Stained Glass — Cathi Warren",
  description: "Browse Cathi Warren's original stained glass works.",
};

function toWatermarkedUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  return `/api/image/${getImageRefId(image.asset._ref)}`;
}

export default async function StainedGlassPage() {
  const [rawArtworks, categories] = await Promise.all([
    sanityClient.fetch(stainedGlassQuery).catch(() => []),
    sanityClient.fetch(stainedGlassSeriesQuery).catch(() => []),
  ]);

  const artworks = rawArtworks.map((a: Record<string, unknown>) => ({
    ...a,
    watermarkedUrl: toWatermarkedUrl(a.image as { asset?: { _ref?: string } }),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">Stained Glass</h1>
      <div className="section-divider" />
      <GalleryGrid artworks={artworks} categories={categories.filter(Boolean)} />
    </div>
  );
}

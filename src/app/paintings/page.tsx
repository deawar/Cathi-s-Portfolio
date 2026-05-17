import { sanityClient, getImageRefId } from "@/lib/sanity";
import { paintingsQuery, paintingSeriesQuery } from "@/lib/queries";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export const metadata = {
  title: "Paintings — Cathi Warren",
  description: "Browse Cathi Warren's original oil, acrylic, and watercolor paintings.",
};

function toWatermarkedUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  return `/api/image/${getImageRefId(image.asset._ref)}`;
}

export default async function PaintingsPage() {
  const [rawArtworks, categories] = await Promise.all([
    sanityClient.fetch(paintingsQuery).catch(() => []),
    sanityClient.fetch(paintingSeriesQuery).catch(() => []),
  ]);

  const artworks = rawArtworks.map((a: Record<string, unknown>) => ({
    ...a,
    watermarkedUrl: toWatermarkedUrl(a.image as { asset?: { _ref?: string } }),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">Paintings</h1>
      <div className="section-divider" />
      <GalleryGrid artworks={artworks} categories={categories.filter(Boolean)} />
    </div>
  );
}

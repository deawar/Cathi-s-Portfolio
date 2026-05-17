import { sanityClient, getImageRefId } from "@/lib/sanity";
import { heroArtworksQuery, featuredArtworksQuery, latestBlogPostsQuery } from "@/lib/queries";
import HeroSlideshow from "@/components/HeroSlideshow";
import Link from "next/link";
import Image from "next/image";

function toWatermarkedUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  return `/api/image/${getImageRefId(image.asset._ref)}`;
}

function toSanityUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const fileId = getImageRefId(image.asset._ref);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${fileId}?w=600&q=80`;
}

export const revalidate = 60;

export default async function HomePage() {
  const [heroRaw, featuredRaw, blogRaw] = await Promise.all([
    sanityClient.fetch(heroArtworksQuery).catch(() => []),
    sanityClient.fetch(featuredArtworksQuery).catch(() => []),
    sanityClient.fetch(latestBlogPostsQuery).catch(() => []),
  ]);

  const heroArtworks = (heroRaw as Record<string, unknown>[]).map((a) => ({
    ...a,
    watermarkedUrl: toWatermarkedUrl(a.image as { asset?: { _ref?: string } }),
  }));

  const featured = (featuredRaw as Record<string, unknown>[]).map((a) => ({
    ...a,
    watermarkedUrl: toWatermarkedUrl(a.image as { asset?: { _ref?: string } }),
  }));

  const posts = (blogRaw as Record<string, unknown>[]).map((p) => ({
    ...p,
    imageUrl: toSanityUrl(p.featuredImage as { asset?: { _ref?: string } }),
  }));

  type FeaturedArt = {
    _id: string;
    title: string;
    medium?: string;
    watermarkedUrl: string;
    slug: { current: string };
  };

  type BlogPost = {
    _id: string;
    title: string;
    publishedAt: string;
    excerpt?: string;
    slug: { current: string };
    imageUrl: string;
  };

  return (
    <>
      <HeroSlideshow artworks={heroArtworks as Parameters<typeof HeroSlideshow>[0]["artworks"]} />

      {/* Featured Works */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl text-center">Featured Works</h2>
          <div className="section-divider" />
          <div className="gallery-grid mt-2">
            {(featured as FeaturedArt[]).map((art) => (
              <div key={art._id} className="gallery-card rounded-sm">
                {art.watermarkedUrl && (
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Image
                      src={art.watermarkedUrl}
                      alt={art.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-display text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                    {art.title}
                  </p>
                  {art.medium && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{art.medium}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/paintings" className="btn-outline px-8 py-3 text-xs tracking-widest uppercase inline-block">
              View All Paintings
            </Link>
          </div>
        </section>
      )}

      {/* About + Blog row */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 border-t" style={{ borderColor: "var(--border)" }}>
        {/* About excerpt */}
        <div>
          <h2 className="font-display text-2xl mb-3">About the Artist</h2>
          <div className="section-divider" style={{ margin: "0 0 1.25rem 0" }} />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Cathi Warren is a Texas-based artist whose work spans oil painting, watercolor, and sculpture.
            Drawn to light, texture, and the quiet beauty of everyday scenes, her paintings capture
            moments of warmth and stillness with an expressive hand.
          </p>
          <Link
            href="/about"
            className="inline-block mt-5 text-xs tracking-widest uppercase pb-0.5"
            style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
          >
            Read Full Bio
          </Link>
        </div>

        {/* Latest blog post */}
        <div>
          <h2 className="font-display text-2xl mb-3">Latest from the Studio</h2>
          <div className="section-divider" style={{ margin: "0 0 1.25rem 0" }} />
          {posts.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Studio notes coming soon.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {(posts as BlogPost[]).slice(0, 2).map((post) => (
                <div key={post._id} className="flex gap-3">
                  {post.imageUrl && (
                    <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-sm">
                      <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="64px" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="font-display text-sm hover:opacity-70 transition-opacity"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                href="/blog"
                className="text-xs tracking-widest uppercase pb-0.5 inline-block mt-1"
                style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
              >
                All Studio Notes
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

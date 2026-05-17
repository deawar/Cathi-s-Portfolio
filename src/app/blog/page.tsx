import { sanityClient } from "@/lib/sanity";
import { blogPostsQuery } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { getImageRefId } from "@/lib/sanity";

export const revalidate = 60;

export const metadata = {
  title: "Studio Notes — Cathi Warren",
  description: "Read studio notes, reflections, and behind-the-scenes posts from artist Cathi Warren.",
};

function toSanityUrl(image: { asset?: { _ref?: string } } | null | undefined, width = 600): string {
  if (!image?.asset?._ref) return "";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const fileId = getImageRefId(image.asset._ref);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${fileId}?w=${width}&q=80`;
}

export default async function BlogPage() {
  const rawPosts = await sanityClient.fetch(blogPostsQuery).catch(() => []);

  type Post = {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    excerpt?: string;
    featuredImage?: { asset?: { _ref?: string } };
  };

  const posts: Post[] = rawPosts;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">Studio Notes</h1>
      <div className="section-divider" />

      {posts.length === 0 ? (
        <p className="text-center py-20" style={{ color: "var(--text-secondary)" }}>
          No posts yet — check back soon.
        </p>
      ) : (
        <div className="mt-4">
          {/* Featured first post */}
          {posts[0] && (
            <div
              className="flex flex-col md:flex-row gap-8 mb-12 pb-12 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              {posts[0].featuredImage && (
                <div className="flex-shrink-0 w-full md:w-80 h-56 relative overflow-hidden rounded-sm">
                  <Image
                    src={toSanityUrl(posts[0].featuredImage, 800)}
                    alt={posts[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                  {new Date(posts[0].publishedAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
                <Link href={`/blog/${posts[0].slug.current}`}>
                  <h2 className="font-display text-3xl hover:opacity-70 transition-opacity" style={{ color: "var(--text-primary)" }}>
                    {posts[0].title}
                  </h2>
                </Link>
                {posts[0].excerpt && (
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {posts[0].excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${posts[0].slug.current}`}
                  className="mt-5 text-xs tracking-widest uppercase pb-0.5 inline-block self-start"
                  style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
                >
                  Read More →
                </Link>
              </div>
            </div>
          )}

          {/* Remaining posts grid */}
          {posts.length > 1 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => (
                <article key={post._id}>
                  {post.featuredImage && (
                    <div className="w-full h-44 relative overflow-hidden rounded-sm mb-3">
                      <Image
                        src={toSanityUrl(post.featuredImage, 600)}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </p>
                  <Link href={`/blog/${post.slug.current}`}>
                    <h3 className="font-display text-lg mt-1 hover:opacity-70 transition-opacity" style={{ color: "var(--text-primary)" }}>
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {post.excerpt.slice(0, 120)}…
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="mt-3 text-xs tracking-widest uppercase pb-0.5 inline-block"
                    style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
                  >
                    Read More
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

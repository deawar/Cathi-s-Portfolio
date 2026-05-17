import { sanityClient, getImageRefId } from "@/lib/sanity";
import { blogPostBySlugQuery } from "@/lib/queries";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

function toSanityUrl(image: { asset?: { _ref?: string } } | null | undefined, width = 1200): string {
  if (!image?.asset?._ref) return "";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const fileId = getImageRefId(image.asset._ref);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${fileId}?w=${width}&q=80`;
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = toSanityUrl(value, 1200);
      if (!url) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image src={url} alt={value.caption || ""} fill className="object-contain" />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityClient.fetch(blogPostBySlugQuery, { slug }).catch(() => null);
  if (!post) return {};
  return {
    title: `${post.title} — Cathi Warren`,
    description: post.excerpt || "",
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityClient.fetch(blogPostBySlugQuery, { slug }).catch(() => null);
  if (!post) notFound();

  const heroImageUrl = toSanityUrl(post.featuredImage, 1400);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="text-xs tracking-widest uppercase mb-8 inline-block"
        style={{ color: "var(--text-secondary)" }}
      >
        ← Studio Notes
      </Link>

      <h1 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: "var(--text-primary)" }}>
        {post.title}
      </h1>
      <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        })}
      </p>
      <div className="section-divider" style={{ margin: "1rem 0" }} />

      {heroImageUrl && (
        <div className="relative w-full rounded-sm overflow-hidden mb-8" style={{ aspectRatio: "16/9" }}>
          <Image src={heroImageUrl} alt={post.title} fill className="object-cover" priority sizes="800px" />
        </div>
      )}

      <div className="prose-theme">
        <PortableText value={post.body || []} components={portableTextComponents} />
      </div>
    </article>
  );
}

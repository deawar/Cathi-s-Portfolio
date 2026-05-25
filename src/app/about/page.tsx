import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { sanityClient, getImageRefId } from "@/lib/sanity";
import { artistProfileQuery } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About — Cathi Warren",
  description: "Learn about Georgia artist Cathi Warren — her story, inspiration, and artistic practice.",
};

type Block = { _type: string; _key: string; [key: string]: unknown };

type ArtistProfile = {
  photo?: { asset?: { _ref?: string } };
  photoCaption?: string;
  artistStatement?: Block[];
  biography?: Block[];
  cv?: Block[];
  contactNote?: string;
} | null;

function toSanityUrl(image: { asset?: { _ref?: string } } | null | undefined): string {
  if (!image?.asset?._ref) return "";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const fileId = getImageRefId(image.asset._ref);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${fileId}?w=800&q=85`;
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {children}
      </p>
    ),
  },
};

export default async function AboutPage() {
  const profile: ArtistProfile = await sanityClient
    .fetch(artistProfileQuery)
    .catch(() => null);

  const photoUrl = toSanityUrl(profile?.photo);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">About Cathi Warren</h1>
      <div className="section-divider" />

      <div className="mt-8 grid md:grid-cols-2 gap-12 items-start">
        {/* Photo */}
        <div>
          {photoUrl ? (
            <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden">
              <Image
                src={photoUrl}
                alt="Cathi Warren"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          ) : (
            <div
              className="w-full aspect-[3/4] rounded-sm flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            >
              <div className="text-center text-sm">
                <p className="text-3xl mb-2">🖼</p>
                <p>Artist photo</p>
                <p className="text-xs mt-1">(upload in Sanity Studio → Artist Profile)</p>
              </div>
            </div>
          )}
          {profile?.photoCaption && (
            <p className="mt-2 text-xs text-center" style={{ color: "var(--text-secondary)" }}>
              {profile.photoCaption}
            </p>
          )}
        </div>

        {/* Text content */}
        <div>
          {/* Artist Statement */}
          <h2 className="font-display text-2xl mb-4">Artist Statement</h2>
          <div className="text-sm">
            {profile?.artistStatement?.length ? (
              <PortableText value={profile.artistStatement} components={portableTextComponents} />
            ) : (
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <p>
                  I am drawn to the spaces between things — the light that pools at the edge of a window,
                  the shadow that blooms beneath a flower petal, the weight of silence in a still room.
                  My paintings are an attempt to hold those moments still.
                </p>
                <p>
                  Working primarily in oils and watercolor, I explore landscapes, still life, and the
                  human form. My stained glass extends that language into light and colour — each piece
                  shaped by hand, bearing the marks of making.
                </p>
                <p className="text-xs italic" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
                  (Placeholder — edit in Sanity Studio → Artist Profile)
                </p>
              </div>
            )}
          </div>

          {/* Biography */}
          <div className="mt-8">
            <h3 className="font-display text-xl mb-3">Biography</h3>
            <div className="text-sm">
              {profile?.biography?.length ? (
                <PortableText value={profile.biography} components={portableTextComponents} />
              ) : (
                <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <p>
                    Cathi Warren is a Georgia-based artist with a studio in the Athens area. She has been
                    painting, teaching, and creating stained glass for over two decades, drawing inspiration from her family, landscapes,
                    gardens, and quiet interiors of everyday life.
                  </p>
                  <p>
                    Her work has been exhibited throughout Georgia and collected by private collectors
                    across the country. She teaches workshops and accepts commissions for original paintings.
                  </p>
                  <p className="text-xs italic" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
                    (Placeholder — edit in Sanity Studio → Artist Profile)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CV / Exhibitions — only shown if content exists */}
          {profile?.cv?.length ? (
            <div className="mt-8">
              <h3 className="font-display text-xl mb-3">CV &amp; Exhibitions</h3>
              <div className="text-sm">
                <PortableText value={profile.cv} components={portableTextComponents} />
              </div>
            </div>
          ) : null}

          {/* Contact note */}
          <div className="mt-8">
            <h3 className="font-display text-xl mb-3">Contact &amp; Commissions</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {profile?.contactNote ?? "For inquiries about available work, commissions, or exhibitions, please use the contact form."}{" "}
              <Link href="/contact" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                Contact Cathi →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

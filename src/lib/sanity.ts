import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export function getImageRefId(ref: string): string {
  // "image-abc123-800x600-jpg" → "abc123-800x600.jpg"
  return ref.replace(/^image-/, "").replace(/-(\w+)$/, ".$1");
}

export function getSanityCdnUrl(imageRef: string): string {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const fileId = getImageRefId(imageRef);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${fileId}`;
}

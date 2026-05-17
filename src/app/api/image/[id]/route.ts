import { NextRequest, NextResponse } from "next/server";
import { applyWatermark } from "@/lib/watermark";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || id === "undefined") {
    return new NextResponse("Not found", { status: 404 });
  }

  const cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}`;

  let imageBuffer: Buffer;
  try {
    const res = await fetch(cdnUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }
    const arrayBuf = await res.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuf);
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  try {
    const watermarked = await applyWatermark(imageBuffer);
    return new NextResponse(new Uint8Array(watermarked), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    // Fallback: serve original if watermarking fails
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
}

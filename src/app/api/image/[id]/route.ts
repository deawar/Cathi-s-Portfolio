import { NextRequest, NextResponse } from "next/server";
import { applyWatermark } from "@/lib/watermark";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Sanity image IDs follow the pattern: {hex}-{width}x{height}.{ext}
// e.g. abc1234def5678-800x600.jpg
const VALID_IMAGE_ID = /^[a-f0-9]+-\d+x\d+\.(jpg|jpeg|png|webp|gif|tiff)$/i;

// Simple in-memory rate limiter for image requests
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 120;             // requests per window
const RATE_WINDOW_MS = 60 * 1000;  // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Validate ID format strictly — reject anything that doesn't look like a Sanity image ref
  if (!id || !VALID_IMAGE_ID.test(id)) {
    return new NextResponse("Invalid image ID", { status: 400 });
  }

  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}`;

  let imageBuffer: Buffer;
  try {
    const res = await fetch(cdnUrl, { cache: "no-store" });
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
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
}

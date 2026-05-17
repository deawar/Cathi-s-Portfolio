import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (resets on server restart; good enough for a low-traffic artist site)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;           // max submissions
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

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

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // Origin check — reject cross-origin POST requests
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (origin && siteUrl && origin !== siteUrl) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, subject, message } = body as Record<string, unknown>;

    // Validate types and lengths
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof message !== "string" || !message.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (name.length > 200 || message.length > 10000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const safeSubject = typeof subject === "string" ? subject.slice(0, 300) : "";
    const to = process.env.CONTACT_EMAIL || "cathi@cathiwarren.art";

    // Strip CRLF from any value used in email headers to prevent header injection
    const headerSafe = (s: string) => s.replaceAll("\r", "").replaceAll("\n", " ").trim();

    await resend.emails.send({
      from: "cathiwarren.art <onboarding@resend.dev>",
      to,
      replyTo: email.trim(),
      subject: headerSafe(safeSubject)
        ? `[cathiwarren.art] ${headerSafe(safeSubject)}`
        : `[cathiwarren.art] New message from ${headerSafe(name)}`,
      // Plain text is always safe
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      // HTML uses escaped values to prevent injection
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Subject:</strong> ${escapeHtml(safeSubject) || "(none)"}</p>
        <hr/>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

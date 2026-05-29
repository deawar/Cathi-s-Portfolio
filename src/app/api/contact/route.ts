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

  // Origin check — reject cross-origin POST requests.
  // Normalise both sides so https://cathiwarren.art and
  // https://www.cathiwarren.art are treated as the same origin.
  // Fails closed: if NEXT_PUBLIC_SITE_URL is not set in production, block all requests.
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const normalise = (u: string) =>
    u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").toLowerCase();
  if (siteUrl) {
    if (!origin || normalise(origin) !== normalise(siteUrl)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, website } = body as Record<string, unknown>;

    // Honeypot — bots fill hidden fields, humans don't. Return fake success silently.
    if (typeof website === "string" && website.length > 0) {
      return NextResponse.json({ ok: true });
    }

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
    const to = process.env.CONTACT_EMAIL;
    if (!to) {
      console.error("CONTACT_EMAIL environment variable is not set");
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    // Strip CRLF from any value used in email headers to prevent header injection
    const headerSafe = (s: string) => s.replaceAll("\r", "").replaceAll("\n", " ").trim();

    await resend.emails.send({
      from: "Cathi Warren Art <contact@cathiwarren.art>",
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

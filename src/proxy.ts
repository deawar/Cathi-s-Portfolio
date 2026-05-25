import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Protects /studio with HTTP Basic Auth.
// Set STUDIO_USERNAME and STUDIO_PASSWORD in your environment variables.
export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/studio")) {
    return NextResponse.next();
  }

  const user = process.env.STUDIO_USERNAME;
  const pass = process.env.STUDIO_PASSWORD;

  // If credentials aren't configured, allow access (dev fallback)
  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      // Split on the first colon only — passwords may contain colons (RFC 7617)
      const colonIdx = decoded.indexOf(":");
      if (colonIdx !== -1) {
        const reqUser = decoded.slice(0, colonIdx);
        const reqPass = decoded.slice(colonIdx + 1);
        // Timing-safe comparison prevents brute-force via response latency
        const userMatch =
          reqUser.length === user.length &&
          timingSafeEqual(Buffer.from(reqUser), Buffer.from(user));
        const passMatch =
          reqPass.length === pass.length &&
          timingSafeEqual(Buffer.from(reqPass), Buffer.from(pass));
        if (userMatch && passMatch) {
          return NextResponse.next();
        }
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Cathi Warren Studio"',
    },
  });
}

export const config = {
  matcher: ["/studio/:path*"],
};

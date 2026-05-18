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
      const [reqUser, reqPass] = decoded.split(":");
      if (reqUser === user && reqPass === pass) {
        return NextResponse.next();
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

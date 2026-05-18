import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t mt-20 py-10"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p
            className="font-display text-lg tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            Cathi Warren
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} Cathi Warren. All rights reserved.
          </p>
        </div>

        <nav className="flex items-center gap-6 text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
          <Link href="/paintings" className="hover:opacity-60 transition-opacity">Paintings</Link>
          <Link href="/stained-glass" className="hover:opacity-60 transition-opacity">Stained Glass</Link>
          <Link href="/blog" className="hover:opacity-60 transition-opacity">Blog</Link>
          <Link href="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-60 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-60 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

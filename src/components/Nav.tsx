"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemePicker from "./ThemePicker";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/paintings", label: "Paintings" },
  { href: "/sculptures", label: "Sculptures" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 theme-nav transition-shadow ${scrolled ? "shadow-sm" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            Cathi Warren
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-opacity ${
                  pathname === link.href ? "opacity-100" : "hover:opacity-60 opacity-80"
                }`}
                style={{
                  color: "var(--text-primary)",
                  borderBottom:
                    pathname === link.href
                      ? "1px solid var(--accent)"
                      : "1px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {link.label}
              </Link>
            ))}
            <ThemePicker />
          </nav>

          {/* Mobile: theme picker + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemePicker />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex flex-col gap-1.5 p-1"
              style={{ color: "var(--text-primary)" }}
            >
              <span
                className={`block w-5 h-px transition-transform origin-center ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`}
                style={{ background: "currentColor" }}
              />
              <span
                className={`block w-5 h-px transition-opacity ${menuOpen ? "opacity-0" : ""}`}
                style={{ background: "currentColor" }}
              />
              <span
                className={`block w-5 h-px transition-transform origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                style={{ background: "currentColor" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{ background: "var(--nav-bg)", borderColor: "var(--border)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-widest uppercase py-1"
              style={{
                color:
                  pathname === link.href
                    ? "var(--accent)"
                    : "var(--text-primary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

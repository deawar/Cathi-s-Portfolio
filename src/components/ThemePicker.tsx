"use client";

import { useState, useEffect, useRef } from "react";

const themes = [
  { id: "white", label: "Gallery White", color: "#FAFAFA", text: "#1a1a1a" },
  { id: "cream", label: "Warm Cream", color: "#F5F0E8", text: "#2c1810" },
  { id: "navy", label: "Deep Navy", color: "#1A2332", text: "#e8edf2" },
  { id: "sage", label: "Sage Green", color: "#E8EDE8", text: "#2c3828" },
  { id: "charcoal", label: "Charcoal", color: "#2C2C2C", text: "#e0e0e0" },
  { id: "blush", label: "Blush Rose", color: "#F4E8E4", text: "#3d2420" },
];

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("white");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cw-theme") || "white";
      setActive(saved);
    } catch {}
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectTheme(id: string) {
    setActive(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("cw-theme", id);
    } catch {}
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose color theme"
        title="Choose color theme"
        className="flex items-center gap-1.5 px-2 py-1 rounded-sm transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 0 20c-2.8 0-4-1.5-4-3s1.5-3 1.5-4.5S8 12 6 12A10 10 0 0 1 12 2z" />
        </svg>
        <span className="text-xs tracking-widest uppercase hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 shadow-xl rounded-sm border z-50 py-2"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <p
            className="text-xs tracking-widest uppercase px-4 pb-2 pt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Choose Theme
          </p>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTheme(t.id)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: "var(--text-primary)" }}
            >
              <span
                className="w-5 h-5 rounded-full border flex-shrink-0"
                style={{
                  background: t.color,
                  borderColor: active === t.id ? "var(--accent)" : "var(--border)",
                  boxShadow: active === t.id ? "0 0 0 2px var(--accent)" : "none",
                }}
              />
              <span>{t.label}</span>
              {active === t.id && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

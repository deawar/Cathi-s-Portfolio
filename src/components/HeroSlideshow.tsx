"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroArtwork {
  _id: string;
  title: string;
  slug: { current: string };
  medium?: string;
  artworkType: string;
  image: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
  watermarkedUrl: string;
}

interface Props {
  artworks: HeroArtwork[];
}

export default function HeroSlideshow({ artworks }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % artworks.length);
  }, [artworks.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  useEffect(() => {
    if (artworks.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, artworks.length]);

  if (!artworks.length) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: "70vh", background: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <h1
            className="font-display text-5xl md:text-7xl mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Cathi Warren
          </h1>
          <div className="section-divider" />
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Original Paintings &amp; Sculptures
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/paintings" className="btn-accent px-6 py-3 text-xs tracking-widest uppercase">
              View Paintings
            </Link>
            <Link href="/sculptures" className="btn-outline px-6 py-3 text-xs tracking-widest uppercase">
              View Sculptures
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const art = artworks[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "75vh", minHeight: "480px" }}>
      {artworks.map((a, i) => (
        <div
          key={a._id}
          className="hero-slide"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
        >
          <Image
            src={a.watermarkedUrl}
            alt={a.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
        </div>
      ))}

      {/* Caption */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white pointer-events-none">
        <p className="font-display text-3xl md:text-5xl drop-shadow-lg">{art.title}</p>
        {art.medium && (
          <p className="mt-2 text-xs tracking-widest uppercase opacity-80">{art.medium}</p>
        )}
      </div>

      {/* Arrows */}
      {artworks.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {artworks.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

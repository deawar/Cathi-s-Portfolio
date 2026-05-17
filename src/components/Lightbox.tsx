"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface ArtworkItem {
  _id: string;
  title: string;
  slug: { current: string };
  medium?: string;
  dimensions?: string;
  year?: number;
  series?: string;
  available?: boolean;
  watermarkedUrl: string;
}

interface Props {
  artworks: ArtworkItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ artworks, currentIndex, onClose, onPrev, onNext }: Props) {
  const art = artworks[currentIndex];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!art) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl leading-none"
        >
          ✕
        </button>

        {/* Prev */}
        {artworks.length > 1 && (
          <button
            onClick={onPrev}
            aria-label="Previous artwork"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/70 hover:text-white text-4xl leading-none"
          >
            ‹
          </button>
        )}

        {/* Image */}
        <div className="flex-1 relative" style={{ maxHeight: "70vh" }}>
          <Image
            src={art.watermarkedUrl}
            alt={art.title}
            width={900}
            height={700}
            className="object-contain w-full"
            style={{ maxHeight: "70vh" }}
          />
        </div>

        {/* Details panel */}
        <div
          className="w-full md:w-64 flex-shrink-0 rounded-sm p-6"
          style={{ background: "var(--card-bg)", color: "var(--text-primary)" }}
        >
          <h2 className="font-display text-xl mb-3">{art.title}</h2>
          <div className="section-divider" style={{ margin: "0 0 1rem 0" }} />
          <dl className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
            {art.medium && (
              <>
                <dt className="text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Medium</dt>
                <dd className="mb-2">{art.medium}</dd>
              </>
            )}
            {art.dimensions && (
              <>
                <dt className="text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Size</dt>
                <dd className="mb-2">{art.dimensions}</dd>
              </>
            )}
            {art.year && (
              <>
                <dt className="text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Year</dt>
                <dd className="mb-2">{art.year}</dd>
              </>
            )}
            {art.series && (
              <>
                <dt className="text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Series</dt>
                <dd className="mb-2">{art.series}</dd>
              </>
            )}
          </dl>
          {art.available !== false && (
            <Link
              href={`/contact?artwork=${encodeURIComponent(art.title)}`}
              className="btn-accent mt-6 block text-center px-4 py-2.5 text-xs tracking-widest uppercase"
            >
              Inquire About This Piece
            </Link>
          )}
          {art.available === false && (
            <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
              Not Available
            </p>
          )}
        </div>

        {/* Next */}
        {artworks.length > 1 && (
          <button
            onClick={onNext}
            aria-label="Next artwork"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/70 hover:text-white text-4xl leading-none"
          >
            ›
          </button>
        )}

        {/* Mobile prev/next */}
        {artworks.length > 1 && (
          <div className="flex gap-4 md:hidden">
            <button onClick={onPrev} className="text-white/70 hover:text-white text-3xl">‹ Prev</button>
            <button onClick={onNext} className="text-white/70 hover:text-white text-3xl">Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
}

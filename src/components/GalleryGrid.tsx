"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

interface ArtworkItem {
  _id: string;
  title: string;
  slug: { current: string };
  medium?: string;
  dimensions?: string;
  year?: number;
  series?: string;
  available?: boolean;
  price?: number;
  watermarkedUrl: string;
}

interface Props {
  artworks: ArtworkItem[];
  categories: string[];
}

const PAGE_SIZE = 12;

export default function GalleryGrid({ artworks, categories }: Props) {
  const [filter, setFilter] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return artworks;
    return artworks.filter((a) => a.series === filter || a.medium?.includes(filter));
  }, [artworks, filter]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function openLightbox(indexInShown: number) {
    // Find the real index in filtered array
    setLightboxIndex(indexInShown);
  }

  return (
    <>
      {/* Filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setVisible(PAGE_SIZE); }}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border rounded-sm transition-all ${
                filter === cat ? "btn-accent border-transparent" : "btn-outline"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {shown.length === 0 ? (
        <p className="text-center py-20" style={{ color: "var(--text-secondary)" }}>
          No artworks in this category yet.
        </p>
      ) : (
        <div className="gallery-grid">
          {shown.map((art, i) => (
            <div
              key={art._id}
              className="gallery-card rounded-sm"
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(i)}
              aria-label={`View ${art.title}`}
            >
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ aspectRatio: "4/3", background: "var(--bg-secondary)" }}
              >
                <Image
                  src={art.watermarkedUrl}
                  alt={art.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div
                  className="absolute inset-0 flex items-end opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
                >
                  <p className="text-white text-xs tracking-widest uppercase p-3">View Details</p>
                </div>
              </div>
              <div className="p-3">
                <p className="font-display text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {art.title}
                </p>
                {(art.medium || art.dimensions) && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {[art.medium, art.dimensions].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="btn-outline px-8 py-3 text-xs tracking-widest uppercase"
          >
            Load More
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          artworks={shown}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i! - 1 + shown.length) % shown.length)}
          onNext={() => setLightboxIndex((i) => (i! + 1) % shown.length)}
        />
      )}
    </>
  );
}

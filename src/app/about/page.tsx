import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Cathi Warren",
  description: "Learn about Texas artist Cathi Warren — her story, inspiration, and artistic practice.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">About Cathi Warren</h1>
      <div className="section-divider" />

      <div className="mt-8 grid md:grid-cols-2 gap-12 items-start">
        {/* Photo placeholder */}
        <div
          className="w-full aspect-[3/4] rounded-sm flex items-center justify-center"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          <div className="text-center text-sm">
            <p className="text-3xl mb-2">🖼</p>
            <p>Artist photo</p>
            <p className="text-xs">(upload in Sanity Studio)</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="font-display text-2xl mb-4">Artist Statement</h2>
          <div className="prose-theme space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <p>
              I am drawn to the spaces between things — the light that pools at the edge of a window,
              the shadow that blooms beneath a flower petal, the weight of silence in a still room.
              My paintings are an attempt to hold those moments still.
            </p>
            <p>
              Working primarily in oils and watercolor, I explore landscapes, still life, and the
              human form. My sculptures extend that language into three dimensions — bronze and clay
              shaped by hand, bearing the marks of making.
            </p>
            <p>
              I believe in the intimacy of handmade things. Each piece carries the time it took,
              the decisions made and unmade, the accidents that became intentions.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-xl mb-3">Biography</h3>
            <div className="prose-theme space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                Cathi Warren is a Texas-based artist with a studio in the Houston area. She has been
                painting and sculpting for over two decades, drawing inspiration from the landscapes,
                gardens, and quiet interiors of everyday life.
              </p>
              <p>
                Her work has been exhibited throughout Texas and collected by private collectors
                across the country. She teaches workshops and accepts commissions for original paintings.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-xl mb-3">Contact & Commissions</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              For inquiries about available work, commissions, or exhibitions, please use the{" "}
              <a href="/contact" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                contact form
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

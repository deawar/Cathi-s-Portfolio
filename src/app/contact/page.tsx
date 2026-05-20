"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactForm() {
  const searchParams = useSearchParams();
  // Cap the query param length so a crafted URL can't pre-fill huge text
  const artworkName = searchParams.get("artwork")?.slice(0, 200) ?? null;

  const honeypotRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: artworkName ? `Inquiry: ${artworkName}` : "",
    message: artworkName ? `I am interested in "${artworkName}". Please let me know if it is available and the price.\n\n` : "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypotRef.current?.value ?? "" }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-16">
        <p className="font-display text-2xl" style={{ color: "var(--text-primary)" }}>
          Thank you!
        </p>
        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          Your message has been sent. I&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            required
            maxLength={200}
            value={form.name}
            onChange={handleChange}
            className="theme-input w-full border rounded-sm px-4 py-2.5 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="theme-input w-full border rounded-sm px-4 py-2.5 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Subject
        </label>
        <input
          type="text"
          name="subject"
          maxLength={300}
          value={form.subject}
          onChange={handleChange}
          className="theme-input w-full border rounded-sm px-4 py-2.5 text-sm"
          style={{ borderColor: "var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
        />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={10000}
          value={form.message}
          onChange={handleChange}
          className="theme-input w-full border rounded-sm px-4 py-2.5 text-sm resize-y"
          style={{ borderColor: "var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
        />
      </div>
      {/* Honeypot — hidden from humans, filled by bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <input type="text" name="website" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please email directly at{" "}
          <a href="mailto:cathi@cathiwarren.art" className="underline">cathi@cathiwarren.art</a>.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-accent px-8 py-3 text-xs tracking-widest uppercase disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-center">Contact</h1>
      <div className="section-divider" />
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
        For inquiries about available work, commissions, or exhibitions,
        please use the form below or email{" "}
        <a href="mailto:cathi@cathiwarren.art" style={{ color: "var(--accent)" }}>
          cathi@cathiwarren.art
        </a>.
      </p>
      <Suspense fallback={<div />}>
        <ContactForm />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cathi Warren — Artist",
  description:
    "Original paintings and stained glass by Georgia artist Cathi Warren. Browse the gallery, read studio notes, and inquire about available works.",
  openGraph: {
    title: "Cathi Warren — Artist",
    description: "Original paintings and stained glass by Georgia artist Cathi Warren.",
    url: "https://cathiwarren.art",
    siteName: "Cathi Warren Art",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Restore theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cw-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col theme-bg theme-text" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

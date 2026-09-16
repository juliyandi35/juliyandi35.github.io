import type { Metadata } from "next";
import localFont from "next/font/local";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";
import { identity } from "@/lib/content";

// Self-hosted (not next/font/google): the Google Fonts CSS/CDN fetch that
// next/font/google performs at build/dev time is a real point of failure on
// networks that block fonts.googleapis.com / fonts.gstatic.com (corporate
// proxies, some VPNs, offline builds) — and on some Next.js 14.2.x versions
// that failure surfaces as an opaque "at stringify" crash with no readable
// message rather than a clear font-fetch error. Shipping the woff2 files
// directly under public/fonts removes that network dependency entirely, with
// the same latin-subset glyphs, the same weights, and the same CSS variable
// names, so nothing else in the app needs to change.
const spaceGrotesk = localFont({
  src: "../public/fonts/space-grotesk-variable.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "../public/fonts/ibm-plex-mono-500.woff2", weight: "500" },
    { path: "../public/fonts/ibm-plex-mono-600.woff2", weight: "600" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = "https://juliyandi35.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${identity.name} — Portfolio`,
    template: `%s — ${identity.name}`,
  },
  description: identity.heroSubtext,
  keywords: [
    "Juli Yandi Rahman",
    "statistical research",
    "data science portfolio",
    "R programming",
    "econometrics",
    "machine learning",
    "public sector data systems",
  ],
  authors: [{ name: identity.name, url: identity.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${identity.name} — Portfolio`,
    description: identity.heroSubtext,
    siteName: `${identity.name} Portfolio`,
    images: [{ url: "/images/social-preview.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — Portfolio`,
    description: identity.heroSubtext,
    images: ["/images/social-preview.jpg"],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: "Statistical Research Consultant & Data Systems Practitioner",
  url: siteUrl,
  sameAs: [identity.github, identity.linkedin],
  email: `mailto:${identity.email}`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}

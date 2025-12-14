import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { draftMode } from "next/headers";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Sidebar from "@/components/navigation/Sidebar";
import { VisualEditing } from "@/components/VisualEditing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["photography", "videography", "portfolio", "professional photographer", "Boshnovart", "Novart Films"],
  authors: [{ name: "Boshnovart" }],
  creator: "Boshnovart",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@boshnovart",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const draft = await draftMode();
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null);
  
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} style={{ colorScheme: 'light' }}>
      <body className="font-inter antialiased bg-white text-black min-h-screen" style={{ background: '#ffffff', color: '#000000' }} suppressHydrationWarning>
        <div className="flex min-h-screen bg-white">
          <Sidebar settings={settings} />
          <main className="flex-1 md:ml-48 pt-14 md:pt-0 bg-white">
            {children}
          </main>
        </div>
        {draft.isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}

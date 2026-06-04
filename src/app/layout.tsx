import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/seo";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "NQ Propiedades | Casas en Pereira",
    template: "%s | NQ Propiedades",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "NQ Propiedades | Casas en Pereira",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NQ Propiedades | Casas en Pereira",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

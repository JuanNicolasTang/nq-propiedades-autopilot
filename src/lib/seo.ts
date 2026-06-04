import type { Metadata, MetadataRoute } from "next";

export const siteConfig = {
  name: "NQ Propiedades",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Propiedades en Pereira y el Eje Cafetero con informacion clara, privacidad responsable y contacto iniciado por compradores reales.",
};

export const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/propiedades/santa-clara-de-las-villas", priority: 0.95 },
  { path: "/zonas/pereira", priority: 0.8 },
  { path: "/zonas/santa-clara-de-las-villas-pereira", priority: 0.85 },
  { path: "/zonas/villa-olimpica-pereira", priority: 0.75 },
  { path: "/guias/comprar-casa-en-pereira", priority: 0.8 },
  { path: "/guias/comprar-casa-en-conjunto-cerrado-pereira", priority: 0.8 },
];

export function absoluteUrl(path = "/") {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function createPageMetadata({
  description,
  path,
  title,
}: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "es_CO",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function sitemapEntry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    areaServed: [
      {
        "@type": "City",
        name: "Pereira",
      },
      {
        "@type": "AdministrativeArea",
        name: "Risaralda",
      },
    ],
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: "es-CO",
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

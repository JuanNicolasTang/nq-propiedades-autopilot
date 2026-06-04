import type { Metadata, MetadataRoute } from "next";

const PRODUCTION_SITE_URL = "https://condominiospereira.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredUrl || PRODUCTION_SITE_URL;
  const normalizedUrl = siteUrl.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1|\[::1\]/i.test(normalizedUrl)) {
    return PRODUCTION_SITE_URL;
  }

  return normalizedUrl || PRODUCTION_SITE_URL;
}

export const siteConfig = {
  name: "NQ Propiedades",
  url: getSiteUrl(),
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
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function createPageMetadata({
  description,
  image,
  path,
  title,
}: {
  description: string;
  image?: string | null;
  path: string;
  title: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : null;

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
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
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

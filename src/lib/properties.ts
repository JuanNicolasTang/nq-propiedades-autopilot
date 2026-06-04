export type PropertyImage = {
  src: string;
  altText: string;
  caption?: string;
};

export type PropertyImagePrivacyAudit = {
  reviewed: number;
  approved: number;
  excluded: Array<{
    label: string;
    reason: string;
  }>;
  note: string;
};

export type Property = {
  slug: string;
  title: string;
  shortTitle: string;
  location: string;
  priceCop: number;
  areaM2: number;
  strata: number;
  type: string;
  summary: string;
  highlights: string[];
  amenities: string[];
  seoDescription: string;
  heroImage: PropertyImage | null;
  galleryImages: PropertyImage[];
  openGraphImage: PropertyImage | null;
  commercialKitPath: string;
  imagePrivacyAudit: PropertyImagePrivacyAudit;
};

export const properties: Property[] = [
  {
    slug: "santa-clara-de-las-villas",
    title: "Casa en Santa Clara de las Villas",
    shortTitle: "Santa Clara de las Villas",
    location: "Santa Clara de las Villas, Pereira, Risaralda",
    priceCop: 660000000,
    areaM2: 155.66,
    strata: 5,
    type: "Casa de tres niveles en conjunto cerrado",
    summary:
      "Una casa familiar en conjunto cerrado para compradores que buscan zonas sociales completas, privacidad y acceso a un sector residencial consolidado de Pereira.",
    highlights: [
      "Area aproximada de 155.66 m2",
      "Conjunto cerrado con vigilancia 24 horas",
      "Zonas sociales para rutina familiar y visitas",
      "Ubicacion publica aproximada en Santa Clara de las Villas",
    ],
    amenities: [
      "Piscina",
      "Sauna",
      "Turco",
      "Jacuzzi",
      "Gimnasio",
      "Salon social",
      "Canchas",
      "Zonas verdes",
    ],
    seoDescription:
      "Casa de tres niveles en Santa Clara de las Villas, Pereira, con area aproximada de 155.66 m2, estrato 5 y zonas sociales en conjunto cerrado.",
    heroImage: null,
    galleryImages: [],
    openGraphImage: {
      src: "/images/properties/santa-clara-de-las-villas/og-comercial-seguro.webp",
      altText:
        "Imagen comercial segura de NQ Propiedades para casa en Santa Clara de las Villas, Pereira",
      caption: "Imagen comercial segura sin direccion exacta ni datos privados.",
    },
    commercialKitPath: "/api/admin/properties/santa-clara-de-las-villas/pdf",
    imagePrivacyAudit: {
      reviewed: 14,
      approved: 0,
      excluded: [
        {
          label: "WhatsApp Image 2026-06-03 at 10.56.27 AM.jpeg",
          reason: "Documento de avaluo con valores, descripcion tecnica y datos privados.",
        },
        {
          label: "WhatsApp Image 2026-06-03 at 10.56.28 AM.jpeg y variantes",
          reason: "Mapas, localizacion, reglamentacion y documentos con informacion sensible.",
        },
        {
          label: "WhatsApp Image 2026-06-03 at 10.56.29 AM.jpeg y variantes",
          reason: "Caracteristicas de construccion, acabados, tablas y contenido documental privado.",
        },
        {
          label: "WhatsApp Image 2026-06-03 at 10.56.30 AM.jpeg y variantes",
          reason: "Valor total de avaluo, clausulas, identificacion geografica y datos juridicos.",
        },
      ],
      note:
        "No se aprobaron fotos reales para publicacion. La galeria queda preparada para imagenes futuras auditadas y optimizadas.",
    },
  },
];

export const featuredProperty = properties[0];

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}

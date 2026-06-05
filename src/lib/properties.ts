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
  youtubeVideoUrl: string | null;
  youtubeEmbedUrl: string | null;
  imagePrivacyAudit: PropertyImagePrivacyAudit;
};

const santaClaraImageBase = "/images/properties/santa-clara-de-las-villas";

const santaClaraAltTexts = [
  "Interior de casa en conjunto cerrado en Pereira",
  "Espacio social de casa en Santa Clara de las Villas",
  "Zona interior iluminada de casa en Pereira",
  "Terraza cubierta en casa de conjunto cerrado",
  "Ambiente interior de casa en Pereira",
  "Espacio amplio en casa de conjunto cerrado",
  "Zona privada iluminada de casa en Pereira",
  "Interior con luz natural en casa de Pereira",
  "Espacio funcional de casa en conjunto cerrado",
  "Circulacion interior de casa en Pereira",
  "Ambiente social interior de casa en Pereira",
];

const santaClaraGalleryImages = santaClaraAltTexts.map((altText, index) => ({
  src: `${santaClaraImageBase}/galeria-${String(index + 1).padStart(2, "0")}.webp`,
  altText,
}));

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
    heroImage: santaClaraGalleryImages[0],
    galleryImages: santaClaraGalleryImages,
    openGraphImage: {
      src: `${santaClaraImageBase}/galeria-01.webp`,
      altText: "Interior de casa en conjunto cerrado en Pereira",
    },
    commercialKitPath: "/api/admin/properties/santa-clara-de-las-villas/pdf",
    youtubeVideoUrl: "https://youtu.be/W2I0LfH1x6Y?si=RHtf3X8qu_Ci3KVb",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/W2I0LfH1x6Y",
    imagePrivacyAudit: {
      reviewed: 11,
      approved: 11,
      excluded: [],
      note:
        "Las imagenes del ZIP santa_clara_selected_webp.zip fueron aprobadas visualmente y renombradas de forma neutra.",
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

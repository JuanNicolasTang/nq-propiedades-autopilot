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

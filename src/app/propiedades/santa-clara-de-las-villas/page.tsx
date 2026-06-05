import type { Metadata } from "next";
import { ArrowLeft, Dumbbell, Home, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { LeadForm } from "@/components/LeadForm";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyHeroImage } from "@/components/PropertyHeroImage";
import { PropertyVideo } from "@/components/PropertyVideo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { WhatsAppButton, WhatsAppFallbackNote } from "@/components/WhatsAppButton";
import { featuredProperty, formatCop } from "@/lib/properties";
import { absoluteUrl, createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${featuredProperty.title} en Pereira`,
  description: featuredProperty.seoDescription,
  image: featuredProperty.openGraphImage?.src,
  path: "/propiedades/santa-clara-de-las-villas",
});

const propertyFaqs: FaqItem[] = [
  {
    question: "Donde esta ubicada publicamente la casa?",
    answer:
      "La ubicacion publica permitida es Santa Clara de las Villas, Pereira, Risaralda. Por privacidad no se publica direccion exacta ni coordenadas.",
  },
  {
    question: "Que datos de la propiedad se pueden consultar en esta pagina?",
    answer:
      "Se muestra informacion comercial permitida: tipo de casa, area aproximada, estrato, zonas sociales, ubicacion aproximada y precio inicial sugerido.",
  },
  {
    question: "Como puedo pedir mas informacion?",
    answer:
      "Puedes dejar tus datos en el formulario o abrir WhatsApp manualmente. El contacto debe ser iniciado por una persona interesada.",
  },
  {
    question: "El precio publicado es el precio minimo aceptado?",
    answer:
      "No. El valor publicado es una referencia comercial inicial para compradores interesados; no se publica precio minimo aceptado.",
  },
];

const propertyJsonLd = {
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  name: featuredProperty.title,
  description: featuredProperty.seoDescription,
  url: absoluteUrl("/propiedades/santa-clara-de-las-villas"),
  image: featuredProperty.openGraphImage
    ? absoluteUrl(featuredProperty.openGraphImage.src)
    : undefined,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pereira",
    addressRegion: "Risaralda",
    addressCountry: "CO",
  },
  floorSize: {
    "@type": "QuantitativeValue",
    value: featuredProperty.areaM2,
    unitCode: "MTK",
  },
  amenityFeature: featuredProperty.amenities.map((amenity) => ({
    "@type": "LocationFeatureSpecification",
    name: amenity,
  })),
  offers: {
    "@type": "Offer",
    price: featuredProperty.priceCop,
    priceCurrency: "COP",
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/propiedades/santa-clara-de-las-villas"),
  },
};

export default function SantaClaraPropertyPage() {
  return (
    <main>
      <SeoJsonLd data={[propertyJsonLd, faqJsonLd(propertyFaqs)]} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-14 lg:pt-10">
        <div>
          <Link
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition hover:text-ink"
            href="/"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Volver
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Casa disponible en Pereira
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.03] text-ink sm:text-6xl">
            {featuredProperty.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
            {featuredProperty.summary}
          </p>
          <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              ["Precio", formatCop(featuredProperty.priceCop)],
              ["Area", `${featuredProperty.areaM2} m2 aprox.`],
              ["Estrato", `${featuredProperty.strata}`],
            ].map(([label, value]) => (
              <div className="rounded-soft border border-ink/10 bg-white p-3" key={label}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{label}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink focus:outline-none focus:ring-2 focus:ring-night focus:ring-offset-2"
              href="#lead-form"
            >
              Solicitar visita o informacion
            </a>
            <WhatsAppButton property={featuredProperty} />
          </div>
          <WhatsAppFallbackNote />
        </div>
        <PropertyHeroImage property={featuredProperty} />
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Home, label: "Tipo", value: featuredProperty.type },
            { icon: Sparkles, label: "Area aprox.", value: `${featuredProperty.areaM2} m2` },
            { icon: ShieldCheck, label: "Estrato", value: `${featuredProperty.strata}` },
            { icon: MapPin, label: "Ubicacion", value: featuredProperty.location },
          ].map((item) => (
            <div key={item.label} className="rounded-soft bg-paper p-4">
              <item.icon aria-hidden="true" className="text-jade" size={20} />
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-moss">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-5 text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <PropertyGallery property={featuredProperty} />
      <PropertyVideo property={featuredProperty} />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
              Precio sugerido
            </p>
            <p className="mt-3 font-serif text-4xl font-semibold text-ink">
              {formatCop(featuredProperty.priceCop)}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/64">
              Valor inicial de referencia para compradores interesados. La conversacion
              comercial se maneja por canales autorizados.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">
              Lo que puedes validar
            </h2>
            <div className="mt-5 grid gap-3">
              {featuredProperty.highlights.map((highlight) => (
                <div
                  className="flex items-start gap-3 rounded-soft border border-ink/10 bg-white p-4"
                  key={highlight}
                >
                  <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={18} />
                  <p className="text-sm leading-6 text-ink/72">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">Zonas sociales</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {featuredProperty.amenities.map((amenity) => (
                <span
                  className="inline-flex items-center gap-2 rounded-soft border border-ink/10 bg-cloud px-3 py-2 text-sm font-semibold text-ink"
                  key={amenity}
                >
                  <Dumbbell aria-hidden="true" size={15} />
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <LeadForm propertySlug={featuredProperty.slug} propertyTitle={featuredProperty.title} />
      </section>

      <FaqSection
        faqs={propertyFaqs}
        title="Respuestas claras antes de solicitar informacion"
      />

      <InternalLinks
        links={[
          {
            href: "/zonas/santa-clara-de-las-villas-pereira",
            label: "Zona Santa Clara",
            description: "Contexto local del sector usando solo ubicacion aproximada.",
          },
          {
            href: "/zonas/pereira",
            label: "Pereira",
            description: "Guia de ciudad para orientar una busqueda residencial.",
          },
          {
            href: "/guias/comprar-casa-en-conjunto-cerrado-pereira",
            label: "Conjunto cerrado",
            description: "Preguntas clave antes de comprar una casa en conjunto cerrado.",
          },
        ]}
        title="Mas contexto para comparar antes de visitar"
      />
    </main>
  );
}

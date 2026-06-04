import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { InternalLinks } from "@/components/InternalLinks";
import { PropertyVisual } from "@/components/PropertyVisual";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { WhatsAppButton, WhatsAppFallbackNote } from "@/components/WhatsAppButton";
import { featuredProperty, formatCop } from "@/lib/properties";
import { createPageMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "NQ Propiedades | Casas en Pereira",
  description:
    "Encuentra propiedades en Pereira con informacion clara, ubicacion aproximada y contacto iniciado por compradores reales.",
  path: "/",
});

export default function HomePage() {
  return (
    <main>
      <SeoJsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-20 lg:pt-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Pereira y Eje Cafetero
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            NQ Propiedades
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
            Una web inmobiliaria enfocada en compradores reales: informacion clara,
            privacidad responsable y contacto iniciado por personas interesadas.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink focus:outline-none focus:ring-2 focus:ring-night focus:ring-offset-2"
              href="/propiedades/santa-clara-de-las-villas"
            >
              Ver propiedad destacada
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <WhatsAppButton property={featuredProperty} />
          </div>
          <WhatsAppFallbackNote />
        </div>
        <PropertyVisual />
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            ["Propiedad inicial", featuredProperty.shortTitle],
            ["Precio sugerido", formatCop(featuredProperty.priceCop)],
            ["Ubicacion publica", featuredProperty.location],
          ].map(([label, value]) => (
            <div key={label} className="rounded-soft border border-ink/10 bg-paper p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">{label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
              Fase 1
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Captacion sin atajos ni datos sensibles.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Privacidad",
                text: "Solo se publica ubicacion aproximada y datos comerciales permitidos.",
              },
              {
                icon: CheckCircle2,
                title: "Permiso",
                text: "El contacto nace por formulario o WhatsApp iniciado por el comprador.",
              },
              {
                icon: MapPin,
                title: "Local",
                text: "Contenido pensado para Pereira y busquedas reales por sector.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-soft border border-ink/10 bg-white p-5">
                <item.icon aria-hidden="true" className="text-jade" size={22} />
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/68">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InternalLinks
        links={[
          {
            href: "/zonas/pereira",
            label: "Vivir en Pereira",
            description: "Una guia local para orientar la busqueda por ciudad y estilo de vida.",
          },
          {
            href: "/zonas/santa-clara-de-las-villas-pereira",
            label: "Santa Clara de las Villas",
            description: "Contexto del sector con enlaces a la propiedad destacada.",
          },
          {
            href: "/guias/comprar-casa-en-pereira",
            label: "Comprar casa en Pereira",
            description: "Preguntas utiles antes de solicitar informacion o agendar una visita.",
          },
        ]}
        title="Explora zonas y guias para comprar con mas contexto"
      />
    </main>
  );
}

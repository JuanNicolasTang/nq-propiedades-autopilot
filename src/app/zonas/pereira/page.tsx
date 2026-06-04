import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { InternalLinks } from "@/components/InternalLinks";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { featuredProperty } from "@/lib/properties";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Casas en Pereira: guia de zonas y busqueda",
  description:
    "Guia local para orientar la busqueda de casa en Pereira con criterios claros, privacidad responsable y enlaces a propiedades disponibles.",
  path: "/zonas/pereira",
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Casas en Pereira",
  url: absoluteUrl("/zonas/pereira"),
  about: {
    "@type": "City",
    name: "Pereira",
  },
  inLanguage: "es-CO",
};

export default function PereiraZonePage() {
  return (
    <main>
      <SeoJsonLd data={pageJsonLd} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Guia GEO
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Casas en Pereira
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Pereira combina sectores residenciales, servicios urbanos y acceso a zonas
            de interes del Eje Cafetero. Esta guia ayuda a ordenar la busqueda sin
            inventar datos de mercado ni publicar informacion privada de propiedades.
          </p>
          <div className="mt-7">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
              href="/propiedades/santa-clara-de-las-villas"
            >
              Ver propiedad destacada
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Ubicacion aproximada",
              text: "Para proteger privacidad, las paginas publicas usan sectores y ciudad, no direcciones exactas.",
            },
            {
              icon: CheckCircle2,
              title: "Comparacion responsable",
              text: "Revisa tipo de propiedad, zonas sociales, presupuesto, tiempos de compra y forma de pago.",
            },
            {
              icon: ShieldCheck,
              title: "Contacto con permiso",
              text: "Los canales de contacto son formulario y WhatsApp abierto manualmente por el interesado.",
            },
          ].map((item) => (
            <article className="rounded-soft border border-ink/10 bg-paper p-5" key={item.title}>
              <item.icon aria-hidden="true" className="text-jade" size={22} />
              <h2 className="mt-4 text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
              Criterios utiles
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Como leer una oportunidad residencial en Pereira
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              "Define si buscas casa independiente, casa en conjunto cerrado o apartamento antes de comparar precio.",
              "Valida areas aproximadas, estrato, administracion, zonas sociales y facilidad para agendar visita.",
              "Prioriza informacion verificable y evita decisiones basadas en promesas de valorizacion.",
              `La propiedad destacada actual es ${featuredProperty.shortTitle}, con ubicacion publica aproximada en Pereira.`,
            ].map((text) => (
              <p className="rounded-soft border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/72" key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <InternalLinks
        links={[
          {
            href: "/zonas/santa-clara-de-las-villas-pereira",
            label: "Santa Clara de las Villas",
            description: "Sector de la propiedad destacada con informacion publica aproximada.",
          },
          {
            href: "/zonas/villa-olimpica-pereira",
            label: "Villa Olimpica",
            description: "Referencia cercana para orientar busquedas residenciales en Pereira.",
          },
          {
            href: "/guias/comprar-casa-en-pereira",
            label: "Guia de compra",
            description: "Preguntas frecuentes para compradores de casa en Pereira.",
          },
        ]}
        title="Sigue explorando Pereira con contexto"
      />
    </main>
  );
}

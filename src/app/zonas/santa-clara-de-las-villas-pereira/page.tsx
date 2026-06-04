import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, MapPin, ShieldCheck } from "lucide-react";
import { InternalLinks } from "@/components/InternalLinks";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { featuredProperty, formatCop } from "@/lib/properties";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Santa Clara de las Villas Pereira: casa en conjunto cerrado",
  description:
    "Informacion publica y responsable sobre Santa Clara de las Villas en Pereira, con enlace a una casa destacada en conjunto cerrado.",
  path: "/zonas/santa-clara-de-las-villas-pereira",
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Santa Clara de las Villas Pereira",
  url: absoluteUrl("/zonas/santa-clara-de-las-villas-pereira"),
  about: {
    "@type": "Place",
    name: "Santa Clara de las Villas, Pereira, Risaralda",
  },
  inLanguage: "es-CO",
};

export default function SantaClaraZonePage() {
  return (
    <main>
      <SeoJsonLd data={pageJsonLd} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Zona destacada
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Santa Clara de las Villas, Pereira
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Una referencia residencial para compradores que buscan casa en conjunto
            cerrado en Pereira. La informacion publica se mantiene aproximada y no
            revela direccion exacta ni datos legales privados.
          </p>
          <div className="mt-7">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
              href="/propiedades/santa-clara-de-las-villas"
            >
              Ver casa disponible
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
        <article className="rounded-soft border border-ink/10 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
            Propiedad relacionada
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">
            {featuredProperty.title}
          </h2>
          <div className="mt-5 grid gap-3">
            {[
              { icon: Home, label: featuredProperty.type },
              { icon: CheckCircle2, label: `Area aproximada ${featuredProperty.areaM2} m2` },
              { icon: ShieldCheck, label: `Estrato ${featuredProperty.strata}` },
              { icon: MapPin, label: featuredProperty.location },
            ].map((item) => (
              <div className="flex items-start gap-3 rounded-soft bg-paper p-3" key={item.label}>
                <item.icon aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={18} />
                <p className="text-sm font-semibold leading-6 text-ink/72">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-ink/68">
            Precio inicial sugerido: <strong>{formatCop(featuredProperty.priceCop)}</strong>.
            No se publica precio minimo aceptado.
          </p>
        </article>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Que revisar si buscas en este sector
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Confirma si el conjunto cerrado y sus zonas sociales encajan con tu rutina familiar.",
              "Agenda visita antes de tomar decisiones; las fotos y textos no reemplazan la validacion presencial.",
              "Pide solo documentos por canales privados y autorizados cuando el proceso comercial avance.",
            ].map((text) => (
              <p className="rounded-soft border border-ink/10 bg-paper p-5 text-sm leading-6 text-ink/72" key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <InternalLinks
        links={[
          {
            href: "/propiedades/santa-clara-de-las-villas",
            label: "Landing de la casa",
            description: "Datos comerciales permitidos, formulario y WhatsApp manual.",
          },
          {
            href: "/guias/comprar-casa-en-conjunto-cerrado-pereira",
            label: "Comprar en conjunto",
            description: "Preguntas clave para comparar zonas sociales y administracion.",
          },
          {
            href: "/zonas/pereira",
            label: "Pereira",
            description: "Guia general para orientar la busqueda por ciudad.",
          },
        ]}
        title="Contexto relacionado para compradores"
      />
    </main>
  );
}

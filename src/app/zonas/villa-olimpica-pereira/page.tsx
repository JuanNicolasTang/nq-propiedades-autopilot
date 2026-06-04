import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { InternalLinks } from "@/components/InternalLinks";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Villa Olimpica Pereira: referencia para buscar vivienda",
  description:
    "Guia local sobre Villa Olimpica en Pereira como referencia de busqueda residencial, sin datos inventados ni informacion privada.",
  path: "/zonas/villa-olimpica-pereira",
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Villa Olimpica Pereira",
  url: absoluteUrl("/zonas/villa-olimpica-pereira"),
  about: {
    "@type": "Place",
    name: "Villa Olimpica, Pereira, Risaralda",
  },
  inLanguage: "es-CO",
};

export default function VillaOlimpicaZonePage() {
  return (
    <main>
      <SeoJsonLd data={pageJsonLd} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Guia GEO
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Villa Olimpica, Pereira
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Villa Olimpica puede funcionar como punto de referencia para compradores
            que estan comparando sectores de Pereira. Esta pagina no afirma datos de
            mercado ni inventa disponibilidad; ofrece criterios para orientar la busqueda.
          </p>
          <div className="mt-7">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
              href="/zonas/pereira"
            >
              Ver guia de Pereira
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
              title: "Referencia local",
              text: "Usa la zona como referencia para conversar sobre movilidad, rutina y cercania percibida.",
            },
            {
              icon: CheckCircle2,
              title: "Comparacion por necesidades",
              text: "Compara tipo de inmueble, presupuesto, tiempos de compra y preferencia por conjunto cerrado.",
            },
            {
              icon: ShieldCheck,
              title: "Privacidad primero",
              text: "No publiques ni solicites documentos privados en espacios abiertos o no autorizados.",
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
              Antes de visitar
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Preguntas para filtrar mejor
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              "Quieres casa de varios niveles o prefieres una distribucion mas compacta?",
              "Necesitas zonas sociales como piscina, gimnasio o salon social?",
              "Tu presupuesto y forma de pago estan listos para avanzar a visita?",
              "La ubicacion aproximada encaja con tus rutinas diarias?",
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
            label: "Santa Clara",
            description: "Otra referencia residencial con propiedad destacada disponible.",
          },
          {
            href: "/guias/comprar-casa-en-pereira",
            label: "Comprar casa",
            description: "FAQ para preparar preguntas antes de contactar.",
          },
          {
            href: "/propiedades/santa-clara-de-las-villas",
            label: "Casa destacada",
            description: "Landing con datos publicos permitidos y formulario de lead.",
          },
        ]}
        title="Rutas utiles para continuar"
      />
    </main>
  );
}

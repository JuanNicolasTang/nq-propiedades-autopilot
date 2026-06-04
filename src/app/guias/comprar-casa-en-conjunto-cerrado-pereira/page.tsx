import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Dumbbell, ShieldCheck } from "lucide-react";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { featuredProperty } from "@/lib/properties";
import { createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Comprar casa en conjunto cerrado en Pereira",
  description:
    "Preguntas frecuentes para evaluar una casa en conjunto cerrado en Pereira: zonas sociales, visitas, privacidad y presupuesto.",
  path: "/guias/comprar-casa-en-conjunto-cerrado-pereira",
});

const faqs: FaqItem[] = [
  {
    question: "Que debo revisar en una casa en conjunto cerrado?",
    answer:
      "Revisa distribucion, area aproximada, estado general, estrato, zonas sociales, normas internas, administracion y facilidad para agendar visita.",
  },
  {
    question: "Las zonas sociales cambian la decision de compra?",
    answer:
      "Pueden influir si hacen parte de tu rutina. Evalua si realmente usaras piscina, gimnasio, salon social, canchas o zonas verdes.",
  },
  {
    question: "Por que no se publica la direccion exacta?",
    answer:
      "Por privacidad inmobiliaria. La ubicacion publica debe mantenerse aproximada hasta que el contacto avance por canales autorizados.",
  },
  {
    question: "Como debo preparar una visita?",
    answer:
      "Lleva preguntas sobre presupuesto, tiempos de compra, financiacion, administracion y condiciones del inmueble. Confirma la cita por canal autorizado.",
  },
  {
    question: "Que datos no deberian aparecer en una landing publica?",
    answer:
      "No deben aparecer direccion exacta, matricula inmobiliaria, ficha catastral, propietarios, documentos legales, firmas, avaluo completo ni coordenadas exactas.",
  },
];

export default function BuyGatedHousePereiraGuidePage() {
  return (
    <main>
      <SeoJsonLd data={faqJsonLd(faqs)} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Guia AEO
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Comprar casa en conjunto cerrado en Pereira
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Una guia para evaluar casas con zonas sociales, seguridad y administracion
            sin publicar datos privados ni usar urgencia artificial.
          </p>
          <div className="mt-7">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
              href="/propiedades/santa-clara-de-las-villas"
            >
              Ver casa en conjunto cerrado
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
        <article className="rounded-soft border border-ink/10 bg-white p-6">
          <Dumbbell aria-hidden="true" className="text-jade" size={26} />
          <h2 className="mt-4 font-serif text-3xl font-semibold text-ink">
            Zonas sociales de la propiedad destacada
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {featuredProperty.amenities.map((amenity) => (
              <span
                className="rounded-soft border border-ink/10 bg-cloud px-3 py-2 text-sm font-semibold text-ink"
                key={amenity}
              >
                {amenity}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-ink/68">
            La utilidad real de estas zonas depende de tu rutina. La visita sirve para
            validar estado, acceso y encaje con tus necesidades.
          </p>
        </article>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: Dumbbell,
              title: "Zonas comunes",
              text: "Valida que las amenidades sean relevantes para tu familia y frecuencia de uso.",
            },
            {
              icon: CheckCircle2,
              title: "Costo total",
              text: "Ten en cuenta precio, administracion, financiacion y gastos asociados al proceso.",
            },
            {
              icon: ShieldCheck,
              title: "Datos seguros",
              text: "La informacion sensible se comparte solo cuando hay autorizacion y avance comercial.",
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

      <FaqSection faqs={faqs} title="Preguntas frecuentes sobre conjuntos cerrados" />

      <InternalLinks
        links={[
          {
            href: "/propiedades/santa-clara-de-las-villas",
            label: "Casa destacada",
            description: "Landing con datos comerciales permitidos y formulario.",
          },
          {
            href: "/zonas/santa-clara-de-las-villas-pereira",
            label: "Zona Santa Clara",
            description: "Contexto publico y aproximado del sector.",
          },
          {
            href: "/guias/comprar-casa-en-pereira",
            label: "Comprar casa",
            description: "Preguntas generales para ordenar la busqueda en Pereira.",
          },
        ]}
        title="Continua la investigacion sin perder contexto"
      />
    </main>
  );
}

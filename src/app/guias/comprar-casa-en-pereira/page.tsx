import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Como comprar casa en Pereira: guia y preguntas frecuentes",
  description:
    "Guia AEO para comprar casa en Pereira con preguntas claras sobre presupuesto, visitas, documentos privados y contacto responsable.",
  path: "/guias/comprar-casa-en-pereira",
});

const faqs: FaqItem[] = [
  {
    question: "Que debo definir antes de buscar casa en Pereira?",
    answer:
      "Define presupuesto, forma de pago, tipo de propiedad, sector aproximado, tiempos de compra y si necesitas zonas sociales o conjunto cerrado.",
  },
  {
    question: "Como comparar casas sin depender de promesas de valorizacion?",
    answer:
      "Compara datos verificables: area aproximada, estrato, estado general, tipo de inmueble, ubicacion aproximada, precio publicado y condiciones de visita.",
  },
  {
    question: "Cuando debo pedir documentos legales de una propiedad?",
    answer:
      "Los documentos legales deben revisarse por canales privados y autorizados cuando el proceso avance. No deben publicarse en una pagina abierta.",
  },
  {
    question: "Es mejor formulario o WhatsApp para contactar?",
    answer:
      "Ambos sirven si el contacto lo inicia el comprador. El formulario deja datos ordenados y WhatsApp permite una conversacion manual inmediata.",
  },
  {
    question: "Que significa precio inicial sugerido?",
    answer:
      "Es una referencia comercial publica para iniciar la conversacion. No equivale a precio minimo aceptado ni a una promesa de cierre.",
  },
];

export default function BuyHousePereiraGuidePage() {
  return (
    <main>
      <SeoJsonLd data={faqJsonLd(faqs)} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Guia AEO
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Como comprar casa en Pereira
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Una guia de preguntas y respuestas para compradores que quieren ordenar su
            busqueda, pedir informacion responsable y avanzar solo con datos verificables.
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
              icon: CheckCircle2,
              title: "Ordena tu busqueda",
              text: "Separa necesidades obligatorias de preferencias negociables antes de visitar.",
            },
            {
              icon: FileText,
              title: "Documentos privados",
              text: "Solicita documentos solo por canales privados cuando exista interes real y autorizacion.",
            },
            {
              icon: ShieldCheck,
              title: "Sin presion falsa",
              text: "Evita decisiones basadas en urgencia artificial o datos no verificables.",
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

      <FaqSection faqs={faqs} title="Preguntas frecuentes para compradores" />

      <InternalLinks
        links={[
          {
            href: "/zonas/pereira",
            label: "Zonas de Pereira",
            description: "Criterios para comparar sectores sin inventar datos de mercado.",
          },
          {
            href: "/zonas/santa-clara-de-las-villas-pereira",
            label: "Santa Clara",
            description: "Contexto publico de la zona de la propiedad destacada.",
          },
          {
            href: "/guias/comprar-casa-en-conjunto-cerrado-pereira",
            label: "Conjunto cerrado",
            description: "Preguntas especificas para casas con zonas sociales.",
          },
        ]}
        title="Guias relacionadas para decidir mejor"
      />
    </main>
  );
}

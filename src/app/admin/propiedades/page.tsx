import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, ImageOff, LogOut, ShieldCheck } from "lucide-react";
import { featuredProperty, formatCop } from "@/lib/properties";

export const dynamic = "force-dynamic";

const missingItems = [
  "habitaciones",
  "banos",
  "parqueaderos",
  "administracion",
  "fotos reales completas",
  "video vertical",
  "video horizontal",
  "estado de ocupacion",
];

export default function AdminPropertiesPage() {
  const property = featuredProperty;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Kit comercial
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Propiedades
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Gestiona los activos publicos permitidos de la propiedad. No publiques
            documentos, direccion exacta, placas, personas identificables ni datos privados.
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-soft border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-paper focus:outline-none focus:ring-2 focus:ring-night focus:ring-offset-2"
            type="submit"
          >
            <LogOut aria-hidden="true" size={18} />
            Cerrar sesion
          </button>
        </form>
      </div>

      <section className="grid gap-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-soft border border-ink/10 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
            {property.location}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">
            {property.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/68">{property.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Precio publicado", formatCop(property.priceCop)],
              ["Area aproximada", `${property.areaM2} m2`],
              ["Estrato", property.strata],
              ["Tipo", property.type],
            ].map(([label, value]) => (
              <div className="rounded-soft bg-paper p-4" key={label}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-paper"
              href="/propiedades/santa-clara-de-las-villas"
              target="_blank"
            >
              <ExternalLink aria-hidden="true" size={18} />
              Abrir landing
            </Link>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
              href={property.commercialKitPath}
            >
              <Download aria-hidden="true" size={18} />
              Descargar ficha
            </a>
          </div>
        </article>

        <aside className="space-y-5">
          <section className="rounded-soft border border-ink/10 bg-white p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
              <div>
                <h2 className="font-semibold text-ink">Auditoria visual</h2>
                <p className="mt-1 text-sm leading-6 text-ink/68">
                  Revisadas: {property.imagePrivacyAudit.reviewed}. Aprobadas:{" "}
                  {property.imagePrivacyAudit.approved}. Excluidas:{" "}
                  {property.imagePrivacyAudit.reviewed - property.imagePrivacyAudit.approved}.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {property.imagePrivacyAudit.excluded.map((item) => (
                <div className="rounded-soft bg-paper p-3" key={item.label}>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-ink/62">{item.reason}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-soft border border-ink/10 bg-white p-5">
            <h2 className="font-semibold text-ink">Checklist de datos faltantes</h2>
            <div className="mt-4 grid gap-2">
              {missingItems.map((item) => (
                <label
                  className="flex items-center gap-3 rounded-soft bg-paper p-3 text-sm font-semibold capitalize text-ink/72"
                  key={item}
                >
                  <input className="size-4 accent-jade" disabled type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-soft border border-ink/10 bg-white">
        <div className="border-b border-ink/10 bg-paper p-4">
          <h2 className="font-semibold text-ink">Preview de galeria</h2>
          <p className="mt-1 text-sm leading-6 text-ink/68">
            Solo aparecen imagenes aprobadas para uso publico.
          </p>
        </div>
        {property.galleryImages.length === 0 ? (
          <div className="grid min-h-56 place-items-center p-6 text-center">
            <div className="max-w-md">
              <ImageOff aria-hidden="true" className="mx-auto text-jade" size={34} />
              <h3 className="mt-4 text-xl font-semibold text-ink">Sin fotos seguras aprobadas</h3>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Las imagenes candidatas contenian documentos o datos privados. Sube nuevas
                fotos reales de espacios, sin placas, personas identificables ni documentos.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {property.galleryImages.map((image) => (
              <figure key={image.src}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-soft bg-cloud">
                  <Image alt={image.altText} className="object-cover" fill src={image.src} />
                </div>
                <figcaption className="mt-2 text-xs leading-5 text-ink/62">
                  {image.caption || image.altText}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

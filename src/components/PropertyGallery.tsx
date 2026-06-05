import Image from "next/image";
import { Camera, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";

export function PropertyGallery({ property }: { property: Property }) {
  const images = property.galleryImages;
  const heroImage = property.heroImage ?? images[0];
  const secondaryImages = images.filter((image) => image.src !== heroImage?.src);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Galeria segura
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
            Fotos comerciales auditadas
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-ink/68">
          Solo se publican imagenes que no muestran documentos, personas identificables,
          placas, direccion exacta ni datos privados.
        </p>
      </div>

      {images.length === 0 || !heroImage ? (
        <div className="mt-8 rounded-soft border border-dashed border-ink/20 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid size-12 shrink-0 place-items-center rounded-soft bg-paper text-jade">
              <ShieldCheck aria-hidden="true" size={22} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-ink">
                Fotos reales pendientes de aprobacion
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Se revisaron {property.imagePrivacyAudit.reviewed} imagenes candidatas y se
                excluyeron por privacidad. La galeria se activara cuando existan fotos reales
                seguras, optimizadas y sin metadatos EXIF/GPS.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-soft bg-cloud shadow-panel lg:aspect-[16/9]">
              <Image
                alt={heroImage.altText}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 1152px, 100vw"
                src={heroImage.src}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/82 to-transparent p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pollen">
                  Imagen destacada
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/86">
                  Galeria real auditada, optimizada y renombrada de forma neutra.
                </p>
              </div>
            </div>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryImages.map((image, index) => (
              <figure
                className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
                key={image.src}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-soft bg-cloud">
                  <Image
                    alt={image.altText}
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    src={image.src}
                  />
                </div>
                <figcaption className="mt-2 flex items-start gap-2 text-xs leading-5 text-ink/62">
                  <Camera aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={14} />
                  Imagen segura auditada para uso comercial.
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

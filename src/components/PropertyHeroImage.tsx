import Image from "next/image";
import { Camera, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";

export function PropertyHeroImage({ property }: { property: Property }) {
  const image = property.heroImage ?? property.galleryImages[0];

  if (!image) {
    return null;
  }

  return (
    <figure className="relative min-h-[360px] overflow-hidden rounded-soft bg-night shadow-panel sm:min-h-[460px]">
      <Image
        alt={image.altText}
        className="object-cover"
        fill
        priority
        sizes="(min-width: 1024px) 560px, 100vw"
        src={image.src}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/86 via-night/12 to-transparent" />
      <figcaption className="absolute inset-x-4 bottom-4 rounded-soft bg-white/92 p-4 text-ink backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-soft bg-jade text-white">
            <Camera aria-hidden="true" size={18} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
              Fotos reales auditadas
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/70">
              Imagenes optimizadas sin EXIF/GPS, documentos, placas ni datos privados.
            </p>
          </div>
          <ShieldCheck aria-hidden="true" className="ml-auto hidden text-jade sm:block" size={22} />
        </div>
      </figcaption>
    </figure>
  );
}

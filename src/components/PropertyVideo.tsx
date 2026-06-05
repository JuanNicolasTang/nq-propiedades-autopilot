import { PlayCircle } from "lucide-react";
import type { Property } from "@/lib/properties";

export function PropertyVideo({ property }: { property: Property }) {
  if (!property.youtubeEmbedUrl) return null;

  return (
    <section id="video" className="scroll-mt-28 border-y border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
              Recorrido en video
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Mira el recorrido antes de agendar
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/68">
              Video embebido para revisar la distribucion general sin publicar direccion
              exacta ni datos privados.
            </p>
            {property.youtubeVideoUrl && (
              <a
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-soft border border-ink/15 bg-paper px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cloud"
                href={property.youtubeVideoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <PlayCircle aria-hidden="true" size={18} />
                Abrir en YouTube
              </a>
            )}
          </div>
          <div className="overflow-hidden rounded-soft border border-ink/10 bg-night shadow-panel">
            <div className="relative aspect-video">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 size-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={property.youtubeEmbedUrl}
                title={`Recorrido en video de ${property.title}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

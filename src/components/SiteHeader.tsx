import Link from "next/link";
import { Building2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link className="flex min-w-0 items-center gap-2 font-semibold text-ink" href="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-soft bg-ink text-white">
            <Building2 aria-hidden="true" size={18} />
          </span>
          <span className="truncate">NQ Propiedades</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-ink/70">
          <Link className="rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink" href="/">
            Inicio
          </Link>
          <Link
            className="rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/leads"
          >
            CRM
          </Link>
          <Link
            className="rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/visitas"
          >
            Visitas
          </Link>
          <Link
            className="rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/ofertas"
          >
            Ofertas
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Building2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link className="flex min-w-0 items-center gap-2 font-semibold text-ink" href="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-soft bg-ink text-white">
            <Building2 aria-hidden="true" size={18} />
          </span>
          <span className="truncate">NQ Propiedades</span>
        </Link>
        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 text-sm font-semibold text-ink/70 sm:mx-0 sm:gap-2 sm:pb-0">
          <Link className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink" href="/">
            Inicio
          </Link>
          <Link
            className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/leads"
          >
            CRM
          </Link>
          <Link
            className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/visitas"
          >
            Visitas
          </Link>
          <Link
            className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
            href="/admin/ofertas"
          >
            Ofertas
          </Link>
        </nav>
      </div>
    </header>
  );
}

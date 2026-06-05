"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LockKeyhole, MessageCircle } from "lucide-react";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades/santa-clara-de-las-villas", label: "Casa Santa Clara" },
  { href: "/propiedades/santa-clara-de-las-villas#galeria", label: "Galeria" },
  { href: "/propiedades/santa-clara-de-las-villas#lead-form", label: "Agendar visita" },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "CRM" },
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/visitas", label: "Visitas" },
  { href: "/admin/ofertas", label: "Ofertas" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link className="flex min-w-0 items-center gap-2 font-semibold text-ink" href="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-soft bg-ink text-white">
            <Building2 aria-hidden="true" size={18} />
          </span>
          <span className="truncate">NQ Propiedades</span>
        </Link>
        <nav
          aria-label={isAdmin ? "Navegacion administrativa" : "Navegacion publica"}
          className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 text-sm font-semibold text-ink/70 sm:mx-0 sm:gap-2 sm:pb-0"
        >
          {links.map((link) => (
            <Link
              className="whitespace-nowrap rounded-soft px-3 py-2 transition hover:bg-ink/8 hover:text-ink"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <span className="inline-flex min-h-9 items-center gap-2 rounded-soft bg-ink px-3 py-2 text-xs font-bold text-white">
              <LockKeyhole aria-hidden="true" size={14} />
              Admin
            </span>
          ) : (
            <Link
              className="inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-soft bg-jade px-3 py-2 text-xs font-bold text-white transition hover:bg-moss"
              href="/propiedades/santa-clara-de-las-villas#lead-form"
            >
              <MessageCircle aria-hidden="true" size={14} />
              Contactar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

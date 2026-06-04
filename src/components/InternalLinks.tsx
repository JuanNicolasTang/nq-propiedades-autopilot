import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type InternalLinkItem = {
  href: string;
  label: string;
  description: string;
};

export function InternalLinks({
  eyebrow = "Tambien puede servirte",
  links,
  title,
}: {
  eyebrow?: string;
  links: InternalLinkItem[];
  title: string;
}) {
  return (
    <section className="border-y border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {links.map((item) => (
            <Link
              className="group rounded-soft border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:border-jade/40 hover:bg-cloud"
              href={item.href}
              key={item.href}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-ink">{item.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="shrink-0 text-jade transition group-hover:translate-x-1"
                  size={18}
                />
              </span>
              <span className="mt-3 block text-sm leading-6 text-ink/68">{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

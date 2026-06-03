import type { Metadata } from "next";
import { LockKeyhole, ShieldCheck } from "lucide-react";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Admin Login | NQ Propiedades",
  robots: {
    index: false,
    follow: false,
  },
};

const errorCopy: Record<string, string> = {
  invalid: "La contrasena no coincide. Intenta de nuevo.",
  config: "ADMIN_PASSWORD no esta configurada en el entorno.",
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/admin") ? params.next : "/admin/leads";
  const message = params.error ? errorCopy[params.error] : null;

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-6xl place-items-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-soft border border-ink/10 bg-white p-5 shadow-panel sm:p-7">
        <div className="grid size-12 place-items-center rounded-soft bg-night text-white">
          <LockKeyhole aria-hidden="true" size={22} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-clay">
          Acceso privado
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">Admin</h1>
        <p className="mt-3 text-sm leading-6 text-ink/68">
          Ingresa la contrasena temporal para revisar el CRM. Esta proteccion es
          una medida MVP antes de activar autenticacion completa.
        </p>

        <form action="/api/admin/login" className="mt-7 grid gap-4" method="post">
          <input name="next" type="hidden" value={nextPath} />
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Contrasena
            <input
              className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          {message && (
            <p className="rounded-soft bg-red-50 px-3 py-3 text-sm font-semibold text-red-700">
              {message}
            </p>
          )}

          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink focus:outline-none focus:ring-2 focus:ring-night focus:ring-offset-2"
            type="submit"
          >
            <ShieldCheck aria-hidden="true" size={18} />
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

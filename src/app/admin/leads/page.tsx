import { CalendarClock, Gauge, Inbox, LogOut, ShieldCheck } from "lucide-react";
import { demoLeads } from "@/lib/leads";
import { featuredProperty } from "@/lib/properties";

function scoreBadge(score: number) {
  if (score >= 80) return "bg-clay text-white";
  if (score >= 50) return "bg-pollen text-ink";
  return "bg-cloud text-ink";
}

export default function AdminLeadsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            CRM inicial
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Leads
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Vista operativa para ordenar solicitudes por propiedad, estado y score. La
            persistencia real queda lista para Supabase cuando se configuren credenciales.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <div className="rounded-soft border border-ink/10 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
              Propiedad activa
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{featuredProperty.title}</p>
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
      </div>

      <section className="grid gap-4 py-8 sm:grid-cols-3">
        {[
          { icon: Inbox, label: "Leads demo", value: demoLeads.length },
          { icon: Gauge, label: "Score promedio", value: "75" },
          { icon: CalendarClock, label: "Visitas solicitadas", value: "1" },
        ].map((metric) => (
          <article key={metric.label} className="rounded-soft border border-ink/10 bg-white p-5">
            <metric.icon aria-hidden="true" className="text-jade" size={22} />
            <p className="mt-4 text-3xl font-semibold text-ink">{metric.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink/62">{metric.label}</p>
          </article>
        ))}
      </section>

      <section className="rounded-soft border border-ink/10 bg-white">
        <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
          <p className="text-sm leading-6 text-ink/72">
            Acceso protegido temporalmente con ADMIN_PASSWORD. Mantener como MVP hasta
            activar Supabase Auth y reglas de acceso por usuario.
          </p>
        </div>

        <div className="grid gap-3 p-4 lg:hidden">
          {demoLeads.map((lead) => (
            <article key={lead.id} className="rounded-soft border border-ink/10 bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-ink">{lead.fullName}</h2>
                  <p className="mt-1 text-sm text-ink/62">{lead.phone}</p>
                </div>
                <span className={`rounded-soft px-2 py-1 text-xs font-bold ${scoreBadge(lead.score)}`}>
                  {lead.score}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-ink/72">
                <p>Estado: {lead.status}</p>
                <p>Temperatura: {lead.temperature}</p>
                <p>Origen: {lead.source}</p>
                <p>{lead.message}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-[0.16em] text-moss">
              <tr>
                <th className="px-4 py-4">Lead</th>
                <th className="px-4 py-4">Contacto</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Interes</th>
                <th className="px-4 py-4">Siguiente lectura</th>
              </tr>
            </thead>
            <tbody>
              {demoLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-ink/10">
                  <td className="px-4 py-4 font-semibold text-ink">{lead.fullName}</td>
                  <td className="px-4 py-4 text-ink/68">
                    <div>{lead.phone}</div>
                    <div>{lead.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-soft bg-cloud px-2 py-1 text-xs font-bold text-ink">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-soft px-2 py-1 text-xs font-bold ${scoreBadge(lead.score)}`}>
                      {lead.score} / 100
                    </span>
                  </td>
                  <td className="px-4 py-4 text-ink/68">{lead.temperature}</td>
                  <td className="px-4 py-4 text-ink/68">{lead.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

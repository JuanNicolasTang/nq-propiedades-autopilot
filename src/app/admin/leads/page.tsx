import { CalendarClock, Gauge, Inbox, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { featuredProperty, getPropertyBySlug } from "@/lib/properties";
import type { Database } from "@/types/database";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export const dynamic = "force-dynamic";
export const revalidate = 0;

function scoreBadge(score: number) {
  if (score >= 80) return "bg-clay text-white";
  if (score >= 50) return "bg-pollen text-ink";
  return "bg-cloud text-ink";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}

function propertyLabel(slug: string) {
  return getPropertyBySlug(slug)?.shortTitle ?? slug;
}

function normalizeWhatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("3")) {
    return `57${digits}`;
  }

  return digits;
}

function leadWhatsappUrl(lead: LeadRow) {
  const phone = normalizeWhatsappPhone(lead.phone);

  if (!phone) return null;

  const message = `Hola ${lead.full_name}, soy de NQ Propiedades. Te contacto por tu solicitud sobre ${propertyLabel(lead.property_slug)}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

async function getLeads() {
  if (!isSupabaseConfigured()) {
    return {
      leads: [] as LeadRow[],
      error: "Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer leads reales.",
    };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("leads")
    .select(
      "id,full_name,phone,email,property_slug,status,score,source,created_at,message,budget_range,financing_status,purchase_timeline,wants_visit_this_week,consent",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      leads: [] as LeadRow[],
      error: "No se pudieron cargar los leads desde Supabase.",
    };
  }

  return {
    leads: (data ?? []) as LeadRow[],
    error: null,
  };
}

export default async function AdminLeadsPage() {
  const { leads, error } = await getLeads();
  const averageScore = leads.length
    ? Math.round(leads.reduce((total, lead) => total + lead.score, 0) / leads.length)
    : 0;
  const visitRequests = leads.filter((lead) => lead.wants_visit_this_week).length;

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
            Vista operativa conectada a Supabase para revisar solicitudes reales por
            propiedad, estado, score y fuente.
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
          { icon: Inbox, label: "Leads reales", value: leads.length },
          { icon: Gauge, label: "Score promedio", value: averageScore },
          { icon: CalendarClock, label: "Visitas solicitadas", value: visitRequests },
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

        {error && (
          <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {leads.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-6 text-center">
            <div className="max-w-sm">
              <Inbox aria-hidden="true" className="mx-auto text-jade" size={32} />
              <h2 className="mt-4 text-xl font-semibold text-ink">No hay leads todavía</h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Cuando alguien envie el formulario de la landing, aparecera aqui con
                estado, score, fuente y mensaje.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-3 p-4 lg:hidden">
              {leads.map((lead) => {
                const whatsappUrl = leadWhatsappUrl(lead);

                return (
                  <article key={lead.id} className="rounded-soft border border-ink/10 bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                        <h2 className="font-semibold text-ink">{lead.full_name}</h2>
                        <p className="mt-1 text-sm text-ink/62">{lead.phone}</p>
                        {lead.email && <p className="mt-1 text-sm text-ink/62">{lead.email}</p>}
                </div>
                <span className={`rounded-soft px-2 py-1 text-xs font-bold ${scoreBadge(lead.score)}`}>
                  {lead.score}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-ink/72">
                <p>Estado: {lead.status}</p>
                      <p>Propiedad: {propertyLabel(lead.property_slug)}</p>
                <p>Origen: {lead.source}</p>
                      <p>Fecha: {formatDate(lead.created_at)}</p>
                <p>{lead.message}</p>
                      {whatsappUrl ? (
                        <a
                          className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-soft bg-jade px-3 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle aria-hidden="true" size={16} />
                          Abrir WhatsApp
                        </a>
                      ) : (
                        <p className="font-semibold text-ink/50">Sin telefono valido para WhatsApp</p>
                      )}
              </div>
            </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-[0.16em] text-moss">
              <tr>
                    <th className="px-4 py-4">Nombre</th>
                    <th className="px-4 py-4">Telefono</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Propiedad</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Score</th>
                    <th className="px-4 py-4">Fuente</th>
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-4 py-4">Mensaje</th>
                    <th className="px-4 py-4">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
                  {leads.map((lead) => {
                    const whatsappUrl = leadWhatsappUrl(lead);

                    return (
                      <tr key={lead.id} className="border-t border-ink/10 align-top">
                        <td className="px-4 py-4 font-semibold text-ink">{lead.full_name}</td>
                        <td className="px-4 py-4 text-ink/68">{lead.phone}</td>
                        <td className="px-4 py-4 text-ink/68">{lead.email || "Sin email"}</td>
                        <td className="px-4 py-4 text-ink/68">{propertyLabel(lead.property_slug)}</td>
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
                        <td className="px-4 py-4 text-ink/68">{lead.source}</td>
                        <td className="px-4 py-4 text-ink/68">{formatDate(lead.created_at)}</td>
                        <td className="max-w-xs px-4 py-4 text-ink/68">
                          {lead.message || "Sin mensaje"}
                        </td>
                        <td className="px-4 py-4">
                          {whatsappUrl ? (
                            <a
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-soft bg-jade px-3 py-2 text-xs font-semibold text-white transition hover:bg-moss"
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <MessageCircle aria-hidden="true" size={15} />
                              Abrir
                            </a>
                          ) : (
                            <span className="text-xs font-semibold text-ink/50">No disponible</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

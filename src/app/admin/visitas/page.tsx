import Link from "next/link";
import { revalidatePath } from "next/cache";
import { CalendarClock, Inbox, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import {
  formatDate,
  propertyLabel,
  showingWhatsappUrl,
  type ShowingWithLead,
} from "@/lib/crm";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { showingStatuses, type ShowingStatus } from "@/types/showings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, 1000) : "";
}

function isShowingStatus(value: string): value is ShowingStatus {
  return showingStatuses.includes(value as ShowingStatus);
}

async function getShowings() {
  if (!isSupabaseConfigured()) {
    return {
      showings: [] as ShowingWithLead[],
      error: "Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer visitas reales.",
    };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("showings")
    .select(
      "id,lead_id,property_slug,scheduled_at,status,notes,created_at,updated_at,leads(full_name,phone,email)",
    )
    .order("scheduled_at", { ascending: true });

  if (error) {
    return {
      showings: [] as ShowingWithLead[],
      error: "No se pudieron cargar las visitas. Revisa que la tabla showings exista.",
    };
  }

  return {
    showings: (data ?? []) as unknown as ShowingWithLead[],
    error: null,
  };
}

async function updateShowingStatus(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const showingId = cleanText(formData.get("showingId"));
  const status = cleanText(formData.get("status"));
  const currentStatus = cleanText(formData.get("currentStatus"));
  const scheduledAt = cleanText(formData.get("scheduledAt"));

  if (!leadId || !showingId || !isShowingStatus(status) || status === currentStatus) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("showings").update({ status }).eq("id", showingId);

  if (error) {
    throw new Error("No se pudo actualizar la visita.");
  }

  await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: "showing_status_changed",
    note: `Visita ${scheduledAt ? `del ${formatDate(scheduledAt)} ` : ""}actualizada de ${currentStatus || "sin estado"} a ${status}.`,
  });

  revalidatePath("/admin/visitas");
  revalidatePath(`/admin/leads/${leadId}`);
}

export default async function AdminShowingsPage() {
  const { showings, error } = await getShowings();
  const upcomingCount = showings.filter((showing) =>
    ["programada", "confirmada"].includes(showing.status),
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Agenda comercial
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Visitas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Gestiona citas de venta creadas desde leads que dejaron sus datos. WhatsApp
            se abre solo por accion manual.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-soft border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-paper"
            href="/admin/leads"
          >
            Ver leads
          </Link>
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

      <section className="grid gap-4 py-8 sm:grid-cols-2">
        <article className="rounded-soft border border-ink/10 bg-white p-5">
          <CalendarClock aria-hidden="true" className="text-jade" size={22} />
          <p className="mt-4 text-3xl font-semibold text-ink">{showings.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink/62">Visitas totales</p>
        </article>
        <article className="rounded-soft border border-ink/10 bg-white p-5">
          <ShieldCheck aria-hidden="true" className="text-jade" size={22} />
          <p className="mt-4 text-3xl font-semibold text-ink">{upcomingCount}</p>
          <p className="mt-1 text-sm font-semibold text-ink/62">Por confirmar o realizar</p>
        </article>
      </section>

      <section className="rounded-soft border border-ink/10 bg-white">
        <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
          <p className="text-sm leading-6 text-ink/72">
            Acceso protegido temporalmente con ADMIN_PASSWORD. No hay envio automatico
            ni mensajes masivos.
          </p>
        </div>

        {error && (
          <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {showings.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-6 text-center">
            <div className="max-w-sm">
              <Inbox aria-hidden="true" className="mx-auto text-jade" size={32} />
              <h2 className="mt-4 text-xl font-semibold text-ink">No hay visitas agendadas</h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Agenda una visita desde el detalle de un lead para verla aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-ink/10">
            {showings.map((showing) => {
              const lead = showing.leads;
              const whatsappUrl = lead ? showingWhatsappUrl(showing, lead) : null;

              return (
                <article
                  className="grid gap-5 p-4 lg:grid-cols-[1.1fr_0.9fr_16rem]"
                  key={showing.id}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                      {propertyLabel(showing.property_slug)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-ink">
                      {formatDate(showing.scheduled_at)}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink/68">
                      {showing.notes || "Sin notas de visita"}
                    </p>
                  </div>

                  <div className="text-sm leading-6 text-ink/72">
                    <p className="font-semibold text-ink">{lead?.full_name || "Lead sin dato"}</p>
                    <p>{lead?.phone || "Sin telefono"}</p>
                    {lead?.email && <p>{lead.email}</p>}
                    <Link
                      className="mt-2 inline-flex text-sm font-semibold text-jade transition hover:text-moss"
                      href={`/admin/leads/${showing.lead_id}`}
                    >
                      Ver lead
                    </Link>
                    {whatsappUrl && (
                      <a
                        className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-soft bg-jade px-3 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle aria-hidden="true" size={16} />
                        Confirmar WhatsApp
                      </a>
                    )}
                  </div>

                  <form action={updateShowingStatus} className="grid content-start gap-3">
                    <input name="leadId" type="hidden" value={showing.lead_id} />
                    <input name="showingId" type="hidden" value={showing.id} />
                    <input name="currentStatus" type="hidden" value={showing.status} />
                    <input name="scheduledAt" type="hidden" value={showing.scheduled_at} />
                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Estado
                      <select
                        className="min-h-11 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                        name="status"
                        defaultValue={showing.status}
                      >
                        {showingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-soft bg-night px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                      type="submit"
                    >
                      <ShieldCheck aria-hidden="true" size={16} />
                      Actualizar
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

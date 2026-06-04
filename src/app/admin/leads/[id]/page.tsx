import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  LogOut,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import {
  formatDate,
  formatCopAmount,
  leadWhatsappUrl,
  offerStatusLabel,
  offerWhatsappUrl,
  paymentMethodLabel,
  propertyLabel,
  readableBoolean,
  scoreBadge,
  showingWhatsappUrl,
  type LeadEventRow,
  type LeadRow,
  type OfferRow,
  type ShowingRow,
} from "@/lib/crm";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { leadStatuses, type LeadStatus } from "@/types/leads";
import { offerStatuses, paymentMethods, type OfferStatus, type PaymentMethod } from "@/types/offers";
import { showingStatuses, type ShowingStatus } from "@/types/showings";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, 1000) : "";
}

function isLeadStatus(value: string): value is LeadStatus {
  return leadStatuses.includes(value as LeadStatus);
}

function isShowingStatus(value: string): value is ShowingStatus {
  return showingStatuses.includes(value as ShowingStatus);
}

function isOfferStatus(value: string): value is OfferStatus {
  return offerStatuses.includes(value as OfferStatus);
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return paymentMethods.includes(value as PaymentMethod);
}

function parseOfferAmount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) return null;

  const amount = Number(digits);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function parseScheduledAt(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

async function getLeadDetail(id: string) {
  if (!isSupabaseConfigured()) {
    return {
      lead: null,
      events: [] as LeadEventRow[],
      showings: [] as ShowingRow[],
      offers: [] as OfferRow[],
      error: "Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para operar el CRM.",
      eventsError: null,
      showingsError: null,
      offersError: null,
    };
  }

  const supabase = createServerSupabaseClient();
  const { data: lead, error: leadError } = await supabase!
    .from("leads")
    .select(
      "id,full_name,phone,email,property_slug,status,score,source,created_at,message,budget_range,financing_status,purchase_timeline,wants_visit_this_week,consent",
    )
    .eq("id", id)
    .maybeSingle();

  if (leadError) {
    return {
      lead: null,
      events: [] as LeadEventRow[],
      showings: [] as ShowingRow[],
      offers: [] as OfferRow[],
      error: "No se pudo cargar el lead desde Supabase.",
      eventsError: null,
      showingsError: null,
      offersError: null,
    };
  }

  if (!lead) {
    return {
      lead: null,
      events: [] as LeadEventRow[],
      showings: [] as ShowingRow[],
      offers: [] as OfferRow[],
      error: null,
      eventsError: null,
      showingsError: null,
      offersError: null,
    };
  }

  const [eventsResponse, showingsResponse, offersResponse] = await Promise.all([
    supabase!
    .from("lead_events")
    .select("id,lead_id,event_type,note,created_at")
    .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase!
      .from("showings")
      .select("id,lead_id,property_slug,scheduled_at,status,notes,created_at,updated_at")
      .eq("lead_id", id)
      .order("scheduled_at", { ascending: false }),
    supabase!
      .from("offers")
      .select("id,lead_id,property_slug,amount,payment_method,conditions,status,created_at,updated_at")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    lead: lead as LeadRow,
    events: (eventsResponse.data ?? []) as LeadEventRow[],
    showings: (showingsResponse.data ?? []) as ShowingRow[],
    offers: (offersResponse.data ?? []) as OfferRow[],
    error: null,
    eventsError: eventsResponse.error
      ? "No se pudo cargar el timeline. Revisa que la tabla lead_events exista."
      : null,
    showingsError: showingsResponse.error
      ? "No se pudieron cargar las visitas. Revisa que la tabla showings exista."
      : null,
    offersError: offersResponse.error
      ? "No se pudieron cargar las ofertas. Revisa que la tabla offers exista."
      : null,
  };
}

async function updateLeadStatus(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const status = cleanText(formData.get("status"));
  const currentStatus = cleanText(formData.get("currentStatus"));

  if (!leadId || !isLeadStatus(status) || status === currentStatus) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);

  if (error) {
    throw new Error("No se pudo actualizar el estado del lead.");
  }

  await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: "status_changed",
    note: `Estado actualizado de ${currentStatus || "sin estado"} a ${status}.`,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

async function addLeadNote(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const note = cleanText(formData.get("note"));

  if (!leadId || !note) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: "note_added",
    note,
  });

  if (error) {
    throw new Error("No se pudo guardar la nota interna.");
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

async function scheduleShowing(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const propertySlug = cleanText(formData.get("propertySlug"));
  const scheduledAt = parseScheduledAt(cleanText(formData.get("scheduledAt")));
  const notes = cleanText(formData.get("notes"));

  if (!leadId || !propertySlug || !scheduledAt) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("showings").insert({
    lead_id: leadId,
    property_slug: propertySlug,
    scheduled_at: scheduledAt,
    status: "programada",
    notes: notes || null,
  });

  if (error) {
    throw new Error("No se pudo agendar la visita.");
  }

  await Promise.all([
    supabase.from("leads").update({ status: "visita_agendada" }).eq("id", leadId),
    supabase.from("lead_events").insert({
      lead_id: leadId,
      event_type: "showing_scheduled",
      note: `Visita agendada para ${formatDate(scheduledAt)}.${notes ? ` Nota: ${notes}` : ""}`,
    }),
  ]);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/visitas");
  revalidatePath(`/admin/leads/${leadId}`);
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

async function createOffer(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const propertySlug = cleanText(formData.get("propertySlug"));
  const amount = parseOfferAmount(cleanText(formData.get("amount")));
  const paymentMethodValue = cleanText(formData.get("paymentMethod"));
  const conditions = cleanText(formData.get("conditions"));
  const paymentMethod = isPaymentMethod(paymentMethodValue) ? paymentMethodValue : "no_definido";

  if (!leadId || !propertySlug || !amount) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("offers").insert({
    lead_id: leadId,
    property_slug: propertySlug,
    amount,
    payment_method: paymentMethod,
    conditions: conditions || null,
    status: "recibida",
  });

  if (error) {
    throw new Error("No se pudo registrar la oferta.");
  }

  await Promise.all([
    supabase.from("leads").update({ status: "oferta_recibida" }).eq("id", leadId),
    supabase.from("lead_events").insert({
      lead_id: leadId,
      event_type: "offer_created",
      note: `Oferta registrada por ${formatCopAmount(amount)} con metodo ${paymentMethodLabel(paymentMethod)}.${conditions ? ` Condiciones: ${conditions}` : ""}`,
    }),
  ]);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/ofertas");
  revalidatePath(`/admin/leads/${leadId}`);
}

async function updateOfferStatus(formData: FormData) {
  "use server";

  const leadId = cleanText(formData.get("leadId"));
  const offerId = cleanText(formData.get("offerId"));
  const status = cleanText(formData.get("status"));
  const currentStatus = cleanText(formData.get("currentStatus"));
  const amount = Number(cleanText(formData.get("amount")));

  if (!leadId || !offerId || !isOfferStatus(status) || status === currentStatus) {
    return;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);

  if (error) {
    throw new Error("No se pudo actualizar la oferta.");
  }

  await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: "offer_status_changed",
    note: `Oferta ${Number.isFinite(amount) ? `por ${formatCopAmount(amount)} ` : ""}actualizada de ${currentStatus || "sin estado"} a ${status}.`,
  });

  if (status === "aceptada") {
    await supabase.from("leads").update({ status: "negociacion" }).eq("id", leadId);
  }

  revalidatePath("/admin/ofertas");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-soft border border-ink/10 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink">{value || "Sin dato"}</p>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const { lead, events, showings, offers, error, eventsError, showingsError, offersError } =
    await getLeadDetail(id);

  if (!lead && !error) {
    notFound();
  }

  const whatsappUrl = lead ? leadWhatsappUrl(lead) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition hover:text-ink"
            href="/admin/leads"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Volver a leads
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Detalle comercial
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            {lead?.full_name || "Lead"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Gestiona estado y notas internas solo para leads que dejaron sus datos.
            No hay automatizacion de mensajes masivos.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          {whatsappUrl && (
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-jade px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-moss"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" size={18} />
              Abrir WhatsApp
            </a>
          )}
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

      {error && (
        <section className="mt-8 rounded-soft border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {error}
        </section>
      )}

      {lead && (
        <div className="grid gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Nombre" value={lead.full_name} />
              <DetailItem label="Telefono" value={lead.phone} />
              <DetailItem label="Email" value={lead.email} />
              <DetailItem label="Propiedad" value={propertyLabel(lead.property_slug)} />
              <DetailItem label="Presupuesto" value={lead.budget_range} />
              <DetailItem label="Financiacion" value={lead.financing_status} />
              <DetailItem label="Tiempo de compra" value={lead.purchase_timeline} />
              <DetailItem
                label="Quiere visita esta semana"
                value={readableBoolean(lead.wants_visit_this_week)}
              />
              <DetailItem label="Fuente" value={lead.source} />
              <DetailItem label="Fecha de creacion" value={formatDate(lead.created_at)} />
              <div className="rounded-soft border border-ink/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Score</p>
                <span
                  className={`mt-2 inline-flex rounded-soft px-2 py-1 text-xs font-bold ${scoreBadge(lead.score)}`}
                >
                  {lead.score} / 100
                </span>
              </div>
              <div className="rounded-soft border border-ink/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Estado</p>
                <span className="mt-2 inline-flex rounded-soft bg-cloud px-2 py-1 text-xs font-bold text-ink">
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="rounded-soft border border-ink/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Mensaje</p>
              <p className="mt-3 text-sm leading-6 text-ink/72">{lead.message || "Sin mensaje"}</p>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-soft border border-ink/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <UserRoundCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
                <div>
                  <h2 className="font-semibold text-ink">Agendar visita</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/68">
                    Crea una cita manual para este lead y registra el evento en el timeline.
                  </p>
                </div>
              </div>
              <form action={scheduleShowing} className="mt-5 grid gap-3">
                <input name="leadId" type="hidden" value={lead.id} />
                <input name="propertySlug" type="hidden" value={lead.property_slug} />
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Fecha y hora
                  <input
                    className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="scheduledAt"
                    type="datetime-local"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Nota opcional
                  <textarea
                    className="min-h-24 rounded-soft border border-ink/15 bg-paper/60 px-3 py-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="notes"
                    placeholder="Ej. Confirmar disponibilidad del comprador y punto de encuentro."
                  />
                </label>
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
                  type="submit"
                >
                  <CalendarClock aria-hidden="true" size={18} />
                  Agendar visita
                </button>
              </form>
            </section>

            <section className="rounded-soft border border-ink/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <DollarSign aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
                <div>
                  <h2 className="font-semibold text-ink">Registrar oferta</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/68">
                    Guarda una propuesta formal del comprador. No registres precio minimo
                    aceptado ni informacion privada de propietarios.
                  </p>
                </div>
              </div>
              <form action={createOffer} className="mt-5 grid gap-3">
                <input name="leadId" type="hidden" value={lead.id} />
                <input name="propertySlug" type="hidden" value={lead.property_slug} />
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Monto ofrecido
                  <input
                    className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="amount"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1000000"
                    placeholder="660000000"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Metodo de pago
                  <select
                    className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="paymentMethod"
                    defaultValue="no_definido"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {paymentMethodLabel(method)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Condiciones
                  <textarea
                    className="min-h-24 rounded-soft border border-ink/15 bg-paper/60 px-3 py-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="conditions"
                    placeholder="Ej. Sujeto a aprobacion de credito y revision de documentos permitidos."
                  />
                </label>
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
                  type="submit"
                >
                  <DollarSign aria-hidden="true" size={18} />
                  Registrar oferta
                </button>
              </form>
            </section>

            <section className="rounded-soft border border-ink/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
                <div>
                  <h2 className="font-semibold text-ink">Cambiar estado</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/68">
                    Registra el avance comercial del lead sin editar Supabase manualmente.
                  </p>
                </div>
              </div>
              <form action={updateLeadStatus} className="mt-5 grid gap-3">
                <input name="leadId" type="hidden" value={lead.id} />
                <input name="currentStatus" type="hidden" value={lead.status} />
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Estado
                  <select
                    className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="status"
                    defaultValue={lead.status}
                  >
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
                  type="submit"
                >
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Guardar estado
                </button>
              </form>
            </section>

            <section className="rounded-soft border border-ink/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <NotebookPen aria-hidden="true" className="mt-0.5 shrink-0 text-clay" size={20} />
                <div>
                  <h2 className="font-semibold text-ink">Nota interna</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/68">
                    Agrega contexto para seguimiento permitido. No se envia ningun mensaje.
                  </p>
                </div>
              </div>
              <form action={addLeadNote} className="mt-5 grid gap-3">
                <input name="leadId" type="hidden" value={lead.id} />
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Nota
                  <textarea
                    className="min-h-28 rounded-soft border border-ink/15 bg-paper/60 px-3 py-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                    name="note"
                    placeholder="Ej. Llamar despues de las 4 p.m.; validar credito preaprobado."
                    required
                  />
                </label>
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink"
                  type="submit"
                >
                  <NotebookPen aria-hidden="true" size={18} />
                  Agregar nota
                </button>
              </form>
            </section>
          </aside>
        </div>
      )}

      {lead && (
        <section className="mb-8 rounded-soft border border-ink/10 bg-white">
          <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
            <DollarSign aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
            <div>
              <h2 className="font-semibold text-ink">Ofertas del lead</h2>
              <p className="mt-1 text-sm leading-6 text-ink/68">
                Propuestas y negociacion asociadas a este comprador. WhatsApp se abre
                solo por accion manual.
              </p>
            </div>
          </div>

          {offersError && (
            <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {offersError}
            </div>
          )}

          {offers.length === 0 ? (
            <div className="p-6 text-sm leading-6 text-ink/68">
              Todavia no hay ofertas registradas para este lead.
            </div>
          ) : (
            <div className="grid gap-3 p-4">
              {offers.map((offer) => {
                const offerWhatsAppUrl = offerWhatsappUrl(offer, lead);

                return (
                  <article
                    className="grid gap-4 rounded-soft border border-ink/10 bg-paper p-4 lg:grid-cols-[1fr_16rem]"
                    key={offer.id}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                        {offerStatusLabel(offer.status)}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-ink">
                        {formatCopAmount(offer.amount)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ink/68">
                        Metodo: {paymentMethodLabel(offer.payment_method)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink/68">
                        {offer.conditions || "Sin condiciones registradas"}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-ink/56">
                        {formatDate(offer.created_at)}
                      </p>
                      {offerWhatsAppUrl && (
                        <a
                          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-soft bg-jade px-3 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                          href={offerWhatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle aria-hidden="true" size={16} />
                          WhatsApp manual
                        </a>
                      )}
                    </div>
                    <form action={updateOfferStatus} className="grid content-start gap-3">
                      <input name="leadId" type="hidden" value={lead.id} />
                      <input name="offerId" type="hidden" value={offer.id} />
                      <input name="currentStatus" type="hidden" value={offer.status} />
                      <input name="amount" type="hidden" value={offer.amount} />
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Estado oferta
                        <select
                          className="min-h-11 rounded-soft border border-ink/15 bg-white px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
                          name="status"
                          defaultValue={offer.status}
                        >
                          {offerStatuses.map((status) => (
                            <option key={status} value={status}>
                              {offerStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-soft bg-night px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                        type="submit"
                      >
                        <CheckCircle2 aria-hidden="true" size={16} />
                        Actualizar oferta
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {lead && (
        <section className="mb-8 rounded-soft border border-ink/10 bg-white">
          <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
            <UserRoundCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
            <div>
              <h2 className="font-semibold text-ink">Visitas del lead</h2>
              <p className="mt-1 text-sm leading-6 text-ink/68">
                Citas de venta asociadas a este lead. WhatsApp se abre solo por accion manual.
              </p>
            </div>
          </div>

          {showingsError && (
            <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {showingsError}
            </div>
          )}

          {showings.length === 0 ? (
            <div className="p-6 text-sm leading-6 text-ink/68">
              Todavia no hay visitas agendadas para este lead.
            </div>
          ) : (
            <div className="grid gap-3 p-4">
              {showings.map((showing) => {
                const showingWhatsAppUrl = showingWhatsappUrl(showing, lead);

                return (
                  <article
                    className="grid gap-4 rounded-soft border border-ink/10 bg-paper p-4 lg:grid-cols-[1fr_16rem]"
                    key={showing.id}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                        {showing.status}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">
                        {formatDate(showing.scheduled_at)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ink/68">
                        {showing.notes || "Sin notas de visita"}
                      </p>
                      {showingWhatsAppUrl && (
                        <a
                          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-soft bg-jade px-3 py-2 text-sm font-semibold text-white transition hover:bg-moss"
                          href={showingWhatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle aria-hidden="true" size={16} />
                          Confirmar por WhatsApp
                        </a>
                      )}
                    </div>
                    <form action={updateShowingStatus} className="grid content-start gap-3">
                      <input name="leadId" type="hidden" value={lead.id} />
                      <input name="showingId" type="hidden" value={showing.id} />
                      <input name="currentStatus" type="hidden" value={showing.status} />
                      <input name="scheduledAt" type="hidden" value={showing.scheduled_at} />
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        Estado visita
                        <select
                          className="min-h-11 rounded-soft border border-ink/15 bg-white px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
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
                        <CheckCircle2 aria-hidden="true" size={16} />
                        Actualizar visita
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {lead && (
        <section className="rounded-soft border border-ink/10 bg-white">
          <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
            <CalendarClock aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
            <div>
              <h2 className="font-semibold text-ink">Timeline</h2>
              <p className="mt-1 text-sm leading-6 text-ink/68">
                Historial interno de cambios de estado y notas comerciales.
              </p>
            </div>
          </div>

          {eventsError && (
            <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {eventsError}
            </div>
          )}

          {events.length === 0 ? (
            <div className="p-6 text-sm leading-6 text-ink/68">
              Todavia no hay eventos para este lead.
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {events.map((event) => (
                <article className="grid gap-2 p-4 sm:grid-cols-[12rem_1fr]" key={event.id}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                      {event.event_type}
                    </p>
                    <p className="mt-1 text-xs text-ink/56">{formatDate(event.created_at)}</p>
                  </div>
                  <p className="text-sm leading-6 text-ink/72">{event.note || "Sin nota"}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DollarSign, Inbox, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import {
  formatCopAmount,
  formatDate,
  offerStatusLabel,
  offerWhatsappUrl,
  paymentMethodLabel,
  propertyLabel,
  type OfferWithLead,
} from "@/lib/crm";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { offerStatuses, type OfferStatus } from "@/types/offers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().slice(0, 1000) : "";
}

function isOfferStatus(value: string): value is OfferStatus {
  return offerStatuses.includes(value as OfferStatus);
}

async function getOffers() {
  if (!isSupabaseConfigured()) {
    return {
      offers: [] as OfferWithLead[],
      error: "Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer ofertas reales.",
    };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("offers")
    .select(
      "id,lead_id,property_slug,amount,payment_method,conditions,status,created_at,updated_at,leads(full_name,phone,email)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      offers: [] as OfferWithLead[],
      error: "No se pudieron cargar las ofertas. Revisa que la tabla offers exista.",
    };
  }

  return {
    offers: (data ?? []) as unknown as OfferWithLead[],
    error: null,
  };
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

export default async function AdminOffersPage() {
  const { offers, error } = await getOffers();
  const activeOffers = offers.filter((offer) =>
    ["recibida", "en_revision", "contraoferta"].includes(offer.status),
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Negociacion
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Ofertas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Registra y gestiona propuestas de compradores que ya dejaron sus datos. No se
            muestran valores privados de negociacion ni se automatizan mensajes.
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
          <DollarSign aria-hidden="true" className="text-jade" size={22} />
          <p className="mt-4 text-3xl font-semibold text-ink">{offers.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink/62">Ofertas totales</p>
        </article>
        <article className="rounded-soft border border-ink/10 bg-white p-5">
          <ShieldCheck aria-hidden="true" className="text-jade" size={22} />
          <p className="mt-4 text-3xl font-semibold text-ink">{activeOffers}</p>
          <p className="mt-1 text-sm font-semibold text-ink/62">En gestion</p>
        </article>
      </section>

      <section className="rounded-soft border border-ink/10 bg-white">
        <div className="flex items-start gap-3 border-b border-ink/10 bg-paper p-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-jade" size={20} />
          <p className="text-sm leading-6 text-ink/72">
            Acceso protegido temporalmente con ADMIN_PASSWORD. WhatsApp se abre solo
            por boton manual para leads con permiso.
          </p>
        </div>

        {error && (
          <div className="border-b border-ink/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {offers.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-6 text-center">
            <div className="max-w-sm">
              <Inbox aria-hidden="true" className="mx-auto text-jade" size={32} />
              <h2 className="mt-4 text-xl font-semibold text-ink">No hay ofertas registradas</h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                Registra una oferta desde el detalle de un lead para verla aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-ink/10">
            {offers.map((offer) => {
              const lead = offer.leads;
              const whatsappUrl = lead ? offerWhatsappUrl(offer, lead) : null;

              return (
                <article
                  className="grid gap-5 p-4 lg:grid-cols-[1fr_0.9fr_16rem]"
                  key={offer.id}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                      {propertyLabel(offer.property_slug)}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink">
                      {formatCopAmount(offer.amount)}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink/68">
                      Metodo: {paymentMethodLabel(offer.payment_method)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/68">
                      {offer.conditions || "Sin condiciones registradas"}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-ink/56">
                      {formatDate(offer.created_at)}
                    </p>
                  </div>

                  <div className="text-sm leading-6 text-ink/72">
                    <p className="font-semibold text-ink">{lead?.full_name || "Lead sin dato"}</p>
                    <p>{lead?.phone || "Sin telefono"}</p>
                    {lead?.email && <p>{lead.email}</p>}
                    <Link
                      className="mt-2 inline-flex text-sm font-semibold text-jade transition hover:text-moss"
                      href={`/admin/leads/${offer.lead_id}`}
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
                        WhatsApp manual
                      </a>
                    )}
                  </div>

                  <form action={updateOfferStatus} className="grid content-start gap-3">
                    <input name="leadId" type="hidden" value={offer.lead_id} />
                    <input name="offerId" type="hidden" value={offer.id} />
                    <input name="currentStatus" type="hidden" value={offer.status} />
                    <input name="amount" type="hidden" value={offer.amount} />
                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Estado
                      <select
                        className="min-h-11 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
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

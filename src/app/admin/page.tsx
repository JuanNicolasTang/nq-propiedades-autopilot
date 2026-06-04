import Link from "next/link";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Flame,
  Inbox,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  formatCopAmount,
  formatDate,
  offerStatusLabel,
  propertyLabel,
  scoreBadge,
  type LeadRow,
  type OfferRow,
  type ShowingRow,
} from "@/lib/crm";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardData = {
  leads: LeadRow[];
  showings: ShowingRow[];
  offers: OfferRow[];
  errors: string[];
};

function countBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  return Object.entries(
    items.reduce<Record<string, number>>((totals, item) => {
      const key = getKey(item)?.trim() || "sin dato";
      totals[key] = (totals[key] ?? 0) + 1;
      return totals;
    }, {}),
  ).sort(([, firstCount], [, secondCount]) => secondCount - firstCount);
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function uniqueCount(values: Array<string | null | undefined>) {
  return new Set(values.filter(Boolean)).size;
}

function readableLabel(value: string) {
  return value.replaceAll("_", " ");
}

async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      leads: [],
      showings: [],
      offers: [],
      errors: ["Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer metricas reales."],
    };
  }

  const supabase = createServerSupabaseClient();
  const errors: string[] = [];
  const [leadsResult, showingsResult, offersResult] = await Promise.all([
    supabase!
      .from("leads")
      .select(
        "id,property_slug,full_name,phone,email,budget_range,financing_status,purchase_timeline,wants_visit_this_week,message,status,score,source,consent,created_at",
      )
      .order("created_at", { ascending: false }),
    supabase!
      .from("showings")
      .select("id,lead_id,property_slug,scheduled_at,status,notes,created_at,updated_at")
      .order("scheduled_at", { ascending: true }),
    supabase!
      .from("offers")
      .select("id,lead_id,property_slug,amount,payment_method,conditions,status,created_at,updated_at")
      .order("created_at", { ascending: false }),
  ]);

  if (leadsResult.error) {
    errors.push("No se pudieron cargar los leads desde Supabase.");
  }

  if (showingsResult.error) {
    errors.push("No se pudieron cargar las visitas. Revisa que la tabla showings exista.");
  }

  if (offersResult.error) {
    errors.push("No se pudieron cargar las ofertas. Revisa que la tabla offers exista.");
  }

  return {
    leads: (leadsResult.data ?? []) as LeadRow[],
    showings: (showingsResult.data ?? []) as ShowingRow[],
    offers: (offersResult.data ?? []) as OfferRow[],
    errors,
  };
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <article className="rounded-soft border border-ink/10 bg-white p-4 shadow-sm shadow-ink/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink/62">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-soft bg-paper text-jade">
          <Icon aria-hidden="true" size={20} />
        </span>
      </div>
      {detail && <p className="mt-3 text-xs font-semibold text-ink/52">{detail}</p>}
    </article>
  );
}

function ConversionCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-soft border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink/62">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}%</p>
        </div>
        <TrendingUp aria-hidden="true" className="text-jade" size={24} />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
        <div className="h-full rounded-full bg-jade" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <p className="mt-3 text-xs font-semibold text-ink/52">{detail}</p>
    </article>
  );
}

function BreakdownList({
  emptyText,
  items,
  title,
}: {
  emptyText: string;
  items: Array<[string, number]>;
  title: string;
}) {
  const total = items.reduce((sum, [, count]) => sum + count, 0);

  return (
    <section className="rounded-soft border border-ink/10 bg-white p-5">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-ink/62">{emptyText}</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {items.map(([label, count]) => {
            const width = percent(count, total);

            return (
              <div key={label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold capitalize text-ink">{readableLabel(label)}</span>
                  <span className="font-semibold text-ink/62">{count}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                  <div className="h-full rounded-full bg-moss" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default async function AdminDashboardPage() {
  const { leads, showings, offers, errors } = await getDashboardData();
  const now = new Date();
  const totalOfferValue = offers.reduce((total, offer) => total + Number(offer.amount || 0), 0);
  const scheduledShowings = showings.filter((showing) => showing.status === "programada").length;
  const completedShowings = showings.filter((showing) => showing.status === "realizada").length;
  const acceptedOffers = offers.filter((offer) => offer.status === "aceptada").length;
  const receivedOffers = offers.filter((offer) => offer.status === "recibida").length;
  const hotLeads = leads.filter((lead) => lead.status === "caliente" || lead.score >= 80).length;
  const newLeads = leads.filter((lead) => lead.status === "nuevo").length;
  const leadIdsWithShowings = uniqueCount(showings.map((showing) => showing.lead_id));
  const leadIdsWithOffers = uniqueCount(offers.map((offer) => offer.lead_id));
  const upcomingShowings = showings
    .filter(
      (showing) =>
        new Date(showing.scheduled_at) >= now &&
        ["programada", "confirmada"].includes(showing.status),
    )
    .slice(0, 5);
  const latestLeads = leads.slice(0, 5);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Vista ejecutiva
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Metricas internas para leer el embudo comercial de leads, visitas y ofertas.
            Esta vista solo consulta datos existentes y no automatiza mensajes.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-soft border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-paper"
            href="/admin/leads"
          >
            Ver CRM
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

      <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Users} label="Total leads" value={leads.length} />
        <MetricCard icon={Inbox} label="Leads nuevos" value={newLeads} />
        <MetricCard icon={Flame} label="Leads calientes" value={hotLeads} detail="Estado caliente o score 80+" />
        <MetricCard icon={CalendarClock} label="Visitas programadas" value={scheduledShowings} />
        <MetricCard icon={CheckCircle2} label="Visitas realizadas" value={completedShowings} />
        <MetricCard icon={CircleDollarSign} label="Ofertas recibidas" value={receivedOffers} />
        <MetricCard icon={ShieldCheck} label="Ofertas aceptadas" value={acceptedOffers} />
        <MetricCard
          icon={BarChart3}
          label="Valor total de ofertas"
          value={formatCopAmount(totalOfferValue)}
          detail="Suma de ofertas registradas por compradores"
        />
      </section>

      {errors.length > 0 && (
        <section className="mb-8 rounded-soft border border-red-200 bg-red-50 p-4">
          <h2 className="text-sm font-semibold text-red-800">Metricas incompletas</h2>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-red-700">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <ConversionCard
          label="Lead a visita"
          value={percent(leadIdsWithShowings, leads.length)}
          detail={`${leadIdsWithShowings} leads con visita de ${leads.length} leads`}
        />
        <ConversionCard
          label="Visita a oferta"
          value={percent(leadIdsWithOffers, leadIdsWithShowings)}
          detail={`${leadIdsWithOffers} leads con oferta de ${leadIdsWithShowings} con visita`}
        />
        <ConversionCard
          label="Oferta aceptada"
          value={percent(acceptedOffers, offers.length)}
          detail={`${acceptedOffers} aceptadas de ${offers.length} ofertas`}
        />
      </section>

      <section className="grid gap-4 py-8 lg:grid-cols-3">
        <BreakdownList
          emptyText="Todavia no hay leads para agrupar por estado."
          items={countBy(leads, (lead) => lead.status)}
          title="Leads por estado"
        />
        <BreakdownList
          emptyText="Todavia no hay fuentes registradas."
          items={countBy(leads, (lead) => lead.source)}
          title="Leads por fuente"
        />
        <BreakdownList
          emptyText="Todavia no hay ofertas para agrupar por estado."
          items={countBy(offers, (offer) => offerStatusLabel(offer.status))}
          title="Ofertas por estado"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-soft border border-ink/10 bg-white">
          <div className="border-b border-ink/10 p-5">
            <h2 className="text-lg font-semibold text-ink">Proximas visitas</h2>
            <p className="mt-1 text-sm text-ink/62">Citas pendientes o confirmadas.</p>
          </div>
          {upcomingShowings.length === 0 ? (
            <div className="p-5 text-sm leading-6 text-ink/62">
              No hay proximas visitas registradas.
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {upcomingShowings.map((showing) => (
                <article className="p-5" key={showing.id}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                    {propertyLabel(showing.property_slug)}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-ink">
                    {formatDate(showing.scheduled_at)}
                  </h3>
                  <p className="mt-1 text-sm capitalize text-ink/62">
                    Estado: {readableLabel(showing.status)}
                  </p>
                  <Link
                    className="mt-3 inline-flex text-sm font-semibold text-jade transition hover:text-moss"
                    href={`/admin/leads/${showing.lead_id}`}
                  >
                    Ver lead
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-soft border border-ink/10 bg-white">
          <div className="border-b border-ink/10 p-5">
            <h2 className="text-lg font-semibold text-ink">Ultimos 5 leads</h2>
            <p className="mt-1 text-sm text-ink/62">Entradas recientes del formulario.</p>
          </div>
          {latestLeads.length === 0 ? (
            <div className="p-5 text-sm leading-6 text-ink/62">No hay leads recientes.</div>
          ) : (
            <div className="divide-y divide-ink/10">
              {latestLeads.map((lead) => (
                <article className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]" key={lead.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-ink">{lead.full_name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${scoreBadge(lead.score)}`}
                      >
                        {lead.score}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/62">
                      {propertyLabel(lead.property_slug)} · {lead.source}
                    </p>
                    <p className="mt-1 text-sm capitalize text-ink/62">
                      Estado: {readableLabel(lead.status)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-ink/52">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <Link
                    className="inline-flex min-h-10 items-center justify-center rounded-soft border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-paper"
                    href={`/admin/leads/${lead.id}`}
                  >
                    Abrir
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

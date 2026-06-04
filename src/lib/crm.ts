import { getPropertyBySlug } from "@/lib/properties";
import type { Database } from "@/types/database";

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type LeadEventRow = Database["public"]["Tables"]["lead_events"]["Row"];
export type ShowingRow = Database["public"]["Tables"]["showings"]["Row"];
export type ShowingWithLead = ShowingRow & {
  leads: Pick<LeadRow, "full_name" | "phone" | "email"> | null;
};

export function scoreBadge(score: number) {
  if (score >= 80) return "bg-clay text-white";
  if (score >= 50) return "bg-pollen text-ink";
  return "bg-cloud text-ink";
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}

export function propertyLabel(slug: string) {
  return getPropertyBySlug(slug)?.shortTitle ?? slug;
}

export function normalizeWhatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("3")) {
    return `57${digits}`;
  }

  return digits;
}

export function leadWhatsappUrl(lead: Pick<LeadRow, "full_name" | "phone" | "property_slug">) {
  const phone = normalizeWhatsappPhone(lead.phone);

  if (!phone) return null;

  const message = `Hola ${lead.full_name}, soy de NQ Propiedades. Te contacto por tu solicitud sobre ${propertyLabel(lead.property_slug)}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function showingWhatsappUrl(
  showing: Pick<ShowingRow, "scheduled_at" | "property_slug">,
  lead: Pick<LeadRow, "full_name" | "phone">,
) {
  const phone = normalizeWhatsappPhone(lead.phone);

  if (!phone) return null;

  const message = `Hola ${lead.full_name}, soy de NQ Propiedades. Te escribo para confirmar tu visita a ${propertyLabel(showing.property_slug)} el ${formatDate(showing.scheduled_at)}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function readableBoolean(value: boolean) {
  return value ? "Si" : "No";
}

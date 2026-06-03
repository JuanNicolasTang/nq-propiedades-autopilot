import type { Lead, LeadFormPayload, LeadTemperature } from "@/types/leads";

export function getLeadTemperature(score: number): LeadTemperature {
  if (score >= 80) return "caliente";
  if (score >= 50) return "tibio";
  return "frio";
}

export function scoreLead(payload: LeadFormPayload): number {
  let score = 10;

  if (payload.financingStatus === "aprobado") score += 25;
  if (payload.financingStatus === "preaprobado") score += 20;
  if (payload.financingStatus === "contado") score += 10;
  if (payload.purchaseTimeline === "menos_3_meses") score += 15;
  if (payload.email) score += 5;
  if (payload.wantsVisitThisWeek) score += 5;
  if (payload.budgetRange === "660m_o_mas") score += 20;
  if (payload.budgetRange === "menos_550m") score -= 20;

  return Math.max(0, Math.min(score, 100));
}

export const demoLeads: Lead[] = [
  {
    id: "demo-001",
    propertySlug: "santa-clara-de-las-villas",
    fullName: "Lead de demostracion",
    phone: "+57 300 000 0000",
    email: "comprador@example.com",
    budgetRange: "660m_o_mas",
    financingStatus: "preaprobado",
    purchaseTimeline: "menos_3_meses",
    wantsVisitThisWeek: true,
    message: "Quiere validar zonas sociales, precio y disponibilidad para visita.",
    status: "nuevo",
    score: 75,
    temperature: "tibio",
    source: "property_landing",
    consent: true,
    createdAt: "2026-06-03T12:00:00.000Z",
  },
];

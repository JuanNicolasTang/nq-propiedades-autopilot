export const leadStatuses = [
  "nuevo",
  "contactado",
  "calificado",
  "caliente",
  "visita_agendada",
  "visita_realizada",
  "oferta_recibida",
  "negociacion",
  "documentos",
  "cerrado_ganado",
  "cerrado_perdido",
  "no_calificado",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type LeadTemperature = "frio" | "tibio" | "caliente";

export type Lead = {
  id: string;
  propertySlug: string;
  fullName: string;
  phone: string;
  email?: string;
  budgetRange?: string;
  financingStatus?: "sin_definir" | "preaprobado" | "aprobado" | "contado";
  purchaseTimeline?: "menos_3_meses" | "3_6_meses" | "mas_6_meses" | "explorando";
  wantsVisitThisWeek?: boolean;
  message?: string;
  status: LeadStatus;
  score: number;
  temperature: LeadTemperature;
  source: "property_landing" | "home" | "whatsapp" | "manual";
  consent: boolean;
  createdAt: string;
};

export type LeadFormPayload = Pick<
  Lead,
  | "propertySlug"
  | "fullName"
  | "phone"
  | "email"
  | "budgetRange"
  | "financingStatus"
  | "purchaseTimeline"
  | "wantsVisitThisWeek"
  | "message"
  | "consent"
>;

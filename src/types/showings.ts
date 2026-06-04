export const showingStatuses = [
  "programada",
  "confirmada",
  "realizada",
  "cancelada",
  "no_asistio",
] as const;

export type ShowingStatus = (typeof showingStatuses)[number];

export const offerStatuses = [
  "recibida",
  "en_revision",
  "contraoferta",
  "aceptada",
  "rechazada",
  "retirada",
] as const;

export type OfferStatus = (typeof offerStatuses)[number];

export const paymentMethods = ["contado", "credito", "mixto", "no_definido"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

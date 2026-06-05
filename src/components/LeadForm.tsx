"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import type { LeadFormPayload } from "@/types/leads";

type LeadFormProps = {
  propertySlug: string;
  propertyTitle: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

const initialPayload: LeadFormPayload = {
  propertySlug: "",
  fullName: "",
  phone: "",
  email: "",
  budgetRange: "",
  financingStatus: "sin_definir",
  purchaseTimeline: "explorando",
  wantsVisitThisWeek: false,
  message: "",
  consent: false,
};

export function LeadForm({ propertySlug, propertyTitle }: LeadFormProps) {
  const [payload, setPayload] = useState<LeadFormPayload>({
    ...initialPayload,
    propertySlug,
  });
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!payload.fullName.trim() || !payload.phone.trim()) {
      setError("Nombre y telefono son obligatorios.");
      return;
    }

    if (!payload.consent) {
      setError("Necesitamos tu autorizacion para responder a esta solicitud.");
      return;
    }

    setState("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar la solicitud.");
      }

      setState("success");
      setPayload({ ...initialPayload, propertySlug });
    } catch {
      setState("error");
      setError("No pudimos enviar el formulario. Intentalo de nuevo en unos minutos.");
    }
  }

  return (
    <form
      id="lead-form"
      className="rounded-soft border border-ink/10 bg-white p-4 shadow-panel sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">
          Solicitud con permiso
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Agenda una visita o pide la ficha
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/68">
          Dejanos tus datos para responder sobre {propertyTitle}. La respuesta es manual,
          puntual y basada en tu autorizacion; no enviamos mensajes masivos ni compartimos
          tu informacion.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Nombre completo
          <input
            className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
            name="fullName"
            type="text"
            autoComplete="name"
            value={payload.fullName}
            onChange={(event) =>
              setPayload((current) => ({ ...current, fullName: event.target.value }))
            }
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          WhatsApp o telefono
          <input
            className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={payload.phone}
            onChange={(event) =>
              setPayload((current) => ({ ...current, phone: event.target.value }))
            }
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Email opcional
          <input
            className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
            name="email"
            type="email"
            autoComplete="email"
            value={payload.email}
            onChange={(event) =>
              setPayload((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Presupuesto
            <select
              className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
              value={payload.budgetRange}
              onChange={(event) =>
                setPayload((current) => ({ ...current, budgetRange: event.target.value }))
              }
            >
              <option value="">Prefiero conversarlo</option>
              <option value="menos_550m">Menos de 550M COP</option>
              <option value="550m_659m">550M a 659M COP</option>
              <option value="660m_o_mas">660M COP o mas</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-ink">
            Financiacion
            <select
              className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
              value={payload.financingStatus}
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  financingStatus: event.target.value as LeadFormPayload["financingStatus"],
                }))
              }
            >
              <option value="sin_definir">Sin definir</option>
              <option value="preaprobado">Credito preaprobado</option>
              <option value="aprobado">Credito aprobado</option>
              <option value="contado">Pago de contado</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Tiempo estimado de compra
          <select
            className="min-h-12 rounded-soft border border-ink/15 bg-paper/60 px-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
            value={payload.purchaseTimeline}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                purchaseTimeline: event.target.value as LeadFormPayload["purchaseTimeline"],
              }))
            }
          >
            <option value="explorando">Estoy explorando</option>
            <option value="menos_3_meses">Menos de 3 meses</option>
            <option value="3_6_meses">3 a 6 meses</option>
            <option value="mas_6_meses">Mas de 6 meses</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Mensaje opcional
          <textarea
            className="min-h-28 rounded-soft border border-ink/15 bg-paper/60 px-3 py-3 text-base font-normal outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/20"
            value={payload.message}
            onChange={(event) =>
              setPayload((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="Cuentanos que quieres validar antes de agendar una visita."
          />
        </label>

        <label className="flex gap-3 rounded-soft bg-cloud px-3 py-3 text-sm leading-5 text-ink/78">
          <input
            className="mt-1 size-4 rounded border-ink/25 text-jade focus:ring-jade"
            type="checkbox"
            checked={payload.wantsVisitThisWeek}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                wantsVisitThisWeek: event.target.checked,
              }))
            }
          />
          Me gustaria revisar disponibilidad para visita esta semana.
        </label>

        <label className="flex gap-3 rounded-soft bg-paper px-3 py-3 text-sm leading-5 text-ink/78">
          <input
            className="mt-1 size-4 rounded border-ink/25 text-jade focus:ring-jade"
            type="checkbox"
            checked={payload.consent}
            onChange={(event) =>
              setPayload((current) => ({ ...current, consent: event.target.checked }))
            }
            required
          />
          Autorizo que NQ Propiedades me contacte para responder esta solicitud puntual.
        </label>
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}

      {state === "success" && (
        <p className="mt-4 flex items-start gap-2 rounded-soft bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          Solicitud recibida. Te contactaremos usando los datos autorizados.
        </p>
      )}

      <button
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-soft bg-night px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink focus:outline-none focus:ring-2 focus:ring-night focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={state === "submitting"}
      >
        <Send aria-hidden="true" size={18} />
        {state === "submitting" ? "Enviando..." : "Enviar solicitud"}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-ink/58">
        Tambien puedes iniciar la conversacion manualmente desde el boton de WhatsApp.
      </p>
    </form>
  );
}

import { NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getLeadTemperature, scoreLead } from "@/lib/leads";
import type { LeadFormPayload } from "@/types/leads";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function sanitizeText(value: unknown) {
  return isString(value) ? value.trim().slice(0, 500) : "";
}

export async function POST(request: Request) {
  let body: Partial<LeadFormPayload>;

  try {
    body = (await request.json()) as Partial<LeadFormPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalido." }, { status: 400 });
  }

  const payload: LeadFormPayload = {
    propertySlug: sanitizeText(body.propertySlug),
    fullName: sanitizeText(body.fullName),
    phone: sanitizeText(body.phone),
    email: sanitizeText(body.email),
    budgetRange: sanitizeText(body.budgetRange),
    financingStatus: body.financingStatus ?? "sin_definir",
    purchaseTimeline: body.purchaseTimeline ?? "explorando",
    wantsVisitThisWeek: Boolean(body.wantsVisitThisWeek),
    message: sanitizeText(body.message),
    consent: Boolean(body.consent),
  };

  if (!payload.propertySlug || !payload.fullName || !payload.phone || !payload.consent) {
    return NextResponse.json(
      { ok: false, error: "Faltan campos obligatorios o autorizacion de contacto." },
      { status: 422 },
    );
  }

  const score = scoreLead(payload);
  const temperature = getLeadTemperature(score);

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: true,
        mode: "preview",
        score,
        temperature,
        message: "Lead validado. Configura Supabase para persistencia real.",
      },
      { status: 202 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase!.from("leads").insert({
    property_slug: payload.propertySlug,
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email || null,
    budget_range: payload.budgetRange || null,
    financing_status: payload.financingStatus || null,
    purchase_timeline: payload.purchaseTimeline || null,
    wants_visit_this_week: payload.wantsVisitThisWeek ?? false,
    message: payload.message || null,
    consent: payload.consent,
    status: temperature === "caliente" ? "caliente" : "nuevo",
    score,
    source: "property_landing",
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el lead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, score, temperature });
}

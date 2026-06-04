import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { createCommercialKitPdf } from "@/lib/commercial-kit";
import { featuredProperty } from "@/lib/properties";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await isAdminSessionTokenValid(sessionCookie);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const pdf = createCommercialKitPdf(featuredProperty);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ficha-comercial-santa-clara-de-las-villas.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

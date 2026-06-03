import { MessageCircle } from "lucide-react";
import type { Property } from "@/lib/properties";

type WhatsAppButtonProps = {
  property: Property;
  className?: string;
};

export function WhatsAppButton({ property, className = "" }: WhatsAppButtonProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Hola, quiero informacion sobre la ${property.title} en ${property.location}. Mi interes es conocer disponibilidad, condiciones de visita y detalles comerciales.`;
  const href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : "#lead-form";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-soft bg-jade px-5 py-3 text-sm font-semibold text-white shadow-button transition hover:-translate-y-0.5 hover:bg-moss focus:outline-none focus:ring-2 focus:ring-jade focus:ring-offset-2 ${className}`}
      href={href}
      aria-label={
        phone
          ? `Consultar por WhatsApp sobre ${property.shortTitle}`
          : "Ir al formulario de contacto"
      }
    >
      <MessageCircle aria-hidden="true" size={18} />
      {phone ? "Consultar por WhatsApp" : "Dejar datos de contacto"}
    </a>
  );
}

export function WhatsAppFallbackNote() {
  if (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) return null;

  return (
    <p className="mt-3 max-w-sm text-xs leading-5 text-ink/60">
      WhatsApp queda listo al configurar NEXT_PUBLIC_WHATSAPP_NUMBER. Mientras tanto, el
      boton lleva al formulario.
    </p>
  );
}

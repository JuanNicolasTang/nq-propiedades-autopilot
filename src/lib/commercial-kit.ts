import { readFileSync } from "node:fs";
import { join } from "node:path";
import { featuredProperty, formatCop, type Property } from "@/lib/properties";
import { absoluteUrl } from "@/lib/seo";
import { normalizeWhatsappPhone, type LeadRow } from "@/lib/crm";

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function removeAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sanitizePdfText(value: string) {
  return removeAccents(value)
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function line(text: string, x: number, y: number, size = 11) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${pdfEscape(sanitizePdfText(text))}) Tj ET`;
}

type PdfImage = {
  data: Buffer;
  width: number;
  height: number;
  name: string;
};

function drawImage(name: string, x: number, y: number, width: number, height: number) {
  return `q ${width} 0 0 ${height} ${x} ${y} cm /${name} Do Q`;
}

function buildPdf(lines: string[], images: PdfImage[]) {
  const content = lines.join("\n");
  const xObjectEntries = images
    .map((image, index) => `/Im${index + 1} ${6 + index} 0 R`)
    .join(" ");
  const objects = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> /XObject << ${xObjectEntries} >> >> /Contents 5 0 R >>`,
    ),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    Buffer.from(`<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`),
    ...images.map((image) =>
      Buffer.concat([
        Buffer.from(
          `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.data.length} >>\nstream\n`,
        ),
        image.data,
        Buffer.from("\nendstream"),
      ]),
    ),
  ];
  const chunks = [Buffer.from("%PDF-1.4\n")];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.concat(chunks).length);
    chunks.push(Buffer.from(`${index + 1} 0 obj\n`), object, Buffer.from("\nendobj\n"));
  });

  const xrefOffset = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n`));
  chunks.push(Buffer.from("0000000000 65535 f \n"));
  offsets.slice(1).forEach((offset) => {
    chunks.push(Buffer.from(`${offset.toString().padStart(10, "0")} 00000 n \n`));
  });
  chunks.push(
    Buffer.from(
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
    ),
  );

  return Buffer.concat(chunks);
}

function getCommercialKitImages() {
  const imageDir = join(
    process.cwd(),
    "public",
    "images",
    "properties",
    "santa-clara-de-las-villas",
  );
  const names = ["ficha-01.jpg", "ficha-02.jpg", "ficha-03.jpg", "ficha-04.jpg"];

  return names.flatMap((name) => {
    try {
      return [
        {
          data: readFileSync(join(imageDir, name)),
          height: 390,
          name,
          width: 520,
        },
      ];
    } catch {
      return [];
    }
  });
}

export function createCommercialKitPdf(property: Property = featuredProperty) {
  const images = getCommercialKitImages();
  const lines = [
    line("NQ Propiedades / Condominios Pereira", 56, 790, 18),
    line(property.title, 56, 758, 22),
    line("Ficha comercial segura", 56, 732, 13),
    line(`Ubicacion aproximada: ${property.location}`, 56, 690),
    line(`Precio publicado: ${formatCop(property.priceCop)}`, 56, 670),
    line(`Area aproximada: ${property.areaM2} m2`, 56, 650),
    line(`Estrato: ${property.strata}`, 56, 630),
    line(`Tipo de inmueble: ${property.type}`, 56, 610),
    line("Descripcion comercial:", 56, 574, 13),
    line(property.summary, 56, 552),
    line("Amenidades:", 56, 512, 13),
    ...property.amenities.slice(0, 10).map((amenity, index) => line(`- ${amenity}`, 76, 490 - index * 18)),
    line("Imagenes seleccionadas:", 56, 294, 13),
    line(
      property.galleryImages.length
        ? "Imagenes seguras auditadas, con nombres neutros y sin metadatos EXIF/GPS."
        : "Fotos reales pendientes de auditoria visual segura.",
      76,
      272,
    ),
    line("CTA WhatsApp: contacto manual iniciado por comprador interesado.", 56, 230),
    line("Dominio: condominiospereira.com", 56, 210),
    line("Documento comercial. Informacion sujeta a verificacion documental.", 56, 166, 10),
    line("Contenido publico autorizado. Datos privados reservados para canales seguros.", 56, 148, 10),
    ...images.flatMap((image, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 56 + col * 246;
      const y = 24 + (1 - row) * 98;

      return [drawImage(`Im${index + 1}`, x, y, 220, 165)];
    }),
  ];

  return buildPdf(lines, images);
}

export function commercialKitWhatsappUrl(
  lead: Pick<LeadRow, "full_name" | "phone" | "property_slug">,
) {
  const phone = normalizeWhatsappPhone(lead.phone);

  if (!phone) return null;

  const message = `Hola ${lead.full_name}, soy de NQ Propiedades. Te puedo compartir manualmente la ficha comercial segura de ${featuredProperty.title}. Tambien puedes revisar la landing aqui: ${absoluteUrl("/propiedades/santa-clara-de-las-villas")}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

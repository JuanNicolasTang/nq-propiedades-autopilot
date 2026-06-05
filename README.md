# NQ Propiedades Autopilot

Fase 1 de una plataforma inmobiliaria para NQ Propiedades en Pereira y el Eje
Cafetero. Incluye web publica, landing para la primera propiedad, formulario de
leads, preparacion de Supabase y estructura inicial de CRM.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase preparado para persistencia futura de leads
- WhatsApp deep link con mensaje precargado
- Base SEO/GEO/AEO con sitemap, robots, metadata, canonical y JSON-LD seguro
- Kit comercial de propiedad con galeria segura, admin y ficha PDF protegida

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

Scripts utiles:

```bash
npm run lint
npm run build
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y configurar cuando aplique:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: numero de WhatsApp en formato internacional sin
  `+`. Si esta vacio, el boton dirige al formulario.
- `NEXT_PUBLIC_SITE_URL`: URL publica del sitio para canonical URLs, sitemap,
  robots, Open Graph y Twitter cards. Si esta vacio, usa `http://localhost:3000`
  para desarrollo local.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: llave server-side para insertar leads desde la
  ruta `/api/leads`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: placeholder para futuras vistas autenticadas.
- `ADMIN_PASSWORD`: contrasena temporal para entrar a `/admin/login` y proteger
  las rutas internas `/admin/*`.

## Supabase

La ruta `POST /api/leads` valida datos basicos y calcula score. Si Supabase no
esta configurado, responde en modo preview sin guardar datos.

El CRM en `/admin/leads` lee leads reales desde `public.leads` usando
`SUPABASE_SERVICE_ROLE_KEY` solo en server-side. Si no hay credenciales o no hay
registros, muestra un estado informativo sin exponer datos.

El dashboard en `/admin` lee metricas reales desde `public.leads`,
`public.showings` y `public.offers` usando `SUPABASE_SERVICE_ROLE_KEY` solo en
server-side. Muestra totales, conversiones, agrupaciones por estado/fuente,
proximas visitas y ultimos leads. Es una vista interna de solo lectura y no
automatiza mensajes.

La tabla `leads` debe ser compatible con los tipos en `src/types/database.ts`.
Para el timeline del CRM, aplicar la migracion
`supabase/migrations/20260603235000_create_lead_events.sql`, que crea
`public.lead_events` con RLS habilitado y sin politicas publicas. La app la usa
solo desde server-side con `SUPABASE_SERVICE_ROLE_KEY`.

Para el modulo de visitas, aplicar tambien
`supabase/migrations/20260604002000_create_showings.sql`, que crea
`public.showings`, sus indices, estados permitidos y trigger de `updated_at`.
La agenda se opera desde `/admin/visitas` y desde el detalle de cada lead.

Para el modulo de ofertas y negociacion, aplicar
`supabase/migrations/20260604194000_create_offers.sql`, que crea
`public.offers`, sus indices, estados permitidos, metodos de pago permitidos y
trigger de `updated_at`. No se deben guardar ni mostrar valores privados de
negociacion.

Campos esperados principales:

- `property_slug`
- `full_name`
- `phone`
- `email`
- `budget_range`
- `financing_status`
- `purchase_timeline`
- `wants_visit_this_week`
- `message`
- `status`
- `score`
- `source`
- `consent`

Tabla `lead_events`:

- `id`
- `lead_id`
- `event_type`
- `note`
- `created_at`

Tabla `showings`:

- `id`
- `lead_id`
- `property_slug`
- `scheduled_at`
- `status`
- `notes`
- `created_at`
- `updated_at`

Estados permitidos para visitas:

- `programada`
- `confirmada`
- `realizada`
- `cancelada`
- `no_asistio`

Tabla `offers`:

- `id`
- `lead_id`
- `property_slug`
- `amount`
- `payment_method`
- `conditions`
- `status`
- `created_at`
- `updated_at`

Estados permitidos para ofertas:

- `recibida`
- `en_revision`
- `contraoferta`
- `aceptada`
- `rechazada`
- `retirada`

Metodos de pago permitidos:

- `contado`
- `credito`
- `mixto`
- `no_definido`

## Rutas

- `/`: home publica de NQ Propiedades.
- `/propiedades/santa-clara-de-las-villas`: landing publica de la propiedad.
- `/zonas/pereira`: guia GEO local para busquedas residenciales en Pereira.
- `/zonas/santa-clara-de-las-villas-pereira`: guia GEO del sector de la
  propiedad destacada con ubicacion aproximada.
- `/zonas/villa-olimpica-pereira`: guia GEO de referencia local para busquedas
  en Pereira.
- `/guias/comprar-casa-en-pereira`: guia AEO/FAQ para compradores de casa.
- `/guias/comprar-casa-en-conjunto-cerrado-pereira`: guia AEO/FAQ para casas en
  conjunto cerrado.
- `/admin`: dashboard protegido con metricas de embudo comercial.
- `/admin/propiedades`: panel protegido de propiedad, activos publicos,
  auditoria visual y descarga de ficha comercial.
- `/admin/leads`: estructura inicial del CRM.
- `/admin/leads/[id]`: detalle operativo del lead con cambio de estado, notas
  internas, timeline y enlace manual de WhatsApp.
- `/admin/visitas`: agenda protegida de visitas con estado, notas y WhatsApp
  manual de confirmacion.
- `/admin/ofertas`: panel protegido de ofertas y negociacion con estado,
  condiciones, metodo de pago y WhatsApp manual.
- `/admin/login`: acceso temporal al CRM usando `ADMIN_PASSWORD`.
- `/api/leads`: endpoint preparado para captura de leads.
- `/api/admin/properties/santa-clara-de-las-villas/pdf`: descarga protegida
  de ficha comercial PDF para uso interno.
- `/sitemap.xml`: sitemap publico generado por Next.js.
- `/robots.txt`: reglas publicas que permiten paginas comerciales y bloquean
  `/admin` y `/api`.

## Imagenes y kit comercial

Las fotos reales de la propiedad deben guardarse en:

```text
public/images/properties/santa-clara-de-las-villas/
```

Antes de publicar una imagen:

- Revisar visualmente que no muestre documentos, escrituras, avaluos o papeles
  legales.
- Excluir imagenes con direccion exacta, placas de vehiculos, personas
  identificables, numeros especificos que revelen ubicacion o datos privados.
- Convertir a `.webp` cuando sea posible.
- Optimizar peso para web.
- Eliminar EXIF/GPS. Las imagenes procesadas por `sharp` sin `withMetadata()`
  quedan sin metadatos heredados.
- Usar nombres limpios y neutros, por ejemplo `galeria-01.webp`,
  `galeria-02.webp`, `galeria-03.webp`.

Auditoria actual: se revisaron 11 imagenes del ZIP
`santa_clara_selected_webp.zip` y se aprobaron todas para uso publico. Se
renombraron con nombres neutros `galeria-01.webp`, `galeria-02.webp`, etc.,
sin clasificar por cocina, habitacion, bano u otros espacios especificos. Las
imagenes procesadas no tienen EXIF/GPS.

La landing tambien incluye una seccion "Recorrido en video" con embed responsive
de YouTube usando `youtube-nocookie.com`.

La ficha comercial se descarga desde `/admin/propiedades` o desde el detalle de
un lead. El PDF incluye pocas imagenes seleccionadas con nombres neutros, solo
datos publicos permitidos y el aviso:

```text
Documento comercial. Informacion sujeta a verificacion documental.
```

## SEO, GEO y AEO

La base SEO incluye metadata global, canonical URLs, Open Graph, Twitter cards,
`robots.ts`, `sitemap.ts` y JSON-LD seguro para la home, la landing de propiedad
y las guias FAQ. Las paginas GEO y AEO son contenido manual, no plantillas
programaticas masivas.

Componentes reutilizables:

- `SeoJsonLd`: renderiza JSON-LD escapado.
- `InternalLinks`: crea enlaces internos editoriales.
- `FaqSection`: muestra preguntas y respuestas claras.
- `src/lib/seo.ts`: centraliza URL base, metadata, canonical, sitemap y schemas.

Checklist de privacidad SEO:

- No publicar direccion exacta.
- No publicar coordenadas exactas.
- No publicar matricula inmobiliaria.
- No publicar ficha catastral.
- No publicar propietarios, firmas ni documentos legales.
- No publicar avaluo completo.
- No publicar precio minimo aceptado.
- No inventar datos de mercado ni prometer valorizacion.
- No generar paginas duplicadas o spam programatico.

Para validar sitemap y robots en local:

```bash
npm run dev
```

Abrir:

- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

## Acceso admin temporal

Antes de deploy, configurar `ADMIN_PASSWORD` en `.env.local` y en el proveedor
de hosting. Las rutas `/admin/*` redirigen a `/admin/login` si no existe una
cookie de sesion valida. El boton "Cerrar sesion" elimina la cookie.

Esta es una proteccion MVP para Fase 1. En una siguiente fase debe reemplazarse
por Supabase Auth y politicas de acceso por usuario.

## Reglas de privacidad

La web publica usa solo ubicacion aproximada y datos comerciales permitidos.
No se deben publicar datos sensibles de la propiedad ni de propietarios,
incluyendo identificadores registrales, datos catastrales, documentos legales,
firmas, coordenadas exactas, avaluos completos o informacion privada.

Ubicacion publica permitida para la primera propiedad:

```text
Santa Clara de las Villas, Pereira, Risaralda.
```

## Prueba manual sugerida

1. Revisar `/` en movil y escritorio.
2. Abrir `/propiedades/santa-clara-de-las-villas`.
3. Probar el formulario sin nombre, sin telefono y sin autorizacion.
4. Enviar un lead valido y confirmar mensaje de exito.
5. Configurar `NEXT_PUBLIC_WHATSAPP_NUMBER` y validar que el enlace de WhatsApp
   abre con mensaje precargado.
6. Abrir `/admin/leads` sin sesion y confirmar redireccion a `/admin/login`.
7. Entrar con `ADMIN_PASSWORD`, revisar `/admin/leads` y cerrar sesion.
8. Confirmar que `/admin/leads` muestra leads reales de Supabase o el estado
   vacio si no hay registros.
9. Abrir un lead en `/admin/leads/[id]`, cambiar estado y agregar una nota.
10. Confirmar que el timeline muestra los eventos nuevos.
11. Agendar una visita desde `/admin/leads/[id]`.
12. Confirmar que la visita aparece en `/admin/visitas`.
13. Cambiar el estado de la visita y confirmar que el timeline registra el cambio.
14. Registrar una oferta desde `/admin/leads/[id]`.
15. Confirmar que la oferta aparece en `/admin/ofertas`.
16. Cambiar el estado de la oferta y confirmar que el timeline registra el cambio.
17. Validar que no se muestran valores privados de negociacion.
18. Validar que los botones de WhatsApp solo abren mensajes manuales precargados.
19. Abrir `/admin` y confirmar metricas de leads, visitas, ofertas, conversiones,
    proximas visitas y ultimos leads.
20. Abrir `/admin/propiedades` sin sesion y confirmar redireccion a login.
21. Entrar a `/admin/propiedades`, revisar auditoria visual y descargar ficha PDF.
22. Abrir un lead en `/admin/leads/[id]` y validar botones de ficha comercial y
    WhatsApp manual para ficha.
23. Confirmar que `/propiedades/santa-clara-de-las-villas` muestra galeria real
    con nombres neutros y la seccion "Recorrido en video".
24. Ejecutar `npm run lint` y `npm run build`.

## Pendiente para siguientes fases

- Supabase Auth para proteger `/admin`.
- Persistencia real de leads en Supabase.
- Lead scoring editable desde CRM.
- Integraciones con WhatsApp Cloud API, Meta Lead Ads y reportes.

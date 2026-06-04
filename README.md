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
- `/admin`: dashboard protegido con metricas de embudo comercial.
- `/admin/leads`: estructura inicial del CRM.
- `/admin/leads/[id]`: detalle operativo del lead con cambio de estado, notas
  internas, timeline y enlace manual de WhatsApp.
- `/admin/visitas`: agenda protegida de visitas con estado, notas y WhatsApp
  manual de confirmacion.
- `/admin/ofertas`: panel protegido de ofertas y negociacion con estado,
  condiciones, metodo de pago y WhatsApp manual.
- `/admin/login`: acceso temporal al CRM usando `ADMIN_PASSWORD`.
- `/api/leads`: endpoint preparado para captura de leads.

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
20. Ejecutar `npm run lint` y `npm run build`.

## Pendiente para siguientes fases

- Supabase Auth para proteger `/admin`.
- Persistencia real de leads en Supabase.
- Lead scoring editable desde CRM.
- Integraciones con WhatsApp Cloud API, Meta Lead Ads y reportes.

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

## Supabase preparado

La ruta `POST /api/leads` valida datos basicos y calcula score. Si Supabase no
esta configurado, responde en modo preview sin guardar datos. Cuando existan
credenciales, espera una tabla `leads` compatible con los tipos en
`src/types/database.ts`.

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

## Rutas

- `/`: home publica de NQ Propiedades.
- `/propiedades/santa-clara-de-las-villas`: landing publica de la propiedad.
- `/admin/leads`: estructura inicial del CRM.
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
firmas, coordenadas exactas, avaluos completos, precio minimo aceptado o
informacion privada.

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
8. Ejecutar `npm run lint` y `npm run build`.

## Pendiente para siguientes fases

- Supabase Auth para proteger `/admin`.
- Persistencia real de leads en Supabase.
- Lead scoring editable desde CRM.
- Agenda de visitas.
- Integraciones con WhatsApp Cloud API, Meta Lead Ads y reportes.

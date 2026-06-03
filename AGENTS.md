# AGENTS.md — NQ Propiedades Autopilot

## Misión

Construir una plataforma inmobiliaria automatizada para vender casas, lotes y propiedades en Pereira y el Eje Cafetero.

La primera propiedad es una casa en Santa Clara de las Villas, Pereira.

El sistema debe operar como una máquina de crecimiento inmobiliario:

- landing pages de propiedades
- SEO local
- GEO por zonas y barrios
- AEO para respuestas en buscadores e IA
- generación de contenido
- captura de leads
- CRM
- lead scoring
- WhatsApp
- visitas
- ofertas
- reportes
- mejora continua

## Principio comercial

No construir spam.

Construir adquisición basada en permiso:

- personas que llegan por contenido
- formularios
- WhatsApp iniciado por el usuario
- anuncios pagos
- referidos
- portales inmobiliarios autorizados

Prohibido:

- scraping de contactos
- DMs masivos no solicitados
- publicación automática en portales sin API o permiso
- evadir límites de plataformas
- promesas falsas de valorización
- datos inventados
- publicar información sensible
- comprar bases de datos
- generar contenido duplicado masivo sin valor

## Privacidad inmobiliaria

Nunca mostrar públicamente:

- dirección exacta
- matrícula inmobiliaria
- ficha catastral
- nombres de propietarios
- firmas
- avalúos completos
- documentos legales
- precio mínimo aceptado
- coordenadas exactas

Usar ubicación pública aproximada:

Santa Clara de las Villas, Pereira, Risaralda.

## Primera propiedad

Propiedad inicial:

Casa en Santa Clara de las Villas, Pereira.

Datos públicos permitidos:

- Área aproximada: 155.66 m²
- Estrato: 5
- Tipo: casa de tres niveles
- Conjunto cerrado
- Vigilancia 24 horas
- Piscina
- Sauna
- Turco
- Jacuzzi
- Gimnasio
- Salón social
- Canchas
- Zonas verdes
- Ubicación pública: Santa Clara de las Villas, Pereira
- Precio inicial sugerido: 660.000.000 COP

Datos que deben mantenerse privados:

- dirección exacta
- matrícula inmobiliaria
- ficha catastral
- nombres de propietarios
- documentos legales
- avalúo completo
- firmas
- coordenadas exactas

## Stack técnico

Usar preferiblemente:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Vercel
- Cron jobs o background jobs
- Meta Lead Ads webhook preparado
- Instagram Graph API preparado
- WhatsApp Cloud API preparado
- Google Search Console preparado
- Google Business Profile preparado

## Módulos principales

Construir el sistema por fases:

1. Web pública de NQ Propiedades
2. Landing pages de propiedades
3. Formulario de leads
4. CRM interno
5. Lead scoring
6. WhatsApp deep links
7. Ficha PDF comercial
8. Agenda de visitas
9. Gestión de ofertas
10. Dashboard de métricas
11. Motor SEO/GEO/AEO
12. Planner de contenido
13. Meta Lead Ads webhook
14. WhatsApp Cloud API
15. Document vault privado
16. Sistema multi-propiedad

## Automatizaciones esperadas

Daily:

- revisar leads nuevos
- calcular score
- generar reporte
- sugerir contenido
- revisar páginas SEO
- detectar leads sin respuesta

Hourly:

- procesar formularios
- preparar seguimientos permitidos
- actualizar métricas

Weekly:

- generar nuevas páginas SEO/AEO como borradores
- revisar contenido de bajo rendimiento
- proponer mejoras
- auditar privacidad

## Reglas de contenido

El contenido debe ser:

- útil
- claro
- local
- verificable
- orientado a compradores reales
- optimizado para SEO sin parecer spam
- apto para Instagram, Google y WhatsApp

No debe:

- inventar datos
- prometer valorización garantizada
- exagerar urgencia falsa
- mostrar documentos privados
- revelar ubicación exacta sin autorización
- publicar información legal sensible

## Lead scoring

El sistema debe calificar leads de 0 a 100.

Criterios sugeridos:

- crédito aprobado: +25
- crédito preaprobado: +20
- presupuesto igual o superior al 95% del precio: +20
- compra en menos de 3 meses: +15
- pago de contado: +10
- dejó email además de teléfono: +5
- quiere visitar esta semana: +5
- presupuesto muy bajo: -20
- no responde: -15

Clasificación:

- 80 a 100: caliente
- 50 a 79: tibio
- 0 a 49: frío

## Estados del lead

Usar estos estados:

- nuevo
- contactado
- calificado
- caliente
- visita_agendada
- visita_realizada
- oferta_recibida
- negociacion
- documentos
- cerrado_ganado
- cerrado_perdido
- no_calificado

## Definition of Done

Una tarea solo está terminada si:

- compila sin errores
- pasa lint
- no expone secretos
- no expone datos sensibles
- tiene validaciones básicas
- es responsive en móvil
- actualiza documentación si cambia el workflow
- incluye prueba manual sugerida
- respeta la política anti-spam

# Roadmap Consolidado — Frontend (Prototipo de Venta)

**Síntesis de 3 skills:** [`senior-pm`](../.claude/skills/senior-pm/SKILL.md) (secuenciación, riesgos, gate de negocio) + [`senior-architect`](../.claude/skills/senior-architect/SKILL.md) (patrones técnicos de bajo costo) + [`agile-product-owner`](../.claude/skills/agile-product-owner/SKILL.md) (historias INVEST, sprint planning) · **Fuentes:** [`canchas.md`](./canchas.md), [`roadmap-general.md`](./roadmap-general.md), [`roadmap-frontend.md`](./roadmap-frontend.md), [`recomendaciones-arquitectura.md`](./recomendaciones-arquitectura.md)

**Alcance de este documento:** convertir el plan ya acordado (Fase A — prototipo de venta, 15 SP) en un **backlog ejecutable**: historias de usuario, Definition of Ready/Done, y sprints concretos. Backend (Fase B) queda como backlog de alto nivel, sin historificar, tal como definió el PM.

---

## 1. Cómo se combinan los 3 skills en este documento

| Skill | Qué aporta acá |
|---|---|
| `senior-pm` | El orden de fases, el gate de aprobación del socio, y qué queda dentro/fuera de Fase A (ya decidido en `roadmap-general.md`) |
| `senior-architect` | Los patrones de bajo costo que evitan rework en Fase B (servicios inyectables, interfaces de dominio — de `recomendaciones-arquitectura.md` §4) se incorporan como **Definition of Done**, no como historias nuevas ni SP adicionales |
| `agile-product-owner` | Convierte las 10 tareas (A.0–A.9) en **historias INVEST** con criterios de aceptación verificables, y arma el **sprint plan** con capacidad real |

No hay conflicto entre los tres: el PM define el *qué y cuándo*, el arquitecto define el *cómo construirlo sin pagarlo dos veces*, el PO lo convierte en *trabajo ejecutable y medible*.

---

## 2. Definition of Ready (antes de tomar una historia)

- Tiene criterios de aceptación claros (ver cada historia).
- No depende de una historia sin terminar (ver columna Dependencia).
- El diseño visual a aplicar está definido (`disenio_interfaz`: dark mode OLED, tipografía Fira, layout single column).

## 3. Definition of Done (aplica a TODAS las historias — incorpora arquitectura)

- [ ] Cumple el checklist de pre-entrega del skill `disenio_interfaz` (contraste, cursor-pointer, hover, focus visible, responsive 375/768/1024/1440).
- [ ] **Los datos se consumen a través de un servicio inyectable con interfaz propia (`XxxService`), nunca hardcodeados directo en el componente** — recomendación de `senior-architect` (§4 de `recomendaciones-arquitectura.md`). Esto es gratis ahora y evita reescribir componentes en Fase B.
- [ ] Las entidades usadas (`Cancha`, `Reserva`, `Partido`, `Usuario`) están tipadas como interfaces TypeScript, no como `any` u objetos sueltos.
- [ ] Probado en al menos un tamaño mobile y uno desktop.
- [ ] Sin errores de consola.
- [ ] **Toda actualización de estado dentro de un `.subscribe()` de un servicio (Auth/Usuario/Reserva/Partido/...) llama a `ChangeDetectorRef.markForCheck()`** — Ionic detacha la detección de cambios de las páginas gestionadas por `IonRouterOutlet`/`IonicRouteStrategy`, así que una actualización asíncrona (ej. `delay()` del servicio fake) puede no pintarse en pantalla sin esto. Bug real encontrado y corregido en HU-04 (detalle en `recomendaciones-arquitectura.md` §5.8).

---

## 4. Backlog priorizado — Fase A (Prototipo de venta)

Orden heredado de la priorización por impacto de venta ya definida por `senior-pm` (`roadmap-general.md` §3.3), convertido a historias INVEST por `agile-product-owner`.

### Épica 0 — Fundación (enabler, sin valor de usuario directo pero bloqueante)

**HU-00 · Setup del proyecto y sistema de diseño**
> Como equipo de desarrollo, quiero tener el proyecto Ionic + Angular configurado con el sistema de diseño aplicado, para poder construir todas las pantallas sobre una base consistente.

- **Criterios de aceptación:**
  - Dado el proyecto recién clonado, cuando se ejecuta `ionic serve`, entonces la app carga con tema dark OLED activo por defecto.
  - Los tokens de color/tipografía (`disenio_interfaz`) están centralizados (SCSS/variables), no hardcodeados por pantalla.
- **INVEST:** Independiente, chica, testeable (visual). No tiene valor de negocio por sí sola — es enabler de todo lo demás.
- **SP:** 2 · **Dependencia:** ninguna

**HU-01 · Navegación entre pantallas**
> Como visitante de la demo, quiero poder moverme entre Dashboard, Reservas, Partidos abiertos, Perfil y Login sin recargar la página, para que la presentación fluya sin cortes.

- **Criterios de aceptación:**
  - Dado que estoy en cualquier pantalla, cuando navego a otra, entonces no hay recarga completa del navegador.
  - No requiere guards de rol reales (fuera de alcance de Fase A).
- **SP:** 1 · **Dependencia:** HU-00

---

### Épica 1 — Contexto de usuario (impacto de venta: medio)

**HU-02 · Login/Registro simplificado**
> Como visitante de la demo, quiero ver un flujo de login/registro creíble, para entender cómo un usuario real entraría a la app.

- **Criterios de aceptación:**
  - Dado el formulario de registro, cuando completo los campos (correo, celular, DNI opcional) y confirmo, entonces avanzo al Dashboard.
  - No hay autenticación real ni persistencia — es aceptable y esperado en esta fase.
  - El servicio de autenticación se implementa como `AuthServiceFake implements AuthService` (ver DoD).
- **SP:** 1 · **Dependencia:** HU-01

**HU-03 · Perfil de usuario (vista simplificada)**
> Como visitante de la demo, quiero ver una pantalla de perfil editable — datos, foto, notificaciones y contraseña —, para percibir que el producto maneja identidad de usuario de forma completa.

- **Criterios de aceptación:**
  - Dado que estoy en Perfil, cuando edito un campo (nombre, correo, celular, DNI) y guardo, entonces veo el cambio reflejado en pantalla (sin persistencia real).
  - Dado que subo una foto, cuando la selecciono, entonces veo la vista previa aplicada al avatar (solo en memoria, sin subida real).
  - Dado el toggle de notificaciones, cuando lo cambio y guardo, entonces el estado persiste dentro de la sesión de la demo.
  - Dado el formulario de "Cambiar contraseña" (contraseña actual, nueva, confirmación), cuando las contraseñas coinciden y confirmo, entonces veo un mensaje de éxito (sin validación real contra backend).
  - El cambio de contraseña se implementa en `AuthService.cambiarClave()`, no en `UsuarioService` — es un límite de seguridad distinto al de los datos de perfil (ver `recomendaciones-arquitectura.md` §5.6).
- **SP:** 2 · **Dependencia:** HU-02
- **Corrección de alcance (2026-09-09):** la versión anterior de esta historia solo cubría datos básicos (nombre/correo/celular/DNI) y omitió clave/foto/notificaciones, que sí estaban en el alcance original de "Perfil editable" de `canchas.md`. No fue un recorte deliberado del PM (a diferencia de Notificaciones-centro o Gestión de roles, que sí se cortaron conscientemente del pitch) — fue una omisión al desglosar la historia, detectada por el usuario al revisar la pantalla construida. Se corrige acá sin mover la historia de sprint.

---

### Épica 2 — Primera impresión (impacto de venta: alto)

**HU-04 · Dashboard / Inicio**
> Como visitante de la demo, quiero ver un dashboard con accesos directos a Reservas y Partidos abiertos, para entender de un vistazo qué puede hacer el producto.

- **Criterios de aceptación:**
  - Dado que hago login, cuando llego al Dashboard, entonces veo accesos rápidos a Reservas, Perfil y Partidos abiertos.
  - Responsive en los 4 breakpoints definidos.
- **SP:** 1 · **Dependencia:** HU-01

---

### Épica 3 — Core del negocio (impacto de venta: alto — es la historia central del pitch)

**HU-05 · Explorar y reservar una cancha**
> Como visitante de la demo, quiero recorrer el flujo completo de reservar una cancha (listado → detalle → reserva → confirmación), para vivenciar el valor central del producto.

- **Criterios de aceptación:**
  - Dado el listado de canchas, cuando selecciono una, entonces veo el detalle (deporte, características, precio base).
  - Dado el detalle, cuando elijo fecha/hora y confirmo, entonces veo una pantalla de confirmación con resumen de la reserva.
  - El precio es editable en el paso de confirmación (refleja la funcionalidad real prevista).
  - Los datos de canchas provienen de `ReservaServiceFake` (interfaz `ReservaService`), no hardcodeados en el componente.
- **INVEST — nota del PO:** esta historia agrupa listado+detalle+flujo+confirmación (originalmente 4 tareas en `roadmap-frontend.md`) porque en un prototipo de venta el valor solo se percibe con el flujo completo — dividirla más finamente no sería demostrable por separado.
- **SP:** 3 · **Dependencia:** HU-04

---

### Épica 4 — Efecto diferenciador (impacto de venta: alto)

**HU-06 · Compartir evento y ubicación en Google Maps**
> Como visitante de la demo, quiero compartir los datos de una reserva y abrir la ubicación en Google Maps, para ver el "efecto wow" que más impresiona en una demo en vivo.

- **Criterios de aceptación:**
  - Dado que reservé una cancha, cuando toco "Compartir", entonces se genera una tarjeta con nombre, dirección y costo.
  - Dado que toco "Ver ubicación", entonces se abre Google Maps con coordenadas reales de un local de ejemplo (esto sí es funcionalidad real, no simulada — bajo esfuerzo, alto impacto).
- **SP:** 2 · **Dependencia:** HU-05

**HU-07 · Partidos abiertos: listado e inscripción**
> Como visitante de la demo, quiero ver partidos abiertos disponibles e inscribirme a uno, para entender el diferencial social del producto frente a un simple alquiler de cancha.

- **Criterios de aceptación:**
  - Dado el listado de partidos abiertos, cuando me inscribo a uno, entonces el cupo disponible se actualiza visualmente.
  - Los datos provienen de `PartidoServiceFake` (interfaz `PartidoService`).
- **SP:** 2 · **Dependencia:** HU-04

---

### Épica 5 — Cierre (enabler de calidad + evento de negocio)

**HU-08 · Pulido y checklist de pre-entrega**
> Como equipo de desarrollo, quiero validar el checklist completo del skill de diseño antes de la demo, para no perder credibilidad frente al socio por detalles visuales.

- **Criterios de aceptación:** checklist de `disenio_interfaz` 100% cumplido en las 6 pantallas.
- **SP:** 1 · **Dependencia:** HU-02 a HU-07

**HU-09 · Reunión de pitch con el socio**
> Como PM, quiero presentar el prototipo al socio y registrar formalmente su decisión, para saber si Fase B arranca.

- **Criterios de aceptación:** se registra el resultado (OK / OK con condiciones / No) en el gate definido en `roadmap-general.md` §4.
- **SP:** 1 · **Dependencia:** HU-08

**Total backlog Fase A: 16 SP** (15 SP originales + 1 SP por la corrección de alcance de HU-03 — ver nota en HU-03. Sigue siendo una corrección de fidelidad a `canchas.md`, no scope creep nuevo).

---

## 5. Sprint Planning

**Supuesto de capacidad:** 1 dev frontend, sprint de 1 semana, velocidad estimada ~7-8 SP/semana en fase de prototipo (menor complejidad que desarrollo funcional real).

### Sprint 1 (Semana 1) — 7 SP
| Historia | SP |
|---|---|
| HU-00 Setup + sistema de diseño | 2 |
| HU-01 Navegación | 1 |
| HU-04 Dashboard | 1 |
| HU-02 Login/Registro | 1 |
| HU-03 Perfil (datos + foto + notificaciones + clave) | 2 |

*Objetivo del sprint: fundación + primera impresión + contexto de usuario navegables.*

### Sprint 2 (Semana 2) — 9 SP
| Historia | SP |
|---|---|
| HU-05 Reservar cancha (flujo completo) | 3 |
| HU-07 Partidos abiertos | 2 |
| HU-06 Compartir + Maps | 2 |
| HU-08 Pulido/checklist | 1 |
| HU-09 Pitch con el socio | 1 |

*Objetivo del sprint: completar el core de negocio + efecto diferenciador + cierre con demo.*

> Nota del PO: Sprint 2 tiene 9 SP contra una capacidad estimada de 7-8 — es manejable porque HU-06 y HU-08 son de bajo riesgo técnico; si el dev ve que no llega, HU-08 (pulido) puede recortarse a lo esencial sin mover la fecha de la demo, nunca al revés.

---

## 6. Backlog Fase B (alto nivel — NO historificar todavía)

Por decisión explícita del PM (`roadmap-general.md` §5), esto no se refina en historias hasta tener el OK del socio. Se deja como referencia de lo que ya está mapeado, para que el PO no lo pierda de vista:

- Épicas backend en orden de dependencia: Auth real → Canchas/Reservas API → Partidos abiertos API → Locales/roles → Notificaciones → Perfil real → Reportes/estadísticas → Mobile + publicación (`roadmap-general.md` §5).
- Riesgos técnicos ya identificados por `senior-architect` a resolver en el diseño de Fase B: concurrencia de cupos, decisión de framework backend, secure storage de JWT, modelo multi-tenant por `local_id` (`recomendaciones-arquitectura.md` §5, §6).
- Al arrancar Fase B: repetir este mismo ejercicio (WSJF de PM → patrones de arquitectura → historias INVEST de PO) sobre esas épicas.

---

## 7. Métricas a trackear desde ahora

| Métrica | Cómo se mide | Para qué sirve |
|---|---|---|
| Velocidad real vs. estimada | SP completados / sprint | Calibrar la estimación de Fase B con datos reales, no solo supuestos |
| % checklist de diseño cumplido | Manual, por historia | Evitar sorpresas de calidad visual antes de la demo |
| Resultado del gate (HU-09) | OK / condicionado / no | Decide si Fase B arranca tal como está planeada |

---

## 8. Próximos pasos inmediatos

1. Arrancar Sprint 1 con HU-00 (setup) — es la única historia sin dependencias.
2. Aplicar la Definition of Done (§3) desde la primera historia — especialmente el patrón de servicios inyectables, que es gratis ahora y costoso de agregar después.
3. Al cerrar Sprint 2 y ejecutar HU-09, actualizar este documento con el resultado real del gate antes de tocar `roadmap-general.md` §5 (Fase B).

---

## 9. Registro de correcciones al backlog

Log corto de cambios de alcance detectados después de que una historia ya se dio por completa — para que quede trazable qué cambió y por qué, sin tener que reconstruir el historial de commits.

| Fecha | Historia | Qué cambió | Detectado por | Impacto |
|---|---|---|---|---|
| 2026-09-09 | HU-03 (Perfil) | Se agregó cambio de contraseña, foto de perfil y toggle de notificaciones — el desglose inicial solo cubría datos básicos, omitiendo alcance que `canchas.md` ya prometía en "Perfil editable (datos, clave, foto, notificaciones)" | Usuario, al revisar la pantalla construida ("¿dónde modifica la contraseña?") | +1 SP (1→2). Sprint 1 pasa de 6 a 7 SP, dentro de la capacidad estimada (7-8 SP/semana) — no requiere replanificar el sprint. |
| 2026-09-09 | Bug (no ligado a una HU específica) | Botones CTA (`color="cta"`) renderizaban sin fondo naranja — Ionic no genera la clase utilitaria para colores custom fuera de su paleta nativa. Corregido con una regla `.ion-color-cta` en `variables.scss` (detalle técnico en `recomendaciones-arquitectura.md` §5.7) | Usuario, reportando "la página sale negra" | Sin impacto en SP — es un fix de un defecto real, no una historia nueva. Afecta el Definition of Done de toda historia con botones CTA ya construidos (HU-00 a HU-03); verificado que ahora renderizan `#f97316` correctamente. |
| 2026-09-09 | HU-04 (Dashboard) | El saludo con nombre de usuario no se pintaba pese a que el dato llegaba al componente — Ionic detacha la detección de cambios de las páginas del router-outlet, y una actualización async (`delay()` del servicio fake) no se reflejaba sin `ChangeDetectorRef.markForCheck()`. Corregido en Dashboard y aplicado preventivamente en Perfil y Login (mismo patrón) | Verificación propia con Playwright + Angular DevTools API al capturar las 4 pantallas de breakpoint, antes de mostrarlo al usuario | Sin impacto en SP. Se agregó como ítem nuevo del Definition of Done (§3) para que HU-05/06/07 no repitan el mismo bug. |

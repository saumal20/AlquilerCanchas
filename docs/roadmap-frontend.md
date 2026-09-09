# Roadmap Frontend — Alquiler de Canchas Deportivas

**Rol:** Project Manager TI · **Alcance de este documento:** solo Frontend (Ionic + Angular + Capacitor) · **Basado en:** [`docs/canchas.md`](./canchas.md) · **Aplica sistema de diseño:** [`.claude/skills/disenio_interfaz`](../.claude/skills/disenio_interfaz/SKILL.md)

---

## 1. Resumen ejecutivo

La propuesta original (`canchas.md`) define bien el *qué* (funcionalidades y pantallas) pero no el *cómo se construye*: faltaba una fase de fundación técnica, desglose de tareas por pantalla, dependencias, criterios de aceptación, manejo de estados (carga/error/vacío) y un mecanismo de priorización objetivo. Este documento reestructura el roadmap de frontend en **3 fases** (se agrega una Fase 0 de fundación, ausente en la propuesta original) usando **WSJF (Weighted Shortest Job First)** para ordenar el trabajo dentro de cada fase por valor de negocio vs. esfuerzo, más un registro de riesgos y RACI simplificado.

| | Fase 0 | Fase 1 (MVP) | Fase 2 (Beta) |
|---|---|---|---|
| Objetivo | Fundación técnica y design system | Validar la idea con lo mínimo funcional | Enriquecer experiencia y preparar publicación |
| Story Points | 8 SP | 53 SP | 42 SP |
| Duración estimada* | 1 sprint (~2 sem) | 3–4 sprints (~6–8 sem) | 3 sprints (~6 sem) |

*Supuesto de equipo: 2 desarrolladores frontend, sprints de 2 semanas, velocidad ~16 SP/sprint. Ajustar si el equipo real es distinto.

---

## 2. Alcance y supuestos

**Dentro de alcance:** UI/UX, componentes Angular/Ionic, integración con API (contratos a definir con backend), estado de la app, empaquetado Capacitor.

**Fuera de alcance de este documento:** desarrollo backend, infraestructura/hosting, pagos (mencionados como riesgo legal en la propuesta original, no se implementan en frontend hasta que exista definición de negocio).

**Supuestos:**
- El backend expone (o mockea vía `json-server`/`MSW`) los endpoints necesarios en paralelo a cada fase — es la dependencia externa más crítica del roadmap (ver Riesgos).
- El sistema de diseño (`disenio_interfaz`: dark mode OLED, layout single column, paleta y tipografía Fira) se usa como base visual en todas las pantallas desde la Fase 0.
- No hay diseños de alta fidelidad (Figma) previos; el checklist de pre-entrega del skill de diseño reemplaza esa validación.

---

## 3. Metodología de priorización (WSJF)

```
WSJF = (Valor de usuario + Urgencia + Reducción de riesgo) / Tamaño del trabajo
```

Escala 1–10 para valor/urgencia/riesgo, tamaño en Story Points (Fibonacci). A mayor WSJF, mayor prioridad. Se aplicó a nivel de **épica (pantalla/módulo)** para ordenar el trabajo dentro de cada fase; ver tablas §5 y §6.

---

## 4. Fase 0 — Fundación técnica (agregada, no estaba en la propuesta original)

Sin esta fase, cualquier pantalla construida en Fase 1 tendría que rehacerse cuando se defina routing, estado global o el design system. Es bloqueante para todo lo demás.

| # | Tarea | SP | Criterio de aceptación |
|---|---|---|---|
| 0.1 | Scaffolding proyecto Ionic + Angular + Capacitor, estructura de carpetas (features/shared/core) | 2 | Proyecto corre en web y emulador Android/iOS |
| 0.2 | Implementación de design tokens del skill `disenio_interfaz` (colores, tipografía Fira, dark mode OLED) en SCSS/Ionic variables | 2 | Tokens centralizados, tema oscuro activo por defecto, contraste verificado ≥4.5:1 |
| 0.3 | Routing base + guards de rol (usuario / admin / ayudante) | 2 | Rutas protegidas redirigen correctamente según rol |
| 0.4 | Capa de acceso a API (HttpClient + interceptores JWT + manejo de errores) y mocks (`MSW` o `json-server`) para desarrollar sin depender del backend | 1 | Llamadas mockeadas funcionando en al menos 1 endpoint de ejemplo |
| 0.5 | Componentes compartidos base (botón CTA, input, card, estado vacío/error/carga) siguiendo checklist de pre-entrega del skill de diseño | 1 | Componentes reutilizados en ≥2 pantallas, cumplen checklist (focus visible, cursor-pointer, hover, reduced-motion) |

---

## 5. Fase 1 — MVP Rápido

### 5.1 Priorización de épicas (WSJF)

| Épica | Valor | Urgencia | Reduc. riesgo | Tamaño (SP) | WSJF | Orden |
|---|---|---|---|---|---|---|
| Login / Registro | 9 | 9 | 6 | 5 | **4.8** | 1 |
| Perfil de usuario básico | 6 | 5 | 3 | 3 | **4.7** | 2 |
| Inicio / Dashboard básico | 6 | 5 | 3 | 3 | **4.7** | 2 |
| Reservas de canchas | 10 | 10 | 9 | 8 | **3.6** | 3 |
| Compartir evento/partido | 7 | 6 | 4 | 5 | **3.4** | 4 |
| Gestión mínima de locales y roles | 7 | 8 | 6 | 8 | **2.6** | 5 |
| Partidos abiertos | 8 | 7 | 5 | 8 | **2.5** | 6 |
| Notificaciones / mensajes | 5 | 4 | 3 | 5 | **2.4** | 7 |

> Nota de PM: *Reservas de canchas* es el corazón del MVP pero su WSJF baja por tamaño — se recomienda **partirla en historias más chicas** (ver 5.2) para entregar valor incremental antes en vez de un solo bloque de 8 SP.

### 5.2 Desglose de tareas por épica

**1. Login / Registro (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Formulario registro (correo, celular, DNI opcional) con validaciones | 2 | Fase 0 | Valida formato/obligatoriedad, mensajes de error accesibles |
| Formulario login + manejo de sesión (JWT) | 2 | 0.4 | Login persiste sesión, logout limpia estado |
| Recuperación de clave (UI) | 1 | Login | Flujo completo hasta pantalla de confirmación |

**2. Perfil de usuario básico (3 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Vista/edición de datos y foto de perfil | 2 | Login | Cambios persisten y se reflejan sin recargar |
| Preferencias de notificaciones (toggle) | 1 | — | Estado se guarda y refleja en próxima sesión |

**3. Inicio / Dashboard básico (3 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Layout dashboard (accesos rápidos: reservas, perfil, partidos abiertos) | 2 | Fase 0, Login | Responsive 375/768/1024/1440px |
| Estados vacío/carga del dashboard | 1 | Componentes 0.5 | Skeleton/loading visible <300ms de transición |

**4. Reservas de canchas (8 SP — dividir en historias)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Listado de canchas con filtros básicos (deporte, local) | 2 | Fase 0 | Lista pagina/filtra sin recargar página completa |
| Detalle de cancha (características, precio base) | 2 | Listado | Muestra info completa + CTA reserva visible (single column, CTA centrado) |
| Flujo de reserva (selección fecha/hora + precio editable) | 3 | Detalle | Confirma reserva y muestra resumen |
| Confirmación y estado de reserva (pendiente/confirmada) | 1 | Flujo reserva | Estado reflejado inmediatamente tras respuesta de API |

**5. Compartir evento/partido (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Generación de tarjeta de evento (cancha, dirección, costo) | 2 | Reservas | Datos correctos y actualizados |
| Integración Web Share API / enlace + apertura en Google Maps | 3 | Tarjeta evento | Abre Maps con coordenadas correctas en web y mobile (Capacitor) |

**6. Gestión mínima de locales y roles (8 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Vista admin: alta/edición de cancha (deporte, jugadores, precio base) | 3 | Fase 0, Login (rol admin) | Solo accesible con rol admin (guard) |
| Vista ayudante: registrar alquiler / gestionar reservas (sin editar cancha) | 3 | Reservas | Ayudante no ve opciones de edición de cancha (UI condicionada por rol) |
| Selector/gestión básica de locales (multi-local) | 2 | — | Cambiar de local activo refleja canchas correctas |

**7. Partidos abiertos (8 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Listado de partidos abiertos (visibles hasta inicio) | 3 | Fase 0 | Partido desaparece de la lista automáticamente al iniciar |
| Inscripción a partido (precio unitario) | 3 | Listado, Login | Confirma inscripción y actualiza cupos disponibles |
| Publicación de partido abierto (rol admin/ayudante) | 2 | Gestión roles | Formulario crea partido visible en el listado |

**8. Notificaciones / mensajes (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Integración Firebase Cloud Messaging (permisos + token) | 2 | Fase 0 | Permiso solicitado, token registrado en backend |
| Centro de notificaciones in-app (confirmaciones, recordatorios) | 3 | FCM | Notificación recibida se lista y marca como leída |

---

## 6. Fase 2 — MVP Ampliado (Beta)

### 6.1 Priorización de épicas (WSJF)

| Épica | Valor | Urgencia | Reduc. riesgo | Tamaño (SP) | WSJF | Orden |
|---|---|---|---|---|---|---|
| Filtros de búsqueda avanzados | 6 | 5 | 2 | 3 | **4.3** | 1 |
| Ficha de usuario por disciplina + calificaciones | 6 | 4 | 3 | 5 | **2.6** | 2 |
| Estadísticas de jugadores | 6 | 4 | 3 | 5 | **2.6** | 2 |
| Reportes para administradores (frontend) | 7 | 6 | 4 | 8 | **2.1** | 3 |
| Panel de administración completo | 8 | 6 | 5 | 8 | **2.4** | 3 |
| Adaptación mobile (build Capacitor APK/IPA) | 8 | 7 | 6 | 8 | **2.6** | 2 |
| Publicación Play Store / App Store | 7 | 8 | 5 | 5 | **4.0** | 1 |

### 6.2 Desglose de tareas por épica

**Filtros de búsqueda avanzados (3 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Filtro combinado local + deporte + ciudad con persistencia en URL/query params | 3 | Fase 1 – Reservas | Compartir URL reproduce mismos resultados filtrados |

**Ficha de usuario por disciplina + calificaciones (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Vista de ficha por disciplina (deporte) | 2 | Perfil (Fase 1) | Muestra disciplinas asociadas al usuario |
| Sistema de calificación (dar/ver rating) | 3 | Ficha | Promedio se recalcula y refleja tras nueva calificación |

**Estadísticas de jugadores (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Vista de estadísticas (goles + evaluaciones) por jugador | 3 | Ficha disciplina | Datos consistentes con partidos jugados |
| Gráficos/resumen visual (siguiendo guía de dataviz del proyecto) | 2 | Estadísticas | Legible en dark mode OLED, responsive |

**Reportes para administradores — frontend (8 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Vista reporte de alquileres (cantidad, tiempo de uso) | 3 | Panel admin | Filtra por rango de fechas |
| Vista reporte de ingresos (base + modificaciones + partidos abiertos) | 3 | Reservas, Partidos abiertos | Totales cuadran con datos de detalle |
| Exportación (CSV/PDF) de reportes | 2 | Vistas de reporte | Archivo exportado contiene datos filtrados visibles |

**Panel de administración completo (8 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Rediseño de panel admin unificado (multi-local, multi-rol) | 3 | Fase 1 – Gestión roles | Navegación clara entre locales sin recarga |
| Gestión avanzada de canchas (edición masiva, disponibilidad) | 3 | Panel base | Cambios reflejan en disponibilidad de reservas |
| Auditoría básica de acciones (quién hizo qué) | 2 | Panel base | Registro visible de últimas N acciones |

**Adaptación mobile — Capacitor (8 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Ajustes UI específicos mobile (safe areas, gestos, teclado) | 3 | Fase 0 + Fase 1 completa | Sin overlap de UI en notch/safe area, iOS y Android |
| Integración de permisos nativos (ubicación para Maps, notificaciones) | 3 | Notificaciones (Fase 1) | Permisos solicitados con flujo nativo correcto |
| Pruebas en dispositivo real (Android + iOS) | 2 | Anteriores | Checklist de pre-entrega del skill de diseño pasa en dispositivo físico |

**Publicación Play Store / App Store (5 SP)**
| Tarea | SP | Dependencia | Criterio de aceptación |
|---|---|---|---|
| Assets de tienda (íconos, capturas, descripción) | 2 | Build mobile estable | Cumple guidelines de cada tienda |
| Configuración de builds firmados (Android keystore / iOS certificados) | 2 | Build mobile estable | Build firmado instala sin advertencias |
| Envío y seguimiento de revisión | 1 | Builds firmados | App en revisión/aprobada en ambas tiendas |

---

## 7. Riesgos (registro simplificado)

| Riesgo | Categoría | Prob. (1-5) | Impacto (1-5) | Score | Respuesta |
|---|---|---|---|---|---|
| API/backend no lista a tiempo para cada fase (dependencia externa crítica) | Schedule | 4 | 4 | 16 | **Mitigar** — mock layer (0.4) desde Fase 0, contrato de API acordado por adelantado |
| Inconsistencia visual entre pantallas (no seguir el skill `disenio_interfaz`) | Calidad | 3 | 3 | 9 | **Transferir/controlar** — checklist de pre-entrega obligatorio antes de cerrar cada épica |
| Complejidad subestimada en flujo de reserva (precio editable, roles, cupos) | Técnico | 3 | 4 | 12 (×1.2 = 14.4) | **Mitigar** — dividir en historias pequeñas (ya aplicado en §5.2), spike técnico si aparecen bloqueos |
| Certificados/publicación en stores (Fase 2) rechazados o demorados | Externo | 3 | 3 | 9 | **Aceptar con contingencia** — iniciar proceso de cuentas developer (Apple/Google) en paralelo, no al final |
| Alcance de pagos no definido (mencionado como riesgo legal en propuesta original) | Negocio | 2 | 5 | 10 | **Aceptar/Monitorear** — explícitamente fuera de alcance del frontend hasta definición de negocio |

---

## 8. RACI simplificado (workstream Frontend)

| Actividad | Dev Frontend | PM | Backend | UX/Diseño | Stakeholder (dueño producto) |
|---|---|---|---|---|---|
| Definición de contratos de API | C | A | R | I | I |
| Desarrollo de pantallas/componentes | R | I | C | C | I |
| Cumplimiento del design system (`disenio_interfaz`) | R | C | I | A | I |
| Priorización de épicas (WSJF) | C | A/R | I | I | C |
| Aprobación de alcance por fase | I | R | I | I | A |
| QA / criterios de aceptación | R | C | I | C | I |
| Publicación en tiendas | R | A | I | I | C |

R: Responsable · A: Aprueba · C: Consultado · I: Informado

---

## 9. KPIs / criterios de éxito por fase

**Fase 0**
- 100% de componentes base cumplen el checklist de pre-entrega del skill de diseño.
- Contraste de texto ≥4.5:1 verificado en dark mode.

**Fase 1 (MVP)**
- Flujo completo login → reserva → compartir evento funcional end-to-end sin datos mock.
- Responsive verificado en 375/768/1024/1440px en las 8 pantallas.
- Tiempo de carga inicial <2s en conexión 4G simulada.

**Fase 2 (Beta)**
- App instalable (APK/IPA) sin advertencias de firma.
- Reportes de administrador cuadran 100% con datos de detalle (sin discrepancias en totales).
- App aprobada en Play Store y App Store.

---

## 10. Cronograma estimado

| Fase | Story Points | Sprints (2 sem, vel. ~16 SP) | Duración |
|---|---|---|---|
| Fase 0 — Fundación | 8 | 1 | ~2 semanas |
| Fase 1 — MVP | 53 | 3–4 | ~6–8 semanas |
| Fase 2 — Beta | 42 | 3 | ~6 semanas |
| **Total** | **103** | **7–8** | **~14–16 semanas** |

*Estimación asume 2 desarrolladores frontend dedicados. Con 1 desarrollador, duplicar aproximadamente los tiempos.*

---

## 11. Principales mejoras respecto a la propuesta original

1. **Se agregó la Fase 0** (fundación técnica) — la propuesta original saltaba directo a pantallas sin definir scaffolding, design tokens, routing con guards de rol ni capa de API/mocks; sin esto, Fase 1 se habría rehecho a mitad de camino.
2. **Priorización objetiva (WSJF)** en vez de una lista secuencial fija — permite reordenar según valor/esfuerzo real y detectar que *Reservas de canchas*, siendo el core, conviene dividirse en historias más chicas.
3. **Desglose a nivel de tarea** con Story Points, dependencias y criterios de aceptación — la propuesta original solo listaba entregables de alto nivel ("Gestión de canchas y reservas") sin definir qué implica terminarlo.
4. **Registro de riesgos cuantificado** — la propuesta original solo mencionaba "Legal" y "Escalabilidad" como consideraciones sueltas; aquí se priorizan por probabilidad × impacto con respuesta concreta (ej. dependencia de API del backend, que es el riesgo más alto del roadmap de frontend).
5. **RACI y KPIs por fase** — ausentes en la propuesta original; necesarios para saber quién decide qué y cuándo una fase se considera "hecha" más allá de "Pendiente/Hecho".

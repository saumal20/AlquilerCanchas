# Roadmap General del Proyecto — Alquiler de Canchas Deportivas

**Rol:** Project Manager TI · **Reemplaza el enfoque de:** la v1 de este documento (que asumía un frontend funcional con mocks) · **Detalle de tareas de referencia:** [`docs/roadmap-frontend.md`](./roadmap-frontend.md) — se reutiliza parcialmente, ver §4.

---

## 1. Corrección de contexto

Aclaración del usuario: lo que se va a presentar **no es un MVP funcional**, es un **prototipo visual de venta** para un **socio/inversor** ("como un promotor de ventas"), con el objetivo de conseguir su **OK/aprobación (go/no-go)**. Recién **después de ese OK se construye el backend**, y las pruebas van al final.

Esto cambia el tipo de entregable de la Fase A: no es "frontend con datos mock y lógica real detrás" (lo que se planteó en la v1 de este documento), sino un **prototipo navegable de alta fidelidad** — se ve y se siente real, pero no necesita persistir datos, validar reglas de negocio complejas ni tener backend/API definida todavía. Es una herramienta de **pitch**, no de desarrollo de producto.

**Implicación clave como PM:** el criterio de éxito de la Fase A no es "cuántas historias de usuario se completaron", es **"el socio dice que sí"**. Eso cambia tanto el alcance (mucho más chico) como el criterio de aceptación (impacto de venta, no completitud funcional).

---

## 2. Nueva secuencia macro

```
Fase A — Prototipo de venta (no funcional)  →  [GATE: OK del socio]  →  Fase B — Backend + funcionalización  →  Fase C — Pruebas
        (prioridad actual, bajo costo)                                    (mayor esfuerzo)                        (cierre)
```

El **gate** es explícito a propósito: si el socio no aprueba, no se avanza a Fase B tal como está — se ajusta el prototipo (iteración de bajo costo) antes de comprometer el esfuerzo caro de backend. Este es justamente el valor de este orden: **evitar construir backend para algo que el socio todavía no validó.**

---

## 3. Fase A — Prototipo de venta (prioridad inmediata)

### 3.1 Qué SÍ incluye
- Todas las pantallas necesarias para **contar la historia del producto** de principio a fin, navegables (click-through), con datos **hardcodeados** (no mock API, no backend, no persistencia real).
- Aplicación completa del skill `disenio_interfaz` (dark mode OLED, tipografía, layout) — en un pitch, **la percepción visual de calidad importa tanto o más que la función**.
- Interacciones que "aparentan" funcionar (ej. al reservar, avanza a una pantalla de confirmación con datos fijos) sin lógica real detrás.

### 3.2 Qué NO incluye (se saca deliberadamente del alcance, vs. la v1 de este doc)
- Contrato de API formal, capa de mocks (`MSW`/`json-server`), guards de rol reales, validaciones de formulario robustas — todo esto es trabajo de *producto*, no de *venta*, y se hace en Fase B una vez hay luz verde.
- Pantallas de bajo impacto visual para un socio (ej. gestión avanzada de locales/roles, notificaciones) — no aportan al "wow" de la demo y si el tiempo es limitado, se recomienda cortarlas del pitch.

### 3.3 Selección de pantallas por impacto de venta

En un pitch a un socio, no todas las pantallas valen lo mismo. Prioricé por **impacto en la decisión de venta** en vez de valor de usuario final (variante del enfoque ICE, apropiado para decisiones rápidas de alcance):

| Pantalla | Impacto de venta | Incluir en pitch |
|---|---|---|
| Dashboard / Inicio | Alto — primera impresión | ✅ Sí |
| Reservas de cancha (listado + detalle + flujo) | Alto — es el corazón del negocio | ✅ Sí |
| Compartir evento + Google Maps | Alto — "efecto wow", fácil de demostrar | ✅ Sí |
| Partidos abiertos | Alto — diferencial vs. competencia | ✅ Sí |
| Login / Registro | Medio — necesario para dar contexto de flujo | ✅ Sí (versión simple) |
| Perfil de usuario | Medio — refuerza percepción de producto completo | ✅ Sí (versión simple) |
| Gestión de locales/roles (admin/ayudante) | Bajo para este público — es complejidad interna | ⏸️ Recomiendo cortar del pitch |
| Notificaciones/mensajes | Bajo — no se aprecia bien en una demo en vivo | ⏸️ Recomiendo cortar del pitch |

> Si el socio pregunta por administración de locales o notificaciones, alcanza con explicarlo verbalmente o mostrar un boceto rápido — no justifica el esfuerzo de construirlo antes del OK.

### 3.4 Tareas de Fase A

| # | Tarea | Esfuerzo (SP) | Criterio de aceptación |
|---|---|---|---|
| A.0 | Setup mínimo del proyecto (Ionic + Angular, sin Capacitor todavía) + design tokens del skill `disenio_interfaz` | 2 | Tema dark OLED, tipografía y colores aplicados globalmente |
| A.1 | Navegación entre pantallas (routing simple, sin guards de rol) | 1 | Se puede recorrer todo el flujo de la demo sin recargar |
| A.2 | Pantalla Dashboard/Inicio (datos fijos) | 1 | Accesos rápidos a Reservas y Partidos abiertos |
| A.3 | Login/Registro simplificado (UI, sin autenticación real) | 1 | Formulario visualmente completo, "login" avanza al Dashboard |
| A.4 | Perfil de usuario simplificado (UI, sin guardar cambios reales) | 1 | Vista editable, aunque no persista |
| A.5 | Reservas: listado + detalle + flujo de reserva (datos fijos) | 3 | Flujo completo termina en pantalla de confirmación |
| A.6 | Compartir evento + apertura en Google Maps (esto sí puede ser real — es solo un deep link, bajo esfuerzo) | 2 | Abre Maps con una ubicación de ejemplo real |
| A.7 | Partidos abiertos: listado + inscripción (datos fijos) | 2 | Inscripción "funciona" visualmente (cambia de estado en pantalla) |
| A.8 | Pulido general + checklist de pre-entrega del skill de diseño (responsive 375/768/1024/1440, hover, focus, contraste) | 1 | Checklist 100% cumplido antes de la demo |
| A.9 | Preparación y ejecución de la reunión de pitch con el socio | 1 | Se registra el resultado: OK / OK con condiciones / No |

**Total Fase A: 15 SP** (vs. 61 SP que tenía la v1 de este roadmap para un frontend funcional completo) — la diferencia es intencional: es un prototipo, no un producto.

---

## 4. GATE — Decisión del socio

Punto de control formal antes de seguir:

| Resultado | Acción |
|---|---|
| **OK** | Se arranca Fase B tal como está planeada en §5 |
| **OK con condiciones** | Se ajustan las tareas A.2–A.8 afectadas (iteración barata, sigue en Fase A) antes de pasar a Fase B |
| **No** | Se revisa la propuesta de valor con el socio antes de invertir más tiempo de desarrollo — no se avanza a backend |

---

## 5. Fase B — Backend + funcionalización del frontend (mayor esfuerzo, después del OK)

Acá es donde el prototipo de Fase A se convierte en producto real: se construye el backend **y** se conecta el frontend a él (reemplazando los datos hardcodeados), incluyendo lo que se cortó del pitch (gestión de locales/roles, notificaciones) y lo que quedaba pendiente del roadmap de frontend original.

| Orden | Épica | Incluye |
|---|---|---|
| 1 | Auth real (JWT, roles) | Reemplaza A.3 (login simulado) por autenticación real |
| 2 | Canchas y Reservas (API real) | Reemplaza A.5 por flujo con persistencia real, precio editable |
| 3 | Partidos abiertos (API real) | Reemplaza A.7 con cupos e inscripción reales |
| 4 | Gestión de locales y roles (admin/ayudante) | Se construye desde cero — no existía en el pitch |
| 5 | Notificaciones (FCM) | Se construye desde cero — no existía en el pitch |
| 6 | Perfil real (persistencia) | Reemplaza A.4 |
| 7 | Reportes/estadísticas/panel admin completo (Fase 2 del roadmap frontend original) | Requiere datos reales de las épicas anteriores |
| 8 | Mobile (Capacitor) + publicación en tiendas | Al cierre, cuando el producto ya es funcional |

> Al arrancar Fase B, se recomienda definir recién ahí el contrato de API y aplicar WSJF a estas épicas — no antes, para no invertir esfuerzo de "producto" en algo que todavía no tenía el OK del socio.

---

## 6. Fase C — Pruebas

Sin cambios respecto al planteo anterior: integración, regresión UI con datos reales, UAT, pruebas en dispositivo móvil real, previo a publicación en tiendas.

---

## 7. Qué pasa con `roadmap-frontend.md`

Ese documento sigue siendo válido como **detalle de trabajo funcional**, pero se ejecuta en **Fase B**, no antes:
- Su "Fase 0" (fundación técnica completa: guards, capa de mocks, componentes) se retoma tras el OK del socio.
- Su "Fase 1" (pantallas funcionales) es, en la práctica, la **versión real** de lo que en Fase A se construyó como apariencia.
- Su "Fase 2" (estadísticas, reportes, panel admin, publicación) se mantiene igual, al final de Fase B.

No hace falta reescribirlo — solo entender que ahora es el plan de **Fase B**, no de la fase inmediata.

---

## 8. RACI (macro)

| Actividad | Dev Frontend | PM | Backend | Socio |
|---|---|---|---|---|
| Construir prototipo de venta (Fase A) | R | C | I | I |
| Presentar pitch y decidir (Gate) | I | R | I | **A** |
| Construir backend y funcionalizar (Fase B) | R | C | R | I |
| Pruebas e integración (Fase C) | R | A | R | I |

---

## 9. Cronograma ajustado

| Fase | Contenido | Duración estimada* |
|---|---|---|
| Fase A — Prototipo de venta | 15 SP | ~1 sprint (~1.5–2 semanas) |
| **Gate** | Decisión del socio | 1 reunión |
| Fase B — Backend + funcionalización | Backend completo + frontend funcional real (Fase 0+1+2 de `roadmap-frontend.md`) | A re-estimar al arrancar, con el equipo de backend definido |
| Fase C — Pruebas | Integración, UAT, mobile | ~2–3 semanas |

*Fase A estimada con 1 dev frontend a tiempo completo, dado el alcance reducido.

---

## 10. Recomendación final del PM

1. Construir **solo** las 8 pantallas priorizadas en §3.3, con datos fijos — resistir la tentación de "adelantar" trabajo de backend o de pantallas secundarias antes del OK del socio.
2. Tratar la reunión de pitch (A.9) como una tarea del roadmap, no como un evento informal — su resultado (OK / condicionado / no) determina si Fase B arranca.
3. No definir el contrato de API todavía: en este contexto (venta, no desarrollo de producto), hacerlo antes del OK sería esfuerzo invertido en algo que puede cambiar según el feedback del socio.
4. Cuando llegue el OK, retomar `roadmap-frontend.md` como plan de Fase B y aplicarle el mismo ejercicio de WSJF + desglose al backend (§5), tal como se hizo con el frontend.

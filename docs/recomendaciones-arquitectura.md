# Recomendaciones de Arquitectura — Alquiler de Canchas Deportivas

**Rol:** Senior Architect · **Analiza:** [`docs/canchas.md`](./canchas.md) (propuesta original) + [`docs/roadmap-general.md`](./roadmap-general.md) + [`docs/roadmap-frontend.md`](./roadmap-frontend.md) (plan ya afinado por PM) · **Interactúa con:** el análisis previo del skill [`senior-pm`](../.claude/skills/senior-pm/SKILL.md)

---

## 1. Resumen ejecutivo

El plan de fases que ya armó el PM (prototipo de venta → OK del socio → backend → pruebas) es **sólido desde el punto de vista de negocio**. Desde arquitectura, el plan es correcto pero tiene **un punto ciego**: construir la Fase A (prototipo) de forma completamente desacoplada de cómo se integrará en Fase B puede generar el mismo rework que el roadmap ya identificó como riesgo (§7 de `roadmap-frontend.md`, riesgo de score 16), solo que ahora escondido dentro del propio frontend en vez de en el contrato de API.

La buena noticia: **la mitigación es casi gratis** si se aplica un patrón de diseño simple (inversión de dependencias) desde la Fase A. No requiere definir contrato de API ni retrasar el pitch — es compatible con la restricción del PM de mantener Fase A en ~15 SP. Ver §4.

También identifiqué **decisiones técnicas que la propuesta original deja abiertas ("Express o ASP.NET Core", "Azure o AWS")** — desde arquitectura, dejarlas sin decidir hasta Fase B es correcto (no bloquea el prototipo), pero conviene decidirlas con un criterio explícito quirúrgico, no por defecto. Ver §6.

---

## 2. Evaluación de las decisiones de arquitectura en `canchas.md`

| Decisión de la propuesta | Evaluación | Comentario |
|---|---|---|
| Frontend: Ionic + Angular + Capacitor | ✅ Correcta | Un solo código para web/PWA/APK/IPA es la elección adecuada dado que el objetivo final (Fase B) incluye publicación mobile. Coherente con que Fase A ya se construya en este stack (evita reescritura). |
| Backend: "Node.js con Express **o** ASP.NET Core" | ⚠️ Decisión pendiente sin criterio | Dejarla abierta hasta Fase B está bien, pero **no es indiferente**: tiene impacto directo en velocidad de desarrollo y en si se puede compartir tipos/DTOs con el frontend Angular (TypeScript). Ver framework de decisión en §6.1. |
| Base de datos: PostgreSQL | ✅ Correcta | Relacional es lo apropiado dado el dominio (reservas, cupos, reportes con agregaciones) — evitar la tentación de NoSQL "porque es más moderno". |
| Autenticación: JWT + OAuth opcional | ✅ Correcta, con matiz | Falta definir **dónde se almacena el token en mobile** — `localStorage` no es seguro en un build Capacitor. Ver §5.3. |
| Notificaciones: Firebase Cloud Messaging | ✅ Correcta | Estándar de facto para push cross-platform con Capacitor. |
| Hosting: "Azure **o** AWS" | ⚠️ Decisión pendiente sin criterio | Igual que el backend: no bloquea Fase A, pero conviene atarla a la decisión de framework backend (§6.1) en vez de decidirla aislada. |

**Punto no cubierto en la propuesta original ni en los roadmaps:** el dominio tiene una condición de carrera real — "Partidos abiertos" con cupos limitados donde varios usuarios pueden inscribirse simultáneamente. Si dos personas confirman el último cupo al mismo tiempo, sin control de concurrencia se puede sobrevender el partido. Es un riesgo técnico de Fase B, no de Fase A, pero debe quedar registrado para no descubrirlo tarde. Ver §5.4.

---

## 3. Evaluación del plan de fases (cruce con `senior-pm`)

El PM definió correctamente que Fase A no necesita contrato de API ni capa de mocks formal (`roadmap-general.md` §3.2), porque eso es "esfuerzo de producto" antes de tener el OK del socio. **Coincido en no invertir en documentación de contrato (OpenAPI) todavía.**

Pero hay una diferencia entre **"no definir el contrato formalmente"** y **"no estructurar el código para que el reemplazo sea barato"**. Esto último es una práctica de arquitectura estándar (inversión de dependencias) que no cuesta tiempo extra medible — es la forma normal de escribir un servicio Angular, solo con un paso adicional de organización. La recomiendo como **ajuste de bajo costo a la Fase A**, no como fase nueva.

---

## 4. Recomendación central: aislar los datos falsos detrás de una interfaz (bajo costo, alto retorno)

**Problema si no se hace:** en `roadmap-frontend.md` A.5/A.7, el flujo de reserva e inscripción a partidos "avanza a confirmación con datos fijos". Si esa lógica queda escrita directamente en los componentes de pantalla, en Fase B hay que tocar cada componente para conectarlo al backend real — es exactamente el tipo de rework que el roadmap ya marcó como el riesgo más alto (16/19.2 en `roadmap-frontend.md` §7).

**Solución de bajo costo:** en Angular, definir un *token de inyección* (interfaz + servicio) por dominio (`ReservaService`, `PartidoService`, `AuthService`, etc.) con una implementación "fake" en Fase A (devuelve datos hardcodeados, simulando latencia con un `delay()`) y, en Fase B, una implementación real que llama al backend — **sin tocar ningún componente de pantalla**, solo se cambia qué implementación se inyecta.

```typescript
// Fase A y Fase B comparten esta interfaz — se define en ~30 min, no es "contrato de API"
export interface ReservaService {
  listarCanchas(filtros?: FiltroCanchas): Observable<Cancha[]>;
  reservar(canchaId: string, datos: DatosReserva): Observable<Reserva>;
}

// Fase A: implementación falsa (esto es lo que ya se iba a construir en A.5)
@Injectable()
export class ReservaServiceFake implements ReservaService {
  listarCanchas() { return of(CANCHAS_MOCK).pipe(delay(300)); }
  reservar(canchaId: string, datos: DatosReserva) {
    return of({ id: 'demo-1', estado: 'confirmada', ...datos }).pipe(delay(500));
  }
}

// Fase B: se agrega esta clase nueva, se cambia el provider, cero cambios en componentes
@Injectable()
export class ReservaServiceHttp implements ReservaService {
  constructor(private http: HttpClient) {}
  listarCanchas(filtros?: FiltroCanchas) { return this.http.get<Cancha[]>('/api/canchas', { params: filtros }); }
  reservar(canchaId: string, datos: DatosReserva) { return this.http.post<Reserva>(`/api/canchas/${canchaId}/reservas`, datos); }
}
```

**Impacto en el roadmap:** no agrega story points nuevos — es cómo se debería escribir A.5/A.7 de todas formas. Solo agrego **un criterio de aceptación** a esas tareas existentes: *"la pantalla consume los datos a través de un servicio inyectado, no hardcodeados inline"*. Recomiendo que el PM actualice `roadmap-frontend.md` A.5 y A.7 con esta nota, sin cambiar el esfuerzo estimado.

Esto también define de forma implícita (sin documentarlas como contrato formal) las **entidades de dominio** que Fase B necesitará: `Usuario`, `Local`, `Cancha`, `Reserva`, `Partido`. Definir esas interfaces TypeScript en Fase A es prácticamente gratis (se necesitan igual para tipar los datos hardcodeados) y se convierten en la base del modelo de datos de Postgres en Fase B.

---

## 5. Riesgos técnicos a registrar (complementa §7 de `roadmap-frontend.md`)

### 5.1 Concurrencia en cupos de "Partidos abiertos"
**Riesgo:** dos usuarios inscribiéndose al último cupo simultáneamente pueden sobrevender el partido si Fase B no controla concurrencia.
**Mitigación (a aplicar en Fase B, no ahora):** transacción con bloqueo optimista (columna `version` o `cupos_disponibles` con `UPDATE ... WHERE cupos_disponibles > 0` atómico) en vez de leer-y-luego-escribir desde el backend.

### 5.2 Ambigüedad de stack backend/hosting
**Riesgo:** decidir "sobre la marcha" al arrancar Fase B sin criterio puede llevar a una elección que no aproveche que el frontend ya es 100% TypeScript.
**Mitigación:** framework de decisión explícito en §6.1, a resolver como primera tarea de Fase B (no ahora).

### 5.3 Almacenamiento inseguro de tokens JWT en mobile
**Riesgo:** si en Fase B se usa `localStorage` para el JWT en el build Capacitor, el token queda expuesto a ataques dentro del WebView (menor aislamiento que un navegador real).
**Mitigación:** usar `@capacitor/preferences` o un plugin de secure storage para el token en builds nativos; `localStorage` solo aceptable para la versión web pura.

### 5.4 Multi-tenancy de "Locales"
**Riesgo:** con varios locales en la misma plataforma, un diseño de datos descuidado puede dejar que un admin de un local vea/edite canchas de otro.
**Mitigación (Fase B):** modelo de "tenant lógico" — toda tabla relevante (`canchas`, `reservas`, `partidos`) lleva `local_id`, y toda query del backend se filtra por el local del usuario autenticado (nunca confiar en un `local_id` que venga del frontend sin validar contra el JWT).

Ninguno de estos 4 riesgos bloquea Fase A — se documentan para que Fase B no los descubra tarde.

### 5.5 Estructura del repositorio y naming (aplicado durante HU-00)

**Contexto:** al ejecutar HU-00 se generó el proyecto Ionic+Angular en una carpeta `frontend/` en la raíz del repo, con nombres por defecto del scaffold (`package.json` → `"name": "frontend"`, `capacitor.config.ts` → `appId: "io.ionic.starter"`, `appName: "frontend"`). Correcto, pero poco preparado para lo que ya sabemos que viene: Fase B agrega un backend (`recomendaciones-arquitectura.md` §6.1) y potencialmente un paquete de tipos de dominio compartidos (§4).

**Decisión:** adoptar desde ahora una estructura de **monorepo por convención `apps/`** (patrón estándar Nx/Turborepo), en vez de carpetas sueltas en la raíz:

```
alquilerCancha/
├── apps/
│   └── frontend/        ← movido aquí (antes: /frontend)
│       └── (Ionic + Angular + Capacitor)
│   └── backend/         ← Fase B, cuando se cree
├── docs/
└── .claude/
```

**Por qué ahora y no después:** es el momento de menor costo — ningún documento ni configuración externa referenciaba todavía la ruta `frontend/`. Postergarlo hasta que exista más código (rutas de CI, imports, scripts) hubiera sido un refactor caro por algo que no aporta funcionalidad.

**Cambios aplicados:**
| Antes | Ahora | Motivo |
|---|---|---|
| `/frontend/` | `/apps/frontend/` | Deja espacio explícito para `apps/backend/` en Fase B sin volver a mover carpetas |
| `package.json` → `"name": "frontend"` | `"name": "canchas-frontend"` | Nombre genérico del scaffold no identifica el proyecto; con varios `apps/*` en el futuro, `"frontend"` a secas es ambiguo |
| `capacitor.config.ts` → `appId: "io.ionic.starter"` | `appId: "com.canchasapp.frontend"` | `io.ionic.starter` es el placeholder que trae el CLI por defecto — **no es válido para publicar en Play Store/App Store** (Fase 2 de `roadmap-frontend.md`) y el `appId` no se puede cambiar después de publicar sin que la tienda lo trate como una app nueva. Se corrige ahora que no cuesta nada. |
| `capacitor.config.ts` → `appName: "frontend"` | `appName: "Canchas App"` | Es el nombre que ve el usuario debajo del ícono en su dispositivo — no puede quedar como el nombre técnico de la carpeta |

**Nota:** `com.canchasapp` es un dominio de ejemplo (todavía no hay dominio real registrado para el producto). Cuando el proyecto tenga nombre comercial y dominio definitivos, actualizar el `appId` **antes** de la primera publicación en tiendas — después de publicar, cambiarlo obliga a re-publicar como app nueva y perder reviews/instalaciones.

### 5.6 Separación `AuthService` vs. `UsuarioService` (aplicado durante HU-03)

**Contexto:** al construir HU-03 (Perfil) se detectó que la historia original no cubría cambio de contraseña, foto ni notificaciones — solo datos básicos — pese a que `canchas.md` sí los incluía en "Perfil editable (datos, clave, foto, notificaciones)". Al corregirlo, surge una decisión de diseño: ¿el cambio de contraseña es un método más de `UsuarioService.actualizarPerfil()`, o algo aparte?

**Decisión:** el cambio de contraseña se implementó como `AuthService.cambiarClave()`, **no** como un campo más de `UsuarioService`. Los datos de perfil (nombre, correo, celular, DNI, foto, preferencia de notificaciones) y las credenciales de acceso son dos límites de seguridad distintos:

- En Fase B, actualizar el nombre de un usuario y cambiar su contraseña **no deberían ser la misma llamada ni el mismo nivel de exigencia de seguridad** — cambiar contraseña típicamente revalida la contraseña actual, puede invalidar sesiones activas en otros dispositivos, y merece su propio endpoint (`POST /auth/cambiar-clave`) separado de `PATCH /usuarios/:id` (datos de perfil).
- Mezclarlos en un único servicio/endpoint en Fase A haría que, al llegar Fase B, hubiera que partir la función igual — es más barato separarlos ahora que los datos son falsos, que después con datos reales y validaciones de por medio.

**Aplicado en el prototipo (Fase A):** `AuthServiceFake.cambiarClave()` no valida nada real (no hay contraseña real que verificar), solo simula éxito — coherente con que Fase A no tiene backend. El punto de la separación no es la validación en sí (eso es Fase B), es que el **componente de Perfil ya invoca dos servicios distintos con responsabilidades distintas**, para que Fase B solo tenga que implementar cada uno contra su endpoint correspondiente.

### 5.7 Bug real: `color="cta"` no pintaba (detectado al reportar "la página sale negra")

**Qué pasó:** el usuario reportó la pantalla de Perfil en negro. Verificación con Playwright headless (`chromium`, sin caché de navegador) mostró las 5 pantallas renderizando sin errores de consola ni de red — es decir, no había un bug que dejara la app completamente negra. Lo que sí había: los botones CTA (`color="cta"`) se renderizaban con fondo transparente en vez de naranja, porque **Ionic solo genera la clase utilitaria `.ion-color-{nombre}` para los colores nativos de su paleta** (`primary`, `secondary`, `tertiary`, `success`, etc.) — un nombre custom como `"cta"` no tiene esa regla, así que `--ion-color-base` quedaba sin resolver y el botón caía a estilo transparente por defecto.

**Fix aplicado:** se agregó manualmente en `variables.scss` la clase `.ion-color-cta` que mapea `--ion-color-cta` → `--ion-color-base` (mismo patrón que usa `@ionic/angular/css/core.css` para los colores nativos), en vez del workaround anterior de alias `--ion-color-tertiary: var(--ion-color-cta)` (que obligaba a recordar escribir `color="tertiary"` en vez de `color="cta"` — frágil y poco legible). Verificado con Playwright: el botón ahora renderiza `background-color: rgb(249, 115, 22)` (`#f97316`) como corresponde.

**Causa probable de lo que el usuario vio como "negro":** con el CTA invisible, la pantalla de Login (que es mayormente fondo oscuro + un botón que no se distinguía) puede percibirse como "no cargó nada" a primera vista, sumado a que el dev server se reinició varias veces durante la sesión (cada reinicio corta el WebSocket de live-reload de la pestaña ya abierta, lo que puede dejarla mostrando contenido viejo o en blanco hasta refrescar). Recomendación: siempre que se reinicie el servidor de desarrollo, refrescar la pestaña (no confiar en el auto-reload) antes de evaluar visualmente un cambio.

### 5.8 Bug real: datos async que no se pintan (Ionic detacha la detección de cambios)

**Qué pasó:** al construir HU-04 (Dashboard) se verificó con Playwright + la API de Angular DevTools (`window.ng.getComponent()`) que el dato llegaba correctamente al componente (`nombreUsuario` tenía el valor esperado en la instancia), pero el `<h1>` en pantalla seguía mostrando el texto viejo indefinidamente — no era un problema de timing (probado esperando hasta 2.5s).

**Causa:** `IonicRouteStrategy` (el `RouteReuseStrategy` que Ionic usa para cachear páginas de tabs y mejorar el rendimiento de navegación) detacha el `ChangeDetectorRef` de las páginas gestionadas por `IonRouterOutlet`. Mientras el dato llegue de forma síncrona o dentro del ciclo normal de detección de cambios, no se nota. Pero acá el dato llega **después de un `delay()` asíncrono** (el `UsuarioServiceFake` simula latencia de red) — para cuando la suscripción se resuelve, la vista ya está detached y no vuelve a pintarse sola.

**Fix aplicado:** inyectar `ChangeDetectorRef` y llamar `.markForCheck()` dentro de cada callback de `.subscribe()` que actualiza estado del componente. Se aplicó en Dashboard (donde se detectó) y preventivamente en Perfil y Login, que tienen el mismo patrón (servicio inyectable + `delay()` + actualización de estado del componente).

**Por qué importa para lo que sigue:** HU-05 (Reservas), HU-06 (Compartir) y HU-07 (Partidos abiertos) van a tener el mismo patrón — un servicio fake con `delay()` actualizando el componente. Sin este fix, cualquiera de esas historias puede parecer "no funciona" en la demo aunque el código esté bien. Por eso se agregó como ítem del Definition of Done (`roadmap-consolidado-frontend.md` §3), no solo como un fix puntual.

---

## 6. Decisiones técnicas a resolver al arrancar Fase B

### 6.1 Backend: Node.js/Express (o NestJS) vs. ASP.NET Core

| Criterio | Node.js/Express o NestJS | ASP.NET Core |
|---|---|---|
| Consistencia de lenguaje con el frontend (Angular/TS) | ✅ Mismo lenguaje (TypeScript) en todo el stack — se pueden compartir interfaces de dominio (las mismas de §4) entre frontend y backend | ❌ C#, requiere duplicar tipos/DTOs |
| Curva de aprendizaje si el equipo ya sabe Angular/TS | ✅ Baja | ⚠️ Media/alta si no hay experiencia previa en .NET |
| Ecosistema para tiempo real (control de cupos, notificaciones) | ✅ Fuerte (Socket.io, colas con BullMQ) | ✅ También fuerte (SignalR), pero es otro paradigma a aprender |
| Rendimiento en cargas muy altas (miles de reservas concurrentes) | ⚠️ Bueno, requiere diseño cuidadoso | ✅ Ligeramente superior out-of-the-box |
| Afinidad de hosting | AWS, GCP, cualquiera (containers) | Azure (integración nativa) |

**Recomendación:** dado que el frontend ya es 100% TypeScript (Angular) y el equipo actual es pequeño (según el roadmap, 1-2 devs), **Node.js con NestJS** (Express con estructura, más cercano en filosofía a Angular — módulos, DI, decoradores) es la opción de menor fricción: permite compartir las interfaces de dominio definidas en §4 entre frontend y backend sin duplicar trabajo, y el equipo no necesita aprender un segundo lenguaje. ASP.NET Core sería preferible solo si ya hay experiencia previa fuerte en .NET en el equipo — de ser así, avisar para reevaluar.

### 6.2 Hosting: atado a la decisión anterior
Si se elige Node.js → cualquier proveedor (AWS/GCP/Azure) es viable; recomiendo evaluar por costo real de PostgreSQL administrado (RDS, Cloud SQL, Azure Database) más que por la capa de cómputo. Si se elige ASP.NET Core → Azure tiene menor fricción de integración.

---

## 7. Testing (no cubierto en los roadmaps existentes)

Ni `roadmap-frontend.md` ni `roadmap-general.md` definen estrategia de pruebas automatizadas — solo QA manual (Fase C). Recomendación mínima a incorporar cuando arranque Fase B:
- **Unit tests** de servicios (`ReservaServiceHttp`, lógica de precio editable) con Jest/Angular Testing Library.
- **E2E** de los 2 flujos críticos (reserva, inscripción a partido abierto) con Playwright o Cypress — son los que tienen mayor impacto de negocio si se rompen.
- No se recomienda invertir en cobertura exhaustiva antes de Fase B — sería sobre-ingeniería para el tamaño actual del proyecto.

---

## 8. Síntesis de recomendaciones (para que el PM las priorice)

| # | Recomendación | Fase | Costo | Prioridad |
|---|---|---|---|---|
| 1 | Aislar datos falsos detrás de interfaces inyectables (§4) | A (ajuste, sin SP nuevos) | Ninguno adicional | 🔴 Alta — hacerlo ahora es gratis, hacerlo después es rework |
| 2 | Definir interfaces TypeScript de dominio (`Usuario`, `Cancha`, `Reserva`, `Partido`, `Local`) | A (ajuste, sin SP nuevos) | Ninguno adicional | 🔴 Alta |
| 3 | Decidir framework backend con criterio explícito (§6.1) | Inicio de B | Bajo (1 reunión técnica) | 🟡 Media — no bloquea A |
| 4 | Diseñar control de concurrencia para cupos (§5.1) | Diseño técnico de B | Medio | 🟡 Media — bloquea solo la épica de Partidos abiertos en B |
| 5 | Secure storage de JWT en mobile (§5.3) | B, épica Auth | Bajo | 🟡 Media |
| 6 | Modelo multi-tenant por `local_id` (§5.4) | Diseño de datos de B | Bajo (si se decide desde el modelado inicial) | 🔴 Alta — mucho más caro de corregir si se agrega tarde |
| 7 | E2E de flujos críticos (§7) | B, antes de C | Medio | 🟡 Media |

**Recomendación final:** incorporar los ítems 1 y 2 como ajuste inmediato a `roadmap-frontend.md` (sin costo adicional); tratar los ítems 3–7 como insumos para cuando el PM aplique el mismo ejercicio de WSJF a las épicas de Fase B (como ya está previsto en `roadmap-general.md` §5).

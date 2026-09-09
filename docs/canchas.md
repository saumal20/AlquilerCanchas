# ?? Propuesta de Aplicacion de Alquiler de Canchas Deportivas

## ?? Objetivo
Desarrollar una aplicacion web/movil que permita a los usuarios **alquilar canchas deportivas** (futbol, voley, basquet) en fechas y horarios especificos, gestionar la participacion de amigos/equipos y facilitar la organizacion de partidos por parte de los locales, con un frontend **amigable, responsive y fluido**.

---

## ?? Funcionalidades principales

### Usuarios
- Registro/login (correo, celular, DNI opcional).  
- Perfil editable (datos, clave, foto, notificaciones).  
- Reservas de canchas (precio editable al momento del alquiler).  
- Compartir eventos con datos de cancha (nombre, direccion, costo) y abrir ubicacion en Google Maps.  
- Inscripcion en partidos abiertos con precio unitario.  
- Filtros de busqueda por **local, deporte y ciudad**.  
- Ficha por disciplina con calificaciones.  
- Estadisticas de jugadores (por ahora goles + evaluaciones).  

### Locales y roles
- Varios locales registrados en la plataforma.  
- Roles diferenciados:  
  - **Administrador:** crea/modifica canchas, define caracteristicas (deporte, jugadores, suplentes, precio base).  
  - **Ayudantes:** registran alquileres y gestionan reservas, pero no modifican canchas.  
- Partidos publicados visibles solo hasta el inicio.  

### Administradores
- Reportes:  
  - Cantidad de alquileres.  
  - Tiempo total de uso de canchas.  
  - Ingresos obtenidos (precios base + modificaciones).  
  - Ingresos por partidos abiertos (precio unitario).  
- Panel de administracion amigable y claro.  

---

## ?? Arquitectura sugerida

- **Frontend:** Ionic + Angular + Capacitor (web, PWA, APK/IPA).  
- **Backend:** Node.js con Express o ASP.NET Core.  
- **Base de datos:** PostgreSQL (Usuarios, Locales, Roles, Canchas, Reservas, Partidos, Estadisticas, Reportes).  
- **Autenticacion:** JWT + OAuth opcional.  
- **Notificaciones:** Firebase Cloud Messaging.  
- **Hosting:** Azure o AWS.  

---

# ?? Fase 1 ¡V MVP Rapido (Validacion inicial)

### ?? Objetivo
Validar la idea con lo minimo funcional: reservas, compartir eventos con datos basicos, perfil simple y roles minimos.

### ?? Funcionalidades incluidas
- Registro/login basico.  
- Perfil editable (datos, clave, foto).  
- Gestion de canchas y reservas (precio editable).  
- Compartir evento/partido con datos de cancha y Google Maps.  
- Partidos abiertos (precio unitario, visibles hasta inicio).  
- Roles basicos (admin y ayudantes).  

### ?? Roadmap MVP Rapido (Trazable)

| No | Entregable | Estado |
|----|------------|--------|
| ? 1 | Frontend web (Ionic + Angular) | ? Pendiente |
| ? 2 | Registro/login | ? Pendiente |
| ? 3 | Perfil editable | ? Pendiente |
| ? 4 | Gestion de canchas y reservas | ? Pendiente |
| ? 5 | Compartir evento con datos y Google Maps | ? Pendiente |
| ? 6 | Partidos abiertos (precio unitario, visibles hasta inicio) | ? Pendiente |
| ? 7 | Roles basicos (admin y ayudantes) | ? Pendiente |

---

## ??? Pantallas del Frontend ¡V MVP Rapido
El frontend se construira aplicando las recomendaciones del skill `@.claude/skills/diseno_interfaz/SKILL.md`:

- **Pantalla de Login / Registro**  
- **Perfil de Usuario basico**  
- **Reservas de Canchas**  
- **Compartir Evento / Partido**  
- **Gestion minima de Locales y Roles**  
- **Partidos Abiertos**  

### ?? Pantallas adicionales agregadas
Para mejorar la experiencia del MVP se anaden dos pantallas mas:  
- **Inicio / Dashboard basico** ¡÷ vista inicial despues del login, acceso rapido a reservas, perfil y partidos abiertos.  
- **Notificaciones / Mensajes** ¡÷ avisos de confirmacion de reservas y recordatorios de partidos (integracion con Firebase Cloud Messaging).  

---

# ?? Fase 2 ¡V MVP Ampliado (Producto Beta)

### ?? Objetivo
Expandir funcionalidades para enriquecer la experiencia: estadisticas, reportes, filtros avanzados y paneles completos.

### ?? Funcionalidades adicionales
- Ficha de usuario por disciplina con calificaciones.  
- Estadisticas de jugadores (goles + evaluaciones).  
- Filtros de busqueda avanzados (local, deporte, ciudad).  
- Reportes para administradores (alquileres, tiempo, ingresos).  
- Panel de administracion completo para locales.  
- Adaptacion del frontend a moviles (APK/IPA con Capacitor).  
- Publicacion en Play Store/App Store.  

### ?? Roadmap MVP Ampliado (Trazable)

| No | Entregable | Estado |
|----|------------|--------|
| ? 1 | Ficha de usuario por disciplina | ? Pendiente |
| ? 2 | Estadisticas de jugadores (goles + evaluaciones) | ? Pendiente |
| ? 3 | Filtros de busqueda (local, deporte, ciudad) | ? Pendiente |
| ? 4 | Reportes para administradores | ? Pendiente |
| ? 5 | Panel de administracion avanzado | ? Pendiente |
| ? 6 | Frontend movil (APK/IPA con Capacitor) | ? Pendiente |
| ? 7 | Publicacion en Play Store/App Store | ? Pendiente |

---

## ?? Consideraciones
- **Legal:** cumplimiento normativo si se integra pago.  
- **Escalabilidad:** arquitectura abierta para mas deportes y locales.  
- **UX:** interfaz amigable, responsive y fluida, con paneles diferenciados para usuarios, administradores y ayudantes.  
- **Reportes y estadisticas:** claros, exportables y utiles para la gestion.  

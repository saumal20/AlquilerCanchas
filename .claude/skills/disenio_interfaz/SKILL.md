---
name: disenio_interfaz
description: "Sistema de diseño recomendado para Canchas Admin: layout minimalista de una sola columna, modo oscuro (OLED), paleta de colores, tipografía Fira Code/Fira Sans y checklist de pre-entrega. Usar al crear o revisar cualquier pantalla, componente o landing del panel de administración de canchas."
---

# Diseño de Interfaz - Canchas Admin

Sistema de diseño de referencia para el proyecto **Canchas Admin**. Aplicar estas guías al crear, revisar o modificar cualquier interfaz (landing pages, dashboards, formularios, paneles admin) dentro de este proyecto.

## Cuándo aplicar

- Al diseñar o maquetar una nueva pantalla, sección o componente.
- Al revisar código de UI existente en busca de inconsistencias visuales.
- Al elegir colores, tipografía o layout para una nueva feature.

## 1. Patrón de layout: Minimal Single Column

- **Objetivo:** conversión, un único CTA como foco.
- **Características:** tipografía grande, mucho espacio en blanco, sin clutter de navegación, mobile-first.
- **CTA:** botón grande y centrado.
- **Estructura de secciones (en orden):**
  1. Titular (hero headline)
  2. Descripción corta
  3. Bullets de beneficios (máximo 3)
  4. CTA
  5. Footer

## 2. Estilo visual: Dark Mode (OLED)

- Tema oscuro, bajo consumo de luz, alto contraste, negro profundo / azul medianoche.
- Cómodo para la vista, eficiente en energía en pantallas OLED.
- Ideal para: apps de modo nocturno, plataformas técnicas/dashboards, prevención de fatiga visual.
- Rendimiento: excelente. Accesibilidad objetivo: WCAG AAA.

## 3. Paleta de colores

| Rol | Color | Hex |
|---|---|---|
| Primario | Azul | `#3B82F6` |
| Secundario | Azul claro | `#60A5FA` |
| CTA | Naranja | `#F97316` |
| Fondo | Gris muy claro (modo claro) | `#F8FAFC` |
| Texto | Gris azulado oscuro | `#1E293B` |

**Nota:** fondo oscuro como base + alertas en rojo/verde + azul como color de confianza.

## 4. Tipografía: Fira Code / Fira Sans

- **Mood:** dashboard, datos, analítica, técnico, preciso.
- **Mejor para:** dashboards, analítica, visualización de datos, paneles admin.
- **Google Fonts:** https://fonts.google.com/share?selection.family=Fira+Code:wght@400;500;600;700|Fira+Sans:wght@300;400;500;600;700
- **CSS Import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
  ```

## 5. Efectos clave

- Glow mínimo en texto: `text-shadow: 0 0 10px ...`
- Transiciones suaves de oscuro a claro.
- Baja emisión de blanco puro (usar grises/azules oscuros en vez de negro/blanco puro).
- Alta legibilidad, foco (focus) siempre visible.

## 6. Anti-patrones a evitar

- Modo claro como default.
- Renderizado lento.

## 7. Checklist de pre-entrega

Antes de dar por terminada cualquier pantalla o componente, verificar:

- [ ] Ningún emoji usado como ícono (usar SVG: Heroicons/Lucide)
- [ ] `cursor-pointer` en todos los elementos clicables
- [ ] Estados hover con transiciones suaves (150-300ms)
- [ ] En modo claro: contraste de texto mínimo 4.5:1
- [ ] Estados de foco visibles para navegación por teclado
- [ ] `prefers-reduced-motion` respetado
- [ ] Responsive verificado en: 375px, 768px, 1024px, 1440px

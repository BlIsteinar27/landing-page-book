# Correcciones de la auditoría UI — Plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usar `executing-plans` (inline, con checkpoints) o `subagent-driven-development`. Los pasos usan checkboxes (`- [ ]`). **No ejecutar hasta que el usuario lo autorice explícitamente.**

**Objetivo:** Resolver los hallazgos de la auditoría `better-interface` (accesibilidad, layout, writing, typography, colors, ui) y `react-code-review-ts` sin alterar la paleta de marca.

**Arquitectura:** Cambios incrementales por dominio, cada tarea deja la landing compilando. Movimiento centralizado en `MotionProvider` + `motion-tokens.ts`; foco de diálogos centralizado en un hook `useDialog`; colores solo vía tokens existentes de `globals.css`.

**Stack:** Next 16.2.9 · React 19.2.4 · Tailwind 4 · motion 14.1.0 · lucide-react 1.55.0 · TypeScript strict.

**Restricciones del usuario (no negociables):**

- La paleta (`@theme` en `src/app/globals.css`) **no se modifica**. Se permite usar otros tokens existentes o crear alias con el **mismo valor**.
- Iconos de UI: **solo `lucide-react`**. Los logos de marca (`InstagramIcon`, `TikTokIcon`, `WhatsAppIcon`) se quedan porque Lucide 1.x eliminó los iconos de marcas.
- El diálogo de lore debe verse igual; el scroll es solo para el caso borde.

**Verificación disponible:** no hay tests. Cada tarea cierra con `npm run lint` + `npm run build` y el checklist manual indicado.

---

## Decisiones tomadas

| ID  | Decisión                                                 | Resultado                                                                                                                                                                                                       |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | React Compiler                                           | **Se mantiene activo.** Tarea 1 eliminada.                                                                                                                                                                      |
| D2  | Tipografía (Starlight Rune, Inter, Playfair)             | **No se toca.** La forma en que se ve el texto (fuentes, pesos, tamaños, interlineado, ajuste de línea, mayúsculas y comillas) es identidad gráfica. Tarea 11 reducida a un cambio semántico sin efecto visual. |
| D3  | Textos de la autora (sinopsis, títulos, nombres, fechas) | **No se tocan.** Solo se modifica el microcopy de la interfaz: instrucciones, botones, `aria-label` y página de error.                                                                                          |
| D4  | Borrado de código sin uso                                | Confirmación del usuario archivo por archivo antes de borrar.                                                                                                                                                   |

---

## Mapa de archivos

| Archivo                                                     | Acción    | Responsabilidad                                                    |
| ----------------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `src/components/MotionProvider.tsx`                         | Crear     | `MotionConfig reducedMotion="user"` global                         |
| `src/hooks/useDialog.ts`                                    | Crear     | Foco inicial, Escape, restaurar foco, `inert` en `<main>`          |
| `src/config/motion-tokens.ts`                               | Modificar | Única fuente de valores de movimiento                              |
| `src/app/layout.tsx`                                        | Modificar | Provider, `viewport`                                               |
| `src/app/globals.css`                                       | Modificar | reduced-motion, scroll-padding, tap-highlight (sin tocar `@theme`) |
| `src/components/overlays/*`                                 | Modificar | Semántica de diálogo, iconos Lucide, salidas, tokens               |
| `src/components/sections/**`                                | Modificar | Movimiento, contraste, copy, layout                                |
| `src/components/ui/*`                                       | Modificar | Tap 0.96, transiciones, iconos                                     |
| `src/hooks/useTouchGestures.ts`                             | Modificar | Callbacks estables                                                 |
| `src/components/StickyCTA.tsx`, `CTAVisibilityProvider.tsx` | Modificar | Estado derivado, parpadeo inicial, React 19 Context                |

---

### Tarea 0: Preparación

- [ ] **Paso 1:** Crear rama: `git checkout -b fix/auditoria-ui`
- [ ] **Paso 2:** Línea base: `npm run lint` y `npm run build`. Anotar warnings existentes para no confundirlos con regresiones.
- [ ] **Paso 3:** Commit del upgrade ya hecho (motion 14.1.0, lucide-react 1.55.0):

```bash
git add package.json package-lock.json
git commit -m "chore: actualizar motion a 14.1.0 y lucide-react a 1.55.0"
```

---

### Tarea 2: Movimiento reducido (HIGH · accessibility/ui)

**Files:** Create `src/components/MotionProvider.tsx` · Modify `src/app/layout.tsx:86-92`, `src/app/globals.css:71-73`, `src/components/sections/hero/HeroTitle.tsx:14-22`, `src/components/sections/personajes/PersonajesSection-client.tsx:115-118`, `src/components/sections/personajes/DivineParticles.tsx`

- [ ] **Paso 1: Crear el provider**

```tsx
"use client";

import { MotionConfig } from "motion/react";
import { ReactNode } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Paso 2: Envolver en `layout.tsx`**

```tsx
<body className="min-h-full flex flex-col">
  <MotionProvider>
    <CTAVisibilityProvider>
      {/* skip-link y main sin cambios */}
    </CTAVisibilityProvider>
  </MotionProvider>
</body>
```

- [ ] **Paso 3: `globals.css`**, sustituir el bloque `html { scroll-behavior: smooth; }` por:

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Paso 4: `blur` no lo cubre `MotionConfig`.** En `HeroTitle.tsx` usar `useReducedMotion()`:

```tsx
const reduce = useReducedMotion();
const heroTitleVariants = {
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: heroTitleTransition,
  },
};
```

Aplicar el mismo patrón a `PersonajesSection-client.tsx:115-118` (filtro brightness/blur).

- [ ] **Paso 5:** En `DivineParticles.tsx`: `if (useReducedMotion()) return null;` (son partículas decorativas en bucle).
- [ ] **Paso 6: Verificación manual.** DevTools → Rendering → `prefers-reduced-motion: reduce`. No debe moverse nada: marquee, pulsos, flotación, partículas ni flechas. Los fundidos de opacidad sí se mantienen.
- [ ] **Paso 7:** lint + build + commit `fix(a11y): respetar prefers-reduced-motion`.

---

### Tarea 3: Tokens de movimiento (MEDIUM · ui)

**Files:** Modify `src/config/motion-tokens.ts`

- [ ] **Paso 1: Reescribir el archivo**

```ts
import type { Transition, Variants } from "motion/react";

export const motionTokens = {
  scale: { hover: 1.02, tap: 0.96 },
  translate: { cardHover: -4, arrowHover: 4 },
  press: { duration: 0.15, ease: "easeOut" } satisfies Transition,
  spring: { type: "spring", duration: 0.3, bounce: 0 } satisfies Transition,
  duration: { fast: 0.15, normal: 0.3, slow: 0.5 },
};

export const enterVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const exitTransition = {
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: { duration: 0.15, ease: "easeOut" },
} as const;
```

- [ ] **Paso 2:** `npm run build` (el tipado de `satisfies` debe pasar). Commit.

---

### Tarea 4: Bugs de animación (HIGH · ui)

**Files:** `RealmLevel.tsx:42-50`, `PersonajesSection-client.tsx:84-100,177-192`, `Hotspot.tsx:19,69-70,148-169`, `PersonajesSection-client.tsx:67-74`

- [ ] **Paso 1: `RealmLevel.tsx`:** el parallax debe volver a 0 al desactivarse:

```tsx
animate={isActive ? { y: [0, -10, 0] } : { y: 0 }}
transition={isActive ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
```

- [ ] **Paso 2: Punto activo de Personajes (líneas 178-186):**

```tsx
animate={index === currentIndex ? { scale: [1, 1.3, 1], opacity: [1, 0.8, 1] } : { scale: 1, opacity: 1 }}
transition={index === currentIndex ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
```

- [ ] **Paso 3:** Borrar `animate`/`transition` de `borderColor` en el `motion.div` del marco (líneas 89-92) y convertirlo en `div`. El borde real está en el hijo de la línea 94. Para conservar el realce en hover, usar `border-accent/20 group-hover:border-accent/40 transition-colors` en el hijo y `group` en el contenedor.
- [ ] **Paso 4: Hover solo con ratón.** `onMouseEnter/Leave` pasan a `onHoverStart/onHoverEnd` (Motion ignora el táctil): en `PersonajesSection-client.tsx:67-74` sobre el `motion.div` y en `Hotspot.tsx:69-70`.
- [ ] **Paso 5: Verificación manual.** Cambiar de reino o de personaje: nada se queda desplazado ni escalado. En móvil (DevTools touch): un tap en un hotspot no deja el tooltip abierto.
- [ ] **Paso 6:** lint + build + commit.

---

### Tarea 5: Aplicar tokens (MEDIUM · ui)

- [ ] **Paso 1: Pulsación a 0.96.** `whileTap={{ scale: motionTokens.scale.tap }}` en `NavigationDots.tsx:46`, `PersonajesSection-client.tsx:174`, `Hotspot.tsx:65`, `DualOverlay.tsx:123,153`. `SagaSection-client.tsx:53` se resuelve en la Tarea 7. En `RealmInfoPanel.tsx:61`: `active:scale-95` → `active:scale-[0.96]`.
- [ ] **Paso 2: `CTAButton.tsx:14-22`:**

```tsx
const sharedMotion = {
  whileTap: { scale: motionTokens.scale.tap },
  transition: motionTokens.press,
};
```

Se quita `whileHover` scale; el hover ya cambia `opacity`/`background-color`.

- [ ] **Paso 3: Muelles a `motionTokens.spring`** en `RealmInfoPanel.tsx:100`, `StickyCTA.tsx:24`, `DualOverlay.tsx:116`, `ZoomableOverlay.tsx:158`.
- [ ] **Paso 4: Salidas.** En `RealmInfoPanel.tsx:99`, `ZoomableOverlay.tsx:157`, `DualOverlay.tsx:115`, `Hotspot.tsx:153` e `InteractiveMapSection-client.tsx:113`: `exit={exitTransition.exit}` y la transición de salida `exitTransition.transition`. `StickyCTA` conserva su `y: 80` (es una barra que sale por abajo).
- [ ] **Paso 5: Entradas de sección.** Sustituir las variantes locales por `staggerContainer` + `enterVariants` en `HeroSection.tsx:8-14`, `HeroTitle.tsx`, `HeroCTAs.tsx`, `SobreAutoraSection-client.tsx:6-19`, `SagaSection-client.tsx`, `PersonajesSection-client.tsx:42-58`, `ContactoSection.tsx:28-54`, `Footer.tsx`, `SocialLinkCard.tsx:21-24`. En cada sección, el label, el h2 y el párrafo pasan a ser hijos de un contenedor `staggerContainer` con `whileInView="visible" viewport={{ once: true }}`. **Excepciones intencionadas:** `HeroBookMockup` (rotateY cinematográfico) y `RealmLevel` (transición entre reinos) se quedan como están.
- [ ] **Paso 6: Verificación manual.** Recargar y hacer scroll: cada sección entra como bloques escalonados cada 100 ms. Cerrar overlays: la salida dura unos 150 ms, sin rebote.
- [ ] **Paso 7:** lint + build + commit.

---

### Tarea 6: Diálogos accesibles (HIGH · accessibility)

**Files:** Create `src/hooks/useDialog.ts` · Modify `ZoomableOverlay.tsx`, `DualOverlay.tsx`, `RealmInfoPanel.tsx`

- [ ] **Paso 1: Crear el hook**

```ts
import { useEffect, useRef } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function useDialog<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const main = document.getElementById("main-content");
    if (main) main.inert = true;
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (main) main.inert = false;
      trigger?.focus();
    };
  }, [isOpen, onClose]);

  return ref;
}
```

- [ ] **Paso 2: Portal obligatorio.** Los overlays se renderizan hoy **dentro** de `<main>`, así que `inert` los desactivaría también a ellos. Envolver la salida de `ZoomableOverlay` (no inline), `DualOverlay` y el diálogo de `RealmInfoPanel` en `createPortal(..., document.body)` (de `react-dom`).
- [ ] **Paso 3: Atributos de diálogo** en el contenedor raíz de cada overlay: `role="dialog" aria-modal="true" aria-labelledby={titleId}`, con `const titleId = useId();` aplicado al `h2` del título. `RealmInfoPanel` ya tiene `role`; solo falta añadir el hook. Su listener de Escape (líneas 34-45) se elimina porque lo cubre el hook.
- [ ] **Paso 4: Overlays anidados.** Cuando `RealmInfoPanel` está abierto dentro de un overlay, Escape debe cerrar solo el panel: en su handler llamar `e.stopImmediatePropagation()` y registrar el listener en fase de captura (`addEventListener("keydown", fn, true)`). Para eso el hook acepta `{ capture: boolean }`.
- [ ] **Paso 5:** `DualOverlay.tsx:69`: añadir `aria-label="Cerrar mapas"`.
- [ ] **Paso 6: Verificación manual con teclado.** Tab hasta un hotspot (requiere la Tarea 7) → Enter abre → el foco está en "Cerrar" → Tab no sale del overlay → Escape cierra → el foco vuelve al hotspot. Con el lore abierto, Escape cierra solo el lore.
- [ ] **Paso 7:** lint + build + commit `fix(a11y): semántica y gestión de foco en overlays`.

---

### Tarea 7: Controles operables por teclado (HIGH · accessibility)

- [ ] **Paso 1: `Hotspot.tsx:59-77`**: `motion.div` → `motion.button type="button"`, con `aria-label={`Explorar ${hotspot.title}`}` y la clase de foco existente `focus-visible:ring-2 focus-visible:ring-accent rounded-full`. Los hijos `div` pasan a `span` (dentro de un `<button>` solo cabe contenido inline).
- [ ] **Paso 2: `DualOverlay.tsx:121,151`**: las tarjetas `motion.div` → `motion.button type="button" aria-label={`Ampliar ${leftTitle}`}`.
- [ ] **Paso 3: `RealmLevel.tsx:51-52`**: eliminar `onClick` y `cursor-pointer`; el acceso es el hotspot. Eliminar también `handleImageClick` en `InteractiveMapSection-client.tsx:60-74` y la prop `onImageClick`.
- [ ] **Paso 4: `SagaSection-client.tsx:44-86`**: renderizar por separado la tarjeta accionable y las estáticas:

```tsx
const cardBase =
  "aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center";
{
  libros.map((libro, i) =>
    libro.actual ? (
      <motion.a
        key={libro.titulo}
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Reserva ${libro.titulo} por WhatsApp (se abre en una pestaña nueva)`}
        variants={enterVariants}
        whileHover={{ y: motionTokens.translate.cardHover }}
        whileTap={{ scale: motionTokens.scale.tap }}
        className={`${cardBase} bg-accent-dim border border-accent hover:border-accent/70 transition-colors`}
      >
        <span className="text-xs font-medium text-accent">{libro.titulo}</span>
        <span className="text-[10px] mt-1 text-ink-primary">
          {libro.estado}
        </span>
      </motion.a>
    ) : (
      <motion.div
        key={libro.titulo}
        variants={enterVariants}
        className={`${cardBase} bg-surface-2 border border-border-subtle`}
      >
        <span className="text-xs font-medium text-ink-secondary">
          {libro.titulo}
        </span>
        <span className="text-[10px] mt-1 text-ink-secondary">
          {libro.estado}
        </span>
      </motion.div>
    ),
  );
}
```

(Los contrastes de esta tarjeta están cubiertos en la Tarea 9. Tamaños y pesos de texto se mantienen idénticos a los actuales.)

- [ ] **Paso 5: Carrusel de Personajes (WCAG 2.2.2).** Añadir un botón de pausa visible junto a los puntos:

```tsx
<button
  type="button"
  onClick={() => setIsPaused((p) => !p)}
  aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:text-accent transition-colors"
>
  {isPaused ? (
    <Play className="w-4 h-4" aria-hidden />
  ) : (
    <Pause className="w-4 h-4" aria-hidden />
  )}
</button>
```

Separar la pausa manual (`isPaused`) de la de hover/foco (`isHovering`) para que salir del hover no reanude una pausa manual: `const stopped = isPaused || isHovering || reduce;`. Pausar también en `onFocus`/`onBlur` del contenedor. En los puntos: `aria-current={index === currentIndex}` y `focus:` → `focus-visible:`.

- [ ] **Paso 6:** `NavigationDots.tsx:44`: añadir `aria-current={index === activeIndex ? "true" : undefined}`.
- [ ] **Paso 7: Verificación manual.** Recorrer la página entera solo con Tab: cada parada tiene anillo visible, no hay paradas vacías en la Saga y la tarjeta del libro 1 muestra el anillo.
- [ ] **Paso 8:** lint + build + commit.

---

### Tarea 8: Foco no tapado por la barra sticky (MEDIUM · accessibility)

- [ ] **Paso 1:** En `globals.css`, después del bloque `html`:

```css
@media (max-width: 1023px) {
  html {
    scroll-padding-bottom: calc(6rem + env(safe-area-inset-bottom));
  }
}
```

- [ ] **Paso 2:** `layout.tsx`: exportar `viewport` con `viewportFit: "cover"` para que `env(safe-area-inset-bottom)` (que ya usa `StickyCTA`) no valga 0:

```ts
import type { Viewport } from "next";
export const viewport: Viewport = { viewportFit: "cover" };
```

- [ ] **Paso 3:** build + commit.

---

### Tarea 9: Contraste con tokens existentes (HIGH · colors/accessibility)

**Alineación con el brandboard** (`public/landing-book-victoria/brandboard (2).jpeg`): sobre púrpura la marca usa crema `#fef4e6` sólida o dorado `#ffc667`, nunca grises translúcidos. Por eso el texto secundario se queda en la familia crema (`ink-secondary` = crema al 72 %) y la jerarquía se mantiene con tamaño e itálica, no con transparencias. El texto del botón WhatsApp pasa al púrpura de marca `#3d1f5c` (`surface-base`), aprobado por el usuario.

Valores calculados con la fórmula WCAG, componiendo la alfa sobre el fondo real (no estimados):

| Par actual                           | Ratio     | Umbral | Sustituto (token existente)      | Ratio     |
| ------------------------------------ | --------- | ------ | -------------------------------- | --------- |
| `ink-muted` sobre surface-1/2        | 1.95–2.03 | 4.5    | `ink-secondary`                  | 5.80–6.49 |
| `ink-tertiary` sobre base/s1/s2      | 3.24–3.71 | 4.5    | `ink-secondary`                  | 5.80–7.16 |
| blanco sobre `whatsapp`              | 1.98      | 4.5    | `text-surface-base`              | 6.84      |
| `accent` sobre `accent/20` (Saga)    | 4.46      | 4.5    | `bg-accent-dim` (=15 %)          | 4.96      |
| `ink-muted` sobre `accent/20` (Saga) | 1.75      | 4.5    | `ink-primary` sobre `accent-dim` | 7.08      |

- [ ] **Paso 1:** `text-ink-muted`/`text-ink-tertiary` → `text-ink-secondary` en: `Footer.tsx:23,32`, `HeroSection.tsx:44`, `SinopsisSection-client.tsx:45`, `SobreAutoraSection-client.tsx:123`, `PersonajesSection-client.tsx:223`, `SocialLinkCard.tsx:46`, `Hotspot.tsx:139` (se borra en la Tarea 12) y `ImageErrorFallback.tsx:24`. **Excepciones:** el botón deshabilitado de `StickyCTA.tsx:31` (exento por WCAG) y el icono flecha de `SocialLinkCard.tsx:50` (decorativo).
- [ ] **Paso 2:** `CTAButton.tsx:47`: `text-white` → `text-surface-base`. El verde de WhatsApp se mantiene.
- [ ] **Paso 3:** La Saga se resuelve en la Tarea 7, paso 4 (ya usa `bg-accent-dim` + `ink-primary` + `ink-secondary`).
- [ ] **Paso 4: Verificación.** DevTools → inspector de color de cada texto cambiado: ratio ≥ 4.5. Revisar visualmente con la autora que la jerarquía se sigue leyendo bien.
- [ ] **Paso 5:** commit `fix(a11y): contraste de texto usando tokens existentes`.

---

### Tarea 10: Layout (HIGH/MEDIUM · layout)

- [ ] **Paso 1: Aviso del mapa sobre la barra sticky.** En `InteractiveMapSection-client.tsx:114`, `bottom-8` → `bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-8`.
- [ ] **Paso 2: Alturas de viewport.** `h-screen` → `h-dvh` en `InteractiveMapSection-client.tsx:135` y `RealmLevel.tsx:27`; `min-h-screen` → `min-h-dvh` en `HeroSection.tsx:18`.
- [ ] **Paso 3: Barra sticky.** Añadir la variante `size?: "md" | "sm"` a `CTAButton`; `sm` = `px-4 py-3 whitespace-nowrap`. En `StickyCTA.tsx:28` usar `size="sm"` para igualar el botón "Próximamente".
- [ ] **Paso 4: Cabecera de DualOverlay (línea 191).** Solo se cambia la **posición** (offsets fijos → fila en flujo). El estilo de la etiqueta y del texto se mantiene idéntico:

```tsx
<div className="absolute top-0 inset-x-0 z-30 pointer-events-none flex items-start gap-3 p-4">
  <div className="w-[7.5rem] shrink-0" />
  {/* hueco de "Ver ambos" */}
  <div className="min-w-0 flex-1 flex justify-center">
    <div className="max-w-full bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-accent shadow-lg [border-top:2px_solid_var(--color-surface-base)]">
      <h2
        id={titleId}
        className="text-lg md:text-xl font-semibold text-ink-primary"
      >
        {currentTitle}
      </h2>
    </div>
  </div>
  <div className="w-10 shrink-0" />
  {/* hueco de cerrar */}
</div>
```

- [ ] **Paso 5: Scroll del lore (caso borde, sin cambiar el aspecto).** En `RealmInfoPanel.tsx`:
  - Contenedor (línea 105-112): `max-h-[80vh] overflow-y-auto` → `max-h-[80dvh] flex flex-col` (sin overflow).
  - Cabecera y divisor: `shrink-0`.
  - `<ul>`: `min-h-0 overflow-y-auto overscroll-contain touch-pan-y [scrollbar-width:thin] [scrollbar-color:var(--color-border-emphasis)_transparent] [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]`. La máscara solo se aprecia si hay desbordamiento (con contenido corto, el último 1.5 rem es padding vacío); añadir `pb-6`.
  - Backdrop (línea 92): quitar `touch-none`, porque el bloqueo de scroll ya lo hace el overlay padre con `useLockBodyScroll`.
- [ ] **Paso 6: Verificación manual a 320 px, 375 px y 200 % de zoom.** El aviso no tapa la barra, los dos botones sticky tienen la misma altura y el título del overlay no se corta. Con un lore de prueba de 20 puntos, la lista hace scroll con el dedo y la cabecera queda fija. **Con el lore real, comparar la captura antes/después: debe ser idéntica.**
- [ ] **Paso 7:** lint + build + commit.

---

### Tarea 11: Jerarquía semántica de títulos (LOW · accessibility)

> Por D2, la tipografía (fuentes, pesos, tamaños, interlineado, ajuste de línea y puntuación) **no se modifica**. Quedan fuera los hallazgos de pesos sintetizados, tamaños < 12 px, comillas y `text-balance`/`text-pretty`.

- [ ] **Paso 1:** `RealmLevel.tsx:84-91`: `motion.h2` → `motion.h3`, **conservando exactamente las mismas clases**. Solo cambia la etiqueta para el lector de pantalla (está anidado bajo el h2 de la sección); el aspecto no varía.
- [ ] **Paso 2: Verificación.** Comparar captura antes/después del reino: debe ser idéntica. Build + commit.

---

### Tarea 12: Textos (HIGH/MEDIUM/LOW · writing)

- [ ] **Paso 1: Instrucciones según dispositivo** (Tailwind 4 tiene las variantes `pointer-fine:` y `pointer-coarse:`). Patrón:

```tsx
<span className="pointer-coarse:hidden">Haz clic en una imagen para ampliarla</span>
<span className="hidden pointer-coarse:inline">Toca una imagen para ampliarla</span>
```

Aplicar en `DualOverlay.tsx:95,145,175`, `Hotspot.tsx:137` («Explorar» en neutro) e `InteractiveMapSection-client.tsx:126` (escritorio: «Desplázate para explorar el universo»; táctil: «Desliza…»).

- [ ] **Paso 2: `ZoomableOverlay.tsx:134-136` (HIGH, el texto engaña).** Hoy dice «Tap para cerrar», pero tocar la imagen no cierra. Nuevo texto:
  - con zoom: «Arrastra para mover · Usa + y − para acercar o alejar»
  - sin zoom, táctil: «Pellizca para acercar · Toca fuera del mapa para cerrar»
  - sin zoom, puntero: «Usa + y − para acercar · Haz clic fuera del mapa para cerrar»
- [ ] **Paso 3: Un solo verbo en los CTA** (la voz de la marca es imperativo de tú: «Conoce», «Únete», «Explora»):
  - `HeroCTAs.tsx:31` → «Reserva tu copia» (sin cambio)
  - `SinopsisSection-client.tsx:50` → «Reserva Los Dos Reinos» (sin cambio)
  - `StickyCTA.tsx:28` → «Reserva ahora»
  - `CTAButton.tsx:50,64`: los textos por defecto pasan a «Reserva ahora» / «Reserva por WhatsApp».
  - En las tres variantes que llevan a WhatsApp, añadir `<span className="sr-only">(abre WhatsApp en una pestaña nueva)</span>`.
    > Por D3, los textos de la autora (títulos, sinopsis, biografía, nombres, fechas y credenciales) **no se tocan**. Esta tarea cambia solo el microcopy de la interfaz.

- [ ] **Paso 4: Página de error** (`error.tsx`):
  - título «No pudimos cargar la página»
  - párrafo fijo «Revisa tu conexión e inténtalo de nuevo.», sin mostrar `error.message`
  - botón «Intentar de nuevo» (sin cambio)
  - Tipar `{ error: Error & { digest?: string }; reset: () => void }`.
- [ ] **Paso 5: Nombres accesibles y textos menores.**
  - `ZoomableOverlay.tsx:63` «Cerrar» → `Cerrar ${title}`; `:88` «Zoom in» → «Acercar»; `:110` «Zoom out» → «Alejar».
  - `PersonajesSection-client.tsx:175` → `aria-label={`Ver ${personajes[index].alt.toLowerCase()}`}`.
  - Borrar `Hotspot.tsx:138-142` («También puedes mantener presionado»): el tap ya funciona.
  - `StickyCTA.tsx:34` → «Amazon · próximamente».
  - Emoji 📅 (`SinopsisSection-client.tsx:46`) → `<span aria-hidden>📅</span>`.
- [ ] **Paso 6:** build + commit `fix(copy): verbos de CTA, instrucciones por dispositivo y nombres accesibles`.

---

### Tarea 13: Iconos Lucide + superficies (MEDIUM/LOW · ui)

- [ ] **Paso 1: Sustituir los SVG en línea** (todos con `aria-hidden` y `absoluteStrokeWidth`):

| Archivo:línea                                                | SVG actual   | Lucide                                   |
| ------------------------------------------------------------ | ------------ | ---------------------------------------- |
| `ZoomableOverlay.tsx:66,91,113`                              | X, +, −      | `X`, `Plus`, `Minus` (`strokeWidth={2}`) |
| `DualOverlay.tsx:76,212`                                     | X, chevron   | `X`, `ChevronLeft`                       |
| `RealmInfoPanel.tsx:69,121`                                  | info, X      | `Info` (`strokeWidth={2.5}`), `X`        |
| `Hotspot.tsx:105`                                            | ojo          | `Eye`                                    |
| `HeroSection.tsx:50`, `InteractiveMapSection-client.tsx:121` | flecha abajo | `ArrowDown`                              |
| `SocialLinkCard.tsx:50`                                      | chevron      | `ChevronRight`                           |
| `ImageErrorFallback.tsx:11`                                  | imagen       | `ImageOff`                               |

- [ ] **Paso 2: Trazo junto a texto medium/semibold.** En `CTAButton.tsx:34,49,63` y `StickyCTA.tsx:33`: añadir `strokeWidth={2} absoluteStrokeWidth`.
- [ ] **Paso 3: `transition-all` → propiedades concretas.**
  - `RealmInfoPanel.tsx:62` → `transition-[scale,background-color] duration-150`
  - `SocialLinkCard.tsx:32,36` → `transition-colors`
  - `SocialLinkCard.tsx:50` → `transition-[color,translate]`
  - `NavigationDots.tsx:49` → `transition-[width,background-color]`
- [ ] **Paso 4: Anillos de `box-shadow`.** Añadir `border border-transparent` en `DualOverlay.tsx:128,158`, `ZoomableOverlay.tsx:159` y `RealmInfoPanel.tsx:109`.
- [ ] **Paso 5: `globals.css`:** `a, button { -webkit-tap-highlight-color: transparent; }`.
- [ ] **Paso 6:** Portadas (`HeroBookMockup.tsx:35`, `SinopsisSection-server.tsx:17`): añadir `outline outline-1 -outline-offset-1 outline-white/10`.
- [ ] **Paso 7: Literales de color → tokens existentes (colors, MEDIUM).** Mismo valor, sin cambiar la paleta:
  - `RealmInfoPanel.tsx`: `#3d1f5c` → `surface-base`, `#ffc667` → `accent`, `#fef4e6` → `ink-primary`, `#4a2570` (fuera de la paleta) → `surface-1`, `rgba(255,198,103,0.25)` → `var(--accent-glow)`.
  - `PersonajesSection-client.tsx:81`: `#3d1f5c` → `surface-base`, `#724aa5` → `purple-medium`.
  - `#241038` (degradado del panel) no tiene token: añadir el alias `--color-surface-deep: #241038` en `@theme`. Es un alias nuevo con el valor actual, no un cambio de paleta.
- [ ] **Paso 8:** build + commit.

---

### Tarea 14: React (MEDIUM/LOW · react-code-review-ts)

- [ ] **Paso 1: `StickyCTA.tsx:10-15`:** borrar el `useState` y el `useEffect`; `const showSticky = !anyVisible;`.
- [ ] **Paso 2: Parpadeo al cargar.** En `CTAVisibilityProvider.tsx:35`, registrar con `true` (se asume visible hasta que el observer mida): `setVisibility((prev) => ({ ...prev, [id]: true }))`.
- [ ] **Paso 3: React 19.** `<CTAVisibilityContext.Provider value=…>` → `<CTAVisibilityContext value=…>`. (Con el React Compiler activo no hace falta `useMemo` en el `value`.)
- [ ] **Paso 4: Reset con `key` en lugar de efecto.** Borrar los efectos de `DualOverlay.tsx:36-40` y `ZoomableOverlay.tsx:50-53`. En `InteractiveMapSection-client.tsx`, pasar `key={selectedRealm?.id}` a `ImageOverlay`/`DualOverlay`, para que cada apertura remonte con el estado inicial.
- [ ] **Paso 5: `InteractiveMapSection-client.tsx:18-42`:** el efecto de limpieza ya no hace falta, porque el Paso 3 de la Tarea 7 eliminó el uso de `visibleHotspots`. Borrar el estado, el efecto, `handleHotspotVisible` y la prop `onVisible` de `Hotspot`.
- [ ] **Paso 6: `useTouchGestures.ts`:** guardar los callbacks en refs para que el efecto dependa solo de `enablePan` y `onPinch` sea booleano:

```ts
const handlersRef = useRef({
  onLongPress,
  onPinch,
  onPan,
  currentScale,
  enablePan,
});
useLayoutEffect(() => {
  handlersRef.current = {
    onLongPress,
    onPinch,
    onPan,
    currentScale,
    enablePan,
  };
});
// dentro de los handlers: const { onPan, enablePan } = handlersRef.current;
// el effect de suscripción depende solo de [enablePan, Boolean(onPinch)]
```

Mover las declaraciones de `initialDistanceRef`/`initialScaleRef` (líneas 103-104) al principio del hook.

- [ ] **Paso 7:** borrar los `useCallback` de `RealmInfoPanel.tsx:26-32` (el compilador ya memoiza).
- [ ] **Paso 8: Verificación manual.** Pan y pinch en el overlay siguen funcionando y React DevTools Profiler no muestra re-suscripciones. En móvil, la barra sticky no parpadea al cargar.
- [ ] **Paso 9:** lint + build + commit.

---

### Tarea 15: Limpieza (depende de D4, destructiva)

Candidatos sin ningún import: `src/components/GalaxyOverlay.tsx`, `src/components/ui/IconButton.tsx`, `src/components/ui/SocialLink.tsx`, `src/components/ui/SectionLabel.tsx`, `containerRef` en `PersonajesSection-client.tsx:29,61`. `TestimoniosSection` y `ComunidadSection` están comentadas en `page.tsx`: **conservar** si se piensan reactivar.

- [ ] **Paso 1:** Confirmar con el usuario cada archivo.
- [ ] **Paso 2:** Borrar los confirmados, luego build y commit.

---

### Tarea 16: Verificación final

- [ ] `npm run lint` sin warnings nuevos · `npm run build` OK
- [ ] Recorrido solo con teclado de toda la página, incluidos los 3 overlays y el lore
- [ ] Lector de pantalla (NVDA o VoiceOver): cada control anuncia nombre, rol y estado
- [ ] `prefers-reduced-motion: reduce` sin movimiento
- [ ] 320 px, 375 px, 768 px, 1440 px y 200 % de zoom, sin cortes ni solapamientos
- [ ] Windows Alto Contraste: los marcos de los overlays siguen visibles
- [ ] Lighthouse Accessibility antes/después (anotar las cifras)
- [ ] Revisión visual con la autora: la identidad se mantiene

---

## Autorrevisión

- **Cobertura:** HIGH a11y 1–7 → Tareas 6, 7, 9, 10 · Movimiento → 2–5 · Contraste → 9 · Layout → 10 · Semántica de títulos → 11 (tipografía excluida por D2) · Microcopy → 12 (textos de autora excluidos por D3) · Iconos/superficies/colores → 13 · React → 14 · Limpieza → 15.
- **Coherencia:** `enterVariants`, `staggerContainer`, `exitTransition` y `motionTokens.press/spring` se definen en la Tarea 3 y se usan en las Tareas 5 y 7. `useDialog` se define en la Tarea 6. `titleId` (Tarea 6) se reutiliza en la Tarea 10, paso 4.
- **Dependencias de orden:** la Tarea 7 (hotspot como botón) va antes de verificar la Tarea 6. La Tarea 14, paso 5 depende de la Tarea 7, paso 3.

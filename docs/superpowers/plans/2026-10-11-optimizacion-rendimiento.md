# Plan de implementación — Optimización de rendimiento de la landing

> **Para trabajadores agénticos:** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Objetivo:** Eliminar las fugas de rendimiento detectadas en la auditoría del 2026-10-11 (LCP retenido por JS, ~60 loops infinitos sin gateo, render loop WebGL permanente, re-renders por gesto en overlays, bundle inicial sobredimensionado) **sin cambiar nada de lo que el usuario ve** — en particular las animaciones del cono cósmico, que deben quedar pixel a pixel idénticas.

**Arquitectura:** cuatro fases incrementales, de menor a mayor riesgo: (1) fixes atómicos de riesgo cero, (2) gateo de animaciones por visibilidad real (criterio `opacity > 0`, no `isActive`, para no cortar los crossfades), (3) migración del zoom/pan de overlays a MotionValues, (4) reducción del JS inicial (Hero sin dependencia de hidratación, separación server/client real, LazyMotion). Cada fase se verifica antes de pasar a la siguiente y puede detenerse en cualquier punto.

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack, `reactCompiler: true`) · React 19.2.4 · Motion 14.1 (`motion/react`) · three 0.186 + @react-three/fiber 9.8 + @react-three/drei 10.7 · Tailwind 4 · TypeScript estricto.

---

## Reglas de ejecución de este plan

- **Sin commits ni ramas** — regla del proyecto: el usuario versiona a mano.
- **Sin tests unitarios** — el proyecto no tiene infraestructura de test; la verificación es `npx tsc --noEmit` + `npx eslint src` + comprobación manual descrita en cada tarea.
- **Shell Git Bash** — los comandos de verificación se encadenan con `&&`.
- **Decisiones del usuario (exclusiones, NO hacer):**
  - NO comprimir/generar versiones WebP de las imágenes de los overlays — se mantienen los PNG/JPG crudos con `unoptimized` por nitidez máxima.
  - NO tocar `sizes` de `DualOverlay`.
  - NO tocar `NavigationRail.tsx` en absoluto.
  - NO borrar assets huérfanos de `public/` (mapa-galaxias.svg, prota-\*-con-fondo, etc. se quedan).
  - NO tocar el `filter: brightness/blur` del carrusel de Personajes ni el `blur` de `enterVariants` (decisión de diseño pendiente — ver Fase 5).
- **Criterio de gateo para el cono cósmico:** las animaciones ambientales se pausan cuando su **opacidad es 0** (no cuando `isActive` es falso), para que sigan corriendo durante todo el crossfade entre capítulos. Al pausar, se anima siempre a un estado base explícito (regla del proyecto: jamás `animate={cond ? x : {}}`).

---

## Fase 0 — Baseline

### Tarea 1: Registrar el estado de tipos y lint

**Files:**

- Ninguno (solo lectura)

- [ ] **Paso 1: Ejecutar verificación de tipos**

```bash
npx tsc --noEmit
```

Esperado: salida limpia (0 errores). Si hay errores preexistentes, anotarlos para no atribuirlos a los cambios.

- [ ] **Paso 2: Ejecutar lint**

```bash
npx eslint src
```

Esperado: puede existir el warning conocido de comillas sin escapar en textos de la autora (`react/no-unescaped-entities` en `SobreAutoraSection`, `HeroTitle`, `TestimoniosSection`) — documentado en AGENTS.md como preexistente. No introducir más.

---

## Fase 1 — Fixes atómicos de riesgo cero

Cada tarea es un archivo aislado. Ejecutar `npx tsc --noEmit && npx eslint src` al terminar la fase completa.

### Tarea 2: Corregir `.PNG` mayúscula (404 en producción)

**Files:**

- Modify: `src/components/sections/personajes/PersonajesSection-client.tsx:23`

El archivo en `public/` es `prota-libro-1-sin-fondo.png` (minúscula). En Windows funciona; en hosting Linux (Vercel) devuelve 404 y la segunda imagen del carrusel está rota en producción.

- [ ] **Paso 1: Corregir la extensión**

```tsx
// ANTES
src: "/landing-book-victoria/prota-libro-1-sin-fondo.PNG",
// DESPUÉS
src: "/landing-book-victoria/prota-libro-1-sin-fondo.png",
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio.

### Tarea 3: Bloquear scroll del body en `CompraDialog`

**Files:**

- Modify: `src/components/CompraDialog.tsx`

Es el único diálogo que no bloquea el scroll de fondo (`DualOverlay` y `ZoomableOverlay` ya usan `useLockBodyScroll`). El hook lleva un contador global, así que es seguro aunque coexistiera con otro overlay.

- [ ] **Paso 1: Añadir el import y la llamada**

```tsx
// En los imports, junto a useDialog:
import { useDialog } from "@/hooks/useDialog";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
```

```tsx
// Dentro del componente, después de useDialog (línea ~57):
const ref = useDialog<HTMLDivElement>(open, onClose);
useLockBodyScroll(open);
```

- [ ] **Paso 2: Verificación manual** — abrir el diálogo de compra en un viewport móvil: la página detrás no se mueve; al cerrar, el scroll se restaura.

### Tarea 4: Limpiar el timer de long-press en `useTouchGestures`

**Files:**

- Modify: `src/hooks/useTouchGestures.ts:174-184`

Si el usuario mantiene el dedo <500 ms y el componente se desmonta (cambia el capítulo activo, se cierra el overlay), el `setTimeout` del long-press dispara después sobre un componente muerto → puede abrir un overlay "fantasma".

- [ ] **Paso 1: Añadir el clearTimeout al cleanup del efecto**

```tsx
// En el return del useEffect (línea ~174), ANTES de removeEventListener:
return () => {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
  }
  element.removeEventListener("touchstart", handleTouchStart);
  element.removeEventListener("touchmove", handleTouchMove);
  element.removeEventListener("touchend", handleTouchEnd);

  if (enablePan) {
    element.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }
};
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio. Manual: en móvil emulado, mantener pulsado un hotspot y hacer scroll rápido antes de los 500 ms — no debe abrirse ningún overlay al soltar.

### Tarea 5: Quitar `priority`/`eager` del capítulo 0 del mapa

**Files:**

- Modify: `src/components/sections/mapa/RealmChapter.tsx:145-146`

`reino-de-la-luz.jpg` se precarga a `100vw`/`quality 85` aunque está a ~400vh del fold: compite en red con la portada del hero (el LCP real). `RealmLevel.tsx` (fallback reduced-motion) **no se toca** — ahí el `priority` sí tiene sentido porque los capítulos van apilados desde el inicio.

- [ ] **Paso 1: Eliminar las dos props**

```tsx
// ANTES (líneas 145-146)
fill
priority={index === 0}
loading={index === 0 ? "eager" : "lazy"}
quality={85}
// DESPUÉS
fill
loading="lazy"
quality={85}
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio (la variable `index` sigue usándose para `isFirst`/`isLast`, no queda huérfana). Manual: DevTools → Network — la imagen de la luz ya no aparece como preload en la carga inicial.

### Tarea 6: Bail-out de estado en `CTAVisibilityProvider`

**Files:**

- Modify: `src/components/CTAVisibilityProvider.tsx:37-38`

El `IntersectionObserver` de cada CTA escribe un objeto nuevo aunque el valor no cambie → re-render de `StickyCTA`, `HeroCTAs` y `SinopsisSectionClient` en cada cruce de umbral.

- [ ] **Paso 1: Devolver el estado anterior cuando el valor no cambia**

```tsx
// ANTES
const setVisible = (id: string, visible: boolean) =>
  setVisibility((prev) => ({ ...prev, [id]: visible }));
// DESPUÉS
const setVisible = (id: string, visible: boolean) =>
  setVisibility((prev) =>
    prev[id] === visible ? prev : { ...prev, [id]: visible },
  );
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio. El comportamiento del StickyCTA es idéntico (aparece cuando ningún CTA está visible).

### Tarea 7: `page.tsx` — eliminar `revalidate` sin efecto

**Files:**

- Modify: `src/app/page.tsx:13`

La página es 100% estática; `revalidate = 3600` fuerza regeneración ISR horaria que no aporta nada.

- [ ] **Paso 1: Eliminar la línea**

```tsx
// ANTES (línea 13)
export const revalidate = 3600; // Revalidar cada hora
// DESPUÉS — eliminarla por completo
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio.

### Tarea 8: `next.config.ts` — cache de imágenes y retirar soporte SVG

**Files:**

- Modify: `next.config.ts`

Dos cambios: (a) `minimumCacheTTL: 60` hace revalidar las imágenes optimizadas cada 60 s — los assets son inmutables, subir a 30 días; (b) `dangerouslyAllowSVG`, `contentDispositionType` y `contentSecurityPolicy` solo existen para servir SVG por el optimizer y **ningún `<Image>` usa `.svg`** — retirarlos es higiene de seguridad gratis.

- [ ] **Paso 1: Editar el bloque `images`**

```ts
// ANTES
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
// DESPUÉS
    minimumCacheTTL: 2592000, // 30 días — los assets son inmutables
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio (la config se tipa con `NextConfig`).

### Tarea 9: `package.json` — script de lint para Next 16

**Files:**

- Modify: `package.json:9-10`

`next lint` se eliminó en Next.js 16; el script quedó roto.

- [ ] **Paso 1: Cambiar los scripts**

```json
"lint": "eslint src",
"lint:fix": "eslint src --fix"
```

- [ ] **Paso 2: Verificación** — `npm run lint` funciona (mismo resultado que `npx eslint src`).

### Tarea 10: `loading.tsx` — server component con spinner CSS

**Files:**

- Modify: `src/app/loading.tsx`

Es client e importa Motion solo para un spinner. En una página estática casi nunca se muestra; un spinner CSS puro cuesta 0 KB de JS.

- [ ] **Paso 1: Reescribir el archivo completo**

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-secondary text-sm">Cargando...</p>
      </div>
    </div>
  );
}
```

(`animate-spin` es la utilidad estándar de Tailwind — mismo spinner, sin JS.)

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio.

### Tarea 11: `GalaxyScene` — el parche de `console.warn` solo en dev

**Files:**

- Modify: `src/components/sections/mapa/GalaxyScene.tsx:9-16`

El módulo muta `console.warn` globalmente al cargar el chunk — también en producción, donde nadie lee la consola.

- [ ] **Paso 1: Gatear a desarrollo**

```tsx
// ANTES (líneas 12-16)
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock")) return;
  originalWarn(...args);
};

// DESPUÉS
if (process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock"))
      return;
    originalWarn(...args);
  };
}
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio.

### Tarea 12: `sizes` correcto en `HeroBookMockup`

**Files:**

- Modify: `src/components/sections/hero/HeroBookMockup.tsx:38`

La imagen vive en un contenedor fijo `w-48 sm:w-52 md:w-56` (192/208/224 px) pero `sizes` declara hasta `33vw` → el navegador pide variantes ~2-3× más grandes.

- [ ] **Paso 1: Corregir `sizes`**

```tsx
// ANTES
sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
// DESPUÉS
sizes = "(max-width: 640px) 192px, (max-width: 768px) 208px, 224px";
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio. Manual: en DevTools la portada descarga la variante ~256w en vez de una de ~640w+.

### Tarea 13: Eliminar código muerto

**Files:**

- Delete: `src/components/sections/mapa/GalaxyMapPanel.tsx`
- Delete: `src/components/sections/mapa/GalaxyPaths.tsx`
- Delete: `src/lib/overlay.ts`
- Modify: `src/config/realms-data.ts:149-150`

Verificado con grep: ninguno de los tres archivos se importa en `src/` (GalaxyMapPanel quedó sustituido por `altView`; `overlay.ts` exporta `clamp`/`calculateZoom`/`calculatePan`/`resetZoomAndPan` que nadie usa). El campo `hotspot.image` apunta a un SVG que **no existe** en `public/` y nunca se lee — se elimina el valor, pero se conserva `image?: string` en la interfaz `Hotspot` (API opcional para futuras expansiones).

- [ ] **Paso 1: Borrar los tres archivos**

```bash
rm src/components/sections/mapa/GalaxyMapPanel.tsx src/components/sections/mapa/GalaxyPaths.tsx src/lib/overlay.ts
```

- [ ] **Paso 2: Quitar el campo muerto del hotspot oscuro**

```ts
// ANTES (realms-data.ts, hotspot "galaxy-map")
        description: "Explora las galaxias del universo de Dioses Universales",
        image:
          "/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg",
        isProminent: true,
// DESPUÉS
        description: "Explora las galaxias del universo de Dioses Universales",
        isProminent: true,
```

- [ ] **Paso 3: Verificación** — `npx tsc --noEmit && npx eslint src` limpios (confirma que nadie los importaba).

### Tarea 14: `NavigationDots` — dot activo por `scaleX` en vez de `width`

**Files:**

- Modify: `src/components/ui/NavigationDots.tsx:17-21, 55-61`

Animar `width` fuerza layout por frame; `scaleX` va por compositor y se ve idéntico (el dot sigue "creciendo" hacia el ancho activo). Cambio visual: ninguno perceptible.

- [ ] **Paso 1: Redefinir sizeConfig y el span del dot**

```tsx
// ANTES
const sizeConfig = {
  small: { default: "w-2 h-2", active: "w-4" },
  medium: { default: "w-3 h-3", active: "w-6" },
  large: { default: "w-4 h-4", active: "w-8" },
};
// DESPUÉS — el dot conserva su alto y escala en X: w base ×2 ≈ mismo ancho visual activo
const sizeConfig = {
  small: { default: "w-2 h-2", activeScale: "scale-x-[2]" },
  medium: { default: "w-3 h-3", activeScale: "scale-x-[2]" },
  large: { default: "w-4 h-4", activeScale: "scale-x-[2]" },
};
```

```tsx
// ANTES
            <span
              className={`block rounded-full transition-[width,background-color] duration-300 ${
                index === activeIndex
                  ? `bg-accent ${config.active}`
                  : `bg-ink-tertiary group-hover:bg-ink-secondary ${config.default}`
              }`}
            />
// DESPUÉS — origin-left para que crezca hacia la derecha como antes
            <span
              className={`block rounded-full origin-left transition-[transform,background-color] duration-300 ${
                index === activeIndex
                  ? `bg-accent ${config.default} ${config.activeScale}`
                  : `bg-ink-tertiary group-hover:bg-ink-secondary ${config.default} scale-x-100`
              }`}
            />
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio. Manual: los dots del mapa y del carrusel crecen igual al activarse.

> NOTA: el ancho activo exacto cambia de `w-4/w-6/w-8` a `×2` del base (`w-2→16px`, `w-3→24px`, `w-4→32px` — idéntico al `w-4/w-6/w-8` original). Mismo resultado visual.

### Tarea 15: Verificación de cierre de Fase 1

- [ ] **Paso 1:**

```bash
npx tsc --noEmit && npx eslint src
```

Esperado: limpio (salvo warnings preexistentes documentados).

- [ ] **Paso 2: Recorrido manual rápido** — hero carga, diálogo de compra bloquea scroll, carrusel muestra ambas imágenes (la del `.png` ya no 404), overlays abren y cierran, StickyCTA aparece/desaparece.

---

## Fase 2 — El paquete del cono cósmico (gateo por visibilidad)

Principio rector: **nada que sea visible se pausa**. Las animaciones se detienen únicamente cuando su opacidad es 0 o su sección está fuera de viewport. Crossfades intactos porque el criterio es `opacity > 0`, no `isActive`.

### Tarea 16: `frameloop` del Canvas ligado a `starsOpacity`

**Files:**

- Modify: `src/components/sections/mapa/InteractiveMapSection-client.tsx`
- Modify: `src/components/sections/mapa/GalaxyScene.tsx`

Hoy el `<Canvas>` (montado al entrar la sección para precalentar el chunk de three y el contexto WebGL — decisión correcta que se conserva) renderiza 3.500 estrellas a 60 fps durante los capítulos de Luz y Central, donde `starsOpacity` es 0. Con `frameloop="never"` el contexto sigue vivo pero no se dibuja nada; al volver a `"always"` el loop retoma y la cámara lee `progress.get()` actualizado — el estado queda siempre correcto.

- [ ] **Paso 1: Derivar `starsActive` en `InteractiveMapSection-client`**

```tsx
// Después de la declaración de starsOpacity (línea ~58), añadir:
const [starsActive, setStarsActive] = useState(false);
useMotionValueEvent(starsOpacity, "change", (v) => {
  const on = v > 0.001;
  setStarsActive((prev) => (prev === on ? prev : on));
});
```

```tsx
// En el uso (línea ~286):
<GalaxyScene progress={darkProgress} active={starsActive} />
```

- [ ] **Paso 2: Aceptar `active` en `GalaxyScene` y conmutar el frameloop**

```tsx
interface GalaxySceneProps {
  /** Progreso LOCAL del capítulo oscuro (0-1), ya remapeado por el padre */
  progress: MotionValue<number>;
  /** true mientras starsOpacity > 0 — solo entonces corre el render loop */
  active: boolean;
}
```

```tsx
export default function GalaxyScene({ progress, active }: GalaxySceneProps) {
  return (
    <Canvas
      // El canvas se monta temprano para el warm-up, pero el loop solo corre
      // cuando hay estrellas visibles — fuera de la ventana no dibuja nada
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <DriftingStars />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
```

- [ ] **Paso 3: Verificación manual** — recorrer los 3 capítulos: el starfield aparece con el mismo crossfade (0.64→0.69) y la cámara cae igual con el scroll. En DevTools → Rendering → FPS meter: durante los capítulos 1 y 2 el canvas ya no dibuja.

### Tarea 17: `AMBIENT_DRIFT` pausado por opacidad del capítulo

**Files:**

- Modify: `src/components/sections/mapa/RealmChapter.tsx`

Los tres capítulos están montados a la vez y la deriva infinita (Luz asciende, Central mece) corre incluso con `opacity: 0`. Se gatea con un booleano derivado del `opacity` MotionValue **del propio capítulo** — así sigue corriendo durante todo el crossfade y solo para cuando nadie la ve. Al pausar, asienta al estado base explícito `{scale: 1.04, x: "0%", y: "0%"}` (la escala mínima del diseño) en 1.2 s — transición invisible bajo opacidad 0, y al reaparecer el loop retoma desde la base sin salto.

- [ ] **Paso 1: Añadir imports y estado**

```tsx
// En los imports de motion (línea 3-8), añadir useMotionValueEvent:
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react";
```

```tsx
// Dentro del componente, después de la definición de `opacity` (línea ~81):
// La deriva solo corre mientras el capítulo es visible (incluido el crossfade
// completo); a opacity 0 se asienta a la escala base — nadie la ve parar
const [ambientVisible, setAmbientVisible] = useState(isFirst);
useMotionValueEvent(opacity, "change", (v) => {
  const on = v > 0.001;
  setAmbientVisible((prev) => (prev === on ? prev : on));
});
const drift = AMBIENT_DRIFT[realm.id];
```

- [ ] **Paso 2: Gatear el animate del motion.div ambiental (líneas ~128-139)**

```tsx
<motion.div
  animate={
    drift
      ? ambientVisible
        ? drift.animate
        : { scale: 1.04, x: "0%", y: "0%" }
      : undefined
  }
  transition={
    drift
      ? ambientVisible
        ? {
            duration: drift.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }
        : { duration: 1.2, ease: "easeInOut" }
      : undefined
  }
  className="absolute inset-0"
>
```

- [ ] **Paso 3: Pasar `ambientVisible` a `AtmosphereLayer` (línea ~208)**

```tsx
<AtmosphereLayer
  progress={progress}
  range={range}
  variant={
    realm.id === "realm-light"
      ? "light"
      : realm.id === "realm-dark"
        ? "dark"
        : "central"
  }
  active={ambientVisible}
/>
```

- [ ] **Paso 4: Verificación manual** — Luz sigue ascendiendo y Central meciendo igual que antes mientras se ven; el crossfade entre capítulos no cambia (la deriva del capítulo saliente corre hasta que su opacidad llega a 0).

### Tarea 18: `CosmicDust` — prop `active` + respeto a reduced-motion

**Files:**

- Modify: `src/components/sections/mapa/AtmosphereLayer.tsx`
- Modify: `src/components/sections/mapa/CosmicDust.tsx`

Las 12 motas por capítulo (36 en total) corren siempre. Dos cambios: (a) `AtmosphereLayer` solo monta el dust cuando su capítulo es visible (`active` llega de la Tarea 17); (b) `CosmicDust` respeta `useReducedMotion` como ya hace `DivineParticles` — hoy `reducedMotion="user"` apaga los transforms pero las motas siguen pulsando en `opacity`. Al ser el `DUST` determinista, el remontaje reproduce el mismo patrón — invisible para el usuario.

- [ ] **Paso 1: `AtmosphereLayer` acepta `active` y gatea el dust**

```tsx
interface AtmosphereLayerProps {
  progress: MotionValue<number>;
  range: [number, number];
  /** Variante cromática por reino (tokens de marca, nada de colores ajenos) */
  variant: "light" | "central" | "dark";
  /** true mientras la opacidad del capítulo > 0 — pausa el dust invisible */
  active: boolean;
}
```

```tsx
export default function AtmosphereLayer({
  progress,
  range,
  variant,
  active,
}: AtmosphereLayerProps) {
```

```tsx
// Línea ~61:
{
  active && <CosmicDust variant={variant} />;
}
```

- [ ] **Paso 2: `CosmicDust` respeta reduced-motion**

```tsx
// En los imports (línea 3):
import { motion, useReducedMotion } from "motion/react";
```

```tsx
// Al inicio del componente (después de la firma, línea ~38):
export default function CosmicDust({ variant = "dark" }: CosmicDustProps) {
  const reduce = useReducedMotion();
  const rise =
    variant === "light" || variant === "central" ? RISE[variant] : undefined;
  const dotSize = (s: number) => (rise ? s * 2.2 : s);

  // Igual que DivineParticles: decorativo en bucle, fuera con reduced motion
  if (reduce) return null;
```

- [ ] **Paso 3: Verificación manual** — las motas de cada reino se ven idénticas mientras el capítulo es visible; en emulación `prefers-reduced-motion` ya no pulsan.

### Tarea 19: `PersonajesSection` — autoplay, partículas y glow solo en viewport

**Files:**

- Modify: `src/components/sections/personajes/PersonajesSection-client.tsx`

El `setInterval` del carrusel (7 s) no chequea visibilidad — re-render + animación de `filter` sobre imagen grande cada 7 s, siempre. `DivineParticles` (20 partículas) y el glow inferior pulsan desde que monta la página.

- [ ] **Paso 1: Imports y `useInView`**

```tsx
// Línea 5, añadir useInView:
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "motion/react";
// Línea 3, añadir useRef:
import { useState, useEffect, useRef } from "react";
```

```tsx
// Dentro del componente, junto al estado existente (después de línea ~34):
const carruselRef = useRef<HTMLDivElement>(null);
const inView = useInView(carruselRef, { amount: 0.2 });
```

- [ ] **Paso 2: Incluir `inView` en `autoplay` (línea 36)**

```tsx
// ANTES
const autoplay = !(isPaused || isHovering || hasFocus || reduce);
// DESPUÉS
const autoplay = inView && !(isPaused || isHovering || hasFocus || reduce);
```

- [ ] **Paso 3: `ref` en el contenedor del carrusel y gateo de partículas (líneas ~70, ~88)**

```tsx
<motion.div
  ref={carruselRef}
  variants={enter}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="group/carrusel relative mx-auto max-w-2xl"
  onHoverStart={() => setIsHovering(true)}
  ...
```

```tsx
// Línea ~88:
{
  /* Partículas doradas flotantes */
}
{
  inView && <DivineParticles />;
}
```

- [ ] **Paso 4: Glow inferior gateado (líneas ~155-166)**

```tsx
<motion.div
  animate={
    inView
      ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }
      : { opacity: 0.3, scale: 1 }
  }
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-accent/20 blur-3xl"
/>
```

- [ ] **Paso 5: Verificación manual** — el carrusel rota igual al llegar a la sección; al salir del viewport el intervalo se detiene (React DevTools Profiler o un `console.log` temporal en el `setInterval`).

### Tarea 20: Verificación de cierre de Fase 2

- [ ] **Paso 1:**

```bash
npx tsc --noEmit && npx eslint src
```

- [ ] **Paso 2: Recorrido completo del cono cósmico** — scroll arriba y abajo por los 3 capítulos: Ken Burns, deriva ambiental, motas, starfield, crossfades, pill de vista Galaxias y alternado automático de 7 s deben verse **exactamente** igual. Repetir con `prefers-reduced-motion` emulado: el fallback apilado sigue funcionando y las motas ya no aparecen.

---

## Fase 3 — Zoom/pan por MotionValues en `ZoomableOverlay`

Hoy cada `touchmove`/`mousemove` durante pan o pinch hace `setScale`/`setPosition` → re-render completo del overlay por evento (hasta ~120/s). Los MotionValues escriben el transform directo al DOM sin pasar por React — el mismo mecanismo que hace fluido el scrollytelling. Lo que sí necesita estado React (hint de ayuda, cursor, `enablePan`) se deriva una vez por umbral vía `useMotionValueEvent`.

### Tarea 21: `useTouchGestures` — `currentScale` acepta getter + listeners instalados una vez

**Files:**

- Modify: `src/hooks/useTouchGestures.ts`

Dos cambios: (a) `currentScale` pasa a aceptar `number | (() => number)` — el overlay le pasará un getter sobre su MotionValue, que siempre está fresco sin re-render; (b) los listeners se instalan una sola vez (`deps: []`): todas las opciones ya se leen vía `optsRef` en los handlers (patrón existente), y los listeners de mouse se instalan siempre — `handleMouseDown`/`Move`/`Up` ya se autogatean con `optsRef.current.enablePan`. El flag `passive` se fija en mount según `hasPinch`/`enablePan` iniciales — para `ZoomableOverlay` `hasPinch` es true desde el inicio, así que el comportamiento es idéntico; para `Hotspot` (long-press puro) quedan pasivos, correcto para el scroll.

- [ ] **Paso 1: Ampliar el tipo de la opción**

```ts
interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  longPressDelay?: number; // ms
  /** Escala actual para el pinch: número fijo o getter (p. ej. sobre un MotionValue) */
  currentScale?: number | (() => number);
  enablePan?: boolean; // Habilitar arrastre
}
```

- [ ] **Paso 2: Leer la escala vía getter en `handleTouchMove` (línea ~75)**

```ts
// ANTES
const { onPinch, onPan, currentScale = 1 } = optsRef.current;
// DESPUÉS
const { onPinch, onPan } = optsRef.current;
const rawScale = optsRef.current.currentScale ?? 1;
const currentScale = typeof rawScale === "function" ? rawScale() : rawScale;
```

- [ ] **Paso 3: Leer `enablePan`/`hasPinch` vía optsRef dentro del efecto y deps `[]`**

```ts
// En el useEffect (línea ~38), sustituir las dos lecturas del scope:
useEffect(() => {
  const element = elementRef.current;
  if (!element) return;
  // Estado inicial de las opciones para decidir listeners y passive;
  // los handlers leen optsRef.current en cada evento (valores siempre frescos)
  const initialOpts = optsRef.current;
  const initialPan = initialOpts.enablePan ?? false;
  const initialPinch = !!initialOpts.onPinch;
  ...
```

```ts
// needsActiveTouch y el bloque de mouse usan las versiones iniciales:
const needsActiveTouch = initialPan || initialPinch;
element.addEventListener("touchstart", handleTouchStart, {
  passive: !needsActiveTouch,
});
element.addEventListener("touchmove", handleTouchMove, {
  passive: !needsActiveTouch,
});
element.addEventListener("touchend", handleTouchEnd);

// Mouse events: siempre instalados — los handlers se autogatean leyendo
// optsRef.current.enablePan en cada evento
element.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
```

```ts
// Cleanup (incluye el clearTimeout añadido en la Tarea 4):
return () => {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
  }
  element.removeEventListener("touchstart", handleTouchStart);
  element.removeEventListener("touchmove", handleTouchMove);
  element.removeEventListener("touchend", handleTouchEnd);
  element.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};
// Deps del efecto: [] — los handlers leen las opciones frescas vía optsRef,
// no hace falta re-suscribir cuando cambian
}, []);
```

También eliminar las dos constantes del scope del hook que ya no se usan para deps (`const enablePan = options.enablePan ?? false;` y `const hasPinch = !!options.onPinch;` de las líneas 15-16) — ojo, `enablePan`/`hasPinch` solo se usaban para las deps y los listeners; tras el cambio sobran.

- [ ] **Paso 4: Verificación** — `npx tsc --noEmit` limpio. `Hotspot` (el otro consumidor) no usa `currentScale` → sin cambios necesarios ahí.

### Tarea 22: `ZoomableOverlay` — `scale`/`position` a MotionValues

**Files:**

- Modify: `src/components/overlays/ZoomableOverlay.tsx`

`useState` → `useMotionValue` para `scale`, `x`, `y`. El `div` del transform pasa a `motion.div` con `style={{ x, y, scale }}` (la forma correcta de Motion — la regla del proyecto prohíbe `style.transform` manual en `motion.*`, no `style` con MotionValues). `isZoomed` se deriva al cruzar el umbral. Bonus de UX: los botones +/− animan el zoom (antes era un salto instantáneo) y la posición se clampea para no sacar la imagen del marco.

- [ ] **Paso 1: Imports**

```tsx
// ANTES (línea 3-4)
import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useId, useLayoutEffect } from "react";
// DESPUÉS
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { ReactNode, useState, useId, useLayoutEffect } from "react";
```

- [ ] **Paso 2: Sustituir el estado por MotionValues (líneas 48-49)**

```tsx
// ANTES
const [scale, setScale] = useState(1);
const [position, setPosition] = useState({ x: 0, y: 0 });
// DESPUÉS
// Zoom y pan en MotionValues: los gestos escriben el transform directo al
// DOM sin re-render por evento; `zoomed` solo se deriva al cruzar el umbral
const scale = useMotionValue(1);
const x = useMotionValue(0);
const y = useMotionValue(0);
const [zoomed, setZoomed] = useState(false);
useMotionValueEvent(scale, "change", (v) => {
  const z = v > 1.001;
  setZoomed((prev) => (prev === z ? prev : z));
  // Al volver a escala 1 el pan se resetea — sin imagen desplazada de adorno
  if (v <= 1.001) {
    x.set(0);
    y.set(0);
  }
});
```

- [ ] **Paso 3: Reescribir `useTouchGestures` con clamp de pan (líneas ~61-72)**

```tsx
const { elementRef } = useTouchGestures({
  onPinch: enableZoom
    ? (newScale) =>
        scale.set(Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE))
    : undefined,
  onPan: enablePan
    ? (deltaX, deltaY) => {
        // Clamp: el desplazamiento máximo es el overflow de la imagen
        // escalada respecto al marco — no se puede sacar del marco
        const frame = elementRef.current;
        if (!frame) return;
        const s = scale.get();
        const boundX = Math.max(0, ((s - 1) * frame.clientWidth) / 2);
        const boundY = Math.max(0, ((s - 1) * frame.clientHeight) / 2);
        x.set(Math.min(Math.max(x.get() + deltaX, -boundX), boundX));
        y.set(Math.min(Math.max(y.get() + deltaY, -boundY), boundY));
      }
    : undefined,
  currentScale: () => scale.get(),
  enablePan: enablePan && zoomed,
});
```

- [ ] **Paso 4: `fitToFrame` usa `scale.set` (línea ~104)**

```tsx
// ANTES
setScale(Math.min(Math.max(scaleForFill, 1), coverOverContain, MAX_SCALE));
// DESPUÉS
scale.set(Math.min(Math.max(scaleForFill, 1), coverOverContain, MAX_SCALE));
```

- [ ] **Paso 5: Botones +/− con zoom animado (líneas ~144, ~159)**

```tsx
// Botón + (ANTES: setScale((s) => Math.min(s + 0.2, MAX_SCALE));)
onClick={(e) => {
  e.stopPropagation();
  animate(scale, Math.min(scale.get() + 0.2, MAX_SCALE), {
    duration: motionTokens.duration.fast,
    ease: "easeOut",
  });
}}
// Botón − (ANTES: setScale((s) => Math.max(s - 0.2, MIN_SCALE));)
onClick={(e) => {
  e.stopPropagation();
  animate(scale, Math.max(scale.get() - 0.2, MIN_SCALE), {
    duration: motionTokens.duration.fast,
    ease: "easeOut",
  });
}}
```

- [ ] **Paso 6: Hint y cursor con `zoomed` (líneas ~178, ~200)**

```tsx
// Hint (ANTES usaba scale > 1):
{zoomed ? (
  "Arrastra para mover · Usa + y − para acercar o alejar"
) : (
  ...
)}
// Cursor en la clase del marco (ANTES usaba scale > 1):
${zoomed ? "cursor-grab" : "cursor-default"}
```

- [ ] **Paso 7: El div del transform pasa a `motion.div` con MotionValues (líneas ~203-210)**

```tsx
// ANTES
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
// DESPUÉS
        <motion.div
          style={{ x, y, scale }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {children}
        </motion.div>
```

- [ ] **Paso 8: Verificación** — `npx tsc --noEmit && npx eslint src` limpios. Manual en móvil emulado y desktop: pinch, pan con dedo y con ratón (la imagen no sale del marco), botones +/− con zoom suave, cierre con X y clic fuera, `initialFill` intacto en los 3 reinos, `DualOverlay` y `RealmInfoPanel` (que reusan este componente) funcionan igual.

### Tarea 23: Verificación de cierre de Fase 3

- [ ] **Paso 1:**

```bash
npx tsc --noEmit && npx eslint src
```

- [ ] **Paso 2: Gestos completos** — abrir "Ampliar" en cada reino, hacer zoom al máximo (×7) y arrastrar: sin tirones, sin salirse del marco; hint y cursor correctos por encima/debajo de escala 1.

---

## Fase 4 — Peso del JS inicial

La fase más invasiva. Objetivo: el primer viewport se pinta sin depender de hidratación, y el texto de las secciones estáticas sale del bundle client. Las animaciones de entrada se conservan idénticas — el Hero las mueve a CSS (corren al pintar, sin esperar JS) y el resto de secciones las mantiene con Motion vía dos primitivas client diminutas cuyo `children` se renderiza en el servidor.

### Tarea 24: `CompraDialog` con `dynamic()` en el provider

**Files:**

- Modify: `src/components/CompraDialogProvider.tsx`

El diálogo solo se necesita tras el primer clic en un CTA — no hace falta en el chunk inicial.

- [ ] **Paso 1: Import dinámico**

```tsx
// ANTES
import CompraDialog from "@/components/CompraDialog";
// DESPUÉS
import dynamic from "next/dynamic";

const CompraDialog = dynamic(() => import("@/components/CompraDialog"));
```

- [ ] **Paso 2: Verificación** — `npx tsc --noEmit` limpio. Manual: el diálogo abre igual (el chunk descarga en el primer clic; si se percibe latencia, opcional: `React.startTransition` + prefetch en `onMouseEnter` del CTAButton — solo si el usuario lo pide).

### Tarea 25: Keyframes CSS de entrada en `globals.css`

**Files:**

- Modify: `src/app/globals.css`

Los keyframes replican `enterVariants` (`opacity 0→1`, `y 12→0`, `blur(4px)→0`, 0.3 s easeOut), la entrada del mockup (`opacity/y40/rotateY`, 0.9 s, ease `[0.16,1,0.3,1]`, delay 0.3), la flotación del libro (4 s) y el bounce de la flecha (1.5 s). Todo bajo `@media (prefers-reduced-motion: no-preference)` — fuera de ella no hay animación y el contenido es visible al instante (igual o mejor que hoy para esos usuarios).

- [ ] **Paso 1: Añadir al final de `globals.css`**

```css
/* Entrada del hero sin dependencia de JS: el contenido se pinta en el SSR y
   la animación corre con el primer paint. Fuera de no-preference el contenido
   aparece estático al instante */
@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes mockup-enter {
  from {
    opacity: 0;
    transform: translateY(40px) rotateY(-15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateY(0);
  }
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes hero-arrow-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

@media (prefers-reduced-motion: no-preference) {
  /* Réplica del stagger 0.1s de staggerContainer */
  .hero-enter {
    animation: hero-enter 0.3s ease-out both;
  }
  .hero-enter-2 {
    animation-delay: 0.1s;
  }
  .hero-enter-3 {
    animation-delay: 0.2s;
  }
  .hero-enter-4 {
    animation-delay: 0.3s;
  }
  .hero-enter-5 {
    animation-delay: 0.4s;
  }
  .hero-enter-6 {
    animation-delay: 0.5s;
  }
  .hero-enter-7 {
    animation-delay: 0.6s;
  }

  .mockup-enter {
    animation: mockup-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  .hero-float {
    animation: hero-float 4s ease-in-out infinite;
  }

  .hero-arrow-bounce {
    animation: hero-arrow-bounce 1.5s ease-in-out infinite;
  }
}
```

### Tarea 26: Hero — marcado a server component + entrada por CSS

**Files:**

- Modify: `src/components/sections/hero/HeroSection.tsx` (reescritura completa)
- Modify: `src/components/sections/hero/HeroBookMockup.tsx` (reescritura completa)
- Modify: `src/components/sections/hero/HeroCTAs.tsx`
- Delete: `src/components/sections/hero/HeroTitle.tsx`

Hoy todo el hero es `"use client"` y Motion escribe `opacity:0; blur(4px)` en el SSR → el LCP espera a la hidratación. La entrada pasa a CSS (misma animación, pero arranca al pintar). `HeroTitle` se funde en `HeroSection` (su marcado era 100% estático). `HeroCTAs` sigue client porque registra el CTA y monta `CTAButton`; su wrapper deja de ser `motion` y usa la clase `hero-enter`.

- [ ] **Paso 1: Reescribir `HeroSection.tsx` (server component — sin `"use client"`)**

```tsx
import { ArrowDown } from "lucide-react";
import HeroCTAs from "./HeroCTAs";
import HeroBookMockup from "./HeroBookMockup";

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_80%,var(--accent-glow)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left">
            <div className="hero-enter inline-flex items-center gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-border-emphasis bg-accent-dim text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Ya disponible
              </span>
            </div>

            <h1 className="hero-enter hero-enter-2 text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-tighter font-black font-display text-ink-primary">
              Victoria <span className="block text-accent mt-1">Querales</span>
            </h1>

            <h2 className="hero-enter hero-enter-3 text-2xl sm:text-3xl leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-ink-primary">
              Autora de fantasía oscura, política y romántica
            </h2>

            <div className="hero-enter hero-enter-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">11+</span> años
                escribiendo
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                <span className="text-accent font-bold">7</span> libros en la
                saga
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
                Miles de lecturas en{" "}
                <span className="font-semibold text-ink-primary">Wattpad</span>
              </span>
            </div>

            <div className="hero-enter hero-enter-5 flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 max-w-xl mx-auto lg:mx-0 shadow-lg shadow-accent/5">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase text-accent mb-2 font-semibold">
                    Primer libro
                  </p>
                  <h3 className="text-2xl font-black text-ink-primary mb-2 font-display">
                    Los Dos Reinos
                  </h3>
                  <p className="text-sm italic text-ink-secondary leading-relaxed">
                    "Donde amar es un acto político capaz de cambiar por
                    completo el universo"
                  </p>
                </div>
              </div>
            </div>

            <HeroCTAs />
          </div>
          <HeroBookMockup />
        </div>

        <div className="hero-enter hero-enter-7 mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary">
            <span>Explora el universo</span>
            <div className="hero-arrow-bounce">
              <ArrowDown
                className="w-4 h-4"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Paso 2: Reescribir `HeroBookMockup.tsx` (server, CSS)**

```tsx
import Image from "next/image";

export default function HeroBookMockup() {
  return (
    <div className="lg:col-span-4 flex justify-center lg:justify-end">
      <div className="mockup-enter relative [perspective:800px]">
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl bg-accent-glow opacity-60" />

        <div className="hero-float relative w-48 sm:w-52 md:w-56 aspect-[2/3]">
          <div className="absolute left-0 top-2 bottom-2 w-5 rounded-l-sm [transform:translateX(-14px)_skewY(-0.5deg)] [transform-origin:right] bg-[linear-gradient(to_right,var(--color-purple-medium),var(--accent))]" />

          <div className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden outline outline-1 -outline-offset-1 outline-white/10 flex flex-col justify-between p-7 bg-[linear-gradient(145deg,var(--surface-base)_0%,var(--surface-2)_40%,var(--surface-base)_100%)] border-[1px_solid_var(--accent-glow)] shadow-[4px_8px_40px_rgba(0,0,0,0.8),inset_0_0_60px_var(--accent-dim)]">
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-px bg-accent" />
              <div className="w-4 h-px bg-accent opacity-50" />
            </div>

            <div className="absolute inset-0">
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                className="object-cover"
                priority
                loading="eager"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 208px, 224px"
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="w-4 h-px bg-accent opacity-50" />
              <div className="w-8 h-px bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Paso 3: `HeroCTAs.tsx` — queda client pero sin `motion`**

```tsx
"use client";

import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

export default function HeroCTAs() {
  const ref = useRegisterCTA("hero-cta");

  return (
    <div
      ref={ref}
      data-cta-block
      className="hero-enter hero-enter-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
    >
      <CTAButton />
    </div>
  );
}
```

- [ ] **Paso 4: Borrar `HeroTitle.tsx`**

```bash
rm src/components/sections/hero/HeroTitle.tsx
```

- [ ] **Paso 5: Verificación** — `npx tsc --noEmit && npx eslint src` limpios. Manual: la entrada se ve igual (mismo orden de stagger, mismos tiempos); con JS deshabilitado en DevTools el contenido del hero se ve completo al instante — antes quedaba invisible. `prefers-reduced-motion`: contenido visible sin animación.

### Tarea 27: Primitivas client `Stagger` y `Enter` (composición server/client)

**Files:**

- Create: `src/components/ui/Stagger.tsx`
- Create: `src/components/ui/Enter.tsx`

Patrón: el contenedor client pone `variants` + `whileInView` y los hijos `m.*` heredan el estado por contexto de Motion — aunque los `children` vengan renderizados del server (la propagación de variants atraviesa la frontera server/client porque va por React context). Así cada sección deja de enviar su marcado por el bundle client pero conserva la misma entrada escalonada.

- [ ] **Paso 1: Crear `Stagger.tsx`**

```tsx
"use client";

import { m, type Variants } from "motion/react";
import { staggerContainer } from "@/config/motion-tokens";
import type { ReactNode } from "react";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Viewport de whileInView; default igual al usado hoy en las secciones */
  viewport?: { once?: boolean; margin?: string };
}

export default function Stagger({
  children,
  className,
  viewport = { once: true },
}: StaggerProps) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

- [ ] **Paso 2: Crear `Enter.tsx`**

```tsx
"use client";

import { m, type Variants } from "motion/react";
import { useEnterVariants } from "@/hooks/useEnterVariants";
import type { ReactNode } from "react";

interface EnterProps {
  children: ReactNode;
  className?: string;
}

// Hijo de Stagger: hereda "visible" del padre por contexto de Motion.
// Equivale al motion.* con variants={enter} que usaban las secciones.
export default function Enter({ children, className }: EnterProps) {
  const enter = useEnterVariants();
  return (
    <m.div variants={enter as Variants} className={className}>
      {children}
    </m.div>
  );
}
```

### Tarea 28: `LazyMotion` en `MotionProvider` + migración `motion` → `m`

**Files:**

- Modify: `src/components/MotionProvider.tsx`
- Modify: todos los archivos que importan `motion` de `"motion/react"` (migración de componentes `motion.*` a `m.*`; los hooks `useScroll`/`useTransform`/`useInView`/`useMotionValueEvent`/`useReducedMotion`, `AnimatePresence`, `animate`, `useMotionValue` se importan igual)

`LazyMotion features={domAnimation}` carga el núcleo recortado de Motion. Los `m.*` soportan variants, gestures (hover/tap/focus), `whileInView`, `animate`/`exit`, style con MotionValues y los hooks de scroll (son API de core, no feature). Lo que `domAnimation` NO cubre: `drag`, `layout`/`layoutId`, `useSpring`-only features… el proyecto no usa ninguna. `strict` lanza error si queda algún `motion.*` — lo activamos como red de seguridad de la migración.

- [ ] **Paso 1: `MotionProvider`**

```tsx
"use client";

import { MotionConfig, LazyMotion, domAnimation } from "motion/react";
import { ReactNode } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
```

- [ ] **Paso 2: Migrar imports** — en cada archivo, cambiar `import { motion }` por `import { m }` y `motion.` → `m.` en el JSX. Archivos afectados:

```
src/components/sections/hero/HeroCTAs.tsx        (ya sin motion tras Tarea 26)
src/components/sections/sinopsis/SinopsisCTA.tsx (nuevo, Tarea 29)
src/components/sections/personajes/PersonajesSection-client.tsx
src/components/sections/personajes/DivineParticles.tsx
src/components/sections/saga/SagaSection-client.tsx
src/components/sections/autora/SobreAutoraSection-client.tsx
src/components/sections/contacto/ContactoSection.tsx
src/components/sections/footer/Footer.tsx
src/components/sections/mapa/InteractiveMapSection-client.tsx
src/components/sections/mapa/RealmChapter.tsx
src/components/sections/mapa/AtmosphereLayer.tsx
src/components/sections/mapa/CosmicDust.tsx
src/components/sections/mapa/RealmLevel.tsx
src/components/sections/mapa/Hotspot.tsx
src/components/overlays/ZoomableOverlay.tsx
src/components/overlays/DualOverlay.tsx
src/components/overlays/ImageOverlay.tsx
src/components/overlays/RealmInfoPanel.tsx
src/components/ui/CTAButton.tsx
src/components/ui/NavigationDots.tsx
src/components/ui/SocialLinkCard.tsx
src/components/StickyCTA.tsx
src/components/CompraDialog.tsx
src/components/ui/Stagger.tsx                     (ya usa m)
src/components/ui/Enter.tsx                       (ya usa m)
```

Hooks y utilidades que se importan igual desde `"motion/react"` (no son componentes): `useScroll`, `useTransform`, `useInView`, `useMotionValue`, `useMotionValueEvent`, `useReducedMotion`, `AnimatePresence`, `animate`, `MotionConfig`, `LazyMotion`, tipos `MotionValue`/`Variants`/`TargetAndTransition`/`Transition`.

Nota de orden: `SinopsisSection-client.tsx` y `SobreAutoraSection-client.tsx` aparecen en la lista pero se eliminan en la Tarea 29 — pueden migrarse y luego borrarse, o saltarse la migración y borrarse directamente; el resultado final es el mismo.

- [ ] **Paso 3: Verificación crítica** — `npx tsc --noEmit && npx eslint src` limpios. **Recorrido completo:** el scrollytelling del cono funciona íntegro (Ken Burns, deriva, starfield, crossfades, pill, hotspots, overlays con zoom/pan/gestos), entradas de sección con stagger, hover/tap de botones, AnimatePresence de overlays y carrusel. **Si el scrub del mapa o algún estilo MotionValue dejara de actualizarse bajo `domAnimation`**: quitar `strict`, revertir a `motion` SOLO los archivos de `sections/mapa/` y re-verificar — el resto del ahorro se conserva.

### Tarea 29: Secciones — marcado estático a server, islas client mínimas

**Files:**

- Create: `src/components/sections/sinopsis/SinopsisCTA.tsx`
- Modify: `src/components/sections/sinopsis/SinopsisSection-server.tsx`
- Delete: `src/components/sections/sinopsis/SinopsisSection-client.tsx`
- Modify: `src/components/sections/saga/SagaSection-server.tsx`
- Modify: `src/components/sections/saga/SagaSection-client.tsx` (solo la grid interactiva)
- Modify: `src/components/sections/autora/SobreAutoraSection-server.tsx`
- Delete: `src/components/sections/autora/SobreAutoraSection-client.tsx`
- Modify: `src/components/sections/contacto/ContactoSection.tsx` (reescritura a server)
- Modify: `src/components/sections/footer/Footer.tsx` (reescritura a server)
- Modify: `src/components/sections/personajes/PersonajesSection-server.tsx`
- Modify: `src/components/sections/personajes/PersonajesSection-client.tsx` (solo carrusel + pie)

Patrón: el server renderiza el marcado real envuelto en `<Stagger>`/`<Enter>`; solo queda client lo que tiene interactividad (botones CTA, grid de saga, carrusel).

- [ ] **Paso 1: `SinopsisCTA.tsx` (isla client)**

```tsx
"use client";

import Enter from "@/components/ui/Enter";
import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

export default function SinopsisCTA() {
  const ref = useRegisterCTA("sinopsis-cta");

  return (
    <div ref={ref} data-cta-block>
      <Enter className="flex flex-col sm:flex-row gap-3 pt-4">
        <CTAButton />
      </Enter>
    </div>
  );
}
```

- [ ] **Paso 2: `SinopsisSection-server.tsx` (todo el texto en server)**

```tsx
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import SinopsisCTA from "./SinopsisCTA";

export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
          El Primer Libro
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-lg overflow-hidden outline outline-1 -outline-offset-1 outline-white/10 border-[1px_solid_var(--accent-glow)] shadow-[4px_8px_40px_rgba(0,0,0,0.8)]">
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>

          <Stagger className="flex flex-col gap-6">
            <Enter>
              <h2 className="text-4xl font-display font-black text-ink-primary">
                Los Dos Reinos
              </h2>
            </Enter>

            <Enter className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Fantasía Oscura
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Romance
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Política
              </span>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed">
                En el Reino Central, las gemelas Laila y Liora personifican el
                equilibrio entre la luz y la oscuridad. Sin embargo, su destino
                se fractura cuando Kenan, su creador, destierra a Laila al reino
                Oscuro bajo la tutela del dios de la muerte, Seth Godness.
                Forjada en el dolor y la crueldad, Laila deberá aprender a
                reinar en un mundo que la rechaza.
              </p>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed">
                Más de quinientos años después, el implacable dios Cosmo Godness
                busca una consorte para perpetuar el linaje divino y someter el
                universo. Su mirada recae sobre Aryana, una veterinaria cuya
                fuerza lo cautiva. Atrapada en un pacto divino para salvar a su
                familia de un nido de intrigas celestiales, Aryana deberá
                sobrevivir a la dinastía más peligrosa del cosmos. Los Godness.
              </p>
            </Enter>

            <Enter>
              <p className="text-ink-secondary leading-relaxed italic">
                Los dos reinos es una historia épica de traición, dolor y
                redención, donde la línea entre la luz y la oscuridad
                desaparece, y el amor y la venganza dictan el destino de la
                creación.
              </p>
            </Enter>

            <Enter>
              <p className="text-sm text-ink-secondary inline-flex items-center gap-1.5">
                <BadgeCheck
                  className="w-4 h-4 text-accent"
                  strokeWidth={2}
                  nonScalingStroke
                  aria-hidden
                />
                Ya disponible
              </p>
            </Enter>

            <SinopsisCTA />
          </Stagger>
        </div>
      </div>
    </section>
  );
}
```

Y borrar `SinopsisSection-client.tsx`. Nota: `BadgeCheck` de lucide-react en server component — los iconos Lucide son componentes sin hooks, renderizan en server sin problema.

- [ ] **Paso 3: `SagaSection-server.tsx` (cabecera en server)**

```tsx
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import SagaSectionClient from "./SagaSection-client";
import { libros } from "@/data/libros";

export default function SagaSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-8 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <Stagger>
          <Enter className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
            <p>La Saga Completa</p>
          </Enter>

          <Enter>
            <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-6 text-ink-primary">
              Dioses Universales
            </h2>
          </Enter>

          <Enter>
            <p className="text-center text-ink-secondary max-w-2xl mx-auto mb-16">
              Una saga que cuenta el ascenso, la conquista y los vínculos
              familiares de los dioses regentes del universo. Siete libros que
              conforman una historia épica sobre poder, familia y destino.
            </p>
          </Enter>
        </Stagger>

        <SagaSectionClient libros={libros} />
      </div>
    </section>
  );
}
```

- [ ] **Paso 4: `SagaSection-client.tsx` — solo la grid** (quitar la cabecera y su stagger; la grid conserva su propio Stagger/Enter):

```tsx
"use client";

import { m } from "motion/react";
import { Libro } from "@/data/libros";
import { useCompraDialog } from "@/components/CompraDialogProvider";
import { motionTokens, staggerContainer } from "@/config/motion-tokens";
import { useEnterVariants } from "@/hooks/useEnterVariants";

const cardBase =
  "aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center";

interface SagaSectionClientProps {
  libros: Libro[];
}

export default function SagaSectionClient({ libros }: SagaSectionClientProps) {
  const enter = useEnterVariants();
  const openCompra = useCompraDialog();

  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
    >
      {libros.map((libro) =>
        libro.actual ? (
          <m.button
            key={libro.titulo}
            type="button"
            onClick={openCompra}
            aria-label={`Comprar ${libro.titulo}`}
            variants={enter}
            whileHover={{ y: motionTokens.translate.cardHover }}
            whileTap={{ scale: motionTokens.scale.tap }}
            className={`${cardBase} bg-accent-dim border border-accent hover:border-accent/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 cursor-pointer`}
          >
            <span className="text-xs font-medium text-accent">
              {libro.titulo}
            </span>
            <span className="text-[10px] mt-1 text-ink-primary">
              {libro.estado}
            </span>
          </m.button>
        ) : (
          <m.div
            key={libro.titulo}
            variants={enter}
            className={`${cardBase} bg-surface-2 border border-border-subtle`}
          >
            <span className="text-xs font-medium text-ink-secondary">
              {libro.titulo}
            </span>
            <span className="text-[10px] mt-1 text-ink-secondary">
              {libro.estado}
            </span>
          </m.div>
        ),
      )}
    </m.div>
  );
}
```

- [ ] **Paso 5: `SobreAutoraSection-server.tsx` (todo el texto en server, se borra el client)** — la foto usa `next/image` desde server sin problema:

```tsx
import Image from "next/image";
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";

const credenciales = [
  { valor: "11+", label: "Años escribiendo" },
  { valor: "7", label: "Libros en la saga" },
  { valor: "2026", label: "Lanzamiento oficial" },
];

export default function SobreAutoraSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl bg-accent-dim" />
      <div className="relative max-w-5xl mx-auto">
        <Enter className="text-xs tracking-[0.25em] uppercase font-medium mb-14 text-center text-accent">
          <p>La autora</p>
        </Enter>

        <Stagger
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center"
          viewport={{ once: true, margin: "-60px" }}
        >
          <Enter className="md:col-span-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--accent)_0%,transparent_60%,var(--accent)_100%)] p-[2px]" />
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-border-emphasis shadow-[0_0_40px_var(--accent-glow)]">
                <Image
                  src="/landing-book-victoria/foto-escritora.jpg"
                  alt="Victoria Querales - Autora de la saga Dioses Universales"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
                />
              </div>
            </div>
          </Enter>

          <Stagger className="md:col-span-8 flex flex-col gap-6 text-center md:text-left">
            <Enter>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight font-display text-ink-primary">
                Victoria Querales
              </h2>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                Soy Licenciada en Comunicación Social con mención en Periodismo
                Audiovisual, y llevo más de una década construyendo universos
                desde la palabra. Mi relación con la escritura creativa comenzó
                en 2015, impulsada por una pregunta que siempre me acompañó:
                ¿qué hay más allá de la comprensión humana?
              </p>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                En 2019 compartí los primeros borradores de mi saga Dioses
                Universales — publicando el primer libro, Los Dos Reinos en
                Wattpad — donde una comunidad de lectores acompañó el nacimiento
                de este universo. Tras años de trabajo y dedicación, cerré la
                saga en 2024 con siete libros que conforman una historia épica
                sobre poder, familia y destino.
              </p>
            </Enter>
            <Enter>
              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                Actualmente, la saga se encuentra en proceso de edición
                profesional, y su primer volumen llegará a manos de los lectores
                en octubre de 2026. Los borradores originales de Wattpad ya no
                están disponibles, pues esta nueva etapa trae consigo una
                versión pulida y definitiva de mi universo.
              </p>
            </Enter>
            <Enter>
              <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
                "Desde niña, me inventaba historias para tranquilizar la soledad
                de mi mente inquieta. Siempre estaba en las nubes, imaginando
                cómo se creó el universo y si de verdad existen seres poderosos
                capaces de mantener el orden más allá de la comprensión humana.
                Por ese motivo, hace 11 años comencé los primeros borradores de
                lo que hoy es mi saga Dioses Universales — porque algunas
                preguntas solo encuentran respuesta cuando las conviertes en un
                mundo propio."
              </blockquote>
            </Enter>

            <Stagger className="grid grid-cols-3 gap-4 mt-2 pt-6 border-t border-border-subtle">
              {credenciales.map((c) => (
                <Enter key={c.label} className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-display text-accent">
                    {c.valor}
                  </span>
                  <span className="text-xs leading-tight text-ink-secondary">
                    {c.label}
                  </span>
                </Enter>
              ))}
            </Stagger>
          </Stagger>
        </Stagger>
      </div>
    </section>
  );
}
```

Y borrar `SobreAutoraSection-client.tsx`. El `<p>` "La autora" tenía su propio `whileInView` con `margin: "-80px"` — un `Enter` huérfano sin Stagger padre también funciona si lleva `whileInView` propio; ajustar `Enter` para aceptar `viewport` opcional y usar `whileInView` cuando no hay Stagger padre es más complejo — **simplificación honesta**: envolverlo en su propio `<Stagger viewport={{ once: true, margin: "-80px" }}>`:

```tsx
<Stagger viewport={{ once: true, margin: "-80px" }}>
  <Enter className="text-xs tracking-[0.25em] uppercase font-medium mb-14 text-center text-accent">
    <p>La autora</p>
  </Enter>
</Stagger>
```

- [ ] **Paso 6: `ContactoSection.tsx` — server + SocialLinkCard client**

`SocialLinkCard` ya es client (tiene sus propios gestos); un server component puede pasarle props incluyendo elementos React (los iconos se serializan como children). Reescritura:

```tsx
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { SOCIAL_LINKS_FLAT } from "@/config/links";
import SocialLinkCard from "@/components/ui/SocialLinkCard";
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";

const redes = [
  {
    nombre: "Instagram",
    handle: SOCIAL_LINKS_FLAT.instagramHandle,
    url: SOCIAL_LINKS_FLAT.instagram,
    icon: <InstagramIcon />,
  },
  {
    nombre: "TikTok",
    handle: SOCIAL_LINKS_FLAT.tiktokHandle,
    url: SOCIAL_LINKS_FLAT.tiktok,
    icon: <TikTokIcon />,
  },
];

export default function ContactoSection() {
  return (
    <section className="relative py-24 px-6 md:px-8 bg-surface-1">
      <div className="max-w-4xl mx-auto text-center">
        <Stagger>
          <Enter className="text-xs tracking-[0.25em] uppercase text-accent mb-8">
            <p>Contacto</p>
          </Enter>

          <Enter>
            <h2 className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary">
              Sigue el viaje de creación
            </h2>
          </Enter>

          <Enter>
            <p className="text-ink-secondary mb-12 max-w-xl mx-auto">
              Únete a la comunidad de lectores, conoce más del universo de
              Dioses Universales y acompaña la llegada de{" "}
              <em>Los Dos Reinos</em>.
            </p>
          </Enter>
        </Stagger>

        <Stagger className="flex flex-col sm:flex-row gap-6 justify-center">
          {redes.map((red) => (
            <SocialLinkCard
              key={red.nombre}
              nombre={red.nombre}
              handle={red.handle}
              url={red.url}
              icon={red.icon}
            />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
```

Ojo: **NO envolver `SocialLinkCard` en `Enter`** — la tarjeta ya lleva `variants={enter}` internamente (`SocialLinkCard.tsx:31`) y recibe la propagación del `Stagger` padre igual que hoy; envolverla duplicaría la animación de entrada.

- [ ] **Paso 7: `Footer.tsx` — server**

```tsx
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-8 py-12 pb-32 md:pb-28 lg:pb-16 bg-surface-2 border-t border-border-subtle">
      <Stagger className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center">
        <Enter>
          <p className="font-display text-lg font-bold text-accent">
            Victoria Querales
          </p>
        </Enter>
        <Enter>
          <p className="text-sm text-ink-secondary">
            Autora de Dioses Universales
          </p>
        </Enter>
        <Enter>
          <p className="text-xs text-ink-secondary mt-4">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>
        </Enter>
      </Stagger>
    </footer>
  );
}
```

- [ ] **Paso 8: `PersonajesSection` — cabecera y pie a server**

`PersonajesSection-server.tsx` mueve el título y el texto final a server; el client se queda con el carrusel + indicadores:

```tsx
import Stagger from "@/components/ui/Stagger";
import Enter from "@/components/ui/Enter";
import PersonajesSectionClient from "./PersonajesSection-client";

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-8 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(114,74,165,0.15)_0%,transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto">
        <Stagger>
          <Enter className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
            <p>Los Protagonistas</p>
          </Enter>

          <Enter>
            <h2 className="text-3xl md:text-4xl font-display font-black text-center mb-16 text-ink-primary">
              Conoce a los Personajes Principales
            </h2>
          </Enter>
        </Stagger>

        <PersonajesSectionClient />

        <Stagger className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3">
          <Enter>
            <p className="text-base text-ink-secondary leading-relaxed">
              Dioses con el poder de doblar el destino del universo. Decisiones
              que no solo mueven reinos, sino que reescriben las leyes de lo
              divino.
            </p>
          </Enter>
          <Enter>
            <p className="text-sm text-ink-secondary italic font-serif">
              Dioses Universales — Los Dos Reinos
            </p>
          </Enter>
        </Stagger>
      </div>
    </section>
  );
}
```

En `PersonajesSection-client.tsx` quitar el primer bloque `motion.div` (cabecera) y el último (pie) — quedan el carrusel con `carruselRef` y los indicadores.

- [ ] **Paso 9: Verificación** — `npx tsc --noEmit && npx eslint src` limpios. Comparación visual sección por sección: cada bloque entra con el mismo stagger y la misma variante que antes (la cascada la sigue dando Motion — lo único que cambia es que el marcado ya no viaja en el bundle client).

### Tarea 30: Verificación de cierre de Fase 4

- [ ] **Paso 1:**

```bash
npx tsc --noEmit && npx eslint src
```

- [ ] **Paso 2: Recorrido integral** — hero (entrada CSS, LCP sin JS), sinopsis, personajes (carrusel + autoplay in-view), cono cósmico completo, saga (CTA del libro actual abre el diálogo), autora, contacto, footer, StickyCTA, todos los overlays.

- [ ] **Paso 3 (opcional, solo si el usuario lo pide):** `npm run build` para comparar First Load JS antes/después.

---

## Fase 5 — Opcionales pendientes de decisión (NO implementar sin confirmación)

| Ítem                                                            | Por qué está pendiente                                                                                                                                                                 |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quitar `blur` de `enterVariants` (`motion-tokens.ts:28`)        | Es un cambio **visual**: la entrada quedaría fade+subida sin desenfoque. Ganancia: menos repaint en gama baja.                                                                         |
| Zoom con rueda/doble clic en `ZoomableOverlay`                  | Feature nueva (no fix). Requiere listener `wheel` no-pasivo + rAF + anclado al cursor.                                                                                                 |
| Woff2 subseteado de `Yudi-YqPny.ttf`                            | ~15 KB menos de fuente. Tooling: `opentype.js` ya es devDependency.                                                                                                                    |
| Capa `body::before` de ruido (`globals.css:128-136`)            | Capa compuesta permanente; moverla a secciones o `content-visibility`. Ganancia mínima.                                                                                                |
| Desmontaje de `<Image>` de capítulos a opacity 0 sostenida      | Libera ~60-100 MB de bitmaps en móvil; coste: refetch al volver (cache HTTP lo absorbe).                                                                                               |
| Split del contexto CTA (API estable / `anyVisible`)             | El bail-out de la Tarea 6 ya elimina el coste real; el split es mejora estructural marginal.                                                                                           |
| Scrollytelling extraído a subcomponente solo si `!reduceMotion` | En el fallback reduced-motion, `useScroll`/`useTransform`/`useMotionValueEvent` quedan suscritos sin uso (`InteractiveMapSection-client.tsx:41-71`). Coste pequeño; mejora de higiene. |

---

## Resumen de archivos tocados

**Nuevos:** `src/components/ui/Stagger.tsx` · `src/components/ui/Enter.tsx` · `src/components/sections/sinopsis/SinopsisCTA.tsx`

**Eliminados:** `src/components/sections/mapa/GalaxyMapPanel.tsx` · `src/components/sections/mapa/GalaxyPaths.tsx` · `src/lib/overlay.ts` · `src/components/sections/hero/HeroTitle.tsx` · `src/components/sections/sinopsis/SinopsisSection-client.tsx` · `src/components/sections/autora/SobreAutoraSection-client.tsx`

**Modificados:** `page.tsx` · `loading.tsx` · `globals.css` · `next.config.ts` · `package.json` · `CTAVisibilityProvider` · `CompraDialog` · `CompraDialogProvider` · `MotionProvider` · `StickyCTA` · `useTouchGestures` · `ZoomableOverlay` · `DualOverlay` · `ImageOverlay` · `RealmInfoPanel` · `InteractiveMapSection-client` · `RealmChapter` · `AtmosphereLayer` · `CosmicDust` · `RealmLevel` · `Hotspot` · `GalaxyScene` · `realms-data` · `HeroSection` · `HeroBookMockup` · `HeroCTAs` · `SinopsisSection-server` · `PersonajesSection-server` · `PersonajesSection-client` · `DivineParticles` · `SagaSection-server` · `SagaSection-client` · `SobreAutoraSection-server` · `ContactoSection` · `Footer` · `CTAButton` · `NavigationDots` · `SocialLinkCard`

**Intocables (exclusiones del usuario):** `NavigationRail.tsx` · `sizes` de `DualOverlay` · imágenes `unoptimized` de overlays · assets huérfanos de `public/` · `blur` de `enterVariants` · `filter` del carrusel de Personajes.

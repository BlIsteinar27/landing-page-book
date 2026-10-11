# Cono Cósmico — Scrollytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir la sección del Cono Cósmico (`mapa`) como una experiencia de scrollytelling "pinned" — el scroll es la línea de tiempo del descenso Luz → Central → Oscuro, con starfield 3D real y mapa de galaxias que se dibuja.

**Architecture:** Contenedor de ~400vh con panel `sticky` de 100dvh. `useScroll` produce `scrollYProgress` (0→1) y `useTransform` mapea ese progreso a opacidad/escala/posición de 3 capítulos con crossfade. Estado discreto (`activeIndex`) se deriva con `useMotionValueEvent` para hotspots y NavigationDots. Reino Oscuro añade un canvas R3F con starfield 3D (cámara ligada al scroll) y un mapa WebP + rutas SVG animadas con `pathLength`. Fallback `prefers-reduced-motion` = layout apilado estático (el actual).

**Tech Stack:** Next.js 16, React 19.2.4 (React Compiler activo), Motion 14 (`motion/react`), Tailwind 4, three + @react-three/fiber@9 + @react-three/drei (nuevas deps), sharp (ya es devDependency, para extraer el raster del SVG).

**Reglas del proyecto que aplican (AGENTS.md):**
- Todo en español (UI, comentarios, docs). Textos de la autora no se tocan.
- No usar `useMemo`/`useCallback` (React Compiler). Excepción permitida: callbacks en listeners externos → refs.
- Prohibido `style.transform` en componentes `motion.*` — posicionar con `x`/`y` de Motion.
- Prohibido `animate={cond ? valor : {}}` — siempre animar a un estado base explícito.
- Iconos: solo `lucide-react` con `nonScalingStroke`; `aria-label` en el botón.
- Componentes con `Math.random()` → `dynamic(..., { ssr: false })`.
- Estado derivado en render; `setState` solo en callbacks de eventos (válido en `useMotionValueEvent`).
- **No crear commits ni ramas** — los pasos de verificación reemplazan a los commits del skill.
- PowerShell: separar comandos con `;` (no `&&`).
- Overlays fuera de `<main>` (ya lo están vía `Portal`).

**Rollback:** `mapa-galaxias.svg`, `reino-*.jpg|png` originales NO se tocan. Los assets nuevos llevan nombres nuevos. El código anterior queda en git. `useScrollSnap.ts` solo se borra en Fase 5 tras verificar que nadie más lo importa.

---

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/components/sections/mapa/InteractiveMapSection-client.tsx` | REESCRITO — orquestador: container ref, `useScroll`, `activeIndex`, hotspots, dots, overlays, fallback reduced-motion |
| `src/components/sections/mapa/RealmChapter.tsx` | NUEVO — un capítulo: imagen con Ken Burns + atmósfera + texto, todo scrubbed |
| `src/components/sections/mapa/AtmosphereLayer.tsx` | NUEVO — capas de niebla/polvo/luz a velocidades distintas (parallax sin cortar el arte) |
| `src/components/sections/mapa/CosmicDust.tsx` | NUEVO — partículas DOM deterministas (sin `Math.random`, SSR-safe) |
| `src/components/sections/mapa/GalaxyScene.tsx` | NUEVO — canvas R3F con starfield; `dynamic ssr:false`; cámara ligada a progress |
| `src/components/sections/mapa/GalaxyMapPanel.tsx` | NUEVO — mapa WebP + `GalaxyPaths` (rutas vectorizadas, `pathLength` scrubbed) |
| `src/components/sections/mapa/RealmLevel.tsx` | CONSERVADO — se reutiliza en el fallback reduced-motion con `isActive` fijo |
| `src/components/sections/mapa/InteractiveMapSection-server.tsx` | MODIFICADO — contenedor de 400vh envolviendo al client |
| `src/config/realms-data.ts` | MODIFICADO — añadir `mapLabels` (posiciones de etiquetas vectoriales del mapa) |
| `src/hooks/useScrollSnap.ts` | ELIMINADO en Fase 5 (verificar que no quedan imports) |
| `scripts/extract-galaxy-map.mjs` | NUEVO — extrae el raster base64 del SVG → `mapa-galaxias.webp` |
| `public/landing-book-victoria/mapa-galaxias.webp` | NUEVO asset generado |
| `package.json` | NUEVAS deps: `three`, `@react-three/fiber@^9`, `@react-three/drei`; dev: `@types/three` |

---

# FASE 0 — Preparación: dependencias y assets

### Task 0.1: Instalar dependencias de three.js

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar**

```powershell
npm install three @react-three/fiber@^9 @react-three/drei; npm install -D @types/three
```

Nota: `@react-three/fiber@9` empareja con React 19 (ya instalado, 19.2.4). Verificar que no haya conflicto de peer deps; si npm lo reporta, NO usar `--force` — reportar al usuario.

- [ ] **Step 2: Verificar instalación**

```powershell
npm ls three @react-three/fiber @react-three/drei
```

Esperado: las tres listadas sin errores `UNMET`.

### Task 0.2: Extraer el raster del SVG a WebP

El `mapa-galaxias.svg` (11.8 MB) contiene UNA imagen raster en base64. La extraemos a WebP; el SVG original queda intacto como rollback.

**Files:**
- Create: `scripts/extract-galaxy-map.mjs`
- Create (generado): `public/landing-book-victoria/mapa-galaxias.webp`

- [ ] **Step 1: Crear el script de extracción**

```js
// scripts/extract-galaxy-map.mjs
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/landing-book-victoria/mapa-galaxias.svg", "utf8");
const match = svg.match(/base64,([A-Za-z0-9+/=]+)/);
if (!match) throw new Error("No se encontró imagen base64 en el SVG");

const buffer = Buffer.from(match[1], "base64");
await sharp(buffer)
  .webp({ quality: 82 })
  .toFile("public/landing-book-victoria/mapa-galaxias.webp");

console.log("OK — mapa-galaxias.webp generado");
```

- [ ] **Step 2: Ejecutar y verificar tamaño**

```powershell
node scripts/extract-galaxy-map.mjs; Get-Item public/landing-book-victoria/mapa-galaxias.webp | Select-Object Length
```

Esperado: `OK` y un archivo de ~300–800 KB. Si sale >2 MB, bajar `quality` a 70 y reejecutar.

- [ ] **Step 3: Verificación visual**

Abrir el `.webp` generado y confirmar que el mapa se ve íntegro (sin recortes ni canales rotos).

### Task 0.3: Checkpoint de rollback

- [ ] **Step 1: Confirmar que los originales están intactos y en git**

```powershell
git status --short public/landing-book-victoria/; git ls-files public/landing-book-victoria/mapa-galaxias.svg
```

Esperado: `mapa-galaxias.svg` trackeado en git; solo archivos NUEVOS sin trackear (`.webp`, `reino-de-la-luz-fondo-limpio.jpg`, script).

---

# FASE 1 — Esqueleto pinned: scroll como línea de tiempo

### Task 1.1: Server wrapper — contenedor de altura extendida

**Files:**
- Modify: `src/components/sections/mapa/InteractiveMapSection-server.tsx`

- [ ] **Step 1: Reescribir el server component**

```tsx
import InteractiveMapSectionClient from './InteractiveMapSection-client';

export default function InteractiveMapSection() {
  return (
    <section id="mapa-interactivo" className="relative">
      {/* Título de la sección - visible antes del descenso por el cono */}
      <div className="relative z-50 bg-surface-base py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4">
            El Cono Cósmico
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-black text-accent mb-6">
            Explora el Universo
          </h2>
          <p className="text-base md:text-lg text-ink-secondary max-w-2xl mx-auto">
            Descubre los tres reinos donde se desarrolla la saga. Desliza para explorar cada nivel del universo.
          </p>
        </div>
      </div>

      <InteractiveMapSectionClient />
    </section>
  );
}
```

(Sin cambios funcionales — el contenedor alto lo pone el client. Este paso solo documenta el contrato.)

### Task 1.2: `RealmChapter` — capítulo scrubbed

**Files:**
- Create: `src/components/sections/mapa/RealmChapter.tsx`

- [ ] **Step 1: Implementar el capítulo**

```tsx
"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Realm } from "@/config/realms-data";
import ImageErrorFallback from "@/components/ImageErrorFallback";

interface RealmChapterProps {
  realm: Realm;
  index: number;
  /** Rango [inicio, fin] del capítulo dentro de scrollYProgress (0-1) */
  range: [number, number];
  /** Progreso global de la sección */
  progress: MotionValue<number>;
  /** Capítulo actualmente dominante (para aria-hidden y hotspots) */
  isActive: boolean;
}

const FADE = 0.05; // margen de crossfade entre capítulos

export default function RealmChapter({
  realm,
  index,
  range,
  progress,
  isActive,
}: RealmChapterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [start, end] = range;
  const isFirst = index === 0;
  const isLast = index === 2;

  // Crossfade: el primero arranca visible, el último termina visible
  const opacity = useTransform(
    progress,
    [start, Math.min(start + FADE, end), Math.max(end - FADE, start), end],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  );
  // Ken Burns: zoom-out lento + deriva vertical mientras el capítulo vive
  const scale = useTransform(progress, [start, end], [1.1, 1.02]);
  const y = useTransform(progress, [start, end], ["2%", "-2%"]);

  const textOpacity = useTransform(
    progress,
    [start + FADE, start + FADE * 2, end - FADE * 2, end - FADE],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    progress,
    [start + FADE, start + FADE * 2],
    [24, 0],
  );

  return (
    <motion.div
      aria-hidden={!isActive}
      style={{ opacity }}
      className={`absolute inset-0 overflow-hidden ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}
      {hasError && <ImageErrorFallback />}

      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src={realm.backgroundImage}
          alt={isActive ? realm.name : ""}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2QxZjVjIi8+PC9zdmc+"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </motion.div>

      {/* Gradiente de legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
      >
        <div className="text-center max-w-2xl">
          <h3 className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4">
            {realm.title}
          </h3>
          <p className="text-lg md:text-xl text-ink-secondary">
            {realm.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

### Task 1.3: Reescribir el orquestador client

**Files:**
- Modify: `src/components/sections/mapa/InteractiveMapSection-client.tsx` (reescritura completa)

- [ ] **Step 1: Implementar la estructura pinned**

```tsx
"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { realms, Realm, Hotspot as HotspotType } from "@/config/realms-data";
import { exitTransition } from "@/config/motion-tokens";
import RealmChapter from "./RealmChapter";
import RealmLevel from "./RealmLevel";
import Hotspot from "./Hotspot";
import ImageOverlay from "@/components/overlays/ImageOverlay";
import DualOverlay from "@/components/overlays/DualOverlay";
import NavigationDots from "@/components/ui/NavigationDots";

// Rangos de cada capítulo dentro del progreso global 0-1
const CHAPTER_RANGES: [number, number][] = [
  [0, 0.36],
  [0.31, 0.69],
  [0.64, 1],
];
// Centro de cada capítulo (para scrollToIndex)
const CHAPTER_CENTERS = [0.17, 0.5, 0.83];

export default function InteractiveMapSectionClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const isInSection = useInView(containerRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showDualOverlay, setShowDualOverlay] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  // Cambia solo al abrir: remonta los overlays con estado limpio sin cortar su animación de salida
  const [openCount, setOpenCount] = useState(0);

  // Estado discreto derivado del progreso continuo (reemplaza IntersectionObserver)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: start + range * CHAPTER_CENTERS[index],
      behavior: "smooth",
    });
  };

  const handleHotspotClick = (hotspot: HotspotType) => {
    // Long press + click posterior no deben reabrir (ni remontar) el overlay
    if (showImageOverlay || showDualOverlay) return;
    const realm = realms.find((r) =>
      r.hotspots?.some((h) => h.id === hotspot.id),
    );
    if (realm) {
      setSelectedRealm(realm);
      setOpenCount((count) => count + 1);
      if (realm.id === "realm-dark") {
        setShowDualOverlay(true);
      } else {
        setShowImageOverlay(true);
      }
    }
  };

  const closeOverlay = () => {
    setShowImageOverlay(false);
    setShowDualOverlay(false);
    setSelectedRealm(null);
  };

  // Fallback reduced-motion: los tres reinos apilados, sin pinning
  if (reduceMotion) {
    return (
      <div>
        {realms.map((realm, index) => (
          <div key={realm.id} className="h-dvh relative">
            <RealmLevel realm={realm} isActive index={index} />
            {realm.hotspots && realm.hotspots.length > 0 && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {realm.hotspots.map((hotspot) => (
                  <div key={hotspot.id} className="pointer-events-auto">
                    <Hotspot
                      hotspot={hotspot}
                      onShowDetail={handleHotspotClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <ImageOverlay
          key={`image-overlay-${openCount}`}
          isVisible={showImageOverlay}
          onClose={closeOverlay}
          imagePath={selectedRealm?.backgroundImage || ""}
          title={selectedRealm?.title || ""}
          lore={selectedRealm?.lore}
        />
        <DualOverlay
          key={`dual-overlay-${openCount}`}
          isVisible={showDualOverlay}
          onClose={closeOverlay}
          leftImagePath="/landing-book-victoria/mapa-galaxias.svg"
          rightImagePath="/landing-book-victoria/reino-oscuro.png"
          leftTitle="Mapa de Galaxias"
          rightTitle="Reino Oscuro"
          lore={realms.find((r) => r.id === "realm-dark")?.lore}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isInSection && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              filter: "blur(4px)",
              transition: exitTransition.transition,
            }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
          >
            <NavigationDots
              count={realms.length}
              activeIndex={activeIndex}
              onIndexChange={scrollToIndex}
              size="medium"
              showTooltips
              tooltips={realms.map((r) => r.name)}
              tooltipPosition="left"
              orientation="vertical"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInSection && activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              ...exitTransition.exit,
              transition: exitTransition.transition,
            }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-accent"
            >
              <ArrowDown
                className="w-6 h-6"
                strokeWidth={2}
                nonScalingStroke
                aria-hidden
              />
            </motion.div>
            <p className="text-sm text-ink-secondary bg-surface-1/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle">
              <span className="pointer-coarse:hidden">
                Desplázate para explorar el universo
              </span>
              <span className="hidden pointer-coarse:inline">
                Desliza para explorar el universo
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de 400vh: 300vh de recorrido de scrub para 3 capítulos */}
      <div ref={containerRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-dvh overflow-hidden">
          {realms.map((realm, index) => (
            <RealmChapter
              key={realm.id}
              realm={realm}
              index={index}
              range={CHAPTER_RANGES[index]}
              progress={scrollYProgress}
              isActive={activeIndex === index}
            />
          ))}

          {/* Hotspots del capítulo activo */}
          {realms[activeIndex]?.hotspots?.length ? (
            <div className="absolute inset-0 z-30 pointer-events-none">
              {realms[activeIndex].hotspots!.map((hotspot) => (
                <div key={hotspot.id} className="pointer-events-auto">
                  <Hotspot
                    hotspot={hotspot}
                    onShowDetail={handleHotspotClick}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <ImageOverlay
        key={`image-overlay-${openCount}`}
        isVisible={showImageOverlay}
        onClose={closeOverlay}
        imagePath={selectedRealm?.backgroundImage || ""}
        title={selectedRealm?.title || ""}
        lore={selectedRealm?.lore}
      />
      <DualOverlay
        key={`dual-overlay-${openCount}`}
        isVisible={showDualOverlay}
        onClose={closeOverlay}
        leftImagePath="/landing-book-victoria/mapa-galaxias.svg"
        rightImagePath="/landing-book-victoria/reino-oscuro.png"
        leftTitle="Mapa de Galaxias"
        rightTitle="Reino Oscuro"
        lore={realms.find((r) => r.id === "realm-dark")?.lore}
      />
    </>
  );
}
```

- [ ] **Step 2: Verificación estática**

```powershell
npx tsc --noEmit; npx eslint src/components/sections/mapa
```

Esperado: sin errores nuevos.

- [ ] **Step 3: Verificación visual en dev**

```powershell
npm run dev
```

Comprobar en navegador (desktop y emulación móvil):
- La sección queda "fijada" y los reinos hacen crossfade al hacer scroll
- Los dots reflejan el capítulo activo y `scrollToIndex` funciona
- Los hotspots solo responden en su capítulo
- Los overlays abren/cierran como antes

---

# FASE 2 — Coreografía: atmósfera, profundidad y accesibilidad

### Task 2.1: `CosmicDust` — partículas deterministas

`Math.random()` en render causaría hydration mismatch; se genera una tabla fija.

**Files:**
- Create: `src/components/sections/mapa/CosmicDust.tsx`

- [ ] **Step 1: Implementar**

```tsx
"use client";

import { motion } from "motion/react";

// Tabla fija (determinista, SSR-safe): x%, y%, tamaño, delay, duración
const DUST = [
  { x: 8, y: 20, s: 2.2, d: 0.0, t: 5.2 }, { x: 22, y: 65, s: 1.4, d: 0.8, t: 6.1 },
  { x: 35, y: 15, s: 2.8, d: 1.6, t: 4.8 }, { x: 47, y: 80, s: 1.6, d: 0.4, t: 6.8 },
  { x: 58, y: 30, s: 2.0, d: 2.1, t: 5.5 }, { x: 66, y: 55, s: 1.2, d: 1.1, t: 7.0 },
  { x: 74, y: 12, s: 2.5, d: 0.6, t: 5.0 }, { x: 82, y: 70, s: 1.8, d: 1.9, t: 6.3 },
  { x: 90, y: 40, s: 1.5, d: 0.2, t: 5.8 }, { x: 15, y: 85, s: 2.4, d: 2.5, t: 4.6 },
  { x: 42, y: 45, s: 1.3, d: 1.4, t: 6.6 }, { x: 70, y: 88, s: 2.1, d: 0.9, t: 5.4 },
];

export default function CosmicDust() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {DUST.map((p, i) => (
        <motion.span
          key={`dust-${i}`}
          className="absolute rounded-full bg-accent/30 blur-[1px]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.t,
            repeat: Infinity,
            delay: p.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
```

### Task 2.2: `AtmosphereLayer` — parallax sin cortar el arte

**Files:**
- Create: `src/components/sections/mapa/AtmosphereLayer.tsx`

- [ ] **Step 1: Implementar**

```tsx
"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import CosmicDust from "./CosmicDust";

interface AtmosphereLayerProps {
  progress: MotionValue<number>;
  range: [number, number];
  /** Variante cromática por reino (tokens de marca, nada de colores ajenos) */
  variant: "light" | "central" | "dark";
}

const VARIANT_CLASS: Record<AtmosphereLayerProps["variant"], string> = {
  // Nieblas suaves con los tokens existentes
  light: "bg-gradient-to-t from-accent/10 via-transparent to-ink-primary/10",
  central: "bg-gradient-to-t from-surface-2/40 via-transparent to-accent/5",
  dark: "bg-gradient-to-t from-purple-medium/20 via-transparent to-black/40",
};

export default function AtmosphereLayer({
  progress,
  range,
  variant,
}: AtmosphereLayerProps) {
  const [start, end] = range;
  // Tres capas a distinta velocidad = profundidad sin recortar el arte
  const fogY = useTransform(progress, [start, end], ["6%", "-6%"]);
  const mistY = useTransform(progress, [start, end], ["-3%", "3%"]);
  const glowOpacity = useTransform(
    progress,
    [start, (start + end) / 2, end],
    [0, 0.5, 0],
  );

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* Niebla baja ascendente */}
      <motion.div
        style={{ y: fogY }}
        className={`absolute inset-x-0 bottom-0 h-2/3 ${VARIANT_CLASS[variant]}`}
      />
      {/* Bruma alta descendente */}
      <motion.div
        style={{ y: mistY }}
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/25 to-transparent"
      />
      {/* Halo central que respira con el capítulo */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-0 mix-blend-screen"
      />
      <CosmicDust />
    </div>
  );
}
```

- [ ] **Step 2: Integrar en `RealmChapter`**

Dentro del `motion.div` raíz de `RealmChapter`, entre el gradiente de legibilidad y el bloque de texto:

```tsx
      <AtmosphereLayer progress={progress} range={range} variant={
        realm.id === "realm-light" ? "light" : realm.id === "realm-dark" ? "dark" : "central"
      } />
```

Y añadir el import correspondiente. Verificar con `npx tsc --noEmit`.

Nota de implementación: si `var(--accent)` no existe como custom property con ese nombre, revisar `globals.css` y usar el token correcto (`--color-accent` o el que esté definido); nunca hardcodear un hex ajeno a la paleta.

### Task 2.3: Accesibilidad del pinned

- [ ] **Step 1: `inert` en capítulos no dominantes**

En `RealmChapter`, además de `aria-hidden`, añadir `inert={!isActive ? true : undefined}` al `motion.div` raíz para que nada interno reciba foco/lectores.

- [ ] **Step 2: Región anunciada para lectores**

En el sticky del client, añadir una región de estado (fuera de los capítulos, antes de los hotspots):

```tsx
          <p className="sr-only" role="status">
            {`Explorando: ${realms[activeIndex].name}`}
          </p>
```

- [ ] **Step 3: Verificación de teclado**

En dev: Tab hasta el hotspot del capítulo activo, Enter abre overlay, Escape cierra, el foco vuelve al hotspot. Los capítulos inactivos no reciben foco.

- [ ] **Step 4: Verificación reduced-motion**

En DevTools → Rendering → emular `prefers-reduced-motion: reduce`: la sección debe renderizar los 3 reinos apilados sin pinning, hotspots funcionales.

---

# FASE 3 — Reino Oscuro: starfield 3D real

### Task 3.1: `GalaxyScene` — canvas R3F

**Files:**
- Create: `src/components/sections/mapa/GalaxyScene.tsx`
- Modify: `src/components/sections/mapa/InteractiveMapSection-client.tsx`

- [ ] **Step 1: Implementar la escena**

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { MotionValue } from "motion/react";

interface GalaxySceneProps {
  /** Progreso LOCAL del capítulo oscuro (0-1), ya remapeado por el padre */
  progress: MotionValue<number>;
}

function CameraRig({ progress }: GalaxySceneProps) {
  useFrame((state) => {
    const p = progress.get();
    // La cámara "cae" hacia el campo de estrellas mientras avanza el capítulo
    state.camera.position.z = 10 - p * 6;
    state.camera.rotation.z = p * 0.25;
  });
  return null;
}

export default function GalaxyScene({ progress }: GalaxySceneProps) {
  return (
    <Canvas
      // Móvil primero: DPR limitado, sin AA (las estrellas son puntos), bajo consumo
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Stars radius={60} depth={50} count={2500} factor={3} fade speed={0.4} />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Montarlo solo en el capítulo oscuro, con carga diferida**

En `InteractiveMapSection-client.tsx`, tras los imports:

```tsx
import dynamic from "next/dynamic";
const GalaxyScene = dynamic(() => import("./GalaxyScene"), { ssr: false });
```

Progreso local del capítulo oscuro (rango `[0.64, 1]`):

```tsx
const darkProgress = useTransform(scrollYProgress, [0.64, 1], [0, 1]);
```

(añadir `useTransform` al import de `motion/react`).

Dentro del sticky, DESPUÉS de los `RealmChapter` y ANTES del bloque de hotspots:

```tsx
          {/* Starfield 3D: solo montado cerca del capítulo oscuro */}
          {activeIndex === 2 && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <GalaxyScene progress={darkProgress} />
            </div>
          )}
```

- [ ] **Step 3: Verificación**

```powershell
npx tsc --noEmit; npx eslint src/components/sections/mapa
```

Luego en dev: al llegar al Reino Oscuro, estrellas en movimiento y la cámara avanza con el scroll. Confirmar que al salir de la sección el canvas se desmonta (no queda consumiendo GPU).

- [ ] **Step 4: Afinar densidad en móvil**

Si en emulación móvil se ve escaso/cargado, ajustar `count` (1500–3500) y `factor` (2–4) hasta que el campo se lea denso sin saturar.

---

# FASE 4 — Mapa de galaxias: WebP + trazado vectorial

### Task 4.1: Vectorizar las rutas del mapa (trabajo de arte manual)

**Files:**
- Create: `src/components/sections/mapa/GalaxyPaths.tsx` (Step 2)
- Modify: `src/config/realms-data.ts` (Step 3)

- [ ] **Step 1: Extraer los trazos significativos**

Abrir `mapa-galaxias.svg`/`mapa-galaxias.webp` en Photopea/Figma/Inkscape y trazar, en un viewBox `0 0 3986 2631` (el del SVG original):

- 2–4 **rutas** que conecten galaxias/sistemas (líneas curvas `d="M…"`).
- 3–6 **aros** alrededor de sistemas destacados (`<circle>` o path elíptico).
- Posiciones de **etiquetas** principales (x, y en el viewBox + texto).

Guardar los `d`/coordenadas para el Step 2. Este es trabajo manual de diseño — el ejecutor marca el step con los datos obtenidos. **Restricción:** solo elementos decorativos de navegación (rutas/aros); los nombres de regiones del arte se respetan como texto propio, no se inventan.

- [ ] **Step 2: `GalaxyPaths` — componente de trazado animado**

```tsx
"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

interface GalaxyPathsProps {
  /** Progreso local del capítulo oscuro (0-1) */
  progress: MotionValue<number>;
}

// Trazos extraídos del mapa en Task 4.1 Step 1 (viewBox 3986x2631)
const ROUTES = [
  "M 500 1400 Q 1200 900 2000 1200 T 3400 800",
  "M 800 2000 Q 1600 1600 2400 1900 T 3300 1500",
];
const RINGS = [
  { cx: 2000, cy: 1200, r: 120 },
  { cx: 3300, cy: 1500, r: 90 },
  { cx: 3400, cy: 800, r: 110 },
];
const LABELS = [
  { x: 2000, y: 1080, text: "Núcleo" },
  { x: 3300, y: 1400, text: "Brazo Oscuro" },
];

export default function GalaxyPaths({ progress }: GalaxyPathsProps) {
  const draw = useTransform(progress, [0.3, 0.9], [0, 1]);
  const labelOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);

  return (
    <svg
      viewBox="0 0 3986 2631"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      {ROUTES.map((d, i) => (
        <motion.path
          key={`route-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-accent, currentColor)"
          className="text-accent"
          strokeWidth={6}
          strokeDasharray="1"
          style={{ pathLength: draw }}
          strokeLinecap="round"
        />
      ))}
      {RINGS.map((c, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="none"
          className="text-accent/60"
          stroke="currentColor"
          strokeWidth={4}
          style={{ pathLength: draw }}
        />
      ))}
      {LABELS.map((l, i) => (
        <motion.text
          key={`label-${i}`}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          className="fill-ink-primary font-display"
          fontSize={64}
          style={{ opacity: labelOpacity }}
        >
          {l.text}
        </motion.text>
      ))}
    </svg>
  );
}
```

Los arrays `ROUTES`/`RINGS`/`LABELS` de arriba son el FORMATO — sustituir con los datos reales del Step 1.

- [ ] **Step 3: `GalaxyMapPanel` — mapa + trazos, revelado por clip-path**

Create `src/components/sections/mapa/GalaxyMapPanel.tsx`:

```tsx
"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import GalaxyPaths from "./GalaxyPaths";

export default function GalaxyMapPanel({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  // El mapa se descubre en la segunda mitad del capítulo oscuro
  const clipPath = useTransform(
    progress,
    [0.45, 0.75],
    ["inset(0% 50% 0% 50% round 16px)", "inset(0% 0% 0% 0% round 16px)"],
  );
  const opacity = useTransform(progress, [0.45, 0.6], [0, 1]);
  const scale = useTransform(progress, [0.45, 1], [0.92, 1]);

  return (
    <motion.div
      style={{ clipPath, opacity, scale }}
      className="absolute inset-x-4 bottom-4 top-auto md:inset-x-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[38vw] md:max-w-xl aspect-[3986/2631] z-20 rounded-2xl border border-border-default overflow-hidden bg-surface-1/40 backdrop-blur-sm"
    >
      <Image
        src="/landing-book-victoria/mapa-galaxias.webp"
        alt="Mapa de galaxias del universo de Los Dos Reinos"
        fill
        className="object-cover"
        sizes="(min-width: 768px) 38vw, 92vw"
      />
      <GalaxyPaths progress={progress} />
    </motion.div>
  );
}
```

Nota: `-translate-y-1/2` en `md:` es un transform Tailwind sobre un `motion.div` con `style.scale` — Motion gestiona el transform; si Tailwind lo pisa, mover el centrado a `top-[calc(50%-13rem)]` u otra técnica sin transform. Verificar visualmente en desktop.

- [ ] **Step 4: Montar el panel en el capítulo oscuro**

En `InteractiveMapSection-client.tsx`, importar con dynamic (contiene solo transforms, puede ser import estático — usar import normal) y renderizar dentro del sticky cuando `activeIndex === 2`, junto al starfield:

```tsx
import GalaxyMapPanel from "./GalaxyMapPanel";
// ...
          {activeIndex === 2 && <GalaxyMapPanel progress={darkProgress} />}
```

- [ ] **Step 5: Verificación**

```powershell
npx tsc --noEmit; npx eslint src/components/sections/mapa
```

En dev: al avanzar por el Reino Oscuro, el mapa se revela con clip-path, las rutas se dibujan y las etiquetas aparecen. El hotspot sigue abriendo el `DualOverlay` (que sigue usando el SVG original — actualizar a `.webp` solo si el WebP se ve idéntico):

```tsx
        leftImagePath="/landing-book-victoria/mapa-galaxias.webp"
```

---

# FASE 5 — Limpieza y verificación final

### Task 5.1: Retirar `useScrollSnap`

- [ ] **Step 1: Confirmar que no quedan usos**

```powershell
grep -rn "useScrollSnap" src/
```

Si solo aparece en `src/hooks/useScrollSnap.ts` → borrar el archivo. Si aparece otro import → conservar el archivo y anotarlo.

### Task 5.2: Verificación completa

- [ ] **Step 1: Estáticos**

```powershell
npx tsc --noEmit; npx eslint src
```

Esperado: 0 errores nuevos (las comillas sin escapar preexistentes en textos de la autora se ignoran).

- [ ] **Step 2: Recorrido funcional en dev**

Checklist manual (desktop + emulación móvil):

- [ ] La sección hace pin; descenso Luz → Central → Oscuro con crossfade y Ken Burns
- [ ] Dots sincronizados; click en dot hace scroll suave al centro del capítulo
- [ ] Instrucciones "Desplázate…" solo en capítulo 1 dentro de la sección
- [ ] Hotspots: solo los del capítulo activo; overlay abre/cierra; foco devuelto
- [ ] Starfield montado solo en capítulo 3; desmonta al salir
- [ ] Mapa se revela, rutas se dibujan, etiquetas aparecen
- [ ] `prefers-reduced-motion`: layout apilado, todo accesible
- [ ] `aria-hidden`/`inert`: solo el capítulo activo es focuseable/legible
- [ ] Performance: sin jank visible en móvil emulado; starfield fluido

- [ ] **Step 3: Build (solo si el usuario lo pide explícitamente)**

```powershell
npm run build
```

---

## Self-Review (ya ejecutado)

- **Spec coverage:** pinned scrub ✓ (F1), crossfade+Ken Burns ✓ (F1/F2), atmósfera sin recortar arte ✓ (F2.2), activeIndex derivado ✓ (F1.3), hotspots/dots/overlays conservados ✓ (F1.3), starfield 3D ✓ (F3), mapa WebP+pathLength ✓ (F0.2/F4), rollback ✓ (F0.3 + notas), reduced-motion ✓ (F1.3/F2.3), a11y ✓ (F2.3), móvil ✓ (dpr/frameloop/asset WebP, F3.1).
- **Placeholders:** `ROUTES`/`RINGS`/`LABELS` dependen del trabajo manual de vectorización — documentado como formato + step explícito de extracción (Task 4.1 Step 1); es un paso de diseño, no de código.
- **Consistencia de tipos:** `progress: MotionValue<number>` en `RealmChapter`, `AtmosphereLayer`, `GalaxyScene`, `GalaxyMapPanel`, `GalaxyPaths`; `range: [number, number]` compartido; `darkProgress` remapeado en el padre.
- **Riesgos conocidos:** (a) `useInView(amount: 0.3)` en contenedor de 400vh — el amount se calcula sobre el elemento completo; si el comportamiento difiere, usar un sentinel `div` de 100dvh pegado al inicio del contenedor; (b) el `-translate-y-1/2` de `GalaxyMapPanel` en md puede colisionar con el transform de Motion — nota incluida en el paso; (c) `pointer-events` del panel del mapa — queda bajo los hotspots (z-20 vs z-30), correcto porque el panel no es interactivo.

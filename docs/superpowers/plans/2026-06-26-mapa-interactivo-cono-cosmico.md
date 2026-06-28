# Mapa Interactivo del Cono Cósmico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la sección actual del mapa de galaxias con una experiencia interactiva premium de navegación vertical dimensional a través del cono cósmico (Reino de la Luz → Reino Central → Reino Oscuro), optimizada para móvil (90% del tráfico) y escalable para futuras expansiones.

**Architecture:** Scroll snap vertical con 3 niveles (viewport height cada uno), imágenes de fondo con parallax, SVG de galaxias como overlay interactivo en el nivel inferior, sistema de hotspots escalable via JSON, animaciones premium con Motion, interacciones táctiles (swipe, tap prolongado, pinch zoom).

**Tech Stack:** Next.js 14+ (App Router), Motion (Framer Motion), Tailwind CSS, TypeScript, React hooks (useState, useRef, useEffect), Touch events API.

---

## Estructura de Archivos

**Archivos a crear:**
- `src/components/InteractiveMapSection-server.tsx` - Componente server para la sección del mapa interactivo
- `src/components/InteractiveMapSection-client.tsx` - Componente client con lógica de interacción
- `src/components/RealmLevel.tsx` - Componente reutilizable para cada nivel del cono
- `src/components/GalaxyOverlay.tsx` - Overlay interactivo del mapa de galaxias
- `src/components/Hotspot.tsx` - Componente de punto de interés interactivo
- `src/config/realms-data.ts` - Configuración escalable de reinos y hotspots
- `src/hooks/useScrollSnap.ts` - Hook personalizado para scroll snap vertical
- `src/hooks/useTouchGestures.ts` - Hook personalizado para gestos táctiles

**Archivos a modificar:**
- `src/app/page.tsx` - Reemplazar SagaSection por InteractiveMapSection
- `src/components/SagaSection-server.tsx` - Mover lógica de libros a InteractiveMapSection (mantener grid de libros)
- `src/components/SagaSection-client.tsx` - Reutilizar grid de libros en nuevo componente

---

## FASE 1: Configuración y Datos Escalables

### Task 1: Crear configuración de datos de reinos

**Files:**
- Create: `src/config/realms-data.ts`

- [ ] **Step 1: Definir tipos TypeScript para reinos y hotspots**

```typescript
export interface Hotspot {
  id: string;
  x: number; // Coordenada relativa 0-1
  y: number; // Coordenada relativa 0-1
  title: string;
  description: string;
  image?: string; // Opcional para futuras expansiones
}

export interface Realm {
  id: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  order: number; // 1 = Luz, 2 = Central, 3 = Oscuro
  hotspots?: Hotspot[];
}
```

- [ ] **Step 2: Exportar configuración de reinos con datos actuales**

```typescript
export const realms: Realm[] = [
  {
    id: 'realm-light',
    name: 'Reino de la Luz',
    title: 'Reino de la Luz',
    description: 'La cúspide del cono cósmico, donde habitan los dioses de mayor jerarquía.',
    backgroundImage: '/landing-book-victoria/reino-de-la-luz.jpg',
    order: 1,
    hotspots: [] // Agregar hotspots cuando la clienta proporcione información
  },
  {
    id: 'realm-central',
    name: 'Reino Central',
    title: 'Reino Central',
    description: 'El punto medio del universo, equilibrio entre luz y oscuridad.',
    backgroundImage: '/landing-book-victoria/reino-central.jpg',
    order: 2,
    hotspots: []
  },
  {
    id: 'realm-dark',
    name: 'Reino Oscuro',
    title: 'Reino Oscuro',
    description: 'La base del cono, hogar de galaxias y misterios cósmicos.',
    backgroundImage: '/landing-book-victoria/reino-oscuro.png',
    order: 3,
    hotspots: [
      {
        id: 'galaxy-map',
        x: 0.5,
        y: 0.5,
        title: 'Mapa de Galaxias',
        description: 'Explora las galaxias del universo de Dioses Universales',
        image: '/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg'
      }
    ]
  }
];
```

- [ ] **Step 3: Commit**

```bash
git add src/config/realms-data.ts
git commit -m "feat: add realms data configuration with TypeScript types"
```

---

### Task 2: Crear hook personalizado para scroll snap vertical

**Files:**
- Create: `src/hooks/useScrollSnap.ts`

- [ ] **Step 1: Implementar hook con scroll snap vertical**

```typescript
import { useEffect, useRef, useState } from 'react';

interface UseScrollSnapOptions {
  snapPoints: number; // Número de snap points (niveles)
  threshold?: number; // Threshold para activar snap (default 0.5)
}

export function useScrollSnap({ snapPoints, threshold = 0.5 }: UseScrollSnapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isScrolling = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;

      // Calcular velocidad
      const velocity = Math.abs(deltaY) / deltaTime;

      // Si la velocidad es alta, permitir scroll natural
      if (velocity > 0.5) {
        return;
      }

      // Scroll snap logic
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;
      const currentIndex = Math.round(scrollTop / viewportHeight);
      
      setActiveIndex(currentIndex);
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [snapPoints, threshold]);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const viewportHeight = container.clientHeight;
    container.scrollTo({
      top: index * viewportHeight,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return { containerRef, activeIndex, scrollToIndex };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollSnap.ts
git commit -m "feat: add useScrollSnap hook for vertical scroll navigation"
```

---

### Task 3: Crear hook personalizado para gestos táctiles

**Files:**
- Create: `src/hooks/useTouchGestures.ts`

- [ ] **Step 1: Implementar hook con gestos táctiles (tap, long press, pinch)**

```typescript
import { useRef, useState, useCallback } from 'react';

interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  longPressDelay?: number; // ms
}

export function useTouchGestures({ 
  onLongPress, 
  onPinch,
  longPressDelay = 500 
}: UseTouchGesturesOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout>();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress(e);
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  }, []);

  // Pinch zoom logic
  const handlePinch = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && onPinch) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      // Normalizar escala (base 100)
      const scale = distance / 100;
      onPinch(scale);
    }
  }, [onPinch]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchmove', handlePinch, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handlePinch);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handlePinch]);

  return { elementRef, isLongPressing };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTouchGestures.ts
git commit -m "feat: add useTouchGestures hook for touch interactions"
```

---

## FASE 2: Componentes Reutilizables

### Task 4: Crear componente RealmLevel para cada nivel del cono

**Files:**
- Create: `src/components/RealmLevel.tsx`

- [ ] **Step 1: Implementar componente con imagen de fondo y parallax**

```typescript
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Realm } from '@/config/realms-data';

interface RealmLevelProps {
  realm: Realm;
  isActive: boolean;
  index: number;
}

export default function RealmLevel({ realm, isActive, index }: RealmLevelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.5 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        animate={{
          y: isActive ? [0, -10, 0] : 0,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
      >
        <Image
          src={realm.backgroundImage}
          alt={realm.name}
          fill
          priority={index === 0}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 30
          }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-display font-black text-ink-primary mb-4"
          >
            {realm.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-ink-secondary"
          >
            {realm.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RealmLevel.tsx
git commit -m "feat: add RealmLevel component with parallax background"
```

---

### Task 5: Crear componente Hotspot para puntos de interés

**Files:**
- Create: `src/components/Hotspot.tsx`

- [ ] **Step 1: Implementar componente interactivo con animaciones**

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Hotspot as HotspotType } from '@/config/realms-data';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
}

export default function Hotspot({ hotspot, onShowDetail }: HotspotProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { elementRef, isLongPressing } = useTouchGestures({
    onLongPress: () => {
      if (onShowDetail) {
        onShowDetail(hotspot);
      }
    }
  });

  return (
    <>
      <motion.div
        ref={elementRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onShowDetail?.(hotspot)}
        className="absolute cursor-pointer"
        style={{
          left: `${hotspot.x * 100}%`,
          top: `${hotspot.y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-accent rounded-full"
          style={{ width: 40, height: 40 }}
        />
        
        {/* Hotspot Dot */}
        <motion.div
          animate={{
            scale: isPressed ? 0.8 : 1
          }}
          className="relative w-6 h-6 bg-accent rounded-full border-2 border-white shadow-lg"
        />
      </motion.div>

      {/* Tooltip on hover (desktop) */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-surface-1 border border-border-default rounded-lg p-3 shadow-xl max-w-xs"
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              transform: 'translate(-50%, -150%)'
            }}
          >
            <p className="text-sm font-medium text-ink-primary">{hotspot.title}</p>
            <p className="text-xs text-ink-secondary mt-1">{hotspot.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hotspot.tsx
git commit -m "feat: add Hotspot component with pulse animation"
```

---

### Task 6: Crear componente GalaxyOverlay para el mapa de galaxias

**Files:**
- Create: `src/components/GalaxyOverlay.tsx`

- [ ] **Step 1: Implementar overlay interactivo con SVG de galaxias**

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface GalaxyOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  svgPath: string;
}

export default function GalaxyOverlay({ isVisible, onClose, svgPath }: GalaxyOverlayProps) {
  const [scale, setScale] = useState(1);
  const { elementRef } = useTouchGestures({
    onPinch: (newScale) => {
      setScale(Math.min(Math.max(newScale, 0.5), 3));
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={elementRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full h-full max-w-4xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: `scale(${scale})` }}
          >
            <Image
              src={svgPath}
              alt="Mapa de galaxias"
              fill
              className="object-contain"
              sizes="100vw"
            />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors"
            >
              <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setScale(s => Math.min(s + 0.2, 3))}
                className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors"
              >
                <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
                className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors"
              >
                <svg className="w-6 h-6 text-ink-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default">
              <p className="text-xs text-ink-secondary">Pinch para zoom • Tap para cerrar</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GalaxyOverlay.tsx
git commit -m "feat: add GalaxyOverlay component with pinch zoom"
```

---

## FASE 3: Componente Principal del Mapa Interactivo

### Task 7: Crear InteractiveMapSectionClient con lógica de navegación

**Files:**
- Create: `src/components/InteractiveMapSection-client.tsx`

- [ ] **Step 1: Implementar componente client con scroll snap y gestos**

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { realms, Realm, Hotspot as HotspotType } from '@/config/realms-data';
import { useScrollSnap } from '@/hooks/useScrollSnap';
import RealmLevel from './RealmLevel';
import Hotspot from './Hotspot';
import GalaxyOverlay from './GalaxyOverlay';

interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}

interface InteractiveMapSectionClientProps {
  libros: Libro[];
}

export default function InteractiveMapSectionClient({ libros }: InteractiveMapSectionClientProps) {
  const { containerRef, activeIndex, scrollToIndex } = useScrollSnap({ snapPoints: realms.length });
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotType | null>(null);
  const [showGalaxyOverlay, setShowGalaxyOverlay] = useState(false);

  const handleHotspotClick = (hotspot: HotspotType) => {
    setSelectedHotspot(hotspot);
    
    // Si es el hotspot del mapa de galaxias, mostrar overlay
    if (hotspot.id === 'galaxy-map' && hotspot.image) {
      setShowGalaxyOverlay(true);
    }
  };

  const closeOverlay = () => {
    setShowGalaxyOverlay(false);
    setSelectedHotspot(null);
  };

  return (
    <>
      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {realms.map((realm, index) => (
          <motion.button
            key={realm.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index ? 'bg-accent scale-125' : 'bg-surface-2'
            }`}
          />
        ))}
      </div>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {realms.map((realm, index) => (
          <div key={realm.id} className="snap-start h-screen relative">
            <RealmLevel
              realm={realm}
              isActive={activeIndex === index}
              index={index}
            />
            
            {/* Hotspots */}
            {realm.hotspots && activeIndex === index && (
              <div className="absolute inset-0">
                {realm.hotspots.map((hotspot) => (
                  <Hotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    onShowDetail={handleHotspotClick}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Books Grid Section */}
        <div className="snap-start min-h-screen flex items-center justify-center p-6 bg-surface-1">
          <div className="max-w-6xl mx-auto w-full">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
            >
              La Saga Completa
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-black text-center mb-6 text-ink-primary"
            >
              Dioses Universales
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-ink-secondary max-w-2xl mx-auto mb-16"
            >
              Una saga que cuenta el ascenso, la conquista y los vínculos familiares 
              de los dioses regentes del universo. Siete libros que conforman una 
              historia épica sobre poder, familia y destino.
            </motion.p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {libros.map((libro, i) => (
                <motion.div
                  key={libro.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`
                    aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center
                    ${libro.actual 
                      ? 'bg-accent/20 border border-accent' 
                      : 'bg-surface-2 border border-border-subtle'}
                  `}
                >
                  <span className={`text-xs font-medium ${libro.actual ? 'text-accent' : 'text-ink-tertiary'}`}>
                    {libro.titulo}
                  </span>
                  <span className="text-[10px] mt-1 text-ink-muted">
                    {libro.estado}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Galaxy Overlay */}
      <GalaxyOverlay
        isVisible={showGalaxyOverlay}
        onClose={closeOverlay}
        svgPath="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InteractiveMapSection-client.tsx
git commit -m "feat: add InteractiveMapSectionClient with scroll navigation"
```

---

### Task 8: Crear InteractiveMapSectionServer (wrapper server)

**Files:**
- Create: `src/components/InteractiveMapSection-server.tsx`

- [ ] **Step 1: Implementar componente server con datos de libros**

```typescript
import InteractiveMapSectionClient from './InteractiveMapSection-client';

const libros = [
  { titulo: 'Los Dos Reinos', estado: 'Octubre 2026', actual: true },
  { titulo: 'Libro 2', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 3', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 4', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 5', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 6', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 7', estado: 'Próximamente', actual: false },
];

export default function InteractiveMapSection() {
  return (
    <section className="relative bg-surface-1">
      <InteractiveMapSectionClient libros={libros} />
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InteractiveMapSection-server.tsx
git commit -m "feat: add InteractiveMapSectionServer wrapper component"
```

---

## FASE 4: Integración en la Landing Page

### Task 9: Reemplazar SagaSection por InteractiveMapSection en page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Leer el archivo page.tsx actual**

```bash
cat src/app/page.tsx
```

Expected: Ver el contenido actual del archivo page.tsx

- [ ] **Step 2: Reemplazar import y uso de SagaSection por InteractiveMapSection**

```typescript
// Antes:
import SagaSection from '@/components/SagaSection-server';

// Después:
import InteractiveMapSection from '@/components/InteractiveMapSection-server';

// En el JSX:
// Antes:
<SagaSection />

// Después:
<InteractiveMapSection />
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: replace SagaSection with InteractiveMapSection"
```

---

### Task 10: Agregar estilos CSS para scroll snap y ocultar scrollbar

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Agregar estilos para scroll snap y scrollbar personalizado**

```css
/* Scroll Snap */
.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

/* Hide Scrollbar but keep functionality */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add CSS styles for scroll snap and scrollbar"
```

---

## FASE 5: Optimización y Testing

### Task 11: Optimizar imágenes para rendimiento

**Files:**
- Modify: `src/components/RealmLevel.tsx`

- [ ] **Step 1: Agregar propiedades de optimización a imágenes**

```typescript
// En el componente Image, agregar:
<Image
  src={realm.backgroundImage}
  alt={realm.name}
  fill
  priority={index === 0} // Solo la primera imagen con priority
  loading={index === 0 ? "eager" : "lazy"}
  quality={85}
  className="object-cover"
  sizes="100vw"
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RealmLevel.tsx
git commit -m "perf: optimize image loading with priority and quality settings"
```

---

### Task 12: Agregar haptic feedback para dispositivos móviles

**Files:**
- Modify: `src/hooks/useScrollSnap.ts`

- [ ] **Step 1: Implementar vibración al cambiar de nivel**

```typescript
// En el useEffect, después de setActiveIndex(currentIndex):
if (currentIndex !== activeIndex && 'vibrate' in navigator) {
  navigator.vibrate(10); // Vibración sutil de 10ms
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollSnap.ts
git commit -m "feat: add haptic feedback on realm change"
```

---

### Task 13: Testing en móvil y desktop

**Files:**
- Test: Manual testing en browser

- [ ] **Step 1: Iniciar dev server**

```bash
npm run dev
```

Expected: Servidor corriendo en localhost:3000

- [ ] **Step 2: Probar en desktop (Chrome DevTools mobile emulation)**

1. Abrir DevTools (F12)
2. Activar Device Toolbar (Ctrl+Shift+M)
3. Seleccionar dispositivo móvil (iPhone 12 Pro o similar)
4. Navegar a la sección del mapa interactivo
5. Verificar:
   - Scroll snap vertical funciona correctamente
   - Transiciones entre reinos son suaves
   - Imágenes cargan correctamente
   - Hotspots responden al tap
   - Overlay de galaxias se abre y cierra
   - Pinch zoom funciona en el overlay

- [ ] **Step 3: Probar en móvil real (si disponible)**

1. Abrir la URL en dispositivo móvil
2. Verificar:
   - Gestos táctiles nativos funcionan
   - Performance es aceptable
   - No hay lag en scroll
   - Haptic feedback funciona (si el dispositivo lo soporta)

- [ ] **Step 4: Probar en desktop**

1. Navegar a la sección del mapa interactivo
2. Verificar:
   - Scroll con mouse wheel funciona
   - Hover states en hotspots funcionan
   - Click en hotspots abre overlay
   - Responsive design se ve bien en pantallas grandes

- [ ] **Step 5: Documentar bugs encontrados (si hay)**

Crear archivo: `docs/bugs-mapa-interactivo.md` con lista de issues encontrados

- [ ] **Step 6: Commit (si se hicieron correcciones)**

```bash
git add .
git commit -m "fix: address issues found during testing"
```

---

## FASE 6: Documentación y Escalabilidad

### Task 14: Crear documentación para agregar nuevos reinos y hotspots

**Files:**
- Create: `docs/como-agregar-reinos-y-hotspots.md`

- [ ] **Step 1: Escribir guía de escalabilidad**

```markdown
# Cómo Agregar Nuevos Reinos y Hotspots

## Agregar un Nuevo Reino

1. Abrir `src/config/realms-data.ts`
2. Agregar nuevo objeto al array `realms`:

```typescript
{
  id: 'realm-nuevo',
  name: 'Nombre del Reino',
  title: 'Título para Display',
  description: 'Descripción del reino',
  backgroundImage: '/ruta/a/imagen.jpg',
  order: 4, // Número de orden (debe ser único)
  hotspots: [] // Array vacío o con hotspots predefinidos
}
```

3. Colocar la imagen en `public/landing-book-victoria/`
4. El componente se renderizará automáticamente en el orden especificado

## Agregar un Hotspot a un Reino Existente

1. Abrir `src/config/realms-data.ts`
2. Encontrar el reino deseado en el array `realms`
3. Agregar hotspot al array `hotspots`:

```typescript
hotspots: [
  {
    id: 'hotspot-unico',
    x: 0.5, // Coordenada X (0 = izquierda, 1 = derecha)
    y: 0.5, // Coordenada Y (0 = arriba, 1 = abajo)
    title: 'Título del Hotspot',
    description: 'Descripción del punto de interés',
    image: '/ruta/a/imagen-opcional.jpg' // Opcional
  }
]
```

4. Las coordenadas son relativas (0-1), por lo que funcionan en cualquier tamaño de pantalla

## Coordenadas de Hotspots

- `x: 0.5` = Centro horizontal
- `y: 0.5` = Centro vertical
- `x: 0.2` = 20% desde la izquierda
- `y: 0.8` = 80% desde arriba

Para encontrar coordenadas precisas:
1. Abrir la imagen en un editor de imágenes
2. Usar la herramienta de medición
3. Dividir la posición en píxeles por el ancho/alto total de la imagen

## Agregar Imagen Opcional a Hotspot

Si el hotspot debe abrir un overlay con una imagen:
1. Colocar la imagen en `public/landing-book-victoria/`
2. Agregar la propiedad `image` al hotspot
3. El componente `GalaxyOverlay` se usará automáticamente

## Notas

- El orden de los reinos se determina por la propiedad `order`
- Los IDs deben ser únicos
- Las imágenes deben estar optimizadas para web (JPEG/WebP, calidad 80-85%)
- Para hotspots sin imagen, se mostrará un tooltip con título y descripción
```

- [ ] **Step 2: Commit**

```bash
git add docs/como-agregar-reinos-y-hotspots.md
git commit -m "docs: add guide for adding new realms and hotspots"
```

---

### Task 15: Actualizar documentación del proyecto

**Files:**
- Modify: `docs/estructura-definitiva.md`

- [ ] **Step 1: Actualizar sección 4 "La Saga" con nueva descripción**

```markdown
### 4. La Saga — Dioses Universales (Mapa Interactivo del Cono Cósmico)

**Propósito:** Presentar el universo completo de la saga mediante una experiencia interactiva premium de navegación vertical dimensional a través del cono cósmico.

**Contenido:**
- Nombre de la saga: **Dioses Universales**
- Descripción: *"Una saga que cuenta el ascenso, la conquista y los vínculos familiares de los dioses regentes del universo. Donde los dioses se enfrentarán a diversos desafíos personales y políticos para conquistar el universo."*
- **Mapa interactivo del cono cósmico:**
  - Navegación vertical con scroll snap (Reino de la Luz → Reino Central → Reino Oscuro)
  - Imágenes de fondo con parallax sutil
  - Hotspots interactivos en cada reino
  - Overlay del mapa de galaxias con pinch zoom
  - Indicadores de progreso (dots animados)
- **Mockups de libros futuros:** 7 libros en total, mostrar mockups flotantes sin imagen (libros 2-7 como "próximamente")

**Estilo visual:**
- Full viewport por cada reino
- Transiciones suaves con Motion (spring physics)
- Partículas sutiles (estrellas) que responden al scroll
- Glow effects en puntos de interés interactivos
- Optimizado para móvil (90% del tráfico)

**Interacciones:**
- Swipe vertical para viajar entre reinos
- Tap en hotspots para revelar información
- Tap prolongado para abrir overlays
- Pinch zoom en el mapa de galaxias
- Haptic feedback al cambiar de nivel

**Escalabilidad:**
- Sistema de hotspots basado en JSON (fácil agregar/quitar)
- Coordenadas relativas (0-1) funcionan en cualquier tamaño de pantalla
- Soporte para agregar nuevos reinos sin refactorización
- Documentación completa en `docs/como-agregar-reinos-y-hotspots.md`
```

- [ ] **Step 2: Commit**

```bash
git add docs/estructura-definitiva.md
git commit -m "docs: update saga section description with interactive map details"
```

---

## Resumen de Cambios

**Archivos creados (9):**
1. `src/config/realms-data.ts` - Configuración escalable de reinos y hotspots
2. `src/hooks/useScrollSnap.ts` - Hook para scroll snap vertical
3. `src/hooks/useTouchGestures.ts` - Hook para gestos táctiles
4. `src/components/RealmLevel.tsx` - Componente para cada nivel del cono
5. `src/components/Hotspot.tsx` - Componente de punto de interés
6. `src/components/GalaxyOverlay.tsx` - Overlay interactivo del mapa de galaxias
7. `src/components/InteractiveMapSection-client.tsx` - Componente client con lógica
8. `src/components/InteractiveMapSection-server.tsx` - Componente server wrapper
9. `docs/como-agregar-reinos-y-hotspots.md` - Documentación de escalabilidad

**Archivos modificados (3):**
1. `src/app/page.tsx` - Reemplazar SagaSection por InteractiveMapSection
2. `src/app/globals.css` - Agregar estilos para scroll snap
3. `docs/estructura-definitiva.md` - Actualizar documentación

**Archivos a mantener (sin cambios):**
- `src/components/SagaSection-server.tsx` - Se puede mantener como backup o eliminar
- `src/components/SagaSection-client.tsx` - Grid de libros reutilizado en nuevo componente

---

## Testing Checklist

- [ ] Scroll snap vertical funciona en móvil
- [ ] Transiciones entre reinos son suaves
- [ ] Imágenes cargan correctamente (priority para primera, lazy para otras)
- [ ] Hotspots responden al tap
- [ ] Overlay de galaxias se abre y cierra
- [ ] Pinch zoom funciona en el overlay
- [ ] Haptic feedback funciona en dispositivos compatibles
- [ ] Performance es aceptable (no hay lag)
- [ ] Responsive design funciona en desktop
- [ ] Coordenadas de hotspots son correctas en diferentes tamaños de pantalla
- [ ] No hay errores en consola
- [ ] Accessibility: keyboard navigation funciona
- [ ] Accessibility: screen readers anuncian contenido correctamente

---

## Próximos Pasos (Opcionales)

Si la clienta solicita expansiones futuras:

1. **Agregar más reinos:** Seguir guía en `docs/como-agregar-reinos-y-hotspots.md`
2. **Agregar más hotspots:** Actualizar array `hotspots` en `src/config/realms-data.ts`
3. **Agregar sonidos ambientales:** Implementar con Web Audio API
4. **Agregar animaciones de partículas:** Usar canvas o Three.js para estrellas
5. **Agregar modo 3D:** Implementar con Three.js para experiencia inmersiva
6. **Agregar AR:** Usar WebXR para visualizar reinos en espacio real

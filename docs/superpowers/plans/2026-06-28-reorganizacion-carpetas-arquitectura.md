# Reorganización de Carpetas — Arquitectura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar la reorganización de carpetas propuesta en la auditoría de arquitectura, moviendo componentes a carpetas específicas por sección, creando la carpeta ui para componentes atómicos, y agregando archivos faltantes de app y lib.

**Architecture:** Migración por fases que mantiene la funcionalidad existente mientras reorganiza la estructura de carpetas. Cada fase produce un estado funcional y verificable. Se actualizan todos los imports afectados después de cada movimiento de archivos.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript 5, App Router, Motion 12.40.0

---

## Estructura de Archivos Resultante

```
src/
├── app/
│   ├── sitemap.ts              (nuevo)
│   └── robots.ts               (nuevo)
├── components/
│   ├── sections/
│   │   ├── hero/               (ya existe)
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroTitle.tsx
│   │   │   ├── HeroBookMockup.tsx
│   │   │   └── HeroCTAs.tsx
│   │   ├── sinopsis/           (nueva)
│   │   │   ├── SinopsisSection-client.tsx
│   │   │   └── SinopsisSection-server.tsx
│   │   ├── personajes/         (nueva)
│   │   │   ├── PersonajesSection-client.tsx
│   │   │   └── PersonajesSection-server.tsx
│   │   ├── mapa/               (nueva)
│   │   │   ├── InteractiveMapSection-client.tsx
│   │   │   ├── InteractiveMapSection-server.tsx
│   │   │   ├── RealmLevel.tsx
│   │   │   └── Hotspot.tsx
│   │   ├── autora/             (nueva)
│   │   │   ├── SobreAutoraSection-client.tsx
│   │   │   └── SobreAutoraSection-server.tsx
│   │   ├── comunidad/          (nueva)
│   │   │   └── ComunidadSection.tsx
│   │   ├── contacto/           (nueva)
│   │   │   └── ContactoSection.tsx
│   │   ├── testimonios/        (nueva)
│   │   │   └── TestimoniosSection.tsx
│   │   └── footer/             (nueva)
│   │       └── Footer.tsx
│   ├── overlays/               (ya existe)
│   │   ├── ZoomableOverlay.tsx
│   │   ├── ImageOverlay.tsx
│   │   ├── DualOverlay.tsx
│   │   └── GalaxyOverlay.tsx
│   ├── ui/                     (nueva)
│   │   ├── CTAButton.tsx       (movido desde raíz)
│   │   ├── SectionLabel.tsx    (nuevo)
│   │   ├── SocialLink.tsx      (nuevo)
│   │   └── IconButton.tsx     (nuevo)
│   ├── icons/                  (ya existe)
│   │   ├── InstagramIcon.tsx
│   │   ├── TikTokIcon.tsx
│   │   └── WhatsAppIcon.tsx
│   ├── CTAVisibilityProvider.tsx
│   ├── SchemaMarkup.tsx
│   ├── StickyCTA.tsx
│   └── ImageErrorFallback.tsx
├── lib/
│   ├── utils.ts                (ya existe)
│   └── overlay.ts              (nuevo)
└── ... (resto sin cambios)
```

---

## Fase 1 — Crear carpetas de secciones y mover componentes

### Task 1.1: Crear carpeta sections/sinopsis y mover componentes

**Files:**
- Create: `src/components/sections/sinopsis/` (directorio)
- Move: `src/components/SinopsisSection-client.tsx` → `src/components/sections/sinopsis/SinopsisSection-client.tsx`
- Move: `src/components/SinopsisSection-server.tsx` → `src/components/sections/sinopsis/SinopsisSection-server.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio sinopsis**

Run: `mkdir -p src/components/sections/sinopsis`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover SinopsisSection-client.tsx**

Run: `git mv src/components/SinopsisSection-client.tsx src/components/sections/sinopsis/SinopsisSection-client.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Mover SinopsisSection-server.tsx**

Run: `git mv src/components/SinopsisSection-server.tsx src/components/sections/sinopsis/SinopsisSection-server.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 4: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import SinopsisSection from '@/components/SinopsisSection-server';

// Después:
import SinopsisSection from '@/components/sections/sinopsis/SinopsisSection-server';
```

- [ ] **Step 5: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/sinopsis/ src/app/page.tsx
git commit -m "refactor(structure): mueve SinopsisSection a sections/sinopsis/"
```

---

### Task 1.2: Crear carpeta sections/personajes y mover componentes

**Files:**
- Create: `src/components/sections/personajes/` (directorio)
- Move: `src/components/PersonajesSection-client.tsx` → `src/components/sections/personajes/PersonajesSection-client.tsx`
- Move: `src/components/PersonajesSection-server.tsx` → `src/components/sections/personajes/PersonajesSection-server.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio personajes**

Run: `mkdir -p src/components/sections/personajes`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover PersonajesSection-client.tsx**

Run: `git mv src/components/PersonajesSection-client.tsx src/components/sections/personajes/PersonajesSection-client.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Mover PersonajesSection-server.tsx**

Run: `git mv src/components/PersonajesSection-server.tsx src/components/sections/personajes/PersonajesSection-server.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 4: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import PersonajesSection from '@/components/PersonajesSection-server';

// Después:
import PersonajesSection from '@/components/sections/personajes/PersonajesSection-server';
```

- [ ] **Step 5: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/personajes/ src/app/page.tsx
git commit -m "refactor(structure): mueve PersonajesSection a sections/personajes/"
```

---

### Task 1.3: Crear carpeta sections/mapa y mover componentes

**Files:**
- Create: `src/components/sections/mapa/` (directorio)
- Move: `src/components/InteractiveMapSection-client.tsx` → `src/components/sections/mapa/InteractiveMapSection-client.tsx`
- Move: `src/components/InteractiveMapSection-server.tsx` → `src/components/sections/mapa/InteractiveMapSection-server.tsx`
- Move: `src/components/RealmLevel.tsx` → `src/components/sections/mapa/RealmLevel.tsx`
- Move: `src/components/Hotspot.tsx` → `src/components/sections/mapa/Hotspot.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/mapa/InteractiveMapSection-client.tsx` (imports internos)

- [ ] **Step 1: Crear directorio mapa**

Run: `mkdir -p src/components/sections/mapa`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover InteractiveMapSection-client.tsx**

Run: `git mv src/components/InteractiveMapSection-client.tsx src/components/sections/mapa/InteractiveMapSection-client.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Mover InteractiveMapSection-server.tsx**

Run: `git mv src/components/InteractiveMapSection-server.tsx src/components/sections/mapa/InteractiveMapSection-server.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 4: Mover RealmLevel.tsx**

Run: `git mv src/components/RealmLevel.tsx src/components/sections/mapa/RealmLevel.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 5: Mover Hotspot.tsx**

Run: `git mv src/components/Hotspot.tsx src/components/sections/mapa/Hotspot.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 6: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import InteractiveMapSection from '@/components/InteractiveMapSection-server';

// Después:
import InteractiveMapSection from '@/components/sections/mapa/InteractiveMapSection-server';
```

- [ ] **Step 7: Actualizar imports internos en InteractiveMapSection-client.tsx**

En `src/components/sections/mapa/InteractiveMapSection-client.tsx`, buscar y reemplazar:

```tsx
// Antes:
import RealmLevel from '@/components/RealmLevel';
import Hotspot from '@/components/Hotspot';

// Después:
import RealmLevel from '@/components/sections/mapa/RealmLevel';
import Hotspot from '@/components/sections/mapa/Hotspot';
```

- [ ] **Step 8: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/mapa/ src/app/page.tsx
git commit -m "refactor(structure): mueve componentes del mapa a sections/mapa/"
```

---

### Task 1.4: Crear carpeta sections/autora y mover componentes

**Files:**
- Create: `src/components/sections/autora/` (directorio)
- Move: `src/components/SobreAutoraSection-client.tsx` → `src/components/sections/autora/SobreAutoraSection-client.tsx`
- Move: `src/components/SobreAutoraSection-server.tsx` → `src/components/sections/autora/SobreAutoraSection-server.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio autora**

Run: `mkdir -p src/components/sections/autora`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover SobreAutoraSection-client.tsx**

Run: `git mv src/components/SobreAutoraSection-client.tsx src/components/sections/autora/SobreAutoraSection-client.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Mover SobreAutoraSection-server.tsx**

Run: `git mv src/components/SobreAutoraSection-server.tsx src/components/sections/autora/SobreAutoraSection-server.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 4: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import SobreAutoraSection from '@/components/SobreAutoraSection-server';

// Después:
import SobreAutoraSection from '@/components/sections/autora/SobreAutoraSection-server';
```

- [ ] **Step 5: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/autora/ src/app/page.tsx
git commit -m "refactor(structure): mueve SobreAutoraSection a sections/autora/"
```

---

### Task 1.5: Crear carpeta sections/comunidad y mover componente

**Files:**
- Create: `src/components/sections/comunidad/` (directorio)
- Move: `src/components/ComunidadSection.tsx` → `src/components/sections/comunidad/ComunidadSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio comunidad**

Run: `mkdir -p src/components/sections/comunidad`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover ComunidadSection.tsx**

Run: `git mv src/components/ComunidadSection.tsx src/components/sections/comunidad/ComunidadSection.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import ComunidadSection from '@/components/ComunidadSection';

// Después:
import ComunidadSection from '@/components/sections/comunidad/ComunidadSection';
```

- [ ] **Step 4: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/comunidad/ src/app/page.tsx
git commit -m "refactor(structure): mueve ComunidadSection a sections/comunidad/"
```

---

### Task 1.6: Crear carpeta sections/contacto y mover componente

**Files:**
- Create: `src/components/sections/contacto/` (directorio)
- Move: `src/components/ContactoSection.tsx` → `src/components/sections/contacto/ContactoSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio contacto**

Run: `mkdir -p src/components/sections/contacto`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover ContactoSection.tsx**

Run: `git mv src/components/ContactoSection.tsx src/components/sections/contacto/ContactoSection.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import ContactoSection from '@/components/ContactoSection';

// Después:
import ContactoSection from '@/components/sections/contacto/ContactoSection';
```

- [ ] **Step 4: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/contacto/ src/app/page.tsx
git commit -m "refactor(structure): mueve ContactoSection a sections/contacto/"
```

---

### Task 1.7: Crear carpeta sections/testimonios y mover componente

**Files:**
- Create: `src/components/sections/testimonios/` (directorio)
- Move: `src/components/TestimoniosSection.tsx` → `src/components/sections/testimonios/TestimoniosSection.tsx`
- Modify: `src/app/page.tsx` (si se usa)

- [ ] **Step 1: Crear directorio testimonios**

Run: `mkdir -p src/components/sections/testimonios`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover TestimoniosSection.tsx**

Run: `git mv src/components/TestimoniosSection.tsx src/components/sections/testimonios/TestimoniosSection.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Actualizar import en page.tsx si existe**

Buscar en `src/app/page.tsx` si hay import de TestimoniosSection y actualizar:

```tsx
// Si existe, cambiar de:
import TestimoniosSection from '@/components/TestimoniosSection';

// A:
import TestimoniosSection from '@/components/sections/testimonios/TestimoniosSection';
```

- [ ] **Step 4: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/testimonios/ src/app/page.tsx
git commit -m "refactor(structure): mueve TestimoniosSection a sections/testimonios/"
```

---

### Task 1.8: Crear carpeta sections/footer y mover componente

**Files:**
- Create: `src/components/sections/footer/` (directorio)
- Move: `src/components/Footer.tsx` → `src/components/sections/footer/Footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear directorio footer**

Run: `mkdir -p src/components/sections/footer`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover Footer.tsx**

Run: `git mv src/components/Footer.tsx src/components/sections/footer/Footer.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Actualizar import en page.tsx**

En `src/app/page.tsx`, buscar y reemplazar:

```tsx
// Antes:
import Footer from '@/components/Footer';

// Después:
import Footer from '@/components/sections/footer/Footer';
```

- [ ] **Step 4: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/footer/ src/app/page.tsx
git commit -m "refactor(structure): mueve Footer a sections/footer/"
```

---

## Fase 2 — Crear carpeta ui y mover/crear componentes UI

### Task 2.1: Crear carpeta ui y mover CTAButton

**Files:**
- Create: `src/components/ui/` (directorio)
- Move: `src/components/CTAButton.tsx` → `src/components/ui/CTAButton.tsx`
- Modify: Todos los archivos que importan CTAButton

- [ ] **Step 1: Crear directorio ui**

Run: `mkdir -p src/components/ui`
Expected: directorio creado sin errores

- [ ] **Step 2: Mover CTAButton.tsx**

Run: `git mv src/components/CTAButton.tsx src/components/ui/CTAButton.tsx`
Expected: archivo movido, git reconoce el movimiento

- [ ] **Step 3: Actualizar imports en HeroSection**

En `src/components/sections/hero/HeroSection.tsx` (o donde esté), buscar y reemplazar:

```tsx
// Antes:
import CTAButton from '@/components/CTAButton';

// Después:
import CTAButton from '@/components/ui/CTAButton';
```

- [ ] **Step 4: Actualizar imports en SinopsisSection-client**

En `src/components/sections/sinopsis/SinopsisSection-client.tsx`, buscar y reemplazar:

```tsx
// Antes:
import CTAButton from '@/components/CTAButton';

// Después:
import CTAButton from '@/components/ui/CTAButton';
```

- [ ] **Step 5: Actualizar imports en otros archivos que usen CTAButton**

Buscar en todo el proyecto:

Run: `grep -r "from '@/components/CTAButton'" src/ --include="*.tsx" --include="*.ts"`
Expected: lista de archivos que necesitan actualización

Para cada archivo encontrado, reemplazar el import:

```tsx
// Antes:
import CTAButton from '@/components/CTAButton';

// Después:
import CTAButton from '@/components/ui/CTAButton';
```

- [ ] **Step 6: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/ src/components/sections/hero/ src/components/sections/sinopsis/
git commit -m "refactor(structure): mueve CTAButton a components/ui/ y actualiza imports"
```

---

### Task 2.2: Crear SectionLabel.tsx

**Files:**
- Create: `src/components/ui/SectionLabel.tsx`

- [ ] **Step 1: Crear SectionLabel.tsx**

```tsx
import { motion } from 'motion/react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center ${className}`}
    >
      {children}
    </motion.p>
  );
}
```

- [ ] **Step 2: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SectionLabel.tsx
git commit -m "feat(ui): agrega SectionLabel componente reutilizable"
```

---

### Task 2.3: Crear SocialLink.tsx

**Files:**
- Create: `src/components/ui/SocialLink.tsx`

- [ ] **Step 1: Crear SocialLink.tsx**

```tsx
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  handle?: string;
  className?: string;
}

export default function SocialLink({ 
  href, 
  icon, 
  label, 
  handle, 
  className = '' 
}: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex items-center gap-4 px-6 py-4 rounded-lg bg-surface-2 border border-border-subtle hover:border-accent transition-colors group ${className}`}
    >
      <span className="text-accent group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <div className="text-left">
        <p className="font-medium text-ink-primary">{label}</p>
        {handle && <p className="text-sm text-ink-tertiary">{handle}</p>}
      </div>
    </motion.a>
  );
}
```

- [ ] **Step 2: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SocialLink.tsx
git commit -m "feat(ui): agrega SocialLink componente reutilizable"
```

---

### Task 2.4: Crear IconButton.tsx

**Files:**
- Create: `src/components/ui/IconButton.tsx`

- [ ] **Step 1: Crear IconButton.tsx**

```tsx
import { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

export default function IconButton({ 
  icon, 
  onClick, 
  ariaLabel, 
  className = '',
  disabled = false
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
    </button>
  );
}
```

- [ ] **Step 2: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/IconButton.tsx
git commit -m "feat(ui): agrega IconButton componente reutilizable"
```

---

## Fase 3 — Crear archivos de app (sitemap y robots)

### Task 3.1: Crear sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Crear sitemap.ts**

```ts
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

- [ ] **Step 2: Verificar que SITE_CONFIG existe**

Run: `ls src/config/site.ts`
Expected: archivo existe

- [ ] **Step 3: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): agrega sitemap.ts dinámico"
```

---

### Task 3.2: Crear robots.ts

**Files:**
- Create: `src/app/robots.ts`
- Delete: `public/robots.txt` (si existe)

- [ ] **Step 1: Crear robots.ts**

```ts
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Eliminar robots.txt estático si existe**

Run: `ls public/robots.txt`
Si existe:
```bash
git rm public/robots.txt
```

- [ ] **Step 3: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): agrega robots.ts dinámico"
```

---

## Fase 4 — Crear helpers de overlay en lib

### Task 4.1: Crear overlay.ts con helpers de zoom/pan

**Files:**
- Create: `src/lib/overlay.ts`

- [ ] **Step 1: Crear overlay.ts**

```ts
/**
 * Helpers para manipulación de zoom y pan en overlays
 */

/**
 * Clampa un valor entre un mínimo y un máximo
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calcula el nuevo zoom basado en un delta (pinch gesture)
 */
export function calculateZoom(currentZoom: number, delta: number): number {
  const newZoom = currentZoom + delta;
  return clamp(newZoom, 0.5, 3);
}

/**
 * Calcula la nueva posición basada en delta y zoom actual
 */
export function calculatePan(
  currentX: number,
  currentY: number,
  deltaX: number,
  deltaY: number,
  zoom: number
): { x: number; y: number } {
  // El pan se escala inversamente con el zoom para mayor precisión
  const scale = 1 / zoom;
  return {
    x: currentX + deltaX * scale,
    y: currentY + deltaY * scale,
  };
}

/**
 * Resetea zoom y posición a valores iniciales
 */
export function resetZoomAndPan(): { zoom: number; position: { x: number; y: number } } {
  return {
    zoom: 1,
    position: { x: 0, y: 0 },
  };
}
```

- [ ] **Step 2: Verificar type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/overlay.ts
git commit -m "feat(lib): agrega helpers de zoom/pan para overlays"
```

---

## Fase 5 — Verificación final

### Task 5.1: Verificación integral de la reorganización

**Files:**
- Todos los archivos modificados

- [ ] **Step 1: Verificar estructura de carpetas**

Run: `tree src/components/sections -L 2`
Expected: estructura con hero, sinopsis, personajes, mapa, autora, comunidad, contacto, testimonios, footer

Run: `tree src/components/ui -L 1`
Expected: estructura con CTAButton.tsx, SectionLabel.tsx, SocialLink.tsx, IconButton.tsx

- [ ] **Step 2: Verificar type check completo**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build exitoso sin errores

- [ ] **Step 4: Verificar que no hay archivos huérfanos en components raíz**

Run: `ls src/components/*.tsx`
Expected: solo archivos que deben estar en raíz (CTAVisibilityProvider, SchemaMarkup, StickyCTA, ImageErrorFallback, GalaxyOverlay si no se movió)

- [ ] **Step 5: Commit final de verificación**

```bash
git add .
git commit -m "chore: verificación integral post-reorganización de carpetas"
```

---

## Resumen de Fases

| Fase | Descripción | Tasks |
|------|-------------|-------|
| **Fase 1** | Mover secciones a carpetas específicas | 8 tasks (sinopsis, personajes, mapa, autora, comunidad, contacto, testimonios, footer) |
| **Fase 2** | Crear carpeta ui y componentes atómicos | 4 tasks (mover CTAButton, crear SectionLabel, SocialLink, IconButton) |
| **Fase 3** | Crear archivos SEO de app | 2 tasks (sitemap.ts, robots.ts) |
| **Fase 4** | Crear helpers de overlay | 1 task (overlay.ts) |
| **Fase 5** | Verificación final | 1 task (verificación integral) |
| **Total** | | **16 tasks** |

---

## Notas Importantes

**Orden de ejecución:**
- Las fases deben ejecutarse en orden secuencial
- Cada task debe completarse completamente antes de pasar a la siguiente
- Los commits son obligatorios después de cada task para facilitar rollback si es necesario

**Archivos que NO se mueven:**
- `CTAVisibilityProvider.tsx` - se queda en raíz de components por ser un provider global
- `SchemaMarkup.tsx` - se queda en raíz de components por ser un componente de layout
- `StickyCTA.tsx` - se queda en raíz de components por ser un componente global
- `ImageErrorFallback.tsx` - se queda en raíz de components por ser un componente utilitario
- `GalaxyOverlay.tsx` - se queda en overlays por ser un overlay específico

**Impacto en imports:**
- Todos los imports deben actualizarse inmediatamente después de mover archivos
- Usar `git mv` para preservar el historial de git
- Verificar con `npx tsc --noEmit` después de cada cambio

---

## Ejecución

**Plan completo guardado en:** `docs/superpowers/plans/2026-06-28-reorganizacion-carpetas-arquitectura.md`

**Opciones de ejecución:**

1. **Subagent-Driven (recomendado)** - Despachar un subagente fresco por task, revisar entre tasks, fast iteration
2. **Inline Execution** - Ejecutar tasks en esta sesión usando executing-plans, batch execution con checkpoints

¿Cuál prefieres?

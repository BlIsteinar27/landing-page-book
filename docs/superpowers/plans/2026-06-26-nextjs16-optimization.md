# Next.js 16 Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimizar la landing page para aprovechar las características de Next.js 16, mejorar performance y seguir patrones arquitectónicos recomendados.

**Architecture:** Separación de Server/Client Components, implementación de ISR, optimización de imágenes, mejoras en Motion y Tailwind.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, Motion 12.40.0, Tailwind CSS v4, TypeScript.

---

# FASE 1: Separación Server/Client Components (CRÍTICO)

## Task 1.1: Crear SinopsisSection-server.tsx

**Files:**
- Create: `src/components/SinopsisSection-server.tsx`
- Modify: `src/components/SinopsisSection.tsx`

- [ ] **Step 1: Crear SinopsisSection-server.tsx (Server Component)**

```tsx
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import SinopsisSectionClient from './SinopsisSection-client';

export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
          El Primer Libro
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-lg overflow-hidden"
              style={{
                border: '1px solid var(--accent-glow)',
                boxShadow: '4px 8px 40px rgba(0,0,0,0.8)',
              }}
            >
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>
          
          <SinopsisSectionClient />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Crear SinopsisSection-client.tsx (Client Component)**

```tsx
'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/CTAButton';

export default function SinopsisSectionClient() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-4xl font-display font-black text-ink-primary">
        Los Dos Reinos
      </h2>
      
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Fantasía Oscura
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Romance
        </span>
        <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
          Política
        </span>
      </div>
      
      <p className="text-ink-secondary leading-relaxed">
        [Sinopsis pendiente de Victoria — sin spoilers]
      </p>
      
      <p className="text-sm text-ink-tertiary">
        📅 Lanzamiento: Octubre 2026
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <CTAButton variant="whatsapp" />
        <CTAButton variant="amazon" />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Eliminar archivo original SinopsisSection.tsx**

- [ ] **Step 4: Actualizar import en page.tsx**

```tsx
import SobreLibroSection from '@/components/SinopsisSection-server';
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SinopsisSection-server.tsx src/components/SinopsisSection-client.tsx src/app/page.tsx
git commit -m "refactor: separar SinopsisSection en server/client components"
```

---

## Task 1.2: Crear SagaSection-server.tsx

**Files:**
- Create: `src/components/SagaSection-server.tsx`
- Create: `src/components/SagaSection-client.tsx`
- Modify: `src/components/SagaSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear SagaSection-server.tsx**

```tsx
import Image from 'next/image';
import SagaSectionClient from './SagaSection-client';

const libros = [
  { titulo: 'Los Dos Reinos', estado: 'Octubre 2026', actual: true },
  { titulo: 'Libro 2', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 3', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 4', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 5', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 6', estado: 'Próximamente', actual: false },
  { titulo: 'Libro 7', estado: 'Próximamente', actual: false },
];

export default function SagaSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-1">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      
      <div className="relative max-w-6xl mx-auto">
        <SagaSectionClient libros={libros} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Crear SagaSection-client.tsx**

```tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}

interface SagaSectionClientProps {
  libros: Libro[];
}

export default function SagaSectionClient({ libros }: SagaSectionClientProps) {
  return (
    <>
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
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-6 text-center">
          El Universo
        </p>
        <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden border border-border-default">
          <Image
            src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
            alt="Mapa del universo de Dioses Universales"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
            className="object-contain bg-surface-base"
          />
        </div>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 3: Eliminar archivo original SagaSection.tsx**

- [ ] **Step 4: Actualizar import en page.tsx**

```tsx
import SagaSection from '@/components/SagaSection-server';
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SagaSection-server.tsx src/components/SagaSection-client.tsx src/app/page.tsx
git commit -m "refactor: separar SagaSection en server/client components"
```

---

## Task 1.3: Crear PersonajesSection-server.tsx

**Files:**
- Create: `src/components/PersonajesSection-server.tsx`
- Create: `src/components/PersonajesSection-client.tsx`
- Modify: `src/components/PersonajesSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear PersonajesSection-server.tsx**

```tsx
import Image from 'next/image';
import PersonajesSectionClient from './PersonajesSection-client';

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(114, 74, 165, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        <PersonajesSectionClient />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Crear PersonajesSection-client.tsx**

```tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function PersonajesSectionClient() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center"
      >
        Los Protagonistas
      </motion.p>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-display font-black text-center mb-16 text-ink-primary"
      >
        Conoce a los Personajes Principales
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-2xl"
      >
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src="/landing-book-victoria/prota-libro-1-sin-fondo.PNG"
            alt="Personajes principales de Los Dos Reinos"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent-glow blur-2xl" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3"
      >
        <p className="text-base text-ink-secondary leading-relaxed">
          Dioses con poder de doblar el destino del universo. Decisiones que no solo 
          mueven reinos, sino que reescriben las leyes de lo divino.
        </p>
        <p className="text-sm text-ink-tertiary italic font-serif">
          Dioses Universales — Los Dos Reinos
        </p>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 3: Eliminar archivo original PersonajesSection.tsx**

- [ ] **Step 4: Actualizar import en page.tsx**

```tsx
import PersonajesSection from '@/components/PersonajesSection-server';
```

- [ ] **Step 5: Commit**

```bash
git add src/components/PersonajesSection-server.tsx src/components/PersonajesSection-client.tsx src/app/page.tsx
git commit -m "refactor: separar PersonajesSection en server/client components"
```

---

## Task 1.4: Crear SobreAutoraSection-server.tsx

**Files:**
- Create: `src/components/SobreAutoraSection-server.tsx`
- Create: `src/components/SobreAutoraSection-client.tsx`
- Modify: `src/components/SobreAutoraSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear SobreAutoraSection-server.tsx**

```tsx
import SobreAutoraSectionClient from './SobreAutoraSection-client';

export default function SobreAutoraSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl bg-accent-dim" />
      <div className="relative max-w-5xl mx-auto">
        <SobreAutoraSectionClient />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Crear SobreAutoraSection-client.tsx**

```tsx
'use client';

import { motion, type Transition } from 'motion/react';

const credencialesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const credencialItemTransition: Transition = { duration: 0.45 };

const credencialVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: credencialItemTransition },
};

const credenciales = [
  { valor: '11+', label: 'Años escribiendo' },
  { valor: '7', label: 'Libros en la saga' },
  { valor: '2026', label: 'Lanzamiento oficial' },
];

export default function SobreAutoraSectionClient() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-xs tracking-[0.25em] uppercase font-medium mb-14 text-center text-accent"
      >
        La autora
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 flex justify-center"
        >
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--accent) 0%, transparent 60%, var(--accent) 100%)`,
                padding: '2px',
                borderRadius: '50%',
              }}
            />
            <div
              className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden flex items-center justify-center border-2 border-border-emphasis"
              style={{
                background: 'linear-gradient(145deg, var(--surface-3), var(--surface-4))',
                boxShadow: '0 0 40px var(--accent-glow)',
              }}
            >
              <span className="text-sm italic font-serif text-ink-tertiary">
                Foto profesional pendiente
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="md:col-span-8 flex flex-col gap-6 text-center md:text-left"
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight font-display text-ink-primary">
            Victoria Querales
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            Soy Licenciada en Comunicación Social con mención en Periodismo Audiovisual, 
            y llevo más de una década construyendo universos desde la palabra. Mi relación 
            con la escritura creativa comenzó en 2015, impulsada por una pregunta que 
            siempre me acompañó: ¿qué hay más allá de la comprensión humana?
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            En 2019 compartí los primeros borradores de mi saga Dioses Universales — 
            publicando el primer libro, Los Dos Reinos en Wattpad — donde una comunidad 
            de lectores acompañó el nacimiento de este universo. Tras años de trabajo y 
            dedicación, cerré la saga en 2024 con siete libros que conforman una historia 
            épica sobre poder, familia y destino.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
            Actualmente, la saga se encuentra en proceso de edición profesional, y su 
            primer volumen llegará a manos de los lectores en octubre de 2026. Los 
            borradores originales de Wattpad ya no están disponibles, pues esta nueva 
            etapa trae consigo una versión pulida y definitiva de mi universo.
          </p>
          
          <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
            "Desde niña, me inventaba historias para tranquilizar la soledad de mi mente 
            inquieta. Siempre estaba en las nubes, imaginando cómo se creó el universo y 
            si de verdad existen seres poderosos capaces de mantener el orden más allá de 
            la comprensión humana. Por ese motivo, hace 11 años comencé los primeros 
            borradores de lo que hoy es mi saga Dioses Universales — porque algunas 
            preguntas solo encuentran respuesta cuando las conviertes en un mundo propio."
          </blockquote>

          <motion.div
            className="grid grid-cols-3 gap-4 mt-2 pt-6 border-t border-border-subtle"
            variants={credencialesContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {credenciales.map((c) => (
              <motion.div
                key={c.label}
                variants={credencialVariants}
                className="flex flex-col gap-1"
              >
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-display text-accent">
                  {c.valor}
                </span>
                <span className="text-xs leading-tight text-ink-tertiary">
                  {c.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Eliminar archivo original SobreAutoraSection.tsx**

- [ ] **Step 4: Actualizar import en page.tsx**

```tsx
import SobreAutoraSection from '@/components/SobreAutoraSection-server';
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SobreAutoraSection-server.tsx src/components/SobreAutoraSection-client.tsx src/app/page.tsx
git commit -m "refactor: separar SobreAutoraSection en server/client components"
```

---

# FASE 2: Agregar Error Boundaries y Loading States (CRÍTICO)

## Task 2.1: Crear error.tsx

**Files:**
- Create: `src/app/error.tsx`

- [ ] **Step 1: Crear error.tsx**

```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface-base">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-display font-black text-accent mb-4">
          Algo salió mal
        </h1>
        <p className="text-ink-secondary mb-8">
          {error.message || 'Ha ocurrido un error inesperado.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-white hover:opacity-90 transition-opacity"
          style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/error.tsx
git commit -m "feat: agregar error boundary global"
```

---

## Task 2.2: Crear not-found.tsx

**Files:**
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Crear not-found.tsx**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface-base">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display font-black text-accent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-display font-bold text-ink-primary mb-4">
          Página no encontrada
        </h2>
        <p className="text-ink-secondary mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-white hover:opacity-90 transition-opacity"
          style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: agregar not-found page"
```

---

## Task 2.3: Crear loading.tsx

**Files:**
- Create: `src/app/loading.tsx`

- [ ] **Step 1: Crear loading.tsx**

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

- [ ] **Step 2: Commit**

```bash
git add src/app/loading.tsx
git commit -m "feat: agregar loading state global"
```

---

# FASE 3: Optimizar Imágenes (CRÍTICO)

## Task 3.1: Remover priority de imágenes below-the-fold

**Files:**
- Modify: `src/components/SinopsisSection-server.tsx`
- Modify: `src/components/SagaSection-server.tsx`
- Modify: `src/components/PersonajesSection-server.tsx`

- [ ] **Step 1: Remover priority de SinopsisSection-server.tsx** (ya no tiene priority, verificar)

- [ ] **Step 2: Verificar que SagaSection-server.tsx no tenga priority** (ya no tiene)

- [ ] **Step 3: Remover priority de PersonajesSection-server.tsx**

```tsx
<Image
  src="/landing-book-victoria/prota-libro-1-sin-fondo.PNG"
  alt="Personajes principales de Los Dos Reinos"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-contain"
  // Remover: priority
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PersonajesSection-server.tsx
git commit -m "perf: remover priority de imágenes below-the-fold"
```

---

## Task 3.2: Agregar loading="lazy" a imágenes no críticas

**Files:**
- Modify: `src/components/SinopsisSection-server.tsx`
- Modify: `src/components/SagaSection-server.tsx`
- Modify: `src/components/PersonajesSection-server.tsx`

- [ ] **Step 1: Agregar loading="lazy" a SinopsisSection-server.tsx**

```tsx
<Image
  src="/landing-book-victoria/portada-libro-1.png"
  alt="Portada oficial de Los Dos Reinos"
  fill
  loading="lazy"
  className="object-cover"
  sizes="(max-width: 768px) 200px, (max-width: 1024px) 224px, 256px"
/>
```

- [ ] **Step 2: Agregar loading="lazy" a SagaSection-server.tsx** (ambas imágenes)

```tsx
// Primera imagen (background)
<Image
  src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
  alt=""
  fill
  loading="lazy"
  sizes="100vw"
  className="object-cover"
/>

// Segunda imagen (mapa)
<Image
  src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
  alt="Mapa del universo de Dioses Universales"
  fill
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
  className="object-contain bg-surface-base"
/>
```

- [ ] **Step 3: Agregar loading="lazy" a PersonajesSection-server.tsx**

```tsx
<Image
  src="/landing-book-victoria/prota-libro-1-sin-fondo.PNG"
  alt="Personajes principales de Los Dos Reinos"
  fill
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-contain"
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SinopsisSection-server.tsx src/components/SagaSection-server.tsx src/components/PersonajesSection-server.tsx
git commit -m "perf: agregar lazy loading a imágenes no críticas"
```

---

# FASE 4: Implementar ISR (IMPORTANTE)

## Task 4.1: Configurar ISR en page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Agregar revalidate a page.tsx**

```tsx
import HeroSection from '@/components/HeroSection';
import SobreLibroSection from '@/components/SinopsisSection-server';
import PersonajesSection from '@/components/PersonajesSection-server';
import SagaSection from '@/components/SagaSection-server';
import SobreAutoraSection from '@/components/SobreAutoraSection-server';
import ComunidadSection from '@/components/ComunidadSection';
import ContactoSection from '@/components/ContactoSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export const revalidate = 3600; // Revalidar cada hora

export default function Home() {
  return (
    <>
      <HeroSection />
      <SobreLibroSection />
      <PersonajesSection />
      <SagaSection />
      <SobreAutoraSection />
      <ComunidadSection />
      <ContactoSection />
      <Footer />
      <StickyCTA />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implementar ISR con revalidate de 1 hora"
```

---

# FASE 5: Centralizar SVGs (IMPORTANTE)

## Task 5.1: Crear componentes de iconos

**Files:**
- Create: `src/components/icons/InstagramIcon.tsx`
- Create: `src/components/icons/TikTokIcon.tsx`
- Create: `src/components/icons/WhatsAppIcon.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ComunidadSection.tsx`
- Modify: `src/components/ContactoSection.tsx`

- [ ] **Step 1: Crear InstagramIcon.tsx**

```tsx
export default function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
```

- [ ] **Step 2: Crear TikTokIcon.tsx**

```tsx
export default function TikTokIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  );
}
```

- [ ] **Step 3: Crear WhatsAppIcon.tsx**

```tsx
export default function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
```

- [ ] **Step 4: Actualizar Footer.tsx para usar iconos**

```tsx
'use client';

import { motion } from 'motion/react';
import CTAButton from '@/components/CTAButton';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';

export default function Footer() {
  const redes = [
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/victoria_aql',
      icon: <InstagramIcon className="w-4 h-4" />,
    },
    {
      label: 'TikTok',
      url: 'https://tiktok.com/@victoria_aql',
      icon: <TikTokIcon className="w-4 h-4" />,
    },
  ];

  return (
    <footer className="relative overflow-hidden px-5 pt-24 pb-16 bg-surface-2">
      {/* Resto del código igual */}
      <div className="flex items-center gap-4">
        {redes.map(({ icon, label, url }) => (
          <motion.a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-3 text-ink-tertiary hover:text-accent transition-colors"
          >
            {icon}
          </motion.a>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Actualizar ComunidadSection.tsx para usar iconos**

```tsx
'use client';

import { motion } from 'motion/react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';

const redes = [
  {
    nombre: 'Instagram',
    handle: '@victoria_aql',
    url: 'https://www.instagram.com/victoria_aql',
    icon: <InstagramIcon />,
  },
  {
    nombre: 'TikTok',
    handle: '@victoria_aql',
    url: 'https://tiktok.com/@victoria_aql',
    icon: <TikTokIcon />,
  },
];

// Resto del código igual
```

- [ ] **Step 6: Actualizar ContactoSection.tsx para usar iconos**

```tsx
'use client';

import { motion } from 'motion/react';
import { LINKS } from '@/config/links';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';

export default function ContactoSection() {
  return (
    <section className="relative py-24 px-5 bg-surface-1">
      {/* Resto del código */}
      <a
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
      
      <a
        href="https://www.instagram.com/victoria_aql"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium hover:opacity-90 transition-opacity"
      >
        <InstagramIcon />
        Instagram DM
      </a>
    </section>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/icons/ src/components/Footer.tsx src/components/ComunidadSection.tsx src/components/ContactoSection.tsx
git commit -m "refactor: centralizar SVGs en componentes reutilizables"
```

---

# FASE 6: Mejorar Motion Performance (IMPORTANTE)

## Task 6.1: Implementar staggerChildren en SagaSection

**Files:**
- Modify: `src/components/SagaSection-client.tsx`

- [ ] **Step 1: Agregar variants con staggerChildren a SagaSection-client.tsx**

```tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}

interface SagaSectionClientProps {
  libros: Libro[];
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SagaSectionClient({ libros }: SagaSectionClientProps) {
  return (
    <>
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
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {libros.map((libro) => (
          <motion.div
            key={libro.titulo}
            variants={itemVariants}
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
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-6 text-center">
          El Universo
        </p>
        <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden border border-border-default">
          <Image
            src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
            alt="Mapa del universo de Dioses Universales"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
            className="object-contain bg-surface-base"
          />
        </div>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SagaSection-client.tsx
git commit -m "perf: implementar staggerChildren en SagaSection para mejor performance"
```

---

# FASE 7: Optimizar Tailwind (MEJORA)

## Task 7.1: Extraer valores arbitrarios al tema

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Agregar tracking-widest-2 al tema en globals.css**

```css
@import "tailwindcss";

@theme {
  /* Superficies — Victoria Querales Brand (Púrpura oscuro) */
  --color-surface-base: #1a0d2e;
  --color-surface-1: #241438;
  --color-surface-2: #2e1b42;
  --color-surface-3: #38224c;
  --color-surface-4: #422956;

  /* Bordes — Con tinte dorado sutil */
  --color-border-subtle: rgba(255, 198, 103, 0.08);
  --color-border-default: rgba(255, 198, 103, 0.15);
  --color-border-emphasis: rgba(255, 198, 103, 0.25);

  /* Texto — Crema VQ */
  --color-ink-primary: #fef4e6;
  --color-ink-secondary: rgba(254, 244, 230, 0.72);
  --color-ink-tertiary: rgba(254, 244, 230, 0.45);
  --color-ink-muted: rgba(254, 244, 230, 0.25);

  /* Acento primario — Dorado VQ */
  --color-accent: #ffc667;
  --color-accent-dim: rgba(255, 198, 103, 0.15);
  --color-accent-glow: rgba(255, 198, 103, 0.25);

  /* Acento secundario — Naranja VQ */
  --color-accent-secondary: #fa8c34;

  /* Púrpura medio — Para hovers y elementos secundarios */
  --color-purple-medium: #724aa5;

  /* Semánticos */
  --color-success: #3a7a35;

  /* Tipografía — Victoria Querales Brand */
  --font-display: "Cinzel Decorative", "Playfair Display", Georgia, serif;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;

  /* Spacing custom */
  --tracking-widest-2: 0.25em;
}
```

- [ ] **Step 2: Reemplazar tracking-[0.25em] por tracking-widest-2 en todos los componentes**

```tsx
// En todos los componentes donde aparece tracking-[0.25em]:
className="text-xs tracking-widest-2 uppercase text-accent mb-8 text-center"
```

**Archivos a modificar:**
- src/components/HeroSection.tsx (línea 79)
- src/components/SinopsisSection-client.tsx
- src/components/SagaSection-client.tsx
- src/components/PersonajesSection-client.tsx
- src/components/SobreAutoraSection-client.tsx
- src/components/ComunidadSection.tsx
- src/components/ContactoSection.tsx

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/components/HeroSection.tsx src/components/SinopsisSection-client.tsx src/components/SagaSection-client.tsx src/components/PersonajesSection-client.tsx src/components/SobreAutoraSection-client.tsx src/components/ComunidadSection.tsx src/components/ContactoSection.tsx
git commit -m "refactor: extraer tracking-[0.25em] al tema como tracking-widest-2"
```

---

# FASE 8: Implementar View Transitions (MEJORA)

## Task 8.1: Agregar ViewTransition a HeroSection

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Envolver título principal con ViewTransition**

```tsx
'use client';

import { motion, type Transition, ViewTransition } from 'motion/react';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';

// Resto de variants igual...

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 pt-16 pb-28 md:pb-20 bg-surface-base"
    >
      {/* Glow de acento */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 60% 80%, var(--accent-glow) 0%, transparent 70%)',
        }}
      />

      {/* Línea de borde superior sutil */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Columna de texto */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-7 text-center lg:text-left"
            variants={heroColumnVariants}
            initial="hidden"
            animate="visible"
          >

            {/* Badge de lanzamiento */}
            <motion.div
              variants={heroBadgeVariants}
              className="inline-flex items-center gap-2 justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest-2 uppercase border border-border-emphasis bg-accent-dim text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Lanzamiento Octubre 2026
              </span>
            </motion.div>

            {/* Título principal con ViewTransition */}
            <motion.h1
              variants={heroTitleVariants}
              className="text-[clamp(2.6rem,8vw,5.5rem)] leading-[1.05] tracking-tight font-black font-display text-ink-primary"
            >
              <ViewTransition>
                Victoria{' '}
                <em className="not-italic font-serif text-accent">
                  Querales
                </em>
              </ViewTransition>
            </motion.h1>

            {/* Resto del código igual */}
          </motion.div>

          {/* Mockup del libro */}
          {/* Resto del código igual */}
        </div>
      </div>

    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: agregar ViewTransition a título principal de HeroSection"
```

---

# RESUMEN DE FASES

- **Fase 1:** Separación Server/Client Components (4 tareas) - CRÍTICO
- **Fase 2:** Error Boundaries y Loading States (3 tareas) - CRÍTICO
- **Fase 3:** Optimizar Imágenes (2 tareas) - CRÍTICO
- **Fase 4:** Implementar ISR (1 tarea) - IMPORTANTE
- **Fase 5:** Centralizar SVGs (1 tarea) - IMPORTANTE
- **Fase 6:** Mejorar Motion Performance (1 tarea) - IMPORTANTE
- **Fase 7:** Optimizar Tailwind (1 tarea) - MEJORA
- **Fase 8:** Implementar View Transitions (1 tarea) - MEJORA

**Total:** 14 tareas en 8 fases

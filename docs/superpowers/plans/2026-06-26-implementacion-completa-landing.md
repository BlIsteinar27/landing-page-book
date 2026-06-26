# Implementación Completa Landing Page Victoria Querales

> **Para trabajadores agénticos:** REQUIRED SUB-SKILL: Usar superpowers:subagent-driven-development o superpowers:executing-plans para implementar este plan.

**Goal:** Implementar todas las secciones de la landing page con el contenido real de Victoria Querales, integrando los assets disponibles y siguiendo la identidad gráfica ya configurada.

**Architecture:** Adaptar componentes existentes y crear nuevos siguiendo patrones de Motion para animaciones, Tailwind para estilos, y diseño mobile-first. Estética: fantasía oscura cósmica con acentos dorados sobre púrpura profundo.

**Tech Stack:** Next.js 14+, Tailwind CSS 4.0, Motion (Framer Motion), TypeScript

**Prerrequisito completado:** ✅ Plan de actualización de paleta de colores ejecutado

---

## Dirección de Diseño

### Dominio Visual
- **Mundo:** Cosmos, dioses, poder celestial, romance político
- **Colores naturales:** Cielo nocturno (#1a0d2e), estrellas doradas (#ffc667), nebulosas púrpura (#724aa5), luz divina (crema #fef4e6)
- **Signature:** Efectos de glow dorado que evocan divinidad + partículas de estrellas flotantes

### Profundidad y Capas
- **Estrategia:** Bordes con tinte dorado sutil + glows para elevación
- **Superficies:** Púrpura profundo base → capas más claras para elevación
- **Animaciones:** Entrada con fade + slide sutil, floating para elementos místicos

---

## Estructura de Archivos

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modificar | `src/components/HeroSection.tsx` | Hero con contenido Victoria |
| Modificar | `src/components/SinopsisSection.tsx` | Sobre el Libro |
| Crear | `src/components/PersonajesSection.tsx` | Ilustraciones + atmósfera |
| Crear | `src/components/SagaSection.tsx` | La saga + mockups + mapa |
| Modificar | `src/components/SobreAutoraSection.tsx` | Bio completa Victoria |
| Crear | `src/components/ComunidadSection.tsx` | Redes sociales |
| Crear | `src/components/ContactoSection.tsx` | WhatsApp + IG |
| Modificar | `src/components/Footer.tsx` | Logo + copyright VQ |
| Modificar | `src/components/CTAButton.tsx` | Enlaces reales |
| Modificar | `src/app/page.tsx` | Integrar nuevas secciones |

---

## FASE 1: Adaptar Componentes Existentes

### Task 1.1: Actualizar HeroSection con contenido Victoria

**Files:**
- Modificar: `src/components/HeroSection.tsx`

- [ ] **Step 1: Actualizar textos del Hero**

Cambiar el contenido placeholder por el contenido real:

```tsx
// Badge
<span>Lanzamiento Octubre 2026</span>

// Título principal
<h1>
  Victoria{' '}
  <em className="not-italic font-serif text-accent">Querales</em>
</h1>

// Subtítulo - Frase gancho
<p>
  Donde amar es un acto político capaz de cambiar por completo el universo.
</p>

// CTA
<CTAButton variant="primary" text="Descubre el primer libro" />
```

- [ ] **Step 2: Actualizar mockup del libro**

Reemplazar el placeholder de portada por la imagen real cuando esté confirmada. Por ahora usar placeholder mejorado:

```tsx
<div className="relative w-full h-full rounded-r-lg overflow-hidden">
  {/* Placeholder hasta confirmar portada */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-medium/20 to-surface-base flex items-center justify-center">
    <span className="text-accent font-serif text-xl italic">Los Dos Reinos</span>
  </div>
</div>
```

- [ ] **Step 3: Eliminar social proof de lectores (libro no lanzado)**

Remover o comentar la sección de "+500 lectores" ya que el libro aún no está publicado.

- [ ] **Step 4: Verificar visualmente**

Run: `npm run dev`
Verificar Hero con nuevo contenido.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat(hero): actualizar contenido con info Victoria Querales"
```

---

### Task 1.2: Actualizar SobreAutoraSection con bio completa

**Files:**
- Modificar: `src/components/SobreAutoraSection.tsx`

- [ ] **Step 1: Actualizar título y bio**

```tsx
<h2>Victoria Querales</h2>

<p>
  Soy Licenciada en Comunicación Social con mención en Periodismo Audiovisual, 
  y llevo más de una década construyendo universos desde la palabra. Mi relación 
  con la escritura creativa comenzó en 2015, impulsada por una pregunta que 
  siempre me acompañó: ¿qué hay más allá de la comprensión humana?
</p>

<p>
  En 2019 compartí los primeros borradores de mi saga Dioses Universales — 
  publicando el primer libro, Los Dos Reinos en Wattpad — donde una comunidad 
  de lectores acompañó el nacimiento de este universo. Tras años de trabajo y 
  dedicación, cerré la saga en 2024 con siete libros que conforman una historia 
  épica sobre poder, familia y destino.
</p>
```

- [ ] **Step 2: Agregar cita de inspiración**

```tsx
<blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
  "Desde niña, me inventaba historias para tranquilizar la soledad de mi mente 
  inquieta. Siempre estaba en las nubes, imaginando cómo se creó el universo..."
</blockquote>
```

- [ ] **Step 3: Actualizar credenciales**

```tsx
const credenciales = [
  { valor: '11+', label: 'Años escribiendo' },
  { valor: '7', label: 'Libros en la saga' },
  { valor: '2026', label: 'Lanzamiento oficial' },
];
```

- [ ] **Step 4: Placeholder para foto**

Actualizar para usar la foto de Victoria cuando se confirme:

```tsx
{/* Cuando se confirme la foto */}
<Image 
  src="/landing-book-victoria/[FOTO_CONFIRMADA].jpg"
  alt="Victoria Querales"
  fill
  className="object-cover"
/>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SobreAutoraSection.tsx
git commit -m "feat(autora): actualizar con bio completa de Victoria"
```

---

### Task 1.3: Actualizar SinopsisSection → Sobre el Libro

**Files:**
- Modificar: `src/components/SinopsisSection.tsx`

- [ ] **Step 1: Actualizar estructura para "Sobre el Libro"**

```tsx
export default function SobreLibroSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8 text-center">
          El Primer Libro
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portada del libro */}
          <div className="flex justify-center">
            {/* Mockup de libro */}
          </div>
          
          {/* Información */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-display font-black text-ink-primary">
              Los Dos Reinos
            </h2>
            
            {/* Género tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Fantasía Oscura
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Romance Político
              </span>
            </div>
            
            {/* Sinopsis - placeholder hasta que Victoria envíe */}
            <p className="text-ink-secondary leading-relaxed">
              [Sinopsis pendiente de Victoria — sin spoilers]
            </p>
            
            {/* Fecha */}
            <p className="text-sm text-ink-tertiary">
              📅 Lanzamiento: Octubre 2026
            </p>
            
            {/* Botones de compra */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <CTAButton variant="whatsapp" />
              <CTAButton variant="amazon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Renombrar archivo si es necesario**

Considerar renombrar a `SobreLibroSection.tsx` para mayor claridad.

- [ ] **Step 3: Commit**

```bash
git add src/components/SinopsisSection.tsx
git commit -m "feat(libro): reestructurar sección Sobre el Libro"
```

---

## FASE 2: Crear Secciones Nuevas

### Task 2.1: Crear PersonajesSection

**Files:**
- Crear: `src/components/PersonajesSection.tsx`

- [ ] **Step 1: Crear componente de personajes**

```tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function PersonajesSection() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden bg-surface-base">
      {/* Glow de fondo */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(114, 74, 165, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
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
          Conoce a los Dioses
        </motion.h2>
        
        {/* Ilustración de personajes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/landing-book-victoria/412 sin título_20250929190834.PNG"
              alt="Personajes principales de Los Dos Reinos"
              fill
              className="object-contain"
            />
            {/* Glow bajo la imagen */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent-glow blur-2xl" />
          </div>
        </motion.div>
        
        {/* Cita atmosférica */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl italic font-serif text-ink-secondary">
            "Donde amar es un acto político capaz de cambiar por completo el universo."
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PersonajesSection.tsx
git commit -m "feat: crear sección Personajes con ilustraciones"
```

---

### Task 2.2: Crear SagaSection con mapa de galaxias

**Files:**
- Crear: `src/components/SagaSection.tsx`

- [ ] **Step 1: Crear componente de la saga**

```tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

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
      {/* Mapa de galaxias como fondo */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      
      <div className="relative max-w-6xl mx-auto">
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
        
        {/* Grid de mockups de libros */}
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
        
        {/* Mapa del universo destacado */}
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
              className="object-contain bg-surface-base"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SagaSection.tsx
git commit -m "feat: crear sección La Saga con mockups y mapa de galaxias"
```

---

### Task 2.3: Crear ComunidadSection

**Files:**
- Crear: `src/components/ComunidadSection.tsx`

- [ ] **Step 1: Crear componente de comunidad**

```tsx
'use client';

import { motion } from 'motion/react';

const redes = [
  {
    nombre: 'Instagram',
    handle: '@victoria_aql',
    url: 'https://www.instagram.com/victoria_aql',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    nombre: 'TikTok',
    handle: '@victoria_aql',
    url: 'https://tiktok.com/@victoria_aql',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
  },
];

export default function ComunidadSection() {
  return (
    <section className="relative py-24 px-5 bg-surface-base">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8"
        >
          Comunidad
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary"
        >
          Únete a los lectores
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-ink-secondary mb-12 max-w-xl mx-auto"
        >
          Sigue el viaje de creación, conoce más del universo de Dioses Universales 
          y sé parte de la comunidad.
        </motion.p>
        
        {/* Cards de redes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {redes.map((red, i) => (
            <motion.a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 px-6 py-4 rounded-lg bg-surface-2 border border-border-subtle hover:border-accent transition-colors group"
            >
              <span className="text-accent group-hover:scale-110 transition-transform">
                {red.icon}
              </span>
              <div className="text-left">
                <p className="font-medium text-ink-primary">{red.nombre}</p>
                <p className="text-sm text-ink-tertiary">{red.handle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ComunidadSection.tsx
git commit -m "feat: crear sección Comunidad con redes sociales"
```

---

### Task 2.4: Crear ContactoSection

**Files:**
- Crear: `src/components/ContactoSection.tsx`

- [ ] **Step 1: Crear componente de contacto**

```tsx
'use client';

import { motion } from 'motion/react';

export default function ContactoSection() {
  return (
    <section className="relative py-24 px-5 bg-surface-1">
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-accent mb-8"
        >
          Contacto
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-black mb-6 text-ink-primary"
        >
          ¿Tienes alguna pregunta?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-ink-secondary mb-10"
        >
          Escríbeme por cualquiera de estos canales y con gusto te responderé.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* WhatsApp */}
          <a
            href="#" // Enlace pendiente de Victoria
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          
          {/* Instagram DM */}
          <a
            href="https://www.instagram.com/victoria_aql"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram DM
          </a>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactoSection.tsx
git commit -m "feat: crear sección Contacto con WhatsApp e Instagram"
```

---

## FASE 3: Integración y Footer

### Task 3.1: Actualizar Footer con identidad Victoria

**Files:**
- Modificar: `src/components/Footer.tsx`

- [ ] **Step 1: Actualizar contenido del Footer**

```tsx
export default function Footer() {
  return (
    <footer className="py-12 px-5 bg-surface-base border-t border-border-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo / Nombre */}
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-accent">
              Victoria Querales
            </p>
            <p className="text-sm text-ink-tertiary mt-1">
              Autora de Dioses Universales
            </p>
          </div>
          
          {/* Redes sociales */}
          <div className="flex gap-4">
            <a href="https://www.instagram.com/victoria_aql" target="_blank" rel="noopener noreferrer" 
               className="text-ink-tertiary hover:text-accent transition-colors">
              {/* Instagram icon */}
            </a>
            <a href="https://tiktok.com/@victoria_aql" target="_blank" rel="noopener noreferrer"
               className="text-ink-tertiary hover:text-accent transition-colors">
              {/* TikTok icon */}
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border-subtle text-center">
          <p className="text-xs text-ink-muted">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(footer): actualizar con identidad Victoria Querales"
```

---

### Task 3.2: Integrar todas las secciones en page.tsx

**Files:**
- Modificar: `src/app/page.tsx`

- [ ] **Step 1: Actualizar imports y orden de secciones**

```tsx
import HeroSection from '@/components/HeroSection';
import SobreLibroSection from '@/components/SinopsisSection'; // o renombrar
import PersonajesSection from '@/components/PersonajesSection';
import SagaSection from '@/components/SagaSection';
import SobreAutoraSection from '@/components/SobreAutoraSection';
import ComunidadSection from '@/components/ComunidadSection';
import ContactoSection from '@/components/ContactoSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

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

- [ ] **Step 2: Eliminar TestimoniosSection (reemplazada por ComunidadSection)**

- [ ] **Step 3: Verificar navegación completa**

Run: `npm run dev`
Scroll por toda la página verificando transiciones entre secciones.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrar todas las secciones en orden definitivo"
```

---

## FASE 4: Pulido y Optimización

### Task 4.1: Verificar responsive

- [ ] **Step 1: Probar en móvil (375px)**
- [ ] **Step 2: Probar en tablet (768px)**
- [ ] **Step 3: Probar en desktop (1280px+)**
- [ ] **Step 4: Ajustar cualquier issue de spacing o overflow**

### Task 4.2: Configurar SEO

**Files:**
- Modificar: `src/app/layout.tsx`

- [ ] **Step 1: Actualizar metadata**

```tsx
export const metadata: Metadata = {
  title: 'Victoria Querales | Dioses Universales - Fantasía Oscura',
  description: 'Descubre Los Dos Reinos, el primer libro de la saga Dioses Universales. Una historia épica de fantasía oscura, política y romance. Lanzamiento octubre 2026.',
  openGraph: {
    title: 'Victoria Querales | Dioses Universales',
    description: 'Donde amar es un acto político capaz de cambiar por completo el universo.',
    type: 'website',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): configurar metadata para Victoria Querales"
```

### Task 4.3: Optimizar imágenes

- [ ] **Step 1: Verificar que todas las imágenes usan next/image**
- [ ] **Step 2: Agregar sizes y priority donde corresponda**
- [ ] **Step 3: Considerar convertir PNGs grandes a WebP**

---

## Resumen de Fases

| Fase | Descripción | Tiempo Est. |
|------|-------------|-------------|
| **Fase 1** | Adaptar componentes existentes (Hero, Autora, Libro) | 45-60 min |
| **Fase 2** | Crear secciones nuevas (Personajes, Saga, Comunidad, Contacto) | 60-90 min |
| **Fase 3** | Integración y Footer | 20-30 min |
| **Fase 4** | Pulido, responsive, SEO | 30-45 min |
| **Total** | | **2.5-4 horas** |

---

## Dependencias de Victoria

Estas tareas quedan bloqueadas hasta recibir info:

- [ ] Integrar portada real del libro → Hero + Sobre el Libro
- [ ] Integrar sinopsis → Sobre el Libro
- [ ] Integrar enlace WhatsApp → CTAButton + Contacto
- [ ] Confirmar foto profesional → Sobre la Autora

---

## Ejecución

**Plan completo guardado en:** `docs/superpowers/plans/2026-06-26-implementacion-completa-landing.md`

**Opciones de ejecución:**

1. **Subagent-Driven (recomendado)** - Despachar un subagente fresco por tarea, revisar entre tareas
2. **Inline Execution** - Ejecutar tareas en esta sesión con checkpoints

¿Cuál prefieres?

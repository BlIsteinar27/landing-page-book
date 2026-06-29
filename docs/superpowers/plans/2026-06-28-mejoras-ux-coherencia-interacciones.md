# Mejoras de UX - Coherencia de Interacciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar y mejorar la coherencia de las interacciones y botones en toda la landing page para proporcionar una experiencia de usuario consistente y profesional.

**Architecture:** El plan se divide en 3 fases por prioridad: (1) correcciones críticas de inconsistencias en botones principales, (2) mejoras de consistencia en componentes similares, (3) refinamientos de micro-interacciones. Cada fase aborda problemas específicos identificados en el análisis de UX.

**Tech Stack:** React, TypeScript, Motion (Framer Motion), Tailwind CSS, Next.js

---

## File Structure

**Archivos a modificar:**
- `src/components/ui/CTAButton.tsx` - Unificar estilo de botón WhatsApp
- `src/components/StickyCTA.tsx` - Alinear estilo con CTAButton
- `src/components/sections/sinopsis/SinopsisSection-client.tsx` - Manejo de botón Amazon
- `src/components/sections/footer/Footer.tsx` - Manejo de botón Amazon
- `src/components/sections/mapa/Hotspot.tsx` - Documentar long press
- `src/components/sections/saga/SagaSection-client.tsx` - Agregar hover interaction
- `src/components/sections/comunidad/ComunidadSection.tsx` - Extraer componente de redes
- `src/components/sections/footer/Footer.tsx` - Usar componente extraído
- `src/components/sections/personajes/PersonajesSection-client.tsx` - Agregar pausa en hover
- `src/components/sections/autora/SobreAutoraSection-client.tsx` - Agregar CTA a redes
- `src/components/ui/NavigationDots.tsx` - Nuevo componente reutilizable (Fase 3)

---

## FASE 1: Correcciones Críticas (Prioridad Alta)

### Task 1: Unificar estilo de botón WhatsApp en CTAButton y StickyCTA

**Files:**
- Modify: `src/components/ui/CTAButton.tsx`
- Modify: `src/components/StickyCTA.tsx`

**Contexto:** Actualmente hay dos implementaciones diferentes del botón WhatsApp: CTAButton usa bg-surface-2 con border-border-emphasis, mientras StickyCTA usa bg-[#25D366] (verde WhatsApp). Esto crea inconsistencia visual. Vamos a unificar usando el estilo de CTAButton que es más coherente con la paleta de marca.

- [ ] **Step 1: Modificar CTAButton para agregar variante whatsapp-sticky**

```typescript
// En src/components/ui/CTAButton.tsx
interface CTAButtonProps {
  variant: 'whatsapp' | 'primary' | 'whatsapp-sticky';
  className?: string;
  text?: string;
}
```

- [ ] **Step 2: Implementar variante whatsapp-sticky con estilo verde**

```typescript
// En src/components/ui/CTAButton.tsx, después de la variante primary
if (variant === 'whatsapp-sticky') {
  return (
    <motion.a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      {...sharedMotion}
      className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-[#25D366] text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#25D366] ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      {text || 'Reservar ahora'}
    </motion.a>
  );
}
```

- [ ] **Step 3: Modificar StickyCTA para usar CTAButton con variante whatsapp-sticky**

```typescript
// En src/components/StickyCTA.tsx
import CTAButton from '@/components/ui/CTAButton';

// Reemplazar el botón WhatsApp actual (líneas 52-64) con:
<CTAButton variant="whatsapp-sticky" text="Reservar ahora" className="w-full" />
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CTAButton.tsx src/components/StickyCTA.tsx
git commit -m "fix: unificar estilo de botón WhatsApp usando CTAButton con variante whatsapp-sticky"
```

---

### Task 2: Documentar funcionalidad de long press en hotspots

**Files:**
- Modify: `src/components/sections/mapa/Hotspot.tsx`

**Contexto:** Los hotspots tienen funcionalidad de long press (useTouchGestures onLongPress) pero no hay indicador visual en la UI. Los usuarios no saben que pueden hacer long press. Vamos a agregar un tooltip que mencione esta funcionalidad.

- [ ] **Step 1: Agregar estado para mostrar tooltip de long press**

```typescript
// En src/components/sections/mapa/Hotspot.tsx, después de useState isVisible
const [showLongPressHint, setShowLongPressHint] = useState(false);
```

- [ ] **Step 2: Agregar useEffect para mostrar hint después de 3 segundos**

```typescript
// En src/components/sections/mapa/Hotspot.tsx, después del useEffect existente
useEffect(() => {
  if (isVisible) {
    const timer = setTimeout(() => {
      setShowLongPressHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [isVisible]);
```

- [ ] **Step 3: Agregar tooltip de long press en el label del hotspot**

```typescript
// En src/components/sections/mapa/Hotspot.tsx, modificar el label visible (líneas 118-129)
{hotspot.isProminent && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute top-full mt-3 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
  >
    <p className="text-xs font-medium text-ink-primary">
      {hotspot.title}
    </p>
    <p className="text-[10px] text-accent mt-0.5">Toca para explorar</p>
    {showLongPressHint && (
      <p className="text-[9px] text-ink-tertiary mt-1 italic">
        También puedes mantener presionado
      </p>
    )}
  </motion.div>
)}
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/mapa/Hotspot.tsx
git commit -m "feat: agregar indicador visual de long press en hotspots"
```

---

### Task 3: Unificar tratamiento de botón Amazon (ocultar completamente)

**Files:**
- Modify: `src/components/sections/sinopsis/SinopsisSection-client.tsx`
- Modify: `src/components/sections/footer/Footer.tsx`
- Modify: `src/components/StickyCTA.tsx`

**Contexto:** El botón Amazon está comentado en múltiples lugares con placeholders diferentes. Vamos a ocultarlo completamente de forma consistente hasta tener el link real, para evitar la sensación de "incompleto".

- [ ] **Step 1: Eliminar placeholder de Amazon en StickyCTA**

```typescript
// En src/components/StickyCTA.tsx, eliminar líneas 46-50 (el placeholder)
// Dejar solo el botón WhatsApp en el grid
<div className="grid grid-cols-1 gap-3">
  <CTAButton variant="whatsapp-sticky" text="Reservar ahora" className="w-full" />
</div>
```

- [ ] **Step 2: Eliminar comentario de botón Amazon en SinopsisSection**

```typescript
// En src/components/sections/sinopsis/SinopsisSection-client.tsx
// Eliminar líneas 49-50 (comentario del botón Amazon)
// Dejar solo el botón WhatsApp
<div className="flex flex-col sm:flex-row gap-3 pt-4">
  <CTAButton variant="whatsapp" text="Reserva Los Dos Reinos" />
</div>
```

- [ ] **Step 3: Eliminar comentario de botón Amazon en Footer**

```typescript
// En src/components/sections/footer/Footer.tsx
// Eliminar líneas 48-49 (comentario del botón Amazon)
// Dejar solo el botón WhatsApp
<CTAButton variant="whatsapp" text="Consigue tu copia" />
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/StickyCTA.tsx src/components/sections/sinopsis/SinopsisSection-client.tsx src/components/sections/footer/Footer.tsx
git commit -m "refactor: ocultar botón Amazon completamente hasta tener link real"
```

---

## FASE 2: Mejoras de Consistencia (Prioridad Media)

### Task 4: Agregar hover interaction a cards de Saga

**Files:**
- Modify: `src/components/sections/saga/SagaSection-client.tsx`

**Contexto:** Las cards de Saga no tienen hover interaction, mientras que las cards de Comunidad sí. Vamos a agregar hover consistente y hacer la card del libro actual clickeable con link a WhatsApp.

- [ ] **Step 1: Importar CTAButton y LINKS**

```typescript
// En src/components/sections/saga/SagaSection-client.tsx
import CTAButton from '@/components/ui/CTAButton';
import { LINKS } from '@/config/links';
```

- [ ] **Step 2: Agregar hover effect a las cards**

```typescript
// En src/components/sections/saga/SagaSection-client.tsx
// Modificar el motion.div de la card (líneas 44-63) para agregar whileHover
<motion.div
  key={libro.titulo}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.1 }}
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
  className={`
    aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors
    ${libro.actual 
      ? 'bg-accent/20 border border-accent hover:bg-accent/30' 
      : 'bg-surface-2 border border-border-subtle hover:bg-surface-3'}
  `}
>
```

- [ ] **Step 3: Hacer card del libro actual clickeable**

```typescript
// En src/components/sections/saga/SagaSection-client.tsx
// Envolver la card del libro actual en un link si es el libro 1
{libro.actual && i === 0 ? (
  <a
    href={LINKS.whatsapp}
    target="_blank"
    rel="noopener noreferrer"
    className="contents"
  >
    {/* contenido de la card */}
  </a>
) : (
  {/* contenido de la card sin link */}
)}
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/saga/SagaSection-client.tsx
git commit -m "feat: agregar hover interaction a cards de Saga y hacer libro 1 clickeable"
```

---

### Task 5: Extraer componente reutilizable de SocialLinkCard

**Files:**
- Create: `src/components/ui/SocialLinkCard.tsx`
- Modify: `src/components/sections/comunidad/ComunidadSection.tsx`
- Modify: `src/components/sections/footer/Footer.tsx`

**Contexto:** Los iconos de redes tienen estilos diferentes en ComunidadSection (cards premium) y Footer (iconos simples). Vamos a extraer el estilo premium de ComunidadSection en un componente reutilizable y usarlo en ambos lugares.

- [ ] **Step 1: Crear componente SocialLinkCard**

```typescript
// Crear src/components/ui/SocialLinkCard.tsx
'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SocialLinkCardProps {
  nombre: string;
  handle: string;
  url: string;
  icon: ReactNode;
  index?: number;
}

export default function SocialLinkCard({ nombre, handle, url, icon, index = 0 }: SocialLinkCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
      
      {/* Card */}
      <div className="relative flex items-center gap-4 px-8 py-5 rounded-xl bg-surface-2 border border-border-subtle group-hover:border-accent/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base">
        {/* Icon container con efecto cósmico */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md group-hover:bg-accent/30 transition-colors" />
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 group-hover:border-accent/40 transition-all">
            <span className="text-accent group-hover:scale-110 transition-transform">
              {icon}
            </span>
          </div>
        </div>
        
        {/* Text */}
        <div className="text-left">
          <p className="font-semibold text-ink-primary group-hover:text-accent transition-colors">{nombre}</p>
          <p className="text-sm text-ink-tertiary font-mono">{handle}</p>
        </div>
        
        {/* Arrow indicator */}
        <svg className="w-4 h-4 text-ink-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.a>
  );
}
```

- [ ] **Step 2: Modificar ComunidadSection para usar SocialLinkCard**

```typescript
// En src/components/sections/comunidad/ComunidadSection.tsx
import SocialLinkCard from '@/components/ui/SocialLinkCard';

// Reemplazar el mapeo de redes (líneas 56-98) con:
{redes.map((red, i) => (
  <SocialLinkCard
    key={red.nombre}
    nombre={red.nombre}
    handle={red.handle}
    url={red.url}
    icon={red.icon}
    index={i}
  />
))}
```

- [ ] **Step 3: Modificar Footer para usar SocialLinkCard**

```typescript
// En src/components/sections/footer/Footer.tsx
import SocialLinkCard from '@/components/ui/SocialLinkCard';

// Reemplazar la sección de redes sociales (líneas 62-89) con:
<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
  {[
    {
      nombre: 'Instagram',
      handle: '@victoria_aql',
      url: SOCIAL_LINKS_FLAT.instagram,
      icon: <InstagramIcon className="w-4 h-4" />,
    },
    {
      nombre: 'TikTok',
      handle: '@victoria_aql',
      url: SOCIAL_LINKS_FLAT.tiktok,
      icon: <TikTokIcon className="w-4 h-4" />,
    },
  ].map((red, i) => (
    <SocialLinkCard
      key={red.nombre}
      nombre={red.nombre}
      handle={red.handle}
      url={red.url}
      icon={red.icon}
      index={i}
    />
  ))}
</div>
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SocialLinkCard.tsx src/components/sections/comunidad/ComunidadSection.tsx src/components/sections/footer/Footer.tsx
git commit -m "refactor: extraer SocialLinkCard reutilizable y unificar estilo de redes sociales"
```

---

### Task 6: Agregar pausa en hover a carrusel Personajes

**Files:**
- Modify: `src/components/sections/personajes/PersonajesSection-client.tsx`

**Contexto:** El carrusel de personajes tiene auto-play cada 6 segundos pero no se pausa cuando el usuario interactúa. Vamos a agregar pausa en hover del carrusel.

- [ ] **Step 1: Agregar estado para controlar pausa**

```typescript
// En src/components/sections/personajes/PersonajesSection-client.tsx
const [isPaused, setIsPaused] = useState(false);
```

- [ ] **Step 2: Modificar useEffect para respetar pausa**

```typescript
// En src/components/sections/personajes/PersonajesSection-client.tsx
// Modificar el useEffect (líneas 23-28)
useEffect(() => {
  if (isPaused) return;
  
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % personajes.length);
  }, 6000);
  return () => clearInterval(interval);
}, [isPaused]);
```

- [ ] **Step 3: Agregar handlers de mouse enter/leave al contenedor del carrusel**

```typescript
// En src/components/sections/personajes/PersonajesSection-client.tsx
// Modificar el motion.div del carrusel (líneas 50-103) para agregar handlers
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="relative mx-auto max-w-2xl"
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/personajes/PersonajesSection-client.tsx
git commit -m "feat: agregar pausa en hover a carrusel de personajes"
```

---

### Task 7: Agregar CTA en Sección Autora

**Files:**
- Modify: `src/components/sections/autora/SobreAutoraSection-client.tsx`

**Contexto:** La sección de la autora no tiene CTAs a redes sociales, mientras que ComunidadSection sí. Vamos a agregar un CTA "Sigue a Victoria" con links a redes.

- [ ] **Step 1: Importar SocialLinkCard y SOCIAL_LINKS_FLAT**

```typescript
// En src/components/sections/autora/SobreAutoraSection-client.tsx
import SocialLinkCard from '@/components/ui/SocialLinkCard';
import { SOCIAL_LINKS_FLAT } from '@/config/links';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
```

- [ ] **Step 2: Agregar sección de redes sociales después de las credenciales**

```typescript
// En src/components/sections/autora/SobreAutoraSection-client.tsx
// Agregar después del motion.div de credenciales (después de línea 136)
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.4 }}
  className="mt-8 pt-6 border-t border-border-subtle"
>
  <p className="text-sm text-ink-secondary mb-4 text-center md:text-left">
    Sigue el viaje de creación
  </p>
  <div className="flex flex-col sm:flex-row gap-4">
    <SocialLinkCard
      nombre="Instagram"
      handle={SOCIAL_LINKS_FLAT.instagramHandle}
      url={SOCIAL_LINKS_FLAT.instagram}
      icon={<InstagramIcon className="w-4 h-4" />}
    />
    <SocialLinkCard
      nombre="TikTok"
      handle={SOCIAL_LINKS_FLAT.tiktokHandle}
      url={SOCIAL_LINKS_FLAT.tiktok}
      icon={<TikTokIcon className="w-4 h-4" />}
    />
  </div>
</motion.div>
```

- [ ] **Step 3: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/autora/SobreAutoraSection-client.tsx
git commit -m "feat: agregar CTA a redes sociales en sección de autora"
```

---

## FASE 3: Refinamientos de Micro-interacciones (Prioridad Baja)

### Task 8: Crear componente reutilizable NavigationDots

**Files:**
- Create: `src/components/ui/NavigationDots.tsx`
- Modify: `src/components/sections/mapa/InteractiveMapSection-client.tsx`
- Modify: `src/components/sections/personajes/PersonajesSection-client.tsx`

**Contexto:** Los indicadores de navegación (dots) tienen estilos diferentes en el mapa interactivo y el carrusel de personajes. Vamos a crear un componente reutilizable con parámetros configurables.

- [ ] **Step 1: Crear componente NavigationDots**

```typescript
// Crear src/components/ui/NavigationDots.tsx
'use client';

import { motion } from 'motion/react';

interface NavigationDotsProps {
  count: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  size?: 'small' | 'medium' | 'large';
  showTooltips?: boolean;
  tooltips?: string[];
}

const sizeConfig = {
  small: { default: 'w-2 h-2', active: 'w-4' },
  medium: { default: 'w-3 h-3', active: 'w-6' },
  large: { default: 'w-4 h-4', active: 'w-8' },
};

export default function NavigationDots({
  count,
  activeIndex,
  onIndexChange,
  size = 'medium',
  showTooltips = false,
  tooltips = [],
}: NavigationDotsProps) {
  const config = sizeConfig[size];

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative group">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onIndexChange(index)}
            aria-label={`Navegar a elemento ${index + 1}`}
            className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ${
              index === activeIndex
                ? `bg-accent ${config.active}`
                : `bg-ink-muted hover:bg-ink-tertiary ${config.default}`
            }`}
          />
          {showTooltips && tooltips[index] && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 shadow-xl">
                <p className="text-xs text-ink-primary">{tooltips[index]}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Modificar InteractiveMapSection para usar NavigationDots**

```typescript
// En src/components/sections/mapa/InteractiveMapSection-client.tsx
import NavigationDots from '@/components/ui/NavigationDots';

// Reemplazar la sección de dots (líneas 83-112) con:
<AnimatePresence>
  {isInSection && (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
    >
      <NavigationDots
        count={realms.length}
        activeIndex={activeIndex}
        onIndexChange={scrollToIndex}
        size="medium"
        showTooltips
        tooltips={realms.map(r => r.name)}
      />
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 3: Modificar PersonajesSection para usar NavigationDots**

```typescript
// En src/components/sections/personajes/PersonajesSection-client.tsx
import NavigationDots from '@/components/ui/NavigationDots';

// Reemplazar la sección de dots (líneas 105-119) con:
<NavigationDots
  count={personajes.length}
  activeIndex={currentIndex}
  onIndexChange={setCurrentIndex}
  size="small"
/>
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/NavigationDots.tsx src/components/sections/mapa/InteractiveMapSection-client.tsx src/components/sections/personajes/PersonajesSection-client.tsx
git commit -m "refactor: crear NavigationDots reutilizable y unificar estilo de indicadores"
```

---

### Task 9: Crear tokens compartidos para micro-interacciones

**Files:**
- Create: `src/config/motion-tokens.ts`
- Modify: `src/components/ui/CTAButton.tsx`
- Modify: `src/components/sections/comunidad/ComunidadSection.tsx`
- Modify: `src/components/sections/footer/Footer.tsx`

**Contexto:** Los parámetros de micro-interacciones (scale, translate, etc.) están duplicados en múltiples componentes. Vamos a crear tokens compartidos para asegurar consistencia.

- [ ] **Step 1: Crear archivo de tokens de motion**

```typescript
// Crear src/config/motion-tokens.ts
export const motionTokens = {
  // Scale interactions
  scale: {
    hover: 1.02,
    tap: 0.96,
    iconHover: 1.15,
    iconTap: 0.92,
  },
  // Translate interactions
  translate: {
    cardHover: -4,
    arrowHover: 4,
  },
  // Spring physics
  spring: {
    stiffness: 400,
    damping: 20,
  },
  // Duration
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
};
```

- [ ] **Step 2: Modificar CTAButton para usar tokens**

```typescript
// En src/components/ui/CTAButton.tsx
import { motionTokens } from '@/config/motion-tokens';

// Reemplazar sharedMotion (líneas 13-17) con:
const sharedMotion = {
  whileTap: { scale: motionTokens.scale.tap },
  whileHover: { scale: motionTokens.scale.hover },
  transition: { 
    type: 'spring' as const, 
    stiffness: motionTokens.spring.stiffness, 
    damping: motionTokens.spring.damping 
  },
};
```

- [ ] **Step 3: Modificar Footer para usar tokens en iconos de redes**

```typescript
// En src/components/sections/footer/Footer.tsx
import { motionTokens } from '@/config/motion-tokens';

// Modificar los motion.a de redes (líneas 75-87) para usar tokens:
whileHover={{ scale: motionTokens.scale.iconHover }}
whileTap={{ scale: motionTokens.scale.iconTap }}
transition={{ 
  type: 'spring', 
  stiffness: motionTokens.spring.stiffness, 
  damping: motionTokens.spring.damping 
}}
```

- [ ] **Step 4: Verificar que el build no tenga errores**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript

- [ ] **Step 5: Commit**

```bash
git add src/config/motion-tokens.ts src/components/ui/CTAButton.tsx src/components/sections/footer/Footer.tsx
git commit -m "refactor: crear tokens compartidos para micro-interacciones"
```

---

## Testing y Verificación Final

### Task 10: Verificación completa de todas las mejoras

**Files:**
- No modifications (verification only)

- [ ] **Step 1: Ejecutar build completo**

Run: `npm run build`
Expected: Build exitoso sin errores de TypeScript ni warnings

- [ ] **Step 2: Verificar visualmente cada mejora**

Manual testing checklist:
- [ ] Botón WhatsApp tiene estilo consistente en toda la página
- [ ] Hotspots muestran hint de long press después de 3 segundos
- [ ] No hay placeholders de botón Amazon visibles
- [ ] Cards de Saga tienen hover effect
- [ ] Libro 1 de Saga es clickeable y lleva a WhatsApp
- [ ] Iconos de redes tienen estilo premium en Footer y Comunidad
- [ ] Carrusel de personajes se pausa en hover
- [ ] Sección Autora tiene CTAs a redes sociales
- [ ] Dots de navegación tienen estilo consistente
- [ ] Micro-interacciones usan parámetros consistentes

- [ ] **Step 3: Ejecutar linter**

Run: `npm run lint`
Expected: Sin errores de linting

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "chore: verificación completa de mejoras de UX - todas las fases implementadas"
```

---

## Resumen de Cambios

**Fase 1 - Correcciones Críticas:**
- Task 1: Unificar estilo de botón WhatsApp (CTAButton + StickyCTA)
- Task 2: Documentar long press en hotspots
- Task 3: Ocultar botón Amazon completamente

**Fase 2 - Mejoras de Consistencia:**
- Task 4: Agregar hover interaction a cards de Saga
- Task 5: Extraer SocialLinkCard reutilizable
- Task 6: Agregar pausa en hover a carrusel Personajes
- Task 7: Agregar CTA en Sección Autora

**Fase 3 - Refinamientos:**
- Task 8: Crear NavigationDots reutilizable
- Task 9: Crear tokens compartidos para micro-interacciones
- Task 10: Verificación completa

**Total de tasks:** 10
**Archivos modificados:** 10
**Archivos creados:** 3 (SocialLinkCard, NavigationDots, motion-tokens)

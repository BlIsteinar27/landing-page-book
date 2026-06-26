# Actualización de Paleta de Colores e Identidad Visual — Plan de Implementación

> **Para trabajadores agénticos:** REQUIRED SUB-SKILL: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para tracking.

**Goal:** Actualizar el sistema de diseño de la landing page de colores genéricos terracota/negro a la identidad gráfica oficial de Victoria Querales (púrpura/dorado/crema).

**Architecture:** Modificar las CSS custom properties en `globals.css` para reflejar la nueva paleta, actualizar la fuente display a Starlight Rune (o alternativa similar), y verificar que todos los componentes existentes se adapten correctamente al nuevo tema.

**Tech Stack:** Next.js, Tailwind CSS 4.0 (@theme), Google Fonts / font-face local

---

## Estructura de Archivos

| Acción   | Archivo                              | Responsabilidad                           |
|----------|--------------------------------------|-------------------------------------------|
| Modificar | `src/app/globals.css`               | Variables de color y tipografía           |
| Modificar | `src/app/layout.tsx`                | Importar fuentes                          |
| Crear    | `public/fonts/` (si fuente local)    | Archivos de fuente Starlight Rune         |
| Verificar | `src/components/*.tsx`              | Que los componentes usen las variables    |

---

## Fase 1: Preparación de Fuentes

### Task 1.1: Investigar disponibilidad de Starlight Rune

**Files:**
- Verificar: `public/landing-book-victoria/Manual de Marca - VQ.pdf`

- [ ] **Step 1: Verificar si Starlight Rune está en Google Fonts**

Buscar en https://fonts.google.com/?query=starlight+rune

Si no está disponible:
- Opción A: Usar fuente similar (Cinzel, Cormorant Garamond, Playfair Display)
- Opción B: Solicitar archivo de fuente a Victoria

- [ ] **Step 2: Decisión de fuente**

Documentar qué fuente se usará:
- Si Starlight Rune disponible → usar esa
- Si no disponible → usar **Cinzel Decorative** (similar estética mística/elegante)

---

### Task 1.2: Configurar fuente display

**Files:**
- Modificar: `src/app/layout.tsx`

- [ ] **Step 1: Importar la fuente elegida**

Si usamos Google Fonts (ejemplo con Cinzel Decorative como alternativa):

```tsx
import { Inter, Playfair_Display, Cinzel_Decorative } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
});

const cinzel = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-display',
});
```

- [ ] **Step 2: Aplicar variables de fuente al body**

```tsx
<body className={`${inter.variable} ${playfair.variable} ${cinzel.variable}`}>
```

- [ ] **Step 3: Verificar que la fuente carga**

Run: `npm run dev`
Verificar en DevTools → Network → Fonts que las fuentes cargan correctamente.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configurar fuentes display para identidad Victoria"
```

---

## Fase 2: Actualización de Paleta de Colores

### Task 2.1: Actualizar variables de superficie (fondos)

**Files:**
- Modificar: `src/app/globals.css:3-10`

- [ ] **Step 1: Cambiar colores de superficie de negro a púrpura oscuro**

Reemplazar:
```css
@theme {
  /* Superficies — Dark Premium */
  --color-surface-base: #080808;
  --color-surface-1: #0f0f0f;
  --color-surface-2: #161616;
  --color-surface-3: #1e1e1e;
  --color-surface-4: #252525;
```

Por:
```css
@theme {
  /* Superficies — Victoria Querales Brand (Púrpura oscuro) */
  --color-surface-base: #1a0d2e;
  --color-surface-1: #241438;
  --color-surface-2: #2e1b42;
  --color-surface-3: #38224c;
  --color-surface-4: #422956;
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`
Abrir http://localhost:3000 y verificar que el fondo ahora es púrpura oscuro.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar superficies a púrpura oscuro VQ"
```

---

### Task 2.2: Actualizar colores de acento

**Files:**
- Modificar: `src/app/globals.css:22-25`

- [ ] **Step 1: Cambiar acento de terracota a dorado VQ**

Reemplazar:
```css
  /* Acento único — Terracota cálida */
  --color-accent: #c97a50;
  --color-accent-dim: rgba(201, 122, 80, 0.15);
  --color-accent-glow: rgba(201, 122, 80, 0.25);
```

Por:
```css
  /* Acento primario — Dorado VQ */
  --color-accent: #ffc667;
  --color-accent-dim: rgba(255, 198, 103, 0.15);
  --color-accent-glow: rgba(255, 198, 103, 0.25);
  
  /* Acento secundario — Naranja VQ */
  --color-accent-secondary: #fa8c34;
  
  /* Púrpura medio — Para hovers y elementos secundarios */
  --color-purple-medium: #724aa5;
```

- [ ] **Step 2: Verificar que los CTAs y acentos usan el nuevo dorado**

Inspeccionar botones, badges y elementos de acento en la página.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar acentos a dorado/naranja VQ"
```

---

### Task 2.3: Actualizar colores de texto

**Files:**
- Modificar: `src/app/globals.css:16-20`

- [ ] **Step 1: Ajustar colores de texto para mejor contraste sobre púrpura**

Reemplazar:
```css
  /* Texto */
  --color-ink-primary: #f5f0e8;
  --color-ink-secondary: rgba(245, 240, 232, 0.65);
  --color-ink-tertiary: rgba(245, 240, 232, 0.38);
  --color-ink-muted: rgba(245, 240, 232, 0.22);
```

Por:
```css
  /* Texto — Crema VQ */
  --color-ink-primary: #fef4e6;
  --color-ink-secondary: rgba(254, 244, 230, 0.72);
  --color-ink-tertiary: rgba(254, 244, 230, 0.45);
  --color-ink-muted: rgba(254, 244, 230, 0.25);
```

- [ ] **Step 2: Verificar legibilidad del texto**

Revisar que todos los textos tienen buen contraste sobre los fondos púrpura.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar colores de texto a crema VQ"
```

---

### Task 2.4: Actualizar colores de borde

**Files:**
- Modificar: `src/app/globals.css:11-14`

- [ ] **Step 1: Ajustar bordes para armonizar con púrpura**

Reemplazar:
```css
  /* Bordes */
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.10);
  --color-border-emphasis: rgba(255, 255, 255, 0.18);
```

Por:
```css
  /* Bordes — Con tinte dorado sutil */
  --color-border-subtle: rgba(255, 198, 103, 0.08);
  --color-border-default: rgba(255, 198, 103, 0.15);
  --color-border-emphasis: rgba(255, 198, 103, 0.25);
```

- [ ] **Step 2: Verificar bordes en cards y elementos**

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar bordes con tinte dorado VQ"
```

---

### Task 2.5: Actualizar variable de tipografía display

**Files:**
- Modificar: `src/app/globals.css:30-33`

- [ ] **Step 1: Cambiar fuente display**

Reemplazar:
```css
  /* Tipografía */
  --font-display: "Syne", system-ui, sans-serif;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
```

Por:
```css
  /* Tipografía — Victoria Querales Brand */
  --font-display: "Cinzel Decorative", "Playfair Display", Georgia, serif;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
```

(Nota: Cambiar "Cinzel Decorative" por "Starlight Rune" si la fuente está disponible)

- [ ] **Step 2: Verificar que los títulos usan la nueva fuente**

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar fuente display a estilo VQ"
```

---

## Fase 3: Verificación y Ajustes

### Task 3.1: Revisar componente HeroSection

**Files:**
- Verificar: `src/components/HeroSection.tsx`

- [ ] **Step 1: Verificar que usa variables CSS**

Buscar hardcoded colors como `#7a4028`, `#1a0e0a`, `#2d1509`, `rgba(201,122,80,...)`.

- [ ] **Step 2: Reemplazar colores hardcodeados si los hay**

Ejemplo de reemplazo en el lomo del libro (línea ~156):
```tsx
// Antes
background: 'linear-gradient(to right, #7a4028, var(--accent))',

// Después
background: 'linear-gradient(to right, var(--color-purple-medium), var(--accent))',
```

- [ ] **Step 3: Verificar visualmente el Hero**

- [ ] **Step 4: Commit si hubo cambios**

```bash
git add src/components/HeroSection.tsx
git commit -m "fix: actualizar colores hardcoded en HeroSection"
```

---

### Task 3.2: Revisar otros componentes

**Files:**
- Verificar: `src/components/CTAButton.tsx`
- Verificar: `src/components/Footer.tsx`
- Verificar: `src/components/SinopsisSection.tsx`
- Verificar: `src/components/SobreAutoraSection.tsx`
- Verificar: `src/components/StickyCTA.tsx`
- Verificar: `src/components/TestimoniosSection.tsx`

- [ ] **Step 1: Buscar colores hardcodeados en todos los componentes**

Run (PowerShell):
```powershell
Select-String -Path "src/components/*.tsx" -Pattern "#[0-9a-fA-F]{6}" | Select-Object -First 20
```

- [ ] **Step 2: Reemplazar cualquier color hardcodeado por variables CSS**

- [ ] **Step 3: Verificar visualmente cada sección**

- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "fix: reemplazar colores hardcoded por variables CSS en componentes"
```

---

### Task 3.3: Test visual completo

- [ ] **Step 1: Navegar por toda la página**

Run: `npm run dev`

Verificar:
- [ ] Hero se ve con fondo púrpura y acentos dorados
- [ ] Botones CTA son dorados
- [ ] Texto es legible (crema sobre púrpura)
- [ ] Bordes tienen tinte dorado sutil
- [ ] La tipografía display se ve elegante/mística

- [ ] **Step 2: Verificar en móvil**

Abrir DevTools → Toggle device toolbar → Verificar en 375px y 768px

- [ ] **Step 3: Commit final**

```bash
git add .
git commit -m "feat: implementación completa identidad visual Victoria Querales"
```

---

## Resumen de Cambios

### globals.css — Estado Final

```css
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
}
```

---

## Tiempo Estimado

| Fase | Tiempo |
|------|--------|
| Fase 1: Fuentes | 15-20 min |
| Fase 2: Colores | 20-25 min |
| Fase 3: Verificación | 15-20 min |
| **Total** | **50-65 min** |

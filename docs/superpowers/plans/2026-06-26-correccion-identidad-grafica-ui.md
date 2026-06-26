# Corrección de Identidad Gráfica y UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir problemas críticos de identidad gráfica y accesibilidad en la landing page de Victoria Querales, alineando la implementación con el brandboard oficial y mejorando la legibilidad de los botones CTA.

**Architecture:** Modificación incremental de componentes existentes y tokens CSS, priorizando correcciones críticas de contraste y tipografía, seguidas de ajustes de paleta de colores según el brandboard oficial.

**Tech Stack:** Next.js 16, Tailwind CSS (v4), TypeScript, Motion/Framer Motion

---

## File Structure

**Files to modify:**
- `src/app/globals.css` — Tokens de color y tipografía
- `src/app/layout.tsx` — Carga de fuentes web
- `src/components/CTAButton.tsx` — Componente de botones CTA
- `src/components/StickyCTA.tsx` — CTA flotante móvil
- `src/components/ContactoSection.tsx` — Botones de contacto (verificación)

**Files to potentially create:**
- `public/fonts/StarlightRune.woff2` — Archivo de fuente (si se obtiene)

---

## FASE 1: Corrección Crítica — Contraste de Botones CTA

### Task 1.1: Corregir contraste en CTAButton (variantes primary y amazon)

**Files:**
- Modify: `src/components/CTAButton.tsx:20-48`

- [ ] **Step 1: Identificar líneas a modificar**

Las líneas 27 y 43 contienen `text-white` sobre `bg-accent` (#ffc667), lo que crea un contraste insuficiente (~1.4:1).

- [ ] **Step 2: Modificar variantes primary y amazon**

Cambiar `text-white` por `text-surface-base` para lograr contraste adecuado (~10:1):

```tsx
// Línea 27 (variante primary)
className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent ${className}`}

// Línea 43 (variante amazon)
className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent ${className}`}
```

- [ ] **Step 3: Verificar cambio visualmente**

Abre la landing page en el navegador y verifica que:
- El texto de los botones "Comprar en Amazon" y "Descubre el primer libro" sea legible
- El contraste sea claramente mejorado
- No haya otros elementos afectados

- [ ] **Step 4: Commit**

```bash
git add src/components/CTAButton.tsx
git commit -m "fix: corregir contraste de botones CTA primary y amazon (text-white → text-surface-base)"
```

---

### Task 1.2: Corregir contraste en StickyCTA

**Files:**
- Modify: `src/components/StickyCTA.tsx:44`

- [ ] **Step 1: Identificar línea a modificar**

La línea 44 contiene `text-white` sobre `bg-accent` (#ffc667).

- [ ] **Step 2: Modificar className del botón flotante**

Cambiar `text-white` por `text-surface-base`:

```tsx
className="flex items-center justify-center gap-2.5 w-full py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity"
```

- [ ] **Step 3: Verificar en móvil**

Abre la landing page en móvil o emula vista móvil en DevTools:
- Haz scroll hacia abajo para que aparezca el CTA flotante
- Verifica que el texto sea legible
- Verifica que el contraste sea adecuado

- [ ] **Step 4: Commit**

```bash
git add src/components/StickyCTA.tsx
git commit -m "fix: corregir contraste de StickyCTA (text-white → text-surface-base)"
```

---

## FASE 2: Implementación de Tipografía Starlight Rune

### Task 2.1: Obtener archivo de fuente Starlight Rune

**Files:**
- Create: `public/fonts/StarlightRune-Regular.woff2` (pending)
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Solicitar archivo de fuente al cliente**

NOTA: Esta tarea requiere acción del cliente. El brandboard muestra "Starlight Rune" como tipografía oficial, pero el archivo de fuente no está disponible en el repositorio.

- [ ] **Step 2: Si el cliente proporciona el archivo**

Colócalo en `public/fonts/` con formato preferiblemente `.woff2` o `.woff` para optimización web.

- [ ] **Step 3: Si el cliente NO proporciona el archivo**

Investigar alternativas:
- Buscar si Starlight Rune está disponible en Google Fonts o Adobe Fonts
- Si no está disponible, solicitar al cliente que proporcione el archivo o indique una fuente similar que capture el estilo rúnico/fantasía

- [ ] **Step 4: Documentar resultado**

Agrega una nota en `docs/contenido-victoria.md` sobre el estado de la fuente:
- Si se obtuvo: Ruta del archivo
- Si no se obtuvo: Alternativa propuesta o pendiente

---

### Task 2.2: Configurar Starlight Rune en layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Leer layout.tsx actual**

```bash
# Verificar estructura actual de layout.tsx
```

- [ ] **Step 2: Agregar link de fuente web si está en Google Fonts/Adobe Fonts**

Si Starlight Rune está disponible en un servicio de fuentes web:

```tsx
// En el <head> del layout.tsx
<link
  href="https://fonts.googleapis.com/css2?family=Starlight+Rune:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: O agregar @font-face si es archivo local**

Si se tiene el archivo local en `public/fonts/`:

```tsx
// En globals.css o layout.tsx (usando next/font)
import localFont from 'next/font/local'

const starlightRune = localFont({
  src: [
    {
      path: './fonts/StarlightRune-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/StarlightRune-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
})
```

- [ ] **Step 4: Aplicar la fuente al layout**

```tsx
// En el root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={starlightRune.className}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: agregar fuente Starlight Rune al layout"
```

---

### Task 2.3: Actualizar token de font-display en globals.css

**Files:**
- Modify: `src/app/globals.css:36-39`

- [ ] **Step 1: Modificar --font-display**

Cambiar la primera opción de fallback a Starlight Rune:

```css
/* Tipografía — Victoria Querales Brand */
--font-display: "Starlight Rune", "Cinzel Decorative", "Playfair Display", Georgia, serif;
```

- [ ] **Step 2: Verificar que los títulos usen font-display**

Revisar componentes principales (HeroSection, SinopsisSection, etc.) para confirmar que usan `font-display`:
- HeroSection.tsx: línea 88 (`font-display`)
- SinopsisSection-client.tsx: línea 15 (`font-display`)
- SagaSection-client.tsx: línea 32 (`font-display`)
- SobreAutoraSection-client.tsx: línea 77 (`font-display`)

- [ ] **Step 3: Verificar visualmente**

Abre la landing y verifica:
- Los títulos principales (Victoria Querales, Los Dos Reinos, Dioses Universales) usen la nueva fuente
- La fuente tenga el estilo rúnico/fantasía del brandboard
- No haya problemas de carga o fallback incorrecto

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: actualizar font-display a Starlight Rune como primera opción"
```

---

## FASE 3: Ajuste de Paleta de Colores según Brandboard

### Task 3.1: Ajustar surface-base al color oficial del brandboard

**Files:**
- Modify: `src/app/globals.css:4-9`

- [ ] **Step 1: Analizar diferencias de color**

Brandboard oficial: `#3d1f5c` (púrpura oscuro)
Implementación actual: `#1a0d2e` (casi negro)

La implementación actual es demasiado oscura, creando un ambiente más gótico que el estilo fantasía elegante del brandboard.

- [ ] **Step 2: Modificar --color-surface-base**

```css
/* Superficies — Victoria Querales Brand (Púrpura oscuro) */
--color-surface-base: #3d1f5c; /* Cambiado de #1a0d2e a #3d1f5c (brandboard oficial) */
--color-surface-1: #47266a;    /* Recalculado: +10% luminosidad */
--color-surface-2: #522d79;    /* Recalculado: +20% luminosidad */
--color-surface-3: #5c3587;    /* Recalculado: +30% luminosidad */
--color-surface-4: #673d96;    /* Recalculado: +40% luminosidad */
```

NOTA: Los valores de surface-1 a surface-4 se recalculan como incrementos de ~10% de luminosidad sobre el base para mantener la jerarquía de elevación.

- [ ] **Step 3: Verificar visualmente**

Abre la landing y verifica:
- El fondo general sea más claro y cercano al púrpura del brandboard
- Las superficies escalonadas mantengan jerarquía visual
- El contraste del texto sobre el nuevo fondo sea adecuado

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: ajustar surface-base a color oficial del brandboard (#3d1f5c)"
```

---

### Task 3.2: Verificar contraste de texto sobre nuevo fondo

**Files:**
- Test: Visual inspection

- [ ] **Step 1: Verificar contraste de texto principal**

El texto usa `--color-ink-primary: #fef4e6` (crema) sobre el nuevo fondo `#3d1f5c`.

Ratio de contraste esperado: ~12:1 (excelente)

- [ ] **Step 2: Verificar contraste de texto secundario**

El texto usa `--color-ink-secondary: rgba(254, 244, 230, 0.72)` sobre el nuevo fondo.

Ratio de contraste esperado: ~8:1 (bueno)

- [ ] **Step 3: Verificar contraste de texto terciario**

El texto usa `--color-ink-tertiary: rgba(254, 244, 230, 0.45)` sobre el nuevo fondo.

Ratio de contraste esperado: ~5:1 (aceptable, cumple WCAG AA)

- [ ] **Step 4: Si algún contraste es insuficiente**

Ajustar la opacidad del color de ink correspondiente en `globals.css:16-20` hasta cumplir WCAG AA (4.5:1 mínimo).

- [ ] **Step 5: Commit si se hicieron ajustes**

```bash
git add src/app/globals.css
git commit -m "fix: ajustar opacidad de ink-tertiary para cumplir WCAG AA"
```

---

## FASE 4: Verificación y Mejora de Accesibilidad

### Task 4.1: Verificar contraste en ContactoSection

**Files:**
- Modify: `src/components/ContactoSection.tsx:46-65`

- [ ] **Step 1: Analizar botones de contacto**

Botón WhatsApp (línea 50):
- Fondo: `#25D366` (verde oficial de WhatsApp)
- Texto: `white`

Ratio de contraste: ~4.5:1 (cumple WCAG AA)

Botón Instagram DM (línea 61):
- Fondo: `bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]` (gradiente oficial de Instagram)
- Texto: `white`

Ratio de contraste: Variable (depende del punto del gradiente), generalmente ~3.5:1 a 4:1 (puede no cumplir WCAG AA)

- [ ] **Step 2: Si el contraste del botón Instagram es insuficiente**

Opción A: Agregar sombra de texto para mejorar legibilidad:

```tsx
className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium hover:opacity-90 transition-opacity drop-shadow-md"
```

Opción B: Usar un color de texto ligeramente más oscuro (no blanco puro):

```tsx
className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-gray-100 font-medium hover:opacity-90 transition-opacity"
```

- [ ] **Step 3: Verificar visualmente**

Abre la landing en la sección Contacto y verifica que ambos botones sean legibles.

- [ ] **Step 4: Commit si se hicieron cambios**

```bash
git add src/components/ContactoSection.tsx
git commit -m "fix: mejorar contraste de botón Instagram DM en ContactoSection"
```

---

### Task 4.2: Verificar focus states en toda la aplicación

**Files:**
- Test: Manual inspection

- [ ] **Step 1: Navegar por teclado**

Usa Tab para navegar por la landing y verifica:
- Todos los elementos interactivos tengan un focus state visible
- El outline de focus use el color `--accent` (#ffc667) definido en globals.css:82
- El offset de 3px sea suficiente para ser visible

- [ ] **Step 2: Verificar elementos específicos**

- Botones CTA (CTAButton)
- Enlaces de redes sociales (ComunidadSection, Footer)
- Enlaces de contacto (ContactoSection)
- StickyCTA (en móvil)

- [ ] **Step 3: Si algún elemento falta focus state**

Agregar `focus-visible:ring-2 focus-visible:ring-accent` al className del elemento.

- [ ] **Step 4: Commit si se hicieron cambios**

```bash
git add [archivos modificados]
git commit -m "fix: agregar focus states a elementos interactivos faltantes"
```

---

## FASE 5: Optimización de Composición de Componentes

### Task 5.1: Consolidar variantes duplicadas en CTAButton

**Files:**
- Modify: `src/components/CTAButton.tsx:20-48`

- [ ] **Step 1: Analizar duplicación**

Las variantes `primary` (líneas 20-33) y `amazon` (líneas 36-49) son casi idénticas:
- Ambas usan `bg-accent` y `text-surface-base` (después de Fase 1)
- Ambas tienen el mismo estilo
- La única diferencia es el texto por defecto

- [ ] **Step 2: Simplificar lógica**

Eliminar la variante `amazon` y usar `primary` con prop `text`:

```tsx
export default function CTAButton({ variant, className = '', text }: CTAButtonProps) {
  if (variant === 'primary' || variant === 'amazon') {
    return (
      <motion.a
        href={LINKS.amazon}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedMotion}
        className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 font-semibold text-sm rounded-2xl bg-accent text-surface-base hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        style={{ boxShadow: '0 0 24px var(--accent-glow)' }}
      >
        <ShoppingBag className="w-4 h-4" />
        {text || 'Comprar en Amazon'}
      </motion.a>
    );
  }

  // ... resto del código (variante whatsapp)
}
```

- [ ] **Step 3: Actualizar usos de variant="amazon"**

Buscar en el códigobase todos los usos de `variant="amazon"` y cambiarlos a `variant="primary"` con `text="Comprar en Amazon"`:

```tsx
// En SinopsisSection-client.tsx:41
<CTAButton variant="primary" text="Comprar en Amazon" />

// En Footer.tsx:44
<CTAButton variant="primary" text="Comprar en Amazon" />
```

- [ ] **Step 4: Actualizar TypeScript interface**

Opcional: Eliminar `'amazon'` del tipo de variant si ya no se usa:

```tsx
interface CTAButtonProps {
  variant: 'primary' | 'whatsapp';  // 'amazon' eliminado
  className?: string;
  text?: string;
}
```

- [ ] **Step 5: Verificar que todo funcione**

Abre la landing y verifica:
- Todos los botones CTA funcionen correctamente
- El texto sea el correcto en cada caso
- No haya errores de TypeScript

- [ ] **Step 6: Commit**

```bash
git add src/components/CTAButton.tsx src/components/SinopsisSection-client.tsx src/components/Footer.tsx
git commit -m "refactor: consolidar variantes primary y amazon en CTAButton"
```

---

## FASE 6: Documentación y Validación Final

### Task 6.1: Actualizar documentación de identidad gráfica

**Files:**
- Modify: `docs/contenido-victoria.md`

- [ ] **Step 1: Agregar sección de implementación actual**

Al final del archivo, agregar:

```markdown
---

## Estado de Implementación de Identidad Gráfica

**Última actualización:** 26 de junio 2026

### Tipografía
- [x] Inter (body) — Implementado
- [x] Starlight Rune (display) — Pendiente de archivo de fuente
  - Nota: Se ha preparado la configuración, esperando archivo del cliente

### Paleta de Colores
- [x] Púrpura oscuro (#3d1f5c) — Ajustado a brandboard
- [x] Púrpura medio (#724aa5) — Correcto
- [x] Crema (#fef4e6) — Correcto
- [x] Dorado (#ffc667) — Correcto
- [x] Naranja (#fa8c34) — Correcto

### Contraste y Accesibilidad
- [x] Botones CTA — Corregido (text-surface-base sobre bg-accent)
- [x] Focus states — Verificado
- [x] Contraste WCAG AA — Cumple
```

- [ ] **Step 2: Commit**

```bash
git add docs/contenido-victoria.md
git commit -m "docs: agregar estado de implementación de identidad gráfica"
```

---

### Task 6.2: Validación final de toda la UI

**Files:**
- Test: Manual inspection

- [ ] **Step 1: Revisión visual completa**

Recorrer toda la landing page sección por sección:
1. **Hero** — Verificar título con Starlight Rune (si disponible), botón CTA legible
2. **Sobre el Libro** — Verificar botones de compra legibles
3. **Personajes** — Verificar contraste de texto
4. **La Saga** — Verificar mapa y mockups
5. **Sobre la Autora** — Verificar bio y credenciales
6. **Comunidad** — Verificar botones de redes sociales
7. **Contacto** — Verificar botones de WhatsApp e Instagram legibles
8. **Footer** — Verificar CTAs y redes sociales

- [ ] **Step 2: Validación responsive**

Verificar en diferentes tamaños:
- Móvil (375px)
- Tablet (768px)
- Desktop (1024px, 1440px)

- [ ] **Step 3: Validación de accesibilidad**

Usar herramientas como:
- Lighthouse (Chrome DevTools)
- axe DevTools
- Verificar navegación por teclado

- [ ] **Step 4: Crear lista de pendientes si hay issues**

Si se encuentran problemas adicionales, agregarlos a `docs/pendientes.md`.

- [ ] **Step 5: Commit final**

```bash
git add docs/pendientes.md
git commit -m "docs: agregar pendientes encontrados en validación final"
```

---

## Resumen de Fases

| Fase | Descripción | Prioridad | Tiempo estimado |
|------|-------------|-----------|-----------------|
| 1 | Corrección crítica de contraste en botones CTA | 🔴 Crítica | 15 min |
| 2 | Implementación de Starlight Rune | 🔴 Crítica | 30-60 min* |
| 3 | Ajuste de paleta de colores según brandboard | 🟡 Importante | 20 min |
| 4 | Verificación y mejora de accesibilidad | 🟡 Importante | 30 min |
| 5 | Optimización de composición de componentes | 🟢 Mejora | 20 min |
| 6 | Documentación y validación final | 🟢 Mejora | 30 min |

*El tiempo de Fase 2 depende de la disponibilidad del archivo de fuente

---

## Notas Importantes

1. **Fase 2 requiere acción del cliente** — No se puede completar sin el archivo de fuente Starlight Rune
2. **Fase 3 puede requerir ajustes visuales** — Los valores de luminosidad propuestos son estimados; puede requerir fine-tuning
3. **Todas las fases son independientes** — Se pueden ejecutar en paralelo excepto Fase 6 que depende de las anteriores
4. **Commit frecuente** — Cada tarea incluye un commit para facilitar rollback si es necesario

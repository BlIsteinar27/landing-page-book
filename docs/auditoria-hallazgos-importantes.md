# Auditoría: Hallazgos Importantes

> Este documento lista los hallazgos que no son bloqueantes para producción, pero que mejorarían la arquitectura, el rendimiento o la mantenibilidad del proyecto. Cada problema incluye **dos o tres soluciones posibles** con su repercusión.
>
> **Objetivo:** darte opciones claras para decidir si abordas cada uno ahora o más adelante.

---

## 1. Alto grado de duplicación entre los overlays

**Archivos involucrados:**
- `@src/components/GalaxyOverlay.tsx`
- `@src/components/ImageOverlay.tsx`
- `@src/components/DualOverlay.tsx`

**Problema:** Los tres overlays comparten casi la misma lógica: fondo oscuro, botón de cerrar, botones de zoom, `useLockBodyScroll`, `useTouchGestures`, animaciones de entrada/salida y estados de `scale`/`position`. Esto dificulta corregir bugs o agregar funciones comunes.

### Opción A: Crear un componente base `ZoomableOverlay`
- **Repercusiones:** centraliza zoom, pan, cerrar y bloqueo de scroll. `GalaxyOverlay`, `ImageOverlay` y `DualOverlay` se convierten en wrappers con contenido específico.
- **Riesgo:** `DualOverlay` tiene layout particular (dos imágenes). Puede requerir que el base sea lo suficientemente flexible.

### Opción B: Extraer hooks especializados (`useZoomableImage`, `useOverlayLock`)
- **Repercusiones:** comparte la lógica sin forzar una estructura visual común. `DualOverlay` conserva su layout propio.
- **Riesgo:** aún queda duplicación de JSX para botones y fondo.

### Opción C: Mantenerlos separados pero compartir utilidades (`src/lib/overlay.ts`)
- **Repercusiones:** menor refactor, comparte funciones puras como clamp de zoom o cálculo de posición.
- **Riesgo:** la estructura visual sigue duplicada.

**Recomendación provisional:** Opción A. El ahorro de código y consistencia compensan el esfuerzo.

---

## 2. `useTouchGestures` registra dos listeners sobre `touchmove`

**Archivo involucrado:**
- `@src/hooks/useTouchGestures.ts:136-139`

```ts
element.addEventListener('touchmove', handleTouchMove, { passive: !enablePan });
element.addEventListener('touchmove', handlePinch, { passive: !enablePan });
```

**Problema:** En cada movimiento táctil se ejecutan dos handlers. Si `enablePan` es true y el usuario pellizca, `handleTouchMove` puede llamar `preventDefault()` antes de que `handlePinch` calcule el zoom, generando comportamiento inconsistente.

### Opción A: Unificar en un solo handler que decida si es pan o pinch según `touches.length`
- **Repercusiones:** un solo punto de control, sin conflictos entre listeners. Más predecible.
- **Riesgo:** requiere reescribir parte de la lógica del hook.

### Opción B: Mantener dos handlers pero usar `stopImmediatePropagation` o banderas de estado internas
- **Repercusiones:** mantiene la estructura actual, pero evita que ambos actúen al mismo tiempo.
- **Riesgo:** es una solución de contención más que una corrección limpia.

### Opción C: Reemplazar el hook por `use-gesture` o similar si la librería es aceptable
- **Repercusiones:** librería probada para pinch, pan, wheel y hover. Menos código propio.
- **Riesgo:** añade dependencia externa; hay que evaluar si el bundle y la API valen la pena.

**Recomendación provisional:** Opción A. Es la corrección más limpia y mantiene el hook bajo control.

---

## 3. `HeroSection` es un componente client muy grande y con scroll manual

**Archivos involucrados:**
- `@src/components/HeroSection.tsx:150-172` (scroll manual)
- `@src/components/HeroSection.tsx` (244 líneas en total)

**Problema:** El hero mezcla animaciones, copy, estructura visual y una navegación por scroll manual a `#mapa-interactivo`. Esto fuerza a todo el hero a ser cliente por un solo evento de click.

### Opción A: Dividir `HeroSection` en subcomponentes
- **Repercusiones:** `HeroTitle`, `HeroBookMockup`, `HeroCTAs`. Mejora legibilidad y testabilidad.
- **Riesgo:** requiere pasar props o contexto entre subcomponentes.

### Opción B: Reemplazar el botón de scroll por un `<a href="#mapa-interactivo">` nativo
- **Repercusiones:** elimina la necesidad de `use client` en esa parte, mejora accesibilidad, SEO y permite click derecho/abrir en pestaña. La sección puede volverse más server-friendly.
- **Riesgo:** pierdes la animación custom de scroll si es muy específica, aunque CSS `scroll-behavior: smooth` la reemplaza.

### Opción C: Extraer la navegación de scroll a un utilitario compartido (`src/lib/scroll.ts`)
- **Repercusiones:** reutilizable para otros botones de ancla. Mantiene el efecto actual.
- **Riesgo:** sigue siendo cliente y no mejora la separación conceptual del hero.

**Recomendación provisional:** Opción B + Opción A. La ancla nativa resuelve el problema de arquitectura; la división en subcomponentes mejora mantenibilidad.

---

## 4. `StickyCTA` detecta visibilidad con `querySelectorAll`

**Archivo involucrado:**
- `@src/components/StickyCTA.tsx:11-29`

**Problema:** Usa `document.querySelectorAll('[data-cta-block]')` para saber si debe mostrarse. Es un patrón frágil: si alguien cambia el atributo `data-cta-block` o la estructura de secciones, la barra desaparece o aparece de forma incorrecta.

### Opción A: Crear un contexto `CTAVisibilityContext`
- **Repercusiones:** cada sección con CTA reporta al contexto si está visible. `StickyCTA` consume ese estado. Es robusto y explícito.
- **Riesgo:** añade un provider en `layout.tsx` y requiere envolver secciones con hooks que reporten visibilidad.

### Opción B: Usar `IntersectionObserver` directamente sobre los CTA existentes con refs compartidas
- **Repercusiones:** más directo que querySelector, pero sigue acoplado al DOM.
- **Riesgo:** si los CTA se mueven de sección, hay que actualizar el observer.

### Opción C: Simplificar: mostrar `StickyCTA` siempre después del hero
- **Repercusiones:** elimina toda la lógica de observación. Código más simple.
- **Riesgo:** la barra aparece incluso cuando otros CTA están visibles, lo que puede ser redundante o molesto.

**Recomendación provisional:** Opción A. Es el patrón más escalable y claro.

---

## 5. `Hotspot` tiene estados internos sin uso claro

**Archivo involucrado:**
- `@src/components/Hotspot.tsx:15-17`

**Problema:** `isPressed` no se usa. `isSelected` solo cambia el color del punto momentáneamente. `isHovered` activa el tooltip, pero el tooltip puede salirse de la pantalla si el hotspot está cerca de un borde.

### Opción A: Limpiar estados no usados y simplificar el componente
- **Repercusiones:** código más corto y fácil de entender. Menos renders.
- **Riesgo:** si alguno de esos estados se pensó para una feature futura, se pierde la base.

### Opción B: Usar `isSelected` para mostrar un hotspot activo persistente
- **Repercusiones:** mejora la orientación del usuario cuando abre un overlay.
- **Riesgo:** requiere que el padre (`InteractiveMapSection-client`) pase el hotspot seleccionado.

### Opción C: Mejorar el posicionamiento del tooltip con detección de bordes
- **Repercusiones:** evita que el tooltip se corte en móviles o pantallas pequeñas.
- **Riesgo:** añade lógica de posicionamiento (puede ser un pequeño hook o cálculo inline).

**Recomendación provisional:** Opción A + Opción C. Limpieza primero, luego robustecer el tooltip.

---

## 6. Metadata centralizada solo parcialmente

**Archivo involucrado:**
- `@src/app/layout.tsx:35-98`

**Problema:** Las constantes de SEO, título, descripción y URLs están en el archivo de layout. `SchemaMarkup.tsx` ya consume `SITE_URL` y `SOCIAL_LINKS` desde `src/config/links.ts`, pero la metadata en sí no está centralizada.

### Opción A: Crear `@src/config/site.ts` con toda la metadata
- **Repercusiones:** un solo lugar para título, descripción, keywords, OpenGraph, Twitter y datos del autor. Facilita cambios globales.
- **Riesgo:** hay que actualizar imports en `layout.tsx` y `SchemaMarkup.tsx`.

### Opción B: Mantener la metadata en `layout.tsx` pero extraer solo las URLs a `links.ts`
- **Repercusiones:** menor cambio, pero no unifica todo.
- **Riesgo:** la metadata sigue dispersa.

### Opción C: Usar `metadata` en `page.tsx` además de `layout.tsx` para metadatos específicos de la home
- **Repercusiones:** aprovecha el sistema de metadata de Next.js 16 por ruta.
- **Riesgo:** sin una `site.ts` central, sigue habiendo duplicación entre layout y page.

**Recomendación provisional:** Opción A. Es la base para escalar metadata y schema markup.

---

## 7. Faltan archivos recomendados de Next.js 16

**Archivos ausentes:**
- `app/sitemap.ts`
- `app/robots.ts`
- `app/manifest.ts`

**Problema:** Solo existe `public/robots.txt`. Next.js 16 permite generar `sitemap` y `robots` dinámicamente desde el App Router, lo que mejora SEO y mantiene la configuración cerca del código.

### Opción A: Crear `app/sitemap.ts` y `app/robots.ts`
- **Repercusiones:** sitemap dinámico basado en `SITE_URL`, robots reutilizando `links.ts`. Mejor integración con Next.js.
- **Riesgo:** hay que eliminar o mantener `public/robots.txt` para no duplicar.

### Opción B: Mantener solo `public/robots.txt` y agregar `public/sitemap.xml` manual
- **Repercusiones:** funciona, pero requiere editar archivos XML a mano.
- **Riesgo:** fácil de olvidar actualizar cuando cambie la URL del sitio.

### Opción C: Agregar además `app/manifest.ts` para PWA
- **Repercusiones:** permite "Add to Home Screen" y mejora la experiencia móvil.
- **Riesgo:** si no se necesita PWA, es un archivo extra.

**Recomendación provisional:** Opción A. Opcionalmente Opción C si hay interés en PWA.

---

## 8. `target: ES2017` en TypeScript

**Archivo involucrado:**
- `@tsconfig.json:3`

**Problema:** Next.js 16 con React 19 puede aprovechar características modernas de JavaScript. `ES2017` es conservador y podría generar código más verboso del necesario.

### Opción A: Subir a `ES2022`
- **Repercusiones:** código más moderno, menor polyfill, aprovecha `at()`, `Object.hasOwn`, top-level await, etc.
- **Riesgo:** si el proyecto debe soportar navegadores muy antiguos, podría romper compatibilidad (aunque Next.js transpila de todos modos).

### Opción B: Dejar `ES2017`
- **Repercusiones:** máxima compatibilidad, sin cambios.
- **Riesgo:** no aprovechas optimizaciones del target moderno.

### Opción C: Subir a `ES2020` como punto medio
- **Repercusiones:** balance entre modernidad y compatibilidad.
- **Riesgo:** mínimo; sigue siendo conservador.

**Recomendación provisional:** Opción A (`ES2022`) para un proyecto nuevo con Next.js 16.

---

## 9. No hay tipos compartidos para datos comunes

**Archivos involucrados:**
- `@src/config/realms-data.ts` (tiene `Realm` y `Hotspot`)
- `@src/components/SagaSection-client.tsx` (tiene `Libro` propio)
- `@src/components/TestimoniosSection.tsx` (tipos inline)

**Problema:** Solo los reinos tienen interfaces centralizadas. Libros, testimonios, redes y autores definen tipos en el mismo archivo donde se usan.

### Opción A: Crear `@src/types/` con `libro.ts`, `testimonio.ts`, `autor.ts`, `red-social.ts`
- **Repercusiones:** tipos reutilizables, consistentes y fáciles de importar.
- **Riesgo:** añade una carpeta más; hay que actualizar imports.

### Opción B: Mantener tipos junto a los datos en `@src/config/`
- **Repercusiones:** similar a cómo están `Realm` y `Hotspot`.
- **Riesgo:** `config` puede crecer mucho si incluye todos los tipos del proyecto.

### Opción C: Usar `zod` o similar para validar y exportar tipos desde schemas
- **Repercusiones:** validación en runtime + tipos en compile time.
- **Riesgo:** añade dependencia y puede ser excesivo para datos estáticos.

**Recomendación provisional:** Opción A. Es el patrón más común en proyectos TypeScript medianos.

---

## 10. `RealmLevel` tiene fallback de error inline

**Archivo involucrado:**
- `@src/components/RealmLevel.tsx`

**Problema:** El estado de error de carga de imagen se maneja dentro del componente con un SVG inline. Si otro componente necesita un fallback similar, se duplicará.

### Opción A: Extraer un componente `ImageErrorFallback` reutilizable
- **Repercusiones:** consistencia visual y menos código en `RealmLevel`.
- **Riesgo:** mínimo.

### Opción B: Mantener el fallback inline
- **Repercusiones:** funciona, pero no es reutilizable.
- **Riesgo:** duplicación futura.

### Opción C: Usar un estado global de error de imagen con un wrapper
- **Repercusiones:** robusto si hay muchas imágenes críticas.
- **Riesgo:** sobre-ingeniería para este proyecto.

**Recomendación provisional:** Opción A.

---

## Resumen de decisiones pendientes

| # | Problema | Decisión clave |
|---|----------|----------------|
| 1 | Overlays duplicados | ¿Crear `ZoomableOverlay` base? |
| 2 | Listeners duplicados en `touchmove` | ¿Unificar handler o usar librería? |
| 3 | `HeroSection` grande y scroll manual | ¿Dividir y usar ancla nativa? |
| 4 | `StickyCTA` con `querySelector` | ¿Crear contexto de visibilidad? |
| 5 | Estados sin uso en `Hotspot` | ¿Limpiar y mejorar tooltip? |
| 6 | Metadata dispersa | ¿Crear `src/config/site.ts`? |
| 7 | Faltan `sitemap.ts`, `robots.ts` | ¿Generar desde App Router? |
| 8 | `target: ES2017` | ¿Subir a `ES2022`? |
| 9 | Tipos no compartidos | ¿Crear `src/types/`? |
| 10 | Fallback inline en `RealmLevel` | ¿Extraer componente? |

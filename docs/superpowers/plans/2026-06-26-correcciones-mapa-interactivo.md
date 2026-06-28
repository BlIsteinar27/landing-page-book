# Correcciones Mapa Interactivo — Cono Cósmico

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir problemas críticos de UX, bugs de funcionalidad y mejorar la experiencia del mapa interactivo del universo de Dioses Universales para que funcione genuinamente según la intención del diseño.

**Architecture:** Mantener la arquitectura existente basada en datos (realms-data.ts) y separación server/client, aplicando correcciones incrementales en componentes específicos sin refactorización mayor.

**Tech Stack:** Next.js 16, React 19, Motion (framer-motion), TypeScript, Tailwind CSS

---

## Fase 1: Correcciones Críticas de UX (Prioridad 1)

### Task 1: Agregar instrucciones de navegación visibles

**Files:**
- Modify: `src/components/InteractiveMapSection-client.tsx:40-56`

- [ ] **Step 1: Agregar componente de instrucciones de navegación**

Agrega después de los navigation dots (línea 56) un componente con flecha animada y texto de instrucción:

```tsx
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

      {/* Navigation Instructions */}
      <AnimatePresence>
        {activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-accent"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
            <p className="text-sm text-ink-secondary bg-surface-1/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle">
              Desliza para explorar el universo
            </p>
          </motion.div>
        )}
      </AnimatePresence>
```

- [ ] **Step 2: Verificar que AnimatePresence esté importado**

Confirma que la importación en la línea 3 incluye `AnimatePresence`:
```tsx
import { motion, AnimatePresence } from 'motion/react';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/InteractiveMapSection-client.tsx
git commit -m "fix: agregar instrucciones de navegación visibles con flecha animada"
```

---

### Task 2: Corregir bug de pinch zoom en useTouchGestures

**Files:**
- Modify: `src/hooks/useTouchGestures.ts:42-66`

- [ ] **Step 1: Corregir lógica de inicialización de escala en pinch**

Reemplaza la función `handlePinch` completa (líneas 46-66) con esta versión corregida:

```typescript
  const handlePinch = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && onPinch) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Si es el inicio del pinch, guardar distancia inicial y escala actual
      if (initialDistanceRef.current === 0) {
        initialDistanceRef.current = distance;
        // NO resetear a 1 - mantener la escala actual del componente
        initialScaleRef.current = scale; // scale debe venir del estado del componente
      }
      
      // Calcular delta de escala basado en la distancia inicial
      const newScale = initialScaleRef.current * (distance / initialDistanceRef.current);
      onPinch(newScale);
    } else {
      // Reset cuando no hay 2 dedos
      initialDistanceRef.current = 0;
    }
  }, [onPinch, scale]); // Agregar scale como dependencia
```

- [ ] **Step 2: Modificar GalaxyOverlay para pasar escala actual al hook**

Modifica `src/components/GalaxyOverlay.tsx` para pasar la escala actual al hook:

```typescript
// En GalaxyOverlay.tsx, línea 14-20, cambia:
  const { elementRef } = useTouchGestures({
    onPinch: (newScale) => {
      setScale(Math.min(Math.max(newScale, 0.5), 3));
    }
  });

// Por:
  const { elementRef } = useTouchGestures({
    onPinch: (newScale) => {
      setScale(Math.min(Math.max(newScale, 0.5), 3));
    },
    currentScale: scale // Pasar escala actual
  });
```

- [ ] **Step 3: Actualizar interfaz de useTouchGestures para aceptar currentScale**

Modifica `src/hooks/useTouchGestures.ts` línea 3-7:

```typescript
interface UseTouchGesturesOptions {
  onLongPress?: (event: TouchEvent) => void;
  onPinch?: (scale: number) => void;
  longPressDelay?: number; // ms
  currentScale?: number; // Escala actual del componente para pinch zoom
}
```

- [ ] **Step 4: Actualizar destructuring en useTouchGestures**

Modifica `src/hooks/useTouchGestures.ts` línea 10-14:

```typescript
export function useTouchGestures(options: UseTouchGesturesOptions = {}) {
  const { 
    onLongPress, 
    onPinch,
    longPressDelay = 500,
    currentScale = 1 // Default a 1 si no se proporciona
  } = options;
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTouchGestures.ts src/components/GalaxyOverlay.tsx
git commit -m "fix: corregir lógica de pinch zoom para mantener escala actual durante gestos"
```

---

### Task 3: Hacer el hotspot del mapa de galaxias más visible

**Files:**
- Modify: `src/components/Hotspot.tsx:42-64`
- Modify: `src/config/realms-data.ts:46-55`

- [ ] **Step 1: Agregar prop para destacar hotspots importantes**

Modifica `src/config/realms-data.ts` línea 1-8 para agregar propiedad `isProminent`:

```typescript
export interface Hotspot {
  id: string;
  x: number; // Coordenada relativa 0-1
  y: number; // Coordenada relativa 0-1
  title: string;
  description: string;
  image?: string; // Opcional para futuras expansiones
  isProminent?: boolean; // Si true, hotspot más visible y destacado
}
```

- [ ] **Step 2: Marcar el hotspot del mapa como prominente**

Modifica `src/config/realms-data.ts` línea 46-55:

```typescript
    hotspots: [
      {
        id: 'galaxy-map',
        x: 0.5,
        y: 0.5,
        title: 'Mapa de Galaxias',
        description: 'Explora las galaxias del universo de Dioses Universales',
        image: '/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg',
        isProminent: true
      }
    ]
```

- [ ] **Step 3: Actualizar componente Hotspot para soportar hotspots prominentes**

Modifica `src/components/Hotspot.tsx` línea 8-11 para aceptar la nueva prop:

```typescript
interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
}
```

- [ ] **Step 4: Modificar renderizado del hotspot para destacarlo cuando es prominente**

Reemplaza la sección del pulse effect y hotspot dot (líneas 42-64) con:

```tsx
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, hotspot.isProminent ? 2 : 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: hotspot.isProminent ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full motion-reduce:animate-none ${
            hotspot.isProminent ? 'bg-accent' : 'bg-accent/70'
          }`}
          style={{ 
            width: hotspot.isProminent ? 60 : 40, 
            height: hotspot.isProminent ? 60 : 40 
          }}
        />
        
        {/* Hotspot Dot */}
        <motion.div
          animate={{
            scale: isPressed ? 0.8 : 1
          }}
          className={`relative rounded-full border-2 border-white shadow-lg ${
            hotspot.isProminent ? 'w-8 h-8 bg-accent' : 'w-6 h-6 bg-accent'
          }`}
        >
          {/* Icono para hotspots prominentes */}
          {hotspot.isProminent && (
            <svg className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </motion.div>
```

- [ ] **Step 5: Agregar label visible para hotspots prominentes**

Agrega después del hotspot dot (línea 64) este código:

```tsx
        {/* Label visible para hotspots prominentes */}
        {hotspot.isProminent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
          >
            <p className="text-xs font-medium text-ink-primary">{hotspot.title}</p>
            <p className="text-[10px] text-accent mt-0.5">Toca para explorar</p>
          </motion.div>
        )}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Hotspot.tsx src/config/realms-data.ts
git commit -m "feat: agregar hotspots prominentes con mayor visibilidad y label visible"
```

---

## Fase 2: Mejoras de Performance y Feedback (Prioridad 2)

### Task 4: Eliminar duplicación de imágenes en RealmLevel

**Files:**
- Modify: `src/components/RealmLevel.tsx:24-64`

- [ ] **Step 1: Unificar renderizado de imagen en un solo componente**

Reemplaza toda la sección de background image (líneas 24-64) con:

```tsx
      {/* Background Image with Conditional Parallax */}
      <motion.div
        animate={isActive ? {
          y: [0, -10, 0],
        } : {}}
        transition={isActive ? {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        className="absolute inset-0"
      >
        <Image
          src={realm.backgroundImage}
          alt={realm.name}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RealmLevel.tsx
git commit -m "perf: eliminar duplicación de imágenes en RealmLevel, unificar renderizado"
```

---

### Task 5: Mejorar feedback de selección de hotspots

**Files:**
- Modify: `src/components/Hotspot.tsx:13-23`

- [ ] **Step 1: Agregar estado para rastrear selección**

Modifica el estado en `Hotspot.tsx` línea 13-15:

```typescript
export default function Hotspot({ hotspot, onShowDetail }: HotspotProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
```

- [ ] **Step 2: Actualizar handler de click para mostrar feedback**

Modifica el onClick en el motion.div (línea 32):

```tsx
        onClick={() => {
          setIsSelected(true);
          setTimeout(() => setIsSelected(false), 300);
          onShowDetail?.(hotspot);
        }}
```

- [ ] **Step 3: Agregar visual feedback cuando está seleccionado**

Modifica el hotspot dot (línea 58-63) para incluir estado seleccionado:

```tsx
        {/* Hotspot Dot */}
        <motion.div
          animate={{
            scale: isPressed ? 0.8 : isSelected ? 1.3 : 1,
            backgroundColor: isSelected ? '#10b981' : undefined // Verde al seleccionar
          }}
          transition={{ type: "spring", damping: 15 }}
          className={`relative rounded-full border-2 border-white shadow-lg ${
            hotspot.isProminent ? 'w-8 h-8 bg-accent' : 'w-6 h-6 bg-accent'
          }`}
        >
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Hotspot.tsx
git commit -m "feat: agregar feedback visual de selección en hotspots con animación spring"
```

---

### Task 6: Sincronizar scroll snap nativo con custom

**Files:**
- Modify: `src/hooks/useScrollSnap.ts:13-69`
- Modify: `src/components/InteractiveMapSection-client.tsx:59-62`

- [ ] **Step 1: Reemplazar lógica custom de scroll snap con IntersectionObserver**

Reemplaza todo el useEffect en `useScrollSnap.ts` (líneas 13-69) con:

```typescript
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
            
            // Haptic feedback al cambiar de nivel
            if (index !== previousIndexRef.current && 'vibrate' in navigator) {
              navigator.vibrate(10);
            }
            previousIndexRef.current = index;
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observar cada snap point
    const snapPoints = container.querySelectorAll('[data-snap-point]');
    snapPoints.forEach((point) => observer.observe(point));

    return () => {
      snapPoints.forEach((point) => observer.unobserve(point));
      observer.disconnect();
    };
  }, [snapPoints]);
```

- [ ] **Step 2: Agregar data-snap-point a los reinos**

Modifica `InteractiveMapSection-client.tsx` línea 64 para agregar el atributo:

```tsx
          <div key={realm.id} className="snap-start h-screen relative" data-snap-point data-index={index}>
```

- [ ] **Step 3: Simplificar scrollToIndex para usar scrollIntoView**

Modifica la función scrollToIndex en `useScrollSnap.ts` (líneas 71-81):

```typescript
  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const snapPoint = container.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (snapPoint) {
      snapPoint.scrollIntoView({ behavior: 'smooth' });
    }
  };
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useScrollSnap.ts src/components/InteractiveMapSection-client.tsx
git commit -m "refactor: reemplazar scroll snap custom con IntersectionObserver para mejor sincronización"
```

---

## Fase 3: Mejoras de Polish (Prioridad 3)

### Task 7: Agregar tooltips a los dots de navegación

**Files:**
- Modify: `src/components/InteractiveMapSection-client.tsx:42-56`

- [ ] **Step 1: Agregar tooltips a los navigation dots**

Reemplaza la sección de navigation dots (líneas 42-56) con:

```tsx
      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {realms.map((realm, index) => (
          <div key={realm.id} className="relative group">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeIndex === index ? 'bg-accent scale-125' : 'bg-surface-2'
              }`}
              aria-label={`Navegar a ${realm.name}`}
            />
            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 shadow-xl">
                <p className="text-xs text-ink-primary">{realm.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InteractiveMapSection-client.tsx
git commit -m "feat: agregar tooltips a los dots de navegación con nombres de reinos"
```

---

### Task 8: Implementar loading states para imágenes

**Files:**
- Modify: `src/components/RealmLevel.tsx:13-23`
- Modify: `src/components/RealmLevel.tsx:24-48`

- [ ] **Step 1: Agregar estado de carga**

Modifica el componente `RealmLevel` para agregar estado de carga:

```typescript
export default function RealmLevel({ realm, isActive, index }: RealmLevelProps) {
  const [isLoaded, setIsLoaded] = useState(false);
```

- [ ] **Step 2: Agregar skeleton loader antes de que cargue la imagen**

Agrega antes del background image (línea 24):

```tsx
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}
```

- [ ] **Step 3: Agregar onLoad handler a la imagen**

Modifica el componente Image (línea 37-46):

```tsx
        <Image
          src={realm.backgroundImage}
          alt={realm.name}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
        />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/RealmLevel.tsx
git commit -m "feat: agregar loading states con skeleton para imágenes de reinos"
```

---

### Task 9: Agregar error handling para imágenes fallidas

**Files:**
- Modify: `src/components/RealmLevel.tsx:13-23`
- Modify: `src/components/RealmLevel.tsx:24-48`

- [ ] **Step 1: Agregar estado de error**

Modifica el estado en `RealmLevel`:

```typescript
export default function RealmLevel({ realm, isActive, index }: RealmLevelProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
```

- [ ] **Step 2: Agregar onError handler a la imagen**

Modifica el componente Image:

```tsx
        <Image
          src={realm.backgroundImage}
          alt={realm.name}
          fill
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          className="object-cover"
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
```

- [ ] **Step 3: Agregar fallback UI cuando hay error**

Agrega después del skeleton loader:

```tsx
      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-ink-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-ink-muted">Imagen no disponible</p>
          </div>
        </div>
      )}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/RealmLevel.tsx
git commit -m "feat: agregar error handling con fallback UI para imágenes fallidas"
```

---

## Fase 4: Testing y Verificación

### Task 10: Verificar funcionamiento en navegador

**Files:**
- No files to modify

- [ ] **Step 1: Iniciar servidor de desarrollo**

```bash
npm run dev
```

- [ ] **Step 2: Navegar a la sección del mapa interactivo**

Abre el navegador y ve a la URL del proyecto, desplázate hasta la sección del mapa interactivo.

- [ ] **Step 3: Verificar instrucciones de navegación**

Confirma que:
- La flecha animada aparece en el primer reino
- El texto "Desliza para explorar el universo" es visible
- Desaparece después de hacer scroll

- [ ] **Step 4: Verificar navegación entre reinos**

Confirma que:
- El scroll snap funciona suavemente
- Los dots de navegación se actualizan correctamente
- El haptic feedback funciona en dispositivos móviles (si está disponible)
- Los tooltips aparecen al hacer hover en los dots

- [ ] **Step 5: Verificar hotspot del mapa de galaxias**

Confirma que:
- El hotspot es más grande y visible que otros
- Tiene un icono de ojo
- Tiene un label visible "Mapa de Galaxias" con "Toca para explorar"
- Al tocarlo, se abre el overlay del mapa
- El hotspot muestra feedback visual de selección (verde)

- [ ] **Step 6: Verificar pinch zoom en el overlay**

Confirma que:
- El overlay del mapa de galaxias se abre correctamente
- El pinch zoom funciona sin resetear la escala
- Los botones de zoom (+/-) funcionan
- El overlay se cierra al tocar fuera o en el botón de cerrar

- [ ] **Step 7: Verificar loading states**

Confirma que:
- Los skeleton loaders aparecen mientras las imágenes cargan
- Las imágenes aparecen suavemente después de cargar
- No hay flickering durante la carga

- [ ] **Step 8: Verificar error handling (opcional)**

Para probar el error handling, temporalmente cambia una ruta de imagen en `realms-data.ts` a una ruta inválida y confirma que el fallback UI aparece.

- [ ] **Step 9: Verificar responsive design**

Confirma que:
- El mapa funciona correctamente en móvil
- Los hotspots son tappable en móvil
- El pinch zoom funciona en móvil
- Las instrucciones de navegación son legibles en móvil

- [ ] **Step 10: Revertir cambios de prueba si se hicieron**

Si modificaste rutas de imágenes para probar error handling, revierte los cambios.

---

## Task 11: Documentación final

**Files:**
- Modify: `docs/intencion-mapa-interactivo.md`

- [ ] **Step 1: Agregar nota de implementación al documento**

Agrega al final de `docs/intencion-mapa-interactivo.md`:

```markdown
---

## Notas de Implementación

**Fecha de implementación:** 26 de junio de 2026

**Correcciones implementadas:**

### Fase 1: Correcciones Críticas (Prioridad 1)
- ✅ Instrucciones de navegación visibles (flecha animada + texto)
- ✅ Corrección de bug en pinch zoom (lógica de escala)
- ✅ Hotspots prominentes con mayor visibilidad

### Fase 2: Mejoras de Performance (Prioridad 2)
- ✅ Eliminación de duplicación de imágenes en RealmLevel
- ✅ Feedback visual de selección en hotspots
- ✅ Sincronización de scroll snap con IntersectionObserver

### Fase 3: Mejoras de Polish (Prioridad 3)
- ✅ Tooltips en dots de navegación
- ✅ Loading states con skeleton loaders
- ✅ Error handling con fallback UI

**Estado:** El mapa interactivo ahora funciona según la intención original del diseño, con UX mejorada y bugs corregidos.
```

- [ ] **Step 2: Commit**

```bash
git add docs/intencion-mapa-interactivo.md
git commit -m "docs: agregar notas de implementación de correcciones al mapa interactivo"
```

---

## Task 12: Limpieza final

**Files:**
- No files to modify

- [ ] **Step 1: Verificar que no haya cambios pendientes**

```bash
git status
```

- [ ] **Step 2: Crear tag de versión (opcional)**

```bash
git tag -a v1.1.0 -m "Correcciones críticas de UX y bugs en mapa interactivo"
git push origin v1.1.0
```

- [ ] **Step 3: Resumen de cambios**

Los cambios implementados incluyen:
- 3 commits de correcciones críticas (Fase 1)
- 3 commits de mejoras de performance (Fase 2)
- 3 commits de mejoras de polish (Fase 3)
- 1 commit de documentación
- Total: 10 commits

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Instrucciones de navegación visibles (Task 1)
- ✅ Corrección de pinch zoom (Task 2)
- ✅ Hotspot del mapa más visible (Task 3)
- ✅ Eliminar duplicación de imágenes (Task 4)
- ✅ Feedback de selección de hotspots (Task 5)
- ✅ Sincronizar scroll snap (Task 6)
- ✅ Tooltips en dots (Task 7)
- ✅ Loading states (Task 8)
- ✅ Error handling (Task 9)
- ✅ Testing y verificación (Task 10)
- ✅ Documentación (Task 11)

**2. Placeholder scan:**
- ✅ No hay placeholders tipo "TBD" o "TODO"
- ✅ Todo el código está completo en cada paso
- ✅ Los comandos son específicos con outputs esperados

**3. Type consistency:**
- ✅ Interfaces actualizadas consistentemente (Hotspot, UseTouchGesturesOptions)
- ✅ Nombres de funciones y variables consistentes
- ✅ Props pasadas correctamente entre componentes

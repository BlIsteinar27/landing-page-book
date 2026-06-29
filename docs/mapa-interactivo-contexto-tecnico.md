# Mapa Interactivo - Contexto Técnico Completo

## ⚠️ ADVERTENCIA OBLIGATORIA

**CUALQUIER AGENTE QUE REALICE CAMBIOS AL MAPA INTERACTIVO DEBE ACTUALIZAR ESTE DOCUMENTO INMEDIATAMENTE.**

Este archivo es la fuente única de verdad para el contexto técnico del mapa interactivo. Si modificas componentes, agregas funcionalidades, resuelves problemas o cambias la configuración, DEBES actualizar este documento para reflejar esos cambios. No actualizar este documento después de hacer cambios al mapa interactivo es una violación crítica del protocolo de trabajo.

## Propósito

Este documento proporciona el contexto técnico completo del mapa interactivo para que cualquier agente pueda trabajar en él sin necesidad de contexto adicional. Contiene la arquitectura, componentes, funcionalidades, problemas resueltos y protocolos de trabajo.

---

## Visión General

El mapa interactivo es una sección de la landing page que presenta el universo "Cono Cósmico" de la saga "Dioses Universales". Permite a los usuarios explorar tres reinos (Luz, Central, Oscuro) mediante scroll vertical, con hotspots interactivos y overlays para ver detalles ampliados.

### Características Principales

- Navegación vertical con scroll snap entre 3 reinos
- Imágenes de fondo a pantalla completa con parallax sutil
- Hotspots interactivos en el Reino Oscuro
- Overlays con zoom (pinch-to-zoom) para ver imágenes ampliadas
- DualOverlay especial para el Reino Oscuro + Mapa de Galaxias
- Navegación por dots laterales
- Integración con scroll de la página principal (sin scroll anidado)

---

## Arquitectura de Componentes

### Jerarquía de Componentes

```
InteractiveMapSection-server.tsx (Server Component)
└── InteractiveMapSection-client.tsx (Client Component)
    ├── RealmLevel.tsx (x3 - uno por realm)
    │   └── Image (Next.js)
    ├── Hotspot.tsx (hotspots interactivos)
    ├── ZoomableOverlay.tsx (base reutilizable para overlays con zoom)
    ├── ImageOverlay.tsx (overlay imagen individual, usa ZoomableOverlay)
    ├── DualOverlay.tsx (overlay dual con navegación entre vistas)
    └── RealmInfoPanel.tsx (panel modal de lore/sinopsis de cada reino)
```

### Archivos Principales

| Archivo                            | Tipo             | Responsabilidad                                        |
| ---------------------------------- | ---------------- | ------------------------------------------------------ |
| `InteractiveMapSection-server.tsx` | Server Component | Wrapper, provee datos de libros, id de sección         |
| `InteractiveMapSection-client.tsx` | Client Component | Orquestador principal, estado de overlays, scroll snap |
| `RealmLevel.tsx`                   | Client Component | Renderiza un realm individual con imagen y contenido   |
| `Hotspot.tsx`                      | Client Component | Puntos interactivos con animación pulse y tooltip      |
| `ZoomableOverlay.tsx`              | Client Component | Base reutilizable con zoom, pan, cerrar y ayuda        |
| `ImageOverlay.tsx`                 | Client Component | Overlay genérico para imágenes con zoom                |
| `DualOverlay.tsx`                  | Client Component | Overlay dual con navegación entre vistas               |
| `RealmInfoPanel.tsx`               | Client Component | Botón de info y modal de lore/sinopsis de reinos       |
| `useScrollSnap.ts`                 | Custom Hook      | Maneja scroll snap y detección de realm activo         |
| `useTouchGestures.ts`              | Custom Hook      | Detecta long press y pinch-to-zoom                     |
| `realms-data.ts`                   | Config           | Datos de reinos y hotspots                             |
| `NavigationDots.tsx`               | UI Component     | Dots de navegación con orientación y tooltip lateral   |

---

## Estado Actual de Funcionalidades

### ✅ Funcionalidades Implementadas

#### 1. Navegación Vertical con Scroll Snap

- **Estado**: Funcional
- **Implementación**: Los reinos fluyen directamente en el scroll de la página (sin scroll anidado)
- **Hook**: `useScrollSnap` usa `IntersectionObserver` con `root: null` (viewport)
- **Comportamiento**: Cada realm ocupa `h-screen`, scroll natural de la página
- **Dots de navegación**: Solo visibles cuando la sección está en viewport (`isInSection`)

#### 2. Overlays con Zoom

- **Estado**: Funcional
- **Componentes base**: `ZoomableOverlay` (reutilizable)
- **Consumidores**: `ImageOverlay` (imágenes individuales), `DualOverlay` (vista individual)
- **Zoom**: Pinch-to-zoom vía `useTouchGestures` + botones de zoom (+/-)
- **Pan/Arrastre**: Disponible cuando `scale > 1`
- **Reset de zoom**: Se resetea a 1 cuando el overlay se abre/cierra
- **Eventos**: `e.stopPropagation()` en botones para evitar cierre accidental

#### 3. DualOverlay con Navegación

- **Estado**: Funcional
- **Comportamiento**:
  - Vista dual: muestra ambas imágenes lado a lado
  - Click en imagen → vista individual con zoom
  - Botón "← Ver ambos" → regresa a vista dual
  - Zoom controls solo en vista individual
- **Trigger**: Click en imagen del realm-dark O click en hotspot "Mapa de Galaxias"

#### 4. Hotspots Interactivos

- **Estado**: Funcional
- **Ubicación**: Todos los reinos (Luz, Central, Oscuro)
- **Hotspots**: Cada realm tiene un hotspot prominente en posición (0.5, 0.5)
- **Comportamiento**: Los overlays se abren exclusivamente vía hotspot una vez que este es visible; antes de eso, el click en la imagen también puede abrir el overlay
- **Animación**: Pulse effect centrado con el botón; delay de 2 segundos en la primera aparición
- **Trigger**: Hotspot de realm-dark abre DualOverlay; los demás abren ImageOverlay

#### 5. Imágenes de Reinos

- **Estado**: Funcional
- **Comportamiento**: `object-cover` a pantalla completa
- **Click**: Abre overlay correspondiente
  - Realm de la Luz → ImageOverlay
  - Realm Central → ImageOverlay
  - Realm Oscuro → DualOverlay

#### 6. Botón de Navegación desde Hero

- **Estado**: Funcional
- **Ubicación**: HeroSection.tsx
- **Texto**: "Explora el universo"
- **Comportamiento**: Scroll suave a `#mapa-interactivo`

#### 7. Panel de Lore/Sinopsis en Overlays

- **Estado**: Funcional
- **Componente**: `RealmInfoPanel.tsx`
- **Ubicación**: `ImageOverlay` (Reino de la Luz, Reino Central) y `DualOverlay` vista dual (Reino Oscuro + Mapa de Galaxias)
- **Botón**: Icono de información (i) en círculo con estilo púrpura oscuro `#3d1f5c`, borde dorado `#ffc667` y glow dorado sutil. Posicionado en el header del overlay (esquina superior) para evitar quedar en el borde inferior de la pantalla y facilitar el clic en desktop
- **Modal**: Panel centrado responsive con animación suave, fondo degradado púrpura, marco dorado doble, título en `font-display`, viñetas con los símbolos originales (◆, +, \*)
- **Datos**: Campo `lore` en `realms-data.ts` con `title`, `subtitle` y `points` por reino
- **Comportamiento**: Se abre al tocar el botón, se cierra con backdrop, tecla Escape o botón de cerrar; bloquea scroll del fondo vía `z-[60]` y backdrop
- **Responsivo**: Mismo modal centrado funciona en móvil y desktop con `max-w-md` y `max-h-[80vh]`

---

## Problemas Resueltos (Historial)

### 1. Botones de Zoom Cerraban Overlay

- **Problema**: Click en botones de zoom propagaba al backdrop, cerrando el overlay
- **Solución**: Agregar `e.stopPropagation()` a todos los botones interactivos
- **Archivos**: `ImageOverlay.tsx`, `GalaxyOverlay.tsx`, `DualOverlay.tsx`

### 2. Zoom Persistía al Reabrir Overlay

- **Problema**: Estado `scale` no se reseteaba al reabrir overlay
- **Solución**: `useEffect` que resetea `scale = 1` cuando `isVisible` cambia a `true`
- **Archivos**: `ImageOverlay.tsx`, `GalaxyOverlay.tsx`, `DualOverlay.tsx`

### 3. Scroll Atrapado en Sección

- **Problema**: `overflow-y-scroll snap-y snap-mandatory` creaba scroll context separado
- **Solución**: Eliminar scroll anidado, usar `IntersectionObserver` con viewport
- **Archivos**: `InteractiveMapSection-client.tsx`, `useScrollSnap.ts`

### 4. Secciones Adyacentes Visibles

- **Problema**: Contenedor `h-screen` competía con flujo de página
- **Solución**: Reinos fluyen directamente en scroll de página
- **Archivos**: `InteractiveMapSection-client.tsx`

### 5. Hotspot Desalineado (Pulse Effect, Botón y Label)

- **Problema**: El pulse effect (círculo amarillo), el botón y el label del hotspot no estaban perfectamente alineados entre sí
- **Solución**: Simplificar el sistema de posicionamiento usando `flex items-center justify-center` en el contenedor principal y eliminar transformaciones individuales de los elementos hijos
- **Archivos**: `Hotspot.tsx`
- **Fecha**: 28 de junio de 2026

### 6. DualOverlay No Se Abría

- **Problema**: Hotspot del mapa de galaxias abría GalaxyOverlay en lugar de DualOverlay
- **Solución**: Cambiar lógica en `handleHotspotClick` para abrir DualOverlay
- **Archivos**: `InteractiveMapSection-client.tsx`

### 7. Implementación de Hotspots en Todos los Reinos

- **Problema**: Solo el Reino Oscuro tenía hotspot, se requería hotspots en todos los reinos con interacción exclusiva
- **Solución**: Agregar hotspots a realm-light y realm-central, modificar lógica para que overlays solo se abran al hacer click en hotspots (no en las imágenes directamente)
- **Archivos**: `realms-data.ts`, `InteractiveMapSection-client.tsx`, `RealmLevel.tsx`
- **Fecha**: 28 de junio de 2026

### 8. Hotspots Aparecían Inmediatamente en Viewport

- **Problema**: Los hotspots aparecían inmediatamente cuando la imagen entraba al viewport, lo que podía ser distractor
- **Solución**: Agregar delay de 2 segundos en la animación de entrada del hotspot para que aparezca después de que la imagen haya estado visible ese tiempo
- **Archivos**: `Hotspot.tsx`
- **Fecha**: 28 de junio de 2026

### 9. Interacción Condicional de Overlays

- **Problema**: Se requería una funcionalidad donde los overlays pudieran abrirse haciendo click en la imagen si el hotspot aún no ha aparecido, pero solo a través del hotspot una vez que este sea visible
- **Solución**: Implementar sistema de rastreo de visibilidad de hotspots con callback `onVisible`, restaurar `handleImageClick` con lógica condicional que verifica si el hotspot del realm está en el conjunto de hotspots visibles
- **Archivos**: `Hotspot.tsx`, `InteractiveMapSection-client.tsx`, `RealmLevel.tsx`
- **Fecha**: 28 de junio de 2026

### 10. Hotspots Visibles Persistían al Cambiar de Realm

- **Problema**: Cuando un usuario scrolleaba a otro realm y luego regresaba, los hotspots del realm anterior seguían marcados como visibles, impidiendo la interacción condicional de overlays
- **Solución**: Implementar `useEffect` que monitorea cambios en `activeIndex` y limpia el conjunto de hotspots visibles, removiendo aquellos que no pertenecen al realm actual
- **Archivos**: `InteractiveMapSection-client.tsx`
- **Fecha**: 28 de junio de 2026

### 11. Falta de Título de Sección para Contexto Visual

- **Problema**: La sección del mapa interactivo carecía de un título que comunicara al usuario qué contenido visual encontraría (los mapas del universo de la saga)
- **Solución**: Agregar título "Explora el Universo" con subtítulo "El Cono Cósmico" y descripción en el componente server, antes del componente client, para no interferir con la funcionalidad del mapa interactivo
- **Archivos**: `InteractiveMapSection-server.tsx`
- **Fecha**: 28 de junio de 2026

### 12. Controles de Overlay No Visibles en Móvil

- **Problema**: Los controles del overlay (zoom, instrucciones) estaban casi imperceptibles en móvil porque competían por espacio con el StickyCTA que tenía el mismo z-index
- **Solución**: Ajustar posicionamiento de controles en DualOverlay (bottom-4 en móvil, bottom-6 en desktop) y reducir z-index de StickyCTA de 50 a 40 para que overlays tengan prioridad
- **Archivos**: `DualOverlay.tsx`, `StickyCTA.tsx`
- **Fecha**: 28 de junio de 2026

### 13. Falta de Funcionalidad de Arrastre en Overlays

- **Problema**: Los usuarios no podían mover las imágenes en la vista individual de los overlays, lo que limitaba la exploración de los mapas cuando estaban con zoom
- **Solución**: Extender hook `useTouchGestures` para agregar funcionalidad de arrastre (pan) con soporte para mouse y touch, implementar estado de posición en DualOverlay y aplicar transformación de posición solo en vista individual
- **Archivos**: `useTouchGestures.ts`, `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 14. Falta de Marco Elegante en Imágenes del DualOverlay

- **Problema**: Las imágenes del DualOverlay carecían de un marco visual que complementara la identidad gráfica de Victoria Querales, haciendo que la interfaz se sintiera menos premium
- **Solución**: Implementar marco de doble borde con púrpura oscuro (`#3d1f5c`) y dorado (`#ffc667`) siguiendo la paleta de colores del brandboard oficial, aplicado a ambas imágenes en vista dual y a la vista individual con zoom
- **Archivos**: `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 15. Bugs en Funcionalidad de Arrastre de Overlays

- **Problema**: El arrastre en overlays causaba scroll de fondo en móvil, bugs en desktop (cursor no cambiaba, eventos no bloqueados), y se activaba siempre en vista individual en lugar de solo cuando había zoom
- **Solución**: Agregar `preventDefault()` en todos los handlers touch/mouse, cambiar eventos a non-passive cuando `enablePan` está activo, implementar cambio de cursor a 'grabbing' durante arrastre, y modificar condición `enablePan` para activarse solo cuando `scale > 1`
- **Archivos**: `useTouchGestures.ts`, `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 16. Falta de Arrastre en ImageOverlay y GalaxyOverlay + Condición Incorrecta en DualOverlay

- **Problema**: ImageOverlay y GalaxyOverlay no tenían funcionalidad de arrastre implementada, causando que en móvil al intentar arrastrar se moviera el scroll de la página detrás del overlay. Además, DualOverlay solo permitía arrastre cuando había zoom (`scale > 1`), limitando la exploración de imágenes sin zoom en vista individual
- **Solución**: Implementar funcionalidad completa de arrastre (pan) en ImageOverlay y GalaxyOverlay con estado de posición, callback `onPan`, `enablePan` cuando `scale > 1`, aplicación de transformación de posición en animate, y cursor dinámico (grab/grabbing). Corregir condición `enablePan` en DualOverlay para activarse siempre en vista individual (`viewMode !== 'dual'`) en lugar de solo cuando hay zoom. Actualizar instrucciones contextuales en todos los overlays para mostrar "Arrastra para mover" cuando el arrastre está disponible
- **Archivos**: `ImageOverlay.tsx`, `GalaxyOverlay.tsx`, `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 17. Scroll de Fondo de Página Activo con Overlay Abierto

- **Problema**: Cuando se abría cualquier overlay (ImageOverlay, GalaxyOverlay, DualOverlay), el scroll de la página de fondo seguía activo en desktop y móvil. En móvil, gestos de touch sobre el overlay se propagaban al fondo, moviendo el scroll de la página detrás del overlay
- **Solución**: Crear hook reutilizable `useLockBodyScroll` que aplica `overflow: hidden`, `touch-action: none`, `overscroll-behavior: none` y ajusta `padding-right` para compensar el ancho del scrollbar. Aplicar el hook en todos los overlays (`ImageOverlay`, `GalaxyOverlay`, `DualOverlay`) cuando `isVisible` es `true`. Además, agregar `touch-action: none` y `overscroll-behavior: contain` directamente al contenedor `motion.div` principal de cada overlay para bloquear gestos de scroll en el overlay
- **Archivos**: `useLockBodyScroll.ts` (nuevo), `ImageOverlay.tsx`, `GalaxyOverlay.tsx`, `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 18. Marcos y Headers de Identidad Gráfica en Overlays

- **Problema**: Las imágenes dentro de los overlays individuales (`ImageOverlay`, `GalaxyOverlay`) carecían de marcos que reflejaran la identidad gráfica de Victoria Querales. Además, no había un header prominente con el nombre del mapa, en `DualOverlay` ambos labels estaban posicionados en la misma esquina inferior, y en la vista individual de `DualOverlay` no aparecía el nombre del mapa ampliado
- **Solución**: Aplicar marco de doble borde con púrpura oscuro (`#3d1f5c`) y dorado (`#ffc667`) con fondo degradado sutil a las imágenes de `ImageOverlay` y `GalaxyOverlay`. Agregar header centrado en la parte superior con el nombre del mapa en `ImageOverlay` y `GalaxyOverlay`. Reubicar labels en `DualOverlay` de forma diagonal: título de la imagen izquierda (`leftTitle`) en esquina superior izquierda, y título de la imagen derecha (`rightTitle`) en esquina inferior derecha. Agregar header en `DualOverlay` para la vista individual (`viewMode !== 'dual'`) mostrando `currentTitle` en la parte superior, posicionado con `left-36 right-16 md:left-40 md:right-20` para evitar solapamiento con el botón "Ver ambos" a la izquierda y el botón "Cerrar" a la derecha. Agregar prop `title` opcional a `GalaxyOverlay` con default "Mapa de Galaxias"
- **Archivos**: `ImageOverlay.tsx`, `GalaxyOverlay.tsx`, `DualOverlay.tsx`
- **Fecha**: 28 de junio de 2026

### 19. Consolidación de Overlays en ZoomableOverlay

- **Problema**: La arquitectura de overlays tenía componentes separados (`ImageOverlay`, `GalaxyOverlay`, `DualOverlay`) con lógica de zoom duplicada y mantenimiento disperso. `GalaxyOverlay.tsx` dejó de existir en el código pero seguía referenciado en la documentación
- **Solución**: Crear `ZoomableOverlay.tsx` como base reutilizable que centraliza zoom, pan, cierre, bloqueo de scroll y caja de ayuda. `ImageOverlay` se convierte en un wrapper de `ZoomableOverlay`. `DualOverlay` usa `ZoomableOverlay` para su vista individual. Se elimina `GalaxyOverlay.tsx` del árbol de componentes
- **Archivos**: `ZoomableOverlay.tsx` (nuevo), `ImageOverlay.tsx`, `DualOverlay.tsx`, `GalaxyOverlay.tsx` (eliminado)
- **Fecha**: 29 de junio de 2026

### 20. Caja de Ayuda Duplicada en Vista Individual de DualOverlay

- **Problema**: En la vista individual de `DualOverlay` se mostraban dos cajas de ayuda superpuestas con el mismo texto de zoom/arrastre: una de `DualOverlay` y otra de `ZoomableOverlay`
- **Solución**: Renderizar la caja de instrucciones de `DualOverlay` solo cuando `viewMode === 'dual'`. En vista individual, `ZoomableOverlay` provee únicamente la caja de ayuda correspondiente
- **Archivos**: `DualOverlay.tsx`
- **Fecha**: 29 de junio de 2026

### 21. Navegación por Dots en el Mapa Interactivo

- **Problema**: Los dots de navegación del mapa se renderizaban en un contenedor fijo a la derecha de la pantalla pero con disposición horizontal, lo que dificultaba su uso y hacía que los tooltips se desbordaran fuera del viewport
- **Solución**: Añadir props `orientation` y `tooltipPosition` a `NavigationDots`. En el mapa interactivo se usa `orientation="vertical"` y `tooltipPosition="left"`, apilando los dots verticalmente y mostrando los tooltips hacia el centro de la pantalla
- **Archivos**: `NavigationDots.tsx`, `InteractiveMapSection-client.tsx`
- **Fecha**: 29 de junio de 2026

### 22. Pinch-to-Zoom No Respondía Correctamente en Móvil

- **Problema**: El gesto de pinza con dos dedos en móvil no controlaba el zoom de los overlays. Los eventos touch se registraban como pasivos cuando no había pan activo (es decir, cuando `scale === 1`), lo que impedía llamar `preventDefault()` y dejaba que el navegador interpretara el pinch como zoom nativo de la página. Además, el `motion.div` de `ZoomableOverlay` animaba el zoom y el pan con spring, lo que introducía un retraso elástico mientras el usuario arrastraba o estiraba los dedos
- **Solución**: En `useTouchGestures.ts`, registrar los eventos touch como **non-passive** siempre que estén activos `onPinch` o `onPan`, llamar `e.preventDefault()` durante el pinch para evitar el zoom nativo del navegador, y resetear el estado inicial del pinch al levantar los dedos. En `ZoomableOverlay.tsx`, separar la animación de entrada del transform de zoom/pan: el `motion.div` solo maneja la animación de entrada/salida, mientras que un contenedor interno aplica `translate` y `scale` mediante CSS directo para respuesta inmediata
- **Archivos**: `useTouchGestures.ts`, `ZoomableOverlay.tsx`
- **Fecha**: 29 de junio de 2026

### 23. Integración de Leyendas/Sinopsis en Overlays

- **Problema**: Se requería mostrar los textos de leyenda/sinopsis de cada reino dentro de los overlays de mapa de forma elegante, alineada a la identidad gráfica de Victoria Querales y funcional tanto en móvil como en desktop
- **Solución**: Crear componente `RealmInfoPanel.tsx` con botón de información (i) estilizado en púrpura/dorado y un modal centrado responsive. Agregar estructura `RealmLore` a `realms-data.ts` con `title`, `subtitle` y `points` (con iconos `diamond`, `plus`, `asterisk`). Integrar el botón en `ImageOverlay` (pasa `lore` del reino seleccionado) y en `DualOverlay` solo en vista dual (pasa `lore` del `realm-dark` porque describe ambos mapas juntos)
- **Archivos**: `RealmInfoPanel.tsx` (nuevo), `realms-data.ts`, `ImageOverlay.tsx`, `DualOverlay.tsx`, `InteractiveMapSection-client.tsx`
- **Fecha**: 29 de junio de 2026

### 24. Botón de Info Quedaba en el Borde Inferior de la Pantalla

- **Problema**: En desktop, el botón de información estaba posicionado en la esquina inferior derecha de los overlays, lejos del contenido, lo que hacía difícil clickearlo; al mover el cursor hacia el botón se podía salir del overlay y cerrarlo accidentalmente
- **Solución**: Mover el botón de información al header del overlay. En `ImageOverlay` se pasó un header personalizado con el botón de info a la izquierda y el título centrado. En `DualOverlay` vista dual se posicionó el botón en `top-4 right-16`, junto al botón de cerrar
- **Archivos**: `ImageOverlay.tsx`, `DualOverlay.tsx`
- **Fecha**: 29 de junio de 2026

---

## Configuración de Datos

### `realms-data.ts`

```typescript
export type LoreBulletIcon = "diamond" | "plus" | "asterisk";

export interface LorePoint {
  text: string;
  icon?: LoreBulletIcon;
}

export interface RealmLore {
  title: string;
  subtitle: string;
  points: LorePoint[];
}

export interface Realm {
  id: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  order: number;
  hotspots?: Hotspot[];
  lore?: RealmLore;
}

export const realms: Realm[] = [
  {
    id: "realm-light",
    name: "Reino de la Luz",
    title: "Reino de la Luz",
    description: "La cúspide del cono cósmico...",
    backgroundImage: "/landing-book-victoria/reino-de-la-luz.jpg",
    order: 1,
    hotspots: [
      {
        id: "realm-light-hotspot",
        x: 0.5,
        y: 0.5,
        title: "Reino de la Luz",
        description:
          "Explora el reino donde habitan los dioses de mayor jerarquía",
        isProminent: true,
      },
    ],
    lore: {
      title: "El Reino de la Luz",
      subtitle: "Hogar de los dragones",
      points: [
        {
          icon: "diamond",
          text: "El reino más rico, creador del concepto del dinero.",
        },
        { icon: "diamond", text: "Rico en tierras y minerales." },
        { icon: "diamond", text: "El reino pacífico." },
        { icon: "diamond", text: "Cuna del arte." },
        {
          icon: "diamond",
          text: "Elitistas por excelencia, clasistas, engreídos (pero algunos son cheveres).",
        },
      ],
    },
  },
  {
    id: "realm-central",
    name: "Reino Central",
    title: "Reino Central",
    description: "El punto medio del universo...",
    backgroundImage: "/landing-book-victoria/reino-central.jpg",
    order: 2,
    hotspots: [
      {
        id: "realm-central-hotspot",
        x: 0.5,
        y: 0.5,
        title: "Reino Central",
        description:
          "Explora el punto medio del universo, equilibrio entre luz y oscuridad",
        isProminent: true,
      },
    ],
    lore: {
      title: "El Reino Central",
      subtitle: "El corazón del universo",
      points: [
        { icon: "diamond", text: "Está exactamente en el universo." },
        {
          icon: "diamond",
          text: "Proteccionistas de la naturaleza, el océano y toda criatura viviente.",
        },
        {
          icon: "plus",
          text: "Los seres centrales están conectados con la naturaleza y con los sentimientos.",
        },
        {
          icon: "plus",
          text: "Son amables, pero fuertes; no dejarse engañar por ellos o tus cosechas pagarán el precio.",
        },
      ],
    },
  },
  {
    id: "realm-dark",
    name: "Reino Oscuro",
    title: "Reino Oscuro",
    description: "La base del cono...",
    backgroundImage: "/landing-book-victoria/reino-oscuro.png",
    order: 3,
    hotspots: [
      {
        id: "galaxy-map",
        x: 0.5,
        y: 0.5,
        title: "Reino Oscuro",
        description: "Explora las galaxias...",
        image:
          "/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg",
        isProminent: true,
      },
    ],
    lore: {
      title: "El Reino Oscuro",
      subtitle: "La base del cono cósmico",
      points: [
        { icon: "diamond", text: "Viven criaturas monstruosas de todo tipo." },
        { icon: "diamond", text: "En constantes guerras territoriales." },
        {
          icon: "diamond",
          text: "Se prioriza la razón por encima de los sentimientos.",
        },
        {
          icon: "plus",
          text: "Hay más dioses, por lo tanto son los que empiezan las guerras.",
        },
        {
          icon: "diamond",
          text: "Gobernado por los dioses Seth (Dios de la Muerte & el Inframundo) y Laila (Diosa de la Oscuridad).",
        },
        { icon: "asterisk", text: "Reino de mayor extensión de territorio..." },
      ],
    },
  },
];
```

---

## Protocolos de Trabajo

### Para Implementar Cambios de UI/UX

**Skills a invocar:**

1. **`interface-design`** - Para cambios en la estructura, layout, y organización visual
2. **`frontend-design`** - Para implementación de componentes, estilos, y animaciones

**Cuándo usar:**

- Modificar el layout de los reinos
- Cambiar la apariencia de hotspots
- Modificar el diseño de overlays
- Agregar nuevas animaciones
- Cambiar colores, tipografía, espaciado
- Modificar la navegación visual

### Para Debugging de Problemas

**Skill a invocar:**

1. **`systematic-debugging`** - Para diagnóstico sistemático de bugs

**Cuándo usar:**

- Comportamiento inesperado en scroll
- Overlays que no abren/cierran correctamente
- Zoom que no funciona
- Hotspots que no responden
- Problemas de rendimiento
- Errores de consola

### Para Cambios en Tailwind CSS

**Skill a invocar:**

1. **`tailwind-orchestrator`** - Para auditoría y desarrollo con Tailwind

**Cuándo usar:**

- Modificar clases de Tailwind
- Optimizar el bundle CSS
- Implementar responsive design
- Agregar dark mode
- Problemas de layout con Tailwind

---

## Detalles Técnicos Importantes

### useScrollSnap Hook

```typescript
const { containerRef, activeIndex, scrollToIndex, isInSection } = useScrollSnap(
  {
    snapPoints: realms.length,
  },
);
```

- **containerRef**: Referencia al contenedor de reinos
- **activeIndex**: Índice del realm actualmente visible
- **scrollToIndex(index)**: Función para scroll programático a un realm
- **isInSection**: Boolean, true cuando la sección del mapa está en viewport

**Implementación:**

- Usa `IntersectionObserver` con `root: null` (viewport)
- Observa elementos con `data-snap-point`
- Threshold: 0.5 (50% de visibilidad)
- Sin haptic feedback en scroll: `navigator.vibrate()` requiere un user gesture (tap/click) y es bloqueado por Chrome durante el scroll

### useTouchGestures Hook

```typescript
const { elementRef } = useTouchGestures({
  onPinch: (newScale) => setScale(Math.min(Math.max(newScale, 0.5), 3)),
  currentScale: scale,
});
```

- **elementRef**: Referencia al elemento que detecta gestos
- **onPinch**: Callback cuando se detecta pinch-to-zoom
- **currentScale**: Escala actual para cálculos
- **Rango de zoom**: 0.5 a 3

### Estado de Overlays en InteractiveMapSection-client

```typescript
const [showGalaxyOverlay, setShowGalaxyOverlay] = useState(false);
const [showImageOverlay, setShowImageOverlay] = useState(false);
const [showDualOverlay, setShowDualOverlay] = useState(false);
const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
```

**Lógica de apertura:**

- Click en realm-light → `setShowImageOverlay(true)` + `setSelectedRealm(realm)`
- Click en realm-central → `setShowImageOverlay(true)` + `setSelectedRealm(realm)`
- Click en realm-dark → `setShowDualOverlay(true)`
- Click en hotspot galaxy-map → `setShowDualOverlay(true)`

**Lógica de cierre:**

- `closeOverlay()` resetea todos los estados de overlays

---

## Rutas de Imágenes

### Imágenes de Reinos

- Reino de la Luz: `/landing-book-victoria/reino-de-la-luz.jpg`
- Reino Central: `/landing-book-victoria/reino-central.jpg`
- Reino Oscuro: `/landing-book-victoria/reino-oscuro.png`

### Mapa de Galaxias

- SVG: `/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg`

### Portada de Libro

- `/landing-book-victoria/portada-libro-1.png`

---

## Consideraciones de Performance

1. **Imágenes**:
   - `priority={index === 0}` para primera imagen
   - `loading="eager"` para primera, `"lazy"` para otras
   - `quality={85}` para balance calidad/size
   - `sizes="100vw"` para responsive

2. **Animations**:
   - Motion de React para animaciones suaves
   - `motion-reduce:animate-none` para accesibilidad
   - Animaciones solo en realm activo

3. **Scroll**:
   - Sin scroll anidado, usa scroll nativo del navegador
   - IntersectionObserver optimizado

---

## Accesibilidad

1. **ARIA Labels**:
   - Dots de navegación tienen `aria-label`
   - Botones de zoom tienen focus states

2. **Keyboard Navigation**:
   - Dots de navegación son botones clickeables
   - Hotspots son botones clickeables

3. **Reduced Motion**:
   - Animaciones respetan `prefers-reduced-motion`

4. **Focus Management**:
   - Focus states visibles en elementos interactivos
   - `focus:ring` en botones

---

## Próximos Pasos Potenciales

### Mejoras Futuras Consideradas

1. Agregar más hotspots a otros reinos
2. Implementar transiciones más elaboradas entre reinos
3. Agregar sonidos ambientales
4. Implementar un tour guiado del universo
5. Agregar más información en tooltips de hotspots

### Áreas de Mejora Identificadas

1. Considerar agregar un loader más elaborado para imágenes
2. Optimizar aún más el bundle de imágenes
3. Considerar lazy loading de overlays

---

## Checklist para Trabajo en el Mapa Interactivo

Antes de hacer cambios, verificar:

- [ ] Leer este documento completo
- [ ] Invocar `interface-design` para cambios de UI/UX
- [ ] Invocar `frontend-design` para implementación
- [ ] Invocar `systematic-debugging` si hay problemas
- [ ] Verificar que los overlays funcionan correctamente
- [ ] Verificar que el scroll fluye naturalmente
- [ ] Verificar que los hotspots están alineados
- [ ] Verificar que el zoom funciona y se resetea
- [ ] Verificar en móvil, tablet y desktop
- [ ] Verificar accesibilidad (keyboard navigation, screen readers)
- [ ] Build exitoso (`npx next build`)
- [ ] No errores de TypeScript (`npx tsc --noEmit`)

---

## Contacto y Recursos

### Documentación Relacionada

- `@docs/intencion-mapa-interactivo.md` - Propósito y visión del mapa
- `@docs/logica-del-universo-cono-cosmico.md` - Lore del universo
- `@docs/contenido-victoria.md` - Contenido general del proyecto

### Skills Relacionadas

- `interface-design` - Diseño de interfaces
- `frontend-design` - Desarrollo frontend
- `systematic-debugging` - Debugging sistemático
- `tailwind-orchestrator` - Trabajo con Tailwind CSS

---

**Última actualización**: 29 de junio de 2026 (integración de leyendas/sinopsis de reinos en overlays mediante `RealmInfoPanel.tsx`, estructura `RealmLore` en `realms-data.ts`, botón de información en `ImageOverlay` y `DualOverlay` vista dual, modal centrado responsive en móvil y desktop)
**Estado**: Funcional, build exitoso, sin errores críticos

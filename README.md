# Landing page — Los Dos Reinos

Landing page de venta para el libro "Los Dos Reinos" de Victoria. Diseño dark premium Mobile-First con animaciones via Motion, mapa interactivo de reinos cósmicos y sistema de overlays con zoom.

## Stack

- **Framework:** Next.js 16 (App Router) con React Compiler
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4 con tokens de diseño custom
- **Animaciones:** Motion (motion/react) v14 con `LazyMotion` estricto (`domAnimation`, componentes usan `m.*`), `MotionConfig reducedMotion="user"`
- **Iconos:** Lucide React (iconos de interfaz) + SVG propios solo para logos de marca
- **Tipografía:** Starlight Rune (display), Playfair Display (serif), Inter (body)

## Características Principales

- **Hero con ambiente vivo**: glow radial que respira (centrado en móvil, junto al mockup en desktop), anillo tipo "sonar" en el pill de "Ya disponible" y motas doradas ascendentes (`CosmicDust` light) — todo CSS/Motion puro bajo `prefers-reduced-motion`, sin costo al LCP
- **Mapa Interactivo de Reinos**: Scrollytelling por capítulos para navegar entre 3 reinos cósmicos (Reino de la Luz, Reino Central, Reino Oscuro), con vista alterna Reino Oscuro ↔ Mapa de Galaxias, rail de navegación en móvil (`NavigationRail`), cápsula de dots en desktop y animación ambiental en reposo — cada mapa respira con deriva y motas de partículas propias
- **Overlays con Zoom y Pan**: Diálogos accesibles (`role="dialog"`, foco atrapado, Escape, portal) para visualizar imágenes individuales o duales con gestos táctiles (pinch zoom, pan), zoom con rueda anclado al cursor, doble clic y doble toque, todo por MotionValues sin re-render — y zoom inicial adaptativo según la imagen y la pantalla
- **Hotspots Interactivos**: Botones reales con teclado y lector de pantalla que despliegan el lore de cada reino
- **Carrusel de Personajes**: Autoplay cada 4 s (solo mientras está en viewport) con pausa manual, pausa en hover/foco y respeto a `prefers-reduced-motion`
- **CTA de compra único**: Un solo botón "Comprar Los Dos Reinos" abre el selector de canal (`CompraDialog`): pedido por WhatsApp en Venezuela y compra en Amazon para el resto del mundo (enlaces en `src/config/links.ts`)
- **Movimiento reducido**: Toda la página respeta `prefers-reduced-motion` vía `MotionConfig` y `useEnterVariants`
- **Optimización de Imágenes**: Configuración avanzada de Next.js Image con AVIF/WebP, lazy loading y placeholders blur
- **SEO Schema Markup**: Datos estructurados JSON-LD para autora, libro, sitio y organización
- **Responsive Design**: Mobile-First con breakpoints optimizados y `dvh` para viewport móvil
- **Performance**: React Compiler habilitado; secciones estáticas como server components con primitivas de entrada `<Enter>`/`<Stagger>`; `CompraDialog` por `dynamic()`; animaciones ambientales y starfield WebGL pausados cuando no son visibles (`frameloop` gateado, bitmaps de capítulos desmontados a opacidad 0 sostenida)

## Estructura

```
src/
├── app/
│   ├── globals.css              # Tokens de diseño (CSS custom properties)
│   ├── layout.tsx               # Root layout con metadata SEO
│   ├── page.tsx                 # Composición de secciones
│   ├── icon.svg                 # Favicon (monograma VQ con Starlight Rune real)
│   ├── icon.png                 # Favicon fallback 48px
│   ├── apple-icon.png           # Icono iOS 180px
│   ├── not-found.tsx            # Página 404 custom
│   ├── sitemap.ts               # Sitemap dinámico (victoriaquerales.com)
│   └── robots.ts                # Configuración de robots.txt
├── components/
│   ├── sections/                # Secciones de la página
│   │   ├── hero/                # Hero con mockup del libro y ambiente (glow, sonar, motas)
│   │   ├── mapa/                # Mapa interactivo de reinos (scrollytelling)
│   │   │   ├── RealmChapter.tsx # Capítulo de reino con vista alterna y deriva ambiental
│   │   │   ├── RealmLevel.tsx   # Nivel individual de reino
│   │   │   ├── GalaxyScene.tsx  # Starfield 3D del Reino Oscuro (R3F)
│   │   │   ├── AtmosphereLayer.tsx # Nieblas, halo y polvo por reino
│   │   │   ├── Hotspot.tsx      # Punto de interés interactivo
│   │   │   └── InteractiveMapSection-*.tsx
│   │   ├── personajes/          # Carrusel de protagonistas
│   │   │   ├── PersonajesSection-server.tsx  # Cabecera y cierre (server)
│   │   │   ├── PersonajesSection-client.tsx  # Carrusel interactivo
│   │   │   └── DivineParticles.tsx  # Partículas dinámicas (SSR: false)
│   │   ├── sinopsis/            # Sinopsis del libro
│   │   ├── autora/              # Sobre la autora
│   │   ├── saga/                # Saga completa
│   │   ├── comunidad/           # Comunidad de lectores (comentada en page.tsx)
│   │   ├── contacto/            # Formulario de contacto
│   │   ├── testimonios/         # Testimonios de lectores (comentada en page.tsx)
│   │   └── footer/              # Footer con links
│   ├── overlays/                # Sistema de overlays
│   │   ├── DualOverlay.tsx      # Overlay dual (2 imágenes lado a lado)
│   │   ├── ImageOverlay.tsx     # Overlay de imagen individual
│   │   ├── ZoomableOverlay.tsx  # Overlay con zoom y pan
│   │   └── RealmInfoPanel.tsx   # Panel de información de reino
│   ├── ui/                      # Componentes UI reutilizables
│   │   ├── NavigationDots.tsx   # Indicadores de navegación (desktop)
│   │   ├── NavigationRail.tsx   # Riel de navegación entre reinos (móvil)
│   │   ├── CTAButton.tsx        # Botón de compra (abre el selector de canal)
│   │   ├── CosmicDust.tsx       # Motas de partículas por variante (hero y mapa)
│   │   ├── Enter.tsx            # Primitiva client de entrada (envuelve children server)
│   │   ├── Stagger.tsx          # Contenedor stagger de entrada para server components
│   │   └── ...
│   ├── icons/                   # Logos de marca (Instagram, TikTok, WhatsApp)
│   ├── Portal.tsx               # Portal para renderizar overlays fuera de <main>
│   ├── MotionProvider.tsx       # LazyMotion strict (domAnimation) + MotionConfig reducedMotion="user"
│   ├── ImageErrorFallback.tsx   # Fallback para errores de imagen
│   ├── SchemaMarkup.tsx         # Datos estructurados SEO (JSON-LD)
│   ├── StickyCTA.tsx            # CTA sticky en scroll
│   ├── CompraDialog.tsx         # Selector de canal de compra (WhatsApp Venezuela / Amazon)
│   ├── CompraDialogProvider.tsx # Contexto: abre el selector desde cualquier CTA
│   └── CTAVisibilityProvider.tsx # Provider de visibilidad de CTA
├── hooks/
│   ├── useDialog.ts             # Accesibilidad de diálogos (foco, Escape, inert)
│   ├── useEnterVariants.ts      # Variantes de entrada con reduced motion
│   ├── useLockBodyScroll.ts     # Hook para bloquear scroll del body
│   ├── useScrollSnap.ts         # Hook para scroll snap del mapa
│   ├── useTouchGestures.ts      # Hook para gestos táctiles (pinch, pan, doble toque)
│   └── useRegisterCTA.ts        # Hook para registrar elementos CTA
├── config/
│   ├── realms-data.ts           # Datos de reinos y hotspots
│   ├── links.ts                 # Links externos (WhatsApp, etc.)
│   ├── motion-tokens.ts         # Tokens de animación Motion
│   └── site.ts                  # Configuración del sitio (metadata)
├── data/
│   ├── libros.ts                # Datos de libros
│   └── testimonios.ts           # Datos de testimonios
├── fonts/                       # Fuentes custom
├── lib/                         # Utilidades de librería
├── types/                       # Definiciones de tipos TypeScript
└── utils/                       # Utilidades generales
```

## Configuración de Next.js

El proyecto tiene configuración optimizada para imágenes en `next.config.ts`:

- Formatos: AVIF, WebP
- Calidades: 75, 85
- Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
- `minimumCacheTTL` de 30 días para el optimizer
- Local patterns para imágenes en `/landing-book-victoria/**`

## Scripts

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting
npm run lint:fix     # Linting con auto-fix
```

Abre [http://localhost:3000](http://localhost:3000) en desarrollo.

## Notas de Desarrollo

### Imágenes

- Las imágenes deben estar en `public/landing-book-victoria/`
- `og-image.jpg` (1200×630, ~55 KB) es la imagen dedicada para compartir en redes; se generó con `sharp` componiendo la portada sobre el gradiente de marca. Regenerar si cambia la portada o la identidad.
- Los iconos de pestaña (`src/app/icon.svg`, `icon.png`, `apple-icon.png`) usan los glifos reales de Starlight Rune extraídos del TTF con `opentype.js` (devDependency de tooling, no se importa en la app).
- Evitar nombres con espacios o caracteres especiales (causan 404 en producción)
- Usar extensiones en minúscula (`.png` no `.PNG`) para compatibilidad Linux
- Las imágenes above the fold deben tener `priority` y `loading="eager"`

### Hydration Mismatch

- Componentes con `Math.random()` deben usar `dynamic(() => import(...), { ssr: false })`
- Ejemplo: `DivineParticles.tsx` se carga dinámicamente para evitar mismatch

### Overlays y Scroll

- Los overlays se renderizan en un `Portal` fuera de `<main>` para que `inert` no los desactive
- `useDialog` gestiona `role="dialog"`, foco inicial, Escape y devolución del foco al disparador
- El hook `useLockBodyScroll` usa un contador global para manejar múltiples overlays apilados
- Los gestos táctiles se registran en `document` para capturar drag fuera del elemento
- `ZoomableOverlay` con `renderInline=true` no llama `useLockBodyScroll` (el padre ya lo hace)
- El zoom/pan de `ZoomableOverlay` vive en MotionValues (`useMotionValue` + `animate()`), no en estado React — los gestos no re-renderizan; la rueda hace zoom anclado al cursor y el doble clic/doble toque (este último detectado a mano en `useTouchGestures`) alterna ×2 ↔ 1
- El zoom inicial es adaptativo: `initialFill` (0–1) fija la fracción del marco que la imagen cubre al abrirse, medida en tiempo real según el tamaño de pantalla; cada reino puede ajustarlo con `overlayFill` en `realms-data.ts`
- El `header` de `ZoomableOverlay` se renderiza dentro del marco del mapa — el pill del título cuelga del borde superior, no flota sobre el backdrop

### Identidad gráfica

- La paleta de `globals.css` es identidad de marca: no modificar valores, solo reutilizar tokens existentes
- Los iconos de interfaz son Lucide (`nonScalingStroke`); los logos de marca son SVG propios en `components/icons/`

### SEO

- Toda la metadata (título, descripción, OG, Twitter, canonical) vive en `src/config/site.ts` — no hardcodear en componentes.
- El schema JSON-LD (`SchemaMarkup.tsx`) se alimenta de `site.ts` y `links.ts`. No declarar datos que no existan (sin `aggregateRating` hasta tener reseñas reales, sin `SearchAction` — no hay página de búsqueda).
- `offers.url` del schema apunta al link real de Amazon en `links.ts`.
- El sitemap lo genera `src/app/sitemap.ts` — no crear `public/sitemap.xml` (quedaría en conflicto).
- El dominio está verificado en Google Search Console (registro TXT en Spaceship).

## Documentación

Ver [`docs/`](./docs/) para documentación adicional sobre diseño, arquitectura y decisiones técnicas. Las reglas del proyecto para agentes de IA están en [`AGENTS.md`](./AGENTS.md).

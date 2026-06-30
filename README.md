# Landing page — Los Dos Reinos

Landing page de venta para el libro "Los Dos Reinos" de Victoria. Diseño dark premium Mobile-First con animaciones via Motion, mapa interactivo de reinos cósmicos y sistema de overlays con zoom.

## Stack

- **Framework:** Next.js 16 (App Router) con React Compiler
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4 con tokens de diseño custom
- **Animaciones:** Motion (motion/react) v12
- **Iconos:** Lucide React
- **Tipografía:** Syne (display), Playfair Display (serif), Inter (body)

## Características Principales

- **Mapa Interactivo de Reinos**: Sistema de scroll snap para navegar entre 3 reinos cósmicos (Reino de la Luz, Reino Central, Reino Oscuro)
- **Overlays con Zoom y Pan**: Sistema de overlays para visualizar imágenes individuales o duales con gestos táctiles (pinch zoom, pan)
- **Hotspots Interactivos**: Puntos de interés en cada reino que despliegan información detallada
- **Carrusel de Personajes**: Sección de protagonistas con transiciones animadas y partículas doradas flotantes
- **Optimización de Imágenes**: Configuración avanzada de Next.js Image con AVIF/WebP, lazy loading y placeholders blur
- **SEO Schema Markup**: Datos estructurados para libros y autores
- **Responsive Design**: Mobile-First con breakpoints optimizados
- **Performance**: React Compiler habilitado para optimización automática

## Estructura

```
src/
├── app/
│   ├── globals.css              # Tokens de diseño (CSS custom properties)
│   ├── layout.tsx               # Root layout con metadata SEO
│   ├── page.tsx                 # Composición de secciones
│   ├── not-found.tsx            # Página 404 custom
│   └── robots.ts                # Configuración de robots.txt
├── components/
│   ├── sections/                # Secciones de la página
│   │   ├── hero/                # Hero con mockup del libro
│   │   ├── mapa/                # Mapa interactivo de reinos
│   │   │   ├── RealmLevel.tsx   # Nivel individual de reino
│   │   │   ├── Hotspot.tsx      # Punto de interés interactivo
│   │   │   └── InteractiveMapSection-*.tsx
│   │   ├── personajes/          # Carrusel de protagonistas
│   │   │   ├── PersonajesSection-client.tsx
│   │   │   └── DivineParticles.tsx  # Partículas dinámicas (SSR: false)
│   │   ├── sinopsis/            # Sinopsis del libro
│   │   ├── autora/              # Sobre la autora
│   │   ├── saga/                # Saga completa
│   │   ├── comunidad/           # Comunidad de lectores
│   │   ├── contacto/            # Formulario de contacto
│   │   ├── testimonios/         # Testimonios de lectores
│   │   └── footer/              # Footer con links
│   ├── overlays/                # Sistema de overlays
│   │   ├── DualOverlay.tsx      # Overlay dual (2 imágenes lado a lado)
│   │   ├── ImageOverlay.tsx     # Overlay de imagen individual
│   │   ├── ZoomableOverlay.tsx  # Overlay con zoom y pan
│   │   └── RealmInfoPanel.tsx   # Panel de información de reino
│   ├── ui/                      # Componentes UI reutilizables
│   │   ├── NavigationDots.tsx   # Indicadores de navegación
│   │   ├── CTAButton.tsx        # Botón de llamada a acción
│   │   └── ...
│   ├── icons/                   # Iconos custom
│   ├── GalaxyOverlay.tsx        # Overlay del mapa de galaxias
│   ├── ImageErrorFallback.tsx   # Fallback para errores de imagen
│   ├── SchemaMarkup.tsx         # Datos estructurados SEO
│   ├── StickyCTA.tsx            # CTA sticky en scroll
│   └── CTAVisibilityProvider.tsx # Provider de visibilidad de CTA
├── hooks/
│   ├── useLockBodyScroll.ts     # Hook para bloquear scroll del body
│   ├── useScrollSnap.ts         # Hook para scroll snap del mapa
│   ├── useTouchGestures.ts      # Hook para gestos táctiles (pinch, pan)
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
- SVG permitidos con `dangerouslyAllowSVG`
- Local patterns para imágenes en `/landing-book-victoria/**`
- CSP para seguridad de SVGs

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
- Evitar nombres con espacios o caracteres especiales (causan 404 en producción)
- Usar extensiones en minúscula (`.png` no `.PNG`) para compatibilidad Linux
- Las imágenes above the fold deben tener `priority` y `loading="eager"`

### Hydration Mismatch

- Componentes con `Math.random()` deben usar `dynamic(() => import(...), { ssr: false })`
- Ejemplo: `DivineParticles.tsx` se carga dinámicamente para evitar mismatch

### Overlays y Scroll

- El hook `useLockBodyScroll` usa un contador global para manejar múltiples overlays apilados
- Los gestos táctiles se registran en `document` para capturar drag fuera del elemento
- `ZoomableOverlay` con `renderInline=true` no llama `useLockBodyScroll` (el padre ya lo hace)

## Documentación

Ver [`docs/`](./docs/) para documentación adicional sobre diseño, arquitectura y decisiones técnicas.

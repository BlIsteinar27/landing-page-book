# Reglas del proyecto — Landing Los Dos Reinos

Landing page estática (single page) de venta del libro "Los Dos Reinos" de Victoria Querales. Next.js 16 + React 19 + Tailwind 4 + Motion 14 + Lucide.

## Idioma y comunicación

- Todo el contenido de la interfaz, comentarios de código, commits y documentación en **español**.
- Los textos de la autora (sinopsis, biografía, lore, títulos) **no se corrigen ni reescriben**: son decisión editorial de la autora.

## Identidad gráfica (no negociable)

- **La paleta de colores no se modifica.** Los tokens viven en `src/app/globals.css` (`surface-*`, `accent`, `ink-*`, `whatsapp`, `purple-medium`). Para ajustes de contraste o nuevos usos, reutilizar tokens existentes; nunca introducir colores ajenos a la marca. Referencia: `public/landing-book-victoria/brandboard (2).jpeg`.
- **La tipografía no se toca.** Starlight Rune (display, solo peso 400 — `font-black` simula la negrita y es intencional), Playfair Display (serif), Inter (body). No cambiar pesos, tamaños de escala ni comillas del texto de la autora.

## Iconos

- **Iconos de interfaz: siempre `lucide-react`.** Nada de SVG inline para controles (cerrar, zoom, flechas, play/pausa, etc.).
- Usar `nonScalingStroke` (la prop `absoluteStrokeWidth` está **deprecada** en lucide-react v1).
- Los iconos Lucide ya traen `aria-hidden="true"` por defecto; el nombre accesible va en el botón (`aria-label`), no en el icono.
- **Logos de marca** (Instagram, TikTok, WhatsApp): SVG propios en `src/components/icons/`. Lucide v1 eliminó los iconos de marca; mantener los componentes propios.

## Animaciones (Motion)

- Todo el movimiento respeta `prefers-reduced-motion`: la app ya monta `MotionConfig reducedMotion="user"` en `MotionProvider`.
- **No hardcodear valores de animación.** Usar `src/config/motion-tokens.ts` (escalas de tap/hover, springs sin rebote, transiciones `press`/`exit`, `staggerContainer`).
- Para animaciones de entrada usar el hook `useEnterVariants` — nunca duplicar variantes reducidas por componente.
- Nunca usar `style.transform` manual en componentes `motion.*`: anula las props `x`/`y`/`scale` de Motion. Posicionar con `x`/`y` de Motion.
- `animate={cond ? valor : {}}` está prohibido: el objeto vacío congela el estado. Siempre animar de vuelta a un estado base explícito.

## Accesibilidad

- Elementos clicables = `<button>` o `<a>` reales (también los `motion.*`). Nada de `div onClick`.
- Overlays = diálogos: `role="dialog"`, `aria-modal`, foco inicial, Escape, devolución del foco. Usar `useDialog` + `Portal` (los overlays viven fuera de `<main>` para que `inert` no los desactive).
- Texto pequeño con contraste mínimo 4.5:1 → usar `text-ink-secondary` (no `ink-tertiary`/`ink-muted` para contenido legible).
- Enlaces externos: `target="_blank" rel="noopener noreferrer"` + `<span class="sr-only">` indicando que abre en pestaña nueva.
- Contenido que se mueve solo (carrusel) debe tener control de pausa visible.

## React / Next.js

- **React Compiler está activo** (`reactCompiler: true` en `next.config.ts`): no añadir `useMemo`/`useCallback` salvo que el compilador no pueda con el caso (p. ej. callbacks usados en listeners de `document` → refs).
- Patrón de secciones: `XSection-server.tsx` (datos/estática) + `XSection-client.tsx` (interactiva).
- **Keys únicas entre hermanos**: dos elementos de listas distintas que se rendericen como hermanos en el mismo fragmento no pueden compartir key (causa de los warnings históricos `key={openCount}`). Prefijar (`image-overlay-${n}`, `dual-overlay-${n}`).
- Estado derivado se calcula en render, no con `useEffect` + `setState` (regla `react-hooks/set-state-in-effect` de ESLint).
- Componentes con `Math.random()` o contenido no determinista: `dynamic(..., { ssr: false })` (ver `DivineParticles`).

## Estado de la página

- Secciones activas en `page.tsx`: Hero, Sinopsis, Personajes, Mapa, Saga, Autora, Contacto, Footer, StickyCTA.
- **Comunidad y Testimonios permanecen comentadas** (componentes conservados por si se reactivan).
- Links centralizados en `src/config/links.ts` (Amazon, WhatsApp, redes). Nada de URLs hardcodeadas en componentes.

## Flujo de compra

- **Un solo CTA de compra**: `CTAButton` es un `<button>` que abre `CompraDialog` vía `useCompraDialog()` (`CompraDialogProvider` montado en `layout.tsx`). Nada de enlaces directos a Amazon/WhatsApp para comprar — todo pasa por el selector.
- `CompraDialog` reparte por geografía: **Venezuela → pedido por WhatsApp** (pago y entrega se coordinan por chat), **resto del mundo → Amazon**. Sigue el patrón de overlays: `useDialog` + `Portal`.
- Vocabulario: "pedir/comprar", nunca "reservar" — el libro ya está publicado y la UI dice "Ya disponible". El mensaje prellenado vive en `WHATSAPP_MESSAGE` (`links.ts`).

## Sección Mapa (scrollytelling) y overlays

- **Zoom inicial adaptativo**: `ZoomableOverlay` acepta `initialFill` (0–1) = fracción del marco que la imagen cubre al abrirse. Se calcula midiendo el marco y `naturalWidth`/`naturalHeight` de la imagen, se clampa a `[1, cover]` y se recalcula con `ResizeObserver` — nada de escalas fijas por mapa.
- **`overlayFill` por reino** en `realms-data.ts` afina el zoom inicial de cada mapa (Luz 0.95, Central 0.7; default 0.8).
- **El `header` de `ZoomableOverlay` se renderiza dentro del marco del mapa**: el pill del título cuelga del borde superior. Los controles de esquina (info de lore, «Ver ambos») van por `extraControls` en la capa externa del viewport.
- **Vista alterna del Reino Oscuro**: `realm.altView` (Mapa de Galaxias) — pill de vista en `RealmChapter`; alterna sola cada 7 s (`darkAltView`/`autoCycle` en el client) hasta que el usuario elige manual. La etiqueta del hotspot sigue la vista activa.
- **Navegación entre reinos**: `NavigationDots` solo en `lg+` (cápsula con nombre + tooltips por hover); en móvil `NavigationRail` (riel fino + chip transitorio del nombre ~2.6 s).
- **Deriva ambiental en reposo** (`AMBIENT_DRIFT` en `RealmChapter`): el mapa "respira" en loop infinito con identidad por reino (Luz asciende, Central mece; el Oscuro no lleva — ya flota el starfield). Escala mínima 1.03 y deriva ≤1% para no descubrir bordes. Va en un `motion.div` **hijo** del wrapper de Ken Burns: los transforms por scroll y el ambiental nunca comparten elemento.
- `CosmicDust` toma `variant` (`light`/`central`/`dark`): las motas ascienden en Luz, derivan con vaivén en Central y respiran en el sitio en Oscuro.
- Capítulos inactivos: solo `inert`, **sin `aria-hidden`** (si el foco quedó dentro al salir del capítulo, Chrome avisa «Blocked aria-hidden… descendant retained focus»).
- `GalaxyScene` (R3F): el `<Canvas>` lleva `pointer-events: none` explícito — R3F lo reactiva en su wrapper interno y bloquearía los hotspots.

## SEO y metadata

- Toda la metadata vive en `src/config/site.ts`: título ≤60 caracteres, descripción ~155, imagen OG dedicada `public/landing-book-victoria/og-image.jpg` (1200×630, ≤5 MB). No apuntar `og:image` a la portada cruda (pesa 5.9 MB y es vertical).
- Schema JSON-LD en `src/components/SchemaMarkup.tsx`: sin datos inventados (`aggregateRating` solo con reseñas reales, sin `SearchAction` — no hay página de búsqueda). `offers.url` usa el link de Amazon de `links.ts`.
- El sitemap lo genera `src/app/sitemap.ts` — **nunca** crear `public/sitemap.xml`.
- Dominio verificado en Search Console vía registro TXT en Spaceship.

## Assets de icono

- Iconos de pestaña con convención de Next.js App Router: `src/app/icon.svg` (glifos reales de Starlight Rune: V crema + Q dorada), `icon.png` (fallback 48px), `apple-icon.png` (180px). No restaurar `favicon.ico` de Vercel.
- Para regenerarlos se usó `opentype.js` (devDependency de tooling) + `sharp` — no importar opentype en código de la app.
- `og-image.jpg` se regenera con `sharp` componiendo la portada sobre el gradiente de marca.

## Verificación

Antes de dar por terminado un cambio:

```bash
npx tsc --noEmit    # tipos
npx eslint src      # lint
npm run build       # solo cuando se pida explícitamente
```

Notas de lint conocidas (preexistentes, no introducir más): comillas sin escapar en textos de la autora (`SobreAutoraSection`, `HeroTitle`, `TestimoniosSection`).

- PowerShell: separar comandos con `;`, no `&&`.
- **El shell del agente es Git Bash, no CMD.** Nunca usar sintaxis de CMD en redirecciones ni comandos:
  - `2>/dev/null`, **nunca** `2>nul` — esto crea un archivo literal llamado `nul` en el proyecto, nombre reservado de Windows que hace crashear Turbopack (`os error 1`, panic al escanear el directorio). Si aparece un archivo `nul`, borrarlo con `rm -f ./nul`.
  - Evitar también `dir`, `del` y demás builtin de CMD; usar `ls`, `rm`, `find` de bash.
- Si Next/Turbopack sirve CSS o módulos compilados obsoletos (errores que referencian código que ya no existe en `src/`), el problema es el artefacto persistido: detener el dev server y borrar `.next` **completo** (no solo `.next/cache`).
- No crear ramas ni commits salvo petición explícita.
- Los mensajes de commit van en español y **sin trailers de herramientas**: nada de `Generated with Devin`, `Co-Authored-By` ni menciones a agentes/IA. Mensaje limpio, estilo convencional del repo.

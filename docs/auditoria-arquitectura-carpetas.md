# Auditoría: Arquitectura de Organización de Carpetas

> Este documento propone una reestructuración de `@src/components` y el resto del proyecto. También analiza si **vale la pena mantener la separación Server/Client** en las secciones actuales.
>
> **Objetivo:** darte una base concreta para decidir si reorganizas ahora, de forma gradual, o si prefieres mantener la estructura actual.

---

## Estructura propuesta

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts          ← nuevo
│   └── robots.ts           ← nuevo
│
├── components/
│   ├── sections/
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroTitle.tsx
│   │   │   └── HeroBookMockup.tsx
│   │   │
│   │   ├── sinopsis/
│   │   │   ├── SinopsisSection.tsx
│   │   │   └── SinopsisContent.tsx
│   │   │
│   │   ├── personajes/
│   │   │   ├── PersonajesSection.tsx
│   │   │   └── PersonajesCarousel.tsx
│   │   │
│   │   ├── mapa/
│   │   │   ├── InteractiveMapSection.tsx
│   │   │   ├── RealmLevel.tsx
│   │   │   └── Hotspot.tsx
│   │   │
│   │   ├── autora/
│   │   │   ├── SobreAutoraSection.tsx
│   │   │   └── AutoraQuote.tsx
│   │   │
│   │   ├── comunidad/
│   │   │   └── ComunidadSection.tsx
│   │   │
│   │   ├── contacto/
│   │   │   └── ContactoSection.tsx
│   │   │
│   │   ├── testimonios/
│   │   │   └── TestimoniosSection.tsx
│   │   │
│   │   └── footer/
│   │       └── Footer.tsx
│   │
│   ├── overlays/
│   │   ├── ZoomableOverlay.tsx      ← base reutilizable (nuevo)
│   │   ├── GalaxyOverlay.tsx
│   │   ├── ImageOverlay.tsx
│   │   └── DualOverlay.tsx
│   │
│   ├── ui/
│   │   ├── CTAButton.tsx
│   │   ├── SectionLabel.tsx
│   │   ├── SocialLink.tsx
│   │   └── IconButton.tsx
│   │
│   └── icons/
│       └── InstagramIcon.tsx, TikTokIcon.tsx, WhatsAppIcon.tsx, ...
│
├── config/
│   ├── links.ts
│   ├── site.ts              ← metadata centralizada (nuevo)
│   └── realms-data.ts
│
├── data/
│   ├── libros.ts            ← catálogo de la saga (nuevo)
│   └── testimonios.ts       ← testimonios (nuevo)
│
├── hooks/
│   ├── useLockBodyScroll.ts
│   ├── useScrollSnap.ts
│   └── useTouchGestures.ts
│
├── lib/
│   ├── utils.ts             ← cn, helpers (nuevo)
│   └── overlay.ts           ← helpers de zoom/pan (nuevo)
│
└── types/
    ├── libro.ts
    ├── testimonio.ts
    └── red-social.ts
```

---

## Explicación por carpeta

### `components/sections/`

Agrupa cada bloque de la landing en una carpeta propia. Si una sección crece, sus subcomponentes viven junto a ella sin saturar la raíz de `@src/components`.

**Beneficio:** navegación rápida, responsabilidad clara.

### `components/overlays/`

Agrupa los tres modales de zoom (`GalaxyOverlay`, `ImageOverlay`, `DualOverlay`) y su base común `ZoomableOverlay`. Esto hace evidente que comparten responsabilidad.

**Beneficio:** facilita refactorizar el zoom/pan una sola vez y aplica a todos.

### `components/ui/`

Componentes atómicos reutilizables: botones, etiquetas de sección, links sociales, etc.

**Beneficio:** evita que `CTAButton.tsx` quede suelto en la raíz y permite crear un pequeño design system.

### `components/icons/`

Mantener los iconos SVG en su propia carpeta. Ya existe, así que solo hay que conservarla.

**Beneficio:** separación clara entre iconografía y componentes funcionales.

### `config/`

Datos de configuración global: URLs, metadata, redes, datos del universo.

**Beneficio:** un solo lugar para cambiar título, descripción, URLs de compra, etc.

### `data/`

Datos estáticos de contenido: libros de la saga, testimonios, posiblemente preguntas frecuentes.

**Beneficio:** separa "configuración" de "contenido". Facilita que luego un CMS o markdown reemplace estos archivos.

### `types/`

Interfaces compartidas que usan varios componentes o datos.

**Beneficio:** evita definir `Libro` en dos archivos distintos.

### `lib/`

Funciones utilitarias puras: formateo, clamp de zoom, helpers de posición, `cn` para clases.

**Beneficio:** lógica reusable y testable sin dependencias de React.

### `hooks/`

Ya existe y está bien. Solo mantener allí hooks reutilizables.

---

## ¿Vale la pena la separación Server/Client en las secciones?

### Regla general

| ¿Requiere interacción? | ¿Debería ser client? | ¿Justifica separar en server/client? |
|------------------------|----------------------|--------------------------------------|
| Animaciones, eventos, estado, DOM | Sí | Sí, si el server puede hacer trabajo previo (imagen, SEO) |
| Solo presentación estática | No | No, hazlo server directamente |

### Análisis por sección actual

#### `SinopsisSection` (`server` + `client`)
- **Server:** carga la imagen de portada con `next/image`.
- **Client:** anima el texto y botones con `motion`.
- **Veredicto:** **Sí vale la pena.** El server puede hacer el trabajo de optimización de imagen y el cliente maneja la interactividad.

#### `PersonajesSection` (`server` + `client`)
- **Server:** envoltorio con fondo.
- **Client:** carrusel con autoplay, estado y animaciones.
- **Veredicto:** **Sí vale la pena.** El carrusel es puramente cliente.

#### `InteractiveMapSection` (`server` + `client`)
- **Server:** define `libros` y pasa el título/descripción.
- **Client:** mapa completo, scroll snap, overlays, hotspots.
- **Veredicto:** **Sí vale la pena.** Es el componente más interactivo de la landing.

#### `SobreAutoraSection` (`server` + `client`)
- **Server:** envoltorio con fondo.
- **Client:** foto, biografía, quote, animaciones.
- **Veredicto:** **Podría consolidarse.** Si la sección es solo texto e imagen con animaciones `whileInView`, el envoltorio server aporta poco. Sin embargo, no perjudica.

#### `HeroSection` (cliente completo)
- **Client:** todo es animación y eventos.
- **Veredicto:** **Correcto.** No tiene sentido separar server/client aquí porque todo es interactivo. Podría dividirse en subcomponentes más pequeños, pero seguirían siendo client.

#### `ComunidadSection`, `ContactoSection`, `Footer` (cliente completo)
- **Client:** tarjetas con hover, animaciones, links.
- **Veredicto:** **Correcto.** Si usan `motion` para hover, deben ser client. Podrían convertirse en server si se eliminan las microanimaciones, pero no es necesario.

#### `TestimoniosSection` (cliente completo)
- **Client:** animaciones de scroll.
- **Veredicto:** **Correcto.**

### Conclusión sobre separación

**La separación Server/Client actual es correcta y vale la pena mantenerla.** No es overhead innecesario porque cada sección interactiva realmente necesita ser cliente. La única mejora es:

- **Consolidar** secciones donde el server aporta muy poco (por ejemplo, `SobreAutoraSection` podría ser un solo cliente).
- **Evitar** que un botón de scroll ancla fuerce todo un componente a ser cliente (ver hallazgo de `HeroSection`).

---

## Estrategias de migración

### Opción A: Migración completa de una vez
- **Repercusiones:** queda la estructura final inmediatamente. Todos los imports se actualizan en un solo commit.
- **Riesgo:** más grande, posible romper algo si no se prueba bien.

### Opción B: Migración por fases
1. Crear carpetas base y mover solo nuevos archivos.
2. Mover overlays y crear `ZoomableOverlay`.
3. Mover secciones una por una.
4. Extraer `data/` y `types/` al final.
- **Repercusiones:** menos riesgo, commits más pequeños y revisables.
- **Riesgo:** durante la transición conviven dos estructuras, lo que puede confundir.

### Opción C: Mantener la estructura actual y solo extraer `data/` y `types/`
- **Repercusiones:** mínimo cambio, pero resuelve los problemas de duplicación más urgentes.
- **Riesgo:** la raíz de `@src/components` sigue saturada y los overlays siguen duplicados.

**Recomendación provisional:** Opción B. Es la más segura y permite validar cada paso.

---

## Decisiones pendientes

| Tema | Pregunta para decidir |
|------|----------------------|
| Estructura de carpetas | ¿Aceptas la propuesta completa o prefieres una versión reducida? |
| Migración | ¿De una vez o por fases? |
| Server/Client | ¿Consolidar `SobreAutoraSection` o mantener la separación actual? |
| `data/` | ¿Creas `data/` para libros y testimonios, o los mantienes en `config/`? |
| `types/` | ¿Creas `types/` o compartes interfaces desde `data/`? |
| `ui/` | ¿Agrupas `CTAButton` y futuros componentes en `ui/`? |

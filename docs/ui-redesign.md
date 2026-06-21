# Rediseño UI

Documentación de las decisiones de diseño aplicadas en la auditoría y rediseño completo de la landing page.

---

## Contexto

El diseño original tenía bases correctas (paleta cálida, tipografía legible, estructura semántica) pero presentaba patrones genéricos que alejaban la experiencia del estándar premium buscado. El 90% del tráfico es móvil, por lo que toda decisión se tomó bajo enfoque **Mobile-First**.

La referencia visual es el estilo de productos como Linear, Vercel y Dynamic: contraste extremo, tipografía como elemento de diseño y micro-interacciones fluidas.

---

## Dirección elegida

**Dark Premium** — fondo oscuro `#080808`, tipografía crema `#f5f0e8`, acento único en terracota `#c97a50`.

Se eligió este camino sobre la alternativa cálida-editorial porque el contraste extremo genera mayor impacto en la primera impresión móvil. La terracota del libro original se preserva como acento para mantener la identidad de la autora dentro del lenguaje oscuro.

---

## Sistema de tokens (`globals.css`)

Se reemplazaron los valores hexadecimales hardcodeados por un sistema de CSS custom properties con nombres semánticos.

```css
--surface-base: #080808;
--surface-1: #0f0f0f;   /* secciones alternas */
--surface-2: #161616;
--surface-3: #1e1e1e;
--surface-4: #252525;   /* elevación máxima */

--ink-primary: #f5f0e8;
--ink-secondary: rgba(245, 240, 232, 0.65);
--ink-tertiary: rgba(245, 240, 232, 0.38);
--ink-muted: rgba(245, 240, 232, 0.22);

--accent: #c97a50;
--accent-dim: rgba(201, 122, 80, 0.15);
--accent-glow: rgba(201, 122, 80, 0.25);

--border-subtle: rgba(255, 255, 255, 0.06);
--border-default: rgba(255, 255, 255, 0.10);
--border-emphasis: rgba(255, 255, 255, 0.18);
```

**Por qué:** Los valores hardcodeados (`bg-[#c78565]`) hacen imposible cambiar la paleta en un solo lugar. Los tokens permiten iterar rápido y garantizan consistencia en todos los componentes.

La jerarquía de texto en 4 niveles (`primary → secondary → tertiary → muted`) refleja la importancia de cada elemento sin usar colores distintos, solo opacidades del mismo tono base.

---

## Tipografía

Se añadió **Syne** (700/800) como fuente display para títulos principales. Se conservó **Playfair Display** como serif para elementos editoriales y citas. **Inter** sigue siendo la fuente de cuerpo.

**Por qué:** Playfair Display es un serif conservador — correcto para texto largo pero sin impacto visual en headlines. Syne es ultra-geométrica y de peso extremo: en `font-black` sobre fondo oscuro genera la sensación de app nativa de alto presupuesto que busca el proyecto. La combinación Syne + Playfair crea un contraste tipográfico entre lo moderno y lo literario, apropiado para un libro de crecimiento personal.

Los tamaños de título usan `clamp()` para escalar fluidamente entre móvil y desktop sin breakpoints arbitrarios.

---

## Grain overlay

Se añadió un pseudo-elemento `body::before` con un SVG de ruido fractal como textura de fondo fija.

**Por qué:** Las superficies lisas a `#080808` puro se ven planas en pantallas OLED. El grain añade profundidad visual sin peso de archivo ni impacto en rendimiento. Es una técnica usada en Linear, Stripe y Arc.

---

## HeroSection

### Título con blur reveal
```tsx
initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
```

**Por qué:** El blur-to-clear en la entrada es la firma visual de productos premium como Linear. La curva `[0.16, 1, 0.3, 1]` es una easing de desaceleración extrema que da sensación de física natural, a diferencia de `ease-out` estándar que se siente robótico.

### Jerarquía de CTAs
El botón de Amazon es el **primario** (fondo sólido en acento, glow) y WhatsApp es el **secundario** (borde + superficie elevada).

**Por qué:** Cuando dos CTAs tienen el mismo peso visual, el usuario no sabe dónde hacer clic primero. La jerarquía visual guía la atención hacia la conversión más importante sin eliminar la opción secundaria.

### Sticky CTA móvil
Un botón fijo en el `bottom` aparece solo en pantallas `< lg` con una entrada via spring.

**Por qué:** En móvil el usuario hace scroll y pierde de vista los CTAs del Hero. El sticky bottom asegura que el call-to-action siempre esté disponible sin interrumpir la lectura, como lo hacen apps de e-commerce de alto rendimiento.

### Mockup del libro
Se reemplazó el placeholder con icono `BookOpen` por un mockup con lomo 3D CSS, perspectiva, gradiente oscuro cálido y animación float infinita via Motion.

**Por qué:** El mockup anterior comunicaba "trabajo sin terminar". El nuevo, aunque sea un placeholder, comunica la estructura real de un libro físico y ancla la identidad visual en algo tangible.

---

## SinopsisSection

### Pull quote editorial
Se añadió una cita grande en Playfair italic con línea lateral degradada en terracota.

**Por qué:** Una sección con solo párrafos de texto sobre fondo oscuro no tiene entidad visual propia. El pull quote crea una jerarquía de lectura: primero la frase impactante, luego los detalles en el grid de 3 columnas. Esta estructura es estándar en revistas literarias y editoriales premium.

### Grid numerado `01 / 02 / 03`
Los 3 párrafos se convirtieron en un grid con numeración monoespaciada como identificador.

**Por qué:** La numeración de estilo editorial (`01`, `02`) da estructura y permite al lector escanear el contenido rápidamente en móvil sin leer cada párrafo completo.

---

## SobreAutoraSection

### Orden corregido en móvil
La foto ahora aparece **primero** en móvil (sin `order-2`).

**Por qué:** La conexión emocional con la autora se establece visualmente antes que con texto. En el diseño original la foto aparecía después de la biografía en móvil, lo que era un error de UX — el usuario leía de quién se trataba antes de ver a la persona.

### Credenciales numéricas
Se añadieron tres métricas (`10+ años`, `500+ lectores`, `1er libro`) en Syne bold.

**Por qué:** Texto biográfico genérico no genera credibilidad por sí solo. Las métricas específicas anclan la autoridad de la autora en datos concretos y son más rápidas de leer en móvil que dos párrafos de prosa.

---

## TestimoniosSection

### Cards con avatares de inicial
Se añadió un avatar circular con la inicial del nombre y la ciudad del lector.

**Por qué:** Testimonios sin foto ni ubicación parecen inventados. La inicial + ciudad añade un nivel mínimo de credibilidad real y hace las tarjetas más humanas, sin necesidad de fotos reales.

### Marquee de palabras clave
Una franja horizontal con palabras clave del libro (`Transformación · Crecimiento Personal · ...`) se desplaza infinitamente debajo de las cards.

**Por qué:** Es una técnica visual de Linear y Godly para llenar el espacio en móvil de forma dinámica sin añadir contenido innecesario. Refuerza el vocabulario del libro y actúa como separador animado entre secciones.

---

## Footer

### Closing statement emocional
Se añadió un headline final: *"La vida que sueñas / empieza en una página."*

**Por qué:** El footer original repetía los mismos botones del Hero sin ningún cierre narrativo. En copywriting de ventas, el último elemento que ve el usuario antes de decidir es tan importante como el primero. El headline da un remate emocional que refuerza la propuesta de valor.

### Iconos de redes sociales con SVG inline
Se implementaron los iconos de redes como SVGs inline en lugar de usar la librería Lucide.

**Por qué:** `lucide-react` v1.21 no exporta `Instagram`, `Facebook` ni `Twitter` con esos nombres exactos. Los SVGs inline son la solución más directa, sin dependencias externas y sin overhead de bundle adicional.

---

## Uso de Motion

Todos los componentes usan `'use client'` e importan desde `motion/react`. Las animaciones siguen tres reglas:

1. **Entradas en el Hero** usan `animate` directo (se ejecutan al montar).
2. **Entradas en scroll** usan `whileInView` con `viewport: { once: true }` para que cada elemento anime solo la primera vez que aparece.
3. **Micro-interacciones** en botones usan `whileTap` y `whileHover` con springs (`type: 'spring', stiffness: 400, damping: 20`) para sensación táctil natural.

**Por qué springs:** Las curvas de easing CSS estándar tienen duración fija. Los springs calculan la animación basándose en física — si el usuario interrumpe el gesto, la animación responde. Esto es lo que diferencia la fluidez de iOS de una animación CSS normal.

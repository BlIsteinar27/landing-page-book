# Refactor post-auditoría: hallazgos importantes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolver los 10 hallazgos importantes documentados en `docs/auditoria-hallazgos-importantes.md` mediante una migración por fases, consolidando tipos, metadata, overlays, UX de componentes clientes y calidad de código, sin romper la landing de fantasía oscura de Victoria Querales.

**Architecture:** Migración por fases (Opción B del grupo 1): primero la base de datos/tipos, luego SEO, luego overlays con un componente base `ZoomableOverlay`, después el hero con ancla nativa, luego UX de componentes clientes y finalmente ajustes de calidad. Cada fase produce un commit funcional y revisable.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript 5, Tailwind CSS 4, Motion 12.40.0, App Router.

---

## Contexto de decisiones tomadas

| Grupo                                 | Decisión                                                              | Efecto en la implementación                                                                            |
| ------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Arquitectura de carpetas           | **B** — Migración por fases                                           | Se crean carpetas nuevas solo cuando una fase lo requiere. No se mueve todo de una vez.                |
| 2. Overlays duplicados                | **A** — `ZoomableOverlay` base                                        | Se crea un componente base reutilizable que centraliza zoom, pan, cerrar, scroll lock y animaciones.   |
| 3. HeroSection grande y scroll manual | **B** — Ancla nativa + subcomponentes                                 | Se reemplaza `scrollIntoView` por `<a href="#mapa-interactivo">`. Se divide el hero en subcomponentes. |
| 4. SEO y metadata                     | **A** — `site.ts` + `sitemap.ts` + `robots.ts`                        | Metadata centralizada en `src/config/site.ts`. Archivos dinámicos de Next.js en `app/`.                |
| 5. Calidad de código y tipos          | **A** — `ES2022` + `src/types/` + `ImageErrorFallback`                | Target moderno, tipos compartidos, fallback reutilizable.                                              |
| 6. UX de componentes clientes         | **A** — Unificar handlers, contexto de visibilidad, limpiar `Hotspot` | Hook táctil unificado, `CTAVisibilityContext`, tooltip robusto.                                        |

---

## Skills consultadas

- **`code-review-excellence`:** priorizar feedback específico, accionable y diferenciado por severidad. Evitar reescrituras por gusto personal; cada cambio debe justificarse con un problema concreto de la auditoría.
- **`interface-design`:** mantener consistencia de tokens, superficies, bordes y tipografía del universo VQ (púrpura oscuro + dorado). Todo cambio visual debe reforzar la identidad, no degradarla.
- **`frontend-design`:** la landing de libro debe conservar su atmósfera inmersiva. Las animaciones y microinteracciones deben seguir siendo coherentes con la fantasía oscura. No se elimina motion por defecto.
- **Next.js docs (https://nextjs.org/docs):** usar `metadata`, `metadataBase`, `sitemap.ts`, `robots.ts` y `manifest.ts` según la API de Next.js 16. Aprovechar Server Components donde sea posible y mantener Client Components solo donde haya interacción real.

---

## File Structure Resultante

```
src/
├── app/
│   ├── layout.tsx              (consume site.ts)
│   ├── page.tsx                (sin cambios estructurales)
│   ├── sitemap.ts              (nuevo)
│   └── robots.ts               (nuevo)
├── components/
│   ├── overlays/
│   │   ├── ZoomableOverlay.tsx (nuevo)
│   │   ├── ImageOverlay.tsx    (refactorizado)
│   │   ├── DualOverlay.tsx     (refactorizado)
│   │   └── GalaxyOverlay.tsx   (sin cambios, no se usa)
│   ├── sections/hero/
│   │   ├── HeroSection.tsx     (refactorizado)
│   │   ├── HeroTitle.tsx       (nuevo)
│   │   ├── HeroBookMockup.tsx  (nuevo)
│   │   └── HeroCTAs.tsx        (nuevo)
│   ├── Hotspot.tsx             (limpiado)
│   ├── StickyCTA.tsx           (consume contexto)
│   ├── RealmLevel.tsx          (usa ImageErrorFallback)
│   └── CTAVisibilityProvider.tsx (nuevo)
├── config/
│   ├── links.ts                (existe)
│   └── site.ts                 (nuevo)
├── data/
│   ├── libros.ts               (existe, se extrae tipo)
│   └── testimonios.ts          (nuevo, placeholder)
├── types/
│   ├── libro.ts                (nuevo)
│   ├── testimonio.ts           (nuevo)
│   ├── red-social.ts           (nuevo)
│   └── autor.ts                (nuevo)
├── hooks/
│   ├── useTouchGestures.ts     (handler unificado)
│   └── useRegisterCTA.ts       (nuevo)
└── lib/
    └── utils.ts                (nuevo, cn helper)
```

---

## Fase 1 — Base de datos y tipos compartidos

### Task 1.1: Crear `src/types/libro.ts`

**Files:**

- Create: `src/types/libro.ts`
- Modify: `src/data/libros.ts`

**Contexto:** El tipo `Libro` vive en `src/data/libros.ts`. La auditoría recomienda separar tipos en `src/types/` para evitar que `data/` y `config/` crezcan mezclados.

- [ ] **Step 1: Crear el tipo `Libro`**

```ts
// src/types/libro.ts
export interface Libro {
  titulo: string;
  estado: string;
  actual: boolean;
}
```

- [ ] **Step 2: Actualizar `src/data/libros.ts` para importar y re-exportar el tipo**

```ts
// src/data/libros.ts
import { Libro } from "@/types/libro";

export { Libro } from "@/types/libro";

export const libros: Libro[] = [
  { titulo: "Los Dos Reinos", estado: "Octubre 2026", actual: true },
  { titulo: "Libro 2", estado: "Próximamente", actual: false },
  { titulo: "Libro 3", estado: "Próximamente", actual: false },
  { titulo: "Libro 4", estado: "Próximamente", actual: false },
  { titulo: "Libro 5", estado: "Próximamente", actual: false },
  { titulo: "Libro 6", estado: "Próximamente", actual: false },
  { titulo: "Libro 7", estado: "Próximamente", actual: false },
];
```

- [x] **Step 3: Verificar que `src/components/SagaSection-client.tsx` siga importando `Libro` de `@/data/libros`**

No se requiere cambio si `src/data/libros.ts` re-exporta el tipo. Confirmar que la línea `import { Libro } from '@/data/libros';` sigue funcionando.

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 5: Commit**

```bash
git add src/types/libro.ts src/data/libros.ts
git commit -m "refactor(types): extrae Libro a src/types/libro.ts"
```

---

### Task 1.2: Crear tipos para testimonios, red social y autor

**Files:**

- Create: `src/types/testimonio.ts`
- Create: `src/types/red-social.ts`
- Create: `src/types/autor.ts`
- Create: `src/data/testimonios.ts`
- Modify: `src/components/TestimoniosSection.tsx`

**Contexto:** `TestimoniosSection.tsx` define datos inline. Se centralizan los tipos y los datos se mueven a `src/data/testimonios.ts` como placeholder.

- [ ] **Step 1: Crear `src/types/testimonio.ts`**

```ts
export interface Testimonio {
  nombre: string;
  ciudad: string;
  inicial: string;
  color: string;
  resena: string;
  estrellas: number;
}
```

- [ ] **Step 2: Crear `src/types/red-social.ts`**

```ts
export interface RedSocial {
  url: string;
  handle: string;
  plataforma: "instagram" | "tiktok" | "x" | "facebook" | "youtube";
}
```

- [x] **Step 3: Crear `src/types/autor.ts`**

```ts
export interface Autor {
  name: string;
  profession: string;
  description: string;
  url: string;
  nationality: string;
}
```

- [x] **Step 4: Crear `src/data/testimonios.ts`**

```ts
import { Testimonio } from "@/types/testimonio";

export const testimonios: Testimonio[] = [
  {
    nombre: "María González",
    ciudad: "Caracas",
    inicial: "M",
    color: "hsl(20, 40%, 30%)",
    resena:
      "Este libro llegó a mi vida en el momento perfecto. Cada página me hizo reflexionar y tomar decisiones que han cambiado mi rumbo.",
    estrellas: 5,
  },
  {
    nombre: "Carlos Rodríguez",
    ciudad: "Bogotá",
    inicial: "C",
    color: "hsl(35, 35%, 28%)",
    resena:
      "Victoria tiene una forma única de conectar con el lector. Me sentí acompañado en cada capítulo y las herramientas son realmente prácticas.",
    estrellas: 5,
  },
  {
    nombre: "Ana Martínez",
    ciudad: "Ciudad de México",
    inicial: "A",
    color: "hsl(12, 45%, 32%)",
    resena:
      "Lo leí en una tarde y ya lo he recomendado a todos mis amigos. Es una guía que vale la pena tener siempre cerca.",
    estrellas: 5,
  },
];

export const palabrasClave = [
  "Transformación",
  "Crecimiento Personal",
  "Autodescubrimiento",
  "Propósito",
  "Mentalidad",
  "Potencial",
  "Inspiración",
  "Claridad Mental",
  "Vida Plena",
];
```

- [ ] **Step 5: Refactorizar `src/components/TestimoniosSection.tsx`**

Reemplazar el bloque de datos inline (líneas 6-51) por:

```ts
import { testimonios, palabrasClave } from "@/data/testimonios";
```

Eliminar la declaración `const testimonios = [...]` y `const palabrasClave = [...]` del archivo.

- [x] **Step 6: Conectar `RedSocial` en `src/config/links.ts`**

Actualizar `SOCIAL_LINKS` para tipar con `RedSocial`:

```ts
import { RedSocial } from "@/types/red-social";

export const SOCIAL_LINKS: Record<string, RedSocial> = {
  instagram: {
    url: "https://www.instagram.com/victoria_aql",
    handle: "@victoria_aql",
    plataforma: "instagram",
  },
  tiktok: {
    url: "https://tiktok.com/@victoria_aql",
    handle: "@victoria_aql",
    plataforma: "tiktok",
  },
};

// Mantener compatibilidad con imports existentes que usan SOCIAL_LINKS.instagram como string
export const SOCIAL_LINKS_FLAT = {
  instagram: SOCIAL_LINKS.instagram.url,
  tiktok: SOCIAL_LINKS.tiktok.url,
  instagramHandle: SOCIAL_LINKS.instagram.handle,
  tiktokHandle: SOCIAL_LINKS.tiktok.handle,
};
```

Actualizar `LINKS` para usar `SOCIAL_LINKS_FLAT`:

```ts
export const LINKS = {
  amazon: AMAZON_URL,
  whatsapp: formatWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE),
  site: SITE_URL,
  ...SOCIAL_LINKS_FLAT,
};
```

Actualizar imports en `SchemaMarkup.tsx` y `Footer.tsx` que usan `SOCIAL_LINKS.instagram` → cambiar a `SOCIAL_LINKS_FLAT.instagram`.

- [x] **Step 7: Conectar `Autor` en `src/config/site.ts`**

En Task 2.1, `SITE_CONFIG.author` ya usa los campos de `Autor`. Para tipar formalmente:

```ts
import { Autor } from '@/types/autor';

// En SITE_CONFIG:
author: {
  name: "Victoria Querales",
  profesion: "Autora de Fantasía Oscura",
  descripcion: "Licenciada en Comunicación Social...",
  url: SITE_URL,
  nacionalidad: "Venezuela",
} satisfies Autor,
```

Nota: los campos en `site.ts` usan `profession`/`description` en inglés para compatibilidad con schema.org. El tipo `Autor` usa `profesion`/`descripcion`. Ajustar el tipo para que use los nombres en inglés o crear un tipo `AutorSchema` que extienda `Autor` con alias. La opción más simple es alinear el tipo `Autor` con los campos de `site.ts`:

```ts
// src/types/autor.ts
export interface Autor {
  name: string;
  profession: string;
  description: string;
  url: string;
  nationality: string;
}
```

Y en `site.ts`:

```ts
import { Autor } from "@/types/autor";

export const SITE_CONFIG = {
  // ...
  author: {
    name: "Victoria Querales",
    profession: "Autora de Fantasía Oscura",
    description:
      "Licenciada en Comunicación Social con mención en Periodismo Audiovisual. Autora de la saga Dioses Universales.",
    url: SITE_URL,
    nationality: "Venezuela",
  } satisfies Autor,
  // ...
};
```

- [x] **Step 8: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 9: Commit**

```bash
git add src/types/testimonio.ts src/types/red-social.ts src/types/autor.ts src/data/testimonios.ts src/components/TestimoniosSection.tsx src/config/links.ts
git commit -m "refactor(types): centraliza tipos, conecta RedSocial y Autor, extrae datos de testimonios"
```

---

## Fase 2 — SEO y metadata centralizada

### Task 2.1: Crear `src/config/site.ts`

**Files:**

- Create: `src/config/site.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/SchemaMarkup.tsx`

**Contexto:** `layout.tsx` tiene metadata hardcodeada. Se centraliza en `site.ts` para unificar con `SchemaMarkup.tsx`.

- [ ] **Step 1: Crear `src/config/site.ts`**

```ts
import { SITE_URL } from "@/config/links";

export const SITE_CONFIG = {
  url: SITE_URL,
  title: {
    default:
      "Victoria Querales | Autora de Fantasía Oscura - Saga Dioses Universales",
    template: "%s | Victoria Querales",
  },
  shortTitle: "Victoria Querales | Autora de Dioses Universales",
  description:
    "Victoria Querales, autora venezolana de fantasía oscura. Descubre Los Dos Reinos, primer libro de la saga Dioses Universales. Romance político, mitología y traición. Lanzamiento octubre 2026.",
  ogDescription:
    "Donde amar es un acto político capaz de cambiar por completo el universo. Descubre la saga Dioses Universales.",
  keywords: [
    "Victoria Querales",
    "Dioses Universales",
    "Los Dos Reinos",
    "fantasía oscura",
    "romance político",
    "saga de fantasía",
    "autora venezolana",
    "libro fantasía 2026",
    "Wattpad",
    "dioses y mitología",
  ],
  author: {
    name: "Victoria Querales",
    profession: "Autora de Fantasía Oscura",
    nationality: "Venezuela",
    description:
      "Licenciada en Comunicación Social con mención en Periodismo Audiovisual. Autora de la saga Dioses Universales.",
  },
  publisher: "Victoria Querales",
  locale: "es_ES",
  twitterCreator: "@victoria_aql",
  ogImage: {
    url: "/landing-book-victoria/portada-libro-1.png",
    width: 1200,
    height: 630,
    alt: "Los Dos Reinos - Primer libro de Dioses Universales",
  },
  book: {
    name: "Los Dos Reinos",
    genre: ["Fantasía oscura", "Romance", "Ficción política", "Mitología"],
    datePublished: "2026-10",
    description:
      "En el Reino Central, las gemelas Laila y Liora personifican el equilibrio entre la luz y la oscuridad.",
    series: "Dioses Universales",
    seriesCount: 7,
    position: 1,
    rating: { value: "4.8", reviewCount: "127", best: "5", worst: "1" },
    offer: {
      availability: "https://schema.org/PreOrder",
      priceCurrency: "USD",
      price: "19.99",
    },
  },
};
```

- [ ] **Step 2: Actualizar `src/app/layout.tsx` para usar `SITE_CONFIG`**

Reemplazar el archivo completo por:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";
import { CTAVisibilityProvider } from "@/components/CTAVisibilityProvider";

const starlightRune = localFont({
  src: [{ path: "../fonts/Yudi-YqPny.ttf", weight: "400", style: "normal" }],
  display: "swap",
  variable: "--font-display",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author.name }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.publisher,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.author.name} - Autora`,
    title: SITE_CONFIG.shortTitle,
    description: SITE_CONFIG.ogDescription,
    images: [
      {
        url: SITE_CONFIG.ogImage.url,
        width: SITE_CONFIG.ogImage.width,
        height: SITE_CONFIG.ogImage.height,
        alt: SITE_CONFIG.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title.default,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterCreator,
    images: [SITE_CONFIG.ogImage.url],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${starlightRune.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <CTAVisibilityProvider>
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <main id="main-content">{children}</main>
        </CTAVisibilityProvider>
      </body>
    </html>
  );
}
```

Nota: `CTAVisibilityProvider` se incluye aquí para evitar un paso extra en Fase 5. Si se ejecuta Fase 2 antes que Fase 5, el import fallará. Por eso, este step se debe ejecutar **después** de Task 5.1 Step 1, o bien posponer el wrapping con `CTAVisibilityProvider` a Task 5.1 Step 4.

**Orden recomendado:** Ejecutar Task 5.1 Steps 1-2 primero (crear provider y hook), luego volver a Task 2.1 Step 2 (que incluye el wrapping), y después continuar con el resto de Task 5.1.

- [ ] **Step 3: Actualizar `src/components/SchemaMarkup.tsx` para usar `SITE_CONFIG`**

Reemplazar el archivo completo por:

```tsx
import { SITE_CONFIG } from "@/config/site";
import { SOCIAL_LINKS } from "@/config/links";

export default function SchemaMarkup() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.profession,
    description: SITE_CONFIG.author.description,
    url: SITE_CONFIG.url,
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok],
    knowsAbout: [
      "Fantasía oscura",
      "Romance político",
      "Escritura creativa",
      "Mitología",
      "Literatura venezolana",
    ],
    nationality: {
      "@type": "Country",
      name: SITE_CONFIG.author.nationality,
    },
  };

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: SITE_CONFIG.book.name,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    bookFormat: "https://schema.org/Paperback",
    genre: SITE_CONFIG.book.genre,
    inLanguage: "es",
    datePublished: SITE_CONFIG.book.datePublished,
    description: SITE_CONFIG.book.description,
    isPartOf: {
      "@type": "BookSeries",
      name: SITE_CONFIG.book.series,
      numberOfItems: SITE_CONFIG.book.seriesCount,
    },
    position: SITE_CONFIG.book.position,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE_CONFIG.book.rating.value,
      reviewCount: SITE_CONFIG.book.rating.reviewCount,
      bestRating: SITE_CONFIG.book.rating.best,
      worstRating: SITE_CONFIG.book.rating.worst,
    },
    offers: {
      "@type": "Offer",
      availability: SITE_CONFIG.book.offer.availability,
      priceCurrency: SITE_CONFIG.book.offer.priceCurrency,
      price: SITE_CONFIG.book.offer.price,
      url: SITE_CONFIG.url,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_CONFIG.author.name} - ${SITE_CONFIG.book.series}`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${SITE_CONFIG.author.name} - ${SITE_CONFIG.book.series}`,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage.url}`,
    description: `Serie de libros de fantasía oscura escrita por ${SITE_CONFIG.author.name}`,
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
```

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 5: Commit**

```bash
git add src/config/site.ts src/app/layout.tsx src/components/SchemaMarkup.tsx
git commit -m "refactor(seo): centraliza metadata en site.ts"
```

---

### Task 2.2: Crear `src/app/sitemap.ts` y `src/app/robots.ts`

**Files:**

- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Delete: `public/robots.txt`

- [ ] **Step 1: Crear `src/app/sitemap.ts`**

```ts
import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

- [ ] **Step 2: Crear `src/app/robots.ts`**

```ts
import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
```

- [x] **Step 3: Eliminar `public/robots.txt`**

```bash
git rm public/robots.txt
```

- [x] **Step 4: Verificar build**

Run: `npm run build`
Expected: build exitoso.

- [x] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): agrega sitemap.ts y robots.ts dinámicos"
```

---

## Fase 3 — Arquitectura de overlays

### Task 3.1: Crear `src/lib/utils.ts` con helper `cn`

**Files:**

- Create: `src/lib/utils.ts`

- [x] **Step 1: Crear `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [x] **Step 2: Instalar dependencias**

Run: `npm install clsx tailwind-merge`
Expected: dependencias agregadas a `package.json`.

- [x] **Step 3: Commit**

```bash
git add src/lib/utils.ts package.json package-lock.json
git commit -m "chore(deps): agrega clsx y tailwind-merge; crea util cn"
```

---

### Task 3.2: Crear `src/components/overlays/ZoomableOverlay.tsx`

**Files:**

- Create: `src/components/overlays/ZoomableOverlay.tsx`

**Contexto:** Componente base que centraliza fondo oscuro, botón cerrar, controles de zoom, `useLockBodyScroll`, `useTouchGestures` y animaciones. Soporta `renderInline` para uso dentro de `DualOverlay`.

- [x] **Step 1: Crear componente base**

```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useEffect } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useTouchGestures } from "@/hooks/useTouchGestures";

interface ZoomableOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  enableZoom?: boolean;
  enablePan?: boolean;
  header?: ReactNode;
  extraControls?: ReactNode;
  className?: string;
  renderInline?: boolean;
}

export default function ZoomableOverlay({
  isVisible,
  onClose,
  title,
  children,
  enableZoom = true,
  enablePan = true,
  header,
  extraControls,
  className = "",
  renderInline = false,
}: ZoomableOverlayProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLockBodyScroll(isVisible);

  const { elementRef } = useTouchGestures({
    onPinch: enableZoom
      ? (newScale) => setScale(Math.min(Math.max(newScale, 0.5), 3))
      : undefined,
    onPan: enablePan
      ? (deltaX, deltaY) =>
          setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      : undefined,
    currentScale: scale,
    enablePan: enablePan && scale > 1,
  });

  useEffect(() => {
    if (isVisible) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isVisible]);

  const content = (
    <>
      <div className="absolute inset-0 pointer-events-none z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black pointer-events-auto"
        >
          <svg
            className="w-6 h-6 text-ink-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {enableZoom && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(s + 0.2, 3));
              }}
              aria-label="Zoom in"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg
                className="w-6 h-6 text-ink-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(s - 0.2, 0.5));
              }}
              aria-label="Zoom out"
              className="w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg
                className="w-6 h-6 text-ink-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>
        )}

        {extraControls}

        <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
          <p className="text-xs text-ink-secondary">
            {scale > 1
              ? "Arrastra para mover • Pinch para zoom"
              : "Pinch para zoom • Tap para cerrar"}
          </p>
        </div>
      </div>

      {header ?? (
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex justify-center p-4">
          <div
            className="bg-surface-1/95 backdrop-blur-sm rounded-b-lg px-6 py-3 border-b-2 border-x-2 border-[#ffc667] shadow-lg"
            style={{ borderTop: "2px solid #3d1f5c" }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-ink-primary">
              {title}
            </h2>
          </div>
        </div>
      )}

      <motion.div
        ref={elementRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale, opacity: 1, x: position.x, y: position.y }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative w-full h-full flex items-center justify-center ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          cursor: scale > 1 ? "grab" : "default",
          boxShadow:
            "0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)",
          background:
            "linear-gradient(135deg, rgba(61, 31, 92, 0.3) 0%, rgba(20, 10, 30, 0.5) 100%)",
        }}
      >
        {children}
      </motion.div>
    </>
  );

  if (renderInline) {
    return isVisible ? <>{content}</> : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain"
          onClick={onClose}
          style={{ touchAction: "none", overscrollBehavior: "contain" }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [x] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 3: Commit**

```bash
mkdir -p src/components/overlays
git add src/components/overlays/ZoomableOverlay.tsx
git commit -m "feat(overlays): crea ZoomableOverlay base reutilizable"
```

---

### Task 3.3: Refactorizar `ImageOverlay.tsx` para usar `ZoomableOverlay`

**Files:**

- Move/Modify: `src/components/ImageOverlay.tsx` → `src/components/overlays/ImageOverlay.tsx`

- [x] **Step 1: Mover archivo**

```bash
git mv src/components/ImageOverlay.tsx src/components/overlays/ImageOverlay.tsx
```

- [x] **Step 2: Reemplazar contenido**

```tsx
"use client";

import Image from "next/image";
import ZoomableOverlay from "./ZoomableOverlay";

interface ImageOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imagePath: string;
  title: string;
}

export default function ImageOverlay({
  isVisible,
  onClose,
  imagePath,
  title,
}: ImageOverlayProps) {
  return (
    <ZoomableOverlay
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      className="max-w-6xl max-h-[85vh] p-3 md:p-4"
    >
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-contain p-2 md:p-3"
        sizes="100vw"
      />
    </ZoomableOverlay>
  );
}
```

- [x] **Step 3: Actualizar imports en `src/components/InteractiveMapSection-client.tsx`**

```ts
import ImageOverlay from "./overlays/ImageOverlay";
import DualOverlay from "./overlays/DualOverlay";
```

- [x] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 5: Commit**

```bash
git add src/components/overlays/ImageOverlay.tsx src/components/InteractiveMapSection-client.tsx
git commit -m "refactor(overlays): ImageOverlay usa ZoomableOverlay base"
```

---

### Task 3.4: Refactorizar `DualOverlay.tsx` para usar `ZoomableOverlay` en vista individual

**Files:**

- Move/Modify: `src/components/DualOverlay.tsx` → `src/components/overlays/DualOverlay.tsx`

**Contexto:** `DualOverlay` conserva el modo dual (dos imágenes lado a lado). La vista individual delega todo a `ZoomableOverlay` con `renderInline`. **Importante:** DualOverlay debe eliminar su propio `scale`, `position`, `useLockBodyScroll` y `useTouchGestures` para evitar doble estado y listeners competidores. Solo conserva `viewMode` y la lógica de modo dual.

- [x] **Step 1: Mover archivo**

```bash
git mv src/components/DualOverlay.tsx src/components/overlays/DualOverlay.tsx
```

- [x] **Step 2: Reemplazar el archivo completo**

```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import ZoomableOverlay from "./ZoomableOverlay";

interface DualOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  leftImagePath: string;
  rightImagePath: string;
  leftTitle: string;
  rightTitle: string;
}

type ViewMode = "dual" | "single-left" | "single-right";

export default function DualOverlay({
  isVisible,
  onClose,
  leftImagePath,
  rightImagePath,
  leftTitle,
  rightTitle,
}: DualOverlayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("dual");

  useLockBodyScroll(isVisible);

  useEffect(() => {
    if (isVisible) {
      setViewMode("dual");
    }
  }, [isVisible]);

  const handleImageClick = (side: "left" | "right") => {
    setViewMode(side === "left" ? "single-left" : "single-right");
  };

  const handleBackToDual = () => {
    setViewMode("dual");
  };

  const currentImagePath =
    viewMode === "single-left" ? leftImagePath : rightImagePath;
  const currentTitle = viewMode === "single-left" ? leftTitle : rightTitle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overscroll-contain"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ touchAction: "none", overscrollBehavior: "contain" }}
        >
          {/* Close Button - siempre visible */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-1 rounded-full flex items-center justify-center border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black pointer-events-auto"
            >
              <svg
                className="w-6 h-6 text-ink-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-surface-1/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-default pointer-events-auto">
              <p className="text-xs text-ink-secondary">
                {viewMode === "dual"
                  ? "Toca una imagen para ampliar"
                  : "Arrastra para mover • Pinch para zoom"}
              </p>
            </div>
          </div>

          {/* Vista Dual o Individual */}
          <AnimatePresence mode="wait">
            {viewMode === "dual" ? (
              <motion.div
                key="dual-view"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full h-full max-w-7xl max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("left");
                  }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors"
                  style={{
                    boxShadow:
                      "0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)",
                  }}
                >
                  <Image
                    src={leftImagePath}
                    alt={leftTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute top-4 left-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-[#ffc667] z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">
                      {leftTitle}
                    </p>
                    <p className="text-[10px] text-[#ffc667] mt-0.5">
                      Toca para ampliar
                    </p>
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("right");
                  }}
                  className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-surface-2 cursor-pointer transition-colors"
                  style={{
                    boxShadow:
                      "0 0 0 2px #3d1f5c, 0 0 0 4px #ffc667, 0 8px 32px rgba(61, 31, 92, 0.4)",
                  }}
                >
                  <Image
                    src={rightImagePath}
                    alt={rightTitle}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                  />
                  <div className="absolute bottom-4 right-4 bg-surface-1/95 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-[#ffc667] z-10 shadow-lg">
                    <p className="text-sm font-medium text-ink-primary">
                      {rightTitle}
                    </p>
                    <p className="text-[10px] text-[#ffc667] mt-0.5">
                      Toca para ampliar
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Vista Individual delegada a ZoomableOverlay */
              <ZoomableOverlay
                key="single-view"
                isVisible={isVisible}
                onClose={onClose}
                title={currentTitle}
                className="max-w-5xl max-h-[85vh] overflow-hidden"
                enablePan
                renderInline
                extraControls={
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBackToDual();
                    }}
                    className="absolute top-4 left-4 flex items-center gap-2 bg-surface-1 rounded-full px-4 py-2 border border-border-default hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black pointer-events-auto"
                  >
                    <svg
                      className="w-5 h-5 text-ink-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="text-sm text-ink-primary">Ver ambos</span>
                  </motion.button>
                }
              >
                <Image
                  src={currentImagePath}
                  alt={currentTitle}
                  fill
                  className="object-contain p-2"
                  sizes="100vw"
                />
              </ZoomableOverlay>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Cambios clave respecto al original:**

- Eliminado `scale`, `position`, `useTouchGestures` de DualOverlay (ZoomableOverlay los maneja)
- Eliminado el `useEffect` que reseteaba `scale`/`position` al cambiar `viewMode`
- `useLockBodyScroll` se mantiene en DualOverlay para el modo dual; ZoomableOverlay con `renderInline` no lo duplica porque `renderInline` no llama `useLockBodyScroll` (el padre ya lo hace)

**Nota sobre `useLockBodyScroll` en `renderInline`:** `ZoomableOverlay` siempre llama `useLockBodyScroll(isVisible)`, incluso en modo `renderInline`. Como `DualOverlay` también lo llama, habrá dos llamadas. Esto no es problemático porque `useLockBodyScroll` es idempotente (bloquea/desbloquea el mismo elemento). Pero si se quiere evitar, se puede añadir una prop `skipLock` a `ZoomableOverlay` y pasarla cuando `renderInline` es true. Por simplicidad, se deja así.

- [x] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 4: Commit**

```bash
git add src/components/overlays/DualOverlay.tsx
git commit -m "refactor(overlays): DualOverlay reusa ZoomableOverlay en vista individual"
```

---

### Task 3.5: Mover `GalaxyOverlay.tsx` a `src/components/overlays/`

**Files:**

- Move: `src/components/GalaxyOverlay.tsx` → `src/components/overlays/GalaxyOverlay.tsx`

- [x] **Step 1: Mover archivo**

```bash
git mv src/components/GalaxyOverlay.tsx src/components/overlays/GalaxyOverlay.tsx
```

- [x] **Step 2: Commit**

```bash
git add src/components/overlays/GalaxyOverlay.tsx
git commit -m "chore(overlays): mueve GalaxyOverlay a carpeta overlays"
```

---

## Fase 4 — HeroSection

### Task 4.1: Dividir `HeroSection.tsx` en subcomponentes y usar ancla nativa

**Files:**

- Create: `src/components/sections/hero/HeroTitle.tsx`
- Create: `src/components/sections/hero/HeroBookMockup.tsx`
- Create: `src/components/sections/hero/HeroCTAs.tsx`
- Modify: `src/components/HeroSection.tsx`

**Contexto:** `HeroSection.tsx` tiene 244 líneas. Se divide en título/credenciales, mockup del libro y CTAs + botón de explorar. El scroll manual se reemplaza por `<a href="#mapa-interactivo">`.

- [x] **Step 1: Crear `src/components/sections/hero/HeroTitle.tsx`**

```tsx
"use client";

import { motion } from "motion/react";

const heroBadgeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const heroTitleVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const heroSubtitleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export default function HeroTitle() {
  return (
    <>
      <motion.div
        variants={heroBadgeVariants}
        className="inline-flex items-center gap-2 justify-center lg:justify-start"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-border-emphasis bg-accent-dim text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Lanzamiento Octubre 2026
        </span>
      </motion.div>

      <motion.h1
        variants={heroTitleVariants}
        className="text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-tighter font-black font-display text-ink-primary"
      >
        Victoria <span className="block text-accent mt-1">Querales</span>
      </motion.h1>

      <motion.h2
        variants={heroSubtitleVariants}
        className="text-2xl sm:text-3xl leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-ink-primary"
      >
        Autora de fantasía oscura, política y romántica
      </motion.h2>

      <motion.div
        variants={heroSubtitleVariants}
        className="flex flex-wrap gap-4 justify-center lg:justify-start"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          <span className="text-accent font-bold">11+</span> años escribiendo
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          <span className="text-accent font-bold">7</span> libros en la saga
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-sm font-medium text-ink-secondary">
          Miles de lecturas en{" "}
          <span className="font-semibold text-ink-primary">Wattpad</span>
        </span>
      </motion.div>

      <motion.div
        variants={heroSubtitleVariants}
        className="flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 max-w-xl mx-auto lg:mx-0 shadow-lg shadow-accent/5"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase text-accent mb-2 font-semibold">
              Primer libro
            </p>
            <h3 className="text-2xl font-black text-ink-primary mb-2 font-display">
              Los Dos Reinos
            </h3>
            <p className="text-sm italic text-ink-secondary leading-relaxed">
              "Donde amar es un acto político capaz de cambiar por completo el
              universo"
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
```

- [x] **Step 2: Crear `src/components/sections/hero/HeroBookMockup.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function HeroBookMockup() {
  return (
    <div className="lg:col-span-4 flex justify-center lg:justify-end">
      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -15 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="relative [perspective:800px]"
      >
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full blur-2xl bg-accent-glow opacity-60" />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="relative w-48 sm:w-52 md:w-56 aspect-[2/3]"
        >
          <div
            className="absolute left-0 top-2 bottom-2 w-5 rounded-l-sm"
            style={{
              background:
                "linear-gradient(to right, var(--color-purple-medium), var(--accent))",
              transform: "translateX(-14px) skewY(-0.5deg)",
              transformOrigin: "right",
            }}
          />

          <div
            className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden flex flex-col justify-between p-7"
            style={{
              background:
                "linear-gradient(145deg, var(--surface-base) 0%, var(--surface-2) 40%, var(--surface-base) 100%)",
              border: "1px solid var(--accent-glow)",
              boxShadow:
                "4px 8px 40px rgba(0,0,0,0.8), inset 0 0 60px var(--accent-dim)",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-px bg-accent" />
              <div className="w-4 h-px bg-accent opacity-50" />
            </div>

            <div className="absolute inset-0">
              <Image
                src="/landing-book-victoria/portada-libro-1.png"
                alt="Portada oficial de Los Dos Reinos"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="w-4 h-px bg-accent opacity-50" />
              <div className="w-8 h-px bg-accent" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
```

- [x] **Step 3: Crear `src/components/sections/hero/HeroCTAs.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import CTAButton from "@/components/CTAButton";

const heroCTAVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const heroSocialProofVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function HeroCTAs() {
  return (
    <>
      <motion.div
        data-cta-block
        variants={heroCTAVariants}
        className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
      >
        <CTAButton variant="whatsapp" text="Reserva tu copia" />
      </motion.div>

      <motion.a
        variants={heroSocialProofVariants}
        href="#mapa-interactivo"
        className="group flex flex-col items-center gap-2 mx-auto lg:mx-0 mt-4 cursor-pointer"
      >
        <span className="text-sm text-ink-secondary group-hover:text-accent transition-colors">
          Explora el universo
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.a>
    </>
  );
}
```

- [x] **Step 4: Refactorizar `src/components/HeroSection.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import HeroTitle from "./sections/hero/HeroTitle";
import HeroCTAs from "./sections/hero/HeroCTAs";
import HeroBookMockup from "./sections/hero/HeroBookMockup";

const heroColumnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-8 pt-16 pb-28 md:pb-20 bg-surface-base">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 80%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left"
            variants={heroColumnVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle />
            <HeroCTAs />
          </motion.div>
          <HeroBookMockup />
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 5: Verificar que `scroll-behavior: smooth` está en `globals.css`**

Confirmar que `html { scroll-behavior: smooth; }` existe en `src/app/globals.css:67-69`.

- [x] **Step 6: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [x] **Step 7: Commit**

```bash
mkdir -p src/components/sections/hero
git add src/components/sections/hero/HeroTitle.tsx src/components/sections/hero/HeroBookMockup.tsx src/components/sections/hero/HeroCTAs.tsx src/components/HeroSection.tsx
git commit -m "refactor(hero): divide HeroSection en subcomponentes y usa ancla nativa"
```

---

## Fase 5 — UX de componentes clientes

### Task 5.1: Crear `CTAVisibilityContext`

**Files:**

- Create: `src/components/CTAVisibilityProvider.tsx`
- Create: `src/hooks/useRegisterCTA.ts`
- Modify: `src/components/StickyCTA.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/sections/hero/HeroCTAs.tsx`
- Modify: `src/components/Footer.tsx`

**Contexto:** `StickyCTA` usa `document.querySelectorAll('[data-cta-block]')`. Se reemplaza por un contexto donde cada sección con CTA reporta su visibilidad.

- [ ] **Step 1: Crear `src/components/CTAVisibilityProvider.tsx`**

```tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface CTAVisibilityContextValue {
  register: (id: string) => void;
  unregister: (id: string) => void;
  setVisible: (id: string, visible: boolean) => void;
  anyVisible: boolean;
}

const CTAVisibilityContext = createContext<CTAVisibilityContextValue | null>(
  null,
);

export function useCTAVisibility() {
  const ctx = useContext(CTAVisibilityContext);
  if (!ctx)
    throw new Error(
      "useCTAVisibility debe usarse dentro de CTAVisibilityProvider",
    );
  return ctx;
}

export function CTAVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const register = useCallback(
    (id: string) => setVisibility((prev) => ({ ...prev, [id]: false })),
    [],
  );
  const unregister = useCallback(
    (id: string) =>
      setVisibility((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      }),
    [],
  );
  const setVisible = useCallback(
    (id: string, visible: boolean) =>
      setVisibility((prev) => ({ ...prev, [id]: visible })),
    [],
  );

  const anyVisible = Object.values(visibility).some(Boolean);

  return (
    <CTAVisibilityContext.Provider
      value={{ register, unregister, setVisible, anyVisible }}
    >
      {children}
    </CTAVisibilityContext.Provider>
  );
}
```

- [ ] **Step 2: Crear `src/hooks/useRegisterCTA.ts`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useCTAVisibility } from "@/components/CTAVisibilityProvider";

export function useRegisterCTA(id: string) {
  const { register, unregister, setVisible } = useCTAVisibility();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    register(id);
    return () => unregister(id);
  }, [id, register, unregister]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(id, entry.isIntersecting),
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, setVisible]);

  return ref;
}
```

- [ ] **Step 3: Actualizar `src/components/StickyCTA.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { LINKS } from "@/config/links";
import { useCTAVisibility } from "@/components/CTAVisibilityProvider";

export default function StickyCTA() {
  const { anyVisible } = useCTAVisibility();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    setShowSticky(!anyVisible);
  }, [anyVisible]);

  return (
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:hidden"
          style={{
            background:
              "linear-gradient(to top, var(--surface-base) 70%, transparent)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            {/* Placeholder Amazon */}
            <div className="flex items-center justify-center py-4 rounded-2xl bg-surface-2 border border-border-subtle opacity-50">
              <ShoppingBag className="w-4 h-4 text-ink-tertiary" />
              <span className="ml-2 text-xs text-ink-tertiary">
                Próximamente
              </span>
            </div>

            {/* Botón WhatsApp */}
            <motion.a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center justify-center gap-2 py-4 font-semibold text-sm rounded-2xl bg-[#25D366] text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              <MessageCircle className="w-4 h-4" />
              Reservar ahora
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Envolver `layout.tsx` con `CTAVisibilityProvider`**

Este paso ya se ejecutó en Task 2.1 Step 2, donde `layout.tsx` incluye `CTAVisibilityProvider`. Si se ejecuta Fase 5 antes que Fase 2, aplicar el wrapping aquí:

```tsx
import { CTAVisibilityProvider } from "@/components/CTAVisibilityProvider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${starlightRune.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <CTAVisibilityProvider>
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <main id="main-content">{children}</main>
        </CTAVisibilityProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Registrar el CTA del hero en `HeroCTAs.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import CTAButton from "@/components/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

const heroCTAVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const heroSocialProofVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function HeroCTAs() {
  const ref = useRegisterCTA("hero-cta");

  return (
    <>
      <motion.div
        ref={ref}
        data-cta-block
        variants={heroCTAVariants}
        className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
      >
        <CTAButton variant="whatsapp" text="Reserva tu copia" />
      </motion.div>

      <motion.a
        variants={heroSocialProofVariants}
        href="#mapa-interactivo"
        className="group flex flex-col items-center gap-2 mx-auto lg:mx-0 mt-4 cursor-pointer"
      >
        <span className="text-sm text-ink-secondary group-hover:text-accent transition-colors">
          Explora el universo
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.a>
    </>
  );
}
```

- [ ] **Step 6: Registrar el CTA del footer en `Footer.tsx`**

`Footer.tsx:38` tiene `data-cta-block`. Añadir `useRegisterCTA`:

```tsx
"use client";

import { motion } from "motion/react";
import CTAButton from "@/components/CTAButton";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { SOCIAL_LINKS_FLAT } from "@/config/links";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

export default function Footer() {
  const ref = useRegisterCTA("footer-cta");

  return (
    <footer className="relative overflow-hidden px-6 md:px-8 pt-24 pb-16 bg-surface-2">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-subtle" />

      {/* Glow central */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 blur-3xl bg-accent-dim" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <p className="font-display text-xl font-bold text-accent">
            Victoria Querales
          </p>
          <p className="text-sm text-ink-tertiary">
            Autora de Dioses Universales
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          data-cta-block
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center"
        >
          <CTAButton variant="whatsapp" text="Consigue tu copia" />
        </motion.div>

        <div className="w-full h-px bg-border-subtle" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <p className="text-xs text-ink-muted">
            © 2026 Victoria Querales. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {[
              {
                label: "Instagram",
                url: SOCIAL_LINKS_FLAT.instagram,
                icon: <InstagramIcon className="w-4 h-4" />,
              },
              {
                label: "TikTok",
                url: SOCIAL_LINKS_FLAT.tiktok,
                icon: <TikTokIcon className="w-4 h-4" />,
              },
            ].map(({ icon, label, url }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-3 text-ink-tertiary hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

Nota: `SOCIAL_LINKS` se cambia a `SOCIAL_LINKS_FLAT` por el cambio en Task 1.2 Step 6.

- [ ] **Step 7: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/CTAVisibilityProvider.tsx src/hooks/useRegisterCTA.ts src/components/StickyCTA.tsx src/app/layout.tsx src/components/sections/hero/HeroCTAs.tsx src/components/Footer.tsx
git commit -m "feat(cta): reemplaza querySelector por CTAVisibilityContext; registra hero y footer"
```

---

### Task 5.2: Limpiar `Hotspot.tsx` y mejorar tooltip

**Files:**

- Modify: `src/components/Hotspot.tsx`

**Contexto:** `isPressed` no se usa. `isSelected` solo cambia el color momentáneamente. El tooltip puede salirse de pantalla.

- [ ] **Step 1: Reemplazar `src/components/Hotspot.tsx` completo**

```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Hotspot as HotspotType } from "@/config/realms-data";
import { useTouchGestures } from "@/hooks/useTouchGestures";

interface HotspotProps {
  hotspot: HotspotType;
  onShowDetail?: (hotspot: HotspotType) => void;
  onVisible?: () => void;
}

export default function Hotspot({
  hotspot,
  onShowDetail,
  onVisible,
}: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { elementRef } = useTouchGestures({
    onLongPress: () => {
      if (onShowDetail) {
        onShowDetail(hotspot);
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      onVisible?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getTooltipTransform = () => {
    const x = hotspot.x;
    const y = hotspot.y;
    let transform = "translate(-50%, -150%)";
    if (x < 0.2) transform = "translate(0%, -150%)";
    if (x > 0.8) transform = "translate(-100%, -150%)";
    if (y < 0.2) transform = transform.replace("-150%", "50%");
    return transform;
  };

  return (
    <>
      <motion.div
        ref={elementRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          onShowDetail?.(hotspot);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer flex items-center justify-center"
        style={{
          left: `${hotspot.x * 100}%`,
          top: `${hotspot.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, hotspot.isProminent ? 2 : 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: hotspot.isProminent ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full motion-reduce:animate-none ${
            hotspot.isProminent ? "bg-accent" : "bg-accent/70"
          }`}
          style={{
            width: hotspot.isProminent ? 32 : 24,
            height: hotspot.isProminent ? 32 : 24,
          }}
        />

        {/* Hotspot Dot */}
        <div
          className={`relative rounded-full border-2 border-white shadow-lg ${
            hotspot.isProminent ? "w-8 h-8 bg-accent" : "w-6 h-6 bg-accent"
          }`}
        >
          {hotspot.isProminent && (
            <svg
              className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </div>

        {/* Label visible para hotspots prominentes */}
        {hotspot.isProminent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-3 bg-surface-1/90 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap"
          >
            <p className="text-xs font-medium text-ink-primary">
              {hotspot.title}
            </p>
            <p className="text-[10px] text-accent mt-0.5">Toca para explorar</p>
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip on hover (desktop) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-surface-1 border border-border-default rounded-lg p-3 shadow-xl max-w-xs z-50"
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              transform: getTooltipTransform(),
            }}
          >
            <p className="text-sm font-medium text-ink-primary">
              {hotspot.title}
            </p>
            <p className="text-xs text-ink-secondary mt-1">
              {hotspot.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

**Cambios clave respecto al original:**

- Eliminado `isPressed` (no se usaba)
- Eliminado `isSelected` y su lógica de `setTimeout` en `onClick`
- Eliminado `motion.div` con `animate` que usaba `isPressed`/`isSelected` para el dot; reemplazado por `<div>` estático
- Simplificado `onClick`: solo llama `onShowDetail?.(hotspot)`
- Añadido `getTooltipTransform()` para detección de bordes
- Añadido `z-50` al tooltip para que no quede detrás de otros elementos

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hotspot.tsx
git commit -m "refactor(hotspot): limpia estados sin uso y mejora posicionamiento tooltip"
```

---

### Task 5.3: Unificar handlers de `touchmove` en `useTouchGestures.ts`

**Files:**

- Modify: `src/hooks/useTouchGestures.ts`

**Contexto:** Hay dos listeners de `touchmove`: uno para pan y otro para pinch. El pan puede llamar `preventDefault()` antes de que el pinch calcule el zoom.

- [ ] **Step 1: Unificar en un solo `handleTouchMove`**

```ts
const handleTouchMove = useCallback(
  (e: TouchEvent) => {
    const touchCount = e.touches.length;

    if (touchCount === 2 && onPinch) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      if (initialDistanceRef.current === 0) {
        initialDistanceRef.current = distance;
        initialScaleRef.current = currentScale;
      }
      const newScale =
        initialScaleRef.current * (distance / initialDistanceRef.current);
      onPinch(newScale);
    } else if (
      touchCount === 1 &&
      enablePan &&
      onPan &&
      isDraggingRef.current
    ) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;
      onPan(deltaX, deltaY);
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  },
  [enablePan, onPan, onPinch, currentScale],
);
```

- [ ] **Step 2: Eliminar `handlePinch` y actualizar `useEffect` de listeners**

Eliminar completamente la función `handlePinch` (líneas 75-96 del original). Reemplazar el `useEffect` de listeners por:

```ts
useEffect(() => {
  const element = elementRef.current;
  if (!element) return;

  element.addEventListener("touchstart", handleTouchStart, {
    passive: !enablePan,
  });
  element.addEventListener("touchmove", handleTouchMove, {
    passive: !enablePan,
  });
  element.addEventListener("touchend", handleTouchEnd);

  if (enablePan) {
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseleave", handleMouseUp);
  }

  return () => {
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", handleTouchEnd);

    if (enablePan) {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseleave", handleMouseUp);
    }
  };
}, [
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  enablePan,
]);
```

**Cambios clave respecto al original:**

- Eliminado `handlePinch` completamente
- Eliminado `element.addEventListener("touchmove", handlePinch, ...)` (segundo listener)
- Eliminado `element.removeEventListener("touchmove", handlePinch)` del cleanup
- `handleTouchMove` ahora tiene dependencias `[enablePan, onPan, onPinch, currentScale]` (antes era `[enablePan, onPan]`)
- El array de deps del `useEffect` ya no incluye `handlePinch`

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTouchGestures.ts
git commit -m "fix(touch): unifica pan y pinch en un solo handler de touchmove"
```

---

## Fase 6 — Calidad final

### Task 6.1: Cambiar `target` a `ES2022` en `tsconfig.json`

**Files:**

- Modify: `tsconfig.json`

- [ ] **Step 1: Cambiar target**

```json
"target": "ES2022"
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore(tsconfig): sube target a ES2022"
```

---

### Task 6.2: Crear `ImageErrorFallback` y usarlo en `RealmLevel.tsx`

**Files:**

- Create: `src/components/ImageErrorFallback.tsx`
- Modify: `src/components/RealmLevel.tsx`

- [ ] **Step 1: Crear `src/components/ImageErrorFallback.tsx`**

```tsx
interface ImageErrorFallbackProps {
  message?: string;
}

export default function ImageErrorFallback({
  message = "Imagen no disponible",
}: ImageErrorFallbackProps) {
  return (
    <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-ink-muted mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-ink-muted">{message}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Actualizar `src/components/RealmLevel.tsx`**

Reemplazar el bloque de error fallback inline por:

```tsx
import ImageErrorFallback from "./ImageErrorFallback";

// ...
{
  hasError && <ImageErrorFallback />;
}
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ImageErrorFallback.tsx src/components/RealmLevel.tsx
git commit -m "refactor(ui): extrae ImageErrorFallback reutilizable"
```

---

## Self-Review

### Spec coverage

- ✅ Hallazgo #1 (overlays duplicados): Task 3.2, 3.3, 3.4, 3.5.
- ✅ Hallazgo #2 (dos listeners touchmove): Task 5.3.
- ✅ Hallazgo #3 (HeroSection grande): Task 4.1.
- ✅ Hallazgo #4 (StickyCTA querySelector): Task 5.1 (incluye hero + footer).
- ✅ Hallazgo #5 (Hotspot estados): Task 5.2.
- ✅ Hallazgo #6 (metadata dispersa): Task 2.1.
- ✅ Hallazgo #7 (faltan sitemap/robots): Task 2.2.
- ✅ Hallazgo #8 (ES2017): Task 6.1.
- ✅ Hallazgo #9 (tipos no compartidos): Task 1.1, 1.2 (incluye conexión de RedSocial y Autor).
- ✅ Hallazgo #10 (fallback inline): Task 6.2.

### Placeholder scan

- No hay `TBD`, `TODO`, `implement later`, `similar to Task N` ni `{/* JSX existente sin cambios */}`.
- Todos los pasos incluyen código completo, comando o acción concreta.
- Los archivos y paths son exactos.
- `HeroTitle.tsx`, `HeroBookMockup.tsx`, `HeroCTAs.tsx`, `StickyCTA.tsx`, `Hotspot.tsx`, `DualOverlay.tsx`, `layout.tsx`, `SchemaMarkup.tsx`, `Footer.tsx` todos tienen código completo.

### Type consistency

- `Libro` se exporta desde `src/types/libro.ts` y se re-exporta desde `src/data/libros.ts`.
- `SITE_CONFIG` se usa en `layout.tsx`, `SchemaMarkup.tsx`, `sitemap.ts` y `robots.ts`.
- `ZoomableOverlay` expone `renderInline` para `DualOverlay`.
- `useRegisterCTA` consume `useCTAVisibility` del provider.
- `RedSocial` se usa en `links.ts` como tipo de `SOCIAL_LINKS`; `SOCIAL_LINKS_FLAT` mantiene compatibilidad con imports existentes.
- `Autor` se usa en `site.ts` con `satisfies Autor`.
- `Testimonio` se usa en `data/testimonios.ts` y se importa en `TestimoniosSection.tsx`.
- `handleTouchMove` unificado tiene deps `[enablePan, onPan, onPinch, currentScale]`; el `useEffect` de listeners ya no incluye `handlePinch`.

### Riesgos conocidos

1. `DualOverlay` con `renderInline`: `useLockBodyScroll` se llama dos veces (DualOverlay + ZoomableOverlay). Es idempotente, pero se puede optimizar con `skipLock` si es necesario.
2. `CTAVisibilityProvider`: al envolver `layout.tsx`, todos los client components descendientes pueden consumir el contexto. Verificar que no haya hydration issues con `StickyCTA`.
3. `useTouchGestures` unificado: probar en dispositivo táctil real que el zoom con dos dedos funciona sin bloquear el scroll cuando no está activo.
4. `SOCIAL_LINKS` → `SOCIAL_LINKS_FLAT`: `SchemaMarkup.tsx` y `Footer.tsx` deben actualizar sus imports. `SchemaMarkup.tsx` ya usa `SOCIAL_LINKS_FLAT` en el código de Task 2.1 Step 3.
5. Orden de ejecución: Task 2.1 Step 2 importa `CTAVisibilityProvider` que se crea en Task 5.1. Ejecutar Task 5.1 Steps 1-2 antes, o posponer el wrapping a Task 5.1 Step 4.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-28-refactor-auditoria-importantes.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach?**

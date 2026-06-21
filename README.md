# Landing page — Libro de Victoria

Landing page de venta para el libro de Victoria. Diseño dark premium Mobile-First con animaciones via Motion.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Motion (motion/react) v12
- **Iconos:** Lucide React
- **Tipografía:** Syne (display), Playfair Display (serif), Inter (body)

## Estructura

```
src/
├── app/
│   ├── globals.css       # Tokens de diseño (CSS custom properties)
│   ├── layout.tsx        # Root layout con metadata SEO
│   └── page.tsx          # Composición de secciones
├── components/
│   ├── HeroSection.tsx
│   ├── SinopsisSection.tsx
│   ├── SobreAutoraSection.tsx
│   ├── TestimoniosSection.tsx
│   └── Footer.tsx
└── utils/
    └── whatsapp.ts       # Generador de links de WhatsApp
```

## Levantar en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Documentación

Ver [`docs/ui-redesign.md`](./docs/ui-redesign.md) para el detalle del rediseño de UI, decisiones de diseño y justificaciones.

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { SITE_URL } from '@/config/links';

// Configuración para fuente local Starlight Rune (Yudi-YqPny.ttf)
const starlightRune = localFont({
  src: [
    {
      path: '../fonts/Yudi-YqPny.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-display',
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

const META_TITLE = "Victoria Querales | Autora de Fantasía Oscura - Dioses Universales";
const META_DESCRIPTION = "Descubre Los Dos Reinos, el primer libro de la saga Dioses Universales por Victoria Querales. Fantasía oscura, política y romántica. 11+ años construyendo universos. Lanzamiento octubre 2026.";
const KEYWORDS = [
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
];

export const metadata: Metadata = {
  title: {
    default: META_TITLE,
    template: "%s | Victoria Querales",
  },
  description: META_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "Victoria Querales" }],
  creator: "Victoria Querales",
  publisher: "Victoria Querales",
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
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Victoria Querales - Autora",
    title: "Victoria Querales | Autora de Dioses Universales",
    description: "Donde amar es un acto político capaz de cambiar por completo el universo. Descubre la saga Dioses Universales.",
    images: [
      {
        url: "/landing-book-victoria/portada-libro-1.png",
        width: 1200,
        height: 630,
        alt: "Los Dos Reinos - Primer libro de Dioses Universales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    creator: "@victoria_aql",
    images: ["/landing-book-victoria/portada-libro-1.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${starlightRune.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}

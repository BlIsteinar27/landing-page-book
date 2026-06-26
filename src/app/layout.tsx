import type { Metadata } from "next";
import { Cinzel_Decorative, Playfair_Display, Inter } from "next/font/google";
// import localFont from 'next/font/local'; // Descomentar cuando se tenga el archivo de Starlight Rune
import "./globals.css";

// Configuración para fuente local Starlight Rune (PENDIENTE DE ARCHIVO)
// Descomentar cuando se coloque el archivo en public/fonts/StarlightRune-Regular.woff2
/*
const starlightRune = localFont({
  src: [
    {
      path: './fonts/StarlightRune-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-display',
});
*/

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
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

const META_TITLE = "Victoria Querales | Dioses Universales - Fantasía Oscura";
const META_DESCRIPTION = "Descubre Los Dos Reinos, el primer libro de la saga Dioses Universales. Una historia épica de fantasía oscura, política y romance. Lanzamiento octubre 2026.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: "Victoria Querales | Dioses Universales",
    description: "Donde amar es un acto político capaz de cambiar por completo el universo.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${cinzel.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}

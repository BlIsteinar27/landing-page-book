import type { Metadata } from "next";
import { Syne, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
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

const META_TITLE = "Victoria - Libro que transformará tu vida";
const META_DESCRIPTION = "Descubre el libro de Victoria. Una historia inspiradora que te guiará hacia el crecimiento personal y el descubrimiento de tu verdadero potencial.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "book",
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
    <html lang="es" className={`h-full antialiased ${syne.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}

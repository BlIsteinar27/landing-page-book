import { SITE_URL } from "@/config/links";
import { Autor } from "@/types/autor";

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
    url: SITE_URL,
  } satisfies Autor,
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

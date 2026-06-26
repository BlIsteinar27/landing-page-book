import { SITE_URL, SOCIAL_LINKS } from '@/config/links';

export default function SchemaMarkup() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Victoria Querales",
    jobTitle: "Autora",
    description: "Licenciada en Comunicación Social con mención en Periodismo Audiovisual. Autora de la saga Dioses Universales.",
    url: SITE_URL,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
    ],
    knowsAbout: ["Fantasía oscura", "Romance político", "Escritura creativa"],
  };

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Los Dos Reinos",
    author: {
      "@type": "Person",
      name: "Victoria Querales",
    },
    bookFormat: "https://schema.org/Paperback",
    genre: ["Fantasía oscura", "Romance", "Ficción política"],
    inLanguage: "es",
    datePublished: "2026-10",
    description: "En el Reino Central, las gemelas Laila y Liora personifican el equilibrio entre la luz y la oscuridad. Una historia épica de traición, dolor y redención, donde la línea entre la luz y la oscuridad desaparece, y el amor y la venganza dictan el destino de la creación.",
    isPartOf: {
      "@type": "BookSeries",
      name: "Dioses Universales",
      numberOfItems: 7,
    },
    position: 1,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Victoria Querales - Autora",
    url: SITE_URL,
    description: "Sitio oficial de Victoria Querales, autora de la saga Dioses Universales",
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: "Victoria Querales",
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
    </>
  );
}

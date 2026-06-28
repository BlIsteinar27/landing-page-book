import { SITE_URL, SOCIAL_LINKS } from '@/config/links';

export default function SchemaMarkup() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Victoria Querales",
    jobTitle: "Autora de Fantasía Oscura",
    description: "Licenciada en Comunicación Social con mención en Periodismo Audiovisual. Autora de la saga Dioses Universales, una serie de fantasía oscura con 11+ años de desarrollo.",
    url: SITE_URL,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
    ],
    knowsAbout: ["Fantasía oscura", "Romance político", "Escritura creativa", "Mitología", "Literatura venezolana"],
    nationality: {
      "@type": "Country",
      name: "Venezuela"
    },
  };

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Los Dos Reinos",
    author: {
      "@type": "Person",
      name: "Victoria Querales",
      url: SITE_URL
    },
    bookFormat: "https://schema.org/Paperback",
    genre: ["Fantasía oscura", "Romance", "Ficción política", "Mitología"],
    inLanguage: "es",
    datePublished: "2026-10",
    description: "En el Reino Central, las gemelas Laila y Liora personifican el equilibrio entre la luz y la oscuridad. Una historia épica de traición, dolor y redención, donde la línea entre la luz y la oscuridad desaparece, y el amor y la venganza dictan el destino de la creación.",
    isPartOf: {
      "@type": "BookSeries",
      name: "Dioses Universales",
      numberOfItems: 7,
    },
    position: 1,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "USD",
      price: "19.99",
      url: SITE_URL
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Victoria Querales - Autora de Dioses Universales",
    url: SITE_URL,
    description: "Sitio oficial de Victoria Querales, autora venezolana de la saga Dioses Universales. Fantasía oscura, romance político y mitología.",
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: "Victoria Querales",
      url: SITE_URL
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Victoria Querales - Dioses Universales",
    url: SITE_URL,
    logo: `${SITE_URL}/landing-book-victoria/portada-libro-1.png`,
    description: "Serie de libros de fantasía oscura escrita por Victoria Querales",
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish"
    }
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

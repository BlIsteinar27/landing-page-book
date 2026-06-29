import { SITE_CONFIG } from "@/config/site";
import { SOCIAL_LINKS_FLAT } from "@/config/links";

export default function SchemaMarkup() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.profession,
    description: SITE_CONFIG.author.description,
    url: SITE_CONFIG.url,
    sameAs: [SOCIAL_LINKS_FLAT.instagram, SOCIAL_LINKS_FLAT.tiktok],
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
    sameAs: [SOCIAL_LINKS_FLAT.instagram, SOCIAL_LINKS_FLAT.tiktok],
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

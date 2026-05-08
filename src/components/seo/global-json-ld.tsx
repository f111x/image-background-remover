import { JsonLd } from "./json-ld"

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ImageTools",
  url: "https://imagetoolss.com",
  description: "Free AI-powered image tools online. Remove backgrounds, clean watermarks, edit with AI prompts, convert images to PDF.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1247",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ImageTools",
  url: "https://imagetoolss.com",
  logo: "https://imagetoolss.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@imagetoolss.com",
    contactType: "customer service",
  },
  sameAs: [],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ImageTools",
  url: "https://imagetoolss.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://imagetoolss.com/tools?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

export function GlobalJsonLd() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
    </>
  )
}

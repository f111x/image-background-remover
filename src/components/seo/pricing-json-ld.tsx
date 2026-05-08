import { JsonLd } from "./json-ld"

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ImageTools Pricing",
  url: "https://imagetoolss.com/pricing",
  description: "Affordable credit packages and monthly subscription plans for AI image tools. Pay only for what you use.",
  offers: [
    {
      "@type": "Offer",
      name: "Trial",
      price: "1",
      priceCurrency: "USD",
      description: "10 one-time credits",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "5",
      priceCurrency: "USD",
      description: "50 one-time credits",
    },
    {
      "@type": "Offer",
      name: "Value",
      price: "15",
      priceCurrency: "USD",
      description: "200 one-time credits",
    },
    {
      "@type": "Offer",
      name: "Basic Monthly",
      price: "5",
      priceCurrency: "USD",
      description: "50 credits/month with rollover",
    },
    {
      "@type": "Offer",
      name: "Pro Monthly",
      price: "15",
      priceCurrency: "USD",
      description: "200 credits/month with rollover",
    },
  ],
}

export function PricingJsonLd() {
  return <JsonLd data={pricingSchema} />
}

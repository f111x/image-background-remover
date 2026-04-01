"use client"

import { useState } from "react"

const faqs = [
  {
    question: "How does background removal work?",
    answer: "Our AI analyzes your image and identifies the main subject, then removes the background while preserving edges and details. The result is a transparent PNG that you can use anywhere.",
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPG, PNG, and WEBP formats. Maximum file size is 10MB per image.",
  },
  {
    question: "Do I need to sign up to use this tool?",
    answer: "Yes, you need to create a free account. New users get 3 free credits to try out the service. Each image processing costs 1 credit.",
  },
  {
    question: "How do credits work?",
    answer: "Each image processing costs 1 credit. You can purchase credit packages or subscribe monthly. Purchased credits never expire. Monthly subscribers also get rollover - unused credits from one month carry over to the next (up to 2x your monthly allocation).",
  },
  {
    question: "Do credits expire?",
    answer: "Purchased one-time credits never expire. For monthly subscribers, your monthly allocation resets each month, but unused credits roll over (up to 2x your monthly amount).",
  },
  {
    question: "What payment methods are supported?",
    answer: "We accept PayPal and major credit cards. Payment is processed securely through PayPal.",
  },
  {
    question: "Can I get a refund?",
    answer: "Unused credits can be refunded within 30 days of purchase. Contact us at support@imagetoolss.com for assistance.",
  },
  {
    question: "Is my image data secure?",
    answer: "Yes! Your images are processed and never stored on our servers. Once you download your result, the processed image is deleted from our systems.",
  },
  {
    question: "What can I use the transparent images for?",
    answer: "You can use them for product photography, profile pictures, presentations, social media posts, graphic design projects, and much more.",
  },
  {
    question: "How can I contact support?",
    answer: "Email us at support@imagetoolss.com. We typically respond within 24 hours.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about ImageTools
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background rounded-lg border">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-muted-foreground">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

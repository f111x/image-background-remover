"use client"

import { useState } from "react"

const faqs = [
  {
    question: "How does background removal work?",
    answer: "Our AI analyzes your image and identifies the main subject, then removes the background while preserving edges and details. The result is a transparent PNG that you can use anywhere.",
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPG, PNG, and WEBP formats. Maximum file size is 5MB per image.",
  },
  {
    question: "Is my image data secure?",
    answer: "Yes! Your images are processed and never stored on our servers. Once you download your result, the processed image is gone from our systems.",
  },
  {
    question: "Do I need to sign up to use this tool?",
    answer: "No signup required! You can start removing backgrounds immediately for free.",
  },
  {
    question: "What can I use the transparent images for?",
    answer: "You can use them for product photography, profile pictures, presentations, social media posts, graphic design projects, and much more.",
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
            Everything you need to know about our background removal tool
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

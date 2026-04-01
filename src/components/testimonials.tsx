"use client"

const testimonials = [
  {
    quote: "This tool saved me hours of work on my product photography.",
    author: "Sarah M.",
    role: "E-commerce Seller",
  },
  {
    quote: "Fast, accurate, and completely free. Highly recommended!",
    author: "John D.",
    role: "Freelance Designer",
  },
  {
    quote: "The quality is amazing. Can&apos;t believe it&apos;s free!",
    author: "Emily R.",
    role: "Social Media Manager",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

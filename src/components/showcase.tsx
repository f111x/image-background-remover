"use client"

export function Showcase() {
  const examples = [
    { before: "/placeholder-before.jpg", after: "/placeholder-after.jpg", label: "Product Photo" },
    { before: "/placeholder-before.jpg", after: "/placeholder-after.jpg", label: "Portrait" },
    { before: "/placeholder-before.jpg", after: "/placeholder-after.jpg", label: "E-commerce" },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Example Results</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our AI-powered background removal can do
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="text-center">
              <div className="bg-muted/30 rounded-xl p-4 mb-4 aspect-square flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Example {index + 1}</span>
              </div>
              <p className="text-sm font-medium">{example.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

const PACKAGES = [
  { credits: 10, price: 0.99, popular: false },
  { credits: 50, price: 3.99, popular: true },
  { credits: 100, price: 6.99, popular: false },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ImageTools
        </Link>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-2">Simple Pricing</h1>
        <p className="text-gray-400 text-center mb-12">Choose a plan that works for you</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PACKAGES.map((pkg) => (
            <div key={pkg.credits} className={`bg-gray-800 rounded-xl p-6 ${pkg.popular ? 'ring-2 ring-purple-500' : ''}`}>
              {pkg.popular && (
                <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Most Popular</span>
              )}
              <h3 className="text-2xl font-bold mt-2">{pkg.credits} Credits</h3>
              <p className="text-4xl font-bold text-green-400 mt-4">${pkg.price}</p>
              <p className="text-gray-400 mt-2">
                {pkg.credits === 10 && 'Perfect for occasional use'}
                {pkg.credits === 50 && 'Best value for regular users'}
                {pkg.credits === 100 && 'For heavy users'}
              </p>
              <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition cursor-not-allowed opacity-50" disabled>
                Contact for Payment
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-400">
          <p>Payment processing coming soon.</p>
          <p className="mt-2">Please check back later or contact us for bulk orders.</p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}

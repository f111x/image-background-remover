import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="p-6">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ImageTools
          </h1>
          <div className="flex gap-4">
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition">
              Profile
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Remove Image Backgrounds
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
            in Seconds
          </span>
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          AI-powered background removal. Upload your image and get a transparent background in seconds.
          No signup required. Free to use.
        </p>

        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 mb-6">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg">Drag and drop an image here, or click to select</p>
              <p className="text-sm mt-2">Supports JPG, PNG, WEBP • Max 5MB</p>
            </div>
          </div>
          
          <Link 
            href="/pricing"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition"
          >
            Get More Credits
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast Processing</h3>
            <p className="text-gray-400">Remove backgrounds in under 10 seconds with our AI technology.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">Your images are processed and never stored on our servers.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
            <p className="text-gray-400">Preserve image quality with precise edge detection and natural results.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; 2026 ImageTools. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

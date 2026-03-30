import Link from 'next/link'

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ImageTools
        </Link>
      </header>

      <main className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
              G
            </div>
            <div>
              <p className="text-gray-400 text-sm">Guest User</p>
              <p className="text-xl font-semibold">Guest</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm mb-1">Credits Remaining</p>
            <p className="text-3xl font-bold text-green-400">0</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-gray-400 mb-4">
            Sign in to sync your credits and usage history across devices.
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition cursor-not-allowed opacity-50" disabled>
            Sign In (Coming Soon)
          </button>
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

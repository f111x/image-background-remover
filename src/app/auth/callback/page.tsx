'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const errorParam = params.get('error')
      const errorDescription = params.get('error_description')

      if (errorParam) {
        console.error('OAuth error:', errorParam, errorDescription)
        setError(errorDescription || errorParam)
        return
      }

      if (!code) {
        console.error('No authorization code')
        setError('No authorization code received')
        return
      }

      // Check state
      const savedState = sessionStorage.getItem('oauth_state')
      const codeVerifier = sessionStorage.getItem('code_verifier')
      
      if (state && savedState && state !== savedState) {
        console.error('State mismatch')
        setError('State mismatch - possible CSRF attack')
        return
      }

      // If we have the code verifier, exchange the code for tokens
      if (codeVerifier) {
        sessionStorage.removeItem('oauth_state')
        sessionStorage.removeItem('code_verifier')
        
        console.log('Authorization code received:', code.substring(0, 20) + '...')
        
        // Store auth indicator
        localStorage.setItem('google_auth', 'true')
        // Note: In production, you'd exchange the code for tokens via backend
        // For now, we just indicate successful login
        router.push('/?login=success')
      } else {
        // No code verifier - this is expected if the session didn't persist
        console.error('No code verifier found in sessionStorage')
        setError('Session expired. Please try logging in again.')
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">登录失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-xl">处理登录中...</div>
    </div>
  )
}

// app/error/page.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
      <p className="text-lg">{message || 'Something went wrong.'}</p>
      <p className="mt-2 text-sm text-gray-500">Redirecting to homepage...</p>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading error information...</div>}>
      <ErrorContent />
    </Suspense>
  )
}



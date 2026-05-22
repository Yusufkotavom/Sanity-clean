'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="id">
      <body>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '28rem',
            textAlign: 'center',
          }}>
            <h1 style={{
              marginBottom: '1rem',
              fontSize: '2.25rem',
              fontWeight: 'bold',
            }}>
              Application Error
            </h1>
            <p style={{
              marginBottom: '1.5rem',
              color: '#666',
            }}>
              A critical error occurred. Please refresh the page or contact support.
            </p>
            {error.digest && (
              <p style={{
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#999',
              }}>
                Error ID: {error.digest}
              </p>
            )}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '1px solid #ddd',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

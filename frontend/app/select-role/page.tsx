'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SelectRole() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/api/auth/login')
    return null
  }

  const handleRoleSelect = async (role: string) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/auth/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error('Failed to set role')
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Failed to set role. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to SalesTrainer</h2>
          <p className="mt-2 text-gray-600">
            Please select your role to continue
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('student')}
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            I am a Student
          </button>

          <button
            onClick={() => handleRoleSelect('teacher')}
            disabled={isSubmitting}
            className="btn btn-secondary w-full"
          >
            I am a Teacher
          </button>

          <div className="divider">OR</div>

          <button
            onClick={() => handleRoleSelect('admin')}
            disabled={isSubmitting}
            className="btn btn-accent w-full"
          >
            I am an Administrator
          </button>
        </div>

        {isSubmitting && (
          <div className="text-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        )}
      </div>
    </div>
  )
}

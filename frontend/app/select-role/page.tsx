'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type AvailableRole = {
  id: string
  label: string
  description: string
  buttonClass: string
}

export default function SelectRole() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [platformRole, setPlatformRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/auth/role')
        if (response.ok) {
          const data = await response.json()
          setPlatformRole(data.platformRole)
        }
      } catch (error) {
        console.error('Failed to fetch role:', error)
        setError('Failed to fetch your role. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRole()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  const getAvailableRoles = (platformRole: string): AvailableRole[] => {
    const roles: AvailableRole[] = []

    if (platformRole === 'admin') {
      roles.push(
        {
          id: 'admin',
          label: 'Administrator',
          description: 'Manage the platform and users',
          buttonClass: 'btn-accent'
        },
        {
          id: 'teacher',
          label: 'Teacher',
          description: 'Create and manage courses',
          buttonClass: 'btn-secondary'
        },
        {
          id: 'student',
          label: 'Student',
          description: 'Take courses and track progress',
          buttonClass: 'btn-primary'
        }
      )
    } else if (platformRole === 'teacher') {
      roles.push(
        {
          id: 'teacher',
          label: 'Teacher',
          description: 'Create and manage courses',
          buttonClass: 'btn-secondary'
        },
        {
          id: 'student',
          label: 'Student',
          description: 'Take courses and track progress',
          buttonClass: 'btn-primary'
        }
      )
    } else if (platformRole === 'student') {
      roles.push({
        id: 'student',
        label: 'Student',
        description: 'Take courses and track progress',
        buttonClass: 'btn-primary'
      })
    }

    return roles
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

  const availableRoles = platformRole ? getAvailableRoles(platformRole) : []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to SalesTrainer</h2>
          <p className="mt-2 text-gray-600">
            Select how you would like to use the platform
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {availableRoles.map((role) => (
            <div key={role.id} className="space-y-2">
              <button
                onClick={() => handleRoleSelect(role.id)}
                disabled={isSubmitting}
                className={`btn ${role.buttonClass} w-full`}
              >
                {role.label}
              </button>
              <p className="text-sm text-gray-600 text-center">{role.description}</p>
            </div>
          ))}
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

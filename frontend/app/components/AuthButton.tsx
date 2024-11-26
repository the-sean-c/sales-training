'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  if (isLoading) {
    return <button className="btn btn-primary loading">Loading...</button>
  }

  return user ? (
    <button onClick={handleLogout} className="btn btn-primary">
      Sign Out
    </button>
  ) : (
    <button onClick={handleLogin} className="btn btn-primary">
      Sign In
    </button>
  )
}

'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function AuthButton() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <button className="btn btn-primary loading">Loading...</button>
  }

  return user ? (
    <Link href="/api/auth/logout" className="btn btn-primary">
      Sign Out
    </Link>
  ) : (
    <Link href="/api/auth/login" className="btn btn-primary">
      Sign In
    </Link>
  )
}

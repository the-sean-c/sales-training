'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { usePathname, redirect } from 'next/navigation'
import Navbar from './Navbar'
import Drawer from './Drawer'

const publicPaths = ['/', '/api/auth/login', '/api/auth/logout', '/api/auth/callback']

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useUser()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  const isPublicPath = publicPaths.includes(pathname)

  if (!user && !isPublicPath) {
    redirect('/api/auth/login')
  }

  if (isPublicPath) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Drawer>
        <main className="flex-1 p-4">
          {children}
        </main>
      </Drawer>
    </div>
  )
}

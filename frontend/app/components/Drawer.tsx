'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const roleBasedLinks = {
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/admin/user-roles', label: 'User Roles', icon: '👤' },
    { href: '/dashboard/admin/teams', label: 'Teams', icon: '👥' },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: '📊' },
  ],
  teacher: [
    { href: '/dashboard/teacher', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/teacher/courses', label: 'Courses', icon: '📚' },
    { href: '/dashboard/teacher/cohorts', label: 'Cohorts', icon: '👨‍🏫' },
    { href: '/dashboard/teacher/analytics', label: 'Analytics', icon: '📊' },
  ],
  student: [
    { href: '/dashboard/student', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/student/my-courses', label: 'My Courses', icon: '📚' },
    { href: '/dashboard/student/my-progress', label: 'My Progress', icon: '📈' },
  ],
}

export default function Drawer({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const pathname = usePathname()
  const [sessionRole, setSessionRole] = useState<string>('student')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchSessionRole = async () => {
      if (user) {
        try {
          const response = await fetch('/api/auth/role')
          if (response.ok) {
            const data = await response.json()
            setSessionRole(data.sessionRole || 'student')
          }
        } catch (error) {
          console.error('Error fetching session role:', error)
          setSessionRole('student')
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    fetchSessionRole()
  }, [user])

  const links = roleBasedLinks[sessionRole as keyof typeof roleBasedLinks]

  if (isLoading) {
    return (
      <div className="drawer lg:drawer-open">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li>
              <div className="loading loading-spinner loading-md"></div>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {links?.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

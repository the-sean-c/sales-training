'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const roleBasedLinks = {
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/organizations', label: 'Organizations', icon: '🏢' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { href: '/admin/role-management', label: 'Role Management', icon: '🔑' },
  ],
  teacher: [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/courses', label: 'Courses', icon: '📚' },
    { href: '/classes', label: 'Classes', icon: '👨‍🏫' },
    { href: '/analytics', label: 'Analytics', icon: '📊' },
  ],
  student: [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/my-courses', label: 'My Courses', icon: '📚' },
    { href: '/progress', label: 'Progress', icon: '📈' },
  ],
}

export default function Drawer({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState('student')
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const response = await fetch('/api/auth/me')
          const data = await response.json()
          setUserRole(data.user.role || 'student')
        } catch (error) {
          console.error('Error fetching user role:', error)
          setUserRole('student')
        }
      }
    }
    
    fetchUserRole()
  }, [user])

  const links = roleBasedLinks[userRole as keyof typeof roleBasedLinks]

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

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import AuthButton from './AuthButton'
import { useEffect, useState } from 'react'

const roleBasedLinks = {
  admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/organizations', label: 'Organizations' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/role-management', label: 'Role Management' },
  ],
  teacher: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/courses', label: 'Courses' },
    { href: '/classes', label: 'Classes' },
    { href: '/analytics', label: 'Analytics' },
  ],
  student: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/my-courses', label: 'My Courses' },
    { href: '/progress', label: 'Progress' },
  ],
}

export default function Navigation() {
  const { user, isLoading } = useUser()
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
    <div className="navbar bg-base-100 border-b">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {links?.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">SalesTrainer</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links?.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User')} alt="profile" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <Link href="/api/auth/logout">Logout</Link>
              </li>
            </ul>
          </div>
        )}
        {!user && !isLoading && <AuthButton />}
      </div>
    </div>
  )
}

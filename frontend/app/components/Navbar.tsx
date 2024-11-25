'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default function Navbar() {
  const { user } = useUser()

  return (
    <div className="navbar bg-base-100 border-b px-4">
      <div className="flex-1">
        <button className="btn btn-ghost drawer-button lg:hidden" onClick={() => document.getElementById('main-drawer')?.click()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
        <Link href="/" className="text-xl font-bold">MyCompany</Link>
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User')} alt={user.name || 'User'} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li><Link href="/settings">Settings</Link></li>
              <li><Link href="/api/auth/logout">Logout</Link></li>
            </ul>
          </div>
        ) : (
          <Link href="/api/auth/login" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

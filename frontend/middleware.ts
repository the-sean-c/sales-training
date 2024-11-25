import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/api/auth/login', '/api/auth/callback', '/api/auth/logout', '/select-role']

async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const session = await getSession(req)

  // Check if user has a role
  const userRole = session?.user?.['https://salestrainer/role']
  if (!userRole && pathname !== '/select-role') {
    return NextResponse.redirect(new URL('/select-role', req.url))
  }

  // Role-based access control
  if (userRole) {
    const adminOnlyPaths = ['/admin']
    const teacherPaths = ['/teacher', '/courses/create']
    const studentPaths = ['/courses', '/progress']

    if (adminOnlyPaths.some(path => pathname.startsWith(path)) && userRole !== 'admin') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (teacherPaths.some(path => pathname.startsWith(path)) && !['admin', 'teacher'].includes(userRole)) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (studentPaths.some(path => pathname.startsWith(path)) && !['admin', 'teacher', 'student'].includes(userRole)) {
      return new NextResponse('Unauthorized', { status: 403 })
    }
  }

  // Add user info to headers for backend API calls
  const response = NextResponse.next()
  if (session?.user) {
    response.headers.set('X-User-Email', session.user.email || '')
    response.headers.set('X-User-Sub', session.user.sub || '')
    response.headers.set('X-User-Role', userRole || '')
  }
  return response
}

export default withMiddlewareAuthRequired(middleware)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/api/((?!auth).)*$'
  ]
}

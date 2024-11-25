import { getSession } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401 }
      )
    }

    try {
      // Attempt to fetch user role from backend
      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        return NextResponse.json({
          user: {
            ...session.user,
            role: userData.role || 'student'
          }
        })
      }
    } catch (error) {
      console.warn('Backend unavailable, defaulting to basic user role:', error)
    }

    // Default response if backend is unavailable
    return NextResponse.json({
      user: {
        ...session.user,
        role: 'student'
      }
    })
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}

import { getSession, updateSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

// TODO: this lets any user change their role

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { role } = await req.json()
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 })
    }

    // Update the session with the new role
    const updatedSession = await updateSession({
      ...session,
      user: {
        ...session.user,
        'https://salestrainer/role': role
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating role:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

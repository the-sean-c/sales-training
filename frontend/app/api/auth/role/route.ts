import { withApiAuthRequired, getSession, updateSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET endpoint to fetch both platform role and current session role
export const GET = withApiAuthRequired(async function getUserRoles(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user info from backend to get platform role
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      console.error('Backend API error:', response.status)
      return new NextResponse('Backend API error', { status: response.status })
    }

    const userData = await response.json()
    const platformRole = userData.role || 'student'

    return NextResponse.json({
      platformRole,
      sessionRole: session.user['https://salestrainer/sessionRole'] || platformRole
    })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
});

// POST endpoint to update session role
export const POST = withApiAuthRequired(async function updateSessionRole(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { role } = await req.json();
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    // Get platform role from backend
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Backend API error:', response.status);
      return new NextResponse('Backend API error', { status: response.status });
    }

    const userData = await response.json();
    const platformRole = userData.role || 'student';

    // Validate role assumption based on platform role
    if (!isValidRoleAssumption(platformRole, role)) {
      return new NextResponse('Unauthorized role assumption', { status: 403 });
    }
    
    await updateSession(req, res, { 
      ...session, 
      user: { 
        ...session.user, 
        'https://salestrainer/sessionRole': role 
      }
    });
    
    return NextResponse.json({ success: true }, res);
  } catch (error) {
    console.error('Error updating role:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
})

function isValidRoleAssumption(platformRole: string, sessionRole: string): boolean {
  switch (platformRole) {
    case 'admin':
      return true // admin can assume any role
    case 'teacher':
      return ['teacher', 'student'].includes(sessionRole)
    case 'student':
      return sessionRole === 'student'
    default:
      return false
  }
}

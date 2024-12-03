import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET= withApiAuthRequired(async function statsRoute(req) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Verify admin role
    const userResponse = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    const userData = await userResponse.json();
    
    if (userData.role !== 'admin') {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
      });
    }

    // Get all users from the backend
    const response = await fetch(`${API_URL}/api/v1/users/all`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    const users = await response.json();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
)
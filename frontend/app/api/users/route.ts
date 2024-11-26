import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

// TODO: This only verifies admin role

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Verify admin role
    const userResponse = await fetch('http://localhost:8000/api/users/me', {
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
    const response = await fetch('http://localhost:8000/api/users', {
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

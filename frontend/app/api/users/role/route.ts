import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
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

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    // Update user role in the backend
    const response = await fetch(`http://localhost:8000/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(JSON.stringify(error), {
        status: response.status,
      });
    }

    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

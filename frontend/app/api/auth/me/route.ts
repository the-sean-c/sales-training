import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = withApiAuthRequired(async function getUserSessionInfo(req) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);

    if (!session?.user) {
      console.error('No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // Make sure we have an access token
    if (!session.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    // Get user info from backend
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Backend API error:', response.status);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      return NextResponse.json({ error: 'Backend API error' }, { status: response.status });
    }

    const userData = await response.json();
    
    // Get user info from session
    const { user } = session;
    
    return NextResponse.json({
      id: user.sub,
      email: user.email,
      role: userData.role || 'student',
      sessionRole: user['https://salestrainer/sessionRole'] || userData.role || 'student'
    });
  } catch (error) {
    console.error('Error in /api/v1/users/me:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
);

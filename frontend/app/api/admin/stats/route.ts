import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = withApiAuthRequired(async function statsRoute(req) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);

    if (!session?.user) {
      console.error('No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    // Get stats from backend
    const response = await fetch(`${API_URL}/api/v1/users/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in stats route handler:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
});
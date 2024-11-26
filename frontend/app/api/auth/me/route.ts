import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      console.error('No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user info from session
    const { user } = session;
    return NextResponse.json({
      id: user.sub,
      email: user.email,
      role: user['https://salestrainer/role'] || 'student'
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

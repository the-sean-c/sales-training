import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GET = withApiAuthRequired(async function getCourses(req) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session?.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    console.log('Fetching courses from:', `${API_URL}/api/v1/courses`);
    const response = await fetch(`${API_URL}/api/v1/courses`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `Backend API error: ${errorText}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { error: 'Invalid response format from backend' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/courses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching courses' }, 
      { status: 500 }
    );
  }
});

export const POST = withApiAuthRequired(async function createCourse(req) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session?.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    const data = await req.json();
    console.log('Creating course:', data);
    
    const response = await fetch(`${API_URL}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `Backend API error: ${errorText}` }, 
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/courses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating course' }, 
      { status: 500 }
    );
  }
});
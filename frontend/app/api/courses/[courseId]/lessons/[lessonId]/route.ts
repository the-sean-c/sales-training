import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/courses/${params.courseId}/lessons/${params.lessonId}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching lesson' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const data = await request.json();
    const response = await fetch(
      `${API_URL}/api/v1/courses/${params.courseId}/lessons/${params.lessonId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating lesson' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/courses/${params.courseId}/lessons/${params.lessonId}`,
      {
        method: 'DELETE',
      }
    );
    return NextResponse.json({ message: 'Lesson deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting lesson' }, { status: 500 });
  }
}
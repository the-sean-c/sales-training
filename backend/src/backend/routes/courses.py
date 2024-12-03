from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import requires_auth, user_has_access_rights
from backend.database import get_db_session
from backend.models import Course, Lesson, User, UserRole
from backend.schemas import (
    CourseCreate,
    CourseRead,
    CourseUpdate,
    LessonCreate,
    LessonRead,
    LessonUpdate,
)

router = APIRouter()


@router.get("", response_model=List[CourseRead])
async def get_courses(
    token: dict = Depends(requires_auth),
    db_session: AsyncSession = Depends(get_db_session),
):
    """Get all courses for the current user."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await db_session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get courses
        result = await db_session.execute(
            select(Course).where(Course.created_by == user.id)
        )
        courses = result.scalars().all()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=CourseRead)
async def create_course(
    course: CourseCreate,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Create a new course."""
    _ = await user_has_access_rights(token, [UserRole.admin], session)
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Create course
        db_course = Course(**course.model_dump(), created_by=user.id)
        session.add(db_course)
        await session.commit()
        await session.refresh(db_course)
        return db_course
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{course_id}", response_model=CourseRead)
async def get_course(
    course_id: str,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Get a specific course."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course
        result = await session.execute(
            select(Course).where(Course.id == course_id, Course.created_by == user.id)
        )
        course = result.scalar_one_or_none()

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        return course
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{course_id}", response_model=CourseRead)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Update a course."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course
        result = await session.execute(
            select(Course).where(Course.id == course_id, Course.created_by == user.id)
        )
        course = result.scalar_one_or_none()

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Update course
        update_data = course_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(course, field, value)

        await session.commit()
        await session.refresh(course)
        return course
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Delete a course."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course
        result = await session.execute(
            select(Course).where(Course.id == course_id, Course.created_by == user.id)
        )
        course = result.scalar_one_or_none()

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Delete course
        await session.delete(course)
        await session.commit()
        return {"message": "Course deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{course_id}/lessons", response_model=List[LessonRead])
async def get_lessons(
    course_id: str,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Get all lessons for a course."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course
        result = await session.execute(
            select(Course).where(Course.id == course_id, Course.created_by == user.id)
        )
        course = result.scalar_one_or_none()

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Get lessons
        result = await session.execute(
            select(Lesson).where(Lesson.course_id == course_id)
        )
        lessons = result.scalars().all()
        return lessons
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{course_id}/lessons", response_model=LessonRead)
async def create_lesson(
    course_id: str,
    lesson: LessonCreate,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Create a new lesson."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course
        result = await session.execute(
            select(Course).where(Course.id == course_id, Course.created_by == user.id)
        )
        course = result.scalar_one_or_none()

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Create lesson
        db_lesson = Lesson(**lesson.model_dump(), course_id=course_id)
        session.add(db_lesson)
        await session.commit()
        await session.refresh(db_lesson)
        return db_lesson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{course_id}/lessons/{lesson_id}", response_model=LessonRead)
async def get_lesson(
    course_id: str,
    lesson_id: str,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Get a specific lesson."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course and lesson
        result = await session.execute(
            select(Lesson)
            .join(Course)
            .where(
                Course.id == course_id,
                Lesson.id == lesson_id,
                Course.created_by == user.id,
            )
        )
        lesson = result.scalar_one_or_none()

        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        return lesson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{course_id}/lessons/{lesson_id}", response_model=LessonRead)
async def update_lesson(
    course_id: str,
    lesson_id: str,
    lesson_update: LessonUpdate,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Update a lesson."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course and lesson
        result = await session.execute(
            select(Lesson)
            .join(Course)
            .where(
                Course.id == course_id,
                Lesson.id == lesson_id,
                Course.created_by == user.id,
            )
        )
        lesson = result.scalar_one_or_none()

        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        # Update lesson
        update_data = lesson_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(lesson, field, value)

        await session.commit()
        await session.refresh(lesson)
        return lesson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{course_id}/lessons/{lesson_id}")
async def delete_lesson(
    course_id: str,
    lesson_id: str,
    token: dict = Depends(requires_auth),
    session: AsyncSession = Depends(get_db_session),
):
    """Delete a lesson."""
    try:
        # Get user from token
        sub = token.get("sub")
        result = await session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get course and lesson
        result = await session.execute(
            select(Lesson)
            .join(Course)
            .where(
                Course.id == course_id,
                Lesson.id == lesson_id,
                Course.created_by == user.id,
            )
        )
        lesson = result.scalar_one_or_none()

        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        # Delete lesson
        await session.delete(lesson)
        await session.commit()
        return {"message": "Lesson deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

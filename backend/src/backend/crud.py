from typing import List, Optional, Union
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User, Class, ClassEnrollment, Course, Lesson, ContentBlock, Progress


# User operations
async def get_user(db: AsyncSession, user_id: UUID) -> Optional[User]:
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()

async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()

# Class operations
async def create_class(db: AsyncSession, name: str, teacher_id: UUID, description: Optional[str] = None) -> Class:
    db_class = Class(name=name, teacher_id=teacher_id, description=description)
    db.add(db_class)
    await db.commit()
    await db.refresh(db_class)
    return db_class

async def get_class(db: AsyncSession, class_id: UUID) -> Optional[Class]:
    result = await db.execute(select(Class).filter(Class.id == class_id))
    return result.scalar_one_or_none()

async def get_teacher_classes(db: AsyncSession, teacher_id: UUID) -> List[Class]:
    result = await db.execute(select(Class).filter(Class.teacher_id == teacher_id))
    return result.scalars().all()

# Course operations
async def create_course(
    db: AsyncSession, 
    name: str, 
    class_id: UUID, 
    created_by: UUID, 
    description: Optional[str] = None,
    structure: Optional[dict] = None
) -> Course:
    db_course = Course(
        name=name,
        class_id=class_id,
        created_by=created_by,
        description=description,
        structure=structure
    )
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

async def get_course(db: AsyncSession, course_id: UUID) -> Optional[Course]:
    result = await db.execute(select(Course).filter(Course.id == course_id))
    return result.scalar_one_or_none()

async def get_class_courses(db: AsyncSession, class_id: UUID) -> List[Course]:
    result = await db.execute(select(Course).filter(Course.class_id == class_id))
    return result.scalars().all()

# Lesson operations
async def create_lesson(
    db: AsyncSession,
    course_id: UUID,
    title: str,
    order: int,
    structure: Optional[dict] = None
) -> Lesson:
    db_lesson = Lesson(
        course_id=course_id,
        title=title,
        order=order,
        structure=structure
    )
    db.add(db_lesson)
    await db.commit()
    await db.refresh(db_lesson)
    return db_lesson

async def get_lesson(db: AsyncSession, lesson_id: UUID) -> Optional[Lesson]:
    result = await db.execute(select(Lesson).filter(Lesson.id == lesson_id))
    return result.scalar_one_or_none()

async def get_course_lessons(db: AsyncSession, course_id: UUID) -> List[Lesson]:
    result = await db.execute(
        select(Lesson)
        .filter(Lesson.course_id == course_id)
        .order_by(Lesson.order)
    )
    return result.scalars().all()

# Progress operations
async def get_or_create_progress(
    db: AsyncSession,
    student_id: UUID,
    lesson_id: UUID
) -> Progress:
    result = await db.execute(
        select(Progress)
        .filter(Progress.student_id == student_id)
        .filter(Progress.lesson_id == lesson_id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = Progress(
            student_id=student_id,
            lesson_id=lesson_id,
            status="not_started"
        )
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    return progress

async def update_progress(
    db: AsyncSession,
    progress_id: UUID,
    status: str
) -> Optional[Progress]:
    result = await db.execute(select(Progress).filter(Progress.id == progress_id))
    progress = result.scalar_one_or_none()
    
    if progress:
        progress.status = status
        await db.commit()
        await db.refresh(progress)
    
    return progress

async def get_student_progress(
    db: AsyncSession,
    student_id: UUID,
    lesson_id: Optional[UUID] = None
) -> Union[Optional[Progress], List[Progress]]:
    query = select(Progress).filter(Progress.student_id == student_id)
    
    if lesson_id:
        query = query.filter(Progress.lesson_id == lesson_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    result = await db.execute(query)
    return result.scalars().all()

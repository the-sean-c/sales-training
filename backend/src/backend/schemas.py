from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class EnrollmentStatus(str, Enum):
    active = "active"
    completed = "completed"
    dropped = "dropped"

class ContentType(str, Enum):
    video = "video"
    text = "text"
    image = "image"
    interactive = "interactive"

class ProgressStatus(str, Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"

# Base schemas for creating/updating
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    auth0_id: str

class UserUpdate(UserBase):
    pass

class ClassBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClassCreate(ClassBase):
    teacher_id: UUID

class ClassUpdate(ClassBase):
    pass

class ClassEnrollmentBase(BaseModel):
    class_id: UUID
    student_id: UUID
    status: EnrollmentStatus

class ClassEnrollmentCreate(ClassEnrollmentBase):
    pass

class ClassEnrollmentUpdate(BaseModel):
    status: EnrollmentStatus

class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    structure: Optional[Dict[str, Any]] = None

class CourseCreate(CourseBase):
    class_id: UUID
    created_by: UUID

class CourseUpdate(CourseBase):
    pass

class LessonBase(BaseModel):
    title: str
    order: int
    structure: Optional[Dict[str, Any]] = None

class LessonCreate(LessonBase):
    course_id: UUID

class LessonUpdate(LessonBase):
    pass

class ContentBlockBase(BaseModel):
    order: int
    type: ContentType
    content: Dict[str, Any]

class ContentBlockCreate(ContentBlockBase):
    lesson_id: UUID

class ContentBlockUpdate(ContentBlockBase):
    pass

class ProgressBase(BaseModel):
    student_id: UUID
    lesson_id: UUID
    status: ProgressStatus
    completed_at: Optional[datetime] = None

class ProgressCreate(ProgressBase):
    pass

class ProgressUpdate(BaseModel):
    status: ProgressStatus
    completed_at: Optional[datetime] = None

# Response schemas that include relationships and additional fields
class UserResponse(UserBase):
    id: UUID
    auth0_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClassResponse(ClassBase):
    id: UUID
    teacher_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ClassEnrollmentResponse(ClassEnrollmentBase):
    id: UUID
    enrolled_at: datetime

    class Config:
        from_attributes = True

class CourseResponse(CourseBase):
    id: UUID
    class_id: UUID
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class LessonResponse(LessonBase):
    id: UUID
    course_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ContentBlockResponse(ContentBlockBase):
    id: UUID
    lesson_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ProgressResponse(ProgressBase):
    id: UUID

    class Config:
        from_attributes = True

# Extended response schemas with nested relationships
class UserDetailResponse(UserResponse):
    taught_classes: List[ClassResponse] = []
    enrollments: List[ClassEnrollmentResponse] = []

class ClassDetailResponse(ClassResponse):
    teacher: UserResponse
    enrollments: List[ClassEnrollmentResponse] = []
    courses: List[CourseResponse] = []

class CourseDetailResponse(CourseResponse):
    class_: ClassResponse
    lessons: List[LessonResponse] = []

class LessonDetailResponse(LessonResponse):
    course: CourseResponse
    content_blocks: List[ContentBlockResponse] = []
    progress_records: List[ProgressResponse] = []

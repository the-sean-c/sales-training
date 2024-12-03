# src/backend/schemas.py
from datetime import datetime
from typing import List, Optional

from pydantic import UUID4, BaseModel, EmailStr, Field

from backend.enums import UserRole
from backend.models import Lesson, User


class UserBase(BaseModel):
    sub: str = Field(
        description="OAuth2/OIDC subject identifier that uniquely identifies the user"
    )
    email: EmailStr = Field(description="Email address of the user")
    role: UserRole = Field(description="Role of the user", example=UserRole.student)

    def to_orm(self):
        return User(**self.model_dump())

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: UUID4 = Field(description="Unique identifier for the user")
    sub: str = Field(
        description="OAuth2/OIDC subject identifier that uniquely identifies the user"
    )

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    id: str | None = Field(None, description="Unique identifier for the user")
    sub: str | None = Field(
        None,
        description="OAuth2/OIDC subject identifier that uniquely identifies the user",
    )
    email: EmailStr | None = Field(None, description="Email address of the user")
    role: UserRole | None = Field(
        None, description="Role of the user", example=UserRole.student
    )

    def to_orm(self, db_obj: User):
        update_data = self.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)
        return db_obj

    class Config:
        orm_mode = True


class LessonBase(BaseModel):
    title: str
    description: str
    order: int
    content: str

    def to_orm(self):
        return Lesson(**self.model_dump())


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    content: Optional[str] = None


class LessonRead(LessonBase):
    id: UUID4
    course_id: UUID4
    created_at: datetime
    last_modified: datetime

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    title: str = Field(description="Title of the course")
    description: str = Field(description="Description of the course")
    objectives: List[str] = Field(
        default_factory=list, description="List of course objectives"
    )
    isDraft: bool = Field(
        default=True, description="Whether the course is in draft state"
    )

    class Config:
        from_attributes = True


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[List[str]] = None
    isDraft: Optional[bool] = None


class CourseRead(CourseBase):
    id: UUID4
    created_at: datetime
    last_modified: datetime
    lessons: List[LessonRead] = []

    class Config:
        from_attributes = True

# ruff: noqa: E501

import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

from backend.enums import UserRole

Base = declarative_base()


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_modified = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sub = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum(UserRole, name="user_roles"), nullable=False)

    # Relationships
    taught_cohorts = relationship("Cohort", back_populates="teacher")
    enrollments = relationship("CohortEnrollment", back_populates="student")


class Cohort(Base, TimestampMixin):
    __tablename__ = "cohorts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    teacher = relationship("User", back_populates="taught_cohorts")
    enrollments = relationship("CohortEnrollment", back_populates="cohort")
    courses = relationship("Course", back_populates="cohort")


class CohortEnrollment(Base, TimestampMixin):
    __tablename__ = "cohort_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum("active", "completed", "dropped", name="enrollment_status"))
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    cohort = relationship("Cohort", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments")


class Course(Base, TimestampMixin):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    structure = Column(JSON)

    # Relationships
    cohort = relationship("Cohort", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course")


class Lesson(Base, TimestampMixin):
    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    structure = Column(JSON)

    # Relationships
    course = relationship("Course", back_populates="lessons")
    content_blocks = relationship("ContentBlock", back_populates="lesson")
    progress_records = relationship("Progress", back_populates="lesson")


class ContentBlock(Base, TimestampMixin):
    __tablename__ = "content_blocks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    order = Column(Integer, nullable=False)
    type = Column(Enum("video", "text", "image", "interactive", name="content_types"))
    content = Column(JSON)

    # Relationships
    lesson = relationship("Lesson", back_populates="content_blocks")


class Progress(Base, TimestampMixin):
    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    status = Column(
        Enum("not_started", "in_progress", "completed", name="progress_status")
    )
    completed_at = Column(DateTime)

    # Relationships
    lesson = relationship("Lesson", back_populates="progress_records")

import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

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
    auth_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(
        Enum("admin", "teacher", "student", name="user_roles"), nullable=False
    )

    # Relationships
    taught_classes = relationship("Class", back_populates="teacher")
    enrollments = relationship("ClassEnrollment", back_populates="student")


class Class(Base, TimestampMixin):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    teacher = relationship("User", back_populates="taught_classes")
    enrollments = relationship("ClassEnrollment", back_populates="class_")
    courses = relationship("Course", back_populates="class_")


class ClassEnrollment(Base, TimestampMixin):
    __tablename__ = "class_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum("active", "completed", "dropped", name="enrollment_status"))
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    class_ = relationship("Class", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments")


class Course(Base, TimestampMixin):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    structure = Column(JSON)

    # Relationships
    class_ = relationship("Class", back_populates="courses")
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

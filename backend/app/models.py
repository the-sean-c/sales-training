from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    auth0_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum("admin", "teacher", "student", name="user_roles"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    taught_classes = relationship("Class", back_populates="teacher")
    enrollments = relationship("ClassEnrollment", back_populates="student")

class Class(Base):
    __tablename__ = "classes"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    teacher_id = Column(UUID(), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    teacher = relationship("User", back_populates="taught_classes")
    enrollments = relationship("ClassEnrollment", back_populates="class_")
    courses = relationship("Course", back_populates="class_")

class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(), ForeignKey("classes.id"), nullable=False)
    student_id = Column(UUID(), ForeignKey("users.id"), nullable=False)
    status = Column(Enum("active", "completed", "dropped", name="enrollment_status"))
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    class_ = relationship("Class", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(UUID(), ForeignKey("users.id"), nullable=False)
    class_id = Column(UUID(), ForeignKey("classes.id"), nullable=False)
    structure = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    class_ = relationship("Class", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(), ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    structure = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    course = relationship("Course", back_populates="lessons")
    content_blocks = relationship("ContentBlock", back_populates="lesson")
    progress_records = relationship("Progress", back_populates="lesson")

class ContentBlock(Base):
    __tablename__ = "content_blocks"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(), ForeignKey("lessons.id"), nullable=False)
    order = Column(Integer, nullable=False)
    type = Column(Enum("video", "text", "image", "interactive", name="content_types"))
    content = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="content_blocks")

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(), ForeignKey("lessons.id"), nullable=False)
    status = Column(Enum("not_started", "in_progress", "completed", name="progress_status"))
    completed_at = Column(DateTime)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="progress_records")

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

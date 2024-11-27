# Sales Training Backend

A FastAPI-based backend service for the Sales Training application that handles authentication, course management, and user progress tracking.

## Features

- Auth0 integration for secure authentication
- Role-based access control (Admin, Teacher, Student)
- Course management API endpoints
- User progress tracking
- Real-time analytics
- Secure API endpoints with JWT validation

## Prerequisites

- Python 3.8+
- PostgreSQL
- Auth0 account and credentials
- PDM (Python Development Master) for dependency management

## Installation

1. Install PDM if you haven't already:
```bash
pip install --user pdm
```

2. Install project dependencies:
```bash
pdm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sales_training
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_API_AUDIENCE=your-api-audience
```

## Running the Application

1. Start the development server:
```bash
pdm run uvicorn backend.main:app --reload
```

2. The API will be available at `http://localhost:8000`
3. API documentation will be available at `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/role` - Set user role

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create a new course (Teacher/Admin only)
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course (Teacher/Admin only)
- `DELETE /api/courses/{id}` - Delete course (Admin only)

### Progress
- `GET /api/progress` - Get user's learning progress
- `POST /api/progress/{course_id}` - Update progress for a course

## Development

### Project Structure
```
backend/
├── src/
│   └── backend/
│       ├── auth.py       # Authentication and authorization
│       ├── crud.py       # Database CRUD operations
│       ├── database.py   # Database connection and session management
│       ├── main.py       # FastAPI application and routes
│       ├── models.py     # SQLAlchemy models
│       └── schemas.py    # Pydantic data models
├── tests/
├── pyproject.toml
└── README.md
```

### Database Operations

The `crud.py` module provides a clean interface for database operations:

#### User Operations
- `get_user(db, user_id)` - Get user by ID
- `get_user_by_email(db, email)` - Get user by email
- `get_users(db, skip, limit)` - Get paginated list of users

#### Class Operations
- `create_class(db, name, teacher_id, description)` - Create a new class
- `get_class(db, class_id)` - Get class by ID
- `get_teacher_classes(db, teacher_id)` - Get all classes for a teacher

#### Course Operations
- `create_course(db, name, class_id, created_by, description, structure)` - Create a new course
- `get_course(db, course_id)` - Get course by ID
- `get_class_courses(db, class_id)` - Get all courses in a class

#### Lesson Operations
- `create_lesson(db, course_id, title, order, structure)` - Create a new lesson
- `get_lesson(db, lesson_id)` - Get lesson by ID
- `get_course_lessons(db, course_id)` - Get ordered list of lessons in a course

#### Progress Operations
- `get_or_create_progress(db, student_id, lesson_id)` - Get or initialize progress record
- `update_progress(db, progress_id, status)` - Update progress status
- `get_student_progress(db, student_id, lesson_id)` - Get student's progress

### Adding Dependencies

To add a new dependency:
```bash
pdm add package_name
```

To add a development dependency:
```bash
pdm add -d package_name
```

### Testing

Run tests using pytest:
```bash
pdm run pytest
```

### Database Migrations

Using Alembic for database migrations:
```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head
```

## Security

- All endpoints are protected with Auth0 JWT validation
- Role-based access control implemented at the API level
- Database credentials and sensitive data are stored in environment variables
- Input validation and sanitization using Pydantic models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

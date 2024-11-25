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
pdm run uvicorn app.main:app --reload
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
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── courses.py
│   │   └── progress.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── models.py
│   │   └── session.py
│   └── main.py
├── tests/
├── pdm.toml
└── README.md
```

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

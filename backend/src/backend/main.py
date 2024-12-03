import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.auth import app as auth_app
from backend.database import init_db
from backend.routes import courses, users

# Configure logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sales Training API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include the auth app
app.mount("/auth", auth_app)

# Include API routes
app.include_router(courses.router, prefix="/api/v1/courses")
app.include_router(users.router, prefix="/api/v1/users")


@app.get("/")
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.on_event("startup")
async def startup_event():
    await init_db()

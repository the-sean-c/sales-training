from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import get_current_user
from .auth import router as auth_router
from .database import init_db
from .models import User

app = FastAPI(title="Sales Training API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/")
async def root(current_user: User = Depends(get_current_user)):
    return {"message": "Welcome to the Sales Training API"}


@app.on_event("startup")
async def startup_event():
    await init_db()

import logging

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import app as auth_app
from .auth import get_user_info, requires_auth
from .database import get_session, init_db
from .models import User

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


@app.get("/")
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/api/users/me")
async def get_current_user_info(
    token: dict = Depends(requires_auth), session: AsyncSession = Depends(get_session)
):
    try:
        # Get user info from Auth0 (includes email)
        user_info = await get_user_info(token)
        logger.debug(f"User info from Auth0: {user_info}")

        # Get user from database based on Auth0 ID
        auth0_id = token.get("sub")
        email = user_info.get("email")
        logger.debug(f"Looking up user with auth0_id: {auth0_id}, email: {email}")

        result = await session.execute(select(User).where(User.auth0_id == auth0_id))
        user = result.scalar_one_or_none()

        if not user:
            logger.debug(f"Creating new user for auth0_id: {auth0_id}")
            if not email:
                logger.error("No email found in user info!")
                raise HTTPException(
                    status_code=400,
                    detail="Email is required but not found in the user info. Make sure your Auth0 configuration includes email.",
                )

            # Create new user if not exists
            user = User(
                auth0_id=auth0_id,
                email=email,
                role="student",  # Default role for new users
            )
            session.add(user)
            await session.commit()
            logger.debug("New user created successfully")

        return {"id": str(user.id), "email": user.email, "role": user.role}
    except Exception as e:
        logger.error(f"Error in get_current_user_info: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/users")
async def get_all_users(
    token: dict = Depends(requires_auth), session: AsyncSession = Depends(get_session)
):
    try:
        auth0_id = token.get("sub")

        # Get the user's role from our database
        result = await session.execute(select(User).where(User.auth0_id == auth0_id))
        user = result.scalar_one_or_none()

        if not user or user.role != "admin":
            raise HTTPException(
                status_code=403, detail="Only administrators can view all users"
            )

        # Get all users
        result = await session.execute(select(User))
        users = result.scalars().all()

        # Convert to list of dicts
        return [
            {
                "id": str(user.id),
                "sub": user.auth0_id,  # Needed for role management
                "email": user.email,
                "role": user.role,
            }
            for user in users
        ]

    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/protected")
async def protected_endpoint(user: User = Depends(requires_auth)):
    return {"message": "Access granted", "user": user}


@app.on_event("startup")
async def startup_event():
    await init_db()

import logging

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import app as auth_app
from .auth import requires_auth
from .database import get_session, init_db
from .models import User

# Configure logging
logging.basicConfig(level=logging.DEBUG)
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
        logger.debug(f"Token received in /api/users/me: {token}")
        logger.debug(f"Token keys available: {token.keys()}")

        # Get user from database based on Auth0 ID
        auth0_id = token.get("sub")
        email = token.get("email")
        logger.debug(f"Looking up user with auth0_id: {auth0_id}, email: {email}")

        result = await session.execute(select(User).where(User.auth0_id == auth0_id))
        user = result.scalar_one_or_none()

        if not user:
            logger.debug(f"Creating new user for auth0_id: {auth0_id}")
            if not email:
                logger.error("No email found in token!")
                raise HTTPException(
                    status_code=400,
                    detail="Email is required but not found in the token. Make sure your Auth0 token includes email.",
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


@app.get("/protected")
async def protected_endpoint(user: User = Depends(requires_auth)):
    return {"message": "Access granted", "user": user}


@app.on_event("startup")
async def startup_event():
    await init_db()

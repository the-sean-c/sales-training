import os
import logging
import json
from typing import Optional, Dict
from uuid import UUID
import httpx
from urllib.parse import urljoin

from fastapi import APIRouter, Depends, HTTPException, status, Body, Security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import select

from .database import get_session
from .models import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TokenData(BaseModel):
    email: Optional[str] = None
    sub: str

class Auth0Settings:
    """Auth0 settings from environment variables"""
    DOMAIN = os.getenv("AUTH0_DOMAIN", "onedigital-ai-dev.us.auth0.com")
    API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE", "http://localhost:8000/api/v1")
    ISSUER = f"https://{DOMAIN}/"
    ALGORITHMS = ["RS256"]
    _JWKS = None

    @classmethod
    async def get_jwks(cls) -> Dict:
        """Fetch JWKS from Auth0"""
        if cls._JWKS is None:
            logger.info(f"Fetching JWKS from {cls.ISSUER}.well-known/jwks.json")
            jwks_url = urljoin(cls.ISSUER, ".well-known/jwks.json")
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(jwks_url)
                    response.raise_for_status()
                    cls._JWKS = response.json()
                    logger.info(f"Successfully fetched JWKS: {json.dumps(cls._JWKS, indent=2)}")
                except Exception as e:
                    logger.error(f"Error fetching JWKS: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Unable to fetch authentication keys"
                    )
        return cls._JWKS

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", scheme_name="JWT")
router = APIRouter()

def verify_scopes(required_scopes: list[str], token_scopes: str) -> bool:
    """Verify that the token has all required scopes"""
    if not token_scopes:
        return False
    token_scopes_list = token_scopes.split()
    return all(scope in token_scopes_list for scope in required_scopes)

async def get_current_user(
    token: str = Depends(oauth2_scheme), session=Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        logger.info("Received token for validation")
        if not token:
            logger.error("No token provided")
            raise credentials_exception
            
        # Log first few characters of token for debugging
        logger.info(f"Token preview: {token[:30]}...")
        
        logger.info("Decoding JWT token")
        try:
            # First try to decode the token header without verification
            unverified_header = jwt.get_unverified_header(token)
            logger.info(f"Token header: {unverified_header}")
            
            # Get the key id from the header
            kid = unverified_header.get("kid")
            if not kid:
                logger.error("No 'kid' in token header")
                raise credentials_exception

            # Get the JWKS from Auth0
            jwks = await Auth0Settings.get_jwks()
            
            # Find the right key
            rsa_key = None
            for key in jwks.get("keys", []):
                if key.get("kid") == kid:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break

            if not rsa_key:
                logger.error(f"No matching key found for kid: {kid}")
                raise credentials_exception

            logger.info("Verifying token signature")
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=Auth0Settings.ALGORITHMS,
                audience=Auth0Settings.API_AUDIENCE,
                issuer=Auth0Settings.ISSUER
            )
            logger.info(f"Token payload: {payload}")

            # Verify required scopes
            if not verify_scopes(['read:profile'], payload.get('scope', '')):
                logger.error("Token missing required scopes")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )

        except JWTError as e:
            logger.error(f"JWT validation error: {str(e)}")
            raise credentials_exception
        except Exception as e:
            logger.error(f"Error decoding token: {str(e)}")
            raise credentials_exception

        sub: str = payload.get("sub")
        if not sub:
            logger.error("No 'sub' claim in token")
            raise credentials_exception

        token_data = TokenData(sub=sub, email=payload.get("email"))
        logger.info(f"Token validated for user: {token_data.email}")

    except Exception as e:
        logger.error(f"Unexpected error during token validation: {str(e)}")
        raise credentials_exception

    # Get user from database
    try:
        logger.info(f"Looking up user with auth0_id: {token_data.sub}")
        async with session as db:
            result = await db.execute(select(User).where(User.auth0_id == token_data.sub))
            user = result.scalar_one_or_none()

            if user is None:
                # Verify write:profile scope before creating new user
                if not verify_scopes(['write:profile'], payload.get('scope', '')):
                    logger.error("Token missing write:profile scope")
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Insufficient permissions to create profile"
                    )

                logger.info(f"Creating new user with email: {token_data.email}")
                user = User(
                    auth0_id=token_data.sub,
                    email=token_data.email,
                    role="student",  # Default role
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
                logger.info(f"Created new user with ID: {user.id}")

        return user
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user

def get_admin_user(current_user: User = Security(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can perform this action",
        )
    return current_user

@router.get("/api/users/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
    }

@router.put("/api/users/{user_id}/role")
async def update_user_role(
    user_id: UUID,
    role: str = Body(..., embed=True),
    session=Depends(get_session),
    admin_user: User = Depends(get_admin_user),
    token: str = Depends(oauth2_scheme)
):
    """Update a user's role. Only administrators can perform this action."""
    try:
        # Decode token to check scopes
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        jwks = await Auth0Settings.get_jwks()
        rsa_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=Auth0Settings.ALGORITHMS,
            audience=Auth0Settings.API_AUDIENCE,
            issuer=Auth0Settings.ISSUER
        )

        # Verify write:roles scope
        if not verify_scopes(['write:roles'], payload.get('scope', '')):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to update roles"
            )

        if role not in ["admin", "teacher", "student"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Must be one of: admin, teacher, student",
            )
        
        async with session as db:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
                
            user.role = role
            await db.commit()
            await db.refresh(user)
            
        return {"id": str(user.id), "email": user.email, "role": user.role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user role: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the role"
        )

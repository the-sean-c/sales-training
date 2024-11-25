from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from .database import get_session
from sqlalchemy import select
from .models import User

class TokenData(BaseModel):
    email: Optional[str] = None
    sub: str

class Auth0Settings:
    """Auth0 settings - replace these with your Auth0 credentials"""
    DOMAIN = "your-domain.auth0.com"
    API_AUDIENCE = "your-api-identifier"
    ALGORITHMS = ["RS256"]
    
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{Auth0Settings.DOMAIN}/authorize",
    tokenUrl=f"https://{Auth0Settings.DOMAIN}/oauth/token"
)

async def get_current_user(token: str = Depends(oauth2_scheme), session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify and decode the JWT token
        jwks_url = f"https://{Auth0Settings.DOMAIN}/.well-known/jwks.json"
        payload = jwt.decode(
            token,
            jwks_url,
            algorithms=Auth0Settings.ALGORITHMS,
            audience=Auth0Settings.API_AUDIENCE
        )
        
        sub: str = payload.get("sub")
        if not sub:
            raise credentials_exception
            
        token_data = TokenData(sub=sub, email=payload.get("email"))
        
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    async with session as db:
        result = await db.execute(select(User).where(User.auth0_id == token_data.sub))
        user = result.scalar_one_or_none()
        
        if user is None:
            # Create new user if they don't exist
            user = User(
                auth0_id=token_data.sub,
                email=token_data.email,
                role="student"  # Default role for new users
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user

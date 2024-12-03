import logging
import os
import time
from typing import Dict, Optional, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db_session
from backend.models import User, UserRole

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
ALGORITHMS = ["RS256"]

logger.debug(f"Auth0 Domain: {AUTH0_DOMAIN}")
logger.debug(f"API Audience: {API_AUDIENCE}")

app = FastAPI()

# Cache for JWKS response (data, timestamp)
jwks_cache: Optional[Tuple[Dict, float]] = None
jwks_cache_ttl = 600  # 10 minutes

# Cache for user info (dict of sub -> (data, timestamp))
user_info_cache: Dict[str, Tuple[Dict, float]] = {}
user_info_cache_ttl = 300  # 5 minutes


# Exception for Auth errors
class AuthError(Exception):
    def __init__(self, error: Dict, status_code: int):
        self.error = error
        self.status_code = status_code


# FastAPI Exception handler for AuthError
@app.exception_handler(AuthError)
async def auth_exception_handler(request: Request, exc: AuthError):
    return {"error": exc.error, "status_code": exc.status_code}


# Dependency to extract the token from the Authorization header
def get_token_auth_header(request: Request) -> str:
    """Obtains the Access Token from the Authorization Header."""
    auth = request.headers.get("Authorization")
    if not auth:
        raise AuthError(
            {
                "code": "authorization_header_missing",
                "description": "Authorization header is expected",
            },
            401,
        )

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must start with Bearer",
            },
            401,
        )
    elif len(parts) == 1:
        raise AuthError(
            {"code": "invalid_header", "description": "Token not found"}, 401
        )
    elif len(parts) > 2:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must be Bearer token",
            },
            401,
        )

    return parts[1]


async def get_jwks():
    """Fetch the JWKS from the Auth0 domain and cache it."""
    global jwks_cache
    try:
        # Return cached JWKS if available and not expired
        current_time = time.time()
        if jwks_cache is not None:
            cache_data, cache_time = jwks_cache
            if current_time - cache_time < jwks_cache_ttl:
                return cache_data

        # Fetch new JWKS
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
            response.raise_for_status()
            jwks_data = response.json()
            jwks_cache = (jwks_data, current_time)
            return jwks_data
    except Exception as e:
        logger.error(f"Failed to fetch JWKS: {str(e)}")
        raise AuthError(
            {"code": "jwks_error", "description": f"Failed to fetch JWKS: {str(e)}"},
            500,
        )


async def get_user_info(token: Dict) -> Dict:
    """Fetch user info from Auth0's userinfo endpoint with caching."""
    try:
        sub = token.get("sub")
        if not sub:
            raise AuthError(
                {
                    "code": "invalid_token",
                    "description": "No sub claim found in token",
                },
                401,
            )

        # Check cache first
        current_time = time.time()
        if sub in user_info_cache:
            cached_info, timestamp = user_info_cache[sub]
            if current_time - timestamp < user_info_cache_ttl:
                logger.debug("Returning cached user info")
                return cached_info

        # Get the raw token from the Authorization header
        raw_token = token.get("raw_token")
        if not raw_token:
            logger.error("No raw token found in token dict")
            raise AuthError(
                {
                    "code": "invalid_token",
                    "description": "No raw token found for userinfo request",
                },
                401,
            )

        # Fetch user info from Auth0
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://{AUTH0_DOMAIN}/userinfo",
                headers={"Authorization": f"Bearer {raw_token}"},
            )

            if response.status_code == 200:
                user_info = response.json()
                logger.debug(f"User info fetched successfully: {user_info}")
                # Cache the result
                user_info_cache[sub] = (user_info, current_time)
                return user_info
            elif response.status_code == 429:  # Rate limit hit
                # Try to use cached data even if expired
                if sub in user_info_cache:
                    logger.warning("Rate limit hit, using expired cache data")
                    return user_info_cache[sub][0]
                else:
                    logger.error(
                        f"Rate limit hit and no cache available: {response.text}"
                    )
                    raise AuthError(
                        {
                            "code": "rate_limit",
                            "description": "Rate limit exceeded and no cached data available",
                        },
                        429,
                    )
            else:
                logger.error(f"Failed to fetch user info: {response.text}")
                raise AuthError(
                    {
                        "code": "userinfo_error",
                        "description": f"Failed to fetch user info: {response.text}",
                    },
                    response.status_code,
                )

    except Exception as e:
        logger.error(f"Error fetching user info: {str(e)}")
        raise AuthError(
            {
                "code": "userinfo_error",
                "description": f"Error fetching user info: {str(e)}",
            },
            500,
        )


# Validate the JWT token
async def requires_auth(token: str = Depends(get_token_auth_header)) -> Dict:
    """Determines if the Access Token is valid."""
    try:
        token = token.strip()  # Remove any whitespace
        logger.debug("Token received for validation")

        try:
            unverified_header = jwt.get_unverified_header(token)
            logger.debug(f"Unverified header: {unverified_header}")

        except JWTError as e:
            logger.error(f"Failed to decode token header: {e}")
            raise AuthError(
                {
                    "code": "invalid_header",
                    "description": f"Invalid token header: {str(e)}",
                },
                401,
            )

        if not unverified_header.get("kid"):
            logger.error(f"No 'kid' in token header: {unverified_header}")
            raise AuthError(
                {
                    "code": "invalid_header",
                    "description": "Token header is missing 'kid' claim",
                    "unverified_header": unverified_header,
                },
                401,
            )

        # Get JWKS
        jwks = await get_jwks()
        logger.debug("JWKS fetched successfully")

        # Find the matching key
        rsa_key = None
        for key in jwks.get("keys", []):
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                break

        if not rsa_key:
            logger.error("No matching key found in JWKS")
            raise AuthError(
                {
                    "code": "invalid_key",
                    "description": "Unable to find appropriate key",
                },
                401,
            )

        try:
            logger.debug("Attempting to decode token")
            # Verify the token
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/",
            )
            logger.debug("Token decoded successfully")
            # Store the raw token for userinfo requests
            payload["raw_token"] = token
            return payload

        except jwt.ExpiredSignatureError as e:
            logger.error(f"Token expired: {e}")
            raise AuthError(
                {"code": "token_expired", "description": "Token has expired"},
                401,
            )
        except jwt.JWTClaimsError as e:
            logger.error(f"Invalid claims: {e}")
            raise AuthError(
                {"code": "invalid_claims", "description": f"Invalid claims: {str(e)}"},
                401,
            )
        except Exception as e:
            logger.error(f"Failed to decode token: {e}")
            raise AuthError(
                {"code": "invalid_token", "description": f"Invalid token: {str(e)}"},
                401,
            )

    except AuthError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in auth: {e}")
        raise AuthError(
            {
                "code": "invalid_token",
                "description": f"Unable to parse authentication token: {str(e)}",
            },
            401,
        )


async def user_has_access_rights(
    token: dict,
    allowed_roles: list[UserRole],
    session: AsyncSession = Depends(get_db_session),
) -> bool:
    """Check if the user has the required access permissions."""
    sub = token.get("sub")

    result = await session.execute(select(User).where(User.sub == sub))
    user = result.scalar_one_or_none()

    if not user or user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions.")

    return True

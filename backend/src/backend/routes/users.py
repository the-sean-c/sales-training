import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_user_info, requires_auth, user_has_access_rights
from backend.database import get_db_session
from backend.models import User, UserRole
from backend.schemas import UserRead

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


router = APIRouter()


@router.get("/me")
async def get_current_user_info(
    token: dict = Depends(requires_auth),
    db_session: AsyncSession = Depends(get_db_session),
):
    """Get the current user's info, including email and role."""
    try:
        user_info = await get_user_info(token)

        sub = token.get("sub")
        email = user_info.get("email")

        result = await db_session.execute(select(User).where(User.sub == sub))
        user = result.scalar_one_or_none()

        if not user:
            if not email:
                logger.error("New User missing require email.")
                raise HTTPException(
                    status_code=400,
                    detail="Email is required but not found in the user info.",
                )

            # Create new user if not exists
            user = User(
                sub=sub,
                email=email,
                role=UserRole.student,
            )
            db_session.add(user)
            await db_session.commit()

        return {"id": str(user.id), "email": user.email, "role": user.role}
    except Exception as e:
        logger.error(f"Error in get_current_user_info: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all", response_model=list[UserRead])
async def get_all_users(
    token: dict = Depends(requires_auth),
    db_session: AsyncSession = Depends(get_db_session),
):
    try:
        _ = await user_has_access_rights(token, [UserRole.admin], db_session)

        result = await db_session.execute(select(User))
        users = result.scalars().all()

        return [UserRead.from_orm(user) for user in users]

    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/stats")
async def get_admin_stats(
    token: dict = Depends(requires_auth),
    db_session: AsyncSession = Depends(get_db_session),
):
    try:
        _ = await user_has_access_rights(token, [UserRole.admin], db_session)

        # Return dummy data for now
        return {
            "totalUsers": 42,
            "totalCourses": 15,
            "totalClasses": 8,
            "activeStudents": 156,
        }

    except Exception as e:
        logger.error(f"Error in get_admin_stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/role")
async def update_user_role(
    user_update: dict,
    token: dict = Depends(requires_auth),
    db_session: AsyncSession = Depends(get_db_session),
):
    try:
        _ = await user_has_access_rights(token, [UserRole.admin], db_session)

        # Get the target user
        target_user_id = user_update.get("userId")
        new_role = user_update.get("role")

        if not target_user_id or not new_role:
            raise HTTPException(status_code=400, detail="userId and role are required")

        # Validate the role
        try:
            role = UserRole(new_role)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role. Must be one of: {', '.join(UserRole.__members__)}",
            )

        # Get and update the target user
        result = await db_session.execute(
            select(User).where(User.sub == target_user_id)
        )
        target_user = result.scalar_one_or_none()

        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")

        target_user.role = role
        await db_session.commit()

        return {
            "message": "Role updated successfully",
            "user": UserRead.from_orm(target_user),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user role: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

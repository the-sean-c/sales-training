import asyncio
import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from .models import Base, User
from .database import SQLALCHEMY_DATABASE_URL

async def init_db():
    # Create async engine
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create async session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    # Create test users
    test_users = [
        User(
            id=uuid.uuid4(),
            auth0_id="auth0|admin",
            email="admin@example.com",
            role="admin",
            created_at=datetime.utcnow()
        ),
        User(
            id=uuid.uuid4(),
            auth0_id="auth0|teacher",
            email="teacher@example.com",
            role="teacher",
            created_at=datetime.utcnow()
        ),
        User(
            id=uuid.uuid4(),
            auth0_id="auth0|student",
            email="student@example.com",
            role="student",
            created_at=datetime.utcnow()
        )
    ]
    
    async with async_session() as session:
        for user in test_users:
            session.add(user)
        await session.commit()

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())

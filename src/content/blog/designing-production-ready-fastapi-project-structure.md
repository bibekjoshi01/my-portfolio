---
title: Designing a Production-Ready FastAPI Project Structure
description: Building a FastAPI application that survives the jump to production is about far more than writing fast endpoints. Folder layout, async database setup, environment configuration, middleware, testing, and Docker all need to work together from day one. This guide walks you through every layer of a production-grade FastAPI project with working code you can copy directly into your own setup.
publishedDate: 2026-03-01
updatedDate: 2026-03-01
author: Bibek Joshi
tags:
  - FastAPI
  - Good Practices
  - Docker
  - Production
category: Backend Engineering
featuredImage: ./images/performance-budgets.png
draft: false
---

## Table of Contents

1. [Why Structure Matters](#why-structure-matters)
2. [Choosing Your Architecture Pattern](#choosing-your-architecture-pattern)
3. [The Production-Ready Folder Structure](#the-production-ready-folder-structure)
4. [Breaking Down Each Layer](#breaking-down-each-layer)
   - [Entry Point: `main.py`](#entry-point-mainpy)
   - [Configuration Management](#configuration-management)
   - [Routers / API Layer](#routers--api-layer)
   - [Schemas (Pydantic)](#schemas-pydantic)
   - [Models (SQLAlchemy / SQLModel)](#models-sqlalchemy--sqlmodel)
   - [Services / Business Logic](#services--business-logic)
   - [Dependencies](#dependencies)
   - [Database Setup](#database-setup)
   - [Migrations with Alembic](#migrations-with-alembic)
5. [Async Best Practices](#async-best-practices)
6. [Error Handling](#error-handling)
7. [Middleware & Logging](#middleware--logging)
8. [API Versioning](#api-versioning)
9. [Testing Strategy](#testing-strategy)
10. [Dockerizing Your FastAPI App](#dockerizing-your-fastapi-app)
11. [Production Deployment Tips](#production-deployment-tips)
12. [Final Checklist](#final-checklist)

---

## Why Structure Matters

When you first spin up a FastAPI app, everything fits comfortably in a single `main.py`. It's quick, it's clean, and it gets the job done. But as features multiply, that single file balloons into an unmaintainable tangle of routes, models, and business logic, all colliding in one place.

A well-thought-out project structure is the foundation of every production-grade API. It directly impacts:

- **Scalability**: Clean separation of concerns lets you grow the codebase without regressions.
- **Maintainability**: Any developer can navigate the project and understand where things live.
- **Testability**: Isolated layers (routes, services, repositories) make unit and integration tests straightforward.
- **Team Collaboration**: Clear module boundaries let multiple developers work in parallel without merge conflicts.
- **Onboarding Speed**: A predictable structure means new team members become productive much faster.

Putting this off "until the project gets bigger" is the #1 mistake FastAPI developers make. A good structure costs almost nothing to set up early and pays dividends indefinitely.

---

## Choosing Your Architecture Pattern

There are two primary ways to organize a FastAPI project:

### 1. File-Type Structure (Technical Layering)

Files are grouped by their technical role — all routers together, all models together, all schemas together. This works well for **microservices** with a narrow, single responsibility.

```
app/
├── __init__.py
├── routers/
├── models/
├── schemas/
├── services/
└── main.py
```

### 2. Module-Functionality Structure (Domain-Driven)

Files are grouped by **domain or feature** — everything related to `users` lives in a `users/` package, everything related to `orders` lives in `orders/`, and so on. This pattern scales better for **larger monolithic applications** and is more intuitive as the codebase grows.

```
app/
├── __init__.py
├── users/
│   ├── router.py
│   ├── models.py
│   ├── schemas.py
│   └── service.py
├── orders/
│   ├── router.py
│   └── ...
```

**Recommendation:** For most real-world projects, a **hybrid approach** works best — a top-level technical layer (`api/`, `core/`, `db/`) with domain-specific modules inside the API layer. This is what the structure below implements.


## The Production-Ready Folder Structure

```
myapp/
├── app/
│   ├── __init__.py
│   ├── main.py                  # App factory & lifespan
│   ├── dependencies.py          # Shared FastAPI dependencies
│   │
│   ├── api/                     # All API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py        # Aggregates all v1 routers
│   │   │   ├── users.py
│   │   │   ├── items.py
│   │   │   └── health.py
│   │   └── v2/                  # Future API version
│   │
│   ├── core/                    # App-wide configuration & security
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic Settings
│   │   ├── security.py          # JWT, OAuth, password hashing
│   │   └── exceptions.py        # Custom exception classes
│   │
│   ├── db/                      # Database layer
│   │   ├── __init__.py
│   │   ├── session.py           # Async engine & session factory
│   │   └── base.py              # SQLAlchemy declarative Base
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── item.py
│   │
│   ├── schemas/                 # Pydantic request/response models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── item.py
│   │
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── item_service.py
│   │
│   └── middleware/              # Custom middleware
│       ├── __init__.py
│       └── logging.py
│
├── migrations/                  # Alembic migration files
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Pytest fixtures
│   ├── test_users.py
│   └── test_items.py
│
├── .env                         # Environment variables (never commit)
├── .env.example                 # Template for environment variables
├── .gitignore
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
└── README.md
```

---

## Breaking Down Each Layer

### Entry Point: `main.py`

The `main.py` file should be thin. Its only job is to create the FastAPI application instance, register routers, attach middleware, and manage the app lifecycle.

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix="/api/v1")

    return application


app = create_application()
```

> **Note:** The `lifespan` context manager (introduced in FastAPI 0.93+) replaces the deprecated `@app.on_event("startup")` and `@app.on_event("shutdown")` decorators. Always use `lifespan` in new projects.


### Configuration Management

Never hardcode secrets or environment-specific settings. Use **Pydantic Settings** to read from environment variables with full type validation.

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "MyFastAPIApp"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | staging | production

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
```

Your `.env` file (never committed to version control):

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/mydb
SECRET_KEY=your-super-secret-key-here
ENVIRONMENT=development
ALLOWED_ORIGINS=["http://localhost:3000","https://yourfrontend.com"]
```

Always provide a `.env.example` with placeholder values for teammates to reference.


### Routers / API Layer

Each resource gets its own router file. The `v1/router.py` aggregates all sub-routers into a single include.

```python
# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1 import users, items, health

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(items.router, prefix="/items", tags=["Items"])
```

Keep route handlers thin — they should only handle HTTP concerns (status codes, request parsing, response shaping), and delegate all logic to the service layer.

```python
# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    user = await service.create_user(user_in)
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```


### Schemas (Pydantic)

Schemas define what data goes **in** and **out** of your API. They are not your database models. Keeping them separate gives you full control over what you expose to clients.

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # replaces orm_mode = True in Pydantic v2
```

**Key rules:**
- `UserCreate` contains fields needed to create a record (including `password`)
- `UserResponse` never exposes `password` or other sensitive fields
- Always use `from_attributes = True` when returning ORM objects


### Models (SQLAlchemy / SQLModel)

Database models represent your actual table schema. They should be separate from Pydantic schemas.

```python
# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```


### Services / Business Logic

This is where the real application logic lives. Services receive a database session through dependency injection, execute queries, apply business rules, and return results. They know nothing about HTTP.

```python
# app/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user_in: UserCreate) -> User:
        # Check for duplicate email
        existing = await self.get_by_email(user_in.email)
        if existing:
            raise ValueError("Email already registered")

        user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=hash_password(user_in.password),
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()
```

> **Best practice:** Let your service raise Python-native exceptions (like `ValueError`). The router layer translates those into proper HTTP responses. This keeps your services reusable outside of HTTP contexts (e.g., background tasks, CLI commands).


### Dependencies

FastAPI's dependency injection system is one of its most powerful features. Use it for shared logic like authentication, database sessions, and permission checks.

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import decode_access_token
from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: int = payload.get("sub")
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user
```

FastAPI caches dependency results within a single request scope by default, so dependencies like `get_current_user` are only called once per request no matter how many route handlers reference them.


### Database Setup

Use async SQLAlchemy for non-blocking database access.

```python
# app/db/session.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.ENVIRONMENT == "development",
)

AsyncSessionFactory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionFactory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

```python
# app/db/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
```

**Connection pool settings explained:**
- `pool_pre_ping=True` — Verifies connections are alive before use (prevents "lost connection" errors)
- `pool_size=10` — Number of persistent connections to maintain
- `max_overflow=20` — Extra connections allowed beyond `pool_size` during spikes
- `expire_on_commit=False` — Avoids lazy-loading issues in async contexts


### Migrations with Alembic

Never rely on `Base.metadata.create_all()` in production. Use Alembic to version-control your schema changes.

```bash
# Initialize Alembic
alembic init migrations

# Create a new migration
alembic revision --autogenerate -m "create users table"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

Configure `migrations/env.py` to use your async engine and read `DATABASE_URL` from environment:

```python
# migrations/env.py (key sections)
import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from app.core.config import settings
from app.db.base import Base
import app.models  # noqa: F401 — ensures all models are imported

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata


def run_migrations_online():
    connectable = create_async_engine(settings.DATABASE_URL)

    async def do_run_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations_sync)

    def do_run_migrations_sync(connection):
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

    asyncio.run(do_run_migrations())
```

> **Important:** Always import all your model modules in `env.py` (e.g., `import app.models`). Alembic's autogenerate scans `Base.metadata`, which only knows about models that have been imported.

---

## Async Best Practices

FastAPI is async-first. Here's how to use that correctly:

**Use `async def` for I/O-bound operations:**
```python
@router.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # Database calls are I/O-bound — always await them
    return await service.get_by_id(user_id)
```

**Never block the event loop in async routes:**
```python
# This will freeze your entire server for every request
@router.get("/bad-example")
async def bad_route():
    import time
    time.sleep(5)  # Blocking! Use asyncio.sleep() instead
    return {"ok": True}
```

**Use `def` for CPU-bound work** — FastAPI automatically runs sync routes in a thread pool, so they won't block the event loop:
```python
@router.post("/process-image")
def process_image(file: UploadFile):
    # CPU-heavy image processing — sync is correct here
    result = heavy_cpu_computation(file)
    return result
```

**Use async dependencies too:**

Sync dependencies run in a threadpool unnecessarily for lightweight operations. Prefer `async def` for dependency functions that don't need to block.

---

## Error Handling

Centralize your error handling with custom exception classes and global exception handlers.

```python
# app/core/exceptions.py
class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


class NotFoundException(AppException):
    def __init__(self, resource: str):
        super().__init__(404, f"{resource} not found")


class ConflictException(AppException):
    def __init__(self, detail: str):
        super().__init__(409, detail)


class UnauthorizedException(AppException):
    def __init__(self):
        super().__init__(401, "Unauthorized")
```

Register a global handler in `main.py`:

```python
# app/main.py (inside create_application)
from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions import AppException

@application.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "type": type(exc).__name__},
    )

@application.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Log the exception here
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
```

Now your service layer can raise `NotFoundException("User")` and it automatically returns a clean `404` JSON response — no try/except blocks scattered across routes.

---

## Middleware & Logging

### Request Logging Middleware

Log every request with method, path, status code, and duration:

```python
# app/middleware/logging.py
import time
import logging
from fastapi import Request

logger = logging.getLogger(__name__)


async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        "request_completed",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2),
            "client_ip": request.client.host,
        },
    )
    return response
```

Register it in `main.py`:
```python
from starlette.middleware.base import BaseHTTPMiddleware
from app.middleware.logging import log_requests

application.add_middleware(BaseHTTPMiddleware, dispatch=log_requests)
```

### Structured Logging (Production)

For production, use structured JSON logging so logs can be parsed by tools like Datadog, Loki, or CloudWatch:

```python
# app/core/logging.py
import logging
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        if hasattr(record, "extra"):
            log_record.update(record.__dict__.get("extra", {}))
        return json.dumps(log_record)


def setup_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler])
```

---

## API Versioning

Always version your APIs from day one. It costs almost nothing and gives you the freedom to make breaking changes without disrupting existing clients.

The recommended approach is URL path versioning:

```
/api/v1/users
/api/v2/users  ← different response shape, same underlying data
```

Structure your routers accordingly:

```python
# app/api/v1/router.py
api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["v1 - Users"])

# app/api/v2/router.py
api_router_v2 = APIRouter()
api_router_v2.include_router(users_v2.router, prefix="/users", tags=["v2 - Users"])
```

Register both in `main.py`:
```python
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router_v2, prefix="/api/v2")
```

---

## Testing Strategy

### Directory Layout

Keep tests close to the source code they cover when using a domain-driven structure, or in a top-level `tests/` directory for simpler layouts:

```
tests/
├── conftest.py         # Shared fixtures
├── test_users.py
└── test_items.py
```

### Test Configuration

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
from app.db.session import get_db
from app.db.base import Base

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine):
    session_factory = async_sessionmaker(test_engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
```

### Writing Tests

```python
# tests/test_users.py
import pytest


@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "password": "securepassword"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "password" not in data  # Never expose password in response


@pytest.mark.asyncio
async def test_get_nonexistent_user(client):
    response = await client.get("/api/v1/users/99999")
    assert response.status_code == 404
```

Run tests with coverage:
```bash
pytest --cov=app --cov-report=html tests/
```

---

## Dockerizing Your FastAPI App

### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.12-slim

# Prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies separately for better layer caching
COPY requirements/prod.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run with gunicorn + uvicorn workers for production
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120", \
     "--access-logfile", "-"]
```

### docker-compose.yml

```yaml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/mydb
      - SECRET_KEY=${SECRET_KEY}
      - ENVIRONMENT=production
    depends_on:
      db:
        condition: service_healthy
    command: >
      sh -c "alembic upgrade head && 
             gunicorn app.main:app 
             --workers 4 
             --worker-class uvicorn.workers.UvicornWorker 
             --bind 0.0.0.0:8000"

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

> **Note:** Running `alembic upgrade head` before starting the server ensures your database schema is always up-to-date on every deployment.

---

## Production Deployment Tips

### Workers and Performance

```bash
# Development — single worker, hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production — never use --reload
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

**Workers formula:** `(2 × CPU cores) + 1` is a common starting point. For an I/O-bound FastAPI app, you can often run fewer workers because async handles concurrency within a single process.

### Health Check Endpoint

Always expose a `/health` endpoint for load balancers and container orchestrators:

```python
# app/api/v1/health.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/")
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "ok"}
    except Exception:
        return {"status": "unhealthy", "database": "error"}, 503
```

### Security Checklist

- **HTTPS only** — Terminate SSL at your load balancer (Nginx, Traefik, or a cloud provider)
- **CORS** — Restrict `ALLOWED_ORIGINS` to your actual frontend domains in production
- **Secrets** — Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) — never put real credentials in `.env` files in production
- **Rate Limiting** — Add `slowapi` or handle at the Nginx/API gateway level
- **Disable debug docs in production:**

```python
application = FastAPI(
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
)
```

### Requirements Split

```
requirements/
├── base.txt    # Shared by all environments
├── dev.txt     # Includes pytest, httpx, aiosqlite, black, ruff
└── prod.txt    # Includes gunicorn, sentry-sdk, structlog
```

---

## Final Checklist

Before calling your FastAPI project production-ready, run through this checklist:

**Project Structure**
- [ ] Routes, models, schemas, and services are in separate modules
- [ ] Configuration is managed via Pydantic Settings, reading from environment variables
- [ ] No secrets or credentials are hardcoded anywhere

**Database**
- [ ] Using async SQLAlchemy with connection pooling
- [ ] Alembic is set up for schema migrations
- [ ] `alembic upgrade head` runs before app startup in Docker

**API Design**
- [ ] API is versioned (`/api/v1/...`)
- [ ] Route handlers are thin and business logic lives in services
- [ ] All endpoints have `response_model` declared
- [ ] Sensitive fields (passwords, tokens) are excluded from response schemas

**Error Handling & Logging**
- [ ] Global exception handlers are registered
- [ ] Structured JSON logging is configured for production
- [ ] Request logging middleware is in place

**Security**
- [ ] JWT authentication implemented and working
- [ ] CORS is restricted to known origins
- [ ] API docs are disabled in production

**Testing**
- [ ] Unit tests for service layer
- [ ] Integration tests for routes using `AsyncClient`
- [ ] Test database is isolated (in-memory SQLite or a dedicated test DB)
- [ ] Coverage is measured and tracked

**Deployment**
- [ ] Dockerfile uses multi-stage or slim base images
- [ ] Gunicorn with Uvicorn workers (not `uvicorn --reload`) in production
- [ ] Health check endpoint is available
- [ ] `--reload` flag is never used in production

---

## Wrapping Up

A production-ready FastAPI project isn't just about writing fast endpoints rather it's about building something that a team can maintain, scale, and trust in production. The structure presented here is personally I have been using alot and it separates concerns cleanly, makes testing trivial, and keeps business logic independent of the HTTP framework.

I strongly recommend starting with this structure even on small projects. The overhead is minimal, and you'll never hit the wall of "I need to refactor everything before I can add this feature."

The best time to set up a proper structure was when you started the project. The second best time is now 😉.

---

*Happy building.*
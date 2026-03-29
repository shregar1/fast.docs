// 8-Part Progressive Tutorial Series
// Builds a complete SaaS API with teams, billing, and webhooks

export const tutorialSeriesMarkdown = {
  'tutorial-overview': `# Tutorial Series Overview

Learn Fast by building a production-ready **SaaS API** for a project management tool called **TaskFlow**. This tutorial takes you from zero to deployed application.

## What You'll Build

A multi-tenant SaaS API with:
- ✅ User authentication with JWT
- ✅ Team/organization support
- ✅ Project and task management
- ✅ Role-based permissions
- ✅ Billing with Stripe integration
- ✅ Webhook notifications
- ✅ Real-time updates
- ✅ Background job processing

## Prerequisites

- Python 3.10+ installed
- Basic knowledge of Python and HTTP APIs
- PostgreSQL (or Docker for local development)

## Tutorial Structure

| Part | Topic | Time | What You'll Learn |
|------|-------|------|-------------------|
| 1 | [Your First Fast API](tutorial-part-1) | 15 min | Installation, project creation, "Hello World" |
| 2 | [Models & Persistence](tutorial-part-2) | 20 min | SQLAlchemy models, migrations, repositories |
| 3 | [REST API & Validation](tutorial-part-3) | 25 min | Endpoints, Pydantic, caching |
| 4 | [Authentication & Security](tutorial-part-4) | 25 min | JWT auth, field encryption, permissions |
| 5 | [Advanced Features](tutorial-part-5) | 30 min | Tracing, N+1 detection, Saga pattern |
| 6 | [Testing & Quality](tutorial-part-6) | 20 min | Testing with ItemFactory, coverage, pre-commit |
| 7 | [Production Deployment](tutorial-part-7) | 25 min | Docker, health checks, cloud deployment |
| 8 | [Real-time & GraphQL](tutorial-part-8) | 20 min | WebSockets, GraphQL, edge functions |

**Total Time: ~3 hours** to go from zero to production.

## Final Architecture

\`\`\`text
TaskFlow API
├── Auth Service (JWT, encryption)
├── Team Service (multi-tenant)
├── Project Service (CRUD, caching)
├── Billing Service (Stripe, saga pattern)
├── Notification Service (webhooks, websockets)
└── Admin Dashboard (GraphQL)
\`\`\`

Let's start with [Part 1](tutorial-part-1)!`,

  'tutorial-part-1': `# Tutorial Part 1: Your First Fast API

**Time: ~15 minutes**

Let's create your first Fast project and understand the basics.

## Step 1: Install Fast CLI

\`\`\`bash
# Install the Fast CLI tool
pip install fastmvc-cli

# Verify installation
fast --version
# Output: fast version 0.4.0
\`\`\`

## Step 2: Generate Your Project

\`\`\`bash
# Create a new project called "taskflow"
fast generate taskflow

# You'll see an interactive wizard:
# ? Project name: taskflow
# ? Database: PostgreSQL
# ? Include Redis: Yes
# ? Include Docker: Yes
# ? Enable tracing: Yes
# ? Enable field encryption: Yes

# Navigate to your project
cd taskflow
\`\`\`

## Step 3: Explore the Layout

\`\`\`text
taskflow/
├── app/
│   ├── main.py              # FastAPI application factory
│   ├── core/
│   │   ├── config.py        # Settings management
│   │   ├── security.py      # JWT, password hashing
│   │   └── logging.py       # Structured logging
│   ├── api/
│   │   ├── deps.py          # Dependencies (DB, auth)
│   │   └── v1/
│   │       ├── router.py    # API router aggregation
│   │       └── routes/
│   ├── services/            # Business logic layer
│   ├── repositories/        # Data access layer
│   ├── models/              # SQLAlchemy models
│   └── schemas/             # Pydantic DTOs
├── tests/
├── alembic/                 # Database migrations
├── docker-compose.yml
├── Dockerfile
└── pyproject.toml
\`\`\`

## Step 4: Configure Environment

\`\`\`bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
# DATABASE_URL=postgresql://user:pass@localhost/taskflow
# REDIS_URL=redis://localhost:6379/0
# SECRET_KEY=your-secret-key-here
\`\`\`

## Step 5: Run Your API

\`\`\`bash
# Start the development server
fast run

# Or with make
make dev
\`\`\`

Visit http://localhost:8000 - you'll see:
\`\`\`json
{
  "name": "taskflow",
  "version": "0.1.0",
  "docs": "/docs"
}
\`\`\`

Visit http://localhost:8000/docs to see the interactive OpenAPI documentation.

## Step 6: Create Your First Endpoint

Edit \`app/api/v1/routes/health.py\`:

\`\`\`python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "taskflow",
        "version": "0.1.0"
    }
\`\`\`

Register it in \`app/api/v1/router.py\`:

\`\`\`python
from fastapi import APIRouter
from app.api.v1.routes import health

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
\`\`\`

Test it:
\`\`\`bash
curl http://localhost:8000/api/v1/health
# {"status":"healthy","service":"taskflow","version":"0.1.0"}
\`\`\`

## What You Learned

- ✅ How to install and use the Fast CLI
- ✅ Project structure and conventions
- ✅ Environment configuration
- ✅ Creating and registering routes
- ✅ Running the development server

## Next Step

[Part 2: Models & Persistence](tutorial-part-2) - Learn to build your data layer with SQLAlchemy.

---

**Troubleshooting:**

| Issue | Solution |
|-------|----------|
| \`command not found: fast\` | Ensure your Python scripts directory is in PATH: \`export PATH="$PATH:$HOME/.local/bin"\` |
| Database connection error | Check DATABASE_URL in .env, ensure PostgreSQL is running |
| Port already in use | Change port: \`fast run --port 8001\` or kill process on 8000 |`,

  'tutorial-part-2': `# Tutorial Part 2: Models & Persistence

**Time: ~20 minutes**

Build your data layer: models, migrations, and repositories for TaskFlow.

## Overview

We'll create:
1. **User** model (with encrypted email)
2. **Team** model (multi-tenant)
3. **Project** model
4. **Task** model

## Step 1: Create User Model

Edit \`app/models/user.py\`:

\`\`\`python
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    team_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("teams.id"), 
        nullable=True
    )
    team: Mapped["Team"] = relationship("Team", back_populates="members")
    projects: Mapped[list["Project"]] = relationship(
        "Project", 
        back_populates="owner",
        foreign_keys="Project.owner_id"
    )
\`\`\`

## Step 2: Create Team Model

\`\`\`python
# app/models/team.py
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class Team(Base):
    __tablename__ = "teams"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    billing_email: Mapped[str] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(50), default="free")  # free, pro, enterprise
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members: Mapped[list["User"]] = relationship("User", back_populates="team")
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="team")
\`\`\`

## Step 3: Create Project & Task Models

\`\`\`python
# app/models/project.py
import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class ProjectStatus(str, PyEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    COMPLETED = "completed"

class Project(Base):
    __tablename__ = "projects"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus), 
        default=ProjectStatus.ACTIVE
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id")
    )
    team_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("teams.id")
    )
    
    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="projects", foreign_keys=[owner_id])
    team: Mapped["Team"] = relationship("Team", back_populates="projects")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="project", cascade="all, delete-orphan")
\`\`\`

\`\`\`python
# app/models/task.py
import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class TaskStatus(str, PyEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"

class TaskPriority(str, PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Task(Base):
    __tablename__ = "tasks"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus), 
        default=TaskStatus.TODO
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority), 
        default=TaskPriority.MEDIUM
    )
    position: Mapped[int] = mapped_column(Integer, default=0)  # For ordering
    due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Foreign Keys
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("projects.id")
    )
    assignee_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id"),
        nullable=True
    )
    created_by_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id")
    )
    
    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
    assignee: Mapped["User"] = relationship("User", foreign_keys=[assignee_id])
    created_by: Mapped["User"] = relationship("User", foreign_keys=[created_by_id])
\`\`\`

## Step 4: Generate Migration

\`\`\`bash
# Create a new migration from your models
fast db migrate -m "create_initial_tables"

# Review the generated migration in alembic/versions/
\`\`\`

## Step 5: Apply Migration

\`\`\`bash
# Apply to database
fast db upgrade

# Verify tables exist
fast db status
\`\`\`

## Step 6: Create Repository Layer

Create \`app/repositories/user.py\`:

\`\`\`python
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.core.security import get_password_hash, verify_password

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_by_id(self, user_id: UUID) -> User | None:
        result = await self.session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def create(self, email: str, password: str, full_name: str) -> User:
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name
        )
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user
    
    async def authenticate(self, email: str, password: str) -> User | None:
        user = await self.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
\`\`\`

## Step 7: Create Project Repository

\`\`\`python
# app/repositories/project.py
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import Project, ProjectStatus
from app.core.decorators import detect_nplus1

class ProjectRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    @detect_nplus1(warning_threshold=3)
    async def get_by_id(self, project_id: UUID) -> Project | None:
        # Eager load relationships to avoid N+1
        result = await self.session.execute(
            select(Project)
            .where(Project.id == project_id)
            .options(
                selectinload(Project.owner),
                selectinload(Project.team),
                selectinload(Project.tasks)
            )
        )
        return result.scalar_one_or_none()
    
    async def list_by_team(
        self, 
        team_id: UUID, 
        status: ProjectStatus | None = None,
        limit: int = 100,
        offset: int = 0
    ) -> list[Project]:
        query = (
            select(Project)
            .where(Project.team_id == team_id)
            .options(selectinload(Project.owner))
            .order_by(desc(Project.created_at))
            .limit(limit)
            .offset(offset)
        )
        
        if status:
            query = query.where(Project.status == status)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def create(
        self, 
        name: str, 
        description: str | None,
        owner_id: UUID,
        team_id: UUID
    ) -> Project:
        project = Project(
            name=name,
            description=description,
            owner_id=owner_id,
            team_id=team_id
        )
        self.session.add(project)
        await self.session.flush()
        await self.session.refresh(project)
        return project
\`\`\`

## What You Learned

- ✅ SQLAlchemy 2.0 style with Mapped types
- ✅ Enum types for status fields
- ✅ Generating and running migrations with Alembic
- ✅ Repository pattern for data access
- ✅ Eager loading with selectinload to prevent N+1
- ✅ Using @detect_nplus1 decorator

## Next Step

[Part 3: REST API & Validation](tutorial-part-3) - Build your HTTP endpoints.

---

**Pro Tips:**

- Always use \`selectinload\` when fetching relationships
- Keep migrations reversible (avoid raw SQL that can't be undone)
- Use UUIDs for public IDs to prevent enumeration attacks`,

  'tutorial-part-3': `# Tutorial Part 3: REST API & Validation

**Time: ~25 minutes**

Build RESTful endpoints with Pydantic validation and Smart Caching.

## Step 1: Create Pydantic Schemas

\`\`\`python
# app/schemas/user.py
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    is_active: bool
    created_at: datetime

class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
\`\`\`

\`\`\`python
# app/schemas/project.py
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from app.models.project import ProjectStatus

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = Field(None, max_length=1000)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, max_length=1000)
    status: ProjectStatus | None = None

class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    status: ProjectStatus
    owner_id: UUID
    team_id: UUID
    created_at: datetime
    task_count: int = 0  # Computed field

class ProjectListResponse(BaseModel):
    items: list[ProjectResponse]
    total: int
\`\`\`

## Step 2: Create Project Service

\`\`\`python
# app/services/project_service.py
from uuid import UUID
from fast_platform.caching import smart_cache
from fast_dashboards.core import detect_nplus1, tracer

from app.repositories.project import ProjectRepository
from app.models.project import ProjectStatus
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

class ProjectService:
    CACHE_PREFIX = "project"
    
    def __init__(self, repo: ProjectRepository):
        self.repo = repo
    
    @smart_cache.cached(
        ttl=300,  # 5 minutes
        stale_ttl=60,  # Serve stale for 1 min while refreshing
        key_builder=lambda self, project_id: f"{self.CACHE_PREFIX}:{project_id}",
        invalidate_on=["project:update", "project:delete"]
    )
    @detect_nplus1(warning_threshold=3)
    @tracer.trace_method()
    async def get_project(self, project_id: UUID) -> ProjectResponse | None:
        project = await self.repo.get_by_id(project_id)
        if not project:
            return None
        
        return ProjectResponse.model_validate(project)
    
    @smart_cache.cached(
        ttl=60,
        key_builder=lambda self, team_id, **kwargs: f"{self.CACHE_PREFIX}:list:{team_id}",
        invalidate_on=["project:create", "project:update"]
    )
    async def list_team_projects(
        self,
        team_id: UUID,
        status: ProjectStatus | None = None,
        limit: int = 100,
        offset: int = 0
    ) -> ProjectListResponse:
        projects = await self.repo.list_by_team(
            team_id=team_id,
            status=status,
            limit=limit,
            offset=offset
        )
        
        items = [ProjectResponse.model_validate(p) for p in projects]
        total = len(items)  # In real app, get from count query
        
        return ProjectListResponse(items=items, total=total)
    
    async def create_project(
        self,
        data: ProjectCreate,
        owner_id: UUID,
        team_id: UUID
    ) -> ProjectResponse:
        project = await self.repo.create(
            name=data.name,
            description=data.description,
            owner_id=owner_id,
            team_id=team_id
        )
        return ProjectResponse.model_validate(project)
    
    async def update_project(
        self,
        project_id: UUID,
        data: ProjectUpdate
    ) -> ProjectResponse | None:
        project = await self.repo.get_by_id(project_id)
        if not project:
            return None
        
        # Update fields
        if data.name is not None:
            project.name = data.name
        if data.description is not None:
            project.description = data.description
        if data.status is not None:
            project.status = data.status
        
        await self.repo.session.flush()
        await self.repo.session.refresh(project)
        
        return ProjectResponse.model_validate(project)
\`\`\`

## Step 3: Create API Routes

\`\`\`python
# app/api/v1/routes/projects.py
from uuid import UUID
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_db, get_current_user, get_current_active_user
from app.services.project_service import ProjectService
from app.repositories.project import ProjectRepository
from app.schemas.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectResponse,
    ProjectListResponse
)
from app.models.project import ProjectStatus
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["projects"])

async def get_project_service(
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ProjectService:
    repo = ProjectRepository(db)
    return ProjectService(repo)

@router.get("", response_model=ProjectListResponse)
async def list_projects(
    status: ProjectStatus | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[ProjectService, Depends(get_project_service)]
) -> ProjectListResponse:
    """List all projects for the current user's team."""
    if not current_user.team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not part of a team"
        )
    
    return await service.list_team_projects(
        team_id=current_user.team_id,
        status=status,
        limit=limit,
        offset=offset
    )

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[ProjectService, Depends(get_project_service)]
) -> ProjectResponse:
    """Create a new project."""
    if not current_user.team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not part of a team"
        )
    
    return await service.create_project(
        data=data,
        owner_id=current_user.id,
        team_id=current_user.team_id
    )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[ProjectService, Depends(get_project_service)]
) -> ProjectResponse:
    """Get a specific project by ID."""
    project = await service.get_project(project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Ensure user has access to this project
    if project.team_id != current_user.team_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this project"
        )
    
    return project

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[ProjectService, Depends(get_project_service)]
) -> ProjectResponse:
    """Update a project."""
    # First check if project exists and user has access
    existing = await service.get_project(project_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if existing.team_id != current_user.team_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this project"
        )
    
    updated = await service.update_project(project_id, data)
    return updated
\`\`\`

## Step 4: Test Your API

\`\`\`bash
# Start the server
fast run

# Create a project (you'll need auth first - covered in Part 4)
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Website Redesign",
    "description": "Redesign company website with modern UI"
  }'

# List projects
curl http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific project
curl http://localhost:8000/api/v1/projects/{project_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## What You Learned

- ✅ Pydantic v2 schemas with validation
- ✅ FastAPI dependency injection
- ✅ Smart Caching with stale-while-revalidate
- ✅ Service layer pattern
- ✅ HTTP status codes and error handling
- ✅ API versioning with prefixes

## Next Step

[Part 4: Authentication & Security](tutorial-part-4) - Secure your API.

---

**Performance Tips:**

- Cache keys should include all parameters that affect output
- Use stale-while-revalidate for data that can be slightly outdated
- Always validate authorization before returning cached data`,

  'tutorial-part-4': `# Tutorial Part 4: Authentication & Security

**Time: ~25 minutes**

Add JWT authentication, field encryption, and role-based permissions.

## Step 1: Configure JWT Settings

\`\`\`python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ... other settings ...
    
    SECRET_KEY: str  # Minimum 32 characters
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Encryption for sensitive fields
    ENCRYPTION_KEY: str  # Set via environment

settings = Settings()
\`\`\`

Generate a secure key:
\`\`\`bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
\`\`\`

## Step 2: Setup Field Encryption

\`\`\`python
# app/core/encryption.py
from fast_dashboards.core import setup_encryption
from app.core.config import settings

# Initialize encryption
setup_encryption(key=settings.ENCRYPTION_KEY)
\`\`\`

Update User model with encrypted fields:

\`\`\`python
# app/models/user.py
from fast_dashboards.core import Encrypted
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    # ... other fields ...
    
    # Encrypted fields - automatically encrypted at rest
    phone: Mapped[str | None] = mapped_column(
        Encrypted[String(50)], 
        nullable=True
    )
    tax_id: Mapped[str | None] = mapped_column(
        Encrypted[String(50)], 
        nullable=True
    )
\`\`\`

## Step 3: JWT Token Utilities

\`\`\`python
# app/core/security.py
from datetime import datetime, timedelta
from typing import Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fast_dashboards.core import Encrypted

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: str | Any, 
    expires_delta: timedelta | None = None,
    extra_claims: dict | None = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
        **(extra_claims or {})
    }
    
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(subject: str | Any) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh"
    }
    return jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )

def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
\`\`\`

## Step 4: Auth Dependencies

\`\`\`python
# app/api/deps.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.core.security import verify_token
from app.repositories.user import UserRepository
from app.models.user import User

security = HTTPBearer()

async def get_db() -> AsyncSession:
    async for session in get_async_session():
        yield session

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    repo = UserRepository(db)
    user = await repo.get_by_id(UUID(user_id))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user

async def require_superuser(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser required"
        )
    return current_user
\`\`\`

## Step 5: Auth Endpoints

\`\`\`python
# app/api/v1/routes/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_db
from app.core.security import (
    create_access_token, 
    create_refresh_token,
    verify_password
)
from app.core.config import settings
from app.repositories.user import UserRepository
from app.schemas.auth import TokenResponse, LoginRequest, RegisterRequest
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Register a new user account."""
    repo = UserRepository(db)
    
    # Check if email exists
    existing = await repo.get_by_email(data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = await repo.create(
        email=data.email,
        password=data.password,
        full_name=data.full_name
    )
    
    await db.commit()
    return user

@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """OAuth2 compatible token login."""
    repo = UserRepository(db)
    user = await repo.authenticate(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    access_token = create_access_token(
        subject=str(user.id),
        extra_claims={
            "team_id": str(user.team_id) if user.team_id else None,
            "is_superuser": user.is_superuser
        }
    )
    refresh_token = create_refresh_token(subject=str(user.id))
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Refresh access token using refresh token."""
    payload = verify_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    repo = UserRepository(db)
    user = await repo.get_by_id(UUID(user_id))
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    new_access = create_access_token(
        subject=str(user.id),
        extra_claims={
            "team_id": str(user.team_id) if user.team_id else None,
            "is_superuser": user.is_superuser
        }
    )
    
    return TokenResponse(
        access_token=new_access,
        refresh_token=refresh_token,  # Can rotate if needed
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
\`\`\`

## Step 6: Role-Based Permissions

\`\`\`python
# app/core/permissions.py
from enum import Enum
from uuid import UUID
from fastapi import HTTPException, status

from app.models.user import User

class Permission(str, Enum):
    PROJECT_CREATE = "project:create"
    PROJECT_UPDATE = "project:update"
    PROJECT_DELETE = "project:delete"
    TEAM_MANAGE = "team:manage"
    BILLING_MANAGE = "billing:manage"
    USER_MANAGE = "user:manage"

ROLE_PERMISSIONS = {
    "owner": [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_DELETE,
        Permission.TEAM_MANAGE,
        Permission.BILLING_MANAGE,
        Permission.USER_MANAGE,
    ],
    "admin": [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_DELETE,
        Permission.TEAM_MANAGE,
        Permission.USER_MANAGE,
    ],
    "member": [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_UPDATE,
    ],
    "viewer": [],
}

def check_permission(user: User, permission: Permission, team_role: str = "member"):
    """Check if user has specific permission."""
    if user.is_superuser:
        return True
    
    permissions = ROLE_PERMISSIONS.get(team_role, [])
    if permission not in permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Missing required permission: {permission}"
        )
    return True
\`\`\`

## What You Learned

- ✅ JWT token generation and validation
- ✅ OAuth2 password flow
- ✅ Field-level encryption for PII
- ✅ Dependency injection for auth
- ✅ Role-based access control (RBAC)
- ✅ Refresh token pattern

## Next Step

[Part 5: Advanced Features](tutorial-part-5) - Tracing, N+1 detection, and Saga pattern.

---

**Security Best Practices:**

- Never commit SECRET_KEY or ENCRYPTION_KEY
- Use HTTPS in production (TLS termination)
- Set short access token expiry (15-30 min)
- Rotate refresh tokens on each use
- Log failed auth attempts for monitoring`,

  'tutorial-part-5': `# Tutorial Part 5: Advanced Features

**Time: ~30 minutes**

Add distributed tracing, optimize queries, and handle complex transactions.

## Step 1: Setup Distributed Tracing

\`\`\`python
# app/core/tracing.py
from fast_dashboards.core import tracer
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from app.core.config import settings

def setup_tracing():
    """Initialize OpenTelemetry tracing."""
    provider = TracerProvider()
    
    # Export to OTLP collector (Jaeger, Zipkin, etc.)
    otlp_exporter = OTLPSpanExporter(
        endpoint=settings.OTLP_ENDPOINT,
        headers={"Authorization": f"Bearer {settings.OTLP_TOKEN}"}
    )
    
    processor = BatchSpanProcessor(otlp_exporter)
    provider.add_span_processor(processor)
    
    trace.set_tracer_provider(provider)
    
    # Fast tracer automatically uses this provider
    return provider
\`\`\`

## Step 2: Trace Your Services

\`\`\`python
# app/services/billing_service.py
from decimal import Decimal
from uuid import UUID
from fast_dashboards.core import tracer, SagaBuilder

class BillingService:
    def __init__(self, stripe_client, db_session):
        self.stripe = stripe_client
        self.db = db_session
    
    @tracer.trace_method()
    async def process_subscription(
        self,
        user_id: UUID,
        plan_id: str,
        payment_method_id: str
    ) -> dict:
        """Process a subscription with full tracing and saga compensation."""
        span = tracer.get_current_span()
        span.set_attribute("user.id", str(user_id))
        span.set_attribute("billing.plan_id", plan_id)
        
        # Build saga for distributed transaction
        saga = (
            SagaBuilder("subscription_creation")
            .with_timeout(30.0)  # 30 second timeout
            .step(
                "validate_payment",
                action=lambda: self._validate_payment(payment_method_id),
            )
            .step(
                "create_stripe_customer",
                action=lambda: self._create_stripe_customer(user_id, payment_method_id),
                compensation=lambda: self._cleanup_stripe_customer(user_id)
            )
            .step(
                "create_subscription",
                action=lambda customer_id: self._create_stripe_subscription(
                    customer_id, plan_id
                ),
                compensation=lambda: self._cancel_stripe_subscription(user_id)
            )
            .step(
                "update_database",
                action=lambda sub_data: self._update_user_subscription(
                    user_id, sub_data
                ),
                compensation=lambda: self._revert_subscription_in_db(user_id)
            )
            .step(
                "send_confirmation",
                action=lambda: self._send_confirmation_email(user_id, plan_id)
            )
            .build()
        )
        
        # Execute with automatic rollback on failure
        result = await saga.execute({})
        
        if result.is_success:
            span.set_attribute("billing.success", True)
            span.add_cost("stripe", Decimal("0.30"))  # Track API costs
            return {
                "status": "success",
                "subscription_id": result.data["subscription_id"]
            }
        else:
            span.set_attribute("billing.success", False)
            span.set_attribute("billing.error", result.error)
            raise BillingError(f"Subscription failed: {result.error}")
    
    async def _validate_payment(self, payment_method_id: str):
        with tracer.start_span("stripe.validate_payment"):
            # Call Stripe API
            return {"valid": True}
    
    async def _create_stripe_customer(self, user_id: UUID, payment_method: str):
        with tracer.start_span("stripe.create_customer"):
            customer = await self.stripe.customers.create(
                payment_method=payment_method,
                metadata={"user_id": str(user_id)}
            )
            return customer.id
    
    async def _create_stripe_subscription(self, customer_id: str, plan_id: str):
        with tracer.start_span("stripe.create_subscription"):
            sub = await self.stripe.subscriptions.create(
                customer=customer_id,
                items=[{"plan": plan_id}]
            )
            return {"subscription_id": sub.id, "status": sub.status}
\`\`\`

## Step 3: Monitor N+1 Queries

\`\`\`python
# app/services/task_service.py
from uuid import UUID
from sqlalchemy.orm import selectinload
from fast_platform.caching import smart_cache
from fast_dashboards.core import detect_nplus1, tracer

from app.models.task import Task, TaskStatus
from app.repositories.task import TaskRepository

class TaskService:
    def __init__(self, repo: TaskRepository):
        self.repo = repo
    
    @detect_nplus1(warning_threshold=5)
    @tracer.trace_method()
    async def get_task_with_details(self, task_id: UUID) -> Task:
        """Get task with all related data - optimized loading."""
        # Repository uses selectinload to prevent N+1
        return await self.repo.get_with_relations(task_id)
    
    @detect_nplus1()
    @smart_cache.cached(ttl=120, stale_ttl=30)
    async def list_project_tasks(
        self,
        project_id: UUID,
        status: TaskStatus | None = None
    ) -> list[Task]:
        """List tasks with automatic N+1 detection."""
        # This will warn if we accidentally trigger N+1
        tasks = await self.repo.list_by_project(project_id, status)
        
        # Accessing relationships here is safe due to selectinload
        return [
            {
                "id": t.id,
                "title": t.title,
                "assignee": t.assignee.full_name if t.assignee else None,
                "project": t.project.name,
            }
            for t in tasks
        ]
\`\`\`

## Step 4: Optimized Repository

\`\`\`python
# app/repositories/task.py
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.task import Task, TaskStatus

class TaskRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_with_relations(self, task_id: UUID) -> Task | None:
        """Get task with all relationships eagerly loaded."""
        result = await self.session.execute(
            select(Task)
            .where(Task.id == task_id)
            .options(
                selectinload(Task.assignee),
                selectinload(Task.created_by),
                selectinload(Task.project).selectinload(Project.team)
            )
        )
        return result.scalar_one_or_none()
    
    async def list_by_project(
        self,
        project_id: UUID,
        status: TaskStatus | None = None,
        limit: int = 100
    ) -> list[Task]:
        """List tasks with assignee eager loaded."""
        query = (
            select(Task)
            .where(Task.project_id == project_id)
            .options(
                selectinload(Task.assignee),
                selectinload(Task.project)
            )
            .order_by(desc(Task.position))
            .limit(limit)
        )
        
        if status:
            query = query.where(Task.status == status)
        
        result = await self.session.execute(query)
        return result.scalars().all()
\`\`\`

## Step 5: View Traces & Costs

\`\`\`python
# app/api/v1/routes/admin.py
from uuid import UUID
from fastapi import APIRouter, Depends

from app.api.deps import require_superuser
from app.core.tracing import tracer

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/traces/costs")
async def get_cost_breakdown(
    _: Annotated[User, Depends(require_superuser)],
    tenant_id: str | None = None
):
    """Get cost attribution by service."""
    if tenant_id:
        costs = tracer.get_cost_by_tenant(tenant_id)
    else:
        costs = tracer.get_cost_summary()
    
    return {
        "total_cost_usd": costs.total,
        "by_service": costs.breakdown,
        "period": costs.period
    }

@router.get("/traces/performance")
async def get_performance_metrics(
    _: Annotated[User, Depends(require_superuser)],
    endpoint: str | None = None
):
    """Get endpoint performance metrics."""
    return tracer.get_performance_summary(
        endpoint_filter=endpoint,
        time_range="1h"
    )
\`\`\`

## What You Learned

- ✅ Distributed tracing with OpenTelemetry
- ✅ Saga pattern for distributed transactions
- ✅ Cost attribution per API call
- ✅ N+1 query detection and prevention
- ✅ Eager loading with selectinload
- ✅ Performance monitoring

## Next Step

[Part 6: Testing & Quality](tutorial-part-6) - Comprehensive testing strategies.

---

**Monitoring Best Practices:**

- Always trace external API calls (Stripe, AWS, etc.)
- Set meaningful span attributes for filtering
- Use cost tracking for budget-sensitive operations
- Monitor N+1 warnings in staging/production`,

  'tutorial-part-6': `# Tutorial Part 6: Testing & Quality

**Time: ~20 minutes**

Write comprehensive tests using Fast's testing utilities.

## Step 1: Test Configuration

\`\`\`python
# tests/conftest.py
import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.db.session import get_async_session
from app.core.config import settings
from tests.factories import UserFactory, ProjectFactory, TaskFactory

# Override settings for tests
settings.DATABASE_URL = "postgresql+asyncpg://test:test@localhost/test_taskflow"
settings.REDIS_URL = "redis://localhost:6379/1"

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture
async def db_session():
    """Create fresh database session for each test."""
    async for session in get_async_session():
        yield session
        # Rollback after each test
        await session.rollback()

@pytest.fixture
def client():
    """Synchronous test client."""
    with TestClient(app) as c:
        yield c

@pytest_asyncio.fixture
async def async_client():
    """Async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def authenticated_client(async_client: AsyncClient, db_session):
    """Client with authenticated user."""
    # Create user
    user = await UserFactory(db_session).create()
    
    # Get token
    from app.core.security import create_access_token
    token = create_access_token(subject=str(user.id))
    
    # Set auth header
    async_client.headers["Authorization"] = f"Bearer {token}"
    async_client.headers["X-Test-User-ID"] = str(user.id)
    
    yield async_client
\`\`\`

## Step 2: Create Test Factories

\`\`\`python
# tests/factories.py
from uuid import uuid4
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user import UserRepository
from app.repositories.project import ProjectRepository
from app.repositories.task import TaskRepository
from app.models.project import ProjectStatus
from app.models.task import TaskStatus, TaskPriority

faker = Faker()

class UserFactory:
    """Factory for creating test users."""
    
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)
    
    async def create(
        self,
        email: str | None = None,
        password: str = "testpass123",
        full_name: str | None = None,
        is_active: bool = True
    ):
        return await self.repo.create(
            email=email or faker.email(),
            password=password,
            full_name=full_name or faker.name()
        )
    
    async def create_batch(self, count: int, **kwargs):
        """Create multiple users."""
        return [await self.create(**kwargs) for _ in range(count)]
    
    def create_dict(self, **overrides):
        """Return dict for API requests."""
        return {
            "email": overrides.get("email", faker.email()),
            "password": overrides.get("password", "testpass123"),
            "full_name": overrides.get("full_name", faker.name())
        }

class ProjectFactory:
    """Factory for creating test projects."""
    
    def __init__(self, session: AsyncSession):
        self.repo = ProjectRepository(session)
    
    async def create(
        self,
        name: str | None = None,
        description: str | None = None,
        owner_id = None,
        team_id = None,
        status = ProjectStatus.ACTIVE
    ):
        return await self.repo.create(
            name=name or faker.catch_phrase(),
            description=description or faker.text(max_nb_chars=200),
            owner_id=owner_id or uuid4(),
            team_id=team_id or uuid4()
        )

class TaskFactory:
    """Factory for creating test tasks."""
    
    def __init__(self, session: AsyncSession):
        self.repo = TaskRepository(session)
    
    async def create(
        self,
        title: str | None = None,
        project_id = None,
        assignee_id = None,
        status = TaskStatus.TODO,
        priority = TaskPriority.MEDIUM
    ):
        return await self.repo.create(
            title=title or faker.sentence(),
            project_id=project_id or uuid4(),
            assignee_id=assignee_id,
            status=status,
            priority=priority
        )
    
    async def completed(self, **kwargs):
        """Create a completed task."""
        return await self.create(status=TaskStatus.DONE, **kwargs)
    
    async def high_priority(self, **kwargs):
        """Create a high priority task."""
        return await self.create(priority=TaskPriority.HIGH, **kwargs)
\`\`\`

## Step 3: Write API Tests

\`\`\`python
# tests/api/test_projects.py
import pytest
from uuid import uuid4
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from tests.factories import UserFactory, ProjectFactory

pytestmark = pytest.mark.asyncio

class TestProjectAPI:
    """Test project endpoints."""
    
    async def test_create_project(
        self,
        async_client: AsyncClient,
        db_session: AsyncSession,
        authenticated_client
    ):
        """Test creating a new project."""
        project_data = {
            "name": "Test Project",
            "description": "A test project"
        }
        
        response = await authenticated_client.post(
            "/api/v1/projects",
            json=project_data
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == project_data["name"]
        assert data["description"] == project_data["description"]
        assert "id" in data
    
    async def test_create_project_unauthorized(
        self,
        async_client: AsyncClient
    ):
        """Test creating project without auth fails."""
        response = await async_client.post(
            "/api/v1/projects",
            json={"name": "Test"}
        )
        assert response.status_code == 401
    
    async def test_list_projects(
        self,
        authenticated_client: AsyncClient,
        db_session: AsyncSession
    ):
        """Test listing projects."""
        # Create some projects
        factory = ProjectFactory(db_session)
        user_id = authenticated_client.headers.get("X-Test-User-ID")
        
        for _ in range(3):
            await factory.create(owner_id=user_id)
        
        response = await authenticated_client.get("/api/v1/projects")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 3
    
    async def test_get_project_not_found(
        self,
        authenticated_client: AsyncClient
    ):
        """Test getting non-existent project returns 404."""
        fake_id = str(uuid4())
        response = await authenticated_client.get(f"/api/v1/projects/{fake_id}")
        assert response.status_code == 404
    
    async def test_update_project(
        self,
        authenticated_client: AsyncClient,
        db_session: AsyncSession
    ):
        """Test updating a project."""
        # Create project
        factory = ProjectFactory(db_session)
        user_id = authenticated_client.headers.get("X-Test-User-ID")
        project = await factory.create(owner_id=user_id)
        
        update_data = {
            "name": "Updated Name",
            "status": "archived"
        }
        
        response = await authenticated_client.patch(
            f"/api/v1/projects/{project.id}",
            json=update_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["status"] == "archived"
    
    @pytest.mark.parametrize("invalid_data,expected_error", [
        ({"name": ""}, "name must not be empty"),
        ({"name": "a" * 300}, "name too long"),
        ({"status": "invalid"}, "invalid status"),
    ])
    async def test_create_project_validation(
        self,
        authenticated_client: AsyncClient,
        invalid_data,
        expected_error
    ):
        """Test project creation validation."""
        response = await authenticated_client.post(
            "/api/v1/projects",
            json=invalid_data
        )
        assert response.status_code == 422

class TestProjectCaching:
    """Test caching behavior."""
    
    async def test_project_cached(
        self,
        authenticated_client: AsyncClient,
        db_session: AsyncSession
    ):
        """Test that project responses are cached."""
        factory = ProjectFactory(db_session)
        user_id = authenticated_client.headers.get("X-Test-User-ID")
        project = await factory.create(owner_id=user_id)
        
        # First request - cache miss
        response1 = await authenticated_client.get(
            f"/api/v1/projects/{project.id}"
        )
        assert response1.status_code == 200
        
        # Second request - should be cached (check headers or timing)
        response2 = await authenticated_client.get(
            f"/api/v1/projects/{project.id}"
        )
        assert response2.status_code == 200
        assert response1.json() == response2.json()
\`\`\`

## Step 4: Test Services with Mocks

\`\`\`python
# tests/services/test_billing_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from decimal import Decimal
from uuid import uuid4

from app.services.billing_service import BillingService

pytestmark = pytest.mark.asyncio

class TestBillingService:
    """Test billing service with mocked Stripe."""
    
    @pytest.fixture
    def mock_stripe(self):
        """Create mock Stripe client."""
        mock = MagicMock()
        mock.customers = AsyncMock()
        mock.subscriptions = AsyncMock()
        return mock
    
    @pytest.fixture
    def billing_service(self, mock_stripe, db_session):
        """Create billing service with mocks."""
        return BillingService(mock_stripe, db_session)
    
    async def test_process_subscription_success(
        self,
        billing_service,
        mock_stripe
    ):
        """Test successful subscription flow."""
        # Configure mocks
        mock_stripe.customers.create.return_value = MagicMock(
            id="cus_123",
            metadata={}
        )
        mock_stripe.subscriptions.create.return_value = MagicMock(
            id="sub_456",
            status="active"
        )
        
        result = await billing_service.process_subscription(
            user_id=uuid4(),
            plan_id="pro_monthly",
            payment_method_id="pm_789"
        )
        
        assert result["status"] == "success"
        assert "subscription_id" in result
        mock_stripe.customers.create.assert_called_once()
    
    async def test_process_subscription_rollback(
        self,
        billing_service,
        mock_stripe
    ):
        """Test saga compensation on failure."""
        # Make subscription creation fail
        mock_stripe.customers.create.return_value = MagicMock(id="cus_123")
        mock_stripe.subscriptions.create.side_effect = Exception("Payment failed")
        
        with pytest.raises(Exception):
            await billing_service.process_subscription(
                user_id=uuid4(),
                plan_id="pro_monthly",
                payment_method_id="pm_789"
            )
        
        # Verify cleanup was called
        # (depends on your saga implementation)
\`\`\`

## Step 5: Integration Tests

\`\`\`python
# tests/integration/test_full_workflow.py
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

class TestFullWorkflow:
    """End-to-end workflow tests."""
    
    async def test_complete_user_journey(
        self,
        async_client: AsyncClient
    ):
        """Test complete user flow: register → create project → add tasks."""
        # 1. Register
        register_resp = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpass123",
                "full_name": "Test User"
            }
        )
        assert register_resp.status_code == 201
        
        # 2. Login
        login_resp = await async_client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "testpass123"
            }
        )
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        
        # Set auth for subsequent requests
        async_client.headers["Authorization"] = f"Bearer {token}"
        
        # 3. Create project
        project_resp = await async_client.post(
            "/api/v1/projects",
            json={
                "name": "My First Project",
                "description": "Testing the API"
            }
        )
        assert project_resp.status_code == 201
        project_id = project_resp.json()["id"]
        
        # 4. Create tasks
        for i in range(3):
            task_resp = await async_client.post(
                f"/api/v1/projects/{project_id}/tasks",
                json={
                    "title": f"Task {i + 1}",
                    "priority": "high"
                }
            )
            assert task_resp.status_code == 201
        
        # 5. List tasks
        list_resp = await async_client.get(
            f"/api/v1/projects/{project_id}/tasks"
        )
        assert list_resp.status_code == 200
        assert len(list_resp.json()["items"]) == 3
\`\`\`

## Step 6: Configure Pre-commit

Your project already has pre-commit configured. Run:

\`\`\`bash
# Install hooks
pre-commit install
pre-commit install --hook-type post-commit

# Run manually on all files
pre-commit run --all-files
\`\`\`

## Step 7: Coverage Configuration

\`\`\`toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "api: API tests",
    "slow: Slow tests",
]

[tool.coverage.run]
source = ["app"]
omit = [
    "*/tests/*",
    "*/migrations/*",
    "app/main.py",
]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
    "if __name__ == .__main__.:",
]
\`\`\`

Run tests with coverage:
\`\`\`bash
pytest --cov=app --cov-report=html --cov-report=term
\`\`\`

## What You Learned

- ✅ Test factories with Faker
- ✅ Async test configuration
- ✅ API endpoint testing
- ✅ Service testing with mocks
- ✅ Integration/end-to-end tests
- ✅ Pre-commit hooks for quality
- ✅ Code coverage reporting

## Next Step

[Part 7: Production Deployment](tutorial-part-7) - Deploy to production.

---

**Testing Best Practices:**

- Use factories for test data, not fixtures for everything
- Mock external services (Stripe, AWS) in unit tests
- Use real database in integration tests (with transactions)
- Tag slow tests and run them separately in CI
- Aim for 80%+ coverage, focus on critical paths`,

  'tutorial-part-7': `# Tutorial Part 7: Production Deployment

**Time: ~25 minutes**

Deploy your TaskFlow API to production with Docker and cloud platforms.

## Step 1: Production Docker Configuration

\`\`\`dockerfile
# Dockerfile
FROM python:3.12-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir --user -e ".[prod]"

# Production stage
FROM python:3.12-slim

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy installed packages from builder
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Set PATH
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/live')"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
\`\`\`

## Step 2: Docker Compose Production

\`\`\`yaml
# docker-compose.prod.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/taskflow
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=\${SECRET_KEY}
      - ENCRYPTION_KEY=\${ENCRYPTION_KEY}
      - ENVIRONMENT=production
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=taskflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
\`\`\`

## Step 3: Health Check Endpoints

\`\`\`python
# app/api/v1/routes/health.py
from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.cache import get_cache

router = APIRouter()

@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_check():
    """Kubernetes liveness probe - is the process running?"""
    return {"status": "alive"}

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """Kubernetes readiness probe - can we serve traffic?"""
    try:
        # Check database
        await db.execute(text("SELECT 1"))
        
        # Check cache
        cache = get_cache()
        await cache.ping()
        
        return {
            "status": "ready",
            "checks": {
                "database": "ok",
                "cache": "ok"
            }
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "error": str(e)
        }, status.HTTP_503_SERVICE_UNAVAILABLE

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health information."""
    from app import __version__
    
    db_status = "ok"
    cache_status = "ok"
    
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    
    try:
        cache = get_cache()
        await cache.ping()
    except Exception:
        cache_status = "error"
    
    return {
        "status": "healthy" if db_status == "ok" and cache_status == "ok" else "unhealthy",
        "version": __version__,
        "checks": {
            "database": db_status,
            "cache": cache_status
        }
    }
\`\`\`

## Step 4: Deploy to AWS (ECS/Fargate)

\`\`\`bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL

docker build -t taskflow-api .
docker tag taskflow-api:latest $ECR_URL/taskflow-api:latest
docker push $ECR_URL/taskflow-api:latest
\`\`\`

Terraform configuration:

\`\`\`hcl
# terraform/ecs.tf
resource "aws_ecs_task_definition" "app" {
  family                   = "taskflow-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "api"
    image = "\${aws_ecr_repository.app.repository_url}:latest"
    portMappings = [{
      containerPort = 8000
      protocol      = "tcp"
    }]
    environment = [
      { name = "ENVIRONMENT", value = "production" },
    ]
    secrets = [
      { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.db_url.arn },
      { name = "SECRET_KEY", valueFrom = aws_secretsmanager_secret.secret_key.arn },
    ]
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:8000/health/live || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}
\`\`\`

## Step 5: Deploy to Google Cloud Run

\`\`\`bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/taskflow-api

gcloud run deploy taskflow-api \
  --image gcr.io/PROJECT_ID/taskflow-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets=DATABASE_URL=db-url:latest,SECRET_KEY=secret-key:latest \
  --memory 1Gi \
  --cpu 1 \
  --concurrency 80 \
  --max-instances 10
\`\`\`

## Step 6: Deploy to Railway/Render (Easiest)

**Railway:**
1. Push code to GitHub
2. Connect Railway to repo
3. Add environment variables in dashboard
4. Deploy automatically on push

**Render:**
\`\`\`yaml
# render.yaml
services:
  - type: web
    name: taskflow-api
    runtime: docker
    repo: https://github.com/yourusername/taskflow
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: taskflow-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: REDIS_URL
        fromService:
          type: redis
          name: taskflow-redis
          property: connectionString

databases:
  - name: taskflow-db
    databaseName: taskflow
    user: taskflow

redis:
  - name: taskflow-redis
\`\`\`

## Step 7: Monitoring & Alerts

\`\`\`python
# app/core/monitoring.py
from fast_dashboards.core import tracer
import structlog

logger = structlog.get_logger()

def setup_monitoring():
    """Configure production monitoring."""
    # Structured logging
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer()
        ]
    )
    
    # Custom metrics
    tracer.add_metric_counter("api.requests.total")
    tracer.add_metric_histogram("api.request.duration")
    tracer.add_metric_gauge("db.connections.active")

async def log_request(request, response, duration_ms):
    """Log request details."""
    logger.info(
        "request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration_ms,
        user_agent=request.headers.get("user-agent"),
    )
\`\`\`

## What You Learned

- ✅ Multi-stage Docker builds
- ✅ Kubernetes health probes
- ✅ Environment-based configuration
- ✅ Deploying to AWS, GCP, Railway, Render
- ✅ Production monitoring setup
- ✅ Secret management

## Next Step

[Part 8: Real-time & GraphQL](tutorial-part-8) - Add WebSockets and GraphQL.

---

**Production Checklist:**

- [ ] Use non-root Docker user
- [ ] Enable health checks
- [ ] Set up log aggregation
- [ ] Configure monitoring alerts
- [ ] Enable rate limiting
- [ ] Set up SSL/TLS
- [ ] Configure backup strategy
- [ ] Document runbook procedures`,

  'tutorial-part-8': `# Tutorial Part 8: Real-time & GraphQL

**Time: ~20 minutes**

Add real-time updates with WebSockets and GraphQL API.

## Step 1: WebSocket Support for Real-time Updates

\`\`\`python
# app/api/v1/routes/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json

from app.api.deps import get_current_user_ws
from app.models.user import User

router = APIRouter()

# Connection manager for WebSockets
class ConnectionManager:
    def __init__(self):
        # project_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, project_id: str):
        if project_id in self.active_connections:
            self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
    
    async def broadcast_to_project(self, project_id: str, message: dict):
        """Send message to all connections for a project."""
        if project_id not in self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections[project_id]:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn, project_id)

manager = ConnectionManager()

@router.websocket("/ws/projects/{project_id}")
async def project_websocket(
    websocket: WebSocket,
    project_id: str,
    token: str,
    user: User = Depends(get_current_user_ws)
):
    """WebSocket for real-time project updates."""
    # Validate user has access to project
    # ... authorization check ...
    
    await manager.connect(websocket, project_id)
    
    try:
        while True:
            # Keep connection alive and handle client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            elif message.get("type") == "typing":
                # Broadcast typing indicator to others
                await manager.broadcast_to_project(
                    project_id,
                    {
                        "type": "user_typing",
                        "user": user.full_name,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
\`\`\`

## Step 2: Broadcast Task Updates

\`\`\`python
# app/services/task_service.py
async def create_task_with_broadcast(self, data: TaskCreate, project_id: UUID):
    """Create task and notify connected clients."""
    from app.api.v1.routes.ws import manager
    
    # Create the task
    task = await self.create_task(data, project_id)
    
    # Broadcast to WebSocket connections
    await manager.broadcast_to_project(
        str(project_id),
        {
            "type": "task_created",
            "data": {
                "id": str(task.id),
                "title": task.title,
                "status": task.status.value,
                "created_by": task.created_by.full_name
            }
        }
    )
    
    return task

async def update_task_status(self, task_id: UUID, new_status: TaskStatus):
    """Update task and broadcast change."""
    from app.api.v1.routes.ws import manager
    
    task = await self.update_status(task_id, new_status)
    
    await manager.broadcast_to_project(
        str(task.project_id),
        {
            "type": "task_updated",
            "data": {
                "id": str(task.id),
                "status": new_status.value,
                "updated_at": task.updated_at.isoformat()
            }
        }
    )
    
    return task
\`\`\`

## Step 3: Setup GraphQL Auto-Generation

\`\`\`python
# app/graphql/schema.py
from fast_dashboards.core import GraphQLAutoGenerator
from strawberry import type, field
from typing import List
from uuid import UUID

import strawberry

@type
class Task:
    id: UUID
    title: str
    status: str
    priority: str

@type
class Project:
    id: UUID
    name: str
    description: str | None
    tasks: List[Task]

@type
class Query:
    @field
    async def project(self, id: UUID) -> Project | None:
        # Resolver implementation
        pass
    
    @field
    async def projects(self) -> List[Project]:
        # List all projects
        pass

@type
class Mutation:
    @field
    async def create_task(
        self,
        project_id: UUID,
        title: str,
        priority: str = "medium"
    ) -> Task:
        # Create task implementation
        pass
    
    @field
    async def update_task_status(
        self,
        task_id: UUID,
        status: str
    ) -> Task:
        # Update implementation
        pass

schema = strawberry.Schema(query=Query, mutation=Mutation)
\`\`\`

## Step 4: Mount GraphQL Endpoint

\`\`\`python
# app/main.py
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from app.graphql.schema import schema

app = FastAPI()

# REST API routers
# ... existing routers ...

# GraphQL endpoint
gql_router = GraphQLRouter(
    schema,
    path="/graphql",
    graphql_ide="apollo-sandbox"  # or "graphiql"
)
app.include_router(gql_router, prefix="/graphql")

# WebSocket for subscriptions (real-time GraphQL)
@app.websocket("/graphql-ws")
async def graphql_ws(websocket: WebSocket):
    # WebSocket handler for GraphQL subscriptions
    pass
\`\`\`

## Step 5: Deploy Edge Functions

\`\`\`python
# app/edge/handlers.py
from fast_dashboards.core import edge_function, EdgeRequest, EdgeResponse

@edge_function(
    runtime="v8",
    regions=["us-east", "eu-west", "apac"],
    ttl=60
)
async def get_user_profile(request: EdgeRequest) -> EdgeResponse:
    """Edge function for fast user profile access."""
    user_id = request.params.get("user_id")
    
    # Check edge cache first
    cache = request.edge_cache
    cached = await cache.match(request)
    if cached:
        return cached
    
    # Fetch from origin
    profile = await fetch_user_profile(user_id)
    
    response = EdgeResponse.json(profile, headers={
        "Cache-Control": "public, max-age=60"
    })
    
    # Cache the response
    await cache.put(request, response)
    
    return response

@edge_function(
    runtime="v8",
    regions=["us-east", "eu-west"]
)
async def geo_redirect(request: EdgeRequest) -> EdgeResponse:
    """Redirect users to region-specific API."""
    country = request.geo.country
    
    if country in EU_COUNTRIES:
        return EdgeResponse.redirect("https://eu-api.taskflow.com")
    elif country in APAC_COUNTRIES:
        return EdgeResponse.redirect("https://apac-api.taskflow.com")
    
    return EdgeResponse.redirect("https://us-api.taskflow.com")
\`\`\`

Deploy edge functions:

\`\`\`bash
# Deploy to Cloudflare Workers
fast edge deploy --function get_user_profile --target cloudflare

# Deploy to multiple platforms
fast edge deploy --function geo_redirect --target cloudflare,fastly

# View logs
fast edge logs --function get_user_profile --tail

# View metrics
fast edge metrics --function get_user_profile
\`\`\`

## Step 6: Client Integration Example

\`\`\`javascript
// React client using WebSocket
import { useEffect, useState } from 'react';

function useProjectWebSocket(projectId, token) {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(
      'wss://api.taskflow.com/ws/projects/' + projectId + '?token=' + token
    );
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'task_created':
          setTasks(prev => [...prev, message.data]);
          break;
        case 'task_updated':
          setTasks(prev => prev.map(t =>
            t.id === message.data.id ? { ...t, ...message.data } : t
          ));
          break;
        case 'user_typing':
          // Show typing indicator
          break;
      }
    };
    
    return () => ws.close();
  }, [projectId, token]);
  
  return tasks;
}

// GraphQL query example
const GET_PROJECT = \`
  query GetProject($id: UUID!) {
    project(id: $id) {
      id
      name
      tasks {
        id
        title
        status
      }
    }
  }
\`;
\`\`\`

## Final Architecture

\`\`\`text
TaskFlow Production Architecture
├── CDN/Edge (Cloudflare/Fastly)
│   ├── Static assets
│   ├── Edge functions (geo, caching)
│   └── DDoS protection
├── Load Balancer
│   └── SSL termination
├── API Servers (FastAPI)
│   ├── REST endpoints
│   ├── GraphQL endpoint
│   └── WebSocket handlers
├── Background Workers
│   ├── Email sending
│   ├── Report generation
│   └── Webhook delivery
├── Data Layer
│   ├── PostgreSQL (primary)
│   ├── Redis (cache/sessions)
│   └── S3 (file storage)
└── Monitoring
    ├── Tracing (Jaeger/Tempo)
    ├── Metrics (Prometheus)
    └── Logs (Loki/CloudWatch)
\`\`\`

## What You Learned

- ✅ WebSocket connections for real-time updates
- ✅ Broadcasting to connected clients
- ✅ GraphQL schema with Strawberry
- ✅ GraphQL auto-generation from REST
- ✅ Edge function deployment
- ✅ Full-stack integration

## Congratulations! 🎉

You've built a complete production-ready SaaS API with:
- REST and GraphQL endpoints
- Real-time WebSocket updates
- Authentication and authorization
- Distributed tracing and monitoring
- Caching and performance optimization
- Comprehensive testing
- Production deployment

## Next Steps

- Review the [Best Practices Guide](best-practices)
- Explore [Advanced Topics](topic-guides)
- Contribute to Fast: https://github.com/shregar1/fast.mvc

---

**Performance Tips:**

- Use edge functions for geographically distributed users
- Cache GraphQL responses at the edge
- Implement connection pooling for WebSockets
- Use Redis pub/sub for multi-server WebSocket scaling`,
};

// Export individual tutorials for easy access
export const tutorialPart1 = tutorialSeriesMarkdown['tutorial-part-1'];
export const tutorialPart2 = tutorialSeriesMarkdown['tutorial-part-2'];
export const tutorialPart3 = tutorialSeriesMarkdown['tutorial-part-3'];
export const tutorialPart4 = tutorialSeriesMarkdown['tutorial-part-4'];
export const tutorialPart5 = tutorialSeriesMarkdown['tutorial-part-5'];
export const tutorialPart6 = tutorialSeriesMarkdown['tutorial-part-6'];
export const tutorialPart7 = tutorialSeriesMarkdown['tutorial-part-7'];
export const tutorialPart8 = tutorialSeriesMarkdown['tutorial-part-8'];
export const tutorialOverview = tutorialSeriesMarkdown['tutorial-overview'];

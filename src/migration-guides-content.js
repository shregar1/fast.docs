// Migration Guides from Other Frameworks
// Django, Flask, Express.js, NestJS migrations

export const migrationGuidesMarkdown = {
  'migration-overview': `# Migration Guides

Moving from another framework to Fast? These guides help you translate patterns and migrate existing code.

## Available Migrations

| From | Guide | Complexity |
|------|-------|------------|
| [Django](migration-django) | Full-stack Python framework | Medium |
| [Flask](migration-flask) | Micro Python framework | Easy |
| [FastAPI](migration-fastapi) | ASGI Python framework | Very Easy |
| [Express.js](migration-express) | Node.js framework | Medium |
| [NestJS](migration-nestjs) | TypeScript Node framework | Medium |
| [Spring Boot](migration-spring) | Java framework | Hard |

## General Migration Strategy

1. **Incremental Migration**: Migrate endpoint by endpoint
2. **Strangler Fig Pattern**: Gradually replace old system
3. **Database-First**: Keep database, rewrite application layer

\`\`\`
┌─────────────────┐      ┌─────────────────┐
│   Old System    │  →   │   Fast API      │
│  (Django/Flask) │      │  (New endpoints)│
└────────┬────────┘      └────────┬────────┘
         │                        │
         └──────────┬─────────────┘
                    │
              ┌─────┴─────┐
              │ Database  │
              │  (Shared) │
              └───────────┘
\`\`\``,

  'migration-django': `# Migrating from Django

Django and Fast share Python heritage but have different philosophies. This guide helps you migrate.

## Key Differences

| Aspect | Django | Fast |
|--------|--------|------|
| Architecture | Monolithic | Layered (Controller-Service-Repository) |
| ORM | Django ORM | SQLAlchemy 2.0 |
| Async | Limited (4.2+) | Native |
| Admin | Built-in | Custom (or separate admin) |
| Forms | Server-side | API-first (Pydantic) |
| Templates | Django templates | Separate frontend |

## Model Migration

### Django Model
\`\`\`python
# Django
from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']
\`\`\`

### Fast Equivalent
\`\`\`python
# Fast with SQLAlchemy
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class Project(Base):
    __tablename__ = "projects"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow
    )
    
    # Foreign key
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id")
    )
    
    # Relationship
    owner: Mapped["User"] = relationship("User", back_populates="projects")
\`\`\`

## View to Controller Migration

### Django View
\`\`\`python
# Django CBV
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

class ProjectListView(LoginRequiredMixin, ListView):
    model = Project
    template_name = 'projects/list.html'
    paginate_by = 20
    
    def get_queryset(self):
        return Project.objects.filter(
            owner=self.request.user
        ).select_related('owner')
\`\`\`

### Fast Controller
\`\`\`python
# Fast with dependency injection
from fastapi import APIRouter, Depends
from typing import Annotated

router = APIRouter()

@router.get("/projects", response_model=ProjectListResponse)
async def list_projects(
    limit: int = 20,
    offset: int = 0,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ProjectService, Depends(get_project_service)]
):
    """List projects for current user."""
    return await service.list_by_owner(
        owner_id=current_user.id,
        limit=limit,
        offset=offset
    )
\`\`\`

## Migration Migration

Django migrations → Alembic:

\`\`\`bash
# Django
python manage.py makemigrations
python manage.py migrate

# Fast
fastx db migrate -m "description"
fastx db upgrade
\`\`\`

### Keeping Existing Data

1. Don't drop Django tables yet
2. Use the same database
3. Add new Fast tables incrementally
4. Eventually remove Django tables

## Form to Pydantic Migration

### Django Form
\`\`\`python
from django import forms

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'description']
    
    def clean_name(self):
        name = self.cleaned_data['name']
        if len(name) < 3:
            raise forms.ValidationError("Name too short")
        return name
\`\`\`

### Pydantic Schema
\`\`\`python
from pydantic import BaseModel, Field, field_validator

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: str | None = Field(None, max_length=1000)
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if 'invalid' in v.lower():
            raise ValueError("Name contains invalid word")
        return v
\`\`\`

## Admin Panel Replacement

Django's admin is unmatched. Options for Fast:

1. **Custom Admin**: Build with Fast + React/Vue
2. **SQLAdmin**: Pre-built SQLAlchemy admin
3. **Keep Django Admin**: For data-only operations

\`\`\`bash
# Install SQLAdmin
pip install sqladmin

# Basic setup
from sqladmin import Admin, ModelView

admin = Admin(app, engine)

class ProjectAdmin(ModelView, model=Project):
    column_list = [Project.id, Project.name, Project.owner]

admin.add_view(ProjectAdmin)
\`\`\`

## Authentication Migration

### Django
\`\`\`python
from django.contrib.auth.decorators import login_required

@login_required
def my_view(request):
    user = request.user
    # ...
\`\`\`

### Fast
\`\`\`python
from fastapi import Depends
from typing import Annotated

@router.get("/protected")
async def protected_route(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # current_user is injected
    return {"user": current_user.email}
\`\`\`

## Settings Migration

### Django settings.py
\`\`\`python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'user',
        'PASSWORD': 'pass',
        'HOST': 'localhost',
    }
}
SECRET_KEY = 'django-secret'
DEBUG = False
\`\`\`

### Fast Pydantic Settings
\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@localhost/mydb"
    SECRET_KEY: str
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
\`\`\`

## Testing Migration

### Django Test
\`\`\`python
from django.test import TestCase
from django.urls import reverse

class ProjectTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(...)
    
    def test_list_projects(self):
        response = self.client.get(reverse('project-list'))
        self.assertEqual(response.status_code, 200)
\`\`\`

### Fast Test
\`\`\`python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_projects(async_client: AsyncClient):
    response = await async_client.get("/api/v1/projects")
    assert response.status_code == 200
\`\`\`

## Common Pitfalls

1. **Signals**: Replace Django signals with explicit service calls
2. **Managers**: Replace with repository methods
3. **QuerySets**: Replace with SQLAlchemy queries + eager loading
4. **Middleware**: Replace with FastAPI/Starlette middleware`,

  'migration-flask': `# Migrating from Flask

Flask to Fast is a natural progression. Both are Python web frameworks, but Fast adds modern features.

## Quick Comparison

| Flask | Fast |
|-------|------|
| WSGI (synchronous) | ASGI (async-native) |
| Manual validation | Pydantic auto-validation |
| Flask-SQLAlchemy | SQLAlchemy 2.0 |
| Flask-Login | JWT built-in |
| Flask-Migrate | Alembic (Fast CLI) |
| Manual docs | Auto OpenAPI/Swagger |

## App Structure Migration

### Flask
\`\`\`python
# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://...'
db = SQLAlchemy(app)

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
\`\`\`

### Fast
\`\`\`python
# app/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()

app = FastAPI(lifespan=lifespan)

@app.get("/users", response_model=list[UserResponse])
async def get_users():
    async with get_db() as db:
        users = await user_repo.list_all(db)
        return users
\`\`\`

## SQLAlchemy Migration

### Flask-SQLAlchemy
\`\`\`python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    
    def to_dict(self):
        return {'id': self.id, 'email': self.email}
\`\`\`

### SQLAlchemy 2.0 (Fast)
\`\`\`python
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    
    # No need for to_dict() - use Pydantic
\`\`\`

## Request/Response Migration

### Flask
\`\`\`python
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Manual validation
    if 'email' not in data:
        return jsonify({'error': 'email required'}), 400
    
    user = User(email=data['email'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201
\`\`\`

### Fast
\`\`\`python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str

@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(data: UserCreate):
    # Validation automatic via Pydantic
    user = await user_repo.create(data)
    return user
\`\`\`

## Blueprint to Router

### Flask Blueprint
\`\`\`python
# users/routes.py
from flask import Blueprint

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/', methods=['GET'])
def list_users():
    pass

# app.py
app.register_blueprint(bp)
\`\`\`

### Fast Router
\`\`\`python
# api/v1/routes/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def list_users():
    pass

# main.py
from api.v1.routes import users
app.include_router(users.router, prefix="/api/v1")
\`\`\`

## Flask-Login to Fast Auth

### Flask-Login
\`\`\`python
from flask_login import login_required, current_user

@app.route('/profile')
@login_required
def profile():
    return jsonify({'email': current_user.email})
\`\`\`

### Fast
\`\`\`python
from fastapi import Depends
from typing import Annotated

@router.get("/profile")
async def profile(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return {"email": current_user.email}
\`\`\`

## Testing Migration

### Flask Test
\`\`\`python
import pytest

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_users(client):
    response = client.get('/users')
    assert response.status_code == 200
\`\`\`

### Fast Test
\`\`\`python
import pytest
from httpx import AsyncClient

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_get_users(async_client):
    response = await async_client.get('/users')
    assert response.status_code == 200
\`\`\`

## Why Migrate from Flask?

1. **Performance**: Async handles more concurrent connections
2. **Type Safety**: Pydantic validation catches errors early
3. **Auto Documentation**: OpenAPI spec generated automatically
4. **Modern Python**: Native async/await, type hints
5. **Built-in Features**: Caching, tracing, encryption out of box`,

  'migration-fastapi': `# Migrating from FastAPI

Already using FastAPI? Fast extends it with enterprise features. Migration is seamless.

## What Changes?

| FastAPI | Fast |
|---------|------|
| Manual caching setup | Built-in Smart Caching |
| No N+1 detection | Automatic detection |
| Manual tracing setup | Built-in distributed tracing |
| Manual encryption | Field-level encryption |
| Basic project structure | Layered architecture (C-S-R) |
| Manual testing setup | ItemFactory + fixtures |

## Minimal Migration

Your existing FastAPI code works as-is. Fast adds optional decorators:

\`\`\`python
# Your existing FastAPI endpoint
@app.get("/users/{user_id}")
async def get_user(user_id: UUID):
    return await fetch_user(user_id)

# Enhanced with Fast features
from fastx_platform.caching import smart_cache
from fastx_dashboards.core import detect_nplus1, tracer

@app.get("/users/{user_id}")
@smart_cache.cached(ttl=300)
@detect_nplus1()
@tracer.trace_method()
async def get_user(user_id: UUID):
    return await fetch_user(user_id)
\`\`\`

## Project Structure Upgrade

### FastAPI (Typical)
\`\`\`
myapp/
├── main.py
├── models.py
├── schemas.py
├── crud.py
└── api/
    └── routes.py
\`\`\`

### Fast (Layered)
\`\`\`
myapp/
├── main.py
├── models/           # SQLAlchemy models
├── schemas/          # Pydantic DTOs
├── repositories/     # Data access
├── services/         # Business logic
├── api/
│   ├── deps.py       # Dependencies
│   └── v1/
│       └── routes/   # Controllers
└── core/
    ├── config.py
    ├── security.py
    └── cache.py
\`\`\`

## Adding Fast Features Incrementally

### 1. Add Smart Caching
\`\`\`python
from fastx_platform.caching import smart_cache

@smart_cache.cached(
    ttl=300,
    stale_ttl=60,
    invalidate_on=["user:update"]
)
async def get_user(user_id: UUID):
    return await db.get(User, user_id)
\`\`\`

### 2. Add N+1 Detection
\`\`\`python
from fastx_dashboards.core import detect_nplus1

@detect_nplus1(warning_threshold=5)
async def get_users_with_teams():
    users = await db.query(User).all()
    return [
        {**u.__dict__, "team": u.team.name}  # Will warn if N+1
        for u in users
    ]
\`\`\`

### 3. Add Distributed Tracing
\`\`\`python
from fastx_dashboards.core import tracer

@tracer.trace_method()
async def process_payment(order_id: UUID):
    span = tracer.get_current_span()
    span.set_attribute("order.id", str(order_id))
    
    # Process...
    span.add_cost("stripe", Decimal("0.30"))
\`\`\`

### 4. Add Field Encryption
\`\`\`python
from fastx_dashboards.core import Encrypted

class User(Base):
    email: Mapped[str]
    ssn: Mapped[Encrypted[str]]  # Auto encrypted
\`\`\`

## Dependency Injection Improvements

### FastAPI
\`\`\`python
async def get_db():
    async with SessionLocal() as session:
        yield session

def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)
\`\`\`

### Fast (Enhanced)
\`\`\`python
async def get_project_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    cache: Annotated[Cache, Depends(get_cache)],
    tracer: Annotated[Tracer, Depends(get_tracer)]
) -> ProjectService:
    repo = ProjectRepository(db)
    return ProjectService(repo, cache, tracer)
\`\`\`

## Testing Improvements

### FastAPI
\`\`\`python
from fastapi.testclient import TestClient

def test_create_user(client: TestClient):
    response = client.post("/users", json={"email": "test@test.com"})
    assert response.status_code == 201
\`\`\`

### Fast (With Factories)
\`\`\`python
from tests.factories import UserFactory

@pytest.mark.asyncio
async def test_create_user(async_client, db_session):
    # Create test data easily
    user = await UserFactory(db_session).create()
    
    response = await async_client.get(f"/users/{user.id}")
    assert response.status_code == 200
\`\`\``,

  'migration-express': `# Migrating from Express.js

Moving from Node.js/Express to Python/Fast. Both follow similar patterns.

## Concept Mapping

| Express | Fast |
|---------|------|
| Express app | FastAPI instance |
| Router | APIRouter |
| Middleware | Middleware/Depends |
| req/res | Request/Response |
| req.body | Pydantic models |
| req.params | Path parameters |
| req.query | Query parameters |
| next() | yield (context managers) |
| npm | pip |
| package.json | pyproject.toml |

## App Structure

### Express
\`\`\`javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json());
app.use('/users', require('./routes/users'));

app.listen(3000);
\`\`\`

### Fast
\`\`\`python
# main.py
from fastapi import FastAPI
from api.routes import users

app = FastAPI()
app.include_router(users.router, prefix="/users")
\`\`\`

## Route Migration

### Express Route
\`\`\`javascript
// routes/users.js
const router = require('express').Router();
const { body, validationResult } = require('express-validator');

router.post('/',
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await createUser(req.body);
    res.status(201).json(user);
  }
);
\`\`\`

### Fast Route
\`\`\`python
# api/routes/users.py
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str

@router.post("/", status_code=201)
async def create_user(data: UserCreate):
    # Validation automatic via Pydantic
    user = await create_user(data)
    return user
\`\`\`

## Middleware Migration

### Express Middleware
\`\`\`javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  req.user = verifyToken(token);
  next();
};

app.use('/protected', authMiddleware);
\`\`\`

### Fast Dependency
\`\`\`python
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user

@router.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    return {"user": user.email}
\`\`\`

## Mongoose to SQLAlchemy

### Mongoose Schema
\`\`\`javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
\`\`\`

### SQLAlchemy Model
\`\`\`python
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    name: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
\`\`\`

## Async Patterns

### Express (with async)
\`\`\`javascript
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
\`\`\`

### Fast (native async)
\`\`\`python
@router.get("/users")
async def list_users():
    users = await user_repo.list_all()
    return users
    # Errors handled by FastAPI exception handlers
\`\`\`

## Testing Migration

### Express (Jest)
\`\`\`javascript
const request = require('supertest');
const app = require('../app');

describe('GET /users', () => {
  it('returns users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
  });
});
\`\`\`

### Fast (pytest)
\`\`\`python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_users(async_client: AsyncClient):
    response = await async_client.get("/users")
    assert response.status_code == 200
\`\`\`

## Why Migrate from Express?

1. **Type Safety**: Python type hints + Pydantic vs JSDoc
2. **Performance**: Python async is competitive with Node
3. **Ecosystem**: SQLAlchemy vs Mongoose/Prisma
4. **Features**: Built-in caching, tracing, encryption
5. **Documentation**: Auto-generated vs manual Swagger`,

  'migration-nestjs': `# Migrating from NestJS

NestJS and Fast share similar architectural patterns. Migration focuses on syntax differences.

## Architectural Similarities

| Concept | NestJS | Fast |
|---------|--------|------|
| Controllers | @Controller() | APIRouter |
| Providers/Services | @Injectable() | Regular classes |
| Modules | @Module() | Python modules |
| Guards | @UseGuards() | Dependencies |
| Interceptors | @UseInterceptors() | Middleware/Decorators |
| Pipes | @UsePipes() | Pydantic validation |
| Decorators | TypeScript decorators | Python decorators |

## Controller Migration

### NestJS
\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  async findAll(@Query() query: ListUsersDto) {
    return this.usersService.findAll(query);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
\`\`\`

### Fast
\`\`\`python
router = APIRouter(prefix="/users")

@router.get("/")
async def list_users(
    query: Annotated[ListUsersQuery, Depends()],
    service: Annotated[UserService, Depends(get_user_service)]
):
    return await service.find_all(query)

@router.get("/{user_id}")
async def get_user(
    user_id: UUID,
    service: Annotated[UserService, Depends(get_user_service)]
):
    return await service.find_one(user_id)

@router.post("/", status_code=201)
async def create_user(
    data: CreateUserDto,
    service: Annotated[UserService, Depends(get_user_service)]
):
    return await service.create(data)
\`\`\`

## Service Migration

### NestJS
\`\`\`typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cacheManager: Cache,
  ) {}
  
  async findAll(query: ListUsersDto) {
    return this.usersRepository.find({
      skip: query.offset,
      take: query.limit,
    });
  }
}
\`\`\`

### Fast
\`\`\`python
class UserService:
    def __init__(
        self,
        repo: UserRepository,
        cache: Cache
    ):
        self.repo = repo
        self.cache = cache
    
    @smart_cache.cached(ttl=300)
    async def find_all(self, query: ListUsersQuery):
        return await self.repo.list_all(
            offset=query.offset,
            limit=query.limit
        )

def get_user_service(
    db: AsyncSession = Depends(get_db)
) -> UserService:
    return UserService(
        repo=UserRepository(db),
        cache=get_cache()
    )
\`\`\`

## Guard to Dependency

### NestJS Guard
\`\`\`typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    return this.validateToken(token);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {}
\`\`\`

### Fast Dependency
\`\`\`python
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> User:
    token = credentials.credentials
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401)
    return user

@router.get("/protected")
async def protected_route(
    user: Annotated[User, Depends(get_current_user)]
):
    return {"user": user.email}
\`\`\`

## TypeORM to SQLAlchemy

### TypeORM Entity
\`\`\`typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  fullName: string;
  
  @ManyToOne(() => Team, team => team.members)
  team: Team;
  
  @CreateDateColumn()
  createdAt: Date;
}
\`\`\`

### SQLAlchemy Model
\`\`\`python
class User(Base):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(unique=True)
    full_name: Mapped[str]
    
    team_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("teams.id")
    )
    team: Mapped[Team] = relationship("Team", back_populates="members")
    
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
\`\`\`

## Module Organization

### NestJS Module
\`\`\`typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
\`\`\`

### Fast Python Module
\`\`\`
users/
├── __init__.py
├── router.py      # Controllers/Routes
├── service.py     # Business logic
├── repository.py  # Data access
├── models.py      # SQLAlchemy models
└── schemas.py     # Pydantic DTOs
\`\`\`

## Testing Migration

### NestJS (Jest)
\`\`\`typescript
describe('UsersController', () => {
  let controller: UsersController;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    
    controller = module.get<UsersController>(UsersController);
  });
  
  it('should create user', async () => {
    const result = await controller.create({ email: 'test@test.com' });
    expect(result.email).toBe('test@test.com');
  });
});
\`\`\`

### Fast (pytest)
\`\`\`python
@pytest.mark.asyncio
async def test_create_user(async_client: AsyncClient):
    response = await async_client.post(
        "/users",
        json={"email": "test@test.com"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@test.com"
\`\`\`

## Why Migrate from NestJS?

1. **Performance**: Python async + uvloop vs Node.js
2. **Simplicity**: Less boilerplate, no compilation step
3. **Type Safety**: Pydantic runtime validation vs TypeScript compile-time
4. **Ecosystem**: Python's data/ML libraries
5. **Built-ins**: Caching, tracing, encryption included`,
};

export const migrationDjango = migrationGuidesMarkdown['migration-django'];
export const migrationFlask = migrationGuidesMarkdown['migration-flask'];
export const migrationFastAPI = migrationGuidesMarkdown['migration-fastapi'];
export const migrationExpress = migrationGuidesMarkdown['migration-express'];
export const migrationNestJS = migrationGuidesMarkdown['migration-nestjs'];

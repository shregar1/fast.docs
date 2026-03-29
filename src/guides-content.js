// Topic Guides and How-To Guides
// Conceptual explanations and practical recipes

export const topicGuidesMarkdown = {
  'topic-async': `# Understanding Async in Fast

Deep dive into Python's async/await patterns and how Fast leverages them.

## Why Async Matters

Traditional synchronous code blocks while waiting for I/O:

\`\`\`
Synchronous:  [DB Query]====[Wait]====[Response]
              Total: 100ms + 50ms + 10ms = 160ms
              
Asynchronous: [DB Query]----+
              [DB Query]----+
              [DB Query]----+---> All complete
              Total: ~100ms (concurrent)
\`\`\`

## The Event Loop

Python's \`asyncio\` provides an event loop that:
1. Runs async functions (coroutines)
2. Switches between them when they hit \`await\`
3. Resumes them when I/O completes

\`\`\`python
import asyncio

async def main():
    # This yields control, allowing other tasks to run
    await asyncio.sleep(1)  # Non-blocking!
    
    # Database I/O is non-blocking
    user = await db.get(User, id)
    
    # HTTP requests are non-blocking
    response = await httpx.get("https://api.example.com")
\`\`\`

## Fast is Native Async

Every layer of Fast is designed for async:

\`\`\`python
# Routes are async
@router.get("/users/{id}")
async def get_user(id: UUID):
    pass

# Services are async
class UserService:
    async def get_user(self, id: UUID) -> User:
        return await self.repo.get_by_id(id)

# Repositories are async
class UserRepository:
    async def get_by_id(self, id: UUID) -> User | None:
        result = await self.session.execute(...)
        return result.scalar_one_or_none()

# Even caching is async
@smart_cache.cached(ttl=300)
async def get_user_cached(id: UUID):
    pass
\`\`\`

## Common Async Patterns

### Gathering Multiple Operations

\`\`\`python
from asyncio import gather

async def get_dashboard_data(user_id: UUID):
    # Run all three concurrently
    user, projects, notifications = await gather(
        user_service.get(user_id),
        project_service.list_by_user(user_id),
        notification_service.get_unread(user_id)
    )
    
    return {
        "user": user,
        "projects": projects,
        "notifications": notifications
    }
# Time: max(10ms, 25ms, 15ms) = 25ms vs 50ms sequential
\`\`\`

### Background Tasks

\`\`\`python
from fastapi import BackgroundTasks

@router.post("/send-email")
async def send_email(
    data: EmailRequest,
    background_tasks: BackgroundTasks
):
    # Respond immediately
    background_tasks.add_task(actually_send_email, data)
    return {"status": "queued"}

async def actually_send_email(data: EmailRequest):
    # Runs after response is sent
    await email_client.send(data)
\`\`\`

### Timeouts

\`\`\`python
import asyncio

async def with_timeout():
    try:
        result = await asyncio.wait_for(
            slow_operation(),
            timeout=5.0
        )
    except asyncio.TimeoutError:
        result = None
\`\`\`

## Pitfalls to Avoid

### 1. Blocking the Event Loop

\`\`\`python
# BAD - Blocks all other requests!
@router.get("/slow")
async def slow_endpoint():
    import time
    time.sleep(10)  # ⛔ Blocks the event loop
    return {"done": True}

# GOOD - Non-blocking
@router.get("/slow")
async def slow_endpoint():
    await asyncio.sleep(10)  # ✅ Other requests can run
    return {"done": True}

# For CPU-bound work, use thread pool
@router.get("/cpu-intensive")
async def cpu_work():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, cpu_intensive_function)
    return result
\`\`\`

### 2. Forgetting await

\`\`\`python
# BAD - Returns coroutine object, not result
async def get_user(id: UUID):
    return self.repo.get_by_id(id)  # Missing await!

# GOOD
async def get_user(id: UUID):
    return await self.repo.get_by_id(id)
\`\`\`

### 3. Creating New Event Loops

\`\`\`python
# BAD
asyncio.new_event_loop()  # Don't do this in Fast

# GOOD - Use existing loop
await asyncio.sleep(1)
\`\`\`

## When to Use Sync vs Async

| Use Async | Use Sync (ThreadPool) |
|-----------|----------------------|
| Database queries | CPU-intensive calculations |
| HTTP requests | File I/O (unless aiofiles) |
| Cache operations | Heavy data processing |
| WebSocket handling | Image/video encoding |

## Async Context Managers

\`\`\`python
# Database session as async context manager
async with get_db() as session:
    user = await session.get(User, id)
    user.name = "New Name"
    await session.commit()
# Session automatically closed

# Custom async context manager
class timed:
    async def __aenter__(self):
        self.start = time.time()
        return self
    
    async def __aexit__(self, exc_type, exc, tb):
        elapsed = time.time() - self.start
        print(f"Operation took {elapsed:.2f}s")

async with timed():
    await slow_operation()
\`\`\``,

  'topic-dependency-injection': `# Understanding Dependency Injection

How Fast uses and extends FastAPI's dependency injection system.

## What is DI?

Instead of creating dependencies inside your code, you declare them as parameters. The framework provides them.

\`\`\`python
# Without DI (tight coupling)
async def get_user(user_id: UUID):
    db = create_database_connection()  # Hard to test!
    cache = create_redis_connection()
    service = UserService(db, cache)
    return await service.get(user_id)

# With DI (loose coupling)
async def get_user(
    user_id: UUID,
    service: Annotated[UserService, Depends(get_user_service)]
):
    return await service.get(user_id)  # Easy to mock in tests!
\`\`\`

## Dependency Hierarchy

\`\`\`
HTTP Request
    ↓
Auth Dependency (verifies JWT)
    ↓
DB Session Dependency
    ↓
Repository (uses session)
    ↓
Service (uses repository + cache)
    ↓
Route Handler (uses service)
    ↓
Response
\`\`\`

## Creating Dependencies

### Simple Dependencies

\`\`\`python
async def get_db() -> AsyncSession:
    """Database session dependency."""
    async with SessionLocal() as session:
        yield session

async def get_cache() -> Cache:
    """Cache client dependency."""
    return redis_cache

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
    """Authenticated user dependency."""
    user = await verify_token(token)
    if not user:
        raise HTTPException(status_code=401)
    return user
\`\`\`

### Composite Dependencies

\`\`\`python
async def get_user_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    cache: Annotated[Cache, Depends(get_cache)]
) -> UserService:
    """Service with injected dependencies."""
    return UserService(
        repository=UserRepository(db),
        cache=cache
    )

async def get_project_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    tracer: Annotated[Tracer, Depends(get_tracer)]
) -> ProjectService:
    """Another service with different dependencies."""
    return ProjectService(
        repository=ProjectRepository(db),
        tracer=tracer
    )
\`\`\`

## Using Dependencies

### In Routes

\`\`\`python
@router.get("/users/{id}")
async def get_user(
    id: UUID,
    service: Annotated[UserService, Depends(get_user_service)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # Both dependencies injected automatically
    return await service.get_by_id(id)
\`\`\`

### In Services

Services don't use FastAPI's DI directly - they receive dependencies via constructor:

\`\`\`python
class UserService:
    def __init__(
        self,
        repository: UserRepository,
        cache: Cache,
        email_client: EmailClient | None = None
    ):
        self.repo = repository
        self.cache = cache
        self.email = email_client or default_email_client
    
    async def create_user(self, data: UserCreate) -> User:
        # Use injected dependencies
        user = await self.repo.create(data)
        await self.cache.invalidate(f"user:{user.id}")
        await self.email.send_welcome(user.email)
        return user
\`\`\`

## Dependency Scopes

### Request Scope (Default)

New instance per request:

\`\`\`python
async def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        await session.close()  # Cleanup after request
\`\`\`

### Singleton Scope

Same instance for all requests:

\`\`\`python
# Create once at startup
_cache_instance: Cache | None = None

async def get_cache() -> Cache:
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = await create_cache()
    return _cache_instance
\`\`\`

## Advanced Patterns

### Conditional Dependencies

\`\`\`python
async def get_storage(
    settings: Annotated[Settings, Depends(get_settings)]
) -> Storage:
    """Choose storage based on settings."""
    if settings.STORAGE_BACKEND == "s3":
        return S3Storage(settings.AWS_BUCKET)
    elif settings.STORAGE_BACKEND == "gcs":
        return GCSStorage(settings.GCS_BUCKET)
    else:
        return LocalStorage("/tmp/storage")
\`\`\`

### Dependency with Configuration

\`\`\`python
class RateLimiter:
    def __init__(self, requests_per_minute: int):
        self.rpm = requests_per_minute

def get_rate_limiter(rpm: int = 60) -> RateLimiter:
    return RateLimiter(rpm)

# Use with different limits for different routes
@router.get("/public")
async def public_endpoint(
    limiter: Annotated[RateLimiter, Depends(lambda: get_rate_limiter(100))]
):
    pass

@router.get("/expensive")
async def expensive_endpoint(
    limiter: Annotated[RateLimiter, Depends(lambda: get_rate_limiter(10))]
):
    pass
\`\`\`

## Testing with DI

Easy to mock dependencies:

\`\`\`python
@pytest.mark.asyncio
async def test_get_user():
    # Create mock dependencies
    mock_repo = Mock(spec=UserRepository)
    mock_repo.get_by_id.return_value = User(id=1, email="test@test.com")
    
    mock_cache = Mock(spec=Cache)
    
    # Inject mocks
    service = UserService(mock_repo, mock_cache)
    
    # Test
    user = await service.get_by_id(1)
    assert user.email == "test@test.com"
    
    # Verify cache was checked
    mock_cache.get.assert_called_once_with("user:1")
\`\`\``,

  'topic-caching-strategies': `# Caching Strategies Deep Dive

Understanding when and how to use different caching patterns.

## Cache-Aside (Lazy Loading)

Most common pattern. Application manages cache.

\`\`\`
1. Check cache
2. If miss: load from source
3. Store in cache
4. Return data
\`\`\`

\`\`\`python
@smart_cache.cached(ttl=300)
async def get_user(user_id: UUID) -> User:
    return await db.get(User, user_id)

# Smart Cache handles:
# - Cache key generation
# - Serialization
# - Cache miss handling
# - TTL management
\`\`\`

**Pros:** Simple, flexible
**Cons:** Cache misses are slow (must hit database)

## Read-Through

Cache handles loading automatically.

\`\`\`
Application → Cache (miss) → Cache loads from DB → Returns to app
\`\`\`

Not directly supported by Smart Cache, but can simulate:

\`\`\`python
async def get_user(user_id: UUID) -> User:
    # Try cache
    cached = await cache.get(f"user:{user_id}")
    if cached:
        return User.parse_raw(cached)
    
    # Load and cache
    user = await db.get(User, user_id)
    await cache.set(f"user:{user_id}", user.json(), ttl=300)
    return user
\`\`\`

## Write-Through

Update cache when updating database.

\`\`\`
Application → Update DB → Update Cache → Return success
\`\`\`

\`\`\`python
class UserService:
    async def update_user(self, user_id: UUID, data: UserUpdate):
        # Update database
        user = await self.repo.update(user_id, data)
        
        # Update cache
        await self.cache.set(
            f"user:{user_id}",
            user.json(),
            ttl=300
        )
        
        return user
\`\`\`

**Pros:** Cache always fresh
**Cons:** Writes slower (must update both)

## Write-Behind (Write-Back)

Write to cache, async write to database.

\`\`\`
Application → Update Cache → Return success
                    ↓
            (Async) Update DB
\`\`\`

**Pros:** Fastest writes
**Cons:** Risk of data loss

Use for non-critical data only (analytics, logs).

## Stale-While-Revalidate (SWR)

Serve stale data while refreshing in background.

\`\`\`
Request → Check cache
            ↓
    ┌───────┴───────┐
Fresh (TTL)     Stale (TTL + stale_ttl)
    ↓               ↓
Return data    Return stale data
               + Trigger refresh
\`\`\`

\`\`\`python
@smart_cache.cached(
    ttl=300,       # Fresh for 5 min
    stale_ttl=60   # Serve stale for 1 more min
)
async def get_dashboard() -> Dashboard:
    return await compute_expensive_dashboard()

# Min 4 min: Returns fresh cached data
# Min 5 min: Still returns data (stale), triggers refresh
# Min 6+ min: Returns fresh data (refreshed)
\`\`\`

**Best for:** Data that can be slightly outdated, high-traffic endpoints

## Cache Warming

Pre-populate cache before it expires.

\`\`\`python
async def warm_cache():
    """Run periodically to refresh popular data."""
    popular_users = await get_most_active_users(limit=1000)
    
    for user in popular_users:
        await cache.set(
            f"user:{user.id}",
            user.json(),
            ttl=300
        )

# Schedule with APScheduler or Celery
scheduler.add_job(warm_cache, 'interval', minutes=4)
\`\`\`

## Multi-Layer Caching

Use different cache types for different needs:

\`\`\`
Request
    ↓
L1: In-Memory (LRU dict) - 1ms
    ↓ (miss)
L2: Redis (local) - 5ms
    ↓ (miss)
L3: Redis (remote cluster) - 15ms
    ↓ (miss)
Database - 100ms
\`\`\`

\`\`\`python
class MultiLayerCache:
    def __init__(self):
        self.l1 = LRUCache(maxsize=1000)  # Local dict
        self.l2 = RedisCache()             # Local Redis
        self.l3 = RedisCluster()           # Remote Redis
    
    async def get(self, key: str):
        # Try L1
        if value := self.l1.get(key):
            return value
        
        # Try L2
        if value := await self.l2.get(key):
            self.l1[key] = value
            return value
        
        # Try L3
        if value := await self.l3.get(key):
            await self.l2.set(key, value)
            self.l1[key] = value
            return value
        
        return None
\`\`\`

## Cache Invalidation Strategies

### Time-Based (TTL)

\`\`\`python
@smart_cache.cached(ttl=3600)  # 1 hour
\`\`\`

Simple but may serve stale data.

### Event-Based

\`\`\`python
@smart_cache.cached(
    ttl=3600,
    invalidate_on=["user:update", "user:delete"]
)
async def get_user(user_id: UUID):
    pass

# Invalidate when user changes
await cache.invalidate("user:update", user_id="123")
\`\`\`

Precise but requires explicit invalidation.

### Version-Based

\`\`\`python
cache_key = f"user:{user_id}:v{schema_version}"

# When schema changes, increment version
# Old keys naturally expire unused
\`\`\`

### Hybrid Approach

\`\`\`python
@smart_cache.cached(
    ttl=3600,  # Max age
    stale_ttl=60,  # Grace period
    invalidate_on=["user:update"]  # Immediate on change
)
async def get_user(user_id: UUID):
    pass
\`\`\`

## Choosing a Strategy

| Strategy | Best For | Avoid When |
|----------|----------|------------|
| Cache-Aside | General purpose | Cache stampede risk |
| Write-Through | Critical data | High write load |
| Write-Behind | Analytics, logs | Data can't be lost |
| SWR | Read-heavy, slightly stale OK | Financial data |
| Warming | Predictable hot data | Unpredictable patterns |

## Anti-Patterns

### Cache Everything

Not all data benefits from caching:

\`\`\`python
# BAD - User-specific, rarely accessed
@cached(ttl=300)
async def get_user_export_history(user_id: UUID):
    return await db.query(Export).filter_by(user_id=user_id).all()

# GOOD - High read, same for all users
@cached(ttl=300)
async def get_feature_flags():
    return await db.query(FeatureFlag).all()
\`\`\`

### Nested Caching

\`\`\`python
# BAD - Cache within cache
@cached(ttl=300)
async def get_user_with_orders(user_id: UUID):
    user = await get_user(user_id)  # Also cached!
    orders = await get_orders(user_id)  # Also cached!
    return {**user, "orders": orders}

# Cache composition is complex, prefer explicit
\`\`\`

### Ignoring Cache Failures

\`\`\`python
# BAD - Cache down = app down
user = await cache.get(key)
return User.parse_raw(user)

# GOOD - Graceful degradation
try:
    user = await cache.get(key)
    if user:
        return User.parse_raw(user)
except CacheError:
    logger.warning("Cache unavailable, hitting database")

return await db.get(User, user_id)
\`\`\``,
};

export const howToGuidesMarkdown = {
  'howto-oauth': `# How to Add OAuth2 with Google/GitHub

Step-by-step guide for adding social authentication.

## Overview

We'll add:
1. Google OAuth2 login
2. GitHub OAuth2 login
3. Account linking (multiple providers → one account)

## Step 1: Configure OAuth Providers

\`\`\`python
# app/core/oauth.py
from pydantic_settings import BaseSettings

class OAuthSettings(BaseSettings):
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    
    OAUTH_REDIRECT_URL: str = "http://localhost:8000/api/v1/auth/callback"

oauth_settings = OAuthSettings()
\`\`\`

## Step 2: Create OAuth Routes

\`\`\`python
# app/api/v1/routes/oauth.py
from fastapi import APIRouter, HTTPException, Query
from httpx import AsyncClient

router = APIRouter(prefix="/oauth", tags=["oauth"])

@router.get("/google/login")
async def google_login():
    """Redirect to Google OAuth."""
    params = {
        "client_id": oauth_settings.GOOGLE_CLIENT_ID,
        "redirect_uri": oauth_settings.OAUTH_REDIRECT_URL,
        "response_type": "code",
        "scope": "openid email profile",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return {"authorization_url": url}

@router.get("/callback")
async def oauth_callback(
    code: str,
    provider: str = Query(..., enum=["google", "github"]),
    db: AsyncSession = Depends(get_db)
):
    """Handle OAuth callback from provider."""
    if provider == "google":
        user_info = await exchange_google_code(code)
    else:
        user_info = await exchange_github_code(code)
    
    # Find or create user
    repo = UserRepository(db)
    user = await repo.get_by_email(user_info["email"])
    
    if not user:
        user = await repo.create_oauth_user(
            email=user_info["email"],
            full_name=user_info.get("name"),
            provider=provider,
            provider_id=user_info["id"]
        )
    
    # Create JWT tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

async def exchange_google_code(code: str) -> dict:
    """Exchange authorization code for tokens."""
    async with AsyncClient() as client:
        # Exchange code for tokens
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": oauth_settings.GOOGLE_CLIENT_ID,
                "client_secret": oauth_settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": oauth_settings.OAUTH_REDIRECT_URL,
                "grant_type": "authorization_code",
            }
        )
        tokens = token_response.json()
        
        # Get user info
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        return user_response.json()
\`\`\`

## Step 3: Update User Model

\`\`\`python
class User(Base):
    # ... existing fields ...
    
    # OAuth fields
    google_id: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    github_id: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    
    # Track OAuth vs password users
    is_oauth_only: Mapped[bool] = mapped_column(default=False)
\`\`\`

## Step 4: Link Multiple Providers

\`\`\`python
@router.post("/link/{provider}")
async def link_oauth_account(
    provider: str,
    code: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: AsyncSession = Depends(get_db)
):
    """Link additional OAuth provider to existing account."""
    # Get provider user info
    if provider == "google":
        info = await exchange_google_code(code)
        field = "google_id"
    elif provider == "github":
        info = await exchange_github_code(code)
        field = "github_id"
    
    # Check not linked to another account
    existing = await db.query(User).filter(
        getattr(User, field) == info["id"]
    ).first()
    
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail=f"{provider} account already linked to another user"
        )
    
    # Link to current user
    setattr(current_user, field, info["id"])
    await db.commit()
    
    return {"status": "linked", "provider": provider}
\`\`\`

## Frontend Integration

\`\`\`javascript
// React component
function GoogleLoginButton() {
  const handleLogin = async () => {
    // Get auth URL from backend
    const response = await fetch('/api/v1/oauth/google/login');
    const { authorization_url } = await response.json();
    
    // Redirect to Google
    window.location.href = authorization_url;
  };
  
  return <button onClick={handleLogin}>Login with Google</button>;
}

// Handle callback
function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  
  useEffect(() => {
    fetch('/api/v1/oauth/callback?code=' + encodeURIComponent(code) + '&provider=google')
      .then(r => r.json())
      .then(data => {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      });
  }, []);
  
  return <div>Logging in...</div>;
}
\`\`\``,

  'howto-rate-limiting': `# How to Set Up Rate Limiting per Tenant

Implement tenant-aware rate limiting for multi-tenant applications.

## Overview

Rate limits by:
- Global (all requests)
- Per tenant (organization)
- Per user
- Per endpoint

## Implementation

\`\`\`python
# app/core/rate_limit.py
from datetime import datetime, timedelta
from fastapi import Request, HTTPException
from fast_dashboards.core import smart_cache

class RateLimiter:
    def __init__(
        self,
        requests: int = 100,
        window: int = 60,  # seconds
        key_prefix: str = "ratelimit"
    ):
        self.requests = requests
        self.window = window
        self.key_prefix = key_prefix
    
    async def is_allowed(self, key: str) -> tuple[bool, dict]:
        """Check if request is allowed. Returns (allowed, headers)."""
        cache_key = f"{self.key_prefix}:{key}"
        
        # Get current count
        data = await smart_cache.get(cache_key) or {
            "count": 0,
            "reset_at": datetime.utcnow() + timedelta(seconds=self.window)
        }
        
        now = datetime.utcnow()
        reset_time = datetime.fromisoformat(data["reset_at"])
        
        # Reset if window expired
        if now > reset_time:
            data = {
                "count": 1,
                "reset_at": now + timedelta(seconds=self.window)
            }
        else:
            data["count"] += 1
        
        # Store updated count
        ttl = int((reset_time - now).total_seconds())
        await smart_cache.set(cache_key, data, ttl=max(ttl, 1))
        
        remaining = max(0, self.requests - data["count"])
        allowed = data["count"] <= self.requests
        
        headers = {
            "X-RateLimit-Limit": str(self.requests),
            "X-RateLimit-Remaining": str(remaining),
            "X-RateLimit-Reset": str(int(reset_time.timestamp()))
        }
        
        return allowed, headers

# Dependency factory
def rate_limit_by_tenant(
    requests: int = 1000,
    window: int = 3600  # 1 hour
):
    limiter = RateLimiter(requests, window, "tenant")
    
    async def check_limit(
        request: Request,
        current_user: Annotated[User, Depends(get_current_active_user)]
    ):
        if not current_user.team_id:
            raise HTTPException(status_code=400, detail="User not in team")
        
        key = str(current_user.team_id)
        allowed, headers = await limiter.is_allowed(key)
        
        # Store headers for response
        request.state.rate_limit_headers = headers
        
        if not allowed:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded",
                headers={**headers, "Retry-After": str(window)}
            )
    
    return check_limit

# Add headers to response
@app.middleware("http")
async def add_rate_limit_headers(request: Request, call_next):
    response = await call_next(request)
    
    if hasattr(request.state, "rate_limit_headers"):
        for key, value in request.state.rate_limit_headers.items():
            response.headers[key] = value
    
    return response
\`\`\`

## Usage

\`\`\`python
@router.get(
    "/projects",
    dependencies=[Depends(rate_limit_by_tenant(requests=1000, window=3600))]
)
async def list_projects():
    pass

# Different limits for different endpoints
@router.post(
    "/projects",
    dependencies=[Depends(rate_limit_by_tenant(requests=100, window=3600))]
)
async def create_project():
    pass
\`\`\`

## Tiered Rate Limits

\`\`\`python
async def tiered_rate_limit(
    request: Request,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Different limits based on subscription tier."""
    tier_limits = {
        "free": (100, 3600),
        "pro": (1000, 3600),
        "enterprise": (10000, 3600)
    }
    
    tier = current_user.team.plan
    requests, window = tier_limits.get(tier, (100, 3600))
    
    limiter = RateLimiter(requests, window, "tier")
    key = f"{current_user.team_id}:{tier}"
    
    allowed, headers = await limiter.is_allowed(key)
    request.state.rate_limit_headers = headers
    
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"{tier} plan limit exceeded. Upgrade for more."
        )
\`\`\``,

  'howto-soft-delete': `# How to Implement Soft Deletes

Keep deleted records while hiding them from queries.

## Model Setup

\`\`\`python
from datetime import datetime
from sqlalchemy import DateTime, select
from sqlalchemy.orm import Mapped, mapped_column, Query

class SoftDeleteMixin:
    """Mixin for soft delete functionality."""
    
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=None)
    
    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None
    
    async def soft_delete(self):
        """Mark as deleted."""
        self.deleted_at = datetime.utcnow()
    
    async def restore(self):
        """Restore deleted record."""
        self.deleted_at = None

class Project(SoftDeleteMixin, Base):
    __tablename__ = "projects"
    
    # ... other fields ...
\`\`\`

## Repository with Soft Delete

\`\`\`python
class ProjectRepository:
    def __init__(self, session: AsyncSession, include_deleted: bool = False):
        self.session = session
        self.include_deleted = include_deleted
    
    def _base_query(self):
        """Base query with soft delete filter."""
        query = select(Project)
        if not self.include_deleted:
            query = query.where(Project.deleted_at.is_(None))
        return query
    
    async def get_by_id(self, project_id: UUID) -> Project | None:
        result = await self.session.execute(
            self._base_query().where(Project.id == project_id)
        )
        return result.scalar_one_or_none()
    
    async def list_by_team(self, team_id: UUID) -> list[Project]:
        result = await self.session.execute(
            self._base_query()
            .where(Project.team_id == team_id)
            .order_by(Project.created_at.desc())
        )
        return result.scalars().all()
    
    async def delete(self, project: Project, hard: bool = False):
        """Soft delete by default, hard delete if specified."""
        if hard:
            await self.session.delete(project)
        else:
            await project.soft_delete()
    
    async def list_deleted(self, team_id: UUID) -> list[Project]:
        """List only deleted projects (admin use)."""
        result = await self.session.execute(
            select(Project)
            .where(Project.team_id == team_id)
            .where(Project.deleted_at.isnot(None))
        )
        return result.scalars().all()
\`\`\`

## API Endpoints

\`\`\`python
@router.delete("/{project_id}")
async def delete_project(
    project_id: UUID,
    hard: bool = Query(False, description="Permanently delete"),
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: AsyncSession = Depends(get_db)
):
    """Delete a project (soft delete by default)."""
    repo = ProjectRepository(db)
    project = await repo.get_by_id(project_id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await repo.delete(project, hard=hard)
    await db.commit()
    
    return {"status": "deleted", "hard": hard}

@router.post("/{project_id}/restore")
async def restore_project(
    project_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: AsyncSession = Depends(get_db)
):
    """Restore a soft-deleted project."""
    repo = ProjectRepository(db, include_deleted=True)
    project = await repo.get_by_id(project_id)
    
    if not project or not project.is_deleted:
        raise HTTPException(status_code=404, detail="Deleted project not found")
    
    await project.restore()
    await db.commit()
    
    return {"status": "restored"}
\`\`\``,

  'howto-fulltext-search': `# How to Add Full-Text Search

Implement search across multiple fields and models.

## PostgreSQL Full-Text Search

\`\`\`python
from sqlalchemy import func, or_
from sqlalchemy.dialects.postgresql import TSVECTOR

class Project(Base):
    __tablename__ = "projects"
    
    name: Mapped[str]
    description: Mapped[str]
    
    # Search vector (updated via trigger)
    search_vector: Mapped[str] = mapped_column(
        TSVECTOR,
        nullable=True
    )

# Migration to add search trigger
"""
CREATE OR REPLACE FUNCTION project_search_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_search_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION project_search_update();

-- Create GIN index for fast search
CREATE INDEX idx_project_search ON projects USING GIN(search_vector);
"""
\`\`\`

## Search Repository Method

\`\`\`python
from sqlalchemy import func

class ProjectRepository:
    async def search(
        self,
        query: str,
        team_id: UUID | None = None,
        limit: int = 20
    ) -> list[tuple[Project, float]]:
        """Search projects with relevance ranking."""
        # Convert query to tsquery
        tsquery = func.plainto_tsquery('english', query)
        
        # Build query with ranking
        stmt = (
            select(
                Project,
                func.ts_rank(Project.search_vector, tsquery).label('rank')
            )
            .where(Project.search_vector.op('@@')(tsquery))
            .where(Project.deleted_at.is_(None))
            .order_by(func.ts_rank(Project.search_vector, tsquery).desc())
            .limit(limit)
        )
        
        if team_id:
            stmt = stmt.where(Project.team_id == team_id)
        
        result = await self.session.execute(stmt)
        return result.all()  # List of (Project, rank) tuples
\`\`\`

## Search API

\`\`\`python
class SearchResult(BaseModel):
    id: UUID
    name: str
    description: str | None
    rank: float
    type: str = "project"

@router.get("/search", response_model=list[SearchResult])
async def search_projects(
    q: str = Query(..., min_length=2, description="Search query"),
    team_id: UUID | None = None,
    limit: int = Query(20, le=100),
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: AsyncSession = Depends(get_db)
):
    """Search projects by name and description."""
    repo = ProjectRepository(db)
    results = await repo.search(q, team_id, limit)
    
    return [
        SearchResult(
            id=project.id,
            name=project.name,
            description=project.description[:200] if project.description else None,
            rank=rank
        )
        for project, rank in results
    ]
\`\`\`

## Multi-Model Search

\`\`\`python
async def global_search(
    query: str,
    user: User,
    db: AsyncSession,
    limit: int = 10
) -> list[SearchResult]:
    """Search across projects, tasks, and users."""
    results = []
    
    # Search projects
    project_repo = ProjectRepository(db)
    projects = await project_repo.search(query, user.team_id, limit)
    results.extend([
        SearchResult(
            id=p.id, name=p.name, type="project", rank=r
        ) for p, r in projects
    ])
    
    # Search tasks
    task_repo = TaskRepository(db)
    tasks = await task_repo.search(query, user.team_id, limit)
    results.extend([
        SearchResult(
            id=t.id, name=t.title, type="task", rank=r
        ) for t, r in tasks
    ])
    
    # Sort by rank and return top results
    results.sort(key=lambda x: x.rank, reverse=True)
    return results[:limit]
\`\`\``,

  'howto-file-uploads': `# How to Handle File Uploads to S3

Handle file uploads with validation, virus scanning, and S3 storage.

## Configuration

\`\`\`python
# app/core/config.py
class Settings(BaseSettings):
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_BUCKET_NAME: str
    AWS_REGION: str = "us-east-1"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set[str] = {".pdf", ".jpg", ".png", ".docx"}
\`\`\`

## Upload Service

\`\`\`python
# app/services/upload_service.py
import boto3
from uuid import uuid4
from pathlib import Path
from botocore.exceptions import ClientError

class UploadService:
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.bucket = settings.AWS_BUCKET_NAME
    
    def validate_file(self, filename: str, content: bytes) -> None:
        """Validate file before upload."""
        # Check extension
        ext = Path(filename).suffix.lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise ValueError(f"File type {ext} not allowed")
        
        # Check size
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise ValueError(f"File too large (max {settings.MAX_UPLOAD_SIZE} bytes)")
        
        # TODO: Virus scanning with ClamAV
    
    async def upload_file(
        self,
        content: bytes,
        filename: str,
        folder: str = "uploads",
        metadata: dict | None = None
    ) -> dict:
        """Upload file to S3."""
        self.validate_file(filename, content)
        
        # Generate unique key
        ext = Path(filename).suffix
        key = f"{folder}/{uuid4()}{ext}"
        
        # Upload
        try:
            self.s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=content,
                ContentType=self._get_content_type(ext),
                Metadata=metadata or {}
            )
        except ClientError as e:
            raise UploadError(f"S3 upload failed: {e}")
        
        # Generate presigned URL
        url = self.s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket, 'Key': key},
            ExpiresIn=3600
        )
        
        return {
            "key": key,
            "url": url,
            "filename": filename,
            "size": len(content)
        }
    
    def _get_content_type(self, ext: str) -> str:
        types = {
            ".pdf": "application/pdf",
            ".jpg": "image/jpeg",
            ".png": "image/png",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
        return types.get(ext, "application/octet-stream")
\`\`\`

## Upload Endpoint

\`\`\`python
from fastapi import UploadFile, File

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = "general",
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[UploadService, Depends(get_upload_service)]
):
    """Upload a file to S3."""
    content = await file.read()
    
    result = await service.upload_file(
        content=content,
        filename=file.filename,
        folder=f"{current_user.team_id}/{folder}",
        metadata={
            "uploaded_by": str(current_user.id),
            "original_name": file.filename
        }
    )
    
    # Store file reference in database
    file_record = await file_repo.create(
        key=result["key"],
        filename=file.filename,
        size=result["size"],
        uploaded_by=current_user.id
    )
    
    return {
        "id": file_record.id,
        "url": result["url"],
        "filename": result["filename"],
        "size": result["size"]
    }
\`\`\`

## Direct Browser Upload (Presigned POST)

\`\`\`python
@router.post("/upload/presigned")
async def get_presigned_post(
    filename: str,
    content_type: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[UploadService, Depends(get_upload_service)]
):
    """Get presigned POST for direct browser upload."""
    ext = Path(filename).suffix
    key = f"{current_user.team_id}/uploads/{uuid4()}{ext}"
    
    presigned = service.s3.generate_presigned_post(
        Bucket=settings.AWS_BUCKET_NAME,
        Key=key,
        Fields={'Content-Type': content_type},
        Conditions=[
            {"Content-Type": content_type},
            ["content-length-range", 1, settings.MAX_UPLOAD_SIZE]
        ],
        ExpiresIn=600  # 10 minutes
    )
    
    return {
        "url": presigned["url"],
        "fields": presigned["fields"],
        "key": key
    }
\`\`\`

## Frontend Direct Upload

\`\`\`javascript
async function uploadFile(file) {
  // Get presigned POST from backend
  const { url, fields, key } = await fetch('/api/v1/upload/presigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      content_type: file.type
    })
  }).then(r => r.json());
  
  // Upload directly to S3
  const formData = new FormData();
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
  formData.append('file', file);
  
  await fetch(url, { method: 'POST', body: formData });
  
  // Notify backend of successful upload
  await fetch('/api/v1/upload/complete', {
    method: 'POST',
    body: JSON.stringify({ key, filename: file.name, size: file.size })
  });
}
\`\`\``,
};

export const howToOAuth = howToGuidesMarkdown['howto-oauth'];
export const howToRateLimiting = howToGuidesMarkdown['howto-rate-limiting'];
export const howToSoftDelete = howToGuidesMarkdown['howto-soft-delete'];
export const howToFulltextSearch = howToGuidesMarkdown['howto-fulltext-search'];
export const howToFileUploads = howToGuidesMarkdown['howto-file-uploads'];

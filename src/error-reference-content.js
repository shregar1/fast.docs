// Error Reference Documentation
// Comprehensive guide to all errors, warnings, and troubleshooting

export const errorReferenceMarkdown = {
  'error-overview': `# Error Reference

Complete reference for all errors, warnings, and diagnostic messages you may encounter when using Fast.

## Error Categories

| Category | Description | See Also |
|----------|-------------|----------|
| [Configuration Errors](error-config) | Environment, settings, startup issues | [Configuration](configuration) |
| [Database Errors](error-database) | SQLAlchemy, migrations, connection issues | [Persistence](persistence) |
| [Cache Errors](error-cache) | Redis, caching, invalidation issues | [Smart Caching](smart-caching) |
| [Auth Errors](error-auth) | JWT, authentication, permission denied | [Security](security) |
| [Validation Errors](error-validation) | Pydantic, request validation | [HTTP & API](http-api) |
| [Tracing Errors](error-tracing) | OpenTelemetry, exporter issues | [Distributed Tracing](distributed-tracing) |
| [Encryption Errors](error-encryption) | Field encryption, key issues | [Field Encryption](field-encryption) |
| [N+1 Warnings](error-nplus1) | Query performance warnings | [N+1 Detection](nplus1-detection) |
| [Saga Errors](error-saga) | Distributed transaction failures | [Saga Pattern](saga-pattern) |

## Error Response Format

All API errors follow a consistent format:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "request_id": "req_abc123xyz",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 400 | Bad Request | Validation errors, malformed JSON |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth, but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists, state conflict |
| 422 | Unprocessable | Semantic errors (e.g., invalid enum value) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected server error |
| 503 | Service Unavailable | Database down, service unhealthy |`,

  'error-config': `# Configuration Errors

Errors related to environment variables, settings, and application startup.

## FAST001: Invalid Secret Key

**Message:** \`SECRET_KEY must be at least 32 characters\`

**Cause:** Your JWT secret key is too short or not set.

**Solution:**
\`\`\`bash
# Generate a secure key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Add to .env
SECRET_KEY=your-generated-key-here
\`\`\`

## FAST002: Missing Required Environment Variable

**Message:** \`Missing required environment variable: DATABASE_URL\`

**Cause:** Required environment variable not set.

**Solution:**
\`\`\`bash
# Check your .env file
cat .env | grep DATABASE_URL

# Or set inline
export DATABASE_URL=postgresql://user:pass@localhost/db
\`\`\`

## FAST003: Invalid Database URL

**Message:** \`Invalid DATABASE_URL format\`

**Cause:** Database URL is malformed.

**Valid formats:**
\`\`\`bash
# PostgreSQL
postgresql://user:password@localhost:5432/dbname
postgresql+asyncpg://user:password@localhost:5432/dbname

# MySQL
mysql://user:password@localhost:3306/dbname

# SQLite
sqlite:///./app.db
sqlite+aiosqlite:///./app.db
\`\`\`

## FAST004: Environment Validation Failed

**Message:** \`Environment validation failed: REDIS_URL must start with redis://\`

**Cause:** Environment variable doesn't meet validation rules.

**Solution:** Check the specific validation message and correct the value.

## FAST005: Encryption Key Invalid

**Message:** \`ENCRYPTION_KEY must be 32 bytes base64 encoded\`

**Cause:** Field encryption key is wrong format.

**Solution:**
\`\`\`bash
# Generate valid key
export ENCRYPTION_KEY=$(python -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
\`\`\`

## FAST006: Profile Not Found

**Message:** \`Profile 'production' not found. Available: development, staging\`

**Cause:** Referenced configuration profile doesn't exist.

**Solution:**
\`\`\`bash
# Create profile file
touch .env.production

# Or use existing profile
export APP_ENV=development
\`\`\``,

  'error-database': `# Database Errors

SQLAlchemy, connection, and migration errors.

## DB001: Connection Refused

**Message:** \`Connection refused - is the database running?\`

**Cause:** Cannot connect to database server.

**Diagnosis:**
\`\`\`bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check with Docker
docker ps | grep postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1"
\`\`\`

**Solutions:**

| Scenario | Solution |
|----------|----------|
| Local dev | Start PostgreSQL: \`brew services start postgresql\` or \`docker-compose up db\` |
| Wrong host | Check DATABASE_URL hostname matches your setup |
| Firewall | Ensure port 5432 is open |
| Cloud DB | Verify security group allows your IP |

## DB002: Authentication Failed

**Message:** \`FATAL: password authentication failed for user "xxx"\`

**Cause:** Wrong username or password.

**Solution:**
\`\`\`bash
# Verify credentials
psql postgresql://correct_user:correct_pass@localhost/db -c "SELECT 1"

# Check .env matches your database setup
\`\`\`

## DB003: Database Does Not Exist

**Message:** \`FATAL: database "taskflow" does not exist\`

**Solution:**
\`\`\`bash
# Create database
createdb taskflow

# Or with Docker
docker-compose exec db createdb -U postgres taskflow

# Or run migrations (which may create it)
fast db upgrade
\`\`\`

## DB004: Migration Conflict

**Message:** \`Alembic migration conflict: multiple heads detected\`

**Cause:** Two branches of migrations created separately.

**Solution:**
\`\`\`bash
# View migration history
fast db history

# Merge heads
fast db merge heads -m "merge_branches"

# Or manually in alembic
alembic merge heads
\`\`\`

## DB005: No Such Table

**Message:** \`sqlalchemy.exc.NoResultFound: No row was found...\` or \`relation does not exist\`

**Cause:** Database tables not created.

**Solution:**
\`\`\`bash
# Run migrations
fast db upgrade

# Verify
fast db status
\`\`\`

## DB006: N+1 Query Detected

**Message:** \`N+1 Query Warning: 12 queries executed for 10 items\`

**Cause:** Accessing relationships without eager loading.

**Solution:**
\`\`\`python
# BAD - N+1 problem
users = await db.query(User).all()
for user in users:
    print(user.team.name)  # One query per user!

# GOOD - Eager load
from sqlalchemy.orm import selectinload

users = await db.query(User).options(
    selectinload(User.team)
).all()
for user in users:
    print(user.team.name)  # No extra queries
\`\`\`

See [N+1 Detection](nplus1-detection) for more.

## DB007: Deadlock Detected

**Message:** \`Deadlock detected while processing transaction\`

**Cause:** Two transactions waiting for each other's locks.

**Solution:**
- Access tables in consistent order
- Keep transactions short
- Use retry logic for deadlock exceptions

## DB008: Connection Pool Exhausted

**Message:** \`QueuePool limit overflow: 10 connections already checked out\`

**Cause:** Too many concurrent connections.

**Solution:**
\`\`\`python
# Increase pool size in settings
DATABASE_POOL_SIZE = 20
DATABASE_MAX_OVERFLOW = 10

# Or use connection pooling with PgBouncer in production
\`\`\``,

  'error-cache': `# Cache Errors

Redis and Smart Caching related errors.

## CACHE001: Redis Connection Error

**Message:** \`Error connecting to Redis: Connection refused\`

**Cause:** Cannot connect to Redis server.

**Diagnosis:**
\`\`\`bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# With Docker
docker ps | grep redis
docker-compose exec redis redis-cli ping
\`\`\`

## CACHE002: Cache Key Collision

**Message:** \`Cache key collision detected: two functions using same key\`

**Cause:** Multiple cached functions with identical key patterns.

**Solution:**
\`\`\`python
# Use unique key prefixes
@smart_cache.cached(
    key_builder=lambda user_id: f"user:{user_id}:profile"
)
async def get_user_profile(user_id: UUID):
    pass

@smart_cache.cached(
    key_builder=lambda user_id: f"user:{user_id}:settings"
)
async def get_user_settings(user_id: UUID):
    pass
\`\`\`

## CACHE003: Serialization Error

**Message:** \`Cannot serialize value for caching: TypeError...\`

**Cause:** Trying to cache non-serializable objects.

**Solution:**
\`\`\`python
# Return plain objects, not SQLAlchemy models
@smart_cache.cached(ttl=300)
async def get_user(user_id: UUID) -> dict:
    user = await repo.get_by_id(user_id)
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.full_name
    }  # Dict is serializable
\`\`\`

## CACHE004: Cache Stampede

**Message:** \`Cache stampede detected: 50 concurrent requests for key 'popular_products'\`

**Cause:** Too many requests hitting cache miss simultaneously.

**Solution:**
\`\`\`python
# Smart Cache already has stampede protection built-in
@smart_cache.cached(
    ttl=300,
    stale_ttl=60,  # Serve stale while refreshing
    lock_timeout=10  # Only one process refreshes
)
async def get_popular_products():
    return await expensive_query()
\`\`\`

## CACHE005: Invalidation Failed

**Message:** \`Cache invalidation failed: key pattern not found\`

**Cause:** Trying to invalidate keys that don't exist.

**Solution:**
\`\`\`python
# Check if key exists first
if await cache.exists(key):
    await cache.delete(key)

# Or use pattern delete (may be slower)
await cache.delete_pattern("user:*:profile")
\`\`\``,

  'error-auth': `# Authentication Errors

JWT, authentication, and authorization errors.

## AUTH001: Invalid Token

**Message:** \`Invalid authentication token\`

**Cause:** Token is malformed, expired, or signature invalid.

**Diagnosis:**
\`\`\`python
# Decode without verification to inspect
import jwt

decoded = jwt.decode(token, options={"verify_signature": False})
print(decoded["exp"])  # Check expiry
print(decoded["type"])  # Should be "access" not "refresh"
\`\`\`

**Solutions:**

| Issue | Solution |
|-------|----------|
| Expired | Refresh token: POST /auth/refresh |
| Wrong type | Use access token for API, refresh for /auth/refresh |
| Wrong secret | Ensure SECRET_KEY matches between services |
| Tampered | Token was modified, get new token |

## AUTH002: Missing Token

**Message:** \`Missing authorization header\`

**Solution:**
\`\`\`bash
# Include header in requests
curl -H "Authorization: Bearer YOUR_TOKEN" ...

# With Python requests
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(url, headers=headers)
\`\`\`

## AUTH003: Insufficient Permissions

**Message:** \`Missing required permission: project:delete\`

**Cause:** User authenticated but lacks required role/permission.

**Solution:**
\`\`\`python
# Check user role in your service
if not user.is_superuser and user.team_role != "admin":
    raise PermissionDenied("Admin role required")

# Or use permission decorator
@require_permission(Permission.PROJECT_DELETE)
async def delete_project(project_id: UUID):
    pass
\`\`\`

## AUTH004: User Inactive

**Message:** \`User account is disabled\`

**Cause:** User's is_active flag is false.

**Solution:**
\`\`\`python
# Admin can reactivate
user.is_active = True
await db.commit()
\`\`\`

## AUTH005: Wrong Credentials

**Message:** \`Incorrect email or password\`

**Cause:** Login credentials don't match.

**Troubleshooting:**
- Check for extra spaces in email
- Verify password (case sensitive)
- Check if user exists in database
- Ensure password hashing algorithm matches

## AUTH006: Token Expired

**Message:** \`Token has expired\`

**Solution:**
\`\`\`python
# Client should refresh
async function apiCall() {
  try {
    return await fetchWithToken(url);
  } catch (error) {
    if (error.status === 401) {
      await refreshToken();
      return await fetchWithToken(url);
    }
    throw error;
  }
}
\`\`\``,

  'error-validation': `# Validation Errors

Pydantic and request validation errors.

## VAL001: Field Required

**Message:** \`field required (type=value_error.missing)\`

**Cause:** Required field not provided in request.

**Solution:**
\`\`\`json
// Request must include all required fields
{
  "name": "Project Name",  // Required
  "description": "Optional"  // If not required
}
\`\`\`

## VAL002: Invalid Email

**Message:** \`value is not a valid email address (type=value_error.email)\`

**Solution:**
\`\`\`json
{
  "email": "user@example.com"  // Valid
}
\`\`\`

## VAL003: String Too Short/Long

**Message:** \`ensure this value has at least 8 characters\`

**Solution:**
\`\`\`python
# Schema definition
class UserCreate(BaseModel):
    password: str = Field(..., min_length=8, max_length=100)
\`\`\`

## VAL004: Invalid Enum Value

**Message:** \`value is not a valid enumeration member; permitted: 'active', 'archived'\`

**Solution:**
\`\`\`json
{
  "status": "active"  // Must be one of the allowed values
}
\`\`\`

## VAL005: Invalid UUID

**Message:** \`value is not a valid uuid (type=type_error.uuid)\`

**Solution:**
\`\`\`json
{
  "project_id": "550e8400-e29b-41d4-a716-446655440000"  // Valid UUID v4
}
\`\`\`

## VAL006: JSON Decode Error

**Message:** \`Expecting ',' delimiter: line 1 column 15\`

**Cause:** Malformed JSON in request body.

**Solution:**
\`\`\`bash
# Validate JSON
echo '{"name": "test"}' | python -m json.tool

# Fix common issues:
# - Use double quotes, not single
# - No trailing commas
# - Proper nesting
\`\`\``,

  'error-nplus1': `# N+1 Query Warnings

Understanding and fixing N+1 query detection warnings.

## What is N+1?

The N+1 problem occurs when you execute 1 query for parent records, then N additional queries for related records.

**Example of N+1:**
\`\`\`python
# 1 query for projects
projects = await db.query(Project).all()  # Query 1

# N queries for tasks (one per project!)
for project in projects:
    print(len(project.tasks))  # Queries 2, 3, 4, ... N+1
# Total: N+1 queries
\`\`\`

**Warning Message:**
\`\`\`
N+1 Query Warning: 11 queries executed for 10 projects
Threshold: 3 | Actual: 11
Location: app/services/project_service.py:42
\`\`\`

## How to Fix

### Solution 1: Eager Loading (selectinload)

\`\`\`python
from sqlalchemy.orm import selectinload

# GOOD: Load all relationships in 2 queries
projects = await db.query(Project).options(
    selectinload(Project.tasks),
    selectinload(Project.owner)
).all()

for project in projects:
    print(len(project.tasks))  # No extra queries!
# Total: 2 queries
\`\`\`

### Solution 2: Joined Load

\`\`\`python
from sqlalchemy.orm import joinedload

# Single query with JOIN
projects = await db.query(Project).options(
    joinedload(Project.owner)
).all()
\`\`\`

### Solution 3: Explicit Query

\`\`\`python
# Manually fetch related data
project_ids = [p.id for p in projects]
tasks = await db.query(Task).filter(
    Task.project_id.in_(project_ids)
).all()

# Organize by project_id
tasks_by_project = defaultdict(list)
for task in tasks:
    tasks_by_project[task.project_id].append(task)
\`\`\`

## When to Ignore

Sometimes you may want to disable the warning:

\`\`\`python
@detect_nplus1(enabled=False)  # Disable for this method
async def get_project_count_only():
    # We're only counting, not accessing relationships
    return await db.query(func.count(Project.id)).scalar()

# Or increase threshold
@detect_nplus1(warning_threshold=20)  # Only warn if > 20 queries
async def export_all_data():
    # Bulk export expected to have many queries
    pass
\`\`\``,

  'error-saga': `# Saga Pattern Errors

Distributed transaction and saga execution errors.

## SAGA001: Saga Timeout

**Message:** \`Saga execution timed out after 30.0s\`

**Cause:** One or more saga steps took too long.

**Solution:**
\`\`\`python
# Increase timeout for long operations
saga = (
    SagaBuilder("data_migration")
    .with_timeout(300.0)  # 5 minutes
    .step("migrate", migrate_fn)
    .build()
)

# Or optimize the slow step
\`\`\`

## SAGA002: Compensation Failed

**Message:** \`Saga failed and compensation also failed: original_error, comp_error\`

**Cause:** Main action failed, then rollback/compensation also failed.

**This is serious** - your system may be in inconsistent state.

**Solution:**
1. Log extensively for manual intervention
2. Design compensations to be idempotent
3. Set up alerts for compensation failures

\`\`\`python
async def refund_payment_compensation(payment_id):
    try:
        # Idempotent - safe to run multiple times
        await payments.refund(payment_id)
    except AlreadyRefunded:
        pass  # OK, already done
    except Exception as e:
        # Log for manual review
        logger.critical(f"CRITICAL: Refund failed for {payment_id}", error=e)
        raise
\`\`\`

## SAGA003: Step Execution Failed

**Message:** \`Step 'charge_payment' failed: Insufficient funds\`

**Cause:** Business logic error in saga step.

**Solution:** Validate before saga execution:
\`\`\`python
# Check conditions before starting saga
if not await has_sufficient_funds(user_id, amount):
    raise ValidationError("Insufficient funds")

# Then execute saga
result = await saga.execute(...)
\`\`\`

## SAGA004: Invalid Step Order

**Message:** \`Saga steps must be added before build()\`

**Cause:** Trying to modify saga after it's built.

**Solution:**
\`\`\`python
# Correct order
saga = (
    SagaBuilder("order")
    .step("reserve", reserve_fn)           # Define all steps
    .step("charge", charge_fn)             # ...
    .step("ship", ship_fn)                 # ...
    .build()                               # Then build
)

result = await saga.execute(data)         # Then execute
\`\`\``,

  'error-tracing': `# Distributed Tracing Errors

OpenTelemetry and tracing related issues.

## TRACE001: OTLP Export Failed

**Message:** \`Failed to export spans: Connection refused\`

**Cause:** Cannot connect to tracing collector (Jaeger, Zipkin, etc.).

**Solution:**
\`\`\`bash
# Check collector is running
curl http://localhost:16686  # Jaeger UI

# Verify OTLP endpoint
export OTLP_ENDPOINT=http://localhost:4317

# Disable tracing if collector unavailable (development)
export TRACING_ENABLED=false
\`\`\`

## TRACE002: Span Too Large

**Message:** \`Span exceeds max size: 65000 bytes\`

**Cause:** Adding too much data to span attributes.

**Solution:**
\`\`\`python
# Don't add large payloads
span.set_attribute("response_body", json.dumps(huge_response))  # BAD

# Add relevant metadata only
span.set_attribute("response_size", len(response_body))
span.set_attribute("response_content_type", "application/json")
\`\`\`

## TRACE003: High Cardinality Warning

**Message:** \`High cardinality attribute detected: user_id has 10000+ unique values\`

**Cause:** Using high-cardinality values as span attributes.

**Solution:**
\`\`\`python
# Avoid high cardinality attributes
span.set_attribute("user_id", str(user.id))  # Problematic at scale

# Use low cardinality alternatives
span.set_attribute("user_tier", user.subscription_tier)  # free/pro/enterprise
span.set_attribute("endpoint", "/api/v1/users")  # Not full URL with IDs
\`\`\``,

  'error-encryption': `# Field Encryption Errors

Encryption key and field-level encryption issues.

## ENC001: Missing Encryption Key

**Message:** \`ENCRYPTION_KEY not set\`

**Solution:**
\`\`\`bash
# Generate and set key
export ENCRYPTION_KEY=$(python -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
\`\`\`

## ENC002: Decryption Failed

**Message:** \`Failed to decrypt field: Invalid token or wrong key\`

**Causes:**
- Data encrypted with different key
- Key was rotated without re-encrypting
- Data corruption

**Solution:**
\`\`\`python
# Re-encrypt with new key
def rotate_encryption(old_key, new_key):
    for user in session.query(User):
        # Decrypt with old key
        decrypted = decrypt(user.ssn, old_key)
        # Re-encrypt with new key
        user.ssn = encrypt(decrypted, new_key)
    
    session.commit()
\`\`\`

## ENC003: Field Too Long After Encryption

**Message:** \`Encrypted value exceeds column size\`

**Cause:** Encrypted data is larger than original + column limit.

**Solution:**
\`\`\`python
# Use TEXT instead of String for encrypted fields
class User(Base):
    # ssn: Mapped[str] = mapped_column(String(50))  # Too small
    ssn: Mapped[str] = mapped_column(Text)  # Use Text instead
\`\`\``,
};

export const errorConfig = errorReferenceMarkdown['error-config'];
export const errorDatabase = errorReferenceMarkdown['error-database'];
export const errorCache = errorReferenceMarkdown['error-cache'];
export const errorAuth = errorReferenceMarkdown['error-auth'];
export const errorValidation = errorReferenceMarkdown['error-validation'];
export const errorNPlus1 = errorReferenceMarkdown['error-nplus1'];
export const errorSaga = errorReferenceMarkdown['error-saga'];
export const errorTracing = errorReferenceMarkdown['error-tracing'];
export const errorEncryption = errorReferenceMarkdown['error-encryption'];

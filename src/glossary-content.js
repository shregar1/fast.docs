// Glossary and Concepts Reference
// Definitions of key terms and concepts used throughout Fast

export const glossaryMarkdown = {
  'glossary-overview': `# Glossary

Definitions of key terms, patterns, and concepts used throughout Fast documentation.

## Quick Reference

| Term | Category | Definition |
|------|----------|------------|
| **Async/Await** | Python | Syntax for asynchronous programming |
| **Cache Stampede** | Performance | Multiple simultaneous cache misses |
| **DTO** | Architecture | Data Transfer Object |
| **Eager Loading** | Database | Loading related data in one query |
| **Idempotent** | API Design | Operation that has same effect when repeated |
| **JWT** | Security | JSON Web Token for authentication |
| **N+1** | Performance | Database query anti-pattern |
| **Repository** | Architecture | Data access abstraction layer |
| **Saga** | Distributed Systems | Long-running transaction pattern |
| **Stale-While-Revalidate** | Caching | Serve stale data while refreshing |

## Browse by Category

- [Architecture Patterns](glossary-architecture)
- [Caching Concepts](glossary-caching)
- [Database Terms](glossary-database)
- [Security Concepts](glossary-security)
- [Distributed Systems](glossary-distributed)
- [Performance Terms](glossary-performance)`,

  'glossary-architecture': `# Architecture Patterns

## Controller

The layer that receives HTTP requests, validates input, and returns responses. Controllers should be thin - delegate business logic to services.

\`\`\`python
@router.get("/users/{user_id}")
async def get_user(user_id: UUID, service: UserService = Depends()):
    # Controller: just validate and delegate
    return await service.get_user(user_id)
\`\`\`

## Service Layer

Contains business logic, orchestrates repositories, and manages transactions. Services are framework-agnostic and contain the core domain logic.

## Repository Pattern

Abstracts data access. Repositories encapsulate queries and return domain models, hiding database details from services.

\`\`\`python
class UserRepository:
    async def get_by_email(self, email: str) -> User | None:
        # SQLAlchemy details hidden from service
        result = await self.session.execute(...)
        return result.scalar_one_or_none()
\`\`\`

## DTO (Data Transfer Object)

Objects used to transfer data between layers. In Fast, Pydantic models serve as DTOs for API requests/responses.

\`\`\`python
class UserCreate(BaseModel):  # DTO for creation
    email: EmailStr
    full_name: str

class UserResponse(BaseModel):  # DTO for response
    id: UUID
    email: str
    created_at: datetime
\`\`\`

## Dependency Injection

Pattern where dependencies are provided to components rather than created internally. FastAPI's \`Depends()\` implements this.

\`\`\`python
async def get_user(
    db: AsyncSession = Depends(get_db),  # Injected
    cache: Cache = Depends(get_cache)     # Injected
):
    pass  # Don't create db/cache here
\`\`\`

## Layered Architecture

Organizing code into distinct layers with clear responsibilities:
1. **Presentation**: Controllers, routes
2. **Business Logic**: Services
3. **Data Access**: Repositories
4. **Domain**: Models, entities

Dependency flow: Presentation → Business → Data`,

  'glossary-caching': `# Caching Concepts

## Cache-Aside (Lazy Loading)

Application checks cache first, loads from database on miss, then populates cache.

\`\`\`
1. Check cache
2. If miss: load from DB
3. Store in cache
4. Return data
\`\`\`

## Write-Through

Data written to cache and database simultaneously. Cache always has latest data.

## Write-Behind (Write-Back)

Data written to cache first, asynchronously persisted to database. Higher performance but risk of data loss.

## Stale-While-Revalidate (SWR)

Serve slightly outdated (stale) data while refreshing in background. Improves perceived performance.

\`\`\`python
@smart_cache.cached(
    ttl=300,      # Fresh for 5 min
    stale_ttl=60  # Serve stale for 1 more min
)
async def get_dashboard():
    return await expensive_query()
\`\`\`

## Cache Stampede (Thundering Herd)

When many requests simultaneously hit a cache miss, all trying to regenerate the same data.

**Solutions:**
- Request coalescing (only one process regenerates)
- Stale-while-revalidate
- Probabilistic early expiration

## Cache Invalidation

Removing or updating cached data when source data changes. Hard problems in computer science: naming things, cache invalidation, off-by-one errors.

\`\`\`python
# Event-based invalidation
@smart_cache.cached(
    invalidate_on=["user:update", "user:delete"]
)
async def get_user(user_id: UUID):
    pass
\`\`\`

## TTL (Time To Live)

Duration until cached data expires. Choose based on data volatility and freshness requirements.

| Data Type | Typical TTL |
|-----------|-------------|
| User profile | 5-15 min |
| Product catalog | 1-24 hours |
| Configuration | 1-60 min |
| Session data | 15-60 min |

## Hot Key

A cache key that receives disproportionately high traffic. Can overwhelm cache nodes.

**Mitigation:**
- Replicate hot keys across cache nodes
- Local caching (in-process) for hottest data
- Circuit breakers`,

  'glossary-database': `# Database Terms

## ORM (Object-Relational Mapping)

Maps database tables to Python classes. Fast uses SQLAlchemy 2.0.

\`\`\`python
class User(Base):  # Maps to "users" table
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str]
\`\`\`

## N+1 Query Problem

Executing one query for parent records, then N queries for related records.

\`\`\`python
# N+1: 11 queries for 10 users
users = await db.query(User).all()
for user in users:
    print(user.team.name)  # One query per user!

# Fixed: 2 queries total
users = await db.query(User).options(selectinload(User.team)).all()
\`\`\`

## Eager Loading

Loading related data in the same query as parent data. Prevents N+1.

**Methods:**
- \`selectinload()\` - Separate query per relationship, batched
- \`joinedload()\` - JOIN in single query
- \`subqueryload()\` - Uses subquery

## Lazy Loading

Loading related data on first access. Convenient but risky - can cause N+1.

\`\`\`python
user = await session.get(User, id)
print(user.team.name)  # Triggers additional query
\`\`\`

## Migration

Version-controlled database schema changes. Fast uses Alembic.

\`\`\`bash
fastx db migrate -m "add_user_table"  # Create migration
fastx db upgrade                      # Apply migrations
fastx db downgrade                    # Rollback one
\`\`\`

## Transaction

Atomic unit of work - all changes commit together or all roll back.

\`\`\`python
async with session.begin():
    user = User(email="test@example.com")
    session.add(user)
    # Commits if no exception, rolls back otherwise
\`\`\`

## ACID

Properties of database transactions:
- **Atomicity**: All or nothing
- **Consistency**: Valid state to valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed data survives crashes

## Connection Pool

Pre-created database connections ready for use. Avoids connection creation overhead.

\`\`\`python
# Pool settings
DATABASE_POOL_SIZE = 10        # Base connections
DATABASE_MAX_OVERFLOW = 20     # Extra under load
DATABASE_POOL_TIMEOUT = 30     # Seconds to wait
\`\`\`

## Index

Database structure that speeds up queries at cost of write performance and storage.

\`\`\`python
class User(Base):
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(index=True)  # Indexed
    # ...
\`\`\``,

  'glossary-security': `# Security Concepts

## JWT (JSON Web Token)

Compact, self-contained way to transmit information between parties as JSON object.

**Structure:** \`header.payload.signature\`

\`\`\`python
# Access token (short-lived)
token = create_access_token(user_id, expires_minutes=15)

# Refresh token (long-lived)
refresh = create_refresh_token(user_id, expires_days=7)
\`\`\`

## OAuth2

Authorization framework enabling third-party applications to obtain access to resources.

## Bearer Token

Token that grants access to whoever "bears" it. Must be kept secret.

\`\`\`bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
\`\`\`

## Field-Level Encryption

Encrypting specific sensitive fields (SSN, credit cards) while leaving other data plaintext.

\`\`\`python
class User(Base):
    name: Mapped[str]              # Plaintext
    ssn: Mapped[Encrypted[str]]    # Encrypted at rest
\`\`\`

## HTTPS/TLS

Encrypted communication protocol. Always use in production.

## Hashing (Passwords)

One-way function for storing passwords. Cannot be reversed to original.

\`\`\`python
# Store hashed password
user.password_hash = get_password_hash("user_password")

# Verify
verify_password("user_password", user.password_hash)  # True
\`\`\`

## Salt

Random data added to passwords before hashing. Prevents rainbow table attacks.

## Rate Limiting

Restricting number of requests per time period. Prevents abuse.

## CORS (Cross-Origin Resource Sharing)

Mechanism allowing web pages to request resources from different domain.

## SQL Injection

Attack inserting malicious SQL through user input. ORM prevents this.

\`\`\`python
# Vulnerable (don't do this)
query = f"SELECT * FROM users WHERE id = {user_id}"

# Safe with ORM
result = await db.query(User).filter(User.id == user_id).first()
\`\`\``,

  'glossary-distributed': `# Distributed Systems

## Saga Pattern

Managing long-running transactions across multiple services. Compensating actions on failure.

\`\`\`
Step 1: Reserve inventory ✓
Step 2: Process payment ✓
Step 3: Create shipment ✗ FAIL

→ Compensate: Refund payment, release inventory
\`\`\`

## Distributed Tracing

Tracking requests as they flow through multiple services.

**Components:**
- **Trace**: End-to-end request journey
- **Span**: Single operation within trace
- **Span Context**: Metadata propagated between services

## Idempotency

Operation that produces the same result whether called once or many times.

\`\`\`python
# Idempotent: Safe to retry
PUT /users/123 {name: "John"}  # Same result every time

# Not idempotent: Dangerous to retry
POST /charges {amount: 100}    # May double-charge!
\`\`\`

## Circuit Breaker

Pattern that prevents cascade failures by stopping calls to failing services.

\`\`\`
CLOSED  → Normal operation
OPEN    → Service failing, reject fast
HALF-OPEN → Testing if recovered
\`\`\`

## Eventual Consistency

Guarantee that if no new updates, all nodes will eventually have same data.

## Compensating Transaction

Undoing a completed transaction to maintain consistency. Used in sagas.

## Two-Phase Commit (2PC)

Protocol for distributed transactions. Prepare phase + Commit phase.

**Limitations:** Blocking, coordinator is single point of failure. Sagas preferred for microservices.

## Service Discovery

Automatic detection of services and their locations in distributed system.

## Load Balancing

Distributing requests across multiple service instances.

| Algorithm | Description |
|-----------|-------------|
| Round Robin | Even distribution |
| Least Connections | To instance with fewest active |
| IP Hash | Same client → same server |
| Weighted | Based on capacity |`,

  'glossary-performance': `# Performance Terms

## Async/Await

Python syntax for asynchronous programming. Enables handling many concurrent connections.

\`\`\`python
async def handle_request():
    # Yield control while waiting for I/O
    data = await fetch_from_database()
    return data
\`\`\`

## Concurrency vs Parallelism

- **Concurrency**: Handling multiple tasks by interleaving (one at a time, switch fast)
- **Parallelism**: Actually doing multiple tasks simultaneously (multiple cores)

Python async enables concurrency on single thread. Parallelism requires multiple processes.

## Throughput

Number of requests handled per unit time (requests/second).

## Latency

Time taken to process a single request (milliseconds).

| Component | Target Latency |
|-----------|----------------|
| API response | < 100ms (p99) |
| Database query | < 10ms |
| Cache hit | < 1ms |
| External API | < 500ms |

## P50, P95, P99

Percentile latencies:
- **P50**: Median - 50% of requests faster than this
- **P95**: 95% of requests faster than this
- **P99**: 99% of requests faster than this (tail latency)

## Cold Start

Time to initialize a new service instance. Important for serverless.

## Connection Pooling

Reusing established connections instead of creating new ones each time.

## Denormalization

Adding redundant data to improve read performance at cost of write complexity.

## CQRS (Command Query Responsibility Segregation)

Separating read and write models for optimization.

| Operation | Model |
|-----------|-------|
| Commands (writes) | Normalized, transactional |
| Queries (reads) | Denormalized, cached |

## Backpressure

Mechanism to prevent overwhelming downstream services by slowing down upstream.

## Graceful Degradation

System continues operating with reduced functionality when components fail.

\`\`\`
Recommendation service down → Continue without recommendations
Cache unavailable → Fetch from database (slower but functional)
\`\`\``,
};

export const glossaryArchitecture = glossaryMarkdown['glossary-architecture'];
export const glossaryCaching = glossaryMarkdown['glossary-caching'];
export const glossaryDatabase = glossaryMarkdown['glossary-database'];
export const glossarySecurity = glossaryMarkdown['glossary-security'];
export const glossaryDistributed = glossaryMarkdown['glossary-distributed'];
export const glossaryPerformance = glossaryMarkdown['glossary-performance'];

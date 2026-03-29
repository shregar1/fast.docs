/** Framework-specific documentation content extracted from reverse-engineering the codebase. */
export const frameworkContent = {
  'framework-overview': `# Framework Overview

**FastMVC** is a production-grade backend ecosystem built on top of FastAPI. It is designed to move beyond "router-only" architecture into a highly structured, enterprise-ready platform.

## The Monorepo Ecosystem

FastMVC consists of five core packages, each solving a specific layer of the modern backend:

| Package | Role | Key Features |
|---------|------|--------------|
| **fast-platform** | Infrastructure | Caching, task queues, messaging, OIDC, LLM, search integrations |
| **fast-middleware** | HTTP Layer | 90+ middlewares: Security headers, CORS, JWT, rate-limiting, tracing |
| **fast-database** | Persistence | SQLAlchemy v2 abstractions, migrations, repository patterns |
| **fast-dashboards** | Observability | Live admin UI, task monitoring, metrics visualization |
| **fast-mvc** | Core Framework | Scaffolding CLI, unified abstractions, project layout |

See **[Ecosystem overview](ecosystem)** for a navigable map and a documentation page per package.

## Project Philosophy

FastMVC is built on four immutable principles:

1. **Layered Purity**: HTTP concerns (Controllers) never touch SQL. Repositories never know about HTTP. Services coordinate both.
2. **Context-Aware**: Every layer inherits \`ContextMixin\`, providing a trace URN, user ID, and typed logger automatically.
3. **Convention Over Configuration**: Folders *are* the contract. Resources live in predictable paths so teams can scale without "directory debates."
4. **Graceful Degradation**: Infrastructure (Redis, Postgres) is optional. The framework degrades to in-memory mode if dependencies are missing, keeping developers productive anywhere.

---

## Technical Stack

- **Core**: FastAPI (Python 3.10+)
- **Validation**: Pydantic v2
- **Persistence**: SQLAlchemy v2 + Alembic
- **Middleware**: Custom \`fast-middleware\` stack
- **DI**: Constructor-style injection + FastAPI \`Depends\`
- **Logging**: Loguru with structured JSON output`,

  'core-abstractions': `# Core Abstractions

FastMVC enforces a strict architectural contract through a set of refined base classes and interfaces.

## 1. Controllers (\`IController\`)

Controllers are thin wrappers around FastAPI route functions that coordinate the request lifecycle.

- **Responsibility**: Orchestrate service calls, handle the request context, and format the final standard envelope.
- **Contract**: Inherit \`IController\`, call \`validate_request()\` to set up trace context (URN, UserID).
- **Pattern**: Uses a singleton instance per router to minimize overhead.
- **Location**: \`controllers/apis/v{n}/{resource}/{resource}_controller.py\`

\`\`\`python
from abstractions.controller import IController
from dtos.requests.item import CreateItemRequestDTO
from services.item.item_service import ItemService
from . import http as item_http # Response helpers

class ItemController(IController):
    def __init__(self, service: ItemService | None = None):
        super().__init__()
        self._service = service or ItemService()

    async def create(self, body: CreateItemRequestDTO, request: Request):
        # We call the service and use a helper to wrap the Result in a 201 Created
        # This automatically handles successful result maturation AND error bubbling.
        return item_http.respond_created_item(
            await self._service.create_item(name=body.name),
            request,
            reference_urn=body.reference_number
        )
\`\`\`

## 2. Services (\`IService\`)

Services are the "Brains." They hold business logic and coordinate between repositories. 

- **Responsibility**: Execute domain rules, handle transactions, and ensure business validation.
- **Contract**: Inherit \`IService\`, return \`Result[T, E]\`. Services *do not* know about HTTP, JSON, or Headers.
- **Location**: \`services/{resource}/{resource}_service.py\`

\`\`\`python
class ItemService(IService):
    async def create_item(self, name: str) -> Result[Item, Any]:
        # Explicit outcome handling via the Result pattern
        if not name.strip():
            return failure("Item name is required")
        
        item = Item(name=name.strip())
        return await self._repository.create(item)
\`\`\`

## 3. Repositories (\`IRepository\`)

Repositories are the "Gatekeepers." They provide a clean, typed interface to persistence.

- **Responsibility**: Typed SQLAlchemy v2 access, filter translation, and SQL mapping.
- **Contract**: Decouple the domain logic from the underlying storage technology.
- **Location**: \`repositories/{resource}.py\`

## 4. Entities & Aggregates

Domain models with identity and business rules.

- **Entity**: Identity-based with (\`id\`, \`created_at\`, \`updated_at\`).
- **AggregateRoot**: Entity + Domain Events + Optimistic Versioning.
- **SoftDeletable**: Adds \`deleted_at\` and logic to recover or permanently purge.

## 5. DTOs (Data Transfer Objects)

The strict contract for moving data between layers.

- **IRequestDTO**: Enforces a \`reference_number\` (UUID) for client-side tracing.
- **IResponseDTO**: The standardized API envelope used by all clients.
- **EnhancedBaseModel**: Adds automatic string sanitization and security scanning for XSS and SQLi.`,

  'request-lifecycle': `# Request Lifecycle

Every byte through FastMVC follows a deterministic 9-layer lifecycle to ensure security, observability, and reliability.

## 1. The Middleware Chain

The arrival of a request triggers a sequence of specialized middlewares from \`fast_middleware\`:

1. **RequestContext**: Generates the Unique Request Number (URN).
2. **TrustedHost / CORS**: Validates origin and host headers.
3. **SecurityHeaders**: Injects CSP, HSTS, and Frame-Protection.
4. **RateLimiter**: Sliding window protection against abuse.
5. **Logging**: Captures request metadata (redacting secrets).
6. **Timing**: Starts the \`X-Process-Time\` clock.
7. **Authentication**: JWT/OIDC validation and user resolution.

## 2. Dispatch & Routing

FastAPI matches the route and injects dependencies via \`Depends()\`.

## 3. The Controller Layer

The controller receives the raw request and DTO. It calls the service layer.

## 4. The Service Layer (The Context Boundary)

The service maps the URN and User ID into its execution context via \`ContextMixin\`. 

## 5. Result Maturation

The operation returns a \`Result\` object. The controller (or an http helper) unwraps this into a standardized JSON response envelope.

---

## Standardized Envelope

All FastMVC responses share this shape:

\`\`\`json
{
  "transactionUrn": "urn:req:...",
  "status": "SUCCESS",
  "responseMessage": "Operation succeeded",
  "responseKey": "item_created",
  "data": { ... },
  "errors": null,
  "metadata": { "processingTime": 42 },
  "timestamp": "2024-03-29T..."
}
\`\`\``,

  'pattern-catalog': `# Pattern Catalog

FastMVC ships with 25+ production-tested design patterns in its monorepo core. Here are the most critical abstractions:

## 1. The Result Pattern (\`Result<T, E>\`)
*Explicit outcome handling without side-effect exceptions.*
\`\`\`python
from abstractions.result import Result, success, failure

def divide(a: int, b: int) -> Result[float, str]:
    if b == 0:
        return failure("Division by zero")
    return success(a / b)

# Consumption
res = divide(10, 0)
if res.is_failure:
    print(res.error) # "Division by zero"
\`\`\`

## 2. Specification Pattern
Composable business rules for complex database filtering.
\`\`\`python
from abstractions.specification import ISpecification

class ActiveUserSpec(ISpecification[User]):
    def is_satisfied_by(self, user: User) -> bool:
        return user.is_active

class PremiumPlanSpec(ISpecification[User]):
    def is_satisfied_by(self, user: User) -> bool:
        return user.subscription == "premium"

# Composability
active_premium = ActiveUserSpec() & PremiumPlanSpec()
\`\`\`

## 3. Pipeline / Chain of Responsibility
Sequential processing for complex multi-step requests.

## 4. CQRS & Mediator
Decouple commands (writes) from queries (reads) via the \`Mediator\` abstraction.

## 5. Observer & Event Bus
In-process pub/sub for decoupled side effects (\`IDomainEvent\` → \`IEventHandler\`).

## 6. Value Objects
Immutable primitives (\`Email\`, \`Money\`, \`Slug\`) with internal validation logic.

---

### Also Included:
- **Strategy Pattern**: Swap algorithms at runtime.
- **State Pattern**: Manage complex transition lifecycles.
- **Mapper**: Clean mapping between repo models and domain entities.
- **Validator**: Rich declarative validation beyond Pydantic.
- **Saga Pattern**: Distributed transaction coordination.
- **Unit of Work**: Atomic coordination across multiple repositories.`,
};

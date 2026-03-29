/** Best practices & patterns — layered architecture (docs section `best-practices`). */
export const bestPracticesMarkdown = `# Best practices & patterns

This guide ties together **repository and service design**, **testing**, **API versioning**, and **configuration**—then walks **each layer** of a typical Fast app so you know what belongs where and how to keep boundaries clean. For generated folder layout, see **Project layout**; for framework features, see the feature sections in the sidebar.

---

## Repository pattern (deep dive)

**Repositories** own **persistence**: queries, ORM sessions, and mapping between DB rows and domain/DTO shapes. They do **not** know about HTTP, status codes, or user-facing error messages.

**Do**

- One repository **per aggregate** or clear resource boundary (e.g. \`UserRepository\`, \`OrderRepository\`).
- Return **domain models** or **read models** your service layer expects—not raw SQLAlchemy rows leaking everywhere.
- Keep **transactions** at the **service** or **unit-of-work** level unless a single-repo operation is truly atomic and trivial.

**Don’t**

- Call repositories **from** controllers or middleware—go through **services**.
- Put **business rules** in repositories (e.g. “if user is VIP, apply discount”)—that belongs in **services**.

**Testing:** fake or in-memory repositories behind service interfaces for **unit** tests; real DB for **integration** tests (see **Testing**).

---

## Service layer design

**Services** orchestrate **use cases**: they call repositories, apply **business rules**, coordinate **transactions**, and may call other services or **pipelines**.

**Do**

- **Inject** dependencies (repos, clients) via constructor or \`Depends()\`—avoid hidden singletons.
- Keep methods aligned to **verbs** your product understands: \`place_order\`, \`invite_user\`, not \`do_stuff\`.
- Emit **domain events** or messages **after** successful commits when needed (see **Saga Pattern** for cross-service flows).

**Don’t**

- Expose **FastAPI** \`Request\` / \`Response\` inside services—keep them framework-agnostic where possible.
- Mix **HTTP status** selection in services—return results or **exceptions** the controller maps to status codes.

---

## Testing strategies: unit vs integration

| Layer | Unit tests | Integration tests |
| --- | --- | --- |
| **Repository** | Mocked DB or thin fakes | Real DB, migrations, transactions |
| **Service** | Mocked repos + clock + id generator | DB + repos together; optional test containers |
| **Controller** | Often skipped in favor of service tests | HTTP client against running app (\`TestClient\`) |

**Rule of thumb:** **unit** tests prove **logic** fast; **integration** tests prove **wiring**, SQL, and HTTP contracts. Aim for a pyramid: many unit tests, fewer integration tests, a handful of **e2e** paths (**Testing**, **Production**).

---

## API versioning strategies

- **Path versioning** — \`/api/v1/users\`, \`/api/v2/users\`. Clear, cacheable, easy to route. Prefer **v1** in the path from day one if you expect public consumers.
- **Header versioning** — \`Accept: application/vnd.api+json; version=2\`. Flexible but harder to discover in docs.
- **Deprecation** — announce in **Changelog**, keep old routes **read-only** for a window, then remove with a **major** or documented breaking release (**HTTP & API surface**).

Internal-only APIs can start with a **single** version and split when breaking changes accumulate.

---

## Configuration management patterns

- **12-factor** — config via **environment** and secrets manager; no secrets in git (**Configuration**).
- **Profiles** — \`dev\` / \`staging\` / \`prod\` with different DSNs, log levels, feature flags.
- **Typed settings** — Pydantic Settings or equivalent so typos fail at **startup**, not runtime.
- **Hot reload** — optional for non-secret toggles; secrets still require restart or secure rotation (**Hot Config Reload**).

---

## Layer-by-layer checklist

Use this as a **mental model** for where code and tests should live. Names may vary by template; the **separation of concerns** should not.

### Controllers (routes / handlers)

**Role:** Map HTTP to service calls; validate **input** with **DTOs**; map results and errors to **responses**.

**Do:** thin handlers, **dependency injection** for services, consistent error mapping (e.g. domain exception → 404/409).

**Don’t:** SQL, caching policy details, or cross-cutting business rules.

### Factories

**Role:** Build **complex objects** or graphs (e.g. \`AppFactory\`, \`SessionFactory\`, test fixtures) without scattering \`new\` logic.

**Do:** centralize **wiring** for app startup and tests.

**Don’t:** hide **business rules** inside factories—only construction and defaults.

### DTOs (schemas)

**Role:** **Request/response** shapes, validation, and OpenAPI documentation (**Pydantic** models).

**Do:** separate **API** DTOs from **persistence** models when boundaries matter; version DTOs when APIs evolve.

**Don’t:** use DTOs as **ORM** entities for rich domain logic—keep persistence models in the **models** layer.

### Dependencies

**Role:** FastAPI \`Depends()\` (and similar) to inject **services**, **repos**, **current user**, **db session**, **tenant context**.

**Do:** small, composable dependencies; **override** them in tests.

**Don’t:** put heavy work in dependency **resolution**—resolve **providers**, not full use cases.

### Managers

**Role:** Optional façade for a **subsystem** (e.g. \`BillingManager\`, \`NotificationManager\`) coordinating multiple services or adapters.

**Do:** use when a **single service** would become too large but you don’t yet need full DDD bounded contexts.

**Don’t:** turn managers into **god objects**—split by bounded context instead.

### Pipelines / workflows

**Role:** **Ordered steps** with clear inputs/outputs: validation → enrichment → persistence → side effects (email, webhooks).

**Do:** make steps **idempotent** where retries matter; log **step name** in traces (**Distributed Tracing**).

**Don’t:** embed HTTP details in pipeline **steps**—pass plain data structures.

### Utilities

**Role:** **Pure** or **stateless** helpers: date formatting, ID generation, small algorithms.

**Do:** **unit test** heavily; no I/O in core utils unless clearly named (\`read_env_file\` is not a “util” in the same sense).

**Don’t:** import **services** or **repos** from generic utilities—dependencies point **inward**.

### Middleware

**Role:** **Cross-cutting** HTTP concerns: CORS, request id, auth extraction, rate limits, logging.

**Do:** keep middleware **fast**; push heavy work to **dependencies** or **services**.

**Don’t:** business rules that vary by **route**—use dependencies or decorators on routes instead.

### Models (domain / ORM)

**Role:** **Persistence** and **domain** entities as your stack defines them (SQLAlchemy models, etc.).

**Do:** migrations (**Persistence**); keep **invariants** that truly belong to the entity in the model when it helps clarity.

**Don’t:** leak ORM objects into **every** API response—map to **DTOs** when responses differ from storage shape.

### Abstractions

**Role:** **Interfaces** or **protocols** for repositories, clients, clocks, and feature flags—so services depend on **contracts**, not concrete vendors.

**Do:** introduce abstractions at **boundaries** you expect to fake or swap (payments, storage, email).

**Don’t:** abstract **everything** prematurely—YAGNI until you have two implementations or a hard test need.

---

## Related

- **Project layout** — directories after \`fast generate\`.
- **HTTP & API** — routing, OpenAPI, errors, versioning details.
- **Persistence** — sessions, transactions, migrations.
- **Testing** — pytest, \`TestClient\`, fixtures.
- **Configuration** — env, profiles, secrets.
- **[API development rules](/rules.html)** — team conventions and review checklist.`;

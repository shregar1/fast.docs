import { tutorialSeriesMarkdown } from './tutorial-series-content.js';
import { topicGuidesMarkdown, howToGuidesMarkdown } from './guides-content.js';
import { migrationGuidesMarkdown } from './migration-guides-content.js';
import { bestPracticesMarkdown } from './best-practices-content.js';
import { glossaryMarkdown } from './glossary-content.js';
import { errorReferenceMarkdown } from './error-reference-content.js';

// Documentation content
export const content = {
  // Tutorial Series (Progressive Learning)
  'tutorial-overview': tutorialSeriesMarkdown['tutorial-overview'],
  'tutorial-part-1': tutorialSeriesMarkdown['tutorial-part-1'],
  'tutorial-part-2': tutorialSeriesMarkdown['tutorial-part-2'],
  'tutorial-part-3': tutorialSeriesMarkdown['tutorial-part-3'],
  'tutorial-part-4': tutorialSeriesMarkdown['tutorial-part-4'],
  'tutorial-part-5': tutorialSeriesMarkdown['tutorial-part-5'],
  'tutorial-part-6': tutorialSeriesMarkdown['tutorial-part-6'],
  'tutorial-part-7': tutorialSeriesMarkdown['tutorial-part-7'],
  'tutorial-part-8': tutorialSeriesMarkdown['tutorial-part-8'],

  // Core Documentation
  introduction: `# Introduction

**Fast** is a production-grade building block framework for FastAPI that provides enterprise-ready features out of the box.

## Why Fast?

Unlike other frameworks that require you to glue together dozens of libraries, Fast provides a cohesive, batteries-included experience with:

- **Smart Caching** with stale-while-revalidate
- **Auto N+1 Detection** for database queries
- **Distributed Tracing** with cost attribution
- **Field-Level Encryption** for sensitive data
- **GraphQL Auto-Generation** from REST endpoints
- **Hot Config Reload** without restarts
- **Saga Pattern** for distributed transactions
- **Time-Travel Debugging** for request replay

## Learning Paths

| Path | For | Start Here |
|------|-----|------------|
| **Complete Beginner** | New to Python web dev | [Tutorial Part 1](tutorial-part-1) |
| **FastAPI User** | Upgrading from FastAPI | [Migration from FastAPI](migration-fastapi) |
| **Django/Flask User** | Switching from other Python frameworks | [Migration Guides](migration-overview) |
| **Experienced Dev** | Want quick overview | [Installation](installation) → [Smart Caching](smart-caching) |

## Quick Start

\`\`\`bash
# Install Fast
pip install fastmvc-cli

# Create a new project
fast generate my_project
cd my_project

# Run the development server
fast run
\`\`\`

Your API will be available at http://localhost:8000

For a guided, multi-part path (SaaS API with teams, billing, and webhooks), start with [Tutorial Part 1](tutorial-part-1).`,

  installation: `# Installation

## Requirements

- Python 3.10 or higher
- pip or uv package manager

## Quick Install

\`\`\`bash
pip install fastmvc-cli
\`\`\`

## Full Installation

\`\`\`bash
pip install fastmvc-cli[all]
\`\`\`

## Verify Installation

\`\`\`bash
fast --version
\`\`\`

## Create Your First Project

\`\`\`bash
fast generate my_api
cd my_api
fast run
\`\`\``,

  'project-layout': `# Concepts & project layout

A generated Fast project follows a **layered layout**: HTTP concerns stay at the edges, business rules live in services, and data access is isolated behind repositories. This page maps how those pieces fit together after \`fast generate\`.

## Layers at a glance

| Layer | Role | Avoid |
| --- | --- | --- |
| **Controllers** | Map HTTP to calls; validate input; return response models | SQL, caching policy, domain rules |
| **Services** | Business logic, orchestration, transactions | Raw SQL in large blocks; direct framework globals |
| **Repositories** | Queries, persistence, mapping to domain/DTOs | HTTP or user-facing errors |
| **DTOs / models** | Request/response shapes and validation | Hidden side effects |

Dependency flow is **inward**: controllers depend on services; services depend on repositories and other services—not the other way around.

## Typical directory layout

Exact names may vary by template, but you will usually see something like:

\`\`\`text
my_api/
├── app/
│   ├── main.py              # FastAPI app factory, lifespan, routers
│   ├── api/
│   │   └── v1/
│   │       ├── router.py    # Include versioned routes
│   │       └── routes/      # Per-resource controllers (handlers)
│   ├── core/                # Config, logging, security helpers
│   ├── services/            # Business logic
│   ├── repositories/        # DB access per aggregate/resource
│   ├── models/              # SQLAlchemy (or domain) models
│   └── schemas/             # Pydantic request/response DTOs
├── tests/
├── alembic/                 # Migrations (when DB is enabled)
└── pyproject.toml
\`\`\`

Use **one place** for routing (routers/controllers), **one** for orchestration (services), and **one** for persistence (repositories) so features like caching, tracing, and N+1 detection stay predictable.

## Request flow

1. **Router** matches path and method; parses/validates body with Pydantic schemas.
2. **Controller** (or route handler) receives validated input and calls a **service** method—often via constructor injection (\`Depends()\`), not \`Service()\` inside the method.
3. **Service** applies rules, coordinates repos, and may call other services.
4. **Repository** runs queries and returns models or DTOs; the service maps to API responses.

That keeps decorators such as \`@smart_cache.cached\`, \`@detect_nplus1\`, and \`@tracer.trace_method\` on the right layer (usually service or repository), which matches the examples elsewhere in this documentation.

## Configuration and bootstrap

Shared settings (database URL, Redis, feature flags) typically live under \`app/core/config\` and are loaded once at startup. See **Configuration** for env vars, profiles, and load order; **Hot Config Reload** for updating values without restarting the process.

## Related reading

- **[API development rules](/?page=rules)** — controllers vs services vs repositories, DTOs, and dependency injection in detail.
- **[Tutorial Series](tutorial-overview)** — Build a complete application step by step.

From here, open **Installation** for prerequisites if needed, then use the feature guides (e.g. **Smart Caching**, **Distributed Tracing**) where they apply in \`services/\` and \`repositories/\`.`,

  'cli-reference': `# CLI reference

The \`fast\` CLI ships with **fastmvc-cli**. Run it from your shell after install; inside a generated project, many commands assume the current directory is the project root.

## Global

\`\`\`bash
fast --version
fast --help
\`\`\`

Use \`fast <command> --help\` for subcommand-specific flags.

## \`fast generate\`

Scaffold a new API project.

\`\`\`bash
fast generate my_api
cd my_api
\`\`\`

Replace \`my_api\` with your project name. The generator creates the layered layout described in **Project layout**.

## \`fast run\`

Start the development server (from the project root).

\`\`\`bash
fast run
\`\`\`

Your API is typically served at \`http://localhost:8000\` unless configured otherwise.

## Time-travel debugging (\`fast replay\`)

Replay a recorded request locally for debugging (see **Time-Travel Debug** for recording and decorators).

\`\`\`bash
fast replay --recording=abc123 --breakpoint=line_45
\`\`\`

Adjust \`--recording\` to your recording id and \`--breakpoint\` to stop where you need to inspect state.

## Edge functions

Deploy and operate edge handlers (full options in **Edge Functions**).

\`\`\`bash
fast edge deploy --function get_user_profile --target cloudflare
fast edge deploy --function geo_redirect --target cloudflare,fastly
fast edge logs --function get_user_profile --tail
fast edge metrics --function get_user_profile
\`\`\`

## Chaos engineering

Run and inspect experiments (details in **Chaos Engineering**).

\`\`\`bash
fast chaos list
fast chaos start --experiment get_user_profile --target user-service
fast chaos start --experiment get_user_profile --dry-run
fast chaos stop --experiment get_user_profile
fast chaos status --experiment get_user_profile
\`\`\`

## Cost tracking

Dashboards, budgets, exports, and optimization (see **Cost Tracking**).

\`\`\`bash
fast cost dashboard
fast cost breakdown --by resource --period 30d
fast cost breakdown --by tenant --period 7d
fast cost breakdown --by endpoint --period 24h

fast cost budget create \\
  --tenant acme \\
  --limit 5000 \\
  --alert-threshold 80

fast cost budget list
fast cost budget status --tenant acme
fast cost budget update --tenant acme --limit 10000

fast cost optimize
fast cost optimize apply --id compute-downsize-api-service

fast cost export --format csv --period 30d --output costs.csv
fast cost reconcile --month 1 --year 2024
\`\`\`

## Database commands

\`\`\`bash
# Create migration from model changes
fast db migrate -m "add_user_table"

# Apply pending migrations
fast db upgrade

# Rollback one migration
fast db downgrade

# Show current status
fast db status

# View migration history
fast db history

# Reset database (development only!)
fast db reset
\`\`\`

## Related

- **Installation** — \`pip install fastmvc-cli\` and optional \`[all]\` extras.
- Feature docs in this site for behavior behind each command group.`,

  configuration: `# Configuration

This page describes how **settings are loaded**, how **environment variables** and **profiles** interact, and how that connects to **Hot Config Reload** (live updates without process restarts). Pair it with **Installation** for install paths and **Hot Config Reload** for the \`config_reloader\` API.

## Where settings live

Generated apps usually centralize configuration under \`app/core/config\` (or similar): a typed settings object (often Pydantic \`BaseSettings\`) is built **once** at startup and injected where needed. Secrets must not be committed—use env vars or a secrets manager in production.

## Load order (typical)

Later steps override earlier ones:

1. **Defaults** in code (safe local defaults, feature flags off, etc.).
2. **Environment variables** — override any field exposed on the settings model (naming follows your settings definition, e.g. \`DATABASE_URL\`, \`REDIS_URL\`).
3. **\`.env\`** in the project root (local development; often gitignored).
4. **Profile-specific files** (optional), e.g. \`.env.development\`, \`.env.staging\`, chosen by \`APP_ENV\` / \`FAST_ENV\` or your template's convention.

Exact variable names depend on the generated \`Settings\` class; run with \`fast run\` and inspect logs or use your IDE to jump to the settings module.

## Environment variables

- Prefer **one source of truth** in code (the settings model) and map env vars to fields.
- Use **different values per environment** via CI/CD or orchestration (Kubernetes secrets, Docker \`env_file\`, etc.) rather than copying \`.env\` to servers.
- **Boolean and numeric** env values are parsed by the settings layer—avoid stringly-typed checks scattered across the codebase.

## Profiles (\`development\`, \`staging\`, \`production\`)

A **profile** selects which optional file or preset applies:

- **development** — verbose logging, local DB, hot reload enabled.
- **staging** — production-like dependencies, test data policies.
- **production** — strict validation, no debug flags, externalized secrets.

Set the active profile the way your template documents (commonly \`APP_ENV=production\` or \`FAST_ENV=development\`). The same codebase should run in all profiles; only configuration changes.

## Hot reload vs startup load

- **At startup**, the process reads env and \`.env\` (and profile files) into the in-memory settings object.
- **Hot Config Reload** watches paths such as \`.env\` or specific keys and runs callbacks when values change—see **Hot Config Reload** for \`config_reloader.watch\`, \`watch_file\`, and \`start_watching()\`.

So: **Configuration** = how values get into the app; **Hot Config Reload** = how some of those values can update **while the server keeps running**.

## Related

- **Installation** — installing \`fastmvc-cli\` and optional extras.
- **Hot Config Reload** — watching files and reacting to changes without restart.
- **Project layout** — where \`core/config\` sits in the tree.`,

  'http-api': `# HTTP & API surface

Fast sits on **FastAPI**: you define **routers**, wire **dependencies**, and get **OpenAPI** documentation for free. This page summarizes REST-oriented practices—**GraphQL Auto-Gen** builds on the same app for \`/graphql\`; **[API development rules](/?page=rules)** goes deeper on controllers, services, and DTOs.

## Routers

Group endpoints with \`APIRouter\`, give each module a **prefix** and **tags** for OpenAPI, and \`include_router\` on the main app (often under \`/api/v1/...\`). Keep route handlers thin: validate input, call a service or controller, return a response model.

\`\`\`python
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}")
async def get_user(user_id: UUID, controller: UserController = Depends()):
    return await controller.get_user(user_id)
\`\`\`

See **Project layout** for where routers live in the tree.

## Dependencies (\`Depends\`)

Use **constructor-style injection** (\`Depends()\`) for controllers, services, and database sessions—not \`Service()\` inside the handler body. That keeps tests and middleware predictable and matches the rules in **[API development rules](/?page=rules)**.

## OpenAPI

FastAPI exposes interactive docs by default (paths such as \`/docs\` and \`/redoc\`, depending on your app setup). **Pydantic** models drive request/response schemas, so keeping DTOs accurate keeps OpenAPI accurate. Disable or protect docs in production if your threat model requires it.

## Error models & status codes

- Return **meaningful HTTP status codes**: \`200\`/\`201\`/\`204\` for success variants, \`4xx\` for client issues, \`5xx\` for server failures.
- Prefer **consistent error bodies** (e.g. a shared \`ErrorResponse\` schema with \`code\`, \`message\`, \`details\`) via exception handlers or a small error helper—avoid ad-hoc JSON in every route.
- Use \`HTTPException\` for expected failures; register **exception handlers** for domain errors so clients always get the same shape.

\`\`\`python
from fastapi import HTTPException

raise HTTPException(status_code=404, detail="User not found")
\`\`\`

## Versioning

Common patterns:

- **URL prefix** — \`/api/v1/\`, \`/api/v2/\` (easy to see in logs and OpenAPI).
- **Header** — e.g. \`Accept: application/vnd.api+json; version=2\` (more work for clients).
- **Query** — rarely ideal for public APIs.

Pick one strategy per product and document it in OpenAPI descriptions and **Project layout** conventions.

## GraphQL

Your REST stack remains the source of truth for **GraphQL Auto-Gen**; configure the mounted GraphQL endpoint alongside REST. Clients may use REST, GraphQL, or both.

## Related

- **GraphQL Auto-Gen** — generating GraphQL from your FastAPI app.
- **Project layout** — layers and request flow.
- **[API development rules](/?page=rules)** — REST patterns, DTOs, and dependency injection in depth.`,

  persistence: `# Persistence

Fast projects typically use **SQLAlchemy** for models and queries and **Alembic** for schema migrations. That lines up with **N+1 Query Detection** (how queries are loaded) and **Saga Pattern** (multi-step workflows that may touch the database and external systems).

## Engine & sessions

- Configure a single **async engine** from your **Configuration** (e.g. \`DATABASE_URL\`).
- Expose an **\`AsyncSession\`** to request handlers with \`Depends(get_session)\` (or your generator's equivalent): **one session per request**, closed or committed when the request finishes—never stash sessions on globals.
- **Repositories** take the session from services; **services** own transaction boundaries (see below).

\`\`\`python
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_factory() as session:
        yield session
        # commit/rollback handled in your template's pattern
\`\`\`

Tune pool size and timeouts for your deployment; values belong in settings, not hard-coded.

## Migrations (Alembic)

- SQLAlchemy **models** live under something like \`app/models/\`; **Alembic** keeps revisions under \`alembic/\`.
- After you change models, **generate a revision** (autogenerate where safe), **review** the diff, then **upgrade** (\`alembic upgrade head\` or a project-specific command such as \`fast db migrate\` if your template ships one).
- Treat migrations as code review: destructive changes need a rollout plan (backfill, dual-write, etc.).

## Transactions

- Prefer **one clear transaction per application operation** in the **service** layer: begin work, commit on success, roll back on failure.
- **Narrow** transactions to the work that must be atomic; long-held transactions hurt throughput and make **N+1** fixes harder to reason about.
- **Saga Pattern** is for **cross-service** or **multi-step** flows with compensations; ordinary single-database work stays in normal SQLAlchemy transactions—see **Saga Pattern** when you outgrow a single commit.

## Related

- **N+1 Query Detection** — eager loading and query shape.
- **Saga Pattern** — distributed steps and compensation.
- **Project layout** — where repositories and models live.`,

  security: `# Security

A production API needs **authentication and authorization**, **secrets** handled safely, **encryption in transit** (TLS), and—where required—**encryption at rest** for sensitive fields. **Field-Level Encryption** covers application-layer field encryption; this page ties that to the rest of your threat model.

## Authentication & authorization

- **Authentication** proves who is calling (\`Authorization\` header, session cookie, mTLS, etc.).
- **Authorization** decides what they may do (roles, scopes, resource-level checks)—enforce it in **services** or dedicated policy helpers, not scattered string checks.
- FastAPI works well with **OAuth2** flows, **JWT** bearer tokens, and **API keys** for machine clients; use \`Depends()\` for reusable security dependencies (see **HTTP & API surface** and **[API development rules](/?page=rules)**).

Prefer **short-lived** access tokens, **rotation** for refresh tokens or API keys where applicable, and **least privilege** for scopes.

## Secrets

- Load **database URLs**, signing keys, and third-party API keys from **environment** or a **secrets manager**—never commit them. See **Configuration**.
- **Rotate** credentials on a schedule and after incidents; avoid logging request headers or bodies that contain secrets.
- For local development, \`.env\` is fine; in production, inject secrets via your platform (Kubernetes secrets, IAM roles, Vault, etc.).

## Encryption in transit (TLS)

**HTTPS** protects bytes between the client and your edge (load balancer, API gateway, or app). Without TLS, tokens and payloads can be read or modified on the network.

- Terminate TLS at the **load balancer** or **reverse proxy** (common) or inside the app with certificates from your infra.
- **Field Encryption** and **TLS** solve different problems: TLS protects data **on the wire**; field encryption protects specific values **at rest** (and still assume TLS for requests).

## Field-level encryption

When you must limit exposure of SSNs, tokens, or other PII **in storage** or meet compliance requirements, use **Field-Level Encryption** (\`Encrypted[...]\` types, key management via env). That is **not** a substitute for TLS, authz, or database access control—combine layers.

## Related

- **Field-Level Encryption** — AES-GCM field types and \`FASTMVC_ENCRYPTION_KEY\`.
- **Configuration** — env vars and profiles for secrets.
- **HTTP & API surface** — OpenAPI, dependencies, error handling.
- **Persistence** — who can read data once it reaches the database.`,

  testing: `# Testing

Exercise your API with **pytest**, **async** tests, and FastAPI's **TestClient** (or **httpx** with **ASGITransport**). Use **fixtures** for app wiring and dependency overrides; **decorated** routes (cache, tracing, N+1) need clear boundaries so tests stay fast and deterministic.

## Pytest and async

- Install **pytest-asyncio** (or equivalent) so \`async def\` tests run reliably; mark coroutine tests with \`@pytest.mark.asyncio\` per your plugin's rules.
- Prefer a **dedicated test database** or **transaction rollback** per test so cases do not leak state—see **Persistence** for session patterns.

## TestClient (sync)

For many handlers, synchronous **TestClient** is enough:

\`\`\`python
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
\`\`\`

## Async tests with httpx

When you rely on **async** lifecycles, streaming, or async-only middleware, use **httpx.AsyncClient** with **ASGITransport(app=...)** so requests run against the same ASGI app as production.

\`\`\`python
import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

@pytest.mark.asyncio
async def test_users():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/users")
        assert response.status_code == 200
\`\`\`

## Fixtures & dependency overrides

- Build an **app** fixture that loads **test** settings (in-memory DB, fake secrets).
- **Override** FastAPI dependencies (\`Depends\`) for sessions, auth, or feature flags:

\`\`\`python
app.dependency_overrides[get_session] = override_get_test_session
\`\`\`

Reset overrides in teardown so tests do not affect each other.

## Testing decorated routes (cache, tracing, N+1)

Routes and services may use **Smart Caching**, **Distributed Tracing**, **N+1 Detection**, and similar decorators.

- **Behavior first**: assert HTTP responses and side effects (DB rows, messages)—not decorator internals.
- **Isolation**: use **in-memory** or **fake** backends for Redis/cache in unit tests, or **clear** keys between tests if you hit a real cache.
- **Tracing**: in fast unit tests, a **no-op** or in-memory exporter avoids flakiness; reserve span assertions for focused integration tests.
- **N+1**: integration tests can enable warnings or use query logging; keep expectations stable with **fixed** datasets.

If a test must bypass a decorator for speed, prefer **dependency overrides** or **calling the inner service** directly rather than patching framework internals.

## Related

- **HTTP & API surface** — routers and \`Depends\`.
- **Persistence** — sessions and transactions in tests.
- **Smart Caching**, **Distributed Tracing**, **N+1 Query Detection** — features exercised by your suite.`,

  production: `# Running in production

Ship your FastAPI app with clear **deployment** practices, **health** probes, **logging**, and **metrics**. This complements **Configuration** (env and secrets), **Security** (TLS and auth), and **Testing** (what you verified before release).

## Deployment (Docker & process managers)

- **Container image**: build a slim image (multi-stage if needed), run as a **non-root** user, and inject **Configuration** via env at runtime—not baked into the image.
- **ASGI server**: run with **uvicorn** or **gunicorn** with a **uvicorn worker** class; set **worker count** from CPU and workload (I/O vs CPU bound). Use **graceful shutdown** timeouts so in-flight requests finish.
- **Process manager** (bare metal, systemd, etc.): restart on failure, **limit** open files, and align **listen** address with your reverse proxy.

\`\`\`dockerfile
# Illustrative — adapt to your Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir .
USER 1000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Put TLS termination at a **load balancer** or **reverse proxy** (see **Security**) unless you manage certs in-app.

## Health & readiness

Expose **two** concepts for orchestrators:

- **Liveness** — process is alive; restart if this fails.
- **Readiness** — app can accept traffic (DB connected, migrations applied, critical deps up).

\`\`\`text
GET /health/live   → 200 if the event loop responds
GET /health/ready  → 200 only if DB/cache checks pass
\`\`\`

Exact paths depend on your template; wire checks to **Persistence** (sessions) and Redis/cache if you use them.

## Logging

- Use **structured JSON** logs in production (timestamp, level, request id, correlation id) so platforms can index and search.
- **Never log** secrets, tokens, or full **Field Encryption** payloads—redact or omit.
- Set **log level** from **Configuration** (\`INFO\` in prod, \`DEBUG\` only when needed).

## Metrics

- Export **Prometheus** metrics or use **OpenTelemetry** (see **Distributed Tracing**) for request rates, latencies, and error counts.
- **Cost tracking** and **chaos** features are optional layers—enable where they match your operational model.

## Before go-live checklist

- [ ] **Secrets** only in env/secrets manager; **TLS** enforced at the edge.
- [ ] **Production** profile: debug off, docs/OpenAPI **restricted** if required.
- [ ] **Database**: migrations applied; backups and restore tested.
- [ ] **Health/readiness** wired to your load balancer or Kubernetes probes.
- [ ] **Logging** aggregated; **alerts** on error rate and latency SLOs.
- [ ] **Load or soak** test run; **Testing** suite green in CI.
- [ ] **Runbook** for rollback and on-call contacts.

## Related

- **Configuration** — env, profiles, production settings.
- **Security** — TLS, auth, secrets.
- **HTTP & API surface** — versioning and error responses.
- **Testing** — pre-release verification.`,

  troubleshooting: `# Troubleshooting & FAQ

When something fails, narrow it down in **layers**: **process** → **configuration** → **dependencies** (DB, Redis, exporters) → **application** code. This page lists common issues and a short **debug workflow**.

## Where to look first

1. **Logs** — request id / trace id, stack traces, log level (temporarily \`DEBUG\` in non-prod only).
2. **Health & readiness** — **Production** — are \`/health/live\` and \`/health/ready\` passing? Failures often point to DB, Redis, or migrations.
3. **Configuration** — wrong **profile**, missing **env** var, typo in \`DATABASE_URL\` or Redis URL.
4. **Recent changes** — deploy, migration, config toggle, dependency upgrade.

## Misconfiguration

| Symptom | Things to check |
| --- | --- |
| App won't start | Python version, \`pip install\` / lockfile, import errors in logs |
| "Connection refused" / DB errors | \`DATABASE_URL\`, network/firewall, DB up, **Persistence** / pool limits |
| Wrong behavior between environments | \`APP_ENV\` / profile, feature flags, stale \`.env\` |
| Secrets missing | Env in process, K8s secret mount, **Configuration** load order |

Validate **Configuration** in a shell with the same env as the running process when possible.

## Cache (Redis / smart cache)

- **Stale or wrong data** — TTL, invalidation keys, clock skew; clear relevant keys in non-prod to test.
- **Thundering herd / misses** — check **Smart Caching** options (deduplication, SWR).
- **Connection errors** — Redis URL, TLS, auth, max connections; ensure cache client matches **Configuration**.

## Tracing & exporters

- **No traces in backend** — exporter **endpoint** (OTLP/gRPC/HTTP), **auth** headers, network egress from cluster.
- **Sampling** — traces may be sampled; confirm sampling rate for debugging.
- **High cardinality** — avoid unbounded attributes; see **Distributed Tracing**.

Verify the process can reach the collector (DNS, TLS, firewall).

## N+1 and database

- Warnings or slow endpoints — **N+1 Query Detection**, eager loading, query logs. See **Persistence** for session scope.

## Field encryption

- **Decrypt errors** — \`FASTMVC_ENCRYPTION_KEY\` rotated without re-encrypting data, or wrong key per environment. See **Field Encryption**.

## Debug workflow (quick)

1. Reproduce with a **minimal** request (curl or **Testing** \`TestClient\`).
2. Confirm **config** and **deps** (DB/Redis) independently of app code.
3. **Time-travel** or request replay if enabled — **Time-Travel Debug**.
4. If isolated to one route, bisect **middleware**, **dependencies**, then **service** / **repository**.

## Related

- **Configuration**, **Production**, **Testing**
- Feature guides: **Smart Caching**, **Distributed Tracing**, **Persistence**`,

  'smart-caching': `# Smart Caching

The Smart Caching System provides production-grade caching with cache-aside pattern, stale-while-revalidate, request deduplication, and event-based invalidation.

## Basic Usage

\`\`\`python
from fast_platform.caching import smart_cache

@smart_cache.cached(
    ttl=300,
    stale_ttl=60,
    invalidate_on=["user:update", "user:delete"]
)
async def get_user(user_id: str) -> User:
    return await db.query(User).get(user_id)
\`\`\`

## Stale-While-Revalidate

Serve stale data while refreshing in the background:

\`\`\`python
@smart_cache.cached(
    ttl=300,        # Fresh for 5 minutes
    stale_ttl=60    # Serve stale for 1 additional minute
)
async def get_dashboard_data() -> DashboardData:
    return await compute_dashboard_data()
\`\`\`

## Request Deduplication

When multiple concurrent requests hit a cache miss, only one database query is executed:

\`\`\`python
@smart_cache.cached(ttl=60)
async def get_popular_products() -> List[Product]:
    return await db.query(Product).order_by(Product.views.desc()).limit(10).all()
\`\`\`

See [Caching Strategies Deep Dive](topic-caching-strategies) for comprehensive coverage.`,

  'nplus1-detection': `# N+1 Query Detection

Automatic detection and prevention of N+1 query patterns in SQLAlchemy applications.

For sessions, Alembic migrations, and transaction boundaries, see **Persistence**.

## Usage

\`\`\`python
from fast_dashboards.core import detect_nplus1

@detect_nplus1(warning_threshold=5)
async def get_users_with_orders():
    users = await db.query(User).all()
    for user in users:
        print(user.orders)  # Triggers warning if N+1 detected
\`\`\`

## Fixing N+1 Issues

### Using selectinload

\`\`\`python
from sqlalchemy.orm import selectinload

async def get_users_good():
    users = await db.query(User).options(
        selectinload(User.orders)
    ).all()
    return users
\`\`\`

See [N+1 Query Warnings](error-nplus1) for detailed troubleshooting.`,

  'distributed-tracing': `# Distributed Tracing

OpenTelemetry-compatible distributed tracing with built-in cost tracking per request, tenant, and user.

## Usage

\`\`\`python
from fast_dashboards.core import tracer

@tracer.trace_method()
async def process_payment(order_id: str):
    return await process(order_id)

# View costs
cost = tracer.get_cost_by_tenant("tenant_123")
print(f"Total cost: \${cost.total_cost_usd}")
\`\`\`

## Cost Attribution

\`\`\`python
@tracer.trace_method()
async def ai_enhanced_endpoint(user_query: str):
    span = tracer.get_current_span()
    span.set_attribute("tenant.id", "tenant_123")
    
    response = await openai_client.chat.completions.create(...)
    span.add_cost("api", Decimal("0.03"))
    
    return response
\`\`\``,

  'field-encryption': `# Field-Level Encryption

AES-256-GCM authenticated encryption for sensitive fields with support for searchable encryption.

For auth, TLS, secrets handling, and how this layer fits your overall security model, see **Security**.

## Usage

\`\`\`python
from fast_dashboards.core import Encrypted

class User(BaseModel):
    name: str
    email: str
    ssn: Encrypted[str]  # Automatically encrypted
\`\`\`

## Setup

\`\`\`python
from fast_dashboards.core import setup_encryption

# From environment
setup_encryption()
\`\`\`

Set environment variable:
\`\`\`bash
export FASTMVC_ENCRYPTION_KEY=$(python -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
\`\`\``,

  'graphql-automation': `# GraphQL Auto-Generation

Automatically generate GraphQL schemas and resolvers from your FastAPI REST endpoints.

## Usage

\`\`\`python
from fast_dashboards.core import GraphQLAutoGenerator

app = FastAPI()
# ... define your REST endpoints

graphql = GraphQLAutoGenerator(app)
app.mount("/graphql", graphql.create_endpoint())
\`\`\`

This automatically generates GraphQL types, queries, and mutations from your Pydantic models and FastAPI endpoints.

For REST routing, OpenAPI, errors, and versioning, see **HTTP & API surface**.`,

  'hot-config-reload': `# Hot Config Reload

For how settings are first loaded (env, \`.env\`, profiles), read **Configuration**. This page covers **watching** config and applying updates without restarting your server.

## Usage

\`\`\`python
from fast_dashboards.core import config_reloader

@config_reloader.watch("database.host")
async def on_db_host_change(old, new):
    await reconnect_db(new)

config_reloader.watch_file(".env")
await config_reloader.start_watching()
\`\`\``,

  'saga-pattern': `# Saga Pattern

Manage distributed transactions across multiple services with automatic compensation on failure.

For SQLAlchemy sessions, migrations, and single-database transactions, see **Persistence**.

## Usage

\`\`\`python
from fast_dashboards.core import SagaBuilder, ok

saga = (
    SagaBuilder("order_processing")
    .step("reserve_inventory", reserve_fn, compensate=release_fn)
    .step("process_payment", payment_fn, compensate=refund_fn)
    .step("create_shipment", shipment_fn)
    .build()
)

execution = await saga.execute({"order_id": "123"})
\`\`\``,

  'time-travel-debugging': `# Time-Travel Debugging

Record and replay request flows for debugging production issues locally.

## Usage

\`\`\`python
from fast_dashboards.core import recordable

@recordable(name="process_order")
async def process_order(order_id: str):
    return await process(order_id)
\`\`\`

Replay locally:
\`\`\`bash
fast replay --recording=abc123 --breakpoint=line_45
\`\`\``,

  'api-reference': `# API Reference

## SmartCacheManager

\`\`\`python
class SmartCacheManager:
    async def get(self, key: str) -> Optional[Any]
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool
    async def delete(self, key: str) -> bool
    async def delete_pattern(self, pattern: str) -> int
    async def get_or_set(self, key: str, factory: Callable, ttl: Optional[int] = None) -> Any
\`\`\`

## Tracer

\`\`\`python
def start_span(name: str, kind: SpanKind = SpanKind.INTERNAL) -> Span
def finish_span(span: Span, status: Optional[SpanStatus] = None)
def trace_method(name: Optional[str] = None)
def get_cost_by_tenant(tenant_id: str) -> CostBreakdown
\`\`\`

## SagaBuilder

\`\`\`python
class SagaBuilder:
    def step(self, name: str, action: Callable, compensation: Optional[Callable] = None)
    def with_timeout(self, timeout: float)
    def build(self) -> Saga
\`\`\`

## Edge Functions

\`\`\`python
@edge_function(
    runtime: EdgeRuntime = EdgeRuntime.V8,
    regions: Optional[List[str]] = None,
    ttl: Optional[int] = None
)
async def my_edge_handler(request: EdgeRequest) -> EdgeResponse

class EdgeKV:
    async def get(self, key: str) -> Optional[Any]
    async def put(self, key: str, value: Any, ttl: Optional[int] = None) -> None
    async def delete(self, key: str) -> bool

class EdgeCache:
    async def match(self, request: EdgeRequest) -> Optional[EdgeResponse]
    async def put(self, request: EdgeRequest, response: EdgeResponse) -> None
\`\`\`

## Geo-Partitioning

\`\`\`python
@geo_partition(
    shard_key: str,
    strategy: GeoShardingStrategy = GeoShardingStrategy.PROXIMITY,
    replicas: Optional[Dict[str, int]] = None
)
class UserData(BaseGeoModel):
    pass

class GDPRCompliance:
    @staticmethod
    def requires_eu_residency(country_code: str) -> bool
    @staticmethod
    async def handle_data_deletion_request(user_id: UUID) -> Dict[str, Any]
\`\`\`

## Chaos Engineering

\`\`\`python
@chaos_experiment(
    failures: List[FailureConfig],
    blast_radius: float = 0.1,
    duration_minutes: int = 10
)
async def my_endpoint() -> Response

class ChaosController:
    @staticmethod
    async def start_experiment(name: str) -> ExperimentResult
    @staticmethod
    async def stop_experiment(name: str) -> bool
\`\`\`

## Cost Tracking

\`\`\`python
@track_costs(
    resource_type: ResourceType,
    model: str = "per-request"
)
async def my_endpoint() -> Response

class Budget:
    def __init__(
        self,
        monthly_limit: Decimal,
        alert_thresholds: List[BudgetAlert]
    )

class CostOptimizer:
    async def analyze(tenant_id: Optional[str] = None) -> List[OptimizationRecommendation]
\`\`\``,

  // Topic Guides (Conceptual)
  'topic-async': topicGuidesMarkdown['topic-async'],
  'topic-dependency-injection': topicGuidesMarkdown['topic-dependency-injection'],
  'topic-caching-strategies': topicGuidesMarkdown['topic-caching-strategies'],

  // How-To Guides (Recipes)
  'howto-oauth': howToGuidesMarkdown['howto-oauth'],
  'howto-rate-limiting': howToGuidesMarkdown['howto-rate-limiting'],
  'howto-soft-delete': howToGuidesMarkdown['howto-soft-delete'],
  'howto-fulltext-search': howToGuidesMarkdown['howto-fulltext-search'],
  'howto-file-uploads': howToGuidesMarkdown['howto-file-uploads'],

  // Migration Guides
  'migration-overview': migrationGuidesMarkdown['migration-overview'],
  'migration-django': migrationGuidesMarkdown['migration-django'],
  'migration-flask': migrationGuidesMarkdown['migration-flask'],
  'migration-fastapi': migrationGuidesMarkdown['migration-fastapi'],
  'migration-express': migrationGuidesMarkdown['migration-express'],
  'migration-nestjs': migrationGuidesMarkdown['migration-nestjs'],

  // Best Practices
  'best-practices': bestPracticesMarkdown['best-practices-overview'],

  rules: `# Rules

The **API development rules** are a standalone reference: controllers vs services vs repositories, DTOs, validation, dependency injection, and FastAPI-oriented patterns.

<p class="not-prose mt-6 mb-8"><a href="/?page=rules" class="fm-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium no-underline">Open full rules reference</a></p>

Prefer this doc viewer for navigation; use **Open full rules reference** for the printable, detailed page at \`/?page=rules\`.

## Related in these docs

- **Best practices & patterns** — layered architecture overview  
- **HTTP & API** — routers, OpenAPI, and handler shape  
- **API** hub — links to HTTP surface, API Reference, and Explorer  
`,

  // Glossary
  'glossary': glossaryMarkdown['glossary-overview'],
  'glossary-architecture': glossaryMarkdown['glossary-architecture'],
  'glossary-caching': glossaryMarkdown['glossary-caching'],
  'glossary-database': glossaryMarkdown['glossary-database'],
  'glossary-security': glossaryMarkdown['glossary-security'],
  'glossary-distributed': glossaryMarkdown['glossary-distributed'],
  'glossary-performance': glossaryMarkdown['glossary-performance'],

  // Error Reference
  'error-reference': errorReferenceMarkdown['error-overview'],
  'error-config': errorReferenceMarkdown['error-config'],
  'error-database': errorReferenceMarkdown['error-database'],
  'error-cache': errorReferenceMarkdown['error-cache'],
  'error-auth': errorReferenceMarkdown['error-auth'],
  'error-validation': errorReferenceMarkdown['error-validation'],
  'error-nplus1': errorReferenceMarkdown['error-nplus1'],
  'error-saga': errorReferenceMarkdown['error-saga'],
  'error-tracing': errorReferenceMarkdown['error-tracing'],
  'error-encryption': errorReferenceMarkdown['error-encryption'],
};

// Export existing components for homepage
export { createHeroSection, createHomeWriteLessSection, createFeaturesGrid, createComparisonTable, createCTASection, createDocsPage, highlightCode } from './content-components.js';

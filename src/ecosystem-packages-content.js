/** Per-package docs (sidebar section ids: ecosystem, pkg-fast-*). */

export const ecosystemPackagesMarkdown = {
  ecosystem: `# Ecosystem

**Fast** ships as a **monorepo of coordinated Python packages**. Each package owns a slice of the stack—from infrastructure primitives to HTTP middleware, persistence, observability UI, and the scaffolding CLI. Together they implement the layered architecture described in **Framework Overview** and **Project layout**.

## Packages

| Package | Focus | Documentation |
|---------|--------|---------------|
| **fast-platform** | Caching, tasks, messaging, integrations | [fast-platform](pkg-fast-platform) |
| **fast-middleware** | Security and observability middleware | [fast-middleware](pkg-fast-middleware) |
| **fast-database** | SQLAlchemy v2, migrations, repositories | [fast-database](pkg-fast-database) |
| **fast-dashboards** | Admin UI, metrics, task monitoring | [fast-dashboards](pkg-fast-dashboards) |
| **fast-mvc** | CLI, scaffolding, unified framework surface | [fast-mvc (CLI)](pkg-fast-mvc) |

## How to use this section

- Start with the package that matches your task (e.g. **fast-database** for models and migrations).
- Cross-check **HTTP & API surface**, **Persistence**, and **CLI reference** for end-to-end patterns.

## Related

- **Framework Overview** — philosophy and monorepo map.
- **CLI reference** — \`fast\` commands and project layout.
- **Installation** — \`fastx-mvc\` and getting a generated project.`,

  'pkg-fast-platform': `# fast-platform

**fast-platform** is the **infrastructure layer** of the Fast monorepo: shared primitives for caching, background work, messaging, identity-aware integrations, and optional connectors (LLM, search, and similar).

## What it provides

- **Caching** primitives that higher layers (e.g. Smart Caching) build on.
- **Task queues** and async work patterns for offloading from HTTP handlers.
- **Messaging** and integration hooks for cross-service workflows.
- **OIDC / identity** helpers aligned with the middleware stack.

## Relationship to other packages

- **fast-middleware** exposes HTTP-facing concerns; **fast-platform** focuses on **runtime infrastructure** usable from services and workers.
- **fast-database** owns persistence; platform code typically **does not** embed SQL.

## Related

- **Ecosystem overview** — full map of packages.
- **Smart Caching** — cache behavior in the framework.
- **Configuration** — env vars and profiles for Redis, brokers, and external services.`,

  'pkg-fast-middleware': `# fast-middleware

**fast-middleware** is the **HTTP edge layer**: a large set of production-oriented middlewares for security, CORS, authentication, rate limiting, request context, logging, and tracing.

## What it provides

- **Security headers**, host validation, and CORS.
- **JWT / OIDC** flows aligned with **Security** and **Configuration** docs.
- **Rate limiting** and abuse protection.
- **Request context** (URN, correlation) that feeds **Distributed Tracing** and logs.

## Ordering

Middleware order is part of the **Request Lifecycle** documented in the framework: context and trust boundaries run early; auth and tracing wrap your application code.

## Related

- **Ecosystem overview** — full map of packages.
- **Request Lifecycle** — end-to-end request path.
- **Security** — authn/authz and threat model.`,

  'pkg-fast-database': `# fast-database

**fast-database** is the **data layer** of the monorepo: SQLAlchemy v2–oriented abstractions, migration conventions, repository patterns, and typed access to PostgreSQL (and compatible backends).

## What it provides

- **Models** and **repositories** that match **Project layout** conventions.
- **Alembic** integration for schema evolution.
- **Async session** patterns compatible with FastAPI \`Depends\`.

## Testing and migrations

Use a **dedicated test database** or transactional rollback in tests; see **Testing** and **Persistence** for session lifecycle.

## Related

- **Ecosystem overview** — full map of packages.
- **Persistence** — sessions, transactions, and N+1 considerations.
- **N+1 Query Detection** — eager loading and query shape.`,

  'pkg-fast-dashboards': `# fast-dashboards

**fast-dashboards** is the **observability and admin UI** package: dashboards for metrics, task queues, and operational visibility—built to sit alongside your FastAPI services.

## What it provides

- **Admin-style UIs** for inspecting application state.
- **Task monitoring** and queue visibility where your template wires them.
- **Metrics visualization** aligned with the tracing and logging stack.

## Deployment

Run dashboards in **non-production** or **restricted** networks by default; protect with the same auth and network policies as internal tools.

## Related

- **Ecosystem overview** — full map of packages.
- **Distributed Tracing** — spans and cost attribution.
- **Production** — hardening and deployment patterns.`,

  'pkg-fast-mvc': `# fast-mvc (CLI & core)

**fast-mvc** is the **framework and CLI surface**: \`fastx generate\`, project scaffolding, shared abstractions (controllers, services, DTOs), and the conventions that tie **fast-platform**, **fast-middleware**, and **fast-database** into one product.

## What it provides

- **fastx-mvc** entry points: \`fastx generate\`, \`fastx run\`, and project-specific commands.
- **Layered layout** (controllers, services, repositories) as in **Project layout**.
- **Shared types** and response envelopes across the stack.

## Getting started

Install \`fastx-mvc\`, generate a project, and follow **Installation** and **Tutorial series**.

## Related

- **Ecosystem overview** — full map of packages.
- **CLI reference** — command reference.
- **Framework Overview** — architecture and philosophy.`,
};

/** Per-package docs (sidebar section ids: ecosystem, pkg-fast-*). */

export const ecosystemPackagesMarkdown = {
  ecosystem: `# Ecosystem

**FastX** ships as a **monorepo of coordinated Python packages**. Each package owns a slice of the stack—from infrastructure primitives to HTTP middleware, persistence, observability UI, real-time channels, and the scaffolding CLI. Together they implement the layered architecture described in **Framework Overview** and **Project layout**.

## Packages

| Package | Focus | Documentation |
|---------|--------|---------------|
| **fastx-platform** | 60+ core modules — auth, messaging, search, DevOps, and more | [fastx-platform](pkg-fast-platform) |
| **fastx-middleware** | Security and observability middleware | [fastx-middleware](pkg-fast-middleware) |
| **fastx-database** | SQLAlchemy v2, migrations, repositories | [fastx-database](pkg-fast-database) |
| **fastx-channels** | WebSocket channel abstraction, pub/sub, presence | [fastx-channels](pkg-fast-channels) |
| **fastx-dashboards** | Admin UI, metrics, task monitoring | [fastx-dashboards](pkg-fast-dashboards) |
| **fastx-mvc** | CLI, scaffolding, unified framework surface | [fastx-mvc (CLI)](pkg-fast-mvc) |

## How to use this section

- Start with the package that matches your task (e.g. **fastx-database** for models and migrations).
- Cross-check **HTTP & API surface**, **Persistence**, and **CLI reference** for end-to-end patterns.

## Related

- **Framework Overview** — philosophy and monorepo map.
- **CLI reference** — \`fast\` commands and project layout.
- **Installation** — \`fastx-mvc\` and getting a generated project.`,

  'pkg-fast-platform': `# fastx-platform

**fastx-platform** is the **infrastructure layer** of the FastX monorepo: **60+ core modules** organized into coherent categories covering authentication, data management, messaging, API infrastructure, DevOps, content, developer tools, search/AI, and general infrastructure primitives.

## Module categories

### Authentication & Identity

| Module | Purpose |
|--------|---------|
| **webauthn** | Passkeys and FIDO2 authentication |
| **magic_link** | Passwordless email-based login |
| **oauth2_server** | Full OAuth 2.0 authorization server |
| **totp** | Time-based one-time passwords (2FA) |
| **social_login** | Third-party identity providers (Google, GitHub, etc.) |
| **rbac** | Role-based access control with permission hierarchies |
| **sessions** | Server-side session management with pluggable stores |
| **api_keys** | API key generation, rotation, and scoped access |

### Data & Persistence

| Module | Purpose |
|--------|---------|
| **query_builder** | Fluent SQLAlchemy query composition |
| **cdc** | Change data capture for streaming database changes |
| **anonymization** | PII masking and GDPR-compliant data handling |
| **sharding** | Horizontal database sharding strategies |
| **event_sourcing** | Event-sourced aggregates and projection rebuilds |

### Messaging & Communication

| Module | Purpose |
|--------|---------|
| **message_bus** | Pub/sub with Redis, RabbitMQ, and in-memory backends |
| **push_notifications** | APNs and FCM push delivery |
| **email** | Transactional and templated email sending |
| **sms** | SMS delivery via pluggable providers |
| **sse** | Server-sent events for real-time streaming to browsers |

### API Infrastructure

| Module | Purpose |
|--------|---------|
| **api_versioning** | Header, path, and query-parameter version negotiation |
| **api_analytics** | Request metrics, latency percentiles, and usage tracking |
| **problem_details** | RFC 7807 error responses |
| **request_coalescing** | Deduplicates identical in-flight requests |
| **grpc_gateway** | REST-to-gRPC bridge for hybrid services |
| **graphql_subscriptions** | Real-time GraphQL subscription transport |

### DevOps & Reliability

| Module | Purpose |
|--------|---------|
| **chaos** | Chaos engineering and fault injection |
| **canary** | Canary deployment traffic splitting and promotion |
| **performance_budgets** | Response-time and payload-size guardrails |
| **contract_testing** | Consumer-driven contract verification |
| **circuit_breaker** | Fail-fast with configurable thresholds and recovery |
| **alerting** | Rule-based alerting with webhook and Slack sinks |

### Content & Media

| Module | Purpose |
|--------|---------|
| **cms** | Headless CMS with content versioning and drafts |
| **image_processing** | Resize, crop, and transform pipeline |
| **pdf** | PDF generation and template rendering |
| **storage** | Unified file storage (local, S3, GCS) |

### Developer Tools

| Module | Purpose |
|--------|---------|
| **api_fuzzer** | Automated security and edge-case testing for APIs |
| **http_cassette** | Record and playback HTTP interactions for tests |
| **iac** | Infrastructure-as-code templates (Terraform, Pulumi) |
| **profiler** | Request-level profiling with flame graphs |
| **db_studio** | Browser-based database explorer and query runner |
| **api_explorer** | Interactive API documentation and testing UI |

### Search & AI

| Module | Purpose |
|--------|---------|
| **search** | Full-text search with ranking and facets |
| **vectors** | Vector embeddings storage and similarity search |
| **llm** | LLM provider abstraction with streaming and tool use |

### Infrastructure

| Module | Purpose |
|--------|---------|
| **rate_limiter** | Sliding-window and token-bucket rate limiting |
| **i18n** | Internationalization and locale-aware formatting |
| **multitenancy** | Schema-based and row-based tenant isolation |
| **scheduler** | Cron-style recurring job scheduling |
| **jobs** | Background job queue with retries and dead-letter |
| **secrets** | Secret management with Vault and env-var backends |
| **configuration** | Layered config from env, files, and remote sources |
| **request_replay** | Capture and replay HTTP traffic for debugging |
| **collaboration** | Real-time collaborative editing via CRDTs |
| **feature_flags** | Feature toggles with gradual rollout support |
| **webhook_receiver** | Ingest, verify, and route incoming webhooks |
| **data_export** | Bulk data export in CSV, JSON, and Parquet formats |

## Relationship to other packages

- **fastx-middleware** exposes HTTP-facing concerns; **fastx-platform** focuses on **runtime infrastructure** usable from services, workers, and CLI tools.
- **fastx-database** owns persistence; platform modules that touch the database (e.g. \`event_sourcing\`, \`cdc\`) integrate via repository interfaces rather than embedding raw SQL.
- **fastx-channels** builds on the \`message_bus\` and \`sse\` primitives from fastx-platform for its WebSocket transport.

## Related

- **Ecosystem overview** — full map of packages.
- **Smart Caching** — cache behavior in the framework.
- **Configuration** — env vars and profiles for Redis, brokers, and external services.`,

  'pkg-fast-middleware': `# fastx-middleware

**fastx-middleware** is the **HTTP edge layer**: a large set of production-oriented middlewares for security, CORS, authentication, rate limiting, request context, logging, and tracing.

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

  'pkg-fast-database': `# fastx-database

**fastx-database** is the **data layer** of the monorepo: SQLAlchemy v2-oriented abstractions, migration conventions, repository patterns, and typed access to PostgreSQL (and compatible backends).

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

  'pkg-fast-channels': `# fastx-channels

**fastx-channels** is the **real-time communication layer**: a WebSocket channel abstraction providing pub/sub rooms, presence tracking, and scalable message delivery with a Redis backend.

## What it provides

- **Channel rooms** — named pub/sub channels that clients join and leave. Messages published to a room fan out to all connected subscribers.
- **Presence tracking** — know which users are currently online in a channel, with join/leave events broadcast automatically.
- **Redis backend** — horizontally scalable message routing across multiple server instances via Redis Pub/Sub.
- **Authorization hooks** — per-channel and per-action authorization integrated with the middleware auth stack.
- **Heartbeat and reconnection** — built-in ping/pong keepalive with automatic reconnect handling on the client side.

## Typical usage

1. **Define a channel** with a name pattern (e.g. \`chat:{room_id}\`, \`notifications:{user_id}\`).
2. **Authorize** connections using the same auth middleware from **fastx-middleware**.
3. **Broadcast** messages from services or background jobs — the Redis backend delivers them to every connected instance.
4. **Track presence** to build "who's online" indicators, typing notifications, or collaborative cursors.

## Architecture

\`\`\`
Client (WS) --> fastx-channels --> Redis Pub/Sub --> fastx-channels (all instances)
                     |
                 Presence store (Redis)
\`\`\`

Each application instance maintains its local WebSocket connections. Redis Pub/Sub ensures messages reach clients regardless of which instance they are connected to.

## Relationship to other packages

- Built on **fastx-platform**'s \`message_bus\` and \`sse\` modules for transport primitives.
- Uses **fastx-middleware** auth hooks for connection-level authorization.
- Complements **fastx-platform**'s \`collaboration\` module — channels handle transport while collaboration handles CRDT state.

## Related

- **Ecosystem overview** — full map of packages.
- **Configuration** — Redis connection settings.
- **Security** — WebSocket authentication and authorization patterns.`,

  'pkg-fast-dashboards': `# fastx-dashboards

**fastx-dashboards** is the **observability and admin UI** package: dashboards for metrics, task queues, and operational visibility—built to sit alongside your FastAPI services.

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

  'pkg-fast-mvc': `# fastx-mvc (CLI & core)

**fastx-mvc** is the **framework and CLI surface**: \`fastx generate\`, project scaffolding, shared abstractions (controllers, services, DTOs), and the conventions that tie **fastx-platform**, **fastx-middleware**, and **fastx-database** into one product.

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

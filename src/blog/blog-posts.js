/**
 * Blog posts: short, example-oriented articles aligned with the Fast monorepo
 * (fast-platform, fast-middleware, fast-database, fast-dashboards, fastmvc-cli)
 * and platform features documented on this site.
 */

export const BLOG_INDEX = [
  {
    slug: 'five-layers-one-ship',
    title: 'Five layers, one ship: mapping the Fast ecosystem',
    date: '2026-03-28',
    excerpt:
      'How fast-platform, fast-middleware, fast-database, fast-dashboards, and the CLI fit together in a single product line.',
    tag: 'Ecosystem',
  },
  {
    slug: 'fast-platform-infrastructure',
    title: 'fast-platform: one install, flat imports, real infrastructure',
    date: '2026-03-28',
    excerpt:
      'Taxonomy-driven modules—config, messaging, search, cache, LLM hooks—without scattering dozens of PyPI names.',
    tag: 'fast-platform',
  },
  {
    slug: 'fast-middleware-edge',
    title: 'fast-middleware: hardening the HTTP edge',
    date: '2026-03-28',
    excerpt:
      'Request IDs, security headers, rate limits, and timing—what you mount before your routes run.',
    tag: 'fast-middleware',
  },
  {
    slug: 'fast-database-persistence',
    title: 'fast-database: models, mixins, and repositories',
    date: '2026-03-28',
    excerpt:
      'SQLAlchemy v2 Base, tenant scopes, optimistic locking, and repository interfaces your services can depend on.',
    tag: 'fast-database',
  },
  {
    slug: 'fast-dashboards-operations',
    title: 'fast-dashboards: operational HTML and signed embeds',
    date: '2026-03-28',
    excerpt:
      'Health and queue views, shared layout, and time-limited signed URLs for Metabase or Grafana-style embeds.',
    tag: 'fast-dashboards',
  },
  {
    slug: 'fast-cli-front-door',
    title: 'fastmvc-cli: the front door (`fast generate` and beyond)',
    date: '2026-03-28',
    excerpt:
      'Why the CLI is separate from libraries: scaffolding, migrations, and conventions that stay stable across releases.',
    tag: 'CLI',
  },
  {
    slug: 'smart-caching-real-world',
    title: 'Smart caching: cache-aside with stale-while-revalidate',
    date: '2026-03-28',
    excerpt:
      'A practical angle on TTLs, thundering herds, and when to invalidate—tied to the Smart Caching docs.',
    tag: 'Features',
  },
  {
    slug: 'tracing-nplus1-observability',
    title: 'Tracing and N+1: observe first, optimize second',
    date: '2026-03-28',
    excerpt:
      'Distributed traces for cost attribution and N+1 warnings that point at query shape, not guesswork.',
    tag: 'Observability',
  },
  {
    slug: 'field-encryption-patterns',
    title: 'Field-level encryption: protect data at rest',
    date: '2026-03-28',
    excerpt:
      'When to encrypt columns, how it interacts with DTOs and OpenAPI, and what it does not replace (TLS, authz).',
    tag: 'Security',
  },
  {
    slug: 'advanced-graphql-saga-config',
    title: 'GraphQL, sagas, and hot config: advanced surfaces',
    date: '2026-03-28',
    excerpt:
      'How REST stays the source of truth for GraphQL auto-gen, why sagas span services, and hot reload without restarts.',
    tag: 'Advanced',
  },
];

export const BLOG_POSTS = {
  'five-layers-one-ship': `# Five layers, one ship: mapping the Fast ecosystem

**Fast** is not a single wheel. The monorepo splits ownership so each layer can evolve on its own cadence while the **fastmvc-cli** still gives you one obvious entry point: \`fast generate\`, then \`fast run\`.

## The five packages

| Layer | Package | You reach for it when… |
|--------|---------|-------------------------|
| Infrastructure | **fast-platform** | Shared config DTOs, messaging, search/cache integrations, feature flags, versioning helpers. |
| HTTP edge | **fast-middleware** | Security headers, CORS, JWT, rate limits, request IDs, response timing—**before** your controller runs. |
| Data | **fast-database** | SQLAlchemy \`Base\`, mixins (timestamps, soft delete, tenant scope), repositories. |
| Ops UI | **fast-dashboards** | HTML dashboards, signed embed URLs, Metabase/Grafana-style integration helpers. |
| Scaffolding | **fastmvc-cli** (\`fast\`) | Project layout, resources, migrations, docs shortcuts—**convention over debate**. |

## How a request walks the stack

1. **Middleware** establishes trust boundaries (host, CORS, auth context, correlation IDs).
2. **fast-mvc** layer (generated app) maps HTTP → controller → service.
3. **Services** use **repositories** from **fast-database** and optional **fast-platform** primitives (cache, queues).
4. **Dashboards** sit beside the API for operators—never a substitute for auth on public routes.

## Where to go next

- [Ecosystem overview](ecosystem) — sidebar map of every package page.
- [Framework Overview](framework-overview) — philosophy and layering.
- [CLI reference](cli-reference) — commands you run day to day.`,

  'fast-platform-infrastructure': `# fast-platform: one install, flat imports, real infrastructure

The **fast-platform** distribution (\`pip install fast-platform\`) bundles many modules under a **flat import layout** (\`from notifications import …\`, \`from configuration import …\`) so application code does not sprawl across dozens of unrelated PyPI names.

## What “platform” means here

- **Core:** configuration loaders, shared DTO bases, structured errors.
- **Cross-cutting:** resilience (retries, circuit breakers), API versioning helpers, feature flags.
- **Integrations:** messaging, search, cache, LLM-facing utilities—wired through the same taxonomy the docs use.

## Minimal mental model

\`\`\`python
# Illustrative — names follow the real taxonomy in fast_platform.taxonomy
from configuration import load_json_config  # example pattern
# Your app composes only the subsystems it needs; unused modules stay off the hot path.
\`\`\`

## Ties to the rest of Fast

- **Caching** features in the product often build on primitives that live next to HTTP concerns; see **Smart Caching** in the docs.
- **fast-middleware** consumes IDs and config shaped by the same conventions—see [fast-middleware](pkg-fast-middleware).

## Learn more

- [fast-platform](pkg-fast-platform) package page.
- [Configuration](configuration) for environment profiles.`,

  'fast-middleware-edge': `# fast-middleware: hardening the HTTP edge

**fast-middleware** (PyPI: \`fast-middleware\`, import \`fastmiddleware\`) is **only** about ASGI cross-cutting behavior: the stack that runs **around** your FastAPI routes.

## What you typically mount first

- **Request ID** — propagate a correlation ID for logs and traces.
- **Security headers** — HSTS, CSP, frame options; tune per environment.
- **Response timing** — expose server-side latency (\`X-Process-Time\`-style patterns).

\`\`\`python
from fastapi import FastAPI
# Names illustrative — see fast_middleware README for exact exports
from fastmiddleware import RequestIDMiddleware, SecurityHeadersMiddleware

app = FastAPI()
app.add_middleware(RequestIDMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
\`\`\`

## Relationship to fast-platform

Middleware should stay **thin**: it validates the edge and attaches context; **business rules** stay in services. Request IDs line up with **Distributed Tracing** in the main docs.

## Learn more

- [fast-middleware](pkg-fast-middleware) package page.
- [Request Lifecycle](request-lifecycle) in the framework docs.
- [Security](security) for authn/authz and threat modeling.`,

  'fast-database-persistence': `# fast-database: models, mixins, and repositories

**fast-database** ships a shared **SQLAlchemy v2** \`Base\`, **table name constants**, **mixins** (timestamps, UUID PK, soft delete, tenant scope), and **repository** interfaces—so services speak in domain verbs, not raw SQL scattered across handlers.

## Example: mixin-first models

\`\`\`python
from sqlalchemy import Column, String
from fast_database import Base, TimestampMixin, UUIDPrimaryKeyMixin

class Widget(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "widgets"
    label = Column(String(255), nullable=False)
\`\`\`

## Repositories

Repositories encapsulate query shape—your **N+1 detection** and eager-loading story starts here. See **N+1 Query Detection** and **Persistence** in the main documentation.

## Learn more

- [fast-database](pkg-fast-database) package page.
- [Persistence](persistence) for sessions and transactions.
- [Project layout](project-layout) for where models and repos live.`,

  'fast-dashboards-operations': `# fast-dashboards: operational HTML and signed embeds

**fast-dashboards** provides **FastAPI routers** and **layout helpers** for internal operations: health, queues, tenants, secrets, workflows—plus **signed embed URLs** for tools like Metabase or Grafana without exposing long-lived secrets in the browser.

## Signed embed pattern

Short-lived HMAC URLs let you iframe a dashboard while **revoking** a token if it leaks—see the package README for \`sign_embed_url\` / \`verify_signed_embed_url\`.

## SEO and safety

Dashboard HTML defaults to **noindex**-friendly patterns for internal UIs; public marketing sites use different templates.

## Learn more

- [fast-dashboards](pkg-fast-dashboards) package page.
- [Production](production) for separating operator tools from public traffic.`,

  'fast-cli-front-door': `# fastmvc-cli: the front door (\`fast generate\` and beyond)

**fastmvc-cli** is published as \`pip install fastmvc-cli\`; the executable is typically **\`fast\`**. It does not replace FastAPI—it **organizes** how you build: predictable folders, scaffolding, Alembic wrappers, and optional hooks into the rest of the stack.

## Typical first hour

\`\`\`bash
pip install fastmvc-cli
fast generate my_app
cd my_app
fast run
\`\`\`

## Why CLI is its own package

Shipping the CLI separately lets the framework rev **docs and templates** without forcing every library consumer to depend on Typer/Rich. Libraries stay importable in workers; the CLI stays a **dev and ops** surface.

## Learn more

- [CLI reference](cli-reference).
- [Installation](installation).
- [fast-mvc](pkg-fast-mvc) package page.`,

  'smart-caching-real-world': `# Smart caching: cache-aside with stale-while-revalidate

**Smart Caching** in Fast combines **TTL**, **stale-while-revalidate**, and **request coalescing** so hot keys do not stampede your database when a cache entry expires.

## When to use it

- Read-heavy endpoints with **predictable keys** (e.g. per-tenant configuration, feature flags).
- Responses where **slightly stale** data is acceptable for a short window.

## What to measure

Track **hit rate**, **miss latency**, and **origin load** after deploys—your dashboards (see **fast-dashboards**) should show whether cache tiers are buying you real headroom.

## Learn more

- [Smart Caching](smart-caching).
- [Performance guide](performance-guide).`,

  'tracing-nplus1-observability': `# Tracing and N+1: observe first, optimize second

**Distributed Tracing** gives you spans per request—often with **cost attribution** so you can see which tenants or routes burn the most infrastructure. **N+1 detection** complements that by flagging ORM access patterns that explode query count.

## Practical workflow

1. **Trace** a slow endpoint—find the span where DB time dominates.
2. **Inspect** repository calls for loops without eager loads.
3. **Fix** with selectin/joined loads or batch APIs—then re-run tests (see **Testing**).

## Learn more

- [Distributed Tracing](distributed-tracing).
- [N+1 Query Detection](nplus1-detection).
- [Testing](testing).`,

  'field-encryption-patterns': `# Field-level encryption: protect data at rest

**Field-Level Encryption** encrypts sensitive columns (tokens, government IDs) **before** they hit disk. It is **not** a substitute for **TLS**, **authz**, or **database access control**—it reduces blast radius when storage is copied or leaked.

## Modeling

Pydantic types and SQLAlchemy columns work together so **OpenAPI** and **DTOs** stay honest; see **Field Encryption** and **Security** in the docs.

## Learn more

- [Field Encryption](field-encryption).
- [Security](security).
- [Configuration](configuration) for key material.`,

  'advanced-graphql-saga-config': `# GraphQL, sagas, and hot config: advanced surfaces

Three features that show up once your API outgrows CRUD:

## GraphQL Auto-Gen

REST remains the **source of truth**; GraphQL schemas and resolvers are **generated** from your FastAPI surface. Pin versions and read release notes—see **GraphQL Auto-Gen**.

## Saga pattern

Multi-step business flows that span **services or brokers** use **sagas** with compensating actions when a step fails—see **Saga Pattern**.

## Hot Config Reload

Change **selected** configuration keys **without** restarting all workers—ideal for feature flags and rate limit tuning; see **Hot Config Reload**.

## Learn more

- [GraphQL Auto-Gen](graphql-automation).
- [Saga Pattern](saga-pattern).
- [Hot Config Reload](hot-config-reload).`,
};

export function getBlogPost(slug) {
  return BLOG_POSTS[slug] || null;
}

export function isValidBlogSlug(slug) {
  return Boolean(slug && BLOG_POSTS[slug]);
}

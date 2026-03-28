/** Topic guides — concepts and when to use features (docs section `topic-guides`). */
export const topicGuidesMarkdown = `# Topic guides

These pages explain **ideas and tradeoffs**—when a feature fits, how it behaves, and how it connects to the rest of the stack. For step-by-step tasks, see **How-to guides**.

---

## What is the Saga pattern and when to use it

A **saga** sequences **multiple steps** that must succeed or fail together across services or resources, with **compensating** actions if something breaks (e.g. release inventory after a failed payment).

**Use it when:**

- A business operation spans **more than one** transactional boundary (another service, message queue, external API).
- You need **explicit** rollback semantics instead of a single DB transaction.

**Avoid** when a **single** database transaction is enough—use normal SQLAlchemy unit-of-work patterns (**Persistence**, **Saga Pattern** in this site).

---

## Understanding cache invalidation strategies

Caching trades freshness for speed. **Invalidation** decides when cached values become unsafe.

Common strategies:

- **TTL only** — simple; risk of stale reads until expiry.
- **Event-based** — invalidate when data changes (e.g. \`invalidate_on=["user:update"]\` with **Smart Caching**).
- **Stale-while-revalidate** — serve stale while refreshing in the background for read-heavy endpoints.

**Rule of thumb:** invalidate **narrowly** (per entity/key) when possible; use TTL as a backstop.

---

## How distributed tracing works

**Tracing** records a **tree of spans** for a request: HTTP in, DB calls, outbound HTTP, cache, etc. Spans carry **timing** and optional **cost** or **tenant** attributes.

**Why it matters:** you see **where latency and money go**, not just a 500. OpenTelemetry-compatible exporters send data to Jaeger, Tempo, Honeycomb, etc. (**Distributed Tracing**).

---

## Authentication patterns in Fast

FastAPI (and Fast) typically combine:

- **Transport security** — TLS at the edge (**Security**).
- **Proof of identity** — JWT bearer, session cookies, or OAuth2 flows.
- **Authorization** — roles, scopes, or resource checks in **services**, not only in route decorators.

Patterns: **dependency-injected** \`get_current_user\`, **least privilege**, short-lived access tokens, and **secrets** outside the repo (**HTTP & API surface**, **Security**, **[API development rules](/rules.html)**).

---

## Related

- **How-to guides** — task-focused recipes.
- Feature docs: **Saga Pattern**, **Smart Caching**, **Distributed Tracing**, **Security**.`;

/** How-to guides — task recipes (docs section `how-to-guides`). */
export const howToGuidesMarkdown = `# How-to guides

These pages answer **“how do I…?”** for common integration and product tasks. They complement **Topic guides** (concepts) and the feature reference sections.

---

## How to add OAuth2 with Google / GitHub

1. Register an app in the provider console; obtain **client id**, **client secret**, and **redirect URI** (e.g. \`https://api.example.com/auth/callback/google\`).
2. Store secrets in **Configuration** / secrets manager—never in git.
3. Use FastAPI’s **OAuth2** utilities or a maintained library; expose \`/auth/login/google\` and \`/auth/callback/google\` that exchange **authorization codes** for tokens.
4. Map the provider’s user id/email to your **User** model; issue your **JWT** or session for subsequent API calls (**Security**, **HTTP & API surface**).

---

## How to set up rate limiting per tenant

1. Choose a **key**: tenant id from JWT, API key, or subdomain.
2. Use a **Redis** (or similar) counter with sliding window or token bucket; middleware or a dependency runs **before** the route handler.
3. Return **429** with \`Retry-After\` when over limit; log tenant id for abuse analysis (**Production**, **Troubleshooting**).

---

## How to migrate from Django / Flask

1. **Inventory** — routes, models, auth, middleware, and background jobs.
2. **Map layers** — Django views → Fast **controllers**; ORM models → SQLAlchemy + **repositories**; Django signals → explicit service hooks (**Project layout**).
3. **Incremental** — expose new FastAPI routes behind a reverse proxy path-by-path; share DB during transition (**Persistence**).
4. **Tests** — port critical paths to **pytest** + **TestClient** early (**Testing**).

For **Django, Flask, NestJS, and Express** in more detail (ORM mapping, admin, testing patterns, etc.), see **Migration guides**.

---

## How to implement soft deletes

1. Add \`deleted_at\` (nullable timestamp) or \`is_deleted\` on models; **default queries** filter \`deleted_at IS NULL\` in repositories.
2. **Unique constraints** may need partial indexes (e.g. unique email among non-deleted rows)—database-specific.
3. **Hard delete** via admin or retention jobs if required (**Persistence**).

---

## How to add full-text search

1. **Postgres** — \`tsvector\` / \`tsquery\`, GIN indexes, or **pg_trgm** for fuzzy match.
2. **Dedicated search** — OpenSearch/Elasticsearch for scale; index on write from services (async jobs or outbox).
3. Keep **search** behind a service method; don’t scatter raw SQL in controllers (**Project layout**).

---

## How to handle file uploads to S3

1. For large files, prefer **presigned POST/PUT URLs** so the **browser uploads directly** to S3; your API stores only **metadata** and the object key.
2. Validate **MIME type**, **size**, and **virus scan** if required before promoting the object.
3. Store buckets/keys in **Configuration**; never embed long-lived AWS keys in the app image (**Security**, **Production**).

---

## Related

- **Topic guides** — concepts behind these tasks.
- **Tutorial series** — end-to-end SaaS-style path.
- **Troubleshooting** — when something fails during integration.`;

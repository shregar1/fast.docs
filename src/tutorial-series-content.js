/** Markdown body for docs section `tutorial-series` (progressive 8-part SaaS API tutorial). */
export const tutorialSeriesMarkdown = `# Progressive tutorial series

Build a **production-style SaaS API**—teams, billing, and webhooks—across eight hands-on parts. Each part lists an approximate time; work through them in order. Deep dives link to the rest of this documentation.

## What you will build

- Multi-tenant **teams** and membership
- **Billing** hooks (ready for Stripe or similar)
- **Webhooks** for outbound events
- Hardening with **caching**, **tracing**, **tests**, and **deployment**

## Prerequisites

Complete **Installation** and skim **Project layout** first. Keep **CLI reference** open for \`fast\` commands. For **concepts** vs **task recipes**, see **Topic guides** and **How-to guides**.

---

## Tutorial 1: Your First Fast API (~15 min)

**Goals:** Install tooling, generate a project, run a “Hello World” endpoint, and map folders to roles.

1. **Install and scaffold**

\`\`\`bash
pip install fastmvc-cli
fast generate saas_demo
cd saas_demo
fast run
\`\`\`

2. **Hello World** — Add or confirm a route that returns \`{"message": "Hello"}\` and open \`/docs\` to try it (see **HTTP & API surface** for OpenAPI).

3. **Understand the layout** — Walk \`app/main.py\`, \`app/api/\`, \`services/\`, \`schemas/\`. See **Project layout** and **[API development rules](/rules.html)**.

**Checkpoint:** \`GET /\` or your health route returns 200; you can explain where a new endpoint would live.

---

## Tutorial 2: Models & persistence (~20 min)

**Goals:** SQLAlchemy models, Alembic migrations, repository-style CRUD.

1. **Define models** — e.g. \`Team\`, \`User\`, \`Membership\` under \`app/models/\` with relationships as needed.

2. **Migrations**

\`\`\`bash
# Your template may expose alembic or a project-specific migrate command — use what ships with the project
alembic revision --autogenerate -m "teams and users"
alembic upgrade head
\`\`\`

3. **Repositories** — Implement \`TeamRepository\`, \`UserRepository\` with async sessions (see **Persistence**).

**Checkpoint:** You can create and fetch rows through the repository layer without SQL in route handlers.

---

## Tutorial 3: REST API & validation (~25 min)

**Goals:** Pydantic schemas, versioned routers, optional **Smart Caching**, documented OpenAPI.

1. **Schemas** — Request/response DTOs in \`schemas/\`; validate IDs, emails, and team scoping.

2. **Endpoints** — \`POST /api/v1/teams\`, \`GET /api/v1/teams/{id}\`, etc., calling services only.

3. **Smart Caching** — Add \`@smart_cache.cached\` on read-heavy service methods (see **Smart Caching**).

4. **OpenAPI** — Confirm tags, summaries, and status codes in \`/docs\`.

**Checkpoint:** CRUD works through validated DTOs; cache is safe for your invalidation story.

---

## Tutorial 4: Authentication & security (~25 min)

**Goals:** JWT (or OAuth2 password flow for dev), **Field Encryption** for secrets, role-based checks.

1. **Auth** — Issue access tokens; depend on \`get_current_user\` / \`get_current_team\` in **HTTP & API** style.

2. **Encryption** — Mark sensitive columns with \`Encrypted[...]\` and manage \`FASTMVC_ENCRYPTION_KEY\` (see **Field Encryption** and **Security**).

3. **Authorization** — Enforce roles (owner, member, billing) in **services**, not only in routes.

**Checkpoint:** Unauthenticated requests are rejected; encrypted fields never logged; roles enforced consistently.

---

## Tutorial 5: Advanced features (~30 min)

**Goals:** **Distributed Tracing**, **N+1** hygiene, multi-step flows with **Saga**.

1. **Tracing** — Add \`@tracer.trace_method\` to hot paths; export OTLP in non-dev (see **Distributed Tracing**).

2. **N+1** — Use \`@detect_nplus1\` and eager loading where needed (**N+1 Query Detection**, **Persistence**).

3. **Sagas** — Model a billing or webhook side-effect as steps with compensations (**Saga Pattern**).

**Checkpoint:** Traces show spans for critical paths; no N+1 warnings on list endpoints; sagas complete or roll back cleanly.

---

## Tutorial 6: Testing & quality (~20 min)

**Goals:** pytest + async, \`TestClient\` / httpx, factories, coverage discipline.

1. **Tests** — Cover services and routes; override \`Depends\` for DB and auth (**Testing**).

2. **Factories** — Use factories or fixtures (e.g. \`ItemFactory\`-style builders) to create teams/users without duplication.

3. **Coverage & hooks** — Run \`pytest --cov\`; wire **pre-commit** for format/lint in CI (see repo **README** / your template).

**Checkpoint:** CI runs tests on every push; critical flows have integration tests.

---

## Tutorial 7: Production deployment (~25 min)

**Goals:** Docker image, health/readiness, metrics, cloud deploy.

1. **Containerize** — Multi-stage Dockerfile, non-root user, env-based config (**Production**).

2. **Health** — \`/health/live\` and \`/health/ready\` wired to DB/Redis.

3. **Metrics** — Prometheus or OTLP metrics alongside traces.

4. **Cloud** — Deploy to AWS, GCP, or Azure with secrets from the platform (**Configuration**, **Security**).

**Checkpoint:** Rolling deploys pass readiness checks; logs and metrics are observable.

---

## Tutorial 8: Real-time, GraphQL & edge (~20 min)

**Goals:** WebSockets for notifications, **GraphQL Auto-Gen**, optional **Edge** deploy.

1. **WebSockets** — Add a \`/ws\` or similar for team notifications; authenticate the socket upgrade.

2. **GraphQL** — Mount GraphQL from your existing REST app (**GraphQL Auto-Gen**).

3. **Edge** — Optionally deploy hot read paths via \`fast edge deploy\` (**Edge Functions**, **CLI reference**).

**Checkpoint:** Clients can subscribe or query GraphQL; edge path is optional and documented.

---

## Next steps

- **Troubleshooting** — when something breaks in any part above.
- **Changelog** — track CLI and template upgrades between releases.
- **[API development rules](/rules.html)** — ongoing REST and layering discipline.
`;

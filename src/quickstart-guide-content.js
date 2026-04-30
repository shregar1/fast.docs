/**
 * Quickstart Guide — From zero to a running CRUD API in 5 minutes
 * using the fastx CLI (package: fastx-mvc).
 */

export const quickstartGuideMarkdown = {
  'quickstart': `
# 🚀 Quickstart: From Zero to CRUD in 5 Minutes

Welcome to **fastx-mvc**! This guide walks you from install to a running, versioned, layered CRUD API using the \`fastx\` CLI — no boilerplate by hand.

## Prerequisites

- Python 3.10+
- \`pip\` or \`uv\`

---

## Step 1 — Install (30s)

\`\`\`bash
pip install fastx-cli
# or with uv
uv add fastx-cli
\`\`\`

Verify:

\`\`\`bash
fastx --version
\`\`\`

---

## Step 2 — Scaffold a project (30s)

Use \`quickstart\` for an all-defaults project, or \`generate\` for the interactive wizard.

\`\`\`bash
fastx quickstart my-shop
cd my-shop
\`\`\`

You get a ready-to-run tree with \`apis/\`, \`services/\`, \`repositories/\`, \`dtos/\`, \`dependencies/\`, \`models/\`, \`entities/\`, \`middlewares/\`, \`tests/\`, Alembic wiring, and a \`.env\` with auto-generated \`SECRET_KEY\` and \`JWT_SECRET_KEY\`.

---

## Step 3 — Generate a vertical slice (1m)

Each operation is its own versioned slice across every layer. Let's create \`v1\` CRUD for a \`product\` resource:

\`\`\`bash
fastx add resource -f product -r create -v v1
fastx add resource -f product -r fetch  -v v1
fastx add resource -f product -r update -v v1
fastx add resource -f product -r delete -v v1
\`\`\`

Each call generates:

- \`apis/v1/product/<op>.py\` — controller
- \`services/product/<op>.py\` — business logic
- \`repositories/product/<op>.py\` — data access
- \`dependencies/services/v1/product/<op>.py\` — wired DI
- \`dtos/requests/apis/v1/product/<op>.py\` — request DTO
- \`dtos/responses/apis/v1/product/<op>.py\` — response DTO

Open any generated file to fill in business logic — every layer has its seam ready.

---

## Step 4 — Add auth, tests, and a migration (1m)

\`\`\`bash
# Full JWT auth stack: login, register, middleware, deps
fastx add auth

# Async Pytest boilerplate for the create slice
fastx add test -f product -r create -v v1

# Create and apply the first migration
fastx db migrate -m "initial schema"
fastx db upgrade
\`\`\`

---

## Step 5 — Run it (30s)

\`\`\`bash
uvicorn app:app --reload
\`\`\`

Your API is live at **http://localhost:8000**, with OpenAPI docs at **/docs**.

---

## Step 6 — Hit the endpoints (1m)

\`\`\`bash
# Create
curl -X POST http://localhost:8000/v1/product/create \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Laptop", "price": 999.99}'

# Fetch
curl http://localhost:8000/v1/product/fetch/1
\`\`\`

---

## 🎉 Done

In five minutes you scaffolded a versioned, layered CRUD API with:

- ✅ Clean separation across **controller → service → repository**
- ✅ Per-version, per-operation isolation (no god-files)
- ✅ Pydantic request/response DTOs
- ✅ Wired dependency injection
- ✅ JWT auth stack
- ✅ Async Pytest boilerplate
- ✅ Alembic migrations
- ✅ Auto-generated OpenAPI docs at \`/docs\`

## What's Next?

- [CLI Reference](/cli-tool)
- [Best Practices](/best-practices)
- [Example Projects](/examples)
- Ship it: \`fastx dockerize\` for production Dockerfile + compose
`
};

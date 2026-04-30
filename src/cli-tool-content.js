/**
 * CLI Tool Documentation
 *
 * FastX CLI (fastx-mvc) for project scaffolding, vertical slice generation,
 * infrastructure, and docs. Mirrors fast_mvc/docs/guide/cli.md and
 * CHANGELOG v1.5.0 / v1.6.1.
 */

export const cliToolMarkdown = {
  'cli-tool': `
# 🛠️ FastX CLI

The \`fastx\` CLI is the productivity heart of **fastx-mvc**. It scaffolds projects, generates vertical slices, wires auth, dockerizes your app, and auto-builds API reference docs.

## Installation

The CLI ships as a standalone tool. The PyPI package is **\`fastx-cli\`** and the command is **\`fastx\`**.

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

## 🏗️ Project Lifecycle

### \`fastx generate\`

Interactive wizard to start a new project. Handles structure, dependencies, \`.env\` files (with automatic \`SECRET_KEY\` / \`JWT_SECRET_KEY\` generation), and virtual environments.

\`\`\`bash
fastx generate
\`\`\`

### \`fastx quickstart\`

Instantly scaffold a project with all defaults.

\`\`\`bash
fastx quickstart my-project
cd my-project
\`\`\`

You get a per-version, per-operation project tree:

\`\`\`
my-project/
├── apis/
│   └── v1/
├── services/
├── repositories/
├── dependencies/
├── dtos/
│   ├── requests/
│   └── responses/
├── middlewares/
├── models/
├── entities/
├── tests/
├── alembic/
├── .env.example
├── .env            # SECRET_KEY + JWT_SECRET_KEY auto-generated
├── pyproject.toml
└── app.py
\`\`\`

---

## ➕ Scaffolding with \`fastx add\`

The \`add\` group scaffolds complete **vertical slices** that follow the framework's architectural patterns.

### \`fastx add resource\` — Vertical slice scaffolding

Scaffolds a versioned operation (\`create\`, \`fetch\`, \`update\`, \`delete\`, …) with full isolation across every layer.

\`\`\`bash
fastx add resource -f <folder> -r <operation> -v <version>
# Example
fastx add resource -f user -r create -v v1
\`\`\`

Generates:

- \`apis/v1/user/create.py\` — controller
- \`services/user/create.py\` — business logic
- \`repositories/user/create.py\` — data access
- \`dependencies/services/v1/user/create.py\` — wired DI
- \`dtos/requests/apis/v1/user/create.py\` — request schema
- \`dtos/responses/apis/v1/user/create.py\` — response schema

> **Leaf file naming:** keep leaf files short (\`create.py\`, \`update.py\`) — the folder path already carries the resource name. Class names stay explicit (\`CreateUserRequestDTO\`). Emit **one concrete DTO class per file**; nested support models may co-live, shared sub-models get their own file.

### \`fastx add auth\` — One-command auth stack

Scaffolds a complete **zero-to-hero** JWT authentication stack in one command.

\`\`\`bash
fastx add auth [--version v1]
\`\`\`

Includes:

- **Security:** JWT token generation/decoding and Bcrypt hashing
- **Operations:** Login and Registration API endpoints
- **Middleware:** \`AuthMiddleware\` for token extraction and session injection
- **Dependencies:** \`get_current_user_id\` for protecting any subsequent route

### \`fastx add middleware\` — Specialized templates

\`\`\`bash
fastx add middleware <name>
\`\`\`

Templates:

- \`request_logger\` — logs paths and timings (\`X-Process-Time\`)
- \`rate_limiter\` — in-memory sliding-window limiter
- \`cors_config\` — pre-configured CORS module

### \`fastx add test\` — Async Pytest scaffolding

\`\`\`bash
fastx add test -f <folder> -r <operation> -v <version>
\`\`\`

Generates async Pytest boilerplate with \`AsyncClient\` setup and examples of mocking your services and repositories.

### \`fastx add task\` — Background workers

\`\`\`bash
fastx add task <name>
\`\`\`

Works with FastAPI \`BackgroundTasks\` out of the box and is ready for Celery / TaskIQ \`@task\` decorators, including service-layer trigger patterns.

### \`fastx add env\` — Environment bootstrap

\`\`\`bash
fastx add env
\`\`\`

Generates \`.env\` from \`.env.example\` with automatic \`SECRET_KEY\` and \`JWT_SECRET_KEY\` values — no more copy-paste-regenerate.

---

## 🐳 Infrastructure

### \`fastx dockerize\`

Generates production-grade containerization in one command.

\`\`\`bash
fastx dockerize
\`\`\`

Outputs:

- **\`Dockerfile\`** — multistage slim image
- **\`docker-compose.yml\`** — wires App, Postgres, Redis, and Migrations
- **\`docker-entrypoint.sh\`** — startup coordination

---

## 📚 Auto-Docs

### \`fastx docs generate\`

Crawl your \`apis/\` and \`dtos/\` folders and build a complete MkDocs API reference using \`mkdocstrings\`.

\`\`\`bash
fastx docs generate
\`\`\`

Refreshes \`docs/api/endpoints.md\` automatically — run it in CI to keep docs in sync with code.

---

## 🗄️ Database Management (\`fastx db\`)

Wrapper around Alembic for easier migration management.

\`\`\`bash
fastx db migrate -m "Description"  # new migration
fastx db upgrade                    # apply migrations
fastx db reset                      # reset & re-seed (destructive)
\`\`\`

---

## 📋 Command Reference

| Command | Description |
|---|---|
| \`fastx generate\` | Interactive project wizard |
| \`fastx quickstart <name>\` | Scaffold project with defaults |
| \`fastx add resource -f <folder> -r <op> -v <ver>\` | Vertical slice for one operation |
| \`fastx add auth\` | Full JWT auth stack |
| \`fastx add middleware <name>\` | Middleware from template |
| \`fastx add test -f <folder> -r <op> -v <ver>\` | Async Pytest boilerplate |
| \`fastx add task <name>\` | Background worker |
| \`fastx add env\` | Generate \`.env\` with secrets |
| \`fastx dockerize\` | Dockerfile + compose + entrypoint |
| \`fastx docs generate\` | Auto-build MkDocs API reference |
| \`fastx db migrate -m "msg"\` | New Alembic migration |
| \`fastx db upgrade\` | Apply migrations |
| \`fastx db reset\` | Destructive reset & re-seed |

---

## Next Steps

- [Quickstart Guide](/quickstart)
- [Example Projects](/examples)
- [Best Practices](/best-practices)
`
};

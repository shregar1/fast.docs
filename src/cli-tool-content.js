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

## 🚀 Development Server (\`fastx dev\`)

Start a dev server with auto-reload, browser launch, and optional tunnel for external access.

\`\`\`bash
fastx dev                           # Start on 0.0.0.0:8000 with reload
fastx dev -p 3000 --open            # Port 3000, open browser to /docs
fastx dev --tunnel                  # Start with ngrok tunnel
fastx dev --tunnel --tunnel-provider cloudflare
fastx dev -w 4                      # 4 workers (disables reload)
\`\`\`

| Option | Description |
|---|---|
| \`--host\` | Bind host (default: 0.0.0.0) |
| \`-p, --port\` | Bind port (default: 8000) |
| \`--open\` | Open browser to \`/docs\` on start |
| \`--tunnel\` | Start ngrok/cloudflare tunnel for external access |
| \`--tunnel-provider\` | Choose \`ngrok\` or \`cloudflare\` |
| \`-w, --workers\` | Number of workers (reload disabled when >1) |

---

## 📦 SDK Generator (\`fastx sdk generate\`)

Generate typed client SDKs from your OpenAPI spec in TypeScript or Python.

\`\`\`bash
fastx sdk generate                              # TypeScript from running server
fastx sdk generate -l python                    # Python httpx client
fastx sdk generate -i openapi.json -o ./client  # From file
fastx sdk generate --url http://prod/openapi.json
\`\`\`

| Option | Description |
|---|---|
| \`-l, --lang\` | Target language: \`typescript\` (default) or \`python\` |
| \`-i, --input\` | Path to local openapi.json |
| \`-u, --url\` | URL to fetch OpenAPI spec from |
| \`-o, --output-dir\` | Output directory |
| \`-n, --name\` | Package/module name |

The TypeScript SDK generates a fully typed fetch-based client. The Python SDK uses httpx with full type annotations.

---

## ☁️ Cloud Deployment (\`fastx deploy\`)

Deploy your FastX app to any major cloud platform with a single command.

### \`fastx deploy dockerfile\`

Generate a production-ready Dockerfile and .dockerignore.

\`\`\`bash
fastx deploy dockerfile
fastx deploy dockerfile --force     # Overwrite existing
\`\`\`

### \`fastx deploy fly\` — Fly.io

\`\`\`bash
fastx deploy fly
fastx deploy fly --app-name my-api --region lhr
\`\`\`

Generates Dockerfile + \`fly.toml\` and runs \`fly deploy\`. Prerequisites: \`brew install flyctl && fly auth login\`.

### \`fastx deploy railway\` — Railway

\`\`\`bash
fastx deploy railway
\`\`\`

Generates Dockerfile and runs \`railway up\`. Prerequisites: \`npm install -g @railway/cli && railway login\`.

### \`fastx deploy aws\` — AWS ECS/Fargate

\`\`\`bash
fastx deploy aws --app-name my-api --ecr-repo 123456789.dkr.ecr.us-east-1.amazonaws.com/my-api
\`\`\`

Generates ECS task definition + deploy script under \`deploy/aws/\`.

### \`fastx deploy gcp\` — Google Cloud Run

\`\`\`bash
fastx deploy gcp --app-name my-api --project my-gcp-project
fastx deploy gcp --region europe-west1 --memory 1Gi --cpu 2
\`\`\`

Generates Cloud Run service YAML + deploy script under \`deploy/gcp/\`. Supports scale-to-zero with \`--min-instances 0\`.

### \`fastx deploy azure\` — Azure Container Apps

\`\`\`bash
fastx deploy azure --app-name my-api --resource-group my-rg
fastx deploy azure --registry myregistry.azurecr.io --cpu 1 --memory 2.0Gi
\`\`\`

Generates Container App YAML + deploy script under \`deploy/azure/\`. Supports auto-scaling with \`--min-replicas\` / \`--max-replicas\`.

### Deployment comparison

| Platform | Command | Scale to zero | Built-in SSL | Managed DB |
|---|---|---|---|---|
| Fly.io | \`fastx deploy fly\` | Yes | Yes | Postgres add-on |
| Railway | \`fastx deploy railway\` | Yes | Yes | Postgres/Redis add-on |
| AWS ECS | \`fastx deploy aws\` | No | Via ALB | RDS |
| GCP Cloud Run | \`fastx deploy gcp\` | Yes | Yes | Cloud SQL |
| Azure Container Apps | \`fastx deploy azure\` | Yes | Yes | Azure DB |

---

## 🐳 Docker (\`fastx dockerize\`)

Legacy command — generates Dockerfile + docker-compose.yml + entrypoint. Consider using \`fastx deploy dockerfile\` for production deployments.

\`\`\`bash
fastx dockerize
\`\`\`

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
| \`fastx dev\` | Dev server with auto-reload and tunnel |
| \`fastx add resource -f <folder> -r <op> -v <ver>\` | Vertical slice for one operation |
| \`fastx add auth\` | Full JWT auth stack |
| \`fastx add middleware <name>\` | Middleware from template |
| \`fastx add test -f <folder> -r <op> -v <ver>\` | Async Pytest boilerplate |
| \`fastx add task <name>\` | Background worker |
| \`fastx add env\` | Generate \`.env\` with secrets |
| \`fastx sdk generate\` | Generate typed SDK from OpenAPI |
| \`fastx deploy dockerfile\` | Generate production Dockerfile |
| \`fastx deploy fly\` | Deploy to Fly.io |
| \`fastx deploy railway\` | Deploy to Railway |
| \`fastx deploy aws\` | Deploy to AWS ECS/Fargate |
| \`fastx deploy gcp\` | Deploy to Google Cloud Run |
| \`fastx deploy azure\` | Deploy to Azure Container Apps |
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

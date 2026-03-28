/** Migration guides — moving from other stacks to Fast (docs section `migration-guides`). */
export const migrationGuidesMarkdown = `# Migration guides

Move an existing API to **Fast** incrementally. These guides map concepts from common frameworks to Fast’s **Project layout** (controllers, services, repositories, **Persistence**, **HTTP & API surface**).

\`\`\`text
Migrating to Fast
├── From Django
│   ├── ORM → SQLAlchemy mapping
│   ├── Views → Controllers + Services
│   ├── Admin → Custom admin solutions
│   └── Testing patterns
├── From Flask
├── From NestJS
└── From Express.js
\`\`\`

---

## From Django

### ORM → SQLAlchemy mapping

- **Models** — Django \`models.Model\` → SQLAlchemy declarative models (or SQLModel) under \`app/models/\`; keep **one aggregate** per table family.
- **Migrations** — Django migrations → **Alembic** revisions; autogenerate, then review diffs (**Persistence**).
- **Querysets** — \`.filter()/.select_related()/.prefetch_related()\` → SQLAlchemy \`select\`, \`join\`, \`options(selectinload(...))\` for N+1 safety (**N+1 Query Detection**).
- **Transactions** — \`atomic()\` blocks → explicit session **commit/rollback** in **services**.

### Views → Controllers + Services

- **Class-based / function views** → **APIRouter** handlers that call **services**; **no** ORM in route bodies (**[API development rules](/rules.html)**).
- **Middleware** — port to FastAPI middleware or dependencies; order matters for auth and logging.
- **URLs** — \`urls.py\` → \`include_router\` with \`/api/v1/\` prefixes (**HTTP & API surface**).

### Admin → Custom admin solutions

- Django **Admin** is not replicated—use a **separate** internal app (React/Vue + your API), **Retool**, or **SQLAdmin**/similar if you stay Python-only.
- Protect admin routes with **auth** and **network** rules (VPN, IP allowlist) (**Security**, **Production**).

### Testing patterns

- \`pytest-django\` / \`TestCase\` → **pytest** + **httpx** or **TestClient**; **override** \`Depends\` for DB and auth (**Testing**).
- **Factories** — replace \`FactoryBoy\` patterns with equivalent builders for your SQLAlchemy models.

---

## From Flask

- **Blueprints** → **APIRouter** modules with tags and prefixes.
- **Global \`g\` / \`request\`** → **Depends()**-injected session, user, and settings.
- **Flask-SQLAlchemy** → explicit **engine**, **session factory**, and **repositories** (**Persistence**).
- **Extensions** (Limiter, CORS, JWT) → FastAPI middleware or Starlette extensions; align with **Configuration**.

---

## From NestJS

- **Modules / Providers / Controllers** → Python packages + **services** + **routers**; **dependency injection** via **Depends()** (same idea, different syntax).
- **TypeORM / Prisma** → **SQLAlchemy** (async) + Alembic.
- **Guards & Interceptors** → dependencies, middleware, and **exception handlers**.
- **Microservices** patterns (Kafka, etc.) map **one-to-one** at the integration layer; Fast stays the **HTTP** edge.

---

## From Express.js

- **Routes → middleware chain** → FastAPI **dependencies** and **middleware**; order is explicit.
- **Prisma / Sequelize / Knex** → **SQLAlchemy** (or keep raw SQL in a thin **repository** layer).
- **\`req\` / \`res\`** → typed Pydantic **request/response** models and **status codes** (**HTTP & API surface**).
- **Passport** → **OAuth2** / **JWT** strategies in FastAPI-compatible libraries (**Security**).

---

## Related

- **How-to guides** — short “migrate from Django” checklist; this page expands by framework.
- **Project layout**, **Persistence**, **Testing**, **Troubleshooting**.`;

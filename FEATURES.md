# FastX Documentation Site Features

## 🎨 Design Highlights

### Dark Theme
- Elegant dark color palette with slate grays
- Gradient accents in primary (cyan) and accent (purple) colors
- Glass morphism effects with backdrop blur
- Subtle glow effects and animations

### Animations
- Gradient text animation on hero
- Floating elements
- Hover transitions on cards
- Smooth page transitions
- Pulsing indicators

### Typography
- Inter font family for body text
- JetBrains Mono for code
- Responsive font sizing
- Beautiful prose styling for markdown

## 📱 Components

### Navigation
- Fixed header with blur backdrop
- Mobile-responsive hamburger menu
- Active state indicators
- Smooth scroll behavior

### Hero Section
- Large gradient headline
- Animated badge
- Code preview window
- CTA buttons with hover effects

### Feature Cards
- Icon + title + description layout
- Hover lift effect
- Gradient border on hover
- Background glow

### Comparison Table
- Framework comparison
- Visual indicators (✅ ❌ ⚠️)
- Alternating row colors
- Hover highlighting

### Documentation Layout
- Sticky sidebar navigation
- Active link highlighting
- Content area with prose styling
- Smooth content transitions

## 🎪 Interactive Features

### Page Routing
- Single-page application feel
- No page reloads
- Browser history support
- Deep linking to sections

### Documentation Navigation
- Sidebar with icons
- Section highlighting
- Smooth scrolling
- Mobile-responsive drawer

### Code Highlighting
- Syntax highlighting for Python
- Keyword, string, comment coloring
- Pre-formatted code blocks
- Inline code styling

## 🚀 Performance

### Vite Build
- Fast development server
- Hot module replacement
- Optimized production builds
- Code splitting

### Tailwind Optimization
- PurgeCSS for production
- Only used styles included
- Minimal CSS bundle size

## 📁 File Structure

```
docs-site/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind theme config
├── vite.config.js          # Vite build config
├── postcss.config.js       # PostCSS config
├── deploy.sh               # Deployment script
├── README.md               # Documentation
├── src/
│   ├── main.js            # Main JavaScript
│   ├── content.js         # Documentation content
│   └── style.css          # Tailwind styles
```

## 🎯 Content Sections

Reflects the shipped feature set of **fastx-mvc v1.6.1** (see `fast_mvc/CHANGELOG.md`).

1. **Introduction** — Overview and quick start (`pip install fastx-mvc`)
2. **Installation & Project Scaffolding** — `fastx generate` / `fastx quickstart`
3. **Vertical Slice Scaffolding** — `fastx add resource -f <folder> -r <op> -v <ver>` for per-operation, per-version isolation across every layer
4. **One-Command Auth** — `fastx add auth` scaffolds a complete JWT stack (login, register, middleware, deps, Bcrypt hashing)
5. **Middleware Scaffolding** — `fastx add middleware` with `request_logger`, `rate_limiter`, `cors_config` templates
6. **Test Generation** — `fastx add test` for async Pytest boilerplate with `AsyncClient` and service/repo mocking
7. **Background Tasks** — `fastx add task` for FastAPI `BackgroundTasks` / Celery / TaskIQ workers
8. **Dockerize** — `fastx dockerize` generates production `Dockerfile`, `docker-compose.yml`, and `docker-entrypoint.sh` (App + Postgres + Redis + Migrations)
9. **Auto-Docs** — `fastx docs generate` crawls `apis/` and `dtos/` to build a full MkDocs API reference via `mkdocstrings`
10. **Enhanced `.env`** — automatic `SECRET_KEY` / `JWT_SECRET_KEY` generation on project creation and via `fastx add env`
11. **Database Management** — `fastx db migrate|upgrade|reset` wrappers around Alembic
12. **API Reference** — auto-generated from code

## 🛠️ CLI & Developer Experience

### Interactive Project Generator
- Beautiful terminal UI with Rich library
- Interactive prompts for project configuration
- Automatic virtual environment creation
- Dependency installation
- `.gitignore` configuration

### VS Code Integration
- Pre-configured debug profiles
- Launch configurations for FastAPI
- Task definitions for common commands
- Recommended extensions list

### Makefile Commands
- One-command setup (`make install`)
- Development server (`make dev`)
- Testing commands (`make test`, `make test-coverage`)
- Database migrations (`make migrate`, `make upgrade`)
- Code quality (`make lint`, `make format`)
- Docker support (`make docker-up`, `make docker-down`)

### Pre-commit Hooks
- Ruff linting and formatting
- MyPy type checking
- Bandit security scanning
- Secret detection
- Trailing whitespace and file validation
- Quick tests before commit

### Environment Validation
- Fail-fast configuration validation
- JWT secret strength checking (min 32 chars, complexity)
- Database URL format validation
- Required environment variables
- Custom validation rules support
- Disable option for testing

### API Documentation Theme
- FastX branded Swagger UI
- Dark mode by default
- Custom color scheme (cyan, fuchsia, violet)
- Code syntax highlighting
- Copy buttons for code samples
- Example requests in multiple languages
- Interactive "Try It Out" feature
- Custom ReDoc styling

### Production Health Checks
- Comprehensive `/health` endpoint with dependency status
- Database connectivity checking (PostgreSQL, MySQL, SQLite)
- Redis cache connectivity verification
- Application version and uptime tracking
- Kubernetes liveness probe (`/health/live`)
- Kubernetes readiness probe (`/health/ready`)
- HTTP 200/503 status codes for healthy/unhealthy states
- Structured JSON responses with timestamps

### GitHub Actions CI/CD
- Auto-generated workflows for every project
- **CI/CD workflow** - Run tests, lint, and build Docker images on push
- **PR Checks** - Validate pull requests with fast checks and tests
- **Release workflow** - Build and push images on version tags
- Multi-Python version testing (3.10, 3.11, 3.12)
- PostgreSQL and Redis service containers for integration tests
- Security scanning with Bandit and Safety
- Docker image builds with multi-arch support (amd64, arm64)
- Automatic GitHub Container Registry (ghcr.io) publishing
- Coverage reporting with Codecov integration

### Database Migration CLI
- **FastX db migrate** - Auto-generate migrations from SQLAlchemy models
- **FastX db upgrade** - Apply pending migrations to database
- **FastX db downgrade** - Rollback migrations when needed
- **FastX db reset** - Drop and recreate database (development)
- **FastX db status** - Check current migration status
- **FastX db history** - View migration history
- Interactive confirmation for destructive operations
- Rich progress indicators and beautiful output
- Automatic detection of Alembic installation
- Support for auto-generated and manual migrations

### Testing Framework
- **ItemFactory** - Generate fake test data with Faker integration
  - `create()`, `create_batch()`, `create_dict()` methods
  - Convenience methods: `completed()`, `pending()`, `with_long_name()`
  - Invalid data generators for negative testing
- **Pytest Fixtures** - Ready-to-use test fixtures
  - Database fixtures: `item_db`, `item_repository`
  - Client fixtures: `item_client`, `async_item_client`, `authenticated_client`
  - Auth fixtures: `mock_user`, `mock_auth`, `mock_invalid_auth`
  - Data fixtures: `test_item`, `test_items`, `completed_items`, `pending_items`
- **Auth Mocks** - Simplified authentication testing
  - Mock valid user authentication
  - Mock invalid/expired tokens
  - Pre-configured authenticated clients
- **Test Organization** - Built-in test markers
  - `@pytest.mark.unit` for unit tests
  - `@pytest.mark.integration` for integration tests
  - `@pytest.mark.api` for API endpoint tests
  - `@pytest.mark.slow` for slow tests
- **Example Tests** - Comprehensive test examples
  - CRUD operation tests
  - Authentication tests
  - Validation and error handling tests
  - Parametrized test examples

### Docker Compose Stack
- **One-command full stack** - `docker-compose up -d` starts everything
- **Core services**: PostgreSQL 16, Redis 7, FastAPI app with auto-migrations
- **Health checks** - All services include proper health monitoring
- **Profiles support** - Optional services via Docker Compose profiles
  - `dev` - PgAdmin and Redis Insight GUIs
  - `worker` - Celery background workers and scheduler
  - `nginx` - Reverse proxy with SSL
  - `caddy` - Reverse proxy with HTTP/3 (QUIC)
  - `full` - All optional services
- **Database migrations** - Automatic Alembic migrations on startup
- **Development tools** - PgAdmin (port 5050), Redis Insight (port 5540)
- **Production ready** - Nginx reverse proxy, SSL support, resource limits
- **gRPC transport (health-first)** - Optional gRPC server exposing `HealthService.Check`, sharing the same JWT auth configuration when enabled.
- **Makefile integration** - Convenient commands like `make docker-up`
- **Environment configuration** - Flexible `.env` based configuration
- **Data persistence** - Docker volumes for database and cache data
- **Network isolation** - Custom bridge network for service communication

## 🌈 Color Palette

- **Background**: #0f0f1a (dark-900)
- **Surface**: #1a1a2e (dark-800)
- **Primary**: #0ea5e9 (cyan-500)
- **Accent**: #d946ef (fuchsia-500)
- **Text**: #cbd5e1 (slate-300)
- **Muted**: #64748b (slate-500)

## 📦 Build Output

The build creates a `dist/` directory with:
- Optimized HTML
- Minified CSS and JS
- Asset files
- Ready for deployment

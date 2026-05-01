// Home page data used to render each section.
// Keeping this separate makes `sections.js` focused on HTML composition.

export const HOME_CODE_FEATURES = [
  {
    icon: 'zap',
    title: 'Smart Caching',
    description: 'Cache-aside pattern with stale-while-revalidate and request deduplication',
  },
  {
    icon: 'search',
    title: 'N+1 Detection',
    description: 'Automatically detect and warn about N+1 query patterns',
  },
  {
    icon: 'activity',
    title: 'Distributed Tracing',
    description: 'OpenTelemetry-compatible with cost attribution',
  },
  {
    icon: 'lock',
    title: 'Field Encryption',
    description: 'AES-256-GCM encryption for sensitive data',
  },
];

export const FEATURES_GRID_ITEMS = [
  {
    icon: 'zap',
    title: 'Smart Caching',
    description: 'Cache-aside pattern with stale-while-revalidate and request deduplication (thundering herd protection).',
  },
  {
    icon: 'search',
    title: 'N+1 Detection',
    description: 'Automatically detect and warn about N+1 query patterns in SQLAlchemy.',
  },
  {
    icon: 'activity',
    title: 'Distributed Tracing',
    description: 'OpenTelemetry-compatible tracing with cost attribution per request/tenant.',
  },
  {
    icon: 'lock',
    title: 'Field Encryption',
    description: 'AES-256-GCM encryption for sensitive fields with searchable encryption support.',
  },
  {
    icon: 'git-branch',
    title: 'GraphQL Auto-Gen',
    description: 'Automatically generate GraphQL schemas from FastAPI REST endpoints.',
  },
  {
    icon: 'refresh-cw',
    title: 'Hot Config Reload',
    description: 'Watch configuration files and auto-apply changes without restarts.',
  },
  {
    icon: 'repeat',
    title: 'Saga Pattern',
    description: 'Manage distributed transactions with automatic compensation on failure.',
  },
  {
    icon: 'clock',
    title: 'Time-Travel Debugging',
    description: 'Record and replay request flows for debugging production issues locally.',
  },
  {
    icon: 'radio',
    title: 'WebSocket Channels',
    description: 'Pub/sub channels with presence tracking, InMemory and Redis backends.',
  },
  {
    icon: 'cloud',
    title: 'One-Command Deploy',
    description: 'Deploy to AWS, GCP, Azure, Fly.io, or Railway with a single CLI command.',
  },
  {
    icon: 'package',
    title: 'SDK Generator',
    description: 'Generate typed TypeScript or Python client SDKs from your OpenAPI spec.',
  },
  {
    icon: 'heart-pulse',
    title: 'Health Probes',
    description: 'Built-in /health, /health/live, /health/ready with real DB and Redis checks.',
  },
  {
    icon: 'mail',
    title: 'Email Providers',
    description: 'Unified email with SMTP, SendGrid, SES, Mailgun backends and Jinja2 templates.',
  },
  {
    icon: 'timer',
    title: 'Cron Scheduler',
    description: '@cron decorator for scheduled jobs with Redis distributed locking.',
  },
  {
    icon: 'key',
    title: 'API Key Management',
    description: 'Issue, rotate, revoke API keys with per-key rate limiting middleware.',
  },
  {
    icon: 'gauge',
    title: 'Request Profiler',
    description: 'N+1 detection, slow query tracking, and /__profile__ dashboard in dev mode.',
  },
  {
    icon: 'webhook',
    title: 'Webhook Receiver',
    description: 'Inbound webhook verification for Stripe, GitHub, Slack with signature validation.',
  },
  {
    icon: 'list',
    title: 'Cursor Pagination',
    description: 'Built-in cursor and offset pagination mixins for SQLAlchemy repositories.',
  },
];

export const COMPARISON_ROWS = [
  ['Smart Caching', 'Manual', 'x', 'External', 'Built-in'],
  ['Declarative cache + SWR', 'External', 'Manual', 'External', 'Built-in'],
  ['N+1 Detection', 'x', 'x', 'x', 'Built-in'],
  ['ORM guardrails / query insights', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['Distributed tracing + spans', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['Cost attribution (per tenant / route)', 'x', 'x', 'Limited', 'Built-in'],
  ['Field Encryption', 'Manual', 'x', 'External', 'Built-in'],
  ['GraphQL Auto-Gen', 'x', 'x', 'Manual', 'From REST'],
  ['OpenAPI + Postman collection generation', 'Partial', 'Built-in', 'Built-in', 'Built-in'],
  ['WebSockets', 'Channels', 'Built-in', 'Built-in', 'Built-in'],
  ['Background jobs / sagas', 'Celery', 'Manual', 'Bull / libs', 'Built-in saga'],
  ['Hot Config Reload', 'x', 'x', 'Limited', 'Full'],
  ['CLI: scaffold + dev server', 'django-admin', 'External', 'nest CLI', 'fastx CLI'],
  ['SDK generation (TS + Python)', 'x', 'x', 'x', 'Built-in'],
  ['One-command cloud deploy', 'x', 'x', 'x', 'AWS/GCP/Azure/Fly/Railway'],
  ['WebSocket channels + presence', 'Channels', 'Built-in', 'Socket.io', 'Built-in'],
  ['Health probes (DB + Redis)', 'Manual', 'Manual', 'Terminus', 'Built-in'],
  ['Email providers (SMTP/SES/SendGrid)', 'Manual', 'Manual', 'Nodemailer', 'Built-in'],
  ['Cron scheduler (@cron decorator)', 'Celery Beat', 'x', 'node-cron', 'Built-in'],
  ['API key management + rate limiting', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['Request profiler + N+1 dashboard', 'Debug Toolbar', 'x', 'x', 'Built-in'],
  ['Webhook receiver (Stripe/GitHub)', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['Cursor pagination mixin', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['Bulk operations (upsert/batch)', 'Manual', 'Manual', 'Manual', 'Built-in'],
  ['OpenAPI diff / breaking changes', 'x', 'x', 'x', 'Built-in'],
  ['Saga Pattern', 'x', 'x', 'Library', 'Built-in'],
  ['Time-Travel Debug', 'x', 'x', 'x', 'Unique'],
];

export const ECOSYSTEM_PACKAGES = [
  {
    section: 'pkg-fast-platform',
    name: 'fastx-platform',
    role: 'Infrastructure',
    icon: 'server',
    desc: 'Email, cron scheduler, API keys, profiler, webhooks, caching, storage (S3, GCS, Azure).',
  },
  {
    section: 'pkg-fast-middleware',
    name: 'fastx-middleware',
    role: 'HTTP layer',
    icon: 'shield',
    desc: '90+ middlewares: security headers, CORS, JWT, rate limiting, tracing.',
  },
  {
    section: 'pkg-fast-database',
    name: 'fastx-database',
    role: 'Data layer',
    icon: 'database',
    desc: 'SQLAlchemy v2, cursor pagination, bulk operations, migrations, repositories.',
  },
  {
    section: 'pkg-fast-dashboards',
    name: 'fastx-dashboards',
    role: 'Observability UI',
    icon: 'layout-dashboard',
    desc: 'Admin panel, metrics, task monitoring.',
  },
  {
    section: 'pkg-fast-channels',
    name: 'fastx-channels',
    role: 'Real-time',
    icon: 'radio',
    desc: 'WebSocket pub/sub channels with presence tracking, InMemory and Redis backends.',
  },
  {
    section: 'pkg-fast-mvc',
    name: 'fastx-mvc',
    role: 'CLI & core',
    icon: 'terminal',
    desc: 'Scaffolding, dev server, test/lint, SDK gen, cloud deploy, upgrade, routes.',
  },
];


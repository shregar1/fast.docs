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
  ['OpenAPI schema generation', 'Partial', 'Built-in', 'Built-in', 'Built-in'],
  ['WebSockets', 'Channels', 'Built-in', 'Built-in', 'Built-in'],
  ['Background jobs / sagas', 'Celery', 'Manual', 'Bull / libs', 'Built-in saga'],
  ['Hot Config Reload', 'x', 'x', 'Limited', 'Full'],
  ['CLI: scaffold + dev server', 'django-admin', 'External', 'nest CLI', 'fastmvc-cli'],
  ['Saga Pattern', 'x', 'x', 'Library', 'Built-in'],
  ['Time-Travel Debug', 'x', 'x', 'x', 'Unique'],
];

export const ECOSYSTEM_PACKAGES = [
  {
    section: 'pkg-fast-platform',
    name: 'fast-platform',
    role: 'Infrastructure',
    icon: 'server',
    desc: 'Caching, tasks, OIDC, LLM integration, search orchestrators.',
  },
  {
    section: 'pkg-fast-middleware',
    name: 'fast-middleware',
    role: 'HTTP layer',
    icon: 'shield',
    desc: '90+ middlewares: security headers, CORS, JWT, rate limiting, tracing.',
  },
  {
    section: 'pkg-fast-database',
    name: 'fast-database',
    role: 'Data layer',
    icon: 'database',
    desc: 'SQLAlchemy v2, migrations, repositories, typed data access.',
  },
  {
    section: 'pkg-fast-dashboards',
    name: 'fast-dashboards',
    role: 'Observability UI',
    icon: 'layout-dashboard',
    desc: 'Admin panel, metrics, task monitoring.',
  },
  {
    section: 'pkg-fast-mvc',
    name: 'fast-mvc',
    role: 'CLI & core',
    icon: 'terminal',
    desc: 'Scaffolding, project layout, unified framework surface.',
  },
];


// Documentation content
export const content = {
  introduction: `# Introduction

**Fast** is a production-grade building block framework for FastAPI that provides enterprise-ready features out of the box.

## Why Fast?

Unlike other frameworks that require you to glue together dozens of libraries, Fast provides a cohesive, batteries-included experience with:

- **Smart Caching** with stale-while-revalidate
- **Auto N+1 Detection** for database queries
- **Distributed Tracing** with cost attribution
- **Field-Level Encryption** for sensitive data
- **GraphQL Auto-Generation** from REST endpoints
- **Hot Config Reload** without restarts
- **Saga Pattern** for distributed transactions
- **Time-Travel Debugging** for request replay

## Quick Start

\`\`\`bash
# Install Fast
pip install fastmvc-cli

# Create a new project
fast generate my_project
cd my_project

# Run the development server
fast run
\`\`\`

Your API will be available at http://localhost:8000`,

  installation: `# Installation

## Requirements

- Python 3.10 or higher
- pip or uv package manager

## Quick Install

\`\`\`bash
pip install fastmvc-cli
\`\`\`

## Full Installation

\`\`\`bash
pip install fastmvc-cli[all]
\`\`\`

## Verify Installation

\`\`\`bash
fast --version
\`\`\`

## Create Your First Project

\`\`\`bash
fast generate my_api
cd my_api
fast run
\`\`\``,

  'smart-caching': `# Smart Caching

The Smart Caching System provides production-grade caching with cache-aside pattern, stale-while-revalidate, request deduplication, and event-based invalidation.

## Basic Usage

\`\`\`python
from fast_dashboards.core import smart_cache

@smart_cache.cached(
    ttl=300,
    stale_ttl=60,
    invalidate_on=["user:update", "user:delete"]
)
async def get_user(user_id: str) -> User:
    return await db.query(User).get(user_id)
\`\`\`

## Stale-While-Revalidate

Serve stale data while refreshing in the background:

\`\`\`python
@smart_cache.cached(
    ttl=300,        # Fresh for 5 minutes
    stale_ttl=60    # Serve stale for 1 additional minute
)
async def get_dashboard_data() -> DashboardData:
    return await compute_dashboard_data()
\`\`\`

## Request Deduplication

When multiple concurrent requests hit a cache miss, only one database query is executed:

\`\`\`python
@smart_cache.cached(ttl=60)
async def get_popular_products() -> List[Product]:
    return await db.query(Product).order_by(Product.views.desc()).limit(10).all()
\`\`\``,

  'nplus1-detection': `# N+1 Query Detection

Automatic detection and prevention of N+1 query patterns in SQLAlchemy applications.

## Usage

\`\`\`python
from fast_dashboards.core import detect_nplus1

@detect_nplus1(warning_threshold=5)
async def get_users_with_orders():
    users = await db.query(User).all()
    for user in users:
        print(user.orders)  # Triggers warning if N+1 detected
\`\`\`

## Fixing N+1 Issues

### Using selectinload

\`\`\`python
from sqlalchemy.orm import selectinload

async def get_users_good():
    users = await db.query(User).options(
        selectinload(User.orders)
    ).all()
    return users
\`\`\``,

  'distributed-tracing': `# Distributed Tracing

OpenTelemetry-compatible distributed tracing with built-in cost tracking per request, tenant, and user.

## Usage

\`\`\`python
from fast_dashboards.core import tracer

@tracer.trace_method()
async def process_payment(order_id: str):
    return await process(order_id)

# View costs
cost = tracer.get_cost_by_tenant("tenant_123")
print(f"Total cost: \${cost.total_cost_usd}")
\`\`\`

## Cost Attribution

\`\`\`python
@tracer.trace_method()
async def ai_enhanced_endpoint(user_query: str):
    span = tracer.get_current_span()
    span.set_attribute("tenant.id", "tenant_123")
    
    response = await openai_client.chat.completions.create(...)
    span.add_cost("api", Decimal("0.03"))
    
    return response
\`\`\``,

  'field-encryption': `# Field-Level Encryption

AES-256-GCM authenticated encryption for sensitive fields with support for searchable encryption.

## Usage

\`\`\`python
from fast_dashboards.core import Encrypted

class User(BaseModel):
    name: str
    email: str
    ssn: Encrypted[str]  # Automatically encrypted
\`\`\`

## Setup

\`\`\`python
from fast_dashboards.core import setup_encryption

# From environment
setup_encryption()
\`\`\`

Set environment variable:
\`\`\`bash
export FASTMVC_ENCRYPTION_KEY=$(python -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
\`\`\``,

  'graphql-automation': `# GraphQL Auto-Generation

Automatically generate GraphQL schemas and resolvers from your FastAPI REST endpoints.

## Usage

\`\`\`python
from fast_dashboards.core import GraphQLAutoGenerator

app = FastAPI()
# ... define your REST endpoints

graphql = GraphQLAutoGenerator(app)
app.mount("/graphql", graphql.create_endpoint())
\`\`\`

This automatically generates GraphQL types, queries, and mutations from your Pydantic models and FastAPI endpoints.`,

  'hot-config-reload': `# Hot Config Reload

Watch configuration files for changes and automatically apply updates without restarting your server.

## Usage

\`\`\`python
from fast_dashboards.core import config_reloader

@config_reloader.watch("database.host")
async def on_db_host_change(old, new):
    await reconnect_db(new)

config_reloader.watch_file(".env")
await config_reloader.start_watching()
\`\`\``,

  'saga-pattern': `# Saga Pattern

Manage distributed transactions across multiple services with automatic compensation on failure.

## Usage

\`\`\`python
from fast_dashboards.core import SagaBuilder, ok

saga = (
    SagaBuilder("order_processing")
    .step("reserve_inventory", reserve_fn, compensate=release_fn)
    .step("process_payment", payment_fn, compensate=refund_fn)
    .step("create_shipment", shipment_fn)
    .build()
)

execution = await saga.execute({"order_id": "123"})
\`\`\``,

  'time-travel-debugging': `# Time-Travel Debugging

Record and replay request flows for debugging production issues locally.

## Usage

\`\`\`python
from fast_dashboards.core import recordable

@recordable(name="process_order")
async def process_order(order_id: str):
    return await process(order_id)
\`\`\`

Replay locally:
\`\`\`bash
fast replay --recording=abc123 --breakpoint=line_45
\`\`\``,

  'api-reference': `# API Reference

## SmartCacheManager

\`\`\`python
class SmartCacheManager:
    async def get(self, key: str) -> Optional[Any]
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool
    async def delete(self, key: str) -> bool
    async def delete_pattern(self, pattern: str) -> int
    async def get_or_set(self, key: str, factory: Callable, ttl: Optional[int] = None) -> Any
\`\`\`

## Tracer

\`\`\`python
def start_span(name: str, kind: SpanKind = SpanKind.INTERNAL) -> Span
def finish_span(span: Span, status: Optional[SpanStatus] = None)
def trace_method(name: Optional[str] = None)
def get_cost_by_tenant(tenant_id: str) -> CostBreakdown
\`\`\`

## SagaBuilder

\`\`\`python
class SagaBuilder:
    def step(self, name: str, action: Callable, compensation: Optional[Callable] = None)
    def with_timeout(self, timeout: float)
    def build(self) -> Saga
\`\`\`

## Edge Functions

\`\`\`python
@edge_function(
    runtime: EdgeRuntime = EdgeRuntime.V8,
    regions: Optional[List[str]] = None,
    ttl: Optional[int] = None
)
async def my_edge_handler(request: EdgeRequest) -> EdgeResponse

class EdgeKV:
    async def get(self, key: str) -> Optional[Any]
    async def put(self, key: str, value: Any, ttl: Optional[int] = None) -> None
    async def delete(self, key: str) -> bool

class EdgeCache:
    async def match(self, request: EdgeRequest) -> Optional[EdgeResponse]
    async def put(self, request: EdgeRequest, response: EdgeResponse) -> None
\`\`\`

## Geo-Partitioning

\`\`\`python
@geo_partition(
    shard_key: str,
    strategy: GeoShardingStrategy = GeoShardingStrategy.PROXIMITY,
    replicas: Optional[Dict[str, int]] = None
)
class UserData(BaseGeoModel):
    pass

class GDPRCompliance:
    @staticmethod
    def requires_eu_residency(country_code: str) -> bool
    @staticmethod
    async def handle_data_deletion_request(user_id: UUID) -> Dict[str, Any]
\`\`\`

## Chaos Engineering

\`\`\`python
@chaos_experiment(
    failures: List[FailureConfig],
    blast_radius: float = 0.1,
    duration_minutes: int = 10
)
async def my_endpoint() -> Response

class ChaosController:
    @staticmethod
    async def start_experiment(name: str) -> ExperimentResult
    @staticmethod
    async def stop_experiment(name: str) -> bool
\`\`\`

## Cost Tracking

\`\`\`python
@track_costs(
    resource_type: ResourceType,
    model: str = "per-request"
)
async def my_endpoint() -> Response

class Budget:
    def __init__(
        self,
        monthly_limit: Decimal,
        alert_thresholds: List[BudgetAlert]
    )

class CostOptimizer:
    async def analyze(tenant_id: Optional[str] = None) -> List[OptimizationRecommendation]
\`\`\``
};

// Hero section component
export function createHeroSection() {
  return `
    <section class="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <!-- Hero Logo -->
          <div class="mb-8 flex justify-center">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center" style="background-color: var(--fm-surface); border: 1px solid var(--fm-border);">
              <img src="/assets/logo-hero-dark.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 dark-logo" style="display: block;">
              <img src="/assets/logo-hero-light.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 light-logo" style="display: none;">
            </div>
          </div>
          
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border); color: var(--fm-text);">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--fm-text);"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: var(--fm-text-secondary);"></span>
            </span>
            v0.4.0 is now available
          </div>
          
          <!-- Main heading -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style="color: var(--fm-text);">
            Production-Grade
            <span class="block" style="color: var(--fm-text-secondary);">
              FastAPI Framework
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed" style="color: var(--fm-text-muted);">
            The most advanced Python web framework with smart caching, N+1 detection, 
            distributed tracing, field encryption, and more.
          </p>
          
          <div class="max-w-2xl mx-auto mb-10 px-4">
            <div class="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 font-mono text-sm sm:text-base" style="background-color: var(--fm-code-bg); border-color: var(--fm-border); color: var(--fm-text);">
              <span class="min-w-0 truncate text-left"><span style="color: var(--fm-text-muted); user-select: none;">$ </span>pip install fastmvc-cli</span>
              <button type="button" class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors" style="background-color: var(--fm-surface-raised); color: var(--fm-text-muted); border: 1px solid var(--fm-border);" onmouseover="this.style.color='var(--fm-text)'" onmouseout="this.style.color='var(--fm-text-muted)'" onclick="navigator.clipboard.writeText('pip install fastmvc-cli')" aria-label="Copy pip install command">Copy</button>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#" onclick="showPage('docs')" class="group relative px-8 py-4 font-semibold rounded-xl overflow-hidden transition-all hover:scale-105" style="background-color: var(--fm-text); color: var(--fm-bg);">
              <span class="relative flex items-center gap-2">
                Get Started
                <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
              </span>
            </a>
            <a href="https://github.com/shregar1/fast.mvc" target="_blank" class="px-8 py-4 font-semibold rounded-xl transition-all flex items-center gap-2" style="background-color: var(--fm-surface); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'">
              <i data-lucide="github" class="w-5 h-5"></i>
              View on GitHub
            </a>
          </div>
          
          <!-- Code preview -->
          <div class="max-w-4xl mx-auto">
            <div class="rounded-2xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
              <div class="flex items-center gap-2 px-4 py-3 border-b" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">example.py</span>
              </div>
              <div class="p-6 text-left overflow-x-auto">
                <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code><span style="color: var(--fm-accent);">from</span> <span style="color: var(--fm-text);">fast_dashboards.core</span> <span style="color: var(--fm-accent);">import</span> <span style="color: var(--fm-text);">smart_cache, detect_nplus1, tracer</span>

<span style="color: var(--fm-accent);">@smart_cache.cached</span>(<span style="color: var(--fm-text);">ttl</span>=<span style="color: var(--fm-accent);">300</span>)
<span style="color: var(--fm-accent);">@detect_nplus1</span>()
<span style="color: var(--fm-accent);">@tracer.trace_method</span>()
<span style="color: var(--fm-accent);">async def</span> <span style="color: var(--fm-text);">get_user</span>(<span style="color: var(--fm-text);">user_id</span>: <span style="color: var(--fm-accent);">str</span>) -> <span style="color: var(--fm-text);">User</span>:
    <span style="color: var(--fm-accent);">return await</span> <span style="color: var(--fm-text);">db.query</span>(<span style="color: var(--fm-text);">User</span>).<span style="color: var(--fm-text);">get</span>(<span style="color: var(--fm-text);">user_id</span>)</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

const HOME_CODE_FEATURES = [
  {
    icon: 'zap',
    title: 'Smart Caching',
    description:
      'Cache-aside pattern with stale-while-revalidate and request deduplication',
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

function homeFeatureCard({ icon, title, description }) {
  return `
    <div class="fm-feature-card">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border);">
          <i data-lucide="${icon}" class="w-5 h-5" style="color: var(--fm-text);"></i>
        </div>
        <div>
          <h3 class="font-semibold mb-1" style="color: var(--fm-text);">${title}</h3>
          <p class="text-sm" style="color: var(--fm-text-muted);">${description}</p>
        </div>
      </div>
    </div>
  `;
}

/** “Write Less, Do More” code example + feature list on the home page */
export function createHomeWriteLessSection() {
  const featureCards = HOME_CODE_FEATURES.map(homeFeatureCard).join('');

  return `
    <section class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Write Less, <span style="color: var(--fm-text-secondary);">Do More</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Fast provides powerful decorators and utilities that handle complex infrastructure concerns so you can focus on your business logic.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <div class="flex items-center gap-2 px-4 py-3 border-b" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">main.py</span>
            </div>
            <div class="p-6 overflow-x-auto">
              <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code class="language-python">from fast_dashboards.core import (
    smart_cache,
    detect_nplus1,
    tracer,
    Encrypted
)

class User(BaseModel):
    name: str
    ssn: Encrypted[str]  # Auto-encrypted

@smart_cache.cached(ttl=300)
@detect_nplus1()
@tracer.trace_method()
async def get_user(user_id: str) -> User:
    return await db.query(User).get(user_id)</code></pre>
            </div>
          </div>

          <div class="space-y-4">
            ${featureCards}
          </div>
        </div>
      </div>
    </section>
  `;
}

// Features grid component
export function createFeaturesGrid() {
  const features = [
    {
      icon: 'zap',
      title: 'Smart Caching',
      description: 'Cache-aside pattern with stale-while-revalidate and request deduplication (thundering herd protection).'
    },
    {
      icon: 'search',
      title: 'N+1 Detection',
      description: 'Automatically detect and warn about N+1 query patterns in SQLAlchemy.'
    },
    {
      icon: 'activity',
      title: 'Distributed Tracing',
      description: 'OpenTelemetry-compatible tracing with cost attribution per request/tenant.'
    },
    {
      icon: 'lock',
      title: 'Field Encryption',
      description: 'AES-256-GCM encryption for sensitive fields with searchable encryption support.'
    },
    {
      icon: 'git-branch',
      title: 'GraphQL Auto-Gen',
      description: 'Automatically generate GraphQL schemas from FastAPI REST endpoints.'
    },
    {
      icon: 'refresh-cw',
      title: 'Hot Config Reload',
      description: 'Watch configuration files and auto-apply changes without restarts.'
    },
    {
      icon: 'repeat',
      title: 'Saga Pattern',
      description: 'Manage distributed transactions with automatic compensation on failure.'
    },
    {
      icon: 'clock',
      title: 'Time-Travel Debugging',
      description: 'Record and replay request flows for debugging production issues locally.'
    }
  ];

  const cards = features.map(f => `
    <div class="fm-feature-card group">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border);">
        <i data-lucide="${f.icon}" class="w-6 h-6" style="color: var(--fm-text);"></i>
      </div>
      <h3 class="text-lg font-semibold mb-2" style="color: var(--fm-text);">${f.title}</h3>
      <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">${f.description}</p>
    </div>
  `).join('');

  return `
    <section id="features" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Everything You Need to
            <span style="color: var(--fm-text-secondary);">Ship Faster</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Enterprise-grade features built-in, so you can focus on building your application.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

// Comparison table component
export function createComparisonTable() {
  return `
    <section class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Why <span style="color: var(--fm-text-secondary);">Fast?</span>
          </h2>
          <p class="text-lg" style="color: var(--fm-text-muted);">
            See how Fast compares to other frameworks
          </p>
        </div>
        
        <div class="overflow-x-auto rounded-2xl border" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
          <table class="w-full text-left">
            <thead>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <th class="pb-4 pt-4 px-6 font-medium" style="color: var(--fm-text-muted);">Feature</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">Django</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">FastAPI</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">NestJS</th>
                <th class="pb-4 pt-4 px-6 text-center font-semibold" style="color: var(--fm-text);">Fast</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Smart Caching</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">Manual</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">External</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Built-in</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">N+1 Detection</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Built-in</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Cost Attribution</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Built-in</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Field Encryption</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">Manual</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">External</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Built-in</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">GraphQL Auto-Gen</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">Manual</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ From REST</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Hot Config Reload</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">Limited</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Full</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Saga Pattern</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-warning);">Library</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Built-in</td>
              </tr>
              <tr>
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">Time-Travel Debug</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center" style="color: var(--fm-error);">❌</td>
                <td class="py-4 px-6 text-center font-semibold" style="color: var(--fm-success);">✅ Unique</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

// CTA section component
export function createCTASection() {
  return `
    <section class="py-24 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative p-12 rounded-3xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
          <!-- Background pattern -->
          <div class="absolute inset-0 opacity-30">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, var(--fm-border-hover) 1px, transparent 0); background-size: 24px 24px;"></div>
          </div>
          
          <div class="relative text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
              Ready to Build Something
              <span style="color: var(--fm-text-secondary);">Amazing?</span>
            </h2>
            <p class="text-lg mb-8 max-w-xl mx-auto" style="color: var(--fm-text-muted);">
              Get started with Fast in minutes. Join thousands of developers building production-grade applications.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" onclick="showPage('docs')" class="px-8 py-4 font-semibold rounded-xl transition-colors flex items-center gap-2" style="background-color: var(--fm-text); color: var(--fm-bg);">
                Read Documentation
                <i data-lucide="book-open" class="w-5 h-5"></i>
              </a>
              <a href="https://github.com/shregar1/fast.mvc" target="_blank" class="px-8 py-4 font-semibold rounded-xl transition-colors flex items-center gap-2" style="background-color: var(--fm-surface-raised); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'">
                <i data-lucide="star" class="w-5 h-5"></i>
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Docs page layout
export function createDocsPage() {
  const navItems = [
    { section: 'introduction', title: 'Introduction', icon: 'book-open' },
    { section: 'installation', title: 'Installation', icon: 'download' },
    { section: 'smart-caching', title: 'Smart Caching', icon: 'zap' },
    { section: 'nplus1-detection', title: 'N+1 Detection', icon: 'search' },
    { section: 'distributed-tracing', title: 'Distributed Tracing', icon: 'activity' },
    { section: 'field-encryption', title: 'Field Encryption', icon: 'lock' },
    { section: 'graphql-automation', title: 'GraphQL Auto-Gen', icon: 'git-branch' },
    { section: 'hot-config-reload', title: 'Hot Config Reload', icon: 'refresh-cw' },
    { section: 'saga-pattern', title: 'Saga Pattern', icon: 'repeat' },
    { section: 'time-travel-debugging', title: 'Time-Travel Debug', icon: 'clock' },
    { type: 'divider' },
    { section: 'edge-functions', title: 'Edge Functions', icon: 'globe' },
    { section: 'geo-partitioning', title: 'Geo-Partitioning', icon: 'map' },
    { section: 'chaos-engineering', title: 'Chaos Engineering', icon: 'zap' },
    { section: 'cost-tracking', title: 'Cost Tracking', icon: 'dollar-sign' },
    { type: 'divider' },
    { section: 'api-reference', title: 'API Reference', icon: 'code' },
  ];

  const navList = navItems.map(item => {
    if (item.type === 'divider') {
      return `<div class="my-4" style="border-top: 1px solid var(--fm-border);"></div>`;
    }
    return `
    <a href="#" data-section="${item.section}" class="doc-link flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all border-l-2" style="color: var(--fm-text-muted); background-color: transparent; border-color: transparent;">
      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
      ${item.title}
    </a>
  `}).join('');

  return `
    <div class="pt-24 pb-12 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-8">
          <!-- Sidebar -->
          <aside class="hidden lg:block w-64 flex-shrink-0">
            <div class="sticky top-24">
              <h2 class="text-xs font-semibold uppercase tracking-wider mb-4 px-4" style="color: var(--fm-text-muted);">Documentation</h2>
              <nav class="space-y-1">
                ${navList}
              </nav>
            </div>
          </aside>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div id="doc-content" class="rounded-2xl border p-8 md:p-12" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
              <!-- Content loaded dynamically -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Code highlighting
export function highlightCode() {
  // Simple syntax highlighting for Python (plain text inside <code> only).
  // Skip blocks that already contain elements (e.g. hero preview with manual <span>s);
  // regexes would otherwise treat quotes in style="..." as string delimiters and corrupt HTML.
  document.querySelectorAll('pre code').forEach(block => {
    if (block.children.length > 0) {
      return;
    }

    let html = block.innerHTML;
    
    // Keywords
    html = html.replace(/\b(from|import|async|def|return|await|class|if|else|try|except|with|as|for|in|None|True|False)\b/g, 
      '<span style="color: var(--fm-accent);">$1</span>');
    
    // Strings
    html = html.replace(/(['"""'])(.*?)\1/g, 
      '<span style="color: var(--fm-success);">$1$2$1</span>');
    
    // Comments
    html = html.replace(/(#.*$)/gm, 
      '<span style="color: var(--fm-text-muted);">$1</span>');
    
    // Function names
    html = html.replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, 
      '<span style="color: var(--fm-text);">$1</span>');
    
    // Decorators
    html = html.replace(/(@[a-zA-Z_][a-zA-Z0-9_]*)/g, 
      '<span style="color: var(--fm-warning);">$1</span>');
    
    block.innerHTML = html;
  });
}

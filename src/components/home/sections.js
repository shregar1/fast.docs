import { codeWindowToolbar, codeWindowCodeBlock } from '../ui/code-window.js';

/** Write-less example — function-style handler. */
export const WRITE_LESS_CODE_FUNCTION = `from fast_platform.caching import smart_cache
from fast_dashboards.core import (
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
    return await db.query(User).get(user_id)`;

/** Same features on a class-based controller. */
export const WRITE_LESS_CODE_CLASS = `from abstractions.controller import Controller
from fast_platform.caching import smart_cache
from fast_dashboards.core import detect_nplus1, tracer

class User(BaseModel):
    name: str
    ssn: Encrypted[str]  # Auto-encrypted

class UserController(Controller):
    """Routes delegate here; shared deps and hooks live on the controller."""

    @smart_cache.cached(ttl=300)
    @detect_nplus1()
    @tracer.trace_method()
    async def get_user(self, user_id: str) -> User:
        return await self.db.query(User).get(user_id)`;

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

function compCellMid(val) {
  if (val === 'x') {
    return `<td class="py-4 px-6 text-center"><span class="inline-flex justify-center" style="color: var(--fm-text-muted);" aria-hidden="true"><i data-lucide="x" class="w-4 h-4"></i></span></td>`;
  }
  return `<td class="py-4 px-6 text-center" style="color: var(--fm-text-secondary);">${val}</td>`;
}

function compCellFast(val) {
  return `<td class="py-4 px-6 text-center font-semibold"><span class="inline-flex justify-center items-center gap-1.5" style="color: var(--fm-text);"><i data-lucide="check" class="w-4 h-4"></i> ${val}</span></td>`;
}

const COMPARISON_ROWS = [
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

export function createHeroSection() {
  return `
    <section class="relative pt-[60px] pb-[40px] overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="mb-8 flex justify-center">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center" style="background-color: var(--fm-surface); border: 1px solid var(--fm-border);">
              <img src="/assets/logo-hero-dark.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 dark-logo" style="display: block;">
              <img src="/assets/logo-hero-light.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 light-logo" style="display: none;">
            </div>
          </div>

          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border); color: var(--fm-text);">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--fm-text);"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: var(--fm-text-secondary);"></span>
            </span>
            v0.4.0 is now available
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style="color: var(--fm-text);">
            Production-Grade
            <span class="block" style="color: var(--fm-text-secondary);">
              FastAPI Framework
            </span>
          </h1>

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

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        </div>
      </div>
    </section>
  `;
}

export function createHomeWriteLessSection() {
  const featureCards = HOME_CODE_FEATURES.map(homeFeatureCard).join('');
  const toolbar = codeWindowToolbar({
    filename: 'main.py',
    codeId: 'main',
    showTryCopy: true,
    showControllerToggle: true,
  });
  const body = codeWindowCodeBlock({
    codeId: 'main',
    code: WRITE_LESS_CODE_CLASS,
    wrapperClass: 'p-6 overflow-x-auto',
  });

  return `
    <section class="pt-[40px] pb-24 relative overflow-hidden">
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
            ${toolbar}
            ${body}
          </div>

          <div class="space-y-4">
            ${featureCards}
          </div>
        </div>
      </div>
    </section>
  `;
}

const FEATURES_GRID_ITEMS = [
  {
    icon: 'zap',
    title: 'Smart Caching',
    description:
      'Cache-aside pattern with stale-while-revalidate and request deduplication (thundering herd protection).',
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

export function createFeaturesGrid() {
  const cards = FEATURES_GRID_ITEMS.map(
    (f) => `
    <div class="fm-feature-card group">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border);">
        <i data-lucide="${f.icon}" class="w-6 h-6" style="color: var(--fm-text);"></i>
      </div>
      <h3 class="text-lg font-semibold mb-2" style="color: var(--fm-text);">${f.title}</h3>
      <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">${f.description}</p>
    </div>
  `
  ).join('');

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

export function createComparisonTable() {
  const last = COMPARISON_ROWS.length - 1;
  const tbody = COMPARISON_ROWS.map((row, i) => {
    const [feature, d, fa, ne, fast] = row;
    const border = i < last ? ` style="border-bottom: 1px solid var(--fm-border);"` : '';
    return `<tr${border}>
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">${feature}</td>
                ${compCellMid(d)}
                ${compCellMid(fa)}
                ${compCellMid(ne)}
                ${compCellFast(fast)}
              </tr>`;
  }).join('');

  return `
    <section class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Why <span style="color: var(--fm-text-secondary);">Fast?</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Feature matrix across common stacks — indicative only; check each framework’s plugins and version for your exact needs.
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
              ${tbody}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function createCTASection() {
  return `
    <section class="py-24 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative p-12 rounded-3xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
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

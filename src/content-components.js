// Homepage and UI Components
// Separated from content.js for better organization

import { WRITE_LESS_CODE_FUNCTION } from './verified-home-code.js';

function escapeCodeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

// Hero section component
export function createHeroSection() {
  const heroCode = escapeCodeHtml(WRITE_LESS_CODE_FUNCTION);
  return `
    <section class="relative pt-[60px] pb-20 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <!-- Hero Logo -->
          <div class="mb-8 flex justify-center">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center" style="background-color: var(--fm-surface); border: 1px solid var(--fm-border);">
              <img src="/assets/logo-hero-dark.svg" alt="FastX" class="w-16 h-16 md:w-20 md:h-20 dark-logo" style="display: block;">
              <img src="/assets/logo-hero-light.svg" alt="FastX" class="w-16 h-16 md:w-20 md:h-20 light-logo" style="display: none;">
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
              <span class="min-w-0 truncate text-left"><span style="color: var(--fm-text-muted); user-select: none;">$ </span>pip install fastx-cli</span>
              <button type="button" class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors" style="background-color: var(--fm-surface-raised); color: var(--fm-text-muted); border: 1px solid var(--fm-border);" onmouseover="this.style.color='var(--fm-text)'" onmouseout="this.style.color='var(--fm-text-muted)'" onclick="navigator.clipboard.writeText('pip install fastx-cli')" aria-label="Copy pip install command">Copy</button>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#" onclick="showPage('docs'); loadDocSection('tutorial-overview'); return false;" class="group relative px-8 py-4 font-semibold rounded-xl overflow-hidden transition-all hover:scale-105" style="background-color: var(--fm-text); color: var(--fm-bg);">
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
                <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">home_function_style.py</span>
              </div>
              <div class="p-6 text-left overflow-x-auto">
                <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code class="language-python" data-fm-no-shiki="1">${heroCode}</code></pre>
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

/** "Write Less, Do More" code example + feature list on the home page */
export function createHomeWriteLessSection() {
  const featureCards = HOME_CODE_FEATURES.map(homeFeatureCard).join('');
  const writeLessCode = escapeCodeHtml(WRITE_LESS_CODE_FUNCTION);

  return `
    <section class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Write Less, <span style="color: var(--fm-text-secondary);">Do More</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Runnable <strong>FastAPI</strong> sample from <code class="text-sm px-1 rounded" style="background: var(--fm-code-bg);">examples/verified/</code>. Feature cards describe the full FastX stack after <code class="text-sm px-1 rounded" style="background: var(--fm-code-bg);">fastx generate</code>.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <div class="flex items-center gap-2 px-4 py-3 border-b" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">home_function_style.py</span>
            </div>
            <div class="p-6 overflow-x-auto">
              <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code class="language-python" data-fm-no-shiki="1">${writeLessCode}</code></pre>
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
      description: 'Automatically generate GraphQL schemas and resolvers from FastAPI REST endpoints.'
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
            Why <span style="color: var(--fm-text-secondary);">FastX?</span>
          </h2>
          <p class="text-lg" style="color: var(--fm-text-muted);">
            See how FastX compares to other frameworks
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
                <th class="pb-4 pt-4 px-6 text-center font-semibold" style="color: var(--fm-text);">FastX</th>
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
              Get started with FastX in minutes. Join thousands of developers building production-grade applications.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" onclick="showPage('docs'); loadDocSection('tutorial-overview'); return false;" class="px-8 py-4 font-semibold rounded-xl transition-colors flex items-center gap-2" style="background-color: var(--fm-text); color: var(--fm-bg);">
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
    // Getting Started
    { section: 'tutorial-overview', title: '🎓 Tutorial Series', icon: 'graduation-cap', category: 'start' },
    { section: 'introduction', title: 'Introduction', icon: 'book-open', category: 'start' },
    { section: 'installation', title: 'Installation', icon: 'download', category: 'start' },
    { section: 'project-layout', title: 'Project Layout', icon: 'layers', category: 'start' },
    { section: 'cli-reference', title: 'CLI Reference', icon: 'terminal', category: 'start' },
    
    { type: 'divider' },
    
    // Core Concepts
    { section: 'configuration', title: 'Configuration', icon: 'settings', category: 'core' },
    { section: 'http-api', title: 'HTTP & API', icon: 'webhook', category: 'core' },
    { section: 'persistence', title: 'Persistence', icon: 'database', category: 'core' },
    { section: 'security', title: 'Security', icon: 'shield', category: 'core' },
    { section: 'testing', title: 'Testing', icon: 'flask-conical', category: 'core' },
    { section: 'production', title: 'Production', icon: 'rocket', category: 'core' },
    { section: 'troubleshooting', title: 'Troubleshooting', icon: 'life-buoy', category: 'core' },
    
    { type: 'divider' },
    
    // Features
    { section: 'smart-caching', title: 'Smart Caching', icon: 'zap', category: 'features' },
    { section: 'nplus1-detection', title: 'N+1 Detection', icon: 'search', category: 'features' },
    { section: 'distributed-tracing', title: 'Distributed Tracing', icon: 'activity', category: 'features' },
    { section: 'field-encryption', title: 'Field Encryption', icon: 'lock', category: 'features' },
    { section: 'graphql-automation', title: 'GraphQL Auto-Gen', icon: 'git-branch', category: 'features' },
    { section: 'hot-config-reload', title: 'Hot Config Reload', icon: 'refresh-cw', category: 'features' },
    { section: 'saga-pattern', title: 'Saga Pattern', icon: 'repeat', category: 'features' },
    { section: 'time-travel-debugging', title: 'Time-Travel Debug', icon: 'clock', category: 'features' },
    
    { type: 'divider' },
    
    // Advanced
    { section: 'api-reference', title: 'API Reference', icon: 'code', category: 'advanced' },
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
          <aside class="hidden lg:block w-72 flex-shrink-0">
            <div class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <!-- Search box -->
              <div class="mb-6">
                <div class="relative">
                  <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--fm-text-muted);"></i>
                  <input 
                    type="text" 
                    placeholder="Search docs..." 
                    class="w-full pl-10 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2"
                    style="background-color: var(--fm-surface); border-color: var(--fm-border); color: var(--fm-text);"
                    onfocus="this.style.borderColor='var(--fm-primary)'; this.style.ring='1px'"
                    onblur="this.style.borderColor='var(--fm-border)'"
                  >
                </div>
              </div>
              
              <nav class="space-y-1">
                ${navList}
              </nav>
              
              <!-- Quick links -->
              <div class="mt-8 pt-6" style="border-top: 1px solid var(--fm-border);">
                <h3 class="px-4 text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--fm-text-muted);">Resources</h3>
                <div class="space-y-1">
                  <a href="#" data-section="migration-overview" class="doc-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors" style="color: var(--fm-text-muted);">
                    <i data-lucide="arrow-right-left" class="w-4 h-4"></i>
                    Migration Guides
                  </a>
                  <a href="#" data-section="best-practices" class="doc-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors" style="color: var(--fm-text-muted);">
                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                    Best Practices
                  </a>
                  <a href="#" data-section="glossary" class="doc-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors" style="color: var(--fm-text-muted);">
                    <i data-lucide="book-text" class="w-4 h-4"></i>
                    Glossary
                  </a>
                  <a href="#" data-section="error-reference" class="doc-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors" style="color: var(--fm-text-muted);">
                    <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                    Error Reference
                  </a>
                </div>
              </div>
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

// Code highlighting — Python only; safe pipeline (no regex over generated HTML attributes).
const FM_PH = '\uE000';

function escapeHtmlForCode(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPythonSource(source) {
  let html = escapeHtmlForCode(source);
  const stash = [];

  const push = (wrapped) => {
    stash.push(wrapped);
    return `${FM_PH}${stash.length - 1}${FM_PH}`;
  };

  // 1–3: stash strings, comments, decorators (order avoids # inside strings)
  html = html.replace(/"(?:[^"\\]|\\.)*"/g, (m) => push(`<span class="fm-code-str">${m}</span>`));
  html = html.replace(/'(?:[^'\\]|\\.)*'/g, (m) => push(`<span class="fm-code-str">${m}</span>`));
  html = html.replace(/#[^\n]*/g, (m) => push(`<span class="fm-code-comment">${m}</span>`));
  html = html.replace(/@[a-zA-Z_][a-zA-Z0-9_.]*/g, (m) => push(`<span class="fm-code-decorator">${m}</span>`));

  // 4–5: keywords & calls only on placeholder-safe text (no class="…" yet)
  html = html.replace(
    /\b(from|import|async|def|return|await|class|if|else|elif|try|except|finally|with|as|for|in|is|not|and|or|pass|raise|lambda|None|True|False)\b/g,
    '<span class="fm-code-keyword">$1</span>'
  );
  html = html.replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="fm-code-func">$1</span>');

  html = html.replace(new RegExp(`${FM_PH}(\\d+)${FM_PH}`, 'g'), (_, i) => stash[parseInt(i, 10)]);
  return html;
}

// Code highlighting
export function highlightCode() {
  document.querySelectorAll('pre code.language-python').forEach((block) => {
    if (block.hasAttribute('data-fm-no-shiki')) return;
    if (block.children.length > 0) {
      return;
    }
    const src = block.textContent;
    if (!src || !src.trim()) {
      return;
    }
    block.innerHTML = highlightPythonSource(src);
  });
}

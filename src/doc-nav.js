/** Docs sidebar navigation + layout (single source for search index + UI). */

export const DOC_NAV_ITEMS = [
  { section: 'introduction', title: 'Introduction', icon: 'book-open', category: 'tutorial' },
  { section: 'installation', title: 'Installation', icon: 'download', category: 'tutorial' },
  { section: 'quickstart', title: 'Quickstart (5 min)', icon: 'zap', category: 'tutorial' },
  { type: 'divider' },
  { section: 'example-ecommerce', title: 'Example: E-Commerce', icon: 'shopping-cart', category: 'tutorial' },
  { section: 'example-blog', title: 'Example: Blog', icon: 'file-text', category: 'tutorial' },
  { type: 'divider' },
  { section: 'framework-overview', title: 'Framework Overview', icon: 'layout', category: 'reference' },
  { section: 'core-abstractions', title: 'Core Abstractions', icon: 'component', category: 'reference' },
  { section: 'request-lifecycle', title: 'Request Lifecycle', icon: 'refresh-ccw', category: 'reference' },
  { section: 'pattern-catalog', title: 'Pattern Catalog', icon: 'grid', category: 'reference' },
  { type: 'divider' },
  { section: 'ecosystem', title: 'Ecosystem overview', icon: 'boxes', category: 'ecosystem' },
  { section: 'pkg-fast-platform', title: 'fastx-platform', icon: 'server', category: 'ecosystem' },
  { section: 'pkg-fast-middleware', title: 'fastx-middleware', icon: 'shield', category: 'ecosystem' },
  { section: 'pkg-fast-database', title: 'fastx-database', icon: 'database', category: 'ecosystem' },
  { section: 'pkg-fast-dashboards', title: 'fastx-dashboards', icon: 'layout-dashboard', category: 'ecosystem' },
  { section: 'pkg-fast-channels', title: 'fastx-channels', icon: 'radio', category: 'ecosystem' },
  { section: 'pkg-fast-mvc', title: 'fastx-mvc (CLI)', icon: 'terminal', category: 'ecosystem' },
  { type: 'divider' },
  { section: 'project-layout', title: 'Project layout', icon: 'layers', category: 'reference' },
  { section: 'tutorial-overview', title: 'Tutorial series', icon: 'graduation-cap', category: 'tutorial' },
  { section: 'tutorial-part-1', title: 'Part 1: Your First Fast API', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-2', title: 'Part 2: Models & Persistence', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-3', title: 'Part 3: REST API & Validation', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-4', title: 'Part 4: Auth & Security', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-5', title: 'Part 5: Advanced Features', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-6', title: 'Part 6: Testing & Quality', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-7', title: 'Part 7: Production Deploy', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-8', title: 'Part 8: Real-time & GraphQL', icon: 'chevron-right', category: 'tutorial' },
  { section: 'tutorial-part-9', title: 'Part 9: Enterprise Patterns', icon: 'chevron-right', category: 'tutorial' },
  { section: 'interactive-examples', title: 'Interactive examples', icon: 'play-circle', category: 'tutorial' },
  { section: 'fast-playground', title: 'Fast Playground', icon: 'sparkles', category: 'tutorial' },
  { section: 'video-integration', title: 'Video integration', icon: 'video', category: 'tutorial' },
  { type: 'divider' },
  { section: 'topic-guides', title: 'Topic guides', icon: 'library', category: 'how-to' },
  { section: 'topic-async', title: 'Understanding Async', icon: 'cpu', category: 'how-to' },
  { section: 'topic-dependency-injection', title: 'Dependency Injection', icon: 'plug-2', category: 'how-to' },
  { section: 'topic-caching-strategies', title: 'Caching Strategies', icon: 'zap', category: 'how-to' },
  { section: 'how-to-guides', title: 'How-to guides', icon: 'compass', category: 'how-to' },
  { section: 'howto-oauth', title: 'OAuth2 Social Login', icon: 'lock', category: 'how-to' },
  { section: 'howto-rate-limiting', title: 'Tenant Rate Limiting', icon: 'gauge', category: 'how-to' },
  { section: 'howto-soft-delete', title: 'Soft Deletes', icon: 'trash-2', category: 'how-to' },
  { section: 'howto-fulltext-search', title: 'Full-Text Search', icon: 'search', category: 'how-to' },
  { section: 'howto-file-uploads', title: 'S3 File Uploads', icon: 'upload-cloud', category: 'how-to' },
  { section: 'simplified-guide', title: 'Simplified Usage', icon: 'feather', category: 'reference' },
  { section: 'best-practices', title: 'Best practices & patterns', icon: 'layout-template', category: 'reference' },
  { section: 'glossary', title: 'Glossary & concepts', icon: 'list-ordered', category: 'reference' },
  { section: 'migration-guides', title: 'Migration guides', icon: 'arrow-right-left', category: 'how-to' },
  { section: 'cli-tool', title: 'CLI Tool', icon: 'terminal', category: 'reference' },
  { section: 'cli-reference', title: 'CLI reference', icon: 'terminal', category: 'reference' },
  { section: 'configuration', title: 'Configuration', icon: 'settings', category: 'reference' },
  { section: 'api', title: 'API', icon: 'plug', category: 'reference' },
  { section: 'http-api', title: 'HTTP & API', icon: 'webhook', category: 'reference' },
  { section: 'persistence', title: 'Persistence', icon: 'database', category: 'reference' },
  { section: 'security', title: 'Security', icon: 'shield', category: 'reference' },
  { section: 'testing', title: 'Testing', icon: 'flask-conical', category: 'reference' },
  { section: 'production', title: 'Production', icon: 'rocket', category: 'reference' },
  { section: 'benchmarks', title: 'Performance Benchmarks', icon: 'bar-chart', category: 'reference' },
  { section: 'performance-guide', title: 'Performance guide', icon: 'gauge', category: 'reference' },
  { section: 'troubleshooting', title: 'Troubleshooting', icon: 'life-buoy', category: 'how-to' },
  { section: 'error-reference', title: 'Error reference', icon: 'alert-circle', category: 'reference' },
  { section: 'smart-caching', title: 'Smart Caching', icon: 'zap', category: 'api' },
  { section: 'nplus1-detection', title: 'N+1 Detection', icon: 'search', category: 'api' },
  { section: 'distributed-tracing', title: 'Distributed Tracing', icon: 'activity', category: 'api' },
  { section: 'field-encryption', title: 'Field Encryption', icon: 'lock', category: 'api' },
  { section: 'graphql-automation', title: 'GraphQL Auto-Gen', icon: 'git-branch', category: 'api' },
  { section: 'hot-config-reload', title: 'Hot Config Reload', icon: 'refresh-cw', category: 'api' },
  { section: 'saga-pattern', title: 'Saga Pattern', icon: 'repeat', category: 'api' },
  { section: 'time-travel-debugging', title: 'Time-Travel Debug', icon: 'clock', category: 'api' },
  { section: 'websocket-channels', title: 'WebSocket Channels', icon: 'radio', category: 'api' },
  { section: 'health-probes', title: 'Health Probes', icon: 'heart-pulse', category: 'api' },
  { type: 'divider' },
  { section: 'guide-dev-server', title: 'Dev Server & Tunnels', icon: 'monitor', category: 'how-to' },
  { section: 'guide-sdk-generation', title: 'SDK Generation', icon: 'package', category: 'how-to' },
  { section: 'guide-deployment', title: 'Cloud Deployment', icon: 'cloud', category: 'how-to' },
  { type: 'divider' },
  { section: 'email-providers', title: 'Email Providers', icon: 'mail', category: 'api' },
  { section: 'cron-scheduler', title: 'Cron Scheduler', icon: 'timer', category: 'api' },
  { section: 'api-key-management', title: 'API Key Management', icon: 'key', category: 'api' },
  { section: 'request-profiler', title: 'Request Profiler', icon: 'gauge', category: 'api' },
  { section: 'webhook-receiver', title: 'Webhook Receiver', icon: 'webhook', category: 'api' },
  { section: 'cursor-pagination', title: 'Cursor Pagination', icon: 'list', category: 'api' },
  { section: 'bulk-operations', title: 'Bulk Operations', icon: 'layers', category: 'api' },
  { section: 'guide-testing', title: 'Testing & Linting', icon: 'flask-conical', category: 'how-to' },
  { section: 'guide-openapi-diff', title: 'OpenAPI Diff', icon: 'git-compare', category: 'how-to' },
  { type: 'divider' },
  { section: 'edge-functions', title: 'Edge Functions', icon: 'globe', category: 'api' },
  { section: 'geo-partitioning', title: 'Geo-Partitioning', icon: 'map', category: 'api' },
  { section: 'chaos-engineering', title: 'Chaos Engineering', icon: 'zap', category: 'api' },
  { section: 'cost-tracking', title: 'Cost Tracking', icon: 'dollar-sign', category: 'api' },
  { type: 'divider' },
  { section: 'community', title: 'Community', icon: 'users', category: 'how-to' },
  { section: 'changelog', title: 'Changelog', icon: 'scroll-text', category: 'reference' },
  { section: 'api-reference', title: 'API Reference', icon: 'code', category: 'reference' },
  { section: 'api-explorer', title: 'API Explorer', icon: 'radar', category: 'reference' },
];

export function createDocsPage() {
  const categories = {
    tutorial: { label: 'Getting Started', icon: 'graduation-cap' },
    ecosystem: { label: 'Monorepo Ecosystem', icon: 'boxes' },
    reference: { label: 'Reference & Concepts', icon: 'book' },
    how_to: { label: 'Guides & Recipes', icon: 'compass' },
    api: { label: 'Advanced Features', icon: 'sparkles' },
  };

  let currentCategory = null;
  const navList = DOC_NAV_ITEMS.map((item) => {
    if (item.type === 'divider') {
      return `<div class="my-4" style="border-top: 1px solid var(--fm-border);"></div>`;
    }

    let categoryHeader = '';
    const categoryKey = item.category?.replace('-', '_') || 'reference';
    if (categoryKey !== currentCategory) {
      currentCategory = categoryKey;
      const cat = categories[categoryKey] || { label: categoryKey };
      categoryHeader = `
        <div class="mt-6 mb-2 px-4 flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--fm-text-muted);">${cat.label}</span>
        </div>
      `;
    }

    const isSubPart = item.title.startsWith('Part ') || item.title.startsWith('Understanding ') || item.title.startsWith('OAuth2 ') || item.title.startsWith('Tenant ') || item.title.startsWith('Soft ') || item.title.startsWith('Full-Text ') || item.title.startsWith('S3 ');
    const indentation = isSubPart ? 'ml-4' : '';
    const iconColor = isSubPart ? 'opacity-40' : '';

    return `
      ${categoryHeader}
      <a href="#" data-section="${item.section}" class="doc-link flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all border-l-2 ${indentation}" style="color: var(--fm-text-muted); background-color: transparent; border-color: transparent;">
        <i data-lucide="${item.icon}" class="w-3.5 h-3.5 ${iconColor}"></i>
        ${item.title}
      </a>
    `;
  }).join('');

  return `
    <div class="pt-24 pb-12 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-8">
          <aside class="hidden lg:block w-64 flex-shrink-0">
            <div class="sticky top-24">
              <h2 class="text-xs font-semibold uppercase tracking-wider mb-4 px-4" style="color: var(--fm-text-muted);">Documentation</h2>
              <nav class="space-y-1">
                ${navList}
              </nav>
            </div>
          </aside>

          <div class="flex-1 min-w-0 flex flex-col gap-4">
            <div class="fm-docs-version-row flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
              <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--fm-text-muted);">Docs version</span>
              <div class="flex items-center gap-2 min-w-0">
                <label for="fm-docs-version-select" class="sr-only">Documentation version</label>
                <select id="fm-docs-version-select" class="fm-docs-version-select" aria-label="Documentation version"></select>
              </div>
            </div>
            <div id="doc-content" class="rounded-2xl border p-8 md:p-12" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/** Docs sidebar navigation + layout (single source for search index + UI). */

export const DOC_NAV_ITEMS = [
  { section: 'introduction', title: 'Introduction', icon: 'book-open', category: 'tutorial' },
  { section: 'installation', title: 'Installation', icon: 'download', category: 'tutorial' },
  { section: 'project-layout', title: 'Project layout', icon: 'layers', category: 'reference' },
  { section: 'tutorial-series', title: 'Tutorial series', icon: 'graduation-cap', category: 'tutorial' },
  { section: 'interactive-examples', title: 'Interactive examples', icon: 'play-circle', category: 'tutorial' },
  { section: 'fast-playground', title: 'Fast Playground', icon: 'sparkles', category: 'tutorial' },
  { section: 'video-integration', title: 'Video integration', icon: 'video', category: 'tutorial' },
  { section: 'topic-guides', title: 'Topic guides', icon: 'library', category: 'how-to' },
  { section: 'glossary', title: 'Glossary & concepts', icon: 'list-ordered', category: 'reference' },
  { section: 'how-to-guides', title: 'How-to guides', icon: 'compass', category: 'how-to' },
  { section: 'best-practices', title: 'Best practices & patterns', icon: 'layout-template', category: 'reference' },
  { section: 'migration-guides', title: 'Migration guides', icon: 'arrow-right-left', category: 'how-to' },
  { section: 'cli-reference', title: 'CLI reference', icon: 'terminal', category: 'reference' },
  { section: 'configuration', title: 'Configuration', icon: 'settings', category: 'reference' },
  { section: 'http-api', title: 'HTTP & API', icon: 'webhook', category: 'reference' },
  { section: 'persistence', title: 'Persistence', icon: 'database', category: 'reference' },
  { section: 'security', title: 'Security', icon: 'shield', category: 'reference' },
  { section: 'testing', title: 'Testing', icon: 'flask-conical', category: 'reference' },
  { section: 'production', title: 'Production', icon: 'rocket', category: 'reference' },
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
  const navList = DOC_NAV_ITEMS.map((item) => {
    if (item.type === 'divider') {
      return `<div class="my-4" style="border-top: 1px solid var(--fm-border);"></div>`;
    }
    return `
    <a href="#" data-section="${item.section}" class="doc-link flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all border-l-2" style="color: var(--fm-text-muted); background-color: transparent; border-color: transparent;">
      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
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

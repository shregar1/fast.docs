/** Docs version selector + per-page “since” / deprecation metadata (see Changelog). */

export const DOCS_VERSION_STORAGE_KEY = 'fast-docs-version';

export const DOCS_VERSION_OPTIONS = [
  { id: '0.4.0', label: '0.4.0 (latest)', isLatest: true },
  { id: '0.3.x', label: '0.3.x', isLatest: false },
  { id: '0.2.x', label: '0.2.x', isLatest: false },
  { id: 'dev', label: 'Dev (main branch)', isLatest: false, isDev: true },
];

/** When this page’s topic first appeared in docs / product line (display only). */
export const DOC_PAGE_SINCE = {
  introduction: '0.2.0',
  installation: '0.2.0',
  'project-layout': '0.3.0',
  'tutorial-series': '0.4.0',
  'interactive-examples': '0.4.0',
  'fast-playground': '0.4.0',
  'video-integration': '0.4.0',
  'topic-guides': '0.4.0',
  glossary: '0.4.0',
  'how-to-guides': '0.4.0',
  'best-practices': '0.4.0',
  'migration-guides': '0.4.0',
  'cli-reference': '0.3.0',
  configuration: '0.3.0',
  'http-api': '0.3.0',
  persistence: '0.3.0',
  security: '0.4.0',
  testing: '0.3.0',
  production: '0.4.0',
  'performance-guide': '0.4.0',
  troubleshooting: '0.4.0',
  'error-reference': '0.4.0',
  'smart-caching': '0.3.0',
  'nplus1-detection': '0.3.0',
  'distributed-tracing': '0.3.0',
  'field-encryption': '0.4.0',
  'graphql-automation': '0.4.0',
  'hot-config-reload': '0.3.0',
  'saga-pattern': '0.4.0',
  'time-travel-debugging': '0.4.0',
  'edge-functions': '0.4.0',
  'geo-partitioning': '0.4.0',
  'chaos-engineering': '0.4.0',
  'cost-tracking': '0.4.0',
  community: '0.4.0',
  changelog: '0.2.0',
  'api-reference': '0.3.0',
  'api-explorer': '0.4.0',
};

/**
 * Optional deprecation callout for a page (migration path = sidebar section id).
 * @type {Record<string, { title: string; since: string; body: string; migrationSection?: string }>}
 */
export const DOC_DEPRECATIONS = {
  'graphql-automation': {
    title: 'GraphQL surface still evolving',
    since: '0.4.0',
    body:
      'Auto-generated GraphQL types and resolver layout may change before 1.0. Pin versions in production and review release notes each upgrade.',
    migrationSection: 'changelog',
  },
};

export function getStoredVersion() {
  try {
    const v = localStorage.getItem(DOCS_VERSION_STORAGE_KEY);
    if (v && DOCS_VERSION_OPTIONS.some((o) => o.id === v)) return v;
  } catch {
    /* ignore */
  }
  return '0.4.0';
}

export function setStoredVersion(v) {
  try {
    localStorage.setItem(DOCS_VERSION_STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getVersionSelectOptionsHtml() {
  return DOCS_VERSION_OPTIONS.map(
    (o) => `<option value="${escapeHtml(o.id)}">${escapeHtml(o.label)}</option>`
  ).join('');
}

export function renderDocVersionBanner() {
  const id = getStoredVersion();
  const opt = DOCS_VERSION_OPTIONS.find((o) => o.id === id);
  if (!opt) return '';

  if (opt.isLatest) {
    return '';
  }

  if (opt.isDev) {
    return `
      <div class="fm-version-banner fm-version-banner--warning" role="status">
        <p class="fm-version-banner-text">
          <strong>Dev (main branch)</strong> — examples may include unreleased APIs. For production, follow
          <strong>0.4.0 (latest)</strong> on PyPI and use the matching docs version.
        </p>
        <button type="button" class="fm-version-banner-action" data-docs-version="0.4.0">View latest docs</button>
      </div>`;
  }

  return `
    <div class="fm-version-banner fm-version-banner--info" role="status">
      <p class="fm-version-banner-text">
        You are viewing the <strong>${escapeHtml(opt.label)}</strong> label. This site currently serves a single snapshot;
        cross-check with <strong>0.4.0 (latest)</strong> before upgrading production apps.
      </p>
      <button type="button" class="fm-version-banner-action" data-docs-version="0.4.0">Switch to latest</button>
    </div>`;
}

export function renderDocPageMeta(section) {
  const since = DOC_PAGE_SINCE[section];
  const dep = DOC_DEPRECATIONS[section];
  if (!since && !dep) return '';

  const parts = [];
  if (since) {
    parts.push(
      `<span class="fm-doc-since" title="Documented for this release line">Since v${escapeHtml(since)}</span>`
    );
  }
  if (dep) {
    const mig = dep.migrationSection
      ? `<a href="#" class="fm-internal-doc-link" data-section="${escapeHtml(dep.migrationSection)}">Migration &amp; changelog →</a>`
      : '';
    parts.push(`
      <aside class="fm-doc-deprecation" aria-label="Deprecation">
        <div class="fm-doc-deprecation-title">
          <span class="fm-doc-deprecation-badge">Deprecated pattern</span>
          <span class="fm-doc-deprecation-since">since v${escapeHtml(dep.since)}</span>
        </div>
        <p class="fm-doc-deprecation-h">${escapeHtml(dep.title)}</p>
        <p class="fm-doc-deprecation-body">${escapeHtml(dep.body)}</p>
        ${mig ? `<p class="fm-doc-deprecation-mig">${mig}</p>` : ''}
      </aside>`);
  }

  return `<div class="fm-doc-meta-bar not-prose">${parts.join('')}</div>`;
}

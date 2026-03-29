/**
 * Query-string routing for `fast docs <topic>` and shareable doc links.
 * @see content.js CLI reference — topic aliases
 */
export const DOC_SECTION_ALIASES = {
  caching: 'smart-caching',
  cache: 'smart-caching',
  deploy: 'production',
  production: 'production',
  prod: 'production',
  troubleshoot: 'troubleshooting',
  troubleshooting: 'troubleshooting',
  faq: 'troubleshooting',
  nplus1: 'nplus1-detection',
  'n-plus-one': 'nplus1-detection',
  n1: 'nplus1-detection',
  tracing: 'distributed-tracing',
  trace: 'distributed-tracing',
  otel: 'distributed-tracing',
  cli: 'cli-reference',
  config: 'configuration',
  configuration: 'configuration',
  http: 'http-api',
  api: 'http-api',
  persist: 'persistence',
  db: 'persistence',
  sql: 'persistence',
  security: 'security',
  auth: 'security',
  test: 'testing',
  testing: 'testing',
  perf: 'performance-guide',
  performance: 'performance-guide',
  errors: 'error-reference',
  glossary: 'glossary',
  terms: 'glossary',
  concepts: 'glossary',
  explorer: 'api-explorer',
  playground: 'api-explorer',
  'try-it': 'api-explorer',
  'fast-playground': 'fast-playground',
  wasm: 'fast-playground',
  pyodide: 'fast-playground',
};

/**
 * @param {string | null | undefined} raw
 * @param {(id: string) => boolean} hasSection — e.g. (id) => Boolean(content[id])
 */
export function resolveDocSection(raw, hasSection) {
  if (!raw || typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase().replace(/_/g, '-');
  if (hasSection(key)) return key;
  const mapped = DOC_SECTION_ALIASES[key];
  if (mapped && hasSection(mapped)) return mapped;
  return null;
}

/**
 * @returns {{ page: 'home' | 'docs' | 'playground' | 'architecture', section: string | null }}
 */
export function parseLocationSearch(search = window.location.search) {
  const params = new URLSearchParams(search);
  const pageRaw = (params.get('page') || params.get('p') || 'home').toLowerCase();
  let page = 'home';
  if (pageRaw === 'docs' || pageRaw === 'documentation') page = 'docs';
  else if (pageRaw === 'playground') page = 'playground';
  else if (pageRaw === 'architecture' || pageRaw === 'arch') page = 'architecture';

  const sectionRaw = params.get('section') || params.get('s') || params.get('topic');
  return { page, sectionRaw };
}

export function buildLocationSearch(page, section) {
  const params = new URLSearchParams();
  if (page && page !== 'home') params.set('page', page);
  if (page === 'docs' && section && section !== 'introduction') {
    params.set('section', section);
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

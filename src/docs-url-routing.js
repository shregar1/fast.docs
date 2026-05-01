/**
 * Query-string routing for `fastx docs <topic>` and shareable doc links.
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
  ecosystem: 'ecosystem',
  monorepo: 'ecosystem',
  packages: 'ecosystem',
  platform: 'pkg-fast-platform',
  'fast-platform': 'pkg-fast-platform',
  middleware: 'pkg-fast-middleware',
  'fast-middleware': 'pkg-fast-middleware',
  'fast-database': 'pkg-fast-database',
  dashboards: 'pkg-fast-dashboards',
  'fast-dashboards': 'pkg-fast-dashboards',
  channels: 'pkg-fast-channels',
  'fast-channels': 'pkg-fast-channels',
  websocket: 'pkg-fast-channels',
  mvc: 'pkg-fast-mvc',
  'fast-mvc': 'pkg-fast-mvc',
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
 * @returns {{ page: 'home' | 'docs' | 'playground' | 'architecture' | 'blog', sectionRaw: string | null, blogPostRaw: string | null }}
 */
export function parseLocationSearch(search = window.location.search) {
  const params = new URLSearchParams(search);
  const pageRaw = (params.get('page') || params.get('p') || 'home').toLowerCase();
  let page = 'home';
  if (pageRaw === 'docs' || pageRaw === 'documentation') page = 'docs';
  else if (pageRaw === 'playground') page = 'playground';
  else if (pageRaw === 'architecture' || pageRaw === 'arch') page = 'architecture';
  else if (pageRaw === 'blog') page = 'blog';
  else if (pageRaw === 'community') page = 'community';

  const sectionRaw = params.get('section') || params.get('s') || params.get('topic');
  const blogPostRaw = params.get('post') || params.get('article');
  return { page, sectionRaw, blogPostRaw };
}

/**
 * @param {string | null | undefined} blogPost — slug when page is blog
 */
export function buildLocationSearch(page, section, blogPost) {
  const params = new URLSearchParams();
  if (page === 'community') {
    params.set('page', 'community');
    const q = params.toString();
    return q ? `?${q}` : '';
  }
  if (page && page !== 'home') params.set('page', page);
  if (page === 'docs' && section && section !== 'introduction') {
    params.set('section', section);
  }
  if (page === 'blog' && blogPost) {
    params.set('post', blogPost);
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

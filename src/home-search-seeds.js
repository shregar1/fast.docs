/** Static copy for home-page search (command palette “global” scope). */

export const HOME_SEARCH_SEEDS = [
  {
    section: 'home:features',
    title: 'Core Features',
    category: 'home',
    body:
      'Smart caching N+1 detection distributed tracing field encryption GraphQL hot reload saga time-travel ship faster enterprise',
  },
  {
    section: 'home:security-architecture',
    title: 'Security architecture',
    category: 'home',
    body:
      'Security layers middleware encryption authentication authorization OpenAPI field-level encryption tenant-aware hardening',
  },
  {
    section: 'home:ecosystem',
    title: 'Monorepo ecosystem',
    category: 'home',
    body:
      'fast-platform fast-middleware fast-database fast-dashboards fast-mvc CLI packages infrastructure persistence observability',
  },
  {
    section: 'home:write-less',
    title: 'Write Less, Do More',
    category: 'home',
    body:
      'FastAPI sample verified examples controllers dependency injection runnable quickstart',
  },
  {
    section: 'home:comparison',
    title: 'Framework comparison',
    category: 'home',
    body:
      'Django FastAPI NestJS feature matrix comparison smart cache tracing',
  },
];

/** Anchor id on the page for scroll (matches `id` attributes in sections.js). */
export function homeSectionToAnchorId(sectionKey) {
  if (!sectionKey.startsWith('home:')) return null;
  return sectionKey.slice(5);
}

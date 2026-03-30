import { content } from '../content.js';
import { buildLocationSearch } from '../docs-url-routing.js';
import { applySeo } from '../seo-meta.js';

/** Single source for SPA route state (synced with URL + SEO). */
export const routeState = {
  docSection: 'introduction',
  page: 'home',
  /** @type {string | null} */
  blogPost: null,
};

export function hasDocSection(id) {
  return Boolean(content[id]);
}

export function syncDocsUrl() {
  const search = buildLocationSearch(routeState.page, routeState.docSection, routeState.blogPost);
  const url = `${window.location.pathname}${search}`;
  if (`${window.location.pathname}${window.location.search}` !== url) {
    window.history.replaceState(null, '', url);
  }
}

export function syncSeoFromRouteState() {
  applySeo({
    page: routeState.page,
    docSection: routeState.docSection,
    blogPost: routeState.blogPost,
  });
}

/** Site-wide SEO constants. Build-time URL fallback lives in `scripts/site-url.mjs` (Vite + sitemap). */

export const SITE_NAME = 'Fast';
export const SITE_NAME_FULL = 'Fast — FastAPI framework documentation';

export const DEFAULT_DESCRIPTION =
  'Fast: production-grade FastAPI framework with smart caching, N+1 detection, distributed tracing, field encryption, GraphQL automation, tutorials, and open-source docs.';

export const DEFAULT_KEYWORDS =
  'FastAPI, Python, Fast framework, web framework, API, OpenAPI, SQLAlchemy, observability, caching, documentation';

/** Optional — set VITE_TWITTER_SITE in .env for twitter:site */
export const TWITTER_SITE = import.meta.env.VITE_TWITTER_SITE || '';

/** Relative to origin — use a 1200×630 PNG in production for best social previews; SVG works for some crawlers */
export const DEFAULT_OG_IMAGE_PATH = '/assets/logo-standard-dark.svg';

export function getConfiguredSiteOrigin() {
  const raw = import.meta.env.VITE_SITE_URL;
  if (raw && typeof raw === 'string') return raw.replace(/\/$/, '');
  return '';
}

/**
 * Canonical site URL resolution for Vite (HTML injection + client define) and sitemap generation.
 * Netlify sets URL / DEPLOY_PRIME_URL at build time; optional override: VITE_SITE_URL in .env.
 */

export const SITE_URL_FALLBACK = 'https://fast-docs.netlify.app';

export function stripTrailingSlash(s) {
  return String(s || '').trim().replace(/\/$/, '');
}

/**
 * @param {Record<string, string>} env - from Vite loadEnv
 */
export function getSiteUrlFromEnv(env) {
  return stripTrailingSlash(
    env.VITE_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || ''
  );
}

/** index.html __SEO_SITE_URL__ replacement + dev preview */
export function resolveSiteUrlForHtml(mode, env) {
  const merged = getSiteUrlFromEnv(env);
  if (merged) return merged;
  if (mode === 'development') return 'http://localhost:3000';
  return SITE_URL_FALLBACK;
}

/** import.meta.env.VITE_SITE_URL in the client bundle */
export function resolveClientSiteUrl(env) {
  return getSiteUrlFromEnv(env);
}

/** dist/sitemap.xml + robots.txt */
export function resolveSiteUrlForSitemap(env) {
  const merged = getSiteUrlFromEnv(env);
  if (merged) return merged;
  console.warn('[sitemap] No VITE_SITE_URL or Netlify URL; using placeholder:', SITE_URL_FALLBACK);
  return SITE_URL_FALLBACK;
}

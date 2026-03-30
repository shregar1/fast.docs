/**
 * Post-build: writes dist/sitemap.xml + dist/robots.txt from doc nav + blog index.
 * Set VITE_SITE_URL in .env.production or Netlify env for your canonical domain.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

if (!existsSync(dist)) {
  console.warn('[sitemap] dist/ missing — run `vite build` first.');
  process.exit(0);
}

const env = loadEnv('production', root, '');
let siteUrl = (
  (env.VITE_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || '').trim().replace(/\/$/, '')
);
if (!siteUrl) {
  siteUrl = 'https://fast-docs.netlify.app';
  console.warn('[sitemap] No VITE_SITE_URL or Netlify URL; using placeholder:', siteUrl);
}

/** XML-safe absolute URL (escape & in query strings). */
function toLoc(pathWithLeadingSlash) {
  const path = pathWithLeadingSlash.startsWith('/') ? pathWithLeadingSlash : `/${pathWithLeadingSlash}`;
  return `${siteUrl}${path}`.replace(/&/g, '&amp;');
}

const entries = [];

entries.push({ loc: toLoc('/'), changefreq: 'weekly', priority: '1.0' });
entries.push({ loc: toLoc('/?page=docs'), changefreq: 'weekly', priority: '0.95' });
entries.push({ loc: toLoc('/?page=playground'), changefreq: 'monthly', priority: '0.7' });
entries.push({ loc: toLoc('/?page=architecture'), changefreq: 'monthly', priority: '0.75' });
entries.push({ loc: toLoc('/?page=community'), changefreq: 'monthly', priority: '0.7' });
entries.push({ loc: toLoc('/?page=blog'), changefreq: 'weekly', priority: '0.85' });

const { DOC_NAV_ITEMS } = await import('../src/doc-nav.js');
for (const item of DOC_NAV_ITEMS) {
  if (!item.section || item.section === 'introduction') continue;
  entries.push({
    loc: toLoc(`/?page=docs&section=${encodeURIComponent(item.section)}`),
    changefreq: 'weekly',
    priority: '0.8',
  });
}

const { BLOG_INDEX } = await import('../src/blog/blog-posts.js');
for (const post of BLOG_INDEX) {
  entries.push({
    loc: toLoc(`/?page=blog&post=${encodeURIComponent(post.slug)}`),
    changefreq: 'monthly',
    priority: '0.75',
  });
}

const body = entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(resolve(dist, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve(dist, 'robots.txt'), robots, 'utf8');
console.log('[sitemap] wrote dist/sitemap.xml and dist/robots.txt');

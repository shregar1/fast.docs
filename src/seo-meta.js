/**
 * Client-side SEO: title, description, canonical, Open Graph, Twitter, JSON-LD.
 * Keeps meta aligned with SPA routes (docs sections, blog posts).
 */
import { DOC_NAV_ITEMS } from './doc-nav.js';
import { BLOG_INDEX } from './blog/blog-posts.js';
import {
  SITE_NAME,
  SITE_NAME_FULL,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  TWITTER_SITE,
  DEFAULT_OG_IMAGE_PATH,
  getConfiguredSiteOrigin,
} from './seo-config.js';

const docTitleBySection = new Map();
for (const item of DOC_NAV_ITEMS) {
  if (item.section) docTitleBySection.set(item.section, item.title);
}

const PAGE_DESCRIPTIONS = {
  home: DEFAULT_DESCRIPTION,
  docs: 'Browse Fast documentation: tutorials, ecosystem packages, API reference, how-tos, and advanced features.',
  playground: 'Try Fast patterns in the browser playground — interactive examples aligned with the docs.',
  architecture: 'Architecture of the Fast framework and monorepo: layers, request flow, and how packages fit together.',
  community: 'Fast open-source community: contributing, code of conduct, and how to participate in the ecosystem.',
  blog: 'Articles on the Fast ecosystem: fast-platform, middleware, database, dashboards, CLI, caching, and observability.',
};

const PAGE_OG_TYPES = {
  home: 'website',
  docs: 'article',
  playground: 'website',
  architecture: 'article',
  community: 'website',
  blog: 'website',
};

function setMetaName(name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setHreflang(href) {
  let link = document.head.querySelector('link[rel="alternate"][hreflang="en"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'en');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function absoluteUrl(pathOrUrl) {
  const configured = getConfiguredSiteOrigin();
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin =
    configured ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  if (!origin) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

function currentCanonicalHref() {
  if (typeof window === 'undefined') return '';
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}`;
}

function stripArticleMeta() {
  document.head.querySelectorAll('meta[property^="article:"]').forEach((el) => el.remove());
}

function setJsonLd(data) {
  let script = document.getElementById('fm-seo-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'fm-seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function buildWebSiteSchema(origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_NAME_FULL,
    url: origin || undefined,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: origin || undefined,
    },
  };
}

function buildSoftwareApplicationSchema(origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: origin || undefined,
  };
}

/**
 * @param {{ page: string; docSection?: string; blogPost?: string | null }} state
 */
export function applySeo(state) {
  stripArticleMeta();

  const { page, docSection, blogPost } = state;
  const origin =
    getConfiguredSiteOrigin() ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const canonical = currentCanonicalHref();

  let title = SITE_NAME_FULL;
  let description = PAGE_DESCRIPTIONS[page] || DEFAULT_DESCRIPTION;
  let ogType = PAGE_OG_TYPES[page] || 'website';
  const imageUrl = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  if (page === 'docs' && docSection) {
    const navTitle = docTitleBySection.get(docSection) || docSection;
    title = `${navTitle} | ${SITE_NAME} Docs`;
    description = `${navTitle} — ${SITE_NAME} documentation. ${DEFAULT_DESCRIPTION.slice(0, 140)}…`;
    ogType = 'article';
  } else if (page === 'playground') {
    title = `Playground | ${SITE_NAME}`;
  } else if (page === 'architecture') {
    title = `Architecture | ${SITE_NAME}`;
  } else if (page === 'community') {
    title = `Community & open source | ${SITE_NAME}`;
  } else if (page === 'blog') {
    if (blogPost) {
      const meta = BLOG_INDEX.find((p) => p.slug === blogPost);
      if (meta) {
        title = `${meta.title} | ${SITE_NAME} Blog`;
        description = meta.excerpt || description;
        ogType = 'article';
        setMetaProperty('article:published_time', `${meta.date}T12:00:00.000Z`);
        setMetaProperty('article:section', meta.tag || 'Blog');
      } else {
        title = `Blog | ${SITE_NAME}`;
      }
    } else {
      title = `Blog | ${SITE_NAME}`;
    }
  } else if (page === 'home') {
    title = `${SITE_NAME} — Production-grade FastAPI framework`;
  }

  document.title = title;

  setMetaName('description', description);
  setMetaName('keywords', DEFAULT_KEYWORDS);
  setMetaName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  setCanonical(canonical);
  setHreflang(canonical);

  setMetaProperty('og:type', ogType);
  setMetaProperty('og:site_name', SITE_NAME);
  setMetaProperty('og:title', title);
  setMetaProperty('og:description', description);
  setMetaProperty('og:url', canonical);
  setMetaProperty('og:image', imageUrl);
  setMetaProperty('og:image:alt', `${SITE_NAME} logo`);
  setMetaProperty('og:locale', 'en_US');

  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', title);
  setMetaName('twitter:description', description);
  setMetaName('twitter:image', imageUrl);
  if (TWITTER_SITE) setMetaName('twitter:site', TWITTER_SITE);

  const graph = [buildWebSiteSchema(origin), buildSoftwareApplicationSchema(origin)];

  if (page === 'blog' && blogPost) {
    const meta = BLOG_INDEX.find((p) => p.slug === blogPost);
    if (meta) {
      graph.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.excerpt,
        datePublished: `${meta.date}T12:00:00.000Z`,
        url: canonical,
        image: imageUrl,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      });
    }
  }

  if (page === 'docs' && docSection) {
    const navTitle = docTitleBySection.get(docSection) || docSection;
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: navTitle,
      description,
      url: canonical,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: origin },
    });
  }

  setJsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

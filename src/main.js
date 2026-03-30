import { marked } from 'marked';
import { content } from './content.js';
import { createDocsPage } from './doc-nav.js';
import {
  createHeroSection,
  createHomeWriteLessSection,
  createComparisonTable,
  createCTASection,
  createFeaturesGrid,
  createSecurityArchitectureTeaser,
  createMonorepoSection,
  WRITE_LESS_CODE_FUNCTION,
  WRITE_LESS_CODE_CLASS,
} from './components/home/sections.js';
import { createArchitecturePage } from './components/home/architecture-section.js';
import { createCommunityOsPage } from './community-os-page.js';
import { initCommandPalette } from './command-palette.js';
import {
  getStoredVersion,
  setStoredVersion,
  DOCS_VERSION_OPTIONS,
  getVersionSelectOptionsHtml,
  renderDocVersionBanner,
  renderDocPageMeta,
} from './doc-versions.js';
import { highlightCode } from './highlight-python.js';
import { P2_SECTIONS } from './p2-content/index.js';
import { initTheme } from './theme.js';
import { mountPlaygroundPage } from './components/playground/playground-page.js';
import { parseLocationSearch, resolveDocSection, buildLocationSearch } from './docs-url-routing.js';
import { createBlogPageList, createBlogArticlePage } from './blog/blog-page.js';
import { isValidBlogSlug } from './blog/blog-posts.js';
import { mountApiExplorerEmbed } from './api-explorer-embed.js';
import { dismissAppSplash } from './splash-screen.js';
import {
  addHeadingIdsFromMarkdown,
  extractTocFromMarkdown,
  shouldShowDocToc,
  renderDocTocHtml,
} from './doc-toc.js';
import { enhanceDocCodeBlocks } from './doc-code-blocks.js';

Object.assign(content, P2_SECTIONS);

/** Turn bare `[label](section-id)` hrefs from marked into in-app doc navigation. */
function rewriteInternalDocLinks(html) {
  return html.replace(/<a href="([^"]+)">/g, (match, href) => {
    if (/^(https?:|mailto:|#|\/)/i.test(href)) return match;
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(href)) return match;
    if (!content[href]) return match;
    return `<a href="#" data-section="${href}" class="fm-internal-doc-link">`;
  });
}

initTheme();

const HOME_TRY_PREFIX =
  `# Fast — quickstart (run in your terminal, then use the Python below in your app)\n` +
  `pip install fastmvc-cli\n` +
  `fast generate my_app\n` +
  `cd my_app\n` +
  `fast run\n\n` +
  `# --- sample code ---\n`;

function showCopyToast(message) {
  let el = document.getElementById('fm-copy-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fm-copy-toast';
    el.className = 'fm-copy-toast hidden';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('hidden');
  clearTimeout(showCopyToast._t);
  showCopyToast._t = setTimeout(() => el.classList.add('hidden'), 2800);
}

window.copyHomeCodeRaw = (id) => {
  const el = document.getElementById(`home-code-${id}`);
  if (!el) return;
  const text = (el.textContent || '').trim();
  navigator.clipboard.writeText(text).then(
    () => showCopyToast('Copied to clipboard'),
    () => showCopyToast('Copy failed')
  );
};

window.copyHomeCodeTry = (id) => {
  const el = document.getElementById(`home-code-${id}`);
  if (!el) return;
  const text = (el.textContent || '').trim();
  navigator.clipboard.writeText(HOME_TRY_PREFIX + text).then(
    () => showCopyToast('Try-it template copied'),
    () => showCopyToast('Copy failed')
  );
};

const HOME_CONTROLLER_SNIPPETS = {
  main: { function: WRITE_LESS_CODE_FUNCTION, class: WRITE_LESS_CODE_CLASS },
};

window.setHomeCodeControllerMode = (codeId, mode) => {
  const pair = HOME_CONTROLLER_SNIPPETS[codeId];
  if (!pair) return;
  const el = document.getElementById(`home-code-${codeId}`);
  if (!el) return;
  const src = mode === 'class' ? pair.class : pair.function;
  el.textContent = src;
  delete el.dataset.fmPyHighlight;
  document.querySelectorAll(`[data-fm-ctrl-block="${codeId}"]`).forEach((btn) => {
    btn.classList.toggle('fm-hero-ctrl-tab-active', btn.dataset.fmCtrlMode === mode);
  });
  applyPythonHighlight();
};

/** Run after DOM updates; second pass catches any race with layout/paint. */
async function applyPythonHighlight() {
  await highlightCode();
  requestAnimationFrame(async () => {
    await highlightCode();
  });
}

function refreshLucideIcons() {
  setTimeout(() => lucide.createIcons(), 100);
}

/** Icons in static HTML (nav, footer) — main content icons are hydrated after each render. */
lucide.createIcons();

let currentDocSection = 'introduction';
let currentPage = 'home';
/** @type {string | null} */
let currentBlogPost = null;

function hasDocSection(id) {
  return Boolean(content[id]);
}

function syncDocsUrl() {
  const search = buildLocationSearch(currentPage, currentDocSection, currentBlogPost);
  const url = `${window.location.pathname}${search}`;
  if (`${window.location.pathname}${window.location.search}` !== url) {
    window.history.replaceState(null, '', url);
  }
}

function initDocsVersionSelector() {
  const sel = document.getElementById('fm-docs-version-select');
  if (!sel) return;
  sel.innerHTML = getVersionSelectOptionsHtml();
  sel.value = getStoredVersion();
  if (!DOCS_VERSION_OPTIONS.some((o) => o.id === sel.value)) {
    sel.value = '0.4.0';
    setStoredVersion('0.4.0');
  }
  sel.onchange = () => {
    setStoredVersion(sel.value);
    window.showDocSection(currentDocSection);
  };
}

document.body.addEventListener('click', (e) => {
  const docContent = document.getElementById('doc-content');
  if (!docContent?.contains(e.target)) return;

  const verBtn = e.target.closest('[data-docs-version]');
  if (verBtn) {
    e.preventDefault();
    const v = verBtn.getAttribute('data-docs-version');
    setStoredVersion(v);
    const sel = document.getElementById('fm-docs-version-select');
    if (sel) sel.value = v;
    window.showDocSection(currentDocSection);
    return;
  }

  const link = e.target.closest('a[data-section]');
  if (link && link.getAttribute('href') === '#') {
    e.preventDefault();
    window.showDocSection(link.dataset.section);
  }
});

const navKbdHint = document.getElementById('fm-nav-kbd-hint');
if (navKbdHint) {
  navKbdHint.textContent = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? '⌘K'
    : 'Ctrl+K';
}

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

window.hideMobileMenu = () => {
  mobileMenu.classList.add('hidden');
  mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  mobileMenuBtn?.setAttribute('aria-label', 'Open menu');
};

document.querySelector('.fm-skip-link')?.addEventListener('click', () => {
  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;
  requestAnimationFrame(() => {
    mainEl.focus({ preventScroll: true });
  });
});

initCommandPalette({ refreshLucideIcons });

function renderHomePage(container) {
  container.innerHTML = `
    ${createHeroSection()}
    ${createMonorepoSection()}
    ${createHomeWriteLessSection()}
    ${createFeaturesGrid()}
    ${createSecurityArchitectureTeaser()}
    ${createComparisonTable()}
    ${createCTASection()}
  `;
  applyPythonHighlight();
  refreshLucideIcons();
}

function renderArchitecturePage(container) {
  container.innerHTML = createArchitecturePage();
  applyPythonHighlight();
  refreshLucideIcons();
  void import('./home-mermaid.js').then((m) => m.initHomeArchitectureDiagrams());
}

function renderCommunityPage(container) {
  container.innerHTML = createCommunityOsPage();
  refreshLucideIcons();
}

function renderPlaygroundPage(container) {
  mountPlaygroundPage(container);
  refreshLucideIcons();
}

function renderDocsPage(container, initialSection) {
  container.innerHTML = createDocsPage();

  document.querySelectorAll('.doc-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.showDocSection(link.dataset.section);
    });
  });

  initDocsVersionSelector();
  const sec =
    initialSection && content[initialSection] ? initialSection : 'introduction';
  window.showDocSection(sec);
  refreshLucideIcons();
}

function wireBlogOpenHandlers(container) {
  container.querySelectorAll('.fm-blog-open').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = el.dataset.blogSlug;
      if (slug) window.showPage('blog', { blogPost: slug });
    });
  });
}

function renderBlogPage(container, postSlug) {
  currentBlogPost = postSlug && isValidBlogSlug(postSlug) ? postSlug : null;
  if (currentBlogPost) {
    container.innerHTML = createBlogArticlePage(
      currentBlogPost,
      rewriteInternalDocLinks,
      (md) => marked.parse(md)
    );
  } else {
    container.innerHTML = createBlogPageList();
    wireBlogOpenHandlers(container);
  }
  void applyPythonHighlight().then(() => {
    const prose = container.querySelector('.fm-blog-prose');
    if (prose) enhanceDocCodeBlocks(prose);
  });
  refreshLucideIcons();
}

window.showPage = (page, options = {}) => {
  const mainContent = document.getElementById('main-content');
  window.scrollTo(0, 0);

  if (!mainContent) return;

  if (page === 'docs') {
    currentPage = 'docs';
    currentBlogPost = null;
    renderDocsPage(mainContent, options.docSection);
  } else if (page === 'playground') {
    currentPage = 'playground';
    currentBlogPost = null;
    renderPlaygroundPage(mainContent);
    syncDocsUrl();
  } else if (page === 'architecture') {
    currentPage = 'architecture';
    currentBlogPost = null;
    currentDocSection = 'introduction';
    renderArchitecturePage(mainContent);
    syncDocsUrl();
  } else if (page === 'community') {
    currentPage = 'community';
    currentBlogPost = null;
    currentDocSection = 'introduction';
    renderCommunityPage(mainContent);
    syncDocsUrl();
  } else if (page === 'blog') {
    currentPage = 'blog';
    renderBlogPage(mainContent, options.blogPost);
    syncDocsUrl();
  } else {
    currentPage = 'home';
    currentBlogPost = null;
    currentDocSection = 'introduction';
    renderHomePage(mainContent);
    syncDocsUrl();
    if (options.scrollTo) {
      const id = options.scrollTo;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  refreshLucideIcons();
};

window.showDocSection = (section) => {
  currentDocSection = section;
  currentPage = 'docs';
  currentBlogPost = null;
  const contentArea = document.getElementById('doc-content');
  if (!contentArea || !content[section]) {
    return;
  }

  const sel = document.getElementById('fm-docs-version-select');
  if (sel) sel.value = getStoredVersion();

  const md = content[section];
  let html = marked.parse(md);
  html = addHeadingIdsFromMarkdown(html, md);
  const tocItems = extractTocFromMarkdown(md);
  const showToc = shouldShowDocToc(md) && tocItems.length >= 2;
  const tocAside = showToc
    ? `<aside class="fm-doc-toc-sidebar">${renderDocTocHtml(tocItems)}</aside>`
    : '';

  contentArea.innerHTML = `
      ${renderDocVersionBanner()}
      <div class="fm-doc-page-inner${showToc ? ' fm-doc-page-inner--with-toc' : ''}">
        ${tocAside}
        <div class="prose prose-lg max-w-none fm-doc-prose">
          ${renderDocPageMeta(section)}
          ${rewriteInternalDocLinks(html)}
        </div>
      </div>
    `;

  document.querySelectorAll('.doc-link').forEach((link) => {
    link.style.backgroundColor = '';
    link.style.color = 'var(--fm-text-muted)';
    link.style.borderColor = 'transparent';

    if (link.dataset.section === section) {
      link.style.backgroundColor = 'var(--fm-surface-raised)';
      link.style.color = 'var(--fm-text)';
      link.style.borderColor = 'var(--fm-border)';
    }
  });

  void applyPythonHighlight().then(() => {
    const prose = contentArea.querySelector('.fm-doc-prose');
    if (prose) enhanceDocCodeBlocks(prose);
  });
  contentArea.scrollTop = 0;

  if (section === 'api-explorer') {
    requestAnimationFrame(() => {
      const prose = contentArea.querySelector('.prose');
      if (prose) mountApiExplorerEmbed(prose);
    });
  }

  syncDocsUrl();
};

function applyRouteFromUrl() {
  if (typeof window !== 'undefined' && window.location.hash === '#architecture') {
    const path = window.location.pathname || '/';
    window.history.replaceState(null, '', `${path}?page=architecture`);
    window.showPage('architecture');
    return;
  }
  const { page, sectionRaw, blogPostRaw } = parseLocationSearch();
  const resolved = resolveDocSection(sectionRaw, hasDocSection);
  if (page === 'docs') {
    window.showPage('docs', { docSection: resolved || undefined });
  } else if (page === 'playground') {
    window.showPage('playground');
  } else if (page === 'architecture') {
    window.showPage('architecture');
  } else if (page === 'community') {
    window.showPage('community');
  } else if (page === 'blog') {
    const slug =
      blogPostRaw && isValidBlogSlug(blogPostRaw.trim()) ? blogPostRaw.trim() : undefined;
    window.showPage('blog', { blogPost: slug });
  } else {
    window.showPage('home');
  }
}

window.addEventListener('popstate', () => {
  applyRouteFromUrl();
});

applyRouteFromUrl();
dismissAppSplash();

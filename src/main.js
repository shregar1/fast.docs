import { marked } from 'marked';
import { content } from './content.js';
import { createDocsPage } from './doc-nav.js';
import {
  createHeroSection,
  createHomeWriteLessSection,
  createComparisonTable,
  createCTASection,
} from './components/home/sections.js';
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
import { mountApiExplorerEmbed } from './api-explorer-embed.js';

Object.assign(content, P2_SECTIONS);

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

/** Run after DOM updates; second pass catches any race with layout/paint. */
function applyPythonHighlight() {
  highlightCode();
  requestAnimationFrame(() => highlightCode());
}

function refreshLucideIcons() {
  setTimeout(() => lucide.createIcons(), 100);
}

/** Icons in static HTML (nav, footer) — main content icons are hydrated after each render. */
lucide.createIcons();

let currentDocSection = 'introduction';
let currentPage = 'home';

function hasDocSection(id) {
  return Boolean(content[id]);
}

function syncDocsUrl() {
  const search = buildLocationSearch(currentPage, currentDocSection);
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
});

window.hideMobileMenu = () => {
  mobileMenu.classList.add('hidden');
};

initCommandPalette({ refreshLucideIcons });

function renderHomePage(container) {
  container.innerHTML = `
    ${createHeroSection()}
    ${createHomeWriteLessSection()}
    ${createComparisonTable()}
    ${createCTASection()}
  `;
  applyPythonHighlight();
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

window.showPage = (page, options = {}) => {
  const mainContent = document.getElementById('main-content');
  window.scrollTo(0, 0);

  if (!mainContent) return;

  if (page === 'docs') {
    currentPage = 'docs';
    renderDocsPage(mainContent, options.docSection);
  } else if (page === 'playground') {
    currentPage = 'playground';
    renderPlaygroundPage(mainContent);
    syncDocsUrl();
  } else {
    currentPage = 'home';
    currentDocSection = 'introduction';
    renderHomePage(mainContent);
    syncDocsUrl();
  }

  refreshLucideIcons();
};

window.showDocSection = (section) => {
  currentDocSection = section;
  currentPage = 'docs';
  const contentArea = document.getElementById('doc-content');
  if (!contentArea || !content[section]) {
    return;
  }

  const sel = document.getElementById('fm-docs-version-select');
  if (sel) sel.value = getStoredVersion();

  contentArea.innerHTML = `
      ${renderDocVersionBanner()}
      <div class="prose prose-lg max-w-none">
        ${renderDocPageMeta(section)}
        ${marked.parse(content[section])}
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

  applyPythonHighlight();
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
  const { page, sectionRaw } = parseLocationSearch();
  const resolved = resolveDocSection(sectionRaw, hasDocSection);
  if (page === 'docs') {
    window.showPage('docs', { docSection: resolved || undefined });
  } else if (page === 'playground') {
    window.showPage('playground');
  } else {
    window.showPage('home');
  }
}

window.addEventListener('popstate', () => {
  applyRouteFromUrl();
});

applyRouteFromUrl();

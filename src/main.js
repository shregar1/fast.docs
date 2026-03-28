import { marked } from 'marked';
import {
  createHeroSection,
  createHomeWriteLessSection,
  createComparisonTable,
  createCTASection,
  createDocsPage,
  content,
} from './content.js';
import { searchDocuments, DOC_CATEGORY_LABELS } from './doc-search.js';
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

/* —— Command palette (⌘K / Ctrl+K): fuzzy doc search + category filters —— */
const paletteState = {
  filter: 'all',
  query: '',
  selectedIndex: 0,
};

let lastSearchResults = [];
let paletteRoot = null;

function isPaletteOpen() {
  const el = document.getElementById('fm-command-palette');
  return el && !el.classList.contains('hidden');
}

function ensureCommandPalette() {
  if (paletteRoot) return paletteRoot;
  const root = document.createElement('div');
  root.id = 'fm-command-palette';
  root.className = 'fm-command-palette hidden';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'fm-palette-title');
  root.innerHTML = `
    <div class="fm-command-palette-backdrop" data-close="1" aria-hidden="true"></div>
    <div class="fm-command-palette-panel">
      <h2 id="fm-palette-title" class="sr-only">Search documentation</h2>
      <div class="fm-command-palette-header">
        <i data-lucide="search" class="w-5 h-5 flex-shrink-0" style="color: var(--fm-text-muted);"></i>
        <input type="search" id="fm-palette-input" class="fm-command-palette-input" placeholder="Search documentation…" autocomplete="off" spellcheck="false" />
        <kbd id="fm-palette-kbd" class="fm-command-palette-kbd" aria-hidden="true"></kbd>
      </div>
      <div class="fm-command-palette-filters" id="fm-palette-filters"></div>
      <div class="fm-command-palette-results" id="fm-palette-results" role="listbox" aria-label="Results"></div>
      <div class="fm-command-palette-hint">↑↓ Navigate · ↵ Open · Esc Close</div>
    </div>
  `;
  document.body.appendChild(root);
  paletteRoot = root;

  const filtersEl = root.querySelector('#fm-palette-filters');
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'tutorial', label: 'Tutorial' },
    { id: 'reference', label: 'Reference' },
    { id: 'how-to', label: 'How-to' },
    { id: 'api', label: 'API' },
  ];
  filtersEl.innerHTML = filters
    .map(
      (f) =>
        `<button type="button" class="fm-palette-filter" data-filter="${f.id}" role="tab">${f.label}</button>`
    )
    .join('');

  const kbd = root.querySelector('#fm-palette-kbd');
  kbd.textContent = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘K' : 'Ctrl+K';

  root.querySelector('.fm-command-palette-backdrop').addEventListener('click', closeCommandPalette);

  const input = root.querySelector('#fm-palette-input');
  input.addEventListener('input', () => {
    paletteState.query = input.value;
    paletteState.selectedIndex = 0;
    renderPaletteResults();
  });

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    paletteState.filter = btn.dataset.filter;
    paletteState.selectedIndex = 0;
    updateFilterButtons();
    renderPaletteResults();
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      paletteMove(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      paletteMove(-1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      activatePaletteSelection();
    }
  });

  return root;
}

function updateFilterButtons() {
  const root = ensureCommandPalette();
  root.querySelectorAll('.fm-palette-filter').forEach((btn) => {
    const on = btn.dataset.filter === paletteState.filter;
    btn.classList.toggle('fm-palette-filter-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}

function paletteMove(delta) {
  const n = lastSearchResults.length;
  if (n === 0) return;
  paletteState.selectedIndex = (paletteState.selectedIndex + delta + n) % n;
  updatePaletteHighlight();
}

function updatePaletteHighlight() {
  const root = ensureCommandPalette();
  const items = root.querySelectorAll('.fm-palette-result');
  items.forEach((el, i) => {
    const active = i === paletteState.selectedIndex;
    el.classList.toggle('fm-palette-result-active', active);
    el.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  const activeEl = items[paletteState.selectedIndex];
  activeEl?.scrollIntoView({ block: 'nearest' });
}

function renderPaletteResults() {
  const root = ensureCommandPalette();
  lastSearchResults = searchDocuments(paletteState.query, paletteState.filter);
  if (paletteState.selectedIndex >= lastSearchResults.length) {
    paletteState.selectedIndex = Math.max(0, lastSearchResults.length - 1);
  }
  const resultsEl = root.querySelector('#fm-palette-results');
  if (lastSearchResults.length === 0) {
    resultsEl.innerHTML = `<div class="fm-palette-empty">No pages match. Try another keyword or category.</div>`;
    return;
  }
  resultsEl.innerHTML = lastSearchResults
    .map(
      (r, i) => `
    <button type="button" role="option" class="fm-palette-result${i === paletteState.selectedIndex ? ' fm-palette-result-active' : ''}" data-index="${i}" aria-selected="${i === paletteState.selectedIndex}">
      <div class="fm-palette-result-row">
        <span class="fm-palette-result-title">${escapeHtml(r.title)}</span>
        <span class="fm-palette-result-cat">${DOC_CATEGORY_LABELS[r.category] || r.category}</span>
      </div>
      <div class="fm-palette-result-preview">${escapeHtml(r.preview)}</div>
    </button>`
    )
    .join('');

  resultsEl.querySelectorAll('.fm-palette-result').forEach((btn) => {
    btn.addEventListener('click', () => {
      paletteState.selectedIndex = parseInt(btn.dataset.index, 10);
      activatePaletteSelection();
    });
    btn.addEventListener('mouseenter', () => {
      paletteState.selectedIndex = parseInt(btn.dataset.index, 10);
      updatePaletteHighlight();
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function activatePaletteSelection() {
  const r = lastSearchResults[paletteState.selectedIndex];
  if (!r) return;
  closeCommandPalette();
  window.showPage('docs');
  window.showDocSection(r.section);
}

function openCommandPalette() {
  const root = ensureCommandPalette();
  paletteState.filter = 'all';
  paletteState.query = '';
  paletteState.selectedIndex = 0;
  const input = root.querySelector('#fm-palette-input');
  input.value = '';
  root.classList.remove('hidden');
  document.body.classList.add('fm-palette-open');
  updateFilterButtons();
  renderPaletteResults();
  refreshLucideIcons();
  requestAnimationFrame(() => {
    input.focus();
  });
}

function closeCommandPalette() {
  const root = document.getElementById('fm-command-palette');
  if (!root) return;
  root.classList.add('hidden');
  document.body.classList.remove('fm-palette-open');
}

window.openSearchPalette = openCommandPalette;

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (isPaletteOpen()) closeCommandPalette();
    else openCommandPalette();
  }
});

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

function renderDocsPage(container) {
  container.innerHTML = createDocsPage();

  document.querySelectorAll('.doc-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.showDocSection(link.dataset.section);
    });
  });

  initDocsVersionSelector();
  window.showDocSection('introduction');
  refreshLucideIcons();
}

const PAGE_RENDERERS = {
  home: renderHomePage,
  docs: renderDocsPage,
};

window.showPage = (page) => {
  const mainContent = document.getElementById('main-content');
  window.scrollTo(0, 0);

  const render = PAGE_RENDERERS[page];
  if (render && mainContent) {
    render(mainContent);
  }

  refreshLucideIcons();
};

window.showDocSection = (section) => {
  currentDocSection = section;
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
};

renderHomePage(document.getElementById('main-content'));

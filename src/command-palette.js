import {
  searchDocuments,
  DOC_CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  SORT_LABELS,
} from './doc-search.js';
import { escapeHtml } from './utils/html.js';
import { homeSectionToAnchorId } from './home-search-seeds.js';

const paletteState = {
  filter: 'all',
  query: '',
  selectedIndex: 0,
  sortMode: 'relevance',
  difficultyFilter: 'all',
};

let lastSearchResults = [];
let paletteRoot = null;

function isPaletteOpen() {
  const el = document.getElementById('fm-command-palette');
  return el && !el.classList.contains('hidden');
}

function isTypingInField(target) {
  if (!target) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function initCommandPalette({ refreshLucideIcons }) {
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
      <div class="fm-command-palette-meta" id="fm-palette-meta"></div>
      <div class="fm-command-palette-results" id="fm-palette-results" role="listbox" aria-label="Results"></div>
      <div class="fm-command-palette-hint">/ Search · ↑↓ Navigate · ↵ Open · Esc Close</div>
    </div>
  `;
    document.body.appendChild(root);
    paletteRoot = root;

    const filtersEl = root.querySelector('#fm-palette-filters');
    const filters = [
      { id: 'all', label: 'All' },
      { id: 'home', label: 'Home' },
      { id: 'tutorial', label: 'Tutorial' },
      { id: 'ecosystem', label: 'Ecosystem' },
      { id: 'reference', label: 'Reference' },
      { id: 'how-to', label: 'How-to' },
      { id: 'api', label: 'API' },
      { id: 'blog', label: 'Blog' },
    ];
    filtersEl.innerHTML = filters
      .map(
        (f) =>
          `<button type="button" class="fm-palette-filter" data-filter="${f.id}" role="tab">${f.label}</button>`
      )
      .join('');

    const metaEl = root.querySelector('#fm-palette-meta');
    const sortIds = /** @type {const} */ (['relevance', 'newest', 'shortest', 'alpha']);
    const diffIds = /** @type {const} */ (['all', 'beginner', 'intermediate', 'advanced']);
    metaEl.innerHTML = `
      <div class="fm-palette-meta-row">
        <span class="fm-palette-meta-label">Sort</span>
        <div class="fm-palette-meta-btns" id="fm-palette-sort-btns">
          ${sortIds
            .map(
              (id) =>
                `<button type="button" class="fm-palette-meta-btn" data-sort="${id}" aria-pressed="false">${SORT_LABELS[id]}</button>`
            )
            .join('')}
        </div>
      </div>
      <div class="fm-palette-meta-row">
        <span class="fm-palette-meta-label">Level</span>
        <div class="fm-palette-meta-btns" id="fm-palette-diff-btns">
          ${diffIds
            .map(
              (id) =>
                `<button type="button" class="fm-palette-meta-btn" data-difficulty="${id}" aria-pressed="false">${id === 'all' ? 'Any' : DIFFICULTY_LABELS[id]}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

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

    metaEl.addEventListener('click', (e) => {
      const sortBtn = e.target.closest('[data-sort]');
      if (sortBtn) {
        paletteState.sortMode = sortBtn.dataset.sort;
        paletteState.selectedIndex = 0;
        updateMetaButtons();
        renderPaletteResults();
        return;
      }
      const diffBtn = e.target.closest('[data-difficulty]');
      if (diffBtn) {
        paletteState.difficultyFilter = diffBtn.dataset.difficulty;
        paletteState.selectedIndex = 0;
        updateMetaButtons();
        renderPaletteResults();
      }
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

  function updateMetaButtons() {
    const root = ensureCommandPalette();
    root.querySelectorAll('[data-sort]').forEach((btn) => {
      const on = btn.dataset.sort === paletteState.sortMode;
      btn.classList.toggle('fm-palette-meta-btn-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    root.querySelectorAll('[data-difficulty]').forEach((btn) => {
      const on = btn.dataset.difficulty === paletteState.difficultyFilter;
      btn.classList.toggle('fm-palette-meta-btn-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
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
    lastSearchResults = searchDocuments(
      paletteState.query,
      paletteState.filter,
      paletteState.difficultyFilter,
      paletteState.sortMode
    );
    if (paletteState.selectedIndex >= lastSearchResults.length) {
      paletteState.selectedIndex = Math.max(0, lastSearchResults.length - 1);
    }
    const resultsEl = root.querySelector('#fm-palette-results');
    if (lastSearchResults.length === 0) {
      resultsEl.innerHTML = `<div class="fm-palette-empty">No pages match. Try another keyword, category, or level.</div>`;
      return;
    }
    resultsEl.innerHTML = lastSearchResults
      .map(
        (r, i) => `
    <button type="button" role="option" class="fm-palette-result${i === paletteState.selectedIndex ? ' fm-palette-result-active' : ''}" data-index="${i}" aria-selected="${i === paletteState.selectedIndex}">
      <div class="fm-palette-result-row">
        <span class="fm-palette-result-title">${escapeHtml(r.title)}</span>
        <span class="fm-palette-result-badges">
          <span class="fm-palette-result-cat">${DOC_CATEGORY_LABELS[r.category] || r.category}</span>
          ${r.difficulty ? `<span class="fm-palette-result-diff">${DIFFICULTY_LABELS[r.difficulty]}</span>` : ''}
        </span>
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

  function activatePaletteSelection() {
    const r = lastSearchResults[paletteState.selectedIndex];
    if (!r) return;
    closeCommandPalette();
    if (r.section.startsWith('blog:')) {
      window.showPage('blog', { blogPost: r.section.slice(5) });
      return;
    }
    if (r.section === '__community__') {
      window.showPage('community');
      return;
    }
    if (r.section.startsWith('home:')) {
      const anchor = homeSectionToAnchorId(r.section);
      if (anchor) window.showPage('home', { scrollTo: anchor });
      else window.showPage('home');
      return;
    }
    window.showPage('docs');
    window.showDocSection(r.section);
  }

  function openCommandPalette() {
    const root = ensureCommandPalette();
    paletteState.filter = 'all';
    paletteState.query = '';
    paletteState.selectedIndex = 0;
    paletteState.sortMode = 'relevance';
    paletteState.difficultyFilter = 'all';
    const input = root.querySelector('#fm-palette-input');
    input.value = '';
    root.classList.remove('hidden');
    document.body.classList.add('fm-palette-open');
    updateFilterButtons();
    updateMetaButtons();
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

  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTypingInField(e.target)) return;
    if (isPaletteOpen()) return;
    e.preventDefault();
    openCommandPalette();
  });
}

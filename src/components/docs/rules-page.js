/**
 * Standalone API rules reference (same layout as the old public/rules.html).
 * Mounted from the SPA via `showPage('rules')`; not React — matches `createArchitecturePage` pattern.
 */
import rulesPageFragment from './rules-page-fragment.html?raw';

export function createRulesPage() {
  return `<div class="fm-rules-page">${rulesPageFragment}</div>`;
}

/** Wire in-page anchors + sidebar links into docs navigation. */
export function initRulesPage(root) {
  if (!root) return;

  root.addEventListener('click', (e) => {
    const open = e.target.closest('[data-rules-open-docs]');
    if (open) {
      e.preventDefault();
      const mode = open.getAttribute('data-rules-open-docs');
      if (mode === 'docs') {
        window.showPage('docs');
      } else if (mode === 'rules-doc') {
        window.showPage('docs', { docSection: 'rules' });
      }
    }
  });

  root.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

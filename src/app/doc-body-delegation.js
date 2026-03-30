import { setStoredVersion } from '../doc-versions.js';
import { routeState } from './route-state.js';
import { showDocSection } from './doc-section.js';

/** Clicks inside docs: version banner buttons + sidebar `data-section` links. */
export function initDocContentClickDelegation() {
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
      showDocSection(routeState.docSection);
      return;
    }

    const link = e.target.closest('a[data-section]');
    if (link && link.getAttribute('href') === '#') {
      e.preventDefault();
      showDocSection(link.dataset.section);
    }
  });
}

import {
  getStoredVersion,
  setStoredVersion,
  DOCS_VERSION_OPTIONS,
  getVersionSelectOptionsHtml,
} from '../doc-versions.js';
import { routeState } from './route-state.js';
import { showDocSection } from './doc-section.js';

export function initDocsVersionSelector() {
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
    showDocSection(routeState.docSection);
  };
}

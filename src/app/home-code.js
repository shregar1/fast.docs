import {
  WRITE_LESS_CODE_FUNCTION,
  WRITE_LESS_CODE_CLASS,
} from '../components/home/sections.js';
import { applyPythonHighlight } from './highlight-lucide.js';

export const HOME_TRY_PREFIX =
  `# FastX — quickstart (run in your terminal, then use the Python below in your app)\n` +
  `pip install fastx-cli\n` +
  `fastx generate my_app\n` +
  `cd my_app\n` +
  `fastx run\n\n` +
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

function copyHomeCodeById(id, mapText, successMessage) {
  const el = document.getElementById(`home-code-${id}`);
  if (!el) return;
  const text = mapText((el.textContent || '').trim());
  navigator.clipboard.writeText(text).then(
    () => showCopyToast(successMessage),
    () => showCopyToast('Copy failed')
  );
}

const HOME_CONTROLLER_SNIPPETS = {
  main: { function: WRITE_LESS_CODE_FUNCTION, class: WRITE_LESS_CODE_CLASS },
};

/** Exposes `copyHomeCodeRaw`, `copyHomeCodeTry`, `setHomeCodeControllerMode` on `window`. */
export function registerHomeCodeGlobals() {
  window.copyHomeCodeRaw = (id) => copyHomeCodeById(id, (t) => t, 'Copied to clipboard');
  window.copyHomeCodeTry = (id) =>
    copyHomeCodeById(id, (t) => HOME_TRY_PREFIX + t, 'Try-it template copied');

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
    void applyPythonHighlight();
  };
}

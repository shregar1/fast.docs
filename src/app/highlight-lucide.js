import { highlightCode } from '../highlight-python.js';

/** Run after DOM updates; second pass catches any race with layout/paint. */
export async function applyPythonHighlight() {
  await highlightCode();
  requestAnimationFrame(async () => {
    await highlightCode();
  });
}

export function refreshLucideIcons() {
  setTimeout(() => lucide.createIcons(), 100);
}

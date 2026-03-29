/**
 * Client-side Python highlighting for <pre><code class="language-python">.
 * Uses class-based colors (see style.css .fm-code-*) — never regex over inline styles.
 */

const FM_PH = '\uE000';

function escapeHtmlForCode(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPythonSource(source) {
  let html = escapeHtmlForCode(source);
  const stash = [];

  const push = (wrapped) => {
    stash.push(wrapped);
    return `${FM_PH}${stash.length - 1}${FM_PH}`;
  };

  html = html.replace(/"(?:[^"\\]|\\.)*"/g, (m) => push(`<span class="fm-code-str">${m}</span>`));
  html = html.replace(/'(?:[^'\\]|\\.)*'/g, (m) => push(`<span class="fm-code-str">${m}</span>`));
  html = html.replace(/#[^\n]*/g, (m) => push(`<span class="fm-code-comment">${m}</span>`));
  html = html.replace(/@[a-zA-Z_][a-zA-Z0-9_.]*/g, (m) => push(`<span class="fm-code-decorator">${m}</span>`));

  html = html.replace(
    /\b(from|import|async|def|return|await|class|self|if|else|elif|try|except|finally|with|as|for|in|is|not|and|or|pass|raise|lambda|None|True|False)\b/g,
    '<span class="fm-code-keyword">$1</span>'
  );
  html = html.replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="fm-code-func">$1</span>');

  html = html.replace(new RegExp(`${FM_PH}(\\d+)${FM_PH}`, 'g'), (_, i) => stash[parseInt(i, 10)]);
  return html;
}

function isPythonCodeBlock(code) {
  const c = code.getAttribute('class') || '';
  return (
    code.tagName === 'CODE' &&
    (code.classList.contains('language-python') || /\blanguage-python\b/.test(c) || /\bpython\b/.test(c))
  );
}

/**
 * Highlight plain-text Python blocks. Skips blocks that already ran or contain elements (pre-rendered HTML).
 * @param {ParentNode} [root] defaults to document
 */
export function highlightCode(root = document) {
  root.querySelectorAll('pre code').forEach((block) => {
    if (!isPythonCodeBlock(block)) {
      return;
    }
    if (block.dataset.fmPyHighlight === '1') {
      return;
    }
    if (block.childElementCount > 0) {
      return;
    }
    const src = block.textContent;
    if (!src || !src.trim()) {
      return;
    }
    block.innerHTML = highlightPythonSource(src);
    block.dataset.fmPyHighlight = '1';
  });
}

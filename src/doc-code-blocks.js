/** Adds copy buttons to code blocks under `.prose` after Shiki runs. */

export function enhanceDocCodeBlocks(proseRoot) {
  if (!proseRoot) return;
  proseRoot.querySelectorAll(':scope > pre, .prose pre').forEach((pre) => {
    if (pre.closest('.fm-code-block-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'fm-code-block-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fm-code-block-copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      const text = code?.textContent ?? pre.textContent ?? '';
      navigator.clipboard.writeText(text).then(
        () => {
          btn.textContent = 'Copied';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        },
        () => {}
      );
    });
    wrap.appendChild(btn);
  });
}

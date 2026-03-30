/**
 * Heading anchors + table of contents for long markdown docs.
 */

export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Strip simple markdown from heading line for display and slug. */
function plainHeadingText(raw) {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * @param {string} md
 * @returns {{ level: number, text: string, id: string }[]}
 */
export function extractTocFromMarkdown(md) {
  const items = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m;
  while ((m = re.exec(md)) !== null) {
    const level = m[1].length;
    const plain = plainHeadingText(m[2].trim());
    if (!plain) continue;
    items.push({
      level,
      text: plain,
      id: slugifyHeading(plain),
    });
  }
  return items;
}

/**
 * @param {string} html
 * @param {string} md
 */
export function addHeadingIdsFromMarkdown(html, md) {
  const headings = extractTocFromMarkdown(md);
  let i = 0;
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, level, attrs, inner) => {
    const h = headings[i++];
    if (!h) return full;
    if (/\sid\s*=/.test(attrs)) return full;
    return `<h${level}${attrs} id="${h.id}">${inner}</h${level}>`;
  });
}

const MIN_TOC_CHARS = 2200;

/**
 * @param {string} md
 */
export function shouldShowDocToc(md) {
  return typeof md === 'string' && md.length >= MIN_TOC_CHARS;
}

/**
 * @param {{ level: number, text: string, id: string }[]} items
 */
export function renderDocTocHtml(items) {
  if (!items.length) return '';
  const list = items
    .map(
      (item) =>
        `<li class="fm-doc-toc-item fm-doc-toc-level-${item.level}"><a href="#${item.id}" class="fm-doc-toc-link">${escapeHtml(
          item.text
        )}</a></li>`
    )
    .join('');
  return `
    <nav class="fm-doc-toc" aria-label="On this page">
      <p class="fm-doc-toc-title">On this page</p>
      <ol class="fm-doc-toc-list">${list}</ol>
    </nav>`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

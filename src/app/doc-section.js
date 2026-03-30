import { marked } from 'marked';
import { content } from '../content.js';
import {
  getStoredVersion,
  renderDocVersionBanner,
  renderDocPageMeta,
} from '../doc-versions.js';
import { mountApiExplorerEmbed } from '../api-explorer-embed.js';
import {
  addHeadingIdsFromMarkdown,
  extractTocFromMarkdown,
  shouldShowDocToc,
  renderDocTocHtml,
} from '../doc-toc.js';
import { enhanceDocCodeBlocks } from '../doc-code-blocks.js';
import { rewriteInternalDocLinks } from './rewrite-internal-links.js';
import { routeState, syncDocsUrl, syncSeoFromRouteState } from './route-state.js';
import { applyPythonHighlight } from './highlight-lucide.js';

function highlightActiveDocLink(section) {
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
}

export function showDocSection(section) {
  routeState.docSection = section;
  routeState.page = 'docs';
  routeState.blogPost = null;

  const contentArea = document.getElementById('doc-content');
  if (!contentArea || !content[section]) {
    return;
  }

  const sel = document.getElementById('fm-docs-version-select');
  if (sel) sel.value = getStoredVersion();

  const md = content[section];
  let html = marked.parse(md);
  html = addHeadingIdsFromMarkdown(html, md);
  const tocItems = extractTocFromMarkdown(md);
  const showToc = shouldShowDocToc(md) && tocItems.length >= 2;
  const tocAside = showToc
    ? `<aside class="fm-doc-toc-sidebar">${renderDocTocHtml(tocItems)}</aside>`
    : '';

  contentArea.innerHTML = `
      ${renderDocVersionBanner()}
      <div class="fm-doc-page-inner${showToc ? ' fm-doc-page-inner--with-toc' : ''}">
        ${tocAside}
        <div class="prose prose-lg max-w-none fm-doc-prose">
          ${renderDocPageMeta(section)}
          ${rewriteInternalDocLinks(html)}
        </div>
      </div>
    `;

  highlightActiveDocLink(section);

  void applyPythonHighlight().then(() => {
    const prose = contentArea.querySelector('.fm-doc-prose');
    if (prose) enhanceDocCodeBlocks(prose);
  });
  contentArea.scrollTop = 0;

  if (section === 'api-explorer') {
    requestAnimationFrame(() => {
      const prose = contentArea.querySelector('.prose');
      if (prose) mountApiExplorerEmbed(prose);
    });
  }

  syncDocsUrl();
  syncSeoFromRouteState();
}

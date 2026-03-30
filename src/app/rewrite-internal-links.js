import { content } from '../content.js';

/** Turn bare `[label](section-id)` hrefs from marked into in-app doc navigation. */
export function rewriteInternalDocLinks(html) {
  return html.replace(/<a href="([^"]+)">/g, (match, href) => {
    if (/^(https?:|mailto:|#|\/)/i.test(href)) return match;
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(href)) return match;
    if (!content[href]) return match;
    return `<a href="#" data-section="${href}" class="fm-internal-doc-link">`;
  });
}

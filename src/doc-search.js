import Fuse from 'fuse.js';
import { content } from './content.js';
import { DOC_NAV_ITEMS } from './doc-nav.js';
import { P2_SECTIONS } from './p2-content/index.js';

const mergedContent = { ...content, ...P2_SECTIONS };

export const DOC_CATEGORY_LABELS = {
  tutorial: 'Tutorial',
  reference: 'Reference',
  'how-to': 'How-to',
  api: 'API',
  ecosystem: 'Ecosystem',
};

function stripMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/[*#>|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let cachedRecords = null;

export function getDocSearchRecords() {
  if (cachedRecords) return cachedRecords;
  const records = [];
  for (const item of DOC_NAV_ITEMS) {
    if (item.type === 'divider' || !item.section) continue;
    const raw = mergedContent[item.section];
    if (typeof raw !== 'string') continue;
    records.push({
      section: item.section,
      title: item.title,
      category: item.category,
      body: stripMarkdown(raw),
    });
  }
  cachedRecords = records;
  return records;
}

function buildPreview(item, query, matches) {
  const maxLen = 150;
  const body = item.body;
  const bodyMatch = matches?.find((m) => m.key === 'body');
  if (bodyMatch?.indices?.length) {
    const [start, end] = bodyMatch.indices[0];
    const ctxStart = Math.max(0, start - 45);
    const ctxEnd = Math.min(body.length, Math.max(end + 55, start + maxLen));
    return (
      (ctxStart > 0 ? '…' : '') +
      body.slice(ctxStart, ctxEnd) +
      (ctxEnd < body.length ? '…' : '')
    );
  }
  const word = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)[0];
  if (word && word.length >= 2) {
    const idx = body.toLowerCase().indexOf(word);
    if (idx !== -1) {
      const ctxStart = Math.max(0, idx - 40);
      return (
        (ctxStart > 0 ? '…' : '') +
        body.slice(ctxStart, ctxStart + maxLen) +
        '…'
      );
    }
  }
  return body.slice(0, maxLen) + (body.length > maxLen ? '…' : '');
}

/**
 * @param {string} query
 * @param {'all' | 'tutorial' | 'reference' | 'how-to' | 'api'} categoryFilter
 */
export function searchDocuments(query, categoryFilter) {
  const records = getDocSearchRecords();
  const pool =
    categoryFilter && categoryFilter !== 'all'
      ? records.filter((r) => r.category === categoryFilter)
      : records;
  const q = query.trim();
  if (!q) {
    return pool.slice(0, 15).map((r) => ({
      section: r.section,
      title: r.title,
      category: r.category,
      preview:
        r.body.slice(0, 160) + (r.body.length > 160 ? '…' : ''),
    }));
  }
  const fuse = new Fuse(pool, {
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'body', weight: 0.55 },
    ],
    threshold: 0.42,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeMatches: true,
  });
  return fuse.search(q, { limit: 15 }).map((res) => ({
    section: res.item.section,
    title: res.item.title,
    category: res.item.category,
    score: res.score,
    preview: buildPreview(res.item, q, res.matches),
  }));
}

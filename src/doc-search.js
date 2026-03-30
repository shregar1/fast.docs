import Fuse from 'fuse.js';
import { content } from './content.js';
import { DOC_NAV_ITEMS } from './doc-nav.js';
import { P2_SECTIONS } from './p2-content/index.js';
import { BLOG_INDEX, BLOG_POSTS } from './blog/blog-posts.js';
import { HOME_SEARCH_SEEDS } from './home-search-seeds.js';
import {
  getDifficultyForSection,
  getUpdatedAtForSection,
} from './doc-section-meta.js';

const mergedContent = { ...content, ...P2_SECTIONS };

export const DOC_CATEGORY_LABELS = {
  tutorial: 'Tutorial',
  reference: 'Reference',
  'how-to': 'How-to',
  api: 'API',
  ecosystem: 'Ecosystem',
  blog: 'Blog',
  home: 'Home',
};

/** @typedef {'beginner' | 'intermediate' | 'advanced'} Difficulty */
/** @typedef {'relevance' | 'newest' | 'shortest' | 'alpha'} SortMode */

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

function wordStats(body) {
  const words = body.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return { wordCount, readMinutes };
}

let cachedRecords = null;

function buildRecords() {
  const records = [];
  for (const item of DOC_NAV_ITEMS) {
    if (item.type === 'divider' || !item.section) continue;
    const raw = mergedContent[item.section];
    if (typeof raw !== 'string') continue;
    const body = stripMarkdown(raw);
    const { wordCount, readMinutes } = wordStats(body);
    const difficulty = getDifficultyForSection(item.section, item.category);
    const updatedAt = getUpdatedAtForSection(item.section, item.category);
    records.push({
      section: item.section,
      title: item.title,
      category: item.category,
      body,
      wordCount,
      readMinutes,
      difficulty,
      updatedAt,
    });
  }
  for (const post of BLOG_INDEX) {
    const raw = BLOG_POSTS[post.slug];
    if (typeof raw !== 'string') continue;
    const body = stripMarkdown(raw);
    const { wordCount, readMinutes } = wordStats(body);
    const section = `blog:${post.slug}`;
    const blogUpdated = Date.parse(`${post.date}T12:00:00Z`);
    const difficulty = getDifficultyForSection(section, 'blog');
    const updatedAt = getUpdatedAtForSection(section, 'blog', blogUpdated);
    records.push({
      section,
      title: post.title,
      category: 'blog',
      body,
      wordCount,
      readMinutes,
      difficulty,
      updatedAt,
    });
  }
  for (const seed of HOME_SEARCH_SEEDS) {
    const { wordCount, readMinutes } = wordStats(seed.body);
    records.push({
      section: seed.section,
      title: seed.title,
      category: 'home',
      body: seed.body,
      wordCount,
      readMinutes,
      difficulty: getDifficultyForSection(seed.section, 'home'),
      updatedAt: getUpdatedAtForSection(seed.section, 'home'),
    });
  }
  {
    const body =
      'license mit contributing code of conduct security changelog github non-commercial community open source';
    const { wordCount, readMinutes } = wordStats(body);
    records.push({
      section: '__community__',
      title: 'Community & open source',
      category: 'reference',
      body,
      wordCount,
      readMinutes,
      difficulty: getDifficultyForSection('__community__', 'reference'),
      updatedAt: getUpdatedAtForSection('__community__', 'reference'),
    });
  }
  return records;
}

export function getDocSearchRecords() {
  if (cachedRecords) return cachedRecords;
  cachedRecords = buildRecords();
  return cachedRecords;
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
 * @param {ReturnType<typeof getDocSearchRecords>[number][]} rows
 * @param {SortMode} sortMode
 * @param {string} query
 */
function sortResultRows(rows, sortMode, query) {
  const q = query.trim();
  if (sortMode === 'relevance' && q) return rows;
  const copy = [...rows];
  if (sortMode === 'alpha') {
    copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    return copy;
  }
  if (sortMode === 'newest') {
    copy.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    return copy;
  }
  if (sortMode === 'shortest') {
    copy.sort((a, b) => (a.readMinutes ?? 0) - (b.readMinutes ?? 0));
    return copy;
  }
  if (sortMode === 'relevance' && !q) {
    copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    return copy;
  }
  return rows;
}

/**
 * @param {string} query
 * @param {string} categoryFilter
 * @param {'all' | Difficulty} difficultyFilter
 * @param {SortMode} sortMode
 */
export function searchDocuments(query, categoryFilter, difficultyFilter, sortMode) {
  const all = getDocSearchRecords();
  let pool = all;
  if (categoryFilter && categoryFilter !== 'all') {
    pool = all.filter((r) => r.category === categoryFilter);
  }
  if (difficultyFilter && difficultyFilter !== 'all') {
    pool = pool.filter((r) => r.difficulty === difficultyFilter);
  }
  const q = query.trim();
  if (!q) {
    const sliced = pool.slice(0, 40).map((r) => ({
      section: r.section,
      title: r.title,
      category: r.category,
      difficulty: r.difficulty,
      readMinutes: r.readMinutes,
      updatedAt: r.updatedAt,
      preview: r.body.slice(0, 160) + (r.body.length > 160 ? '…' : ''),
    }));
    return sortResultRows(sliced, sortMode, '').slice(0, 20);
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
  const fuseOut = fuse.search(q, { limit: 40 }).map((res) => ({
    section: res.item.section,
    title: res.item.title,
    category: res.item.category,
    difficulty: res.item.difficulty,
    readMinutes: res.item.readMinutes,
    updatedAt: res.item.updatedAt,
    score: res.score,
    preview: buildPreview(res.item, q, res.matches),
  }));
  const sorted = sortResultRows(fuseOut, sortMode, q);
  return sorted.slice(0, 20);
}

export const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const SORT_LABELS = {
  relevance: 'Relevance',
  newest: 'Newest',
  shortest: 'Shortest read',
  alpha: 'A–Z',
};

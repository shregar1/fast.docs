/** Per-section overrides; otherwise derived from doc category. */

/** @type {Record<string, 'beginner' | 'intermediate' | 'advanced'>} */
export const SECTION_DIFFICULTY_OVERRIDE = {
  introduction: 'beginner',
  installation: 'beginner',
  'tutorial-overview': 'beginner',
  'tutorial-part-1': 'beginner',
  'tutorial-part-2': 'beginner',
  'tutorial-part-3': 'beginner',
  'interactive-examples': 'beginner',
  'fast-playground': 'beginner',
  glossary: 'beginner',
  __community__: 'beginner',
  security: 'advanced',
  'edge-functions': 'advanced',
  'chaos-engineering': 'advanced',
  'time-travel-debugging': 'advanced',
};

/** Approximate “last updated” for sort (ms). Sparse; rest use category default. */
export const SECTION_UPDATED_AT_OVERRIDE = {
  introduction: Date.parse('2025-09-01T12:00:00Z'),
  'changelog': Date.parse('2026-03-28T12:00:00Z'),
  'tutorial-part-9': Date.parse('2026-02-15T12:00:00Z'),
  security: Date.parse('2026-01-20T12:00:00Z'),
  'performance-guide': Date.parse('2025-12-01T12:00:00Z'),
  __community__: Date.parse('2026-03-30T12:00:00Z'),
};

const CATEGORY_UPDATED_FALLBACK = {
  tutorial: Date.parse('2026-02-01T12:00:00Z'),
  reference: Date.parse('2025-11-01T12:00:00Z'),
  'how-to': Date.parse('2025-10-15T12:00:00Z'),
  api: Date.parse('2026-01-10T12:00:00Z'),
  ecosystem: Date.parse('2025-12-20T12:00:00Z'),
  blog: Date.parse('2026-03-28T12:00:00Z'),
  home: Date.parse('2026-03-25T12:00:00Z'),
};

/** @param {string} category */
export function defaultDifficultyForCategory(category) {
  switch (category) {
    case 'tutorial':
      return 'beginner';
    case 'how-to':
      return 'intermediate';
    case 'reference':
      return 'intermediate';
    case 'api':
      return 'advanced';
    case 'ecosystem':
      return 'intermediate';
    case 'blog':
      return 'intermediate';
    case 'home':
      return 'beginner';
    default:
      return 'intermediate';
  }
}

/**
 * @param {string} section
 * @param {string} category
 */
export function getDifficultyForSection(section, category) {
  return SECTION_DIFFICULTY_OVERRIDE[section] ?? defaultDifficultyForCategory(category);
}

/**
 * @param {string} section
 * @param {string} category
 * @param {number} [blogUpdatedAt]
 */
export function getUpdatedAtForSection(section, category, blogUpdatedAt) {
  if (section.startsWith('blog:') && blogUpdatedAt != null) return blogUpdatedAt;
  if (SECTION_UPDATED_AT_OVERRIDE[section] != null) return SECTION_UPDATED_AT_OVERRIDE[section];
  return CATEGORY_UPDATED_FALLBACK[category] ?? Date.parse('2024-06-01T12:00:00Z');
}

import { parseLocationSearch, resolveDocSection } from '../docs-url-routing.js';
import { isValidBlogSlug } from '../blog/blog-posts.js';
import { hasDocSection } from './route-state.js';
import { showPage } from './show-page.js';

export function applyRouteFromUrl() {
  if (typeof window !== 'undefined' && window.location.hash === '#architecture') {
    const path = window.location.pathname || '/';
    window.history.replaceState(null, '', `${path}?page=architecture`);
    showPage('architecture');
    return;
  }
  const { page, sectionRaw, blogPostRaw } = parseLocationSearch();
  const resolved = resolveDocSection(sectionRaw, hasDocSection);
  if (page === 'docs') {
    showPage('docs', { docSection: resolved || undefined });
  } else if (page === 'playground') {
    showPage('playground');
  } else if (page === 'architecture') {
    showPage('architecture');
  } else if (page === 'community') {
    showPage('community');
  } else if (page === 'blog') {
    const slug =
      blogPostRaw && isValidBlogSlug(blogPostRaw.trim()) ? blogPostRaw.trim() : undefined;
    showPage('blog', { blogPost: slug });
  } else {
    showPage('home');
  }
}

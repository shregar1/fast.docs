import { parseLocationSearch, resolveDocSection } from '../docs-url-routing.js';
import { isValidBlogSlug } from '../blog/blog-posts.js';
import { hasDocSection } from './route-state.js';

export function applyRouteFromUrl() {
  if (typeof window !== 'undefined' && window.location.hash === '#architecture') {
    const path = window.location.pathname || '/';
    window.history.replaceState(null, '', `${path}?page=architecture`);
    window.showPage('architecture');
    return;
  }
  const { page, sectionRaw, blogPostRaw } = parseLocationSearch();
  const resolved = resolveDocSection(sectionRaw, hasDocSection);
  if (page === 'docs') {
    window.showPage('docs', { docSection: resolved || undefined });
  } else if (page === 'playground') {
    window.showPage('playground');
  } else if (page === 'architecture') {
    window.showPage('architecture');
  } else if (page === 'community') {
    window.showPage('community');
  } else if (page === 'blog') {
    const slug =
      blogPostRaw && isValidBlogSlug(blogPostRaw.trim()) ? blogPostRaw.trim() : undefined;
    window.showPage('blog', { blogPost: slug });
  } else {
    window.showPage('home');
  }
}

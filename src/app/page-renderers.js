import { marked } from 'marked';
import { content } from '../content.js';
import { createDocsPage } from '../doc-nav.js';
import {
  createHeroSection,
  createHomeWriteLessSection,
  createComparisonTable,
  createCTASection,
  createFeaturesGrid,
  createSecurityArchitectureTeaser,
  createMonorepoSection,
} from '../components/home/sections.js';
import { createArchitecturePage } from '../components/home/architecture-section.js';
import { createCommunityOsPage } from '../community-os-page.js';
import { mountPlaygroundPage } from '../components/playground/playground-page.js';
import { createBlogPageList, createBlogArticlePage } from '../blog/blog-page.js';
import { isValidBlogSlug } from '../blog/blog-posts.js';
import { enhanceDocCodeBlocks } from '../doc-code-blocks.js';
import { rewriteInternalDocLinks } from './rewrite-internal-links.js';
import { routeState } from './route-state.js';
import { applyPythonHighlight, refreshLucideIcons } from './highlight-lucide.js';
import { initDocsVersionSelector } from './docs-version-ui.js';
import { showDocSection } from './doc-section.js';

export function renderHomePage(container) {
  container.innerHTML = `
    ${createHeroSection()}
    ${createMonorepoSection()}
    ${createHomeWriteLessSection()}
    ${createFeaturesGrid()}
    ${createSecurityArchitectureTeaser()}
    ${createComparisonTable()}
    ${createCTASection()}
  `;
  void applyPythonHighlight();
  refreshLucideIcons();
}

export function renderArchitecturePage(container) {
  container.innerHTML = createArchitecturePage();
  void applyPythonHighlight();
  refreshLucideIcons();
  void import('../home-mermaid.js').then((m) => m.initHomeArchitectureDiagrams());
}

export function renderCommunityPage(container) {
  container.innerHTML = createCommunityOsPage();
  refreshLucideIcons();
}

export function renderPlaygroundPage(container) {
  mountPlaygroundPage(container);
  refreshLucideIcons();
}

export function renderDocsPage(container, initialSection) {
  container.innerHTML = createDocsPage();

  document.querySelectorAll('.doc-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showDocSection(link.dataset.section);
    });
  });

  initDocsVersionSelector();
  const sec =
    initialSection && content[initialSection] ? initialSection : 'introduction';
  showDocSection(sec);
  refreshLucideIcons();
}

function wireBlogOpenHandlers(container, navigate) {
  container.querySelectorAll('.fm-blog-open').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = el.dataset.blogSlug;
      if (slug) navigate('blog', { blogPost: slug });
    });
  });
}

export function renderBlogPage(container, postSlug, navigate) {
  const nav = navigate || ((page, options) => window.showPage(page, options));
  routeState.blogPost = postSlug && isValidBlogSlug(postSlug) ? postSlug : null;
  if (routeState.blogPost) {
    container.innerHTML = createBlogArticlePage(
      routeState.blogPost,
      rewriteInternalDocLinks,
      (md) => marked.parse(md)
    );
  } else {
    container.innerHTML = createBlogPageList();
    wireBlogOpenHandlers(container, nav);
  }
  void applyPythonHighlight().then(() => {
    const prose = container.querySelector('.fm-blog-prose');
    if (prose) enhanceDocCodeBlocks(prose);
  });
  refreshLucideIcons();
}

import { closeNavExploreDropdown } from './nav-shell.js';
import { routeState, syncDocsUrl, syncSeoFromRouteState } from './route-state.js';
import {
  renderHomePage,
  renderArchitecturePage,
  renderCommunityPage,
  renderPlaygroundPage,
  renderDocsPage,
  renderBlogPage,
} from './page-renderers.js';
import { refreshLucideIcons } from './highlight-lucide.js';
import { showDocSection } from './doc-section.js';

export function showPage(page, options = {}) {
  closeNavExploreDropdown();
  const mainContent = document.getElementById('main-content');
  window.scrollTo(0, 0);

  if (!mainContent) return;

  if (page === 'docs') {
    routeState.page = 'docs';
    routeState.blogPost = null;
    renderDocsPage(mainContent, options.docSection);
  } else if (page === 'playground') {
    routeState.page = 'playground';
    routeState.blogPost = null;
    renderPlaygroundPage(mainContent);
    syncDocsUrl();
  } else if (page === 'architecture') {
    routeState.page = 'architecture';
    routeState.blogPost = null;
    routeState.docSection = 'introduction';
    renderArchitecturePage(mainContent);
    syncDocsUrl();
  } else if (page === 'community') {
    routeState.page = 'community';
    routeState.blogPost = null;
    routeState.docSection = 'introduction';
    renderCommunityPage(mainContent);
    syncDocsUrl();
  } else if (page === 'blog') {
    routeState.page = 'blog';
    renderBlogPage(mainContent, options.blogPost, showPage);
    syncDocsUrl();
  } else {
    routeState.page = 'home';
    routeState.blogPost = null;
    routeState.docSection = 'introduction';
    renderHomePage(mainContent);
    syncDocsUrl();
    if (options.scrollTo) {
      const id = options.scrollTo;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  syncSeoFromRouteState();
  refreshLucideIcons();
}

export function registerAppRoutes() {
  window.showPage = showPage;
  window.showDocSection = showDocSection;
}

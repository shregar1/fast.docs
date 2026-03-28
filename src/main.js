import { marked } from 'marked';
import {
  highlightCode,
  createHeroSection,
  createHomeWriteLessSection,
  createComparisonTable,
  createCTASection,
  createDocsPage,
  content,
} from './content.js';
import { P2_SECTIONS } from './p2-content/index.js';
import { initTheme } from './theme.js';

Object.assign(content, P2_SECTIONS);

initTheme();

function refreshLucideIcons() {
  setTimeout(() => lucide.createIcons(), 100);
}

lucide.createIcons();

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

window.hideMobileMenu = () => {
  mobileMenu.classList.add('hidden');
};

function renderHomePage(container) {
  container.innerHTML = `
    ${createHeroSection()}
    ${createHomeWriteLessSection()}
    ${createComparisonTable()}
    ${createCTASection()}
  `;
  highlightCode();
}

function renderDocsPage(container) {
  container.innerHTML = createDocsPage();

  document.querySelectorAll('.doc-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showDocSection(link.dataset.section);
    });
  });

  showDocSection('introduction');
  refreshLucideIcons();
}

const PAGE_RENDERERS = {
  home: renderHomePage,
  docs: renderDocsPage,
};

window.showPage = (page) => {
  const mainContent = document.getElementById('main-content');
  window.scrollTo(0, 0);

  const render = PAGE_RENDERERS[page];
  if (render && mainContent) {
    render(mainContent);
  }

  refreshLucideIcons();
};

window.showDocSection = (section) => {
  const contentArea = document.getElementById('doc-content');
  if (!contentArea || !content[section]) {
    return;
  }

  contentArea.innerHTML = `
      <div class="prose prose-lg max-w-none">
        ${marked.parse(content[section])}
      </div>
    `;

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

  highlightCode();
  contentArea.scrollTop = 0;
};

renderHomePage(document.getElementById('main-content'));

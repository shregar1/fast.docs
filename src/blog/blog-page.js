import { BLOG_INDEX, getBlogPost, isValidBlogSlug } from './blog-posts.js';

function blogCard(post) {
  return `
    <article class="fm-blog-card rounded-2xl border p-6 flex flex-col gap-3 transition-colors hover:border-[var(--fm-border-hover)]" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
      <div class="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider" style="color: var(--fm-text-muted);">
        <span class="px-2 py-0.5 rounded border" style="border-color: var(--fm-border); color: var(--fm-text-secondary);">${post.tag}</span>
        <time datetime="${post.date}">${post.date}</time>
      </div>
      <h2 class="text-xl font-semibold leading-snug" style="color: var(--fm-text);">
        <a href="#" class="fm-blog-open" data-blog-slug="${post.slug}" style="color: inherit; text-decoration: none;">${post.title}</a>
      </h2>
      <p class="text-sm leading-relaxed flex-1" style="color: var(--fm-text-muted);">${post.excerpt}</p>
      <a href="#" class="fm-blog-open inline-flex items-center gap-1 text-sm font-semibold w-fit" data-blog-slug="${post.slug}" style="color: var(--fm-text-secondary);">
        Read article <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </a>
    </article>
  `;
}

export function createBlogPageList() {
  const cards = BLOG_INDEX.map(blogCard).join('');
  return `
    <section class="pt-24 pb-16 min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--fm-text-muted);">Fast blog</p>
          <h1 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">Ecosystem &amp; examples</h1>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Short articles on each major package and feature—aligned with the Fast monorepo and this site’s documentation.
          </p>
        </header>
        <div class="grid lg:grid-cols-2 gap-6">
          ${cards}
        </div>
        <p class="mt-12 text-center text-sm" style="color: var(--fm-text-muted);">
          For full reference material, see <a href="#" onclick="showPage('docs'); return false;" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">Documentation</a>
          or the <a href="#" onclick="showPage('docs'); showDocSection('ecosystem'); return false;" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">Ecosystem overview</a>.
        </p>
      </div>
    </section>
  `;
}

/**
 * @param {string | null | undefined} slug
 * @param {(html: string) => string} rewriteLinks — e.g. rewriteInternalDocLinks
 * @param {(md: string) => string} parseMarkdown — e.g. (md) => marked.parse(md)
 */
export function createBlogArticlePage(slug, rewriteLinks, parseMarkdown) {
  if (!slug || !isValidBlogSlug(slug)) {
    return `
      <section class="pt-24 pb-16 min-h-screen">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-2xl font-bold mb-4" style="color: var(--fm-text);">Article not found</h1>
          <p class="mb-6" style="color: var(--fm-text-muted);">No blog post matches this URL.</p>
          <a href="#" onclick="showPage('blog'); return false;" class="font-semibold underline underline-offset-2" style="color: var(--fm-text-secondary);">← Back to blog</a>
        </div>
      </section>
    `;
  }

  const meta = BLOG_INDEX.find((p) => p.slug === slug);
  const raw = getBlogPost(slug);
  const bodyHtml = rewriteLinks(parseMarkdown(raw));

  return `
    <article class="pt-24 pb-16 min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="mb-8">
          <a href="#" onclick="showPage('blog'); return false;" class="inline-flex items-center gap-2 text-sm font-medium" style="color: var(--fm-text-secondary);">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> All posts
          </a>
        </nav>
        <header class="mb-10 pb-8 border-b" style="border-color: var(--fm-border);">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--fm-text-muted);">${meta?.tag || 'Blog'} · ${meta?.date || ''}</p>
          <h1 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">${meta?.title || ''}</h1>
          <p class="text-base leading-relaxed" style="color: var(--fm-text-muted);">${meta?.excerpt || ''}</p>
        </header>
        <div class="prose prose-lg max-w-none fm-blog-prose">
          ${bodyHtml}
        </div>
      </div>
    </article>
  `;
}

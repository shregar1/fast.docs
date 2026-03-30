/** Standalone “Community & open source” page (?page=community). */

const REPO_DOCS = 'https://github.com/shregar1/fast.docs';
const REPO_FRAMEWORK = 'https://github.com/shregar1/fast.mvc';

export function createCommunityOsPage() {
  return `
    <article class="pt-24 pb-20 min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-12">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--fm-text-muted);">Fast</p>
          <h1 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">Community &amp; open source</h1>
          <p class="text-lg leading-relaxed" style="color: var(--fm-text-muted);">
            This documentation site is a <strong style="color: var(--fm-text-secondary);">non-commercial</strong>, community and <strong style="color: var(--fm-text-secondary);">educational</strong> project:
            source is public, contributions are welcome, and hosting follows Netlify&rsquo;s open-source terms.
          </p>
        </header>

        <div class="space-y-10">
          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="book-open" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              Repositories
            </h2>
            <ul class="space-y-3 text-sm leading-relaxed" style="color: var(--fm-text-muted);">
              <li>
                <strong style="color: var(--fm-text);">Documentation (this site):</strong>
                <a href="${REPO_DOCS}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">github.com/shregar1/fast.docs</a>
              </li>
              <li>
                <strong style="color: var(--fm-text);">Fast framework:</strong>
                <a href="${REPO_FRAMEWORK}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">github.com/shregar1/fast.mvc</a>
              </li>
            </ul>
          </section>

          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="scale" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              License
            </h2>
            <p class="text-sm leading-relaxed mb-4" style="color: var(--fm-text-muted);">
              This site&rsquo;s content and tooling in <strong style="color: var(--fm-text);">fast.docs</strong> are released under the
              <a href="${REPO_DOCS}/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">MIT License</a>.
              The framework in <strong style="color: var(--fm-text);">fast.mvc</strong> has its own
              <a href="${REPO_FRAMEWORK}/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">license</a>.
            </p>
          </section>

          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="heart" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              Code of conduct
            </h2>
            <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">
              We follow the Contributor Covenant. Read the full text in the repo:
              <a href="${REPO_DOCS}/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">CODE_OF_CONDUCT.md</a>.
            </p>
          </section>

          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="git-branch" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              Contributing
            </h2>
            <p class="text-sm leading-relaxed mb-4" style="color: var(--fm-text-muted);">
              Fixes and improvements to docs are welcome. See
              <a href="${REPO_DOCS}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">CONTRIBUTING.md</a>
              for local setup, PR expectations, and how to run the site.
            </p>
          </section>

          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="shield" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              Security
            </h2>
            <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">
              To report a security issue responsibly, please follow
              <a href="${REPO_DOCS}/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">SECURITY.md</a>.
            </p>
          </section>

          <section class="rounded-2xl border p-6 md:p-8" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2" style="color: var(--fm-text);">
              <i data-lucide="scroll-text" class="w-5 h-5" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
              Changelog &amp; releases
            </h2>
            <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">
              Framework and docs version notes live in the documentation:
              <a href="#" onclick="showPage('docs'); showDocSection('changelog'); return false;" class="underline underline-offset-2 font-medium" style="color: var(--fm-text-secondary);">Changelog</a>.
            </p>
          </section>

          <div class="text-center text-xs pt-4 flex flex-col items-center gap-2" style="color: var(--fm-text-muted);">
            <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" class="inline-block leading-none" aria-label="This site is powered by Netlify">
              <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="" width="114" height="51" loading="lazy" decoding="async" />
            </a>
            <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">This site is powered by Netlify</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

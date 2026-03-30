function homeFeatureCardTemplate({ icon, title, description }) {
  return `
    <div class="fm-feature-card">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border);">
          <i data-lucide="${icon}" class="w-5 h-5" style="color: var(--fm-text);"></i>
        </div>
        <div>
          <h3 class="font-semibold mb-1" style="color: var(--fm-text);">${title}</h3>
          <p class="text-sm" style="color: var(--fm-text-muted);">${description}</p>
        </div>
      </div>
    </div>
  `;
}

function featuresGridCardTemplate({ icon, title, description }) {
  return `
    <div class="fm-feature-card group">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border);">
        <i data-lucide="${icon}" class="w-6 h-6" style="color: var(--fm-text);"></i>
      </div>
      <h3 class="text-lg font-semibold mb-2" style="color: var(--fm-text);">${title}</h3>
      <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">${description}</p>
    </div>
  `;
}

function compCellMidTemplate(val) {
  if (val === 'x') {
    return `<td class="py-4 px-6 text-center"><span class="inline-flex justify-center" style="color: var(--fm-text-muted);" aria-hidden="true"><i data-lucide="x" class="w-4 h-4"></i></span></td>`;
  }
  return `<td class="py-4 px-6 text-center" style="color: var(--fm-text-secondary);">${val}</td>`;
}

function compCellFastTemplate(val) {
  return `<td class="py-4 px-6 text-center font-semibold"><span class="inline-flex justify-center items-center gap-1.5" style="color: var(--fm-text);"><i data-lucide="check" class="w-4 h-4"></i> ${val}</span></td>`;
}

function ecosystemPackageCardTemplate({ section, name, role, icon, desc }) {
  return `
    <a href="#" class="group p-6 rounded-2xl border flex flex-col gap-3 text-left transition-colors hover:border-[var(--fm-border-hover)] no-underline" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border); color: inherit;"
      onclick="showPage('docs'); showDocSection('${section}'); return false;">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--fm-surface); border: 1px solid var(--fm-border);">
            <i data-lucide="${icon}" class="w-5 h-5" style="color: var(--fm-text-secondary);"></i>
          </div>
          <div class="min-w-0">
            <span class="text-sm font-mono font-bold block truncate" style="color: var(--fm-text);">${name}</span>
            <span class="text-[10px] uppercase tracking-wider" style="color: var(--fm-text-muted);">${role}</span>
          </div>
        </div>
        <i data-lucide="arrow-up-right" class="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style="color: var(--fm-text-secondary);" aria-hidden="true"></i>
      </div>
      <p class="text-xs leading-relaxed flex-1" style="color: var(--fm-text-muted);">${desc}</p>
      <span class="text-xs font-semibold" style="color: var(--fm-text-secondary);">Documentation →</span>
    </a>
  `;
}

export function homeFeatureCardsTemplate(items) {
  return items.map(homeFeatureCardTemplate).join('');
}

export function featuresGridCardsTemplate(items) {
  return items.map(featuresGridCardTemplate).join('');
}

export function comparisonTableTbodyTemplate(rows) {
  const last = rows.length - 1;
  return rows
    .map((row, i) => {
      const [feature, d, fa, ne, fast] = row;
      const border =
        i < last ? ` style="border-bottom: 1px solid var(--fm-border);"` : '';
      return `<tr${border}>
                <td class="py-4 px-6 font-medium" style="color: var(--fm-text);">${feature}</td>
                ${compCellMidTemplate(d)}
                ${compCellMidTemplate(fa)}
                ${compCellMidTemplate(ne)}
                ${compCellFastTemplate(fast)}
              </tr>`;
    })
    .join('');
}

export function ecosystemPackageCardsTemplate(pkgs) {
  return pkgs.map(ecosystemPackageCardTemplate).join('');
}

export function homeHeroSectionTemplate({ heroCode }) {
  return `
    <section class="relative pt-[60px] pb-[40px] overflow-hidden" id="home-hero">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="mb-8 flex justify-center">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center" style="background-color: var(--fm-surface); border: 1px solid var(--fm-border);">
              <img src="/assets/logo-hero-dark.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 dark-logo" style="display: block;">
              <img src="/assets/logo-hero-light.svg" alt="Fast" class="w-16 h-16 md:w-20 md:h-20 light-logo" style="display: none;">
            </div>
          </div>

          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style="background-color: var(--fm-surface-raised); border: 1px solid var(--fm-border); color: var(--fm-text);">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--fm-text);"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: var(--fm-text-secondary);"></span>
            </span>
            v0.4.0 is now available
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style="color: var(--fm-text);">
            Production-Grade
            <span class="block" style="color: var(--fm-text-secondary);">
              FastAPI Framework
            </span>
          </h1>

          <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed" style="color: var(--fm-text-muted);">
            The most advanced Python web framework with smart caching, N+1 detection,
            distributed tracing, field encryption, and more.
          </p>

          <div class="max-w-2xl mx-auto mb-10 px-4">
            <div class="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 font-mono text-sm sm:text-base" style="background-color: var(--fm-code-bg); border-color: var(--fm-border); color: var(--fm-text);">
              <span class="min-w-0 truncate text-left"><span style="color: var(--fm-text-muted); user-select: none;">$ </span>pip install fastmvc-cli</span>
              <button type="button" class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors" style="background-color: var(--fm-surface-raised); color: var(--fm-text-muted); border: 1px solid var(--fm-border);" onmouseover="this.style.color='var(--fm-text)'" onmouseout="this.style.color='var(--fm-text-muted)'" onclick="navigator.clipboard.writeText('pip install fastmvc-cli')" aria-label="Copy pip install command">Copy</button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" onclick="showPage('docs')" class="group relative px-8 py-4 font-semibold rounded-xl overflow-hidden transition-all hover:scale-105" style="background-color: var(--fm-text); color: var(--fm-bg);">
              <span class="relative flex items-center gap-2">
                Get Started
                <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
              </span>
            </a>
            <a href="https://github.com/shregar1/fast.mvc" target="_blank" class="px-8 py-4 font-semibold rounded-xl transition-all flex items-center gap-2" style="background-color: var(--fm-surface); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'">
              <i data-lucide="github" class="w-5 h-5"></i>
              View on GitHub
            </a>
          </div>

          <div class="max-w-4xl mx-auto mt-10">
            <div class="rounded-2xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
              <div class="flex items-center gap-2 px-4 py-3 border-b" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">home_function_style.py</span>
              </div>
              <div class="p-6 text-left overflow-x-auto">
                <pre class="text-sm font-mono leading-relaxed m-0" style="color: var(--fm-text-secondary);"><code class="language-python">${heroCode}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function homeWriteLessSectionTemplate({ toolbar, body, featureCards }) {
  return `
    <section class="pt-[40px] pb-24 relative overflow-hidden" id="home-write-less">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Write Less, <span style="color: var(--fm-text-secondary);">Do More</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Runnable <strong>FastAPI</strong> samples below (same files as <code class="text-sm px-1 rounded" style="background: var(--fm-code-bg);">examples/verified/</code> in this repo). Product features on the right are what you get with the full Fast stack after <code class="text-sm px-1 rounded" style="background: var(--fm-code-bg);">fast generate</code>.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
            ${toolbar}
            ${body}
          </div>

          <div class="space-y-4">
            ${featureCards}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function featuresGridSectionTemplate({ cards }) {
  return `
    <section id="features" class="py-24 relative" aria-labelledby="features-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 id="features-heading" class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Everything You Need to
            <span style="color: var(--fm-text-secondary);">Ship Faster</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Enterprise-grade features built-in, so you can focus on building your application.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

export function securityArchitectureTeaserTemplate() {
  return `
    <section id="security-architecture" class="py-16 relative border-t" style="border-color: var(--fm-border);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-3" style="color: var(--fm-text);">Security architecture</h2>
        <p class="text-sm md:text-base max-w-2xl mx-auto mb-4" style="color: var(--fm-text-muted);">
          Layered middleware, field encryption, and tenant-aware patterns—tie this to the full security model in the docs.
        </p>
        <a href="#" onclick="showPage('docs'); showDocSection('security'); return false;" class="text-sm font-semibold underline underline-offset-2" style="color: var(--fm-text-secondary);">Open Security docs →</a>
      </div>
    </section>
  `;
}

export function comparisonTableSectionTemplate({ tbody }) {
  return `
    <section id="home-comparison" class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
            Why <span style="color: var(--fm-text-secondary);">Fast?</span>
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--fm-text-muted);">
            Feature matrix across common stacks — indicative only; check each framework’s plugins and version for your exact needs.
          </p>
        </div>

        <div class="overflow-x-auto rounded-2xl border" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
          <table class="w-full text-left">
            <thead>
              <tr style="border-bottom: 1px solid var(--fm-border);">
                <th class="pb-4 pt-4 px-6 font-medium" style="color: var(--fm-text-muted);">Feature</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">Django</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">FastAPI</th>
                <th class="pb-4 pt-4 px-6 text-center font-medium" style="color: var(--fm-text-muted);">NestJS</th>
                <th class="pb-4 pt-4 px-6 text-center font-semibold" style="color: var(--fm-text);">Fast</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${tbody}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function monorepoSectionTemplate({ cards }) {
  return `
    <section id="home-ecosystem" class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight" style="color: var(--fm-text);">
              <span class="text-gradient">Ecosystem</span>
            </h2>
            <p class="text-lg mb-8 leading-relaxed" style="color: var(--fm-text-muted);">
              Five coordinated packages cover infrastructure, HTTP middleware, persistence, dashboards, and the CLI. Open the docs for each package from the cards below, or start from the
              <a href="#" onclick="showPage('docs'); showDocSection('ecosystem'); return false;" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">ecosystem overview</a>.
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              ${cards}
            </div>
          </div>
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
            <div class="relative rounded-3xl border p-8 aspect-square flex items-center justify-center overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
              <div class="grid grid-cols-2 gap-4">
                <div class="w-32 h-32 rounded-2xl border flex items-center justify-center rotate-3 translate-y-4" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                  <i data-lucide="layers" class="w-10 h-10 opacity-20"></i>
                </div>
                <div class="w-32 h-32 rounded-2xl border flex items-center justify-center -rotate-6" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                  <i data-lucide="database" class="w-10 h-10 opacity-20"></i>
                </div>
                <div class="w-32 h-32 rounded-2xl border flex items-center justify-center -rotate-3 -translate-y-4" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                  <i data-lucide="shield" class="w-10 h-10 opacity-20"></i>
                </div>
                <div class="w-32 h-32 rounded-2xl border flex items-center justify-center rotate-12" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
                  <i data-lucide="zap" class="w-10 h-10 opacity-20"></i>
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-24 h-24 rounded-full flex items-center justify-center blur-md opacity-20" style="background-color: var(--fm-text);"></div>
                <div class="absolute w-20 h-20 rounded-full border flex items-center justify-center" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
                   <span class="font-black text-xl tracking-tighter" style="color: var(--fm-text);">FAST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function ctaSectionTemplate() {
  return `
    <section class="py-24 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative p-12 rounded-3xl border overflow-hidden" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
          <div class="absolute inset-0 opacity-30">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, var(--fm-border-hover) 1px, transparent 0); background-size: 24px 24px;"></div>
          </div>

          <div class="relative text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--fm-text);">
              Ready to Build Something
              <span style="color: var(--fm-text-secondary);">Amazing?</span>
            </h2>
            <p class="text-lg mb-8 max-w-xl mx-auto" style="color: var(--fm-text-muted);">
              Get started with Fast in minutes. Join thousands of developers building production-grade applications.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" onclick="showPage('docs')" class="px-8 py-4 font-semibold rounded-xl transition-colors flex items-center gap-2" style="background-color: var(--fm-text); color: var(--fm-bg);">
                Read Documentation
                <i data-lucide="book-open" class="w-5 h-5"></i>
              </a>
              <a href="https://github.com/shregar1/fast.mvc" target="_blank" class="px-8 py-4 font-semibold rounded-xl transition-colors flex items-center gap-2" style="background-color: var(--fm-surface-raised); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'">
                <i data-lucide="star" class="w-5 h-5"></i>
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}


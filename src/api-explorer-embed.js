/** Demo Swagger UI (Petstore) for the API Explorer doc page. */

const CSS_ID = 'fm-swagger-ui-css';
const BUNDLE_URL = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
const CSS_URL = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
const SPEC_URL = 'https://petstore.swagger.io/v2/swagger.json';

let bundlePromise = null;

function ensureSwaggerCss() {
  if (document.getElementById(CSS_ID)) return;
  const link = document.createElement('link');
  link.id = CSS_ID;
  link.rel = 'stylesheet';
  link.href = CSS_URL;
  document.head.appendChild(link);
}

function ensureSwaggerBundle() {
  if (window.SwaggerUIBundle) return Promise.resolve();
  if (!bundlePromise) {
    bundlePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = BUNDLE_URL;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Swagger UI load failed'));
      document.head.appendChild(s);
    });
  }
  return bundlePromise;
}

/**
 * Appends a live OpenAPI try-it-out panel inside the doc prose column.
 * @param {HTMLElement} proseEl — .prose wrapper
 */
export async function mountApiExplorerEmbed(proseEl) {
  if (!proseEl || proseEl.querySelector('#fm-swagger-ui')) return;

  const wrap = document.createElement('div');
  wrap.className = 'not-prose fm-api-explorer-embed mt-10';
  wrap.innerHTML = `
    <h2 class="text-lg font-semibold mb-2" style="color: var(--fm-text);">Live demo (Swagger UI)</h2>
    <p class="text-sm mb-4" style="color: var(--fm-text-muted);">
      Petstore sample API — illustrates try-it-out. Your Fast app exposes the same style of UI at <code class="text-xs px-1 rounded" style="background: var(--fm-code-bg);">/docs</code> when running locally.
    </p>
    <div id="fm-swagger-ui" class="rounded-xl border overflow-hidden" style="min-height: 420px; border-color: var(--fm-border); background: var(--fm-bg);"></div>
  `;
  proseEl.appendChild(wrap);

  try {
    ensureSwaggerCss();
    await ensureSwaggerBundle();
    window.SwaggerUIBundle({
      dom_id: '#fm-swagger-ui',
      url: SPEC_URL,
      deepLinking: true,
      tryItOutEnabled: true,
    });
  } catch (e) {
    wrap.querySelector('#fm-swagger-ui').innerHTML = `<p class="p-4 text-sm" style="color: var(--fm-error);">Could not load Swagger UI: ${e.message || e}</p>`;
  }
}

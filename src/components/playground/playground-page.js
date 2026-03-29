import { runPlaygroundCode, ensurePyodide } from '../../playground/pyodide-runner.js';

export const DEFAULT_PLAYGROUND_CODE = `from fastmvc import smart_cache

@smart_cache.cached(ttl=60)
async def get_user(id: str):
    return {"id": id, "name": "Demo"}

async def main():
    print("First u1:", await get_user("1"))
    print("Second u1 (cache):", await get_user("1"))
    print("u2:", await get_user("2"))

import asyncio
asyncio.run(main())
`;

export function createPlaygroundPage() {
  return `
    <section class="pt-24 pb-16 min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--fm-text);">Fast Playground</h1>
          <p class="text-lg" style="color: var(--fm-text-muted);">
            Run Python in the browser (Pyodide) with a demo <code class="text-sm px-1 rounded" style="background: var(--fm-code-bg);">fastmvc.smart_cache</code> stub. See cache hits/misses after <strong>Run</strong>; <strong>Benchmark</strong> runs 100 warm calls (expects <code>get_user</code>).
          </p>
        </div>

        <div id="fm-playground-loading" class="mb-4 text-sm rounded-lg px-4 py-3 border hidden" style="color: var(--fm-text-secondary); background: var(--fm-surface-raised); border-color: var(--fm-border);">
          Loading Python runtime (first visit downloads ~20 MB)…
        </div>

        <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--fm-border); background: var(--fm-surface);">
          <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b" style="border-color: var(--fm-border); background: var(--fm-surface-raised);">
            <button type="button" id="fm-playground-run" class="fm-playground-btn fm-playground-btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
              Run
            </button>
            <button type="button" id="fm-playground-bench" class="fm-playground-btn px-4 py-2 rounded-lg text-sm font-semibold border" style="border-color: var(--fm-border); color: var(--fm-text); background: var(--fm-surface);">
              Benchmark
            </button>
            <span class="text-xs ml-auto" style="color: var(--fm-text-muted);">Demo only — not the full fastmvc package</span>
          </div>
          <label for="fm-playground-code" class="sr-only">Playground code</label>
          <textarea id="fm-playground-code" class="fm-playground-editor w-full p-4 font-mono text-sm leading-relaxed resize-y min-h-[280px] border-0 outline-none" style="color: var(--fm-text); background: var(--fm-code-bg);" spellcheck="false" autocomplete="off"></textarea>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-xl border p-4" style="border-color: var(--fm-border); background: var(--fm-surface);">
            <h2 class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--fm-text-muted);">Output</h2>
            <pre id="fm-playground-out" class="font-mono text-xs whitespace-pre-wrap break-words min-h-[4rem] m-0" style="color: var(--fm-text-secondary);"></pre>
          </div>
          <div class="rounded-xl border p-4" style="border-color: var(--fm-border); background: var(--fm-surface);">
            <h2 class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--fm-text-muted);">Cache metrics</h2>
            <p id="fm-playground-metrics" class="font-mono text-sm m-0" style="color: var(--fm-text);">—</p>
          </div>
        </div>

        <p class="mt-8 text-sm" style="color: var(--fm-text-muted);">
          <a href="#" onclick="showPage('docs'); showDocSection('fast-playground'); return false;" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">Fast Playground</a> in the docs explains scope and safety. <a href="#" onclick="showPage('docs'); return false;" class="underline underline-offset-2" style="color: var(--fm-text-secondary);">All documentation</a>
        </p>
      </div>
    </section>
  `;
}

export function mountPlaygroundPage(container) {
  container.innerHTML = createPlaygroundPage();
  const ta = document.getElementById('fm-playground-code');
  const out = document.getElementById('fm-playground-out');
  const metrics = document.getElementById('fm-playground-metrics');
  const loading = document.getElementById('fm-playground-loading');
  if (ta) ta.value = DEFAULT_PLAYGROUND_CODE;

  async function run(mode) {
    out.textContent = '';
    metrics.textContent = '…';
    loading?.classList.remove('hidden');
    try {
      await ensurePyodide();
    } catch (e) {
      loading?.classList.add('hidden');
      out.textContent = `Failed to load Pyodide: ${e && e.message ? e.message : e}`;
      return;
    }
    loading?.classList.add('hidden');

    const result = await runPlaygroundCode(ta.value, mode);
    if (result.ok) {
      out.textContent = result.stdout || '(no output)';
      metrics.textContent = `hits: ${result.hits}   misses: ${result.misses}`;
    } else {
      out.textContent = (result.stdout ? result.stdout + '\n\n' : '') + (result.error || 'Error');
      metrics.textContent = '—';
    }
  }

  document.getElementById('fm-playground-run')?.addEventListener('click', () => run('run'));
  document.getElementById('fm-playground-bench')?.addEventListener('click', () => run('benchmark'));
}

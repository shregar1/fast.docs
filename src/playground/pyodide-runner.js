/** In-browser Python via Pyodide + minimal fastmvc.smart_cache stub (demo only). */

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';

const BOOTSTRAP = `
import sys
from types import ModuleType

STATS = {"hits": 0, "misses": 0}

class SmartCache:
    def cached(self, ttl=60):
        store = {}
        def decorator(fn):
            async def wrapper(*args, **kwargs):
                key = (args, tuple(sorted(kwargs.items())))
                if key in store:
                    STATS["hits"] += 1
                    return store[key]
                STATS["misses"] += 1
                val = await fn(*args, **kwargs)
                store[key] = val
                return val
            return wrapper
        return decorator

smart_cache = SmartCache()
_pkg = ModuleType("fastmvc")
_pkg.smart_cache = smart_cache
sys.modules["fastmvc"] = _pkg
`;

const BENCHMARK_SUFFIX = `

import time

async def _fastx_playground_benchmark():
    n = 100
    t0 = time.perf_counter()
    for _ in range(n):
        await get_user("1")
    t1 = time.perf_counter()
    print(f"Benchmark: {n} x get_user('1') in {(t1 - t0) * 1000:.2f} ms wall time")
    print(f"Cache: hits={STATS['hits']} misses={STATS['misses']}")

# Pyodide runPythonAsync runs inside a running event loop — await, don't asyncio.run().
await _fastx_playground_benchmark()
`;

let pyodidePromise = null;

function toPyInt(pyodide, expr) {
  try {
    const v = pyodide.runPython(expr);
    if (v && typeof v.toJs === 'function') return Number(v.toJs());
    return Number(v);
  } catch {
    return 0;
  }
}

function loadPyodideScript() {
  if (window.loadPyodide) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = PYODIDE_CDN;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Pyodide'));
    document.head.appendChild(s);
  });
}

export async function ensurePyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadPyodideScript();
      const loadPyodide = window.loadPyodide;
      if (!loadPyodide) throw new Error('loadPyodide not available');
      return loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
    })();
  }
  return pyodidePromise;
}

/**
 * @param {string} userCode
 * @param {'run' | 'benchmark'} mode
 * @returns {Promise<{ ok: boolean, stdout: string, error?: string, hits?: number, misses?: number }>}
 */
export async function runPlaygroundCode(userCode, mode) {
  let stdout = '';
  try {
    const pyodide = await ensurePyodide();
    pyodide.setStdout({ batched: (s) => { stdout += s; } });
    pyodide.setStderr({ batched: (s) => { stdout += s; } });

    let full = BOOTSTRAP + '\n' + userCode.trim();
    if (mode === 'benchmark') {
      full += BENCHMARK_SUFFIX;
    }

    await pyodide.runPythonAsync(full);

    const hits = toPyInt(pyodide, "STATS['hits']");
    const misses = toPyInt(pyodide, "STATS['misses']");

    return { ok: true, stdout: stdout.trim(), hits, misses };
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    return { ok: false, stdout: stdout.trim(), error: msg };
  }
}

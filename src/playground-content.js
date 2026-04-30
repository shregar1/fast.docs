/** FastX Playground — in-browser demo (docs section `fast-playground`). */
export const playgroundMarkdown = `# FastX Playground

**FastX Playground** is an **in-browser** environment where visitors can **edit and run** small snippets that use a **demo** \`fastmvc.smart_cache\` stub—see **cache hit/miss** counts and **Benchmark** timing—without installing Python locally.

Open **Playground** from the site header for the **live** Pyodide runner (first load downloads the Python runtime). This page is the **concept** and **safety** reference; the app page runs the code.

---

## What makes it different

Framework docs usually show **static** examples. Django’s tutorial is excellent, but there is **no** first-party **editable, runnable** playground tied to framework primitives (caching, tracing, N+1 demos) in the browser. A **FastX Playground** can:

- Let users **change** \`ttl\`, **call** the same function twice, and **see** cache metrics update.
- Offer **Benchmark** on a **fixed** scenario to compare **cached vs uncached** latency in isolation.
- Reinforce **learning** from **Tutorial series** and **Interactive examples** without a local \`venv\`.

---

## Example session (target UX)

\`\`\`python
from fastx_mvc import smart_cache

@smart_cache.cached(ttl=60)
async def get_user(id: str):
    return {"id": id, "name": "Demo"}
\`\`\`

- **Run** — execute in WASM Python; show **stdout**, **errors**, and **framework hooks** you expose (e.g. cache stats).
- **Benchmark** — run the handler **N** times and chart **p50/p95** or simple **before/after** when toggling cache (same process, deterministic seed).

Snippets should stay **small** and **curated**—not a general REPL for arbitrary packages.

---

## Technical approach (sketch)

- **Pyodide** (CPython in WebAssembly) is the common path; load a **trimmed** wheel set and **prebuilt** \`fastmvc\` stubs or a **demo** subset that matches what you can legally ship to the client.
- **Async** — align with what Pyodide supports in the browser event loop; otherwise provide **sync** demos first.
- **No secrets** — playground runs **without** user API keys; any “API call” is **mocked** or hits a **sandbox** endpoint you control.
- **Rate limits** — per-IP or per-session caps so the site isn’t abused as a free compute farm.

---

## Safety and scope

- **Network:** block or strictly allowlist outbound calls from user code.
- **CPU / memory:** cap **wall time** and **heap**; kill runaway loops.
- **Truthfulness:** label metrics as **demo** / **synthetic** so they aren’t mistaken for production observability.

---

## Related

- **Interactive examples** — copy-paste workflow today.
- **Smart Caching** — real decorator behavior in an app.
- **Performance guide** — how to measure in production.`;

/** API Explorer — interactive reference (docs section `api-explorer`). */
export const apiExplorerMarkdown = `# API Explorer

The **API Explorer** is an **interactive** view of Fast’s **decorators**, **helpers**, and **runtime APIs**: parameters, **type hints**, **return types**, and **sync vs async** examples in one place—with optional **try-it-out** calls when a safe backend is available.

Below the sections on this page, a **live Swagger UI** (Petstore demo) loads so you can use **Try it out** in the browser. Your own FastAPI app serves the same style of UI at \`/docs\` when running locally.

---

## Decorators and parameters

**Goal:** every public **decorator** (e.g. caching, N+1 detection, tracing, cost tracking) appears with:

- **Signature** — parameters, defaults, and **keyword-only** args.
- **Semantics** — what it wraps and when it runs (before/after handler, request scope).
- **Cross-links** — to the long-form feature page.

An explorer UI would **group** decorators by domain (HTTP, persistence, observability) and allow **filter** by name or tag.

---

## Sync vs async examples

**Goal:** one-click **toggle** (or tabs) between **sync** and **async** usage where both are supported, so users can paste the variant that matches their route and event loop.

Patterns:

- **Async-first** handlers with \`async def\` and \`await\` on I/O.
- **Sync** handlers where the stack is synchronous and the library allows it—call out **thread pool** or **blocking** caveats when relevant (**HTTP & API**, feature docs).

---

## Type hints and return values

**Goal:** surface **annotations** from the **source of truth** (stubs or runtime introspection where safe):

- **Parameters** — \`str\`, \`UUID\`, \`Depends()\`, generics (\`list[User]\`).
- **Returns** — response models, \`JSONResponse\`, \`StreamingResponse\`.
- **Exceptions** — which **\`fast.errors.*\`** or HTTP errors can propagate (**Error reference**).

Static docs already show snippets; an explorer adds **expand/collapse** and **copy** for signatures.

---

## Test API calls directly

**Goal:** “Try it” sends a **real** request against a **configured** base URL (your **staging** or a **sandbox**), with:

- **Auth** — bearer token, API key, or cookie (never default to production).
- **Body / query** — form fields generated from the **OpenAPI** schema when available.
- **Rate limits** — client-side throttling and clear **errors** when the server refuses.

**Safety:** disable **mutating** methods in public sandboxes or require **explicit** confirmation; never embed **secrets** in the client bundle.

For **FastAPI** apps, the same experience often comes from **\`/docs\` (Swagger UI)** or **\`/redoc\`** in development—link those from **HTTP & API** and treat the **API Explorer** as a **curated** view over **Fast-specific** decorators and helpers, not a replacement for generic OpenAPI UIs.

---

## Related

- **API Reference** — module- and class-level listings.
- **HTTP & API** — routing, OpenAPI, status codes.
- **Interactive examples** — copy-paste flows on the home page.
- **OpenAPI** / **Swagger** / **Scalar** — generic interactive docs for your running app.`;

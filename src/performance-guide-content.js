/** Performance optimization guide (docs section `performance-guide`). */
export const performanceGuideMarkdown = `# Performance optimization guide

Use this page as a **checklist** for latency, throughput, and cost. It complements **Persistence**, **Smart Caching**, **N+1 Detection**, **Production**, and **Distributed Tracing**—read those for framework-specific knobs; here we focus on **patterns** and **tradeoffs**.

---

## Database query optimization

### Eager loading patterns

**Problem:** Lazy-loaded relationships cause **N+1** queries when you touch collections in loops (**N+1 Detection**).

**Approaches:**

- **\`selectinload\`** — one extra \`IN (…)\` query for related rows; great for collections.
- **\`joinedload\`** — single SQL join; watch for **row multiplication** on wide joins.
- **Explicit two-step** — load ids first, then batch-fetch children; sometimes clearer than ORM magic.

**Rule of thumb:** load **what this request needs**—not the whole object graph. Prefer **narrow** columns and **pagination** on large lists.

### Connection pooling

**Why:** Opening a new DB connection per request **dominates** latency at scale.

**Practices:**

- Size the pool from **measured** concurrency (requests × workers × avg query time), not guesses.
- Set **timeouts** and **max overflow** so slow queries **fail fast** instead of exhausting the pool (**Production**, **Persistence**).
- Use **one pool per process**; avoid sharing pools across unrelated apps.

### Read replicas

**When:** Read-heavy workloads and **acceptable replication lag** (seconds or less, depending on product).

**Practices:**

- Route **reporting** and **list** endpoints to **replicas**; keep **writes** on the primary.
- **Session** or **request** affinity: don’t read-your-writes from a replica until you know lag is acceptable—or use **primary** for reads that must follow a write.
- Monitor **replica lag**; alert when it exceeds your **SLA** for stale data.

---

## Caching strategies

### Cache-aside vs write-through

| Pattern | Write path | Read path | Best for |
| --- | --- | --- | --- |
| **Cache-aside** | Update DB; **invalidate** or **lazy-fill** cache | Miss → load DB → populate cache | Most APIs; simple mental model |
| **Write-through** | Write **through** cache and DB (or queue) together | Fast reads; consistent if done carefully | Hot keys; lower stale risk |

Fast’s **Smart Caching** helpers often align with **cache-aside** plus **tags** and **TTL**. Choose **write-through** when **stale reads** are unacceptable for specific keys and you can afford the complexity.

### Cache key design

**Do:**

- Include **version**, **tenant**, **locale**, or **feature flags** in the key when they affect output.
- Use **stable** string serialization (sorted query params, canonical JSON).
- Keep keys **short** but **unambiguous**—hash long payloads if needed.

**Don’t:**

- Keys that **silently collide** across tenants or users.
- Unbounded **cardinality** (e.g. raw timestamps in keys) without **TTL**—memory explodes.

### Invalidation patterns

- **TTL only** — simple; risk **stale** data until expiry.
- **Event / tag invalidation** — invalidate when entities change (**Smart Caching**, topic guides).
- **Stale-while-revalidate** — serve **stale** while refreshing in background for **read-heavy** endpoints.

**Narrow** invalidation beats **flush everything** for latency and thundering herds.

---

## Memory optimization

- **Stream** large responses (files, CSV) instead of buffering entire bodies in memory (**HTTP & API**).
- **Pagination** and **cursors** for list endpoints—never unbounded \`SELECT *\` into Python lists.
- **Pool** heavy objects (HTTP clients, parsers) at **process** scope; avoid per-request allocation of **large** buffers.
- **Profile** memory in staging under **realistic** concurrency (\`tracemalloc\`, heap dumps, APM)—**Distributed Tracing** and **Cost Tracking** help attribute usage to routes.

---

## Benchmarking your API

1. **Define SLOs** — p50/p95 latency and error rate per **route** or **user journey**.
2. **Baseline** in an environment that matches **prod** (CPU, DB latency, TLS).
3. **Load tools** — \`hey\`, \`k6\`, Locust, or cloud load generators; ramp **gradually** and watch **DB** and **cache** saturation.
4. **Change one thing** at a time (pool size, cache TTL, index)—otherwise you won’t know what helped.
5. **Record** results in your **Changelog** or internal runbooks when you ship optimizations.

**Avoid:** benchmarking **only** on a laptop DB or **empty** tables—numbers won’t transfer.

---

## Related

- **Persistence** — SQLAlchemy, migrations, transactions.
- **N+1 Detection** — catching query anti-patterns early.
- **Smart Caching** — decorators, TTL, invalidation.
- **Production** — workers, timeouts, observability.
- **Distributed Tracing** — where time goes per request.`;

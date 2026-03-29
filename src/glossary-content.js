/** Glossary & concepts (docs section `glossary`). */
export const glossaryMarkdown = `# Glossary & concepts

Short definitions for terms used across this documentation. Follow the **Related** links for full guides.

---

## Stale-while-revalidate (SWR)

A **caching** strategy where a **stale** (expired-TTL) value may still be **returned immediately** while a **background refresh** fetches a fresh value. Readers get **low latency**; freshness is **eventually** restored. Tune **TTL**, **stale window**, and **invalidation** to match how wrong a stale read can be (**Smart Caching**, **Performance guide**).

---

## Thundering herd

When many **clients** or **workers** react to the same event (e.g. cache **expiry** or **wake**) and **hammer** a shared resource (database, origin server) at once. **Mitigations:** jittered delays, **single-flight** (only one refresh), **rate limits**, **queues**, or **warm** caches before traffic spikes (**Performance guide**).

---

## Cache stampede

A severe form of **thundering herd** on a **cache miss**: many concurrent requests miss the same key, each tries to **recompute** or **reload** the value, overloading the **backing store**. **Mitigations:** **locking** or **lease** per key so only one recomputation runs, **early expiration** with background refresh, or **probabilistic early refresh** before TTL expires (**Smart Caching**).

---

## Distributed tracing spans

A **span** is one **unit of work** in a **trace** (e.g. “HTTP request”, “SQL query”, “outbound HTTP call”). Spans have **start/end time**, **parent/child** links forming a **tree**, and **attributes** (route, status, cost). **Distributed** means spans can cross **processes** and **services** via propagated **context** (**Distributed Tracing**).

---

## Saga compensation

In a **saga**, a **compensating action** **undoes** a prior step when a **later** step fails (e.g. **refund** after a failed **capture**). **Compensation** should be **idempotent** and **retry-safe**; if compensation itself fails, you may need **manual** reconciliation or **outbox** retries (**Saga Pattern**).

---

## N+1 query

An **ORM** or **lazy-loading** pattern where loading **N** parent rows leads to **N** additional queries for **children** (one per row) instead of **one or two** batched queries. **Fixes:** **eager loading** (\`selectinload\` / \`joinedload\`), **explicit** batch queries, or **detectors** that flag the pattern (**N+1 Detection**, **Persistence**).

---

## Related

- **Topic guides** — conceptual overviews.
- **Smart Caching**, **N+1 Detection**, **Distributed Tracing**, **Saga Pattern** — feature references.
- **Performance guide** — tuning and benchmarking.`;

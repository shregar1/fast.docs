/** Error reference — fast.errors.* (docs section `error-reference`). */
export const errorReferenceMarkdown = `# Error reference

Structured **library and runtime errors** from the \`fast.errors\` namespace (or re-exported from feature packages). Each entry follows the same layout:

1. **What it means** — why the framework raised it.
2. **Example code triggering it** — the shape of the mistake or condition.
3. **How to fix** — three practical approaches where possible.
4. **When to ignore** — edge cases where the signal is expected or benign.

Exact **message strings** may include minor version-specific wording; use the **exception class** and **attribute names** as the stable contract. Add new entries here as you ship.

---

## \`fast.errors.NPlus1Detected\`

**What it means**

The **N+1 detector** observed a **lazy relationship** or repeated query pattern inside a request: loading a collection then issuing **one query per row** (or an equivalent pattern) instead of one batched query or eager load. The guard raises (or logs, depending on configuration) **before** your app becomes slow under load.

**Example code triggering it**

\`\`\`python
# Anti-pattern: implicit lazy load in a loop
async def list_users_with_roles(session):
    users = await session.execute(select(User))
    for user in users.scalars():
        _ = user.roles  # triggers a query per user → N+1
\`\`\`

**How to fix (three approaches)**

1. **Eager loading** — use \`selectinload\`, \`joinedload\`, or equivalent on the **initial** query so roles (or children) load in **one or two** round-trips (**Persistence**, **N+1 Detection**).
2. **Batch / separate query** — load all user ids, then fetch **all roles** for those ids in a **second** query and map in memory.
3. **Scope the detector** — narrow \`@detect_nplus1\` to routes or services where you are actively fixing queries, or adjust **thresholds** so tests catch regressions without blocking known hot paths (see feature docs).

**When to ignore (edge cases)**

- **Admin / one-off scripts** that process **tiny** datasets (e.g. &lt;10 rows) where latency is irrelevant—still prefer explicit loads for consistency.
- **Tests** that intentionally use lazy loading to verify **ORM** behavior—use **markers** or disable the detector for that module.
- **False positives** from **dynamic** access patterns—document the exception and add a **tracked** issue or narrow the detector scope.

---

## \`fast.errors.CacheInvalidationConflict\`

**What it means**

**Smart Caching** tried to invalidate or refresh keys that participate in a **dependency graph** or **tag** set, and two **writers** (or a writer and a stale reader) produced an **inconsistent** view—e.g. a key was invalidated while a **stale-while-revalidate** response was still being served.

**Example code triggering it**

\`\`\`python
# Concurrent invalidate + read while SWR window overlaps
@smart_cache.cached(ttl=60, stale_while_revalidate=30)
async def get_report(org_id: str) -> Report:
    ...

# Another request calls invalidate_all("report:*") while SWR refresh is in flight
\`\`\`

**How to fix (three approaches)**

1. **Serialize** invalidations for the same **key space** (queue, lock, or single-threaded worker) for the affected resource.
2. **Narrow tags** so invalidation doesn’t sweep unrelated keys mid-flight.
3. **Disable SWR** for highly contended keys (TTL-only) until you have a clear invalidation story (**Smart Caching**).

**When to ignore (edge cases)**

- **Low-traffic** internal dashboards where **eventual consistency** is acceptable.
- **Tests** that simulate race conditions—assert on **final** state, not intermediate errors.

---

## \`fast.errors.TraceContextMissing\`

**What it means**

Code that expects an **active span** or **trace context** (e.g. **OpenTelemetry** baggage) ran **outside** a traced request—often in a **background task**, **cron**, or **thread pool** without propagating context.

**Example code triggering it**

\`\`\`python
async def background_job():
    tracer.start_span("job")  # no parent context when not propagated from request
\`\`\`

**How to fix (three approaches)**

1. **Propagate** context when scheduling work: pass **trace context** or \`Context.run\` into the **async** task or worker.
2. **Start a root span** explicitly for batch jobs and **link** to business ids (tenant, job id) as attributes.
3. **Guard** optional code: **if** tracing is enabled **and** context exists, **then** enrich spans (**Distributed Tracing**).

**When to ignore (edge cases)**

- **Local scripts** and **REPL** sessions that never attach to a trace.
- **Unit tests** that mock tracing and assert **without** a full OTel stack.

---

## \`fast.errors.SagaCompensationFailed\`

**What it means**

A **saga** step **failed** after earlier steps **committed**, and **compensation** (rollback) for a prior step **also failed**—leaving the system in a **partial** state that requires **manual** or **reconciled** repair.

**Example code triggering it**

\`\`\`python
# Payment captured, then inventory release fails; compensation to refund payment fails (gateway down)
\`\`\`

**How to fix (three approaches)**

1. **Idempotent compensation** — retries with **deduplication** keys so partial replays are safe (**Saga Pattern**).
2. **Outbox / queue** — move compensation to a **reliable** worker with retries and dead-letter.
3. **Human workflow** — alert + admin tool to **complete** or **abort** the saga with a **known** state machine.

**When to ignore (edge cases)**

- You **should not** ignore this in production—**always** treat as **incident**-level; “ignore” only in **simulations** where you inject failure to test **recovery**.

---

## How to extend this reference

When you add a **new** \`fast.errors.*\` exception:

- Register it in **this page** with the four sections above.
- Link **feature docs** (e.g. **N+1 Detection**) and **Troubleshooting** for operational runbooks.
- Keep **HTTP mapping** (4xx/5xx) in **HTTP & API** if the error surfaces to clients.

## Related

- **Troubleshooting** — general debugging and logs.
- **HTTP & API** — error shapes and status codes.
- **N+1 Detection**, **Smart Caching**, **Distributed Tracing**, **Saga Pattern** — feature-specific behavior.`;

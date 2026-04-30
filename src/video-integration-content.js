/** Video integration — explainers, CLI, architecture (docs section `video-integration`). */
export const videoIntegrationMarkdown = `# Video integration

Short videos complement the written docs: **explainers** for dense topics, **CLI screen recordings** for muscle memory, and **architecture walkthroughs** for how pieces fit together. This page describes the **formats** and **topic map**; embeds or links will point to the official channel when clips are published.

---

## Explainer videos (about 2–3 minutes)

**Goal:** one **concept** or **decision** per video—enough to unblock someone skimming the docs.

**Planned themes** (examples):

- **Smart caching** — TTL vs invalidation vs stale-while-revalidate in one request flow.
- **N+1 detection** — what the detector sees, and how eager loading fixes it.
- **Saga vs single DB transaction** — when compensation matters.
- **Tracing spans** — from HTTP to DB in one trace.

Keep visuals **simple** (diagram + code highlight); link **Related** pages below each clip description on the channel.

---

## CLI screen recordings

**Goal:** show **real terminals**—install, \`fastx generate\`, \`fastx run\`, and common flags.

**Planned clips:**

- **Install** — \`pip install fastx-cli\`, \`fastx --version\`.
- **Scaffold** — \`fastx generate\` with a minimal project, **cd**, **run**.
- **Day-two** — migrations, env files, or **one** subcommand from **CLI reference** per video.

Use **large font**, **slow typing**, and **no secrets** in the shell. Pair each recording with the matching **CLI reference** section.

---

## Architecture walkthroughs

**Goal:** **zoomed** views of **Project layout**—controllers → services → repositories, plus where **middleware**, **caching**, and **tracing** sit.

**Formats:**

- **Whiteboard** or **diagram** + voiceover (5–10 minutes for deeper dives).
- **Repo tour** — open generated files and follow **one request** end to end.

Cross-link **Best practices & patterns** and **Distributed Tracing** so viewers can go deeper in text.

---

## Where to watch

Published videos will be linked from **Introduction**, **Tutorial series**, and relevant feature pages as they go live. **Subscribe** or **watch** the official FastX / fastmvc channel on your platform of choice (link to be added in the site header or footer when available).

This static docs site does **not** host video files; it will **embed** or **link** to external players for performance and accessibility (captions, speed control).

---

## Related

- **Interactive examples** — copy-paste and local **Try it** flow.
- **Tutorial series** — narrative that videos can mirror.
- **CLI reference** — commands shown in recordings.
- **Best practices & patterns** — layers and boundaries for architecture videos.`;

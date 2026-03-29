/** Community & resources (docs section `community`). */
export const communityMarkdown = `# Community & resources

Fast grows with **people building on it**. This page collects **showcase** entries, **case studies**, **extensions**, a **community cookbook**, and pointers for **contributing**—submit links and recipes as your ecosystem matures.

---

## Showcase (apps built with Fast)

**Goal:** highlight **real** products and APIs that use Fast (or fastmvc-cli–generated stacks) so newcomers can see patterns in the wild.

**How to list an app** (when you open submissions):

- **Name** and **one-line** description.
- **Stack** (Python version, DB, hosting region if relevant).
- **Link** — landing page or public API docs (no login-only demos unless noted).

*No public submissions wired in this doc snapshot—add a form or GitHub Discussion template when ready.*

---

## Case studies

**Goal:** deeper **narratives**: problem, constraints, how Fast features (caching, tracing, sagas) showed up in the solution, and **metrics** before/after where possible.

**Outline for each study:**

1. **Context** — team size, traffic, compliance.
2. **Architecture** — services, data stores, deployment.
3. **Fast-specific** — which modules you adopted and what you’d do differently.

*Placeholder for curated write-ups—link from the blog or main site when published.*

---

## Third-party extensions

**Goal:** **plugins**, **CLI extensions**, **middleware packs**, and **integrations** maintained **outside** the core repo.

**Listing criteria** (suggested):

- **Open license** and **documented** install steps.
- **Version range** of \`fastmvc-cli\` / Fast libraries tested against.
- **Support** channel (issues, Discord, etc.).

Examples might include custom **observability** exporters, **auth** bridges, or **codegen** templates—keep the list **short** and **vetted** to avoid abandoned projects.

---

## Community cookbook (user recipes)

**Goal:** **short**, **copy-paste** recipes for tasks that don’t need a full guide: snippets, \`Justfile\` targets, **pytest** fixtures, **Docker** patterns.

**Formats:**

- **Title** + **When to use** + **Steps** + **Caveats**.
- Prefer **minimal** dependencies; link to **How-to guides** for full tutorials.

Contributions can live in **GitHub Discussions**, a **wiki**, or a \`cookbook/\` folder in docs—pick one workflow and link it here.

---

## Contributing guide

**Goal:** lower the bar for **docs**, **bug reports**, and **code** contributions.

**Typical sections** (mirror the main repo’s \`CONTRIBUTING.md\` when it exists):

1. **Code of conduct** — respectful collaboration.
2. **Reporting issues** — minimal repro, version (\`fast --version\`, Python), logs.
3. **Pull requests** — branch naming, tests, changelog entry.
4. **Documentation** — Markdown in this site; run the local **Vite** dev server for previews.

**Repository:** [github.com/shregar1/fast.mvc](https://github.com/shregar1/fast.mvc) — confirm **default branch** and **issue labels** on the upstream project.

---

## Related

- **Introduction** — what Fast is.
- **Tutorial series** — guided learning path.
- **Migration guides** — when upgrading dependencies or frameworks.
- **Changelog** — release cadence and breaking changes.`;

/** Standalone architecture page (Mermaid rendered via home-mermaid.js). */

const MERMAID_SYSTEM = `flowchart TB
  subgraph clients["Clients"]
    WEB[Web applications]
    API[Mobile / Partner APIs]
  end

  subgraph mvc["FastMVC Core"]
    subgraph layers["Layered Architecture"]
       Richtung[MVC Architecture Flow]
       Richtung --- MW[Middleware Stack]
       MW --> CTRL[Controllers]
       CTRL --> SVC[Business Services]
       SVC --> REPO[Repositories]
       REPO --> ENT[Entities / Aggregates]
    end

    subgraph infra["Fast Infrastructure"]
      CACHE[smart_cache]
      TR[tracer]
      OTEL[OpenTelemetry]
    end

    infra -.-> layers
  end

  DB[(Persistence / Redis)]
  REPO --> DB
  clients --> MW`;

const MERMAID_REQUEST_FLOW = `sequenceDiagram
  autonumber
  participant Client
  participant MW as fast-middleware
  participant Ctrl as IController
  participant Svc as IService (Business Logic)
  participant Res as Result Pattern
  participant Repo as IRepository

  Client->>MW: HTTP Request (auth, rate-limit, URN)
  MW->>Ctrl: handle(request, body)
  Ctrl->>Svc: Business Operation (with Context)
  Svc->>Repo: Repository Query (CRUD)
  Repo-->>Svc: Success / Failure Result
  Svc->>Res: Wrap Failure or Map Success
  Svc-->>Ctrl: Result[T, E]
  Ctrl->>MW: IResponseDTO Envelope
  MW-->>Client: 200 OK + Transaction URN`;

const MERMAID_CACHE_TREE = `flowchart TD
  START([Handler with optional cache])
  START --> Q1{Expensive to compute or fetch?}
  Q1 -->|No| SKIP[Skip cache — measure first]
  Q1 -->|Yes| Q2{Readers OK with brief staleness?}
  Q2 -->|No| TTL[Short TTL + request coalescing]
  Q2 -->|Yes| SWR[TTL + stale-while-revalidate + herd dedupe]
  TTL --> APPLY[Add @smart_cache.cached with explicit keys]
  SWR --> APPLY
  SKIP --> END([Ship])
  APPLY --> END`;

function diagramBlock(step, title, description, mermaidSource) {
  return `
    <article class="fm-arch-diagram">
      <div class="fm-arch-diagram__head">
        <span class="fm-arch-diagram__step" aria-hidden="true">${step}</span>
        <div>
          <h2 class="fm-arch-diagram__title">${title}</h2>
          <p class="fm-arch-diagram__desc">${description}</p>
        </div>
      </div>
      <div class="fm-mermaid-block fm-mermaid-block--page rounded-2xl border overflow-x-auto" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
        <pre class="mermaid">${mermaidSource}</pre>
      </div>
    </article>
  `;
}

export function createArchitecturePage() {
  return `
    <div class="fm-arch-page">
      <header class="fm-arch-page__hero">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <a href="?page=home" onclick="event.preventDefault(); showPage('home');" class="fm-arch-page__back inline-flex items-center gap-2 text-sm font-medium mb-8 md:mb-10">
            <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
            Back to home
          </a>
          <p class="fm-arch-page__eyebrow">Visual reference</p>
          <h1 class="fm-arch-page__title">
            Architecture <span class="fm-arch-page__title-accent">&amp; data flow</span>
          </h1>
          <p class="fm-arch-page__lede">
            System shape, a typical request path through the stack, and a practical decision guide for caching — designed for onboarding and design reviews.
          </p>
          <ul class="fm-arch-page__pillrow" aria-label="Topics on this page">
            <li>System topology</li>
            <li>Request lifecycle</li>
            <li>Caching decisions</li>
          </ul>
        </div>
      </header>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div id="fm-architecture-section" class="fm-arch-page__diagrams">
          ${diagramBlock(
            '01',
            'System architecture',
            'Clients reach your FastAPI surface; controllers orchestrate domain work while decorators and utilities add caching, tracing, N+1 awareness, and field encryption without scattering boilerplate.',
            MERMAID_SYSTEM
          )}
          ${diagramBlock(
            '02',
            'Request data flow',
            'One request moves through routing and middleware into your controller. Cache decorators short-circuit hot paths; otherwise the ORM runs and results can be written back through the cache layer.',
            MERMAID_REQUEST_FLOW
          )}
          ${diagramBlock(
            '03',
            'Which caching strategy?',
            'Start from cost and consistency: prove you need a cache, then choose TTL and stale policy from how fresh responses must be.',
            MERMAID_CACHE_TREE
          )}
        </div>

        <aside class="fm-arch-page__cta rounded-2xl border overflow-hidden mt-16 md:mt-24" style="background-color: var(--fm-surface); border-color: var(--fm-border);">
          <div class="fm-arch-page__cta-inner px-6 py-10 md:px-10 md:py-12 text-center md:text-left md:flex md:items-center md:justify-between md:gap-8">
            <div class="max-w-xl">
              <h2 class="text-lg font-semibold mb-2" style="color: var(--fm-text);">Implement what you see</h2>
              <p class="text-sm leading-relaxed" style="color: var(--fm-text-muted);">
                Follow the docs for controllers, decorators, and deployment patterns that match these diagrams.
              </p>
            </div>
            <div class="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 justify-center md:justify-end flex-shrink-0">
              <a href="?page=docs" onclick="event.preventDefault(); showPage('docs');" class="fm-arch-page__btn fm-arch-page__btn--primary">
                Documentation
                <i data-lucide="book-open" class="w-4 h-4" aria-hidden="true"></i>
              </a>
              <a href="https://github.com/shregar1/fast.mvc" target="_blank" rel="noopener noreferrer" class="fm-arch-page__btn fm-arch-page__btn--ghost">
                GitHub
                <i data-lucide="github" class="w-4 h-4" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

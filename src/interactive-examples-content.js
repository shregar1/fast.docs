import apiTestDemoApp from '../examples/api-test-demo/app.py?raw';
import apiTestDemoTest from '../examples/api-test-demo/test_api.py?raw';

/** Interactive examples & Try it workflow (docs section `interactive-examples`). */
export const interactiveExamplesMarkdown = `# Interactive examples

Use **Try it** and **Copy** on the home page to move from the docs into a real project quickly. Full **in-browser execution** (WASM Python or a hosted playground) can be layered on later; today the workflow is **copy → local terminal**.

## Tested API building & usage

The repo ships a **minimal FastAPI app plus pytest** you can run as-is. The listings below are **exactly** the files under \`examples/api-test-demo/\` (nothing invented in the docs).

**Run:**

\`\`\`bash
cd examples/api-test-demo
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
pytest -q
\`\`\`

### \`app.py\`

\`\`\`python
${apiTestDemoApp.trimEnd()}
\`\`\`

### \`test_api.py\`

\`\`\`python
${apiTestDemoTest.trimEnd()}
\`\`\`

Home page **Classes** / **Functions** tabs use **\`examples/verified/home_class_style.py\`** and **\`home_function_style.py\`** — same pattern (pytest: \`examples/verified/\`).

## Try it (home page)

On the **example** and **Write Less** preview windows:

- **Try it** — Copies a **terminal quickstart** plus the sample code so you can paste into a shell and editor after \`fast generate\`.
- **Copy** — Copies **only** the Python snippet (ready for your IDE).

Run the commands in your own environment—no code runs inside the docs site.

## Suggested local flow

\`\`\`bash
pip install fastmvc-cli
fast generate my_app
cd my_app
fast run
\`\`\`

Then align the copied snippet with your **services** and **repositories** (**Project layout**, **Tutorial series**).

## Run in the browser

- **Playground** (site header) — **Pyodide** + demo \`fastmvc.smart_cache\`; **Run** and **Benchmark** with cache hit/miss metrics. See **Fast Playground** in the docs for scope.

Possible additions:

- **Pyodide** (Python in WebAssembly) for tiny, isolated snippets with a restricted stdlib.
- **API playground** — call a hosted demo API from the browser with your JWT or API key (**API Explorer** for the interactive reference story).
- **Notebook export** — one-click **Colab** / **Deepnote** link with the same code.

If you add a playground, keep secrets out of the client and rate-limit public endpoints.

## Related

- **Testing** — fixtures, overrides, and decorated routes.
- **HTTP & API surface** — routers, \`Depends\`, OpenAPI.
- **Fast Playground** — in-browser vision and engineering notes.
- **API Explorer** — interactive API reference (try-it-out, decorators, types).
- **CLI reference** — \`fast\` commands.
- **Installation** — \`pip install fastmvc-cli\`.
- **Tutorial series** — guided build.`;

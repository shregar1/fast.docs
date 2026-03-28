/** Interactive examples & Try it workflow (docs section `interactive-examples`). */
export const interactiveExamplesMarkdown = `# Interactive examples

Use **Try it** and **Copy** on the home page to move from the docs into a real project quickly. Full **in-browser execution** (WASM Python or a hosted playground) can be layered on later; today the workflow is **copy → local terminal**.

## Try it (home page)

On the **example.py** and **main.py** preview windows:

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

## Future: run in the browser

Possible additions (not shipped here yet):

- **Pyodide** (Python in WebAssembly) for tiny, isolated snippets with a restricted stdlib.
- **API playground** — call a hosted demo API from the browser with your JWT or API key.
- **Notebook export** — one-click **Colab** / **Deepnote** link with the same code.

If you add a playground, keep secrets out of the client and rate-limit public endpoints.

## Related

- **CLI reference** — \`fast\` commands.
- **Installation** — \`pip install fastmvc-cli\`.
- **Tutorial series** — guided build.`;

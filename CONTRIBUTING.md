# Contributing to fast.docs

Thank you for helping improve the Fast documentation site.

## Local setup

```bash
git clone https://github.com/shregar1/fast.docs.git
cd fast.docs
npm install
npm run dev
```

The dev server defaults to port **3000**. Edit Markdown-backed content under `src/` (see `src/content.js` and related `*-content.js` modules).

## Pull requests

- Keep changes focused on documentation or site behavior; match existing style and formatting.
- Run `npm run build` before submitting to ensure the production bundle succeeds.
- Reference related issues when applicable.

## Code of conduct

All contributors must follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

Do **not** open public issues for undisclosed vulnerabilities. See [SECURITY.md](./SECURITY.md).

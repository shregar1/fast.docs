# Fast Documentation Site

Beautiful, modern documentation site built with Vite and Tailwind CSS.

**Purpose:** This repository is maintained as a **non-commercial**, **community** and **educational** documentation project for the Fast ecosystem—not a commercial product, paid support offering, or storefront. Use this sentence when describing the project on Netlify’s Open Source Program or similar forms.

## Features

- ⚡ **Vite** - Lightning fast development and building
- 🎨 **Tailwind CSS** - Beautiful, customizable styling
- 📱 **Responsive** - Works on all devices
- 🌙 **Dark Theme** - Elegant dark mode design
- 🔍 **Search** - Built-in documentation search
- 📝 **Markdown** - Content written in Markdown

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

The repo includes `netlify.toml` (build + publish + security headers), `public/_redirects` for SPA routing, an OSI-approved **MIT** `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, and `SECURITY.md`. The footer uses Netlify’s **official badge** plus a text link to [netlify.com](https://www.netlify.com). **[Dependabot](https://docs.github.com/dependabot)** updates npm dependencies weekly; **`.gitattributes`** marks `dist/` and `node_modules/` as `export-ignore` for `git archive`. OpenSSF / REUSE badges are optional. When applying for Netlify’s Open Source Program, use the purpose statement above and this repo’s license/CoC links.

**Deploy previews / branch builds:** With the Git repo [connected to Netlify](https://docs.netlify.com/start/quickstart/), each pull request usually receives a **unique deploy preview URL** automatically (no extra `netlify.toml` entry required). Turn **Deploy Previews** on under Site configuration → Build & deploy → Deploy contexts if your team disabled them.

### GitHub Pages

```bash
npm run build
git add dist && git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## Related — Fast repo

The **framework** and canonical **`_maint`** tooling (including the same commit-history script) live in the sibling checkout:

| | |
|--|--|
| **Local path** | `../fast_mvc` |
| **GitHub** | https://github.com/shregar1/fast.mvc |

This repo’s **`_maint/scripts/git_log_recorder.py`** and **`.pre-commit-config.yaml`** (`post-commit`) follow that project. Install hooks:

```bash
pip install pre-commit
pre-commit install
pre-commit install --hook-type post-commit
```

See **`_maint/README.md`** for details.

## Project Structure

```
docs-site/
├── _maint/scripts/     # git_log_recorder.py (commit history → GIT_METADATA.json)
├── .pre-commit-config.yaml
├── index.html          # Main HTML file
├── src/
│   ├── main.js         # Main JavaScript entry
│   ├── content.js      # Documentation content
│   └── style.css       # Tailwind styles
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── vite.config.js      # Vite configuration
└── postcss.config.js   # PostCSS configuration
```

## Adding Content

Edit `src/content.js` to add or modify documentation sections.

## Customization

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

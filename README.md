# FastMVC Documentation Site

Beautiful, modern documentation site built with Vite and Tailwind CSS.

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

### GitHub Pages

```bash
npm run build
git add dist && git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## Related — FastMVC repo

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

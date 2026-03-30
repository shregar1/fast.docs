import { defineConfig, loadEnv } from 'vite'

/** Netlify sets URL / DEPLOY_PRIME_URL during build — no manual VITE_SITE_URL required. */
function resolveSiteUrl(mode, env) {
  const fromFile = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  const fromNetlify = (process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(/\/$/, '')
  const merged = fromFile || fromNetlify
  if (merged) return merged
  if (mode === 'development') return 'http://localhost:3000'
  return 'https://fast-docs.netlify.app'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = resolveSiteUrl(mode, env)
  const clientSiteUrl = (env.VITE_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(
    /\/$/,
    ''
  )

  return {
    base: './',
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(clientSiteUrl),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      {
        name: 'inject-seo-site-url',
        transformIndexHtml(html) {
          return html.replace(/__SEO_SITE_URL__/g, siteUrl)
        },
      },
    ],
  }
})

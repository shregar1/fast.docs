import { defineConfig, loadEnv } from 'vite';
import { resolveClientSiteUrl, resolveSiteUrlForHtml } from './scripts/site-url.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = resolveSiteUrlForHtml(mode, env);
  const clientSiteUrl = resolveClientSiteUrl(env);

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
          return html.replace(/__SEO_SITE_URL__/g, siteUrl);
        },
      },
    ],
  };
});

import { content } from './content.js';
import { P2_SECTIONS } from './p2-content/index.js';
import { initTheme } from './theme.js';
import { initCommandPalette } from './command-palette.js';
import { dismissAppSplash } from './splash-screen.js';
import { registerHomeCodeGlobals } from './app/home-code.js';
import { refreshLucideIcons } from './app/highlight-lucide.js';
import {
  initExploreDropdown,
  initMobileMenu,
  initSkipLinkFocus,
  setNavSearchKbdHint,
  registerNavGlobals,
} from './app/nav-shell.js';
import { initDocContentClickDelegation } from './app/doc-body-delegation.js';
import { registerAppRoutes } from './app/show-page.js';
import { applyRouteFromUrl } from './app/route-bootstrap.js';

Object.assign(content, P2_SECTIONS);

initTheme();
registerHomeCodeGlobals();
registerNavGlobals();

/** Icons in static HTML (nav, footer) — main content icons are hydrated after each render. */
lucide.createIcons();

initExploreDropdown();
initMobileMenu();
initSkipLinkFocus();
setNavSearchKbdHint();

registerAppRoutes();
initDocContentClickDelegation();

initCommandPalette({ refreshLucideIcons });

window.addEventListener('popstate', () => {
  applyRouteFromUrl();
});

applyRouteFromUrl();
dismissAppSplash();

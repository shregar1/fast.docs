const SPLASH_ID = 'fm-splash';
const MIN_VISIBLE_MS = 720;

/**
 * Fade out and remove the initial splash after first route render.
 * Keeps a short minimum time so the loading animation is visible.
 */
export function dismissAppSplash() {
  const el = document.getElementById(SPLASH_ID);
  if (!el) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minMs = reducedMotion ? 0 : MIN_VISIBLE_MS;
  const t0 = performance.now();

  const removeEl = () => {
    el.remove();
    document.body.classList.remove('fm-splash-active');
  };

  const finish = () => {
    const elapsed = performance.now() - t0;
    const wait = Math.max(0, minMs - elapsed);
    window.setTimeout(() => {
      el.setAttribute('aria-busy', 'false');
      if (reducedMotion) {
        removeEl();
        return;
      }
      el.classList.add('fm-splash--exiting');
      el.addEventListener(
        'transitionend',
        (e) => {
          if (e.target === el) removeEl();
        },
        { once: true }
      );
      window.setTimeout(removeEl, 550);
    }, wait);
  };

  requestAnimationFrame(() => requestAnimationFrame(finish));
}

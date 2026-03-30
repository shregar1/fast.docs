export function closeNavExploreDropdown() {
  const panel = document.getElementById('fm-nav-dropdown-panel');
  const btn = document.getElementById('fm-nav-dropdown-btn');
  if (panel) {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  }
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
  }
}

export function initExploreDropdown() {
  const wrap = document.getElementById('fm-nav-dropdown-wrap');
  const btn = document.getElementById('fm-nav-dropdown-btn');
  const panel = document.getElementById('fm-nav-dropdown-panel');
  if (!wrap || !btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeNavExploreDropdown();
    } else {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeNavExploreDropdown();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavExploreDropdown();
  });
}

export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenuBtn || !mobileMenu) {
    window.hideMobileMenu = () => {};
    return;
  }

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  window.hideMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
  };
}

export function initSkipLinkFocus() {
  document.querySelector('.fm-skip-link')?.addEventListener('click', () => {
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;
    requestAnimationFrame(() => {
      mainEl.focus({ preventScroll: true });
    });
  });
}

export function setNavSearchKbdHint() {
  const navKbdHint = document.getElementById('fm-nav-kbd-hint');
  if (navKbdHint) {
    navKbdHint.textContent = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘K' : 'Ctrl+K';
  }
}

/** Registers `window.closeNavExploreDropdown` for inline HTML handlers. */
export function registerNavGlobals() {
  window.closeNavExploreDropdown = closeNavExploreDropdown;
}

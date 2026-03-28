const THEME_KEY = 'theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.add('light');
  } else {
    html.classList.remove('light');
  }
}

export function toggleTheme() {
  const newTheme = getStoredTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  setStoredTheme(newTheme);
}

export function initTheme() {
  applyTheme(getStoredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  });

  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) {
      applyTheme(e.newValue || 'dark');
    }
  });
}

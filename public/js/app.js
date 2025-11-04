const THEME_KEY = 'poster_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function setToggleButtonText(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
  setToggleButtonText(next);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved ?? getSystemTheme();
  applyTheme(theme);
  setToggleButtonText(theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);

  // Always update if user hasn’t manually set theme
  if (!saved) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      setToggleButtonText(newTheme);
    });
  }
}

// Optional: clear saved theme if you always want system theme on load
// localStorage.removeItem(THEME_KEY);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

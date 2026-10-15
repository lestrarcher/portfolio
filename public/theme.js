// Runs before the first paint; shared by every header, including route reconnects.
(() => {
  const key = 'portfolio-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['light', 'dark'].includes(value) ? value : null;
  let preference;
  try { preference = valid(localStorage.getItem(key)); } catch { preference = null; }
  const apply = () => {
    document.documentElement.dataset.theme = preference || (system.matches ? 'dark' : 'light');
    window.dispatchEvent(new Event('portfolio-theme-change'));
  };
  window.portfolioTheme = {
    set(value) {
      preference = valid(value);
      try {
        if (preference) localStorage.setItem(key, preference);
        else localStorage.removeItem(key);
      } catch { /* The in-memory choice still works when storage is unavailable. */ }
      apply();
    }
  };
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = valid(event.newValue); apply(); }
  });
  apply();
})();

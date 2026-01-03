// Theme Toggle
(function() {
  console.log('Theme toggle script loaded');

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
      const icon = themeButton.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
    }

    console.log('Theme switched to:', newTheme);
  }

  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);

    // Set initial icon
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
      const icon = themeButton.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      themeButton.addEventListener('click', toggleTheme);
      console.log('Theme button initialized');
    } else {
      console.error('Theme toggle button not found');
    }
  }

  // Language Toggle
  function toggleLanguage() {
    alert('语言切换功能（框架已就绪，后续可添加多语言内容）');
  }

  function initLanguage() {
    const langButton = document.getElementById('lang-toggle');
    if (langButton) {
      langButton.addEventListener('click', toggleLanguage);
      console.log('Language button initialized');
    } else {
      console.error('Language toggle button not found');
    }
  }

  // Initialize everything
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM loaded, initializing...');
      initTheme();
      initLanguage();
    });
  } else {
    console.log('DOM already ready, initializing...');
    initTheme();
    initLanguage();
  }
})();

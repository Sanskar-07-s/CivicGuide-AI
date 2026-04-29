import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('civicguide_theme');
      return saved ? saved : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('civicguide_theme', theme);
      
      const root = window.document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${theme}`);
    } catch (e) {
      console.error("Error updating theme", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};

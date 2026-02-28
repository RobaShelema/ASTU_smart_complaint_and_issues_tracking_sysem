import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create context
const ThemeContext = createContext(null);

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const ThemeProvider = ({ children }) => {
  // State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || THEMES.SYSTEM;
  });
  
  const [effectiveTheme, setEffectiveTheme] = useState(THEMES.LIGHT);
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || 'blue';
  });

  // Available accent colors
  const accentColors = [
    { name: 'blue', value: '#3B82F6' },
    { name: 'purple', value: '#8B5CF6' },
    { name: 'green', value: '#10B981' },
    { name: 'red', value: '#EF4444' },
    { name: 'orange', value: '#F59E0B' },
    { name: 'pink', value: '#EC4899' }
  ];

  // Get system theme preference
  const getSystemTheme = useCallback(() => {
    if (typeof window === 'undefined') return THEMES.LIGHT;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }, []);

  // Update effective theme based on selection
  useEffect(() => {
    const newEffectiveTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
    setEffectiveTheme(newEffectiveTheme);

    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newEffectiveTheme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newEffectiveTheme === THEMES.DARK ? '#1F2937' : '#FFFFFF'
      );
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, getSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        setEffectiveTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  // Apply accent color
  useEffect(() => {
    const color = accentColors.find(c => c.name === accentColor)?.value || '#3B82F6';
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor, accentColors]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === THEMES.LIGHT) return THEMES.DARK;
      if (prev === THEMES.DARK) return THEMES.SYSTEM;
      return THEMES.LIGHT;
    });
  }, []);

  // Set specific theme
  const setThemeMode = useCallback((newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  // Set accent color
  const setAccent = useCallback((color) => {
    if (accentColors.some(c => c.name === color)) {
      setAccentColor(color);
    }
  }, [accentColors]);

  // Get CSS variables for the current theme
  const getThemeVariables = useCallback(() => {
    const isDark = effectiveTheme === THEMES.DARK;
    
    return {
      '--bg-primary': isDark ? '#1F2937' : '#FFFFFF',
      '--bg-secondary': isDark ? '#111827' : '#F3F4F6',
      '--text-primary': isDark ? '#F9FAFB' : '#111827',
      '--text-secondary': isDark ? '#9CA3AF' : '#6B7280',
      '--border-color': isDark ? '#374151' : '#E5E7EB',
      '--accent-color': accentColors.find(c => c.name === accentColor)?.value || '#3B82F6',
      '--accent-hover': isDark ? '#2563EB' : '#1D4ED8'
    };
  }, [effectiveTheme, accentColor, accentColors]);

  // Context value
  const value = {
    // State
    theme,
    effectiveTheme,
    accentColor,
    
    // Actions
    toggleTheme,
    setThemeMode,
    setAccent,
    
    // Utilities
    getThemeVariables,
    isDark: effectiveTheme === THEMES.DARK,
    isLight: effectiveTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM,
    
    // Available options
    themes: THEMES,
    accentColors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
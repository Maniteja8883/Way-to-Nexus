// This file is a simplified version of next-themes.
// It is used to manage theme switching in the application.
// For the full library, see: https://github.com/pacocoursey/next-themes

"use client"

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const colorSchemes = ['light', 'dark'];
const MEDIA = '(prefers-color-scheme: dark)';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string | 'class';
  defaultTheme?: string;
  enableSystem?: boolean;
}

const ThemeContext = createContext<
  | {
      theme: string;
      setTheme: (theme: string) => void;
      themes: string[];
    }
  | undefined
>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() => getInitialTheme(defaultTheme));
  const themes = enableSystem ? [...colorSchemes, 'system'] : colorSchemes;

  const applyTheme = useCallback((theme: string) => {
    const doc = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia(MEDIA).matches);

    doc.classList[isDark ? 'add' : 'remove']('dark');
    if (attribute === 'class') {
      doc.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [attribute]);

  const setTheme = useCallback((theme: string) => {
    setThemeState(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // localStorage is not available
    }
    applyTheme(theme);
  }, [applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA);
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const providerValue = useMemo(() => ({ theme, setTheme, themes }), [theme, setTheme, themes]);

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
};

const getInitialTheme = (defaultTheme: string) => {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }
  try {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
  } catch (e) {
    // localStorage is not available
  }
  return defaultTheme;
};

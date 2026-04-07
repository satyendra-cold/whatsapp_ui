"use client";

import React, { useState, useEffect } from 'react';
import type { Theme } from '../types';
import { AuthProvider } from '../context/AuthContext';

export default function ThemeAndAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = (localStorage.getItem('wa-theme') as Theme) || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('wa-theme', theme);
    }
  }, [theme, mounted]);

  // We can pass theme down via a new context if needed, but since it was just passed 
  // to Home in App.tsx, we can export a way to set it or put it in context.
  // Actually, since React Context is best for this, let's create a ThemeContext here so Home can toggle it.
  
  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export const ThemeContext = React.createContext<{ theme: Theme; setTheme: React.Dispatch<React.SetStateAction<Theme>> } | undefined>(undefined);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

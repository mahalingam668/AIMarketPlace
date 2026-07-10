import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../contexts/themeContextObject';

export function useCrmTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useCrmTheme must be used within a <ThemeProvider>');
  return ctx;
}

import { createContext } from 'react';
import type { CrmThemeTokens } from '../constants/crmTheme';

export interface ThemeContextValue {
  theme: CrmThemeTokens;
  updateTheme: (partial: Partial<CrmThemeTokens>) => void;
  resetTheme: () => void;
  cssVars: React.CSSProperties;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CRM_THEME_STORAGE_KEY, DEFAULT_CRM_THEME, type CrmThemeTokens } from '../constants/crmTheme';
import { ThemeContext, type ThemeContextValue } from './themeContextObject';

function loadStoredTheme(): CrmThemeTokens {
  try {
    const raw = localStorage.getItem(CRM_THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_CRM_THEME;
    return { ...DEFAULT_CRM_THEME, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CRM_THEME;
  }
}

/**
 * Provides CRM brand tokens as scoped CSS variables (`--crm-*`), applied via
 * `cssVars` on the `.crm-root` wrapper — never on document `:root`, so it
 * can never collide with the app's own light/dark theme system.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CrmThemeTokens>(loadStoredTheme);

  const persist = useCallback((next: CrmThemeTokens) => {
    setTheme(next);
    try {
      localStorage.setItem(CRM_THEME_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — theme still updates for this session */
    }
  }, []);

  const updateTheme = useCallback(
    (partial: Partial<CrmThemeTokens>) => {
      persist({ ...theme, ...partial });
    },
    [theme, persist]
  );

  const resetTheme = useCallback(() => {
    persist(DEFAULT_CRM_THEME);
  }, [persist]);

  const cssVars = useMemo<React.CSSProperties>(
    () =>
      ({
        '--crm-primary': theme.primaryColor,
        '--crm-secondary': theme.secondaryColor,
        '--crm-bg': theme.backgroundColor,
        '--crm-surface': theme.surfaceColor,
        '--crm-border': theme.borderColor,
        '--crm-title': theme.titleColor,
        '--crm-text': theme.textColor,
        '--crm-text-secondary': theme.textSecondaryColor,
        '--crm-card-bg': theme.cardBackground,
        '--crm-icon': theme.iconColor,
        '--crm-success': theme.successColor,
        '--crm-warning': theme.warningColor,
        '--crm-error': theme.errorColor,
      }) as React.CSSProperties,
    [theme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, updateTheme, resetTheme, cssVars }),
    [theme, updateTheme, resetTheme, cssVars]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

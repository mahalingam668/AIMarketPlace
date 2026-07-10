import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_PAGE_CONFIGS, PAGE_CONFIG_STORAGE_KEY, type CrmPageConfig } from '../modules/crm/data/pages.mock';
import { PageConfigurationContext, type PageConfigurationContextValue } from './pageConfigurationContextObject';

function loadStoredConfigs(): CrmPageConfig[] {
  try {
    const raw = localStorage.getItem(PAGE_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_PAGE_CONFIGS;
    const stored = JSON.parse(raw) as CrmPageConfig[];
    // Merge so newly-shipped system pages always appear even if the stored
    // snapshot predates them.
    const byKey = new Map(stored.map((c) => [c.key, c]));
    const merged = DEFAULT_PAGE_CONFIGS.map((def) => byKey.get(def.key) ?? def);
    const customOnly = stored.filter((c) => !DEFAULT_PAGE_CONFIGS.some((def) => def.key === c.key));
    return [...merged, ...customOnly];
  } catch {
    return DEFAULT_PAGE_CONFIGS;
  }
}

/**
 * Single source of truth for page metadata (title, subtitle, banner,
 * colors, dimensions, display order). Every CRM page reads its own entry
 * via `usePageConfig(key)`, so editing a row on the Pages screen is
 * reflected everywhere that key is rendered — no per-page hardcoding.
 */
export function PageConfigurationProvider({ children }: { children: ReactNode }) {
  const [pageConfigs, setPageConfigs] = useState<CrmPageConfig[]>(loadStoredConfigs);

  const persist = useCallback((next: CrmPageConfig[]) => {
    setPageConfigs(next);
    try {
      localStorage.setItem(PAGE_CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — config still updates for this session */
    }
  }, []);

  const getPageConfig = useCallback((key: string) => pageConfigs.find((c) => c.key === key), [pageConfigs]);

  const updatePageConfig = useCallback(
    (key: string, partial: Partial<CrmPageConfig>) => {
      persist(pageConfigs.map((c) => (c.key === key ? { ...c, ...partial } : c)));
    },
    [pageConfigs, persist]
  );

  const addPageConfig = useCallback(
    (config: Omit<CrmPageConfig, 'system'>) => {
      persist([...pageConfigs, { ...config, system: false }]);
    },
    [pageConfigs, persist]
  );

  const removePageConfig = useCallback(
    (key: string) => {
      persist(pageConfigs.filter((c) => c.key !== key || c.system));
    },
    [pageConfigs, persist]
  );

  const value = useMemo<PageConfigurationContextValue>(
    () => ({ pageConfigs, getPageConfig, updatePageConfig, addPageConfig, removePageConfig }),
    [pageConfigs, getPageConfig, updatePageConfig, addPageConfig, removePageConfig]
  );

  return <PageConfigurationContext.Provider value={value}>{children}</PageConfigurationContext.Provider>;
}

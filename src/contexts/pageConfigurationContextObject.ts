import { createContext } from 'react';
import type { CrmPageConfig } from '../modules/crm/data/pages.mock';

export interface PageConfigurationContextValue {
  pageConfigs: CrmPageConfig[];
  getPageConfig: (key: string) => CrmPageConfig | undefined;
  updatePageConfig: (key: string, partial: Partial<CrmPageConfig>) => void;
  addPageConfig: (config: Omit<CrmPageConfig, 'system'>) => void;
  removePageConfig: (key: string) => void;
}

export const PageConfigurationContext = createContext<PageConfigurationContextValue | null>(null);

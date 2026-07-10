import { useMemo } from 'react';
import type { CrmPageConfig } from '../modules/crm/data/pages.mock';
import { usePageConfiguration } from './usePageConfiguration';

const FALLBACK: Omit<CrmPageConfig, 'key' | 'system'> = {
  title: 'Untitled Page',
  subtitle: '',
  description: '',
  icon: 'FileText',
  banner: 'linear-gradient(135deg, #2563EB, #0F172A)',
  backgroundColor: '#F8FAFC',
  titleColor: '#0F172A',
  textColor: '#64748B',
  cardBackground: '#FFFFFF',
  pageWidth: '100%',
  pageHeight: 'auto',
  displayOrder: 999,
};

/** Resolves a single page's config by key, with a safe fallback so a missing/renamed key never crashes a page. */
export function usePageConfig(key: string): CrmPageConfig {
  const { getPageConfig } = usePageConfiguration();
  return useMemo(() => getPageConfig(key) ?? { key, system: false, ...FALLBACK }, [getPageConfig, key]);
}

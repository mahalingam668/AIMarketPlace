import { useContext } from 'react';
import { PageConfigurationContext, type PageConfigurationContextValue } from '../contexts/pageConfigurationContextObject';

export function usePageConfiguration(): PageConfigurationContextValue {
  const ctx = useContext(PageConfigurationContext);
  if (!ctx) throw new Error('usePageConfiguration must be used within a <PageConfigurationProvider>');
  return ctx;
}

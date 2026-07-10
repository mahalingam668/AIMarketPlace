import { useContext } from 'react';
import { RoleContext, type RoleContextValue } from '../contexts/roleContextObject';

export function useCrmRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useCrmRole must be used within a <RoleProvider>');
  return ctx;
}

import { useContext } from 'react';
import { MenuContext, type MenuContextValue } from '../contexts/menuContextObject';

export function useMenuConfig(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenuConfig must be used within a <MenuProvider>');
  return ctx;
}

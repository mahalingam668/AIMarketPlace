import { createContext } from 'react';
import type { MenuChild, MenuGroup } from '../constants/menuConfig';

export interface MenuContextValue {
  menuGroups: MenuGroup[];
  updateMenuChild: (childId: string, partial: Partial<MenuChild>) => void;
  toggleChildVisibility: (childId: string) => void;
  reorderChildren: (groupId: number, orderedIds: string[]) => void;
  resetMenuConfig: () => void;
  /** Live counts (e.g. product/page totals) keyed by MenuChild.badgeKey. */
  badgeCounts: Record<string, number>;
}

export const MenuContext = createContext<MenuContextValue | null>(null);

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_MENU_CONFIG, MENU_CONFIG_STORAGE_KEY, type MenuChild, type MenuGroup } from '../constants/menuConfig';
import { usePageConfiguration } from '../hooks/usePageConfiguration';
import { useCrmProducts } from '../hooks/useCrmProducts';
import { MenuContext, type MenuContextValue } from './menuContextObject';

function loadStoredMenu(): MenuGroup[] {
  try {
    const raw = localStorage.getItem(MENU_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_MENU_CONFIG;
    const stored = JSON.parse(raw) as MenuGroup[];
    // Re-merge against the shipped default so a code update that adds a new
    // menu child still shows up even if a stale override was persisted.
    return DEFAULT_MENU_CONFIG.map((group) => {
      const storedGroup = stored.find((g) => g.id === group.id);
      if (!storedGroup) return group;
      const children = group.children.map((child) => {
        const storedChild = storedGroup.children.find((c) => c.id === child.id);
        return storedChild ? { ...child, ...storedChild } : child;
      });
      return { ...group, ...storedGroup, children };
    });
  } catch {
    return DEFAULT_MENU_CONFIG;
  }
}

/**
 * Reactive layer on top of the static `menuConfig.ts` defaults — this is
 * what the Sidebar, Breadcrumb, and Menu Management screen actually read
 * from, so renaming/hiding/reordering an entry updates navigation instantly.
 */
export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(loadStoredMenu);
  const { pageConfigs } = usePageConfiguration();
  const { products } = useCrmProducts();

  const persist = useCallback((next: MenuGroup[]) => {
    setMenuGroups(next);
    try {
      localStorage.setItem(MENU_CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — menu still updates for this session */
    }
  }, []);

  const updateMenuChild = useCallback(
    (childId: string, partial: Partial<MenuChild>) => {
      persist(
        menuGroups.map((group) => ({
          ...group,
          children: group.children.map((c) => (c.id === childId ? { ...c, ...partial } : c)),
        }))
      );
    },
    [menuGroups, persist]
  );

  const toggleChildVisibility = useCallback(
    (childId: string) => {
      persist(
        menuGroups.map((group) => ({
          ...group,
          children: group.children.map((c) => (c.id === childId ? { ...c, hidden: !c.hidden } : c)),
        }))
      );
    },
    [menuGroups, persist]
  );

  const reorderChildren = useCallback(
    (groupId: number, orderedIds: string[]) => {
      persist(
        menuGroups.map((group) => {
          if (group.id !== groupId) return group;
          const byId = new Map(group.children.map((c) => [c.id, c]));
          const reordered = orderedIds.map((id) => byId.get(id)).filter((c): c is MenuChild => Boolean(c));
          return { ...group, children: reordered };
        })
      );
    },
    [menuGroups, persist]
  );

  const resetMenuConfig = useCallback(() => {
    persist(DEFAULT_MENU_CONFIG);
  }, [persist]);

  const badgeCounts = useMemo<Record<string, number>>(
    () => ({
      products: products.length,
      pages: pageConfigs.length,
    }),
    [products, pageConfigs]
  );

  const value = useMemo<MenuContextValue>(
    () => ({ menuGroups, updateMenuChild, toggleChildVisibility, reorderChildren, resetMenuConfig, badgeCounts }),
    [menuGroups, updateMenuChild, toggleChildVisibility, reorderChildren, resetMenuConfig, badgeCounts]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

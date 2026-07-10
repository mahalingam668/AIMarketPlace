import { useMemo } from 'react';
import type { MenuChild, MenuGroup } from '../constants/menuConfig';
import { useCrmRole } from './useCrmRole';
import { useMenuConfig } from './useMenuConfig';

export interface VisibleMenuChild extends MenuChild {
  badgeCount?: number;
}

export interface VisibleMenuGroup extends Omit<MenuGroup, 'children'> {
  children: VisibleMenuChild[];
}

/**
 * The one place that combines role permissions + runtime menu overrides +
 * live badge counts into what the Sidebar/Breadcrumb should actually
 * render. Nothing else should re-derive this filtering logic.
 */
export function useVisibleCrmMenu(): VisibleMenuGroup[] {
  const { hasPermission } = useCrmRole();
  const { menuGroups, badgeCounts } = useMenuConfig();

  return useMemo(
    () =>
      menuGroups
        .map((group) => {
          const children = group.children
            .filter((child) => !child.hidden && hasPermission(child.permissionKey))
            .map((child) => ({ ...child, badgeCount: child.badgeKey ? badgeCounts[child.badgeKey] : undefined }));
          return { ...group, children };
        })
        .filter((group) => group.children.length > 0),
    [menuGroups, hasPermission, badgeCounts]
  );
}

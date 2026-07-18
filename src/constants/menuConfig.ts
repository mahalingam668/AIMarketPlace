import type { CrmPermissions } from './crmRoles';

export interface MenuChild {
  id: string;
  name: string;
  path: string;
  icon: string;
  /** Key into CrmPermissions that must be true for this item to render. */
  permissionKey: keyof CrmPermissions;
  /** Key used to look up a live count from CrmMenuContext (e.g. product total). */
  badgeKey?: string;
  /** Runtime override set from Menu Management — hides the item without deleting it. */
  hidden?: boolean;
}

export interface MenuGroup {
  id: number;
  name: string;
  icon: string;
  path: string;
  permissionKey: keyof CrmPermissions;
  children: MenuChild[];
}

/**
 * Default CRM menu tree. This is the single source of truth consumed by the
 * Sidebar, Breadcrumb, and header — nothing about CRM navigation is
 * hardcoded elsewhere. Menu Management (frontend-only) lets an admin
 * rename/hide/reorder these at runtime via CrmMenuContext, which persists
 * the override and is what components actually read from.
 */
export const DEFAULT_MENU_CONFIG: MenuGroup[] = [
  {
    id: 1,
    name: 'CRM',
    icon: 'Building2',
    path: '/crm',
    permissionKey: 'dashboard',
    children: [
      { id: 'crm-dashboard', name: 'Dashboard', path: '/crm/dashboard', icon: 'LayoutDashboard', permissionKey: 'dashboard' },
      { id: 'crm-projects', name: 'Post a Project', path: '/crm/projects', icon: 'ClipboardList', permissionKey: 'projects' },
      { id: 'crm-products', name: 'Products', path: '/crm/products', icon: 'Package', permissionKey: 'products', badgeKey: 'products' },
      { id: 'crm-product-details', name: 'Product Details', path: '/crm/products/details', icon: 'PackageSearch', permissionKey: 'productDetails' },
      { id: 'crm-pages', name: 'Pages', path: '/crm/pages', icon: 'FileStack', permissionKey: 'pages', badgeKey: 'pages' },
      { id: 'crm-menus', name: 'Menu Management', path: '/crm/menus', icon: 'ListTree', permissionKey: 'menus' },
      { id: 'crm-settings', name: 'Theme Settings', path: '/crm/settings', icon: 'Palette', permissionKey: 'settings' },
    ],
  },
];

export const MENU_CONFIG_STORAGE_KEY = 'crm.menuConfig.v1';

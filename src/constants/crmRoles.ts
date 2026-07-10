export type CrmRole = 'Super Admin' | 'Admin' | 'Product Manager' | 'Content Manager' | 'Viewer';

/**
 * Frontend-only permission map. Keys mirror the CRM sidebar sections so
 * `hasPermission(key)` can gate both routes and menu visibility from one source.
 */
export interface CrmPermissions {
  dashboard: boolean;
  products: boolean;
  productDetails: boolean;
  pages: boolean;
  menus: boolean;
  settings: boolean;
  /** When true, mutation actions (edit/delete/save) render disabled across the module. */
  readOnly: boolean;
}

export const ALL_CRM_ROLES: CrmRole[] = ['Super Admin', 'Admin', 'Product Manager', 'Content Manager', 'Viewer'];

export const CRM_ROLE_PERMISSIONS: Record<CrmRole, CrmPermissions> = {
  'Super Admin': {
    dashboard: true,
    products: true,
    productDetails: true,
    pages: true,
    menus: true,
    settings: true,
    readOnly: false,
  },
  Admin: {
    dashboard: true,
    products: true,
    productDetails: true,
    pages: true,
    menus: false,
    settings: true,
    readOnly: false,
  },
  'Product Manager': {
    dashboard: false,
    products: true,
    productDetails: true,
    pages: false,
    menus: false,
    settings: false,
    readOnly: false,
  },
  'Content Manager': {
    dashboard: false,
    products: false,
    productDetails: false,
    pages: true,
    menus: false,
    settings: false,
    readOnly: false,
  },
  Viewer: {
    dashboard: true,
    products: true,
    productDetails: true,
    pages: true,
    menus: false,
    settings: false,
    readOnly: true,
  },
};

export const CRM_ROLE_STORAGE_KEY = 'crm.role.v1';

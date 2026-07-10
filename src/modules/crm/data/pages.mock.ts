export interface CrmPageConfig {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  /** CSS gradient/color value — never an external image URL. */
  banner: string;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
  cardBackground: string;
  pageWidth: string;
  pageHeight: string;
  displayOrder: number;
  /** System pages are wired to real routes and can be edited but not deleted. */
  system: boolean;
}

export const DEFAULT_PAGE_CONFIGS: CrmPageConfig[] = [
  {
    key: 'crm-dashboard',
    title: 'CRM Dashboard',
    subtitle: 'Operational overview',
    description: 'A real-time snapshot of products, pages, and platform activity.',
    icon: 'LayoutDashboard',
    banner: 'linear-gradient(135deg, #2563EB, #0F172A)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 1,
    system: true,
  },
  {
    key: 'crm-products',
    title: 'Products',
    subtitle: 'Manage your marketplace catalog',
    description: 'Search, filter, and maintain every product listing from one table.',
    icon: 'Package',
    banner: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 2,
    system: true,
  },
  {
    key: 'crm-product-details',
    title: 'Product Details',
    subtitle: 'Full specification and lifecycle',
    description: 'Overview, features, screenshots, documentation, and integrations for a single product.',
    icon: 'PackageSearch',
    banner: 'linear-gradient(135deg, #0F172A, #2563EB)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 3,
    system: true,
  },
  {
    key: 'crm-pages',
    title: 'Pages',
    subtitle: 'Configure every page from one place',
    description: 'Titles, banners, colors, and layout for CRM pages — changes apply instantly, everywhere.',
    icon: 'FileStack',
    banner: 'linear-gradient(135deg, #16A34A, #0F172A)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 4,
    system: true,
  },
  {
    key: 'crm-menus',
    title: 'Menu Management',
    subtitle: 'Sidebar & navigation structure',
    description: 'Rename, reorder, or hide CRM navigation entries — reflected instantly in the sidebar and breadcrumb.',
    icon: 'ListTree',
    banner: 'linear-gradient(135deg, #F59E0B, #0F172A)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 5,
    system: true,
  },
  {
    key: 'crm-settings',
    title: 'Theme Settings',
    subtitle: 'Brand colors for the CRM module',
    description: 'Adjust primary, surface, and text colors — every CRM page and component updates live.',
    icon: 'Palette',
    banner: 'linear-gradient(135deg, #2563EB, #0F172A)',
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 6,
    system: true,
  },
];

export const PAGE_CONFIG_STORAGE_KEY = 'crm.pageConfigs.v1';

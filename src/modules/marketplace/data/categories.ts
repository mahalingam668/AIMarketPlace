import type { AITool } from '../../../types';

export interface MarketplaceCategory {
  slug: string;
  name: string;
  icon: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Canonical category directory — every category currently scattered across
 * Home.tsx's CATEGORY_ICONS (base 8) and Browse.tsx's CATEGORY_MENU
 * (extended 31), made a single source of truth here. Browse.tsx/Home.tsx
 * still keep their own local copies for now (see plan's "Next recommended
 * step" — not touched in this pass); new pages read from here.
 */
const CATEGORY_NAMES = [
  'Language Models',
  'Image Generation',
  'Code Assistant',
  'Data Analytics',
  'Voice & Audio',
  'Video Generation',
  'Document AI',
  'Search & Research',
  'AI Apps and Agents',
  'Analytics',
  'Blockchain',
  'Collaboration',
  'Commerce',
  'Compliance & Legal',
  'Customer Service',
  'Databases',
  'Developer Tools',
  'DevOps',
  'Finance',
  'Geolocation',
  'Human Resources',
  'Identity',
  'Infrastructure Services',
  'Integration',
  'Internet of Things',
  'IT & Management Tools',
  'Machine Learning',
  'Marketing',
  'Media',
  'Microsoft Entra ID',
  'Migration',
  'Mixed Reality',
  'Monitoring & Diagnostics',
  'Operations & Supply Chain',
  'Productivity',
  'Sales',
  'Security',
  'Task & Project Management',
  'Web',
] as const;

const CATEGORY_ICON_NAMES: Record<string, string> = {
  'Language Models': 'Brain',
  'Image Generation': 'Image',
  'Code Assistant': 'Code',
  'Data Analytics': 'BarChart3',
  'Voice & Audio': 'Mic',
  'Video Generation': 'Video',
  'Document AI': 'FileText',
  'Search & Research': 'Search',
  'AI Apps and Agents': 'Bot',
  'Analytics': 'Activity',
  'Blockchain': 'Link2',
  'Collaboration': 'Users',
  'Commerce': 'ShoppingCart',
  'Compliance & Legal': 'Scale',
  'Customer Service': 'Headphones',
  'Databases': 'Database',
  'Developer Tools': 'Terminal',
  'DevOps': 'GitBranch',
  'Finance': 'DollarSign',
  'Geolocation': 'MapPin',
  'Human Resources': 'UserCheck',
  'Identity': 'Fingerprint',
  'Infrastructure Services': 'Server',
  'Integration': 'Plug',
  'Internet of Things': 'Cpu',
  'IT & Management Tools': 'Settings',
  'Machine Learning': 'Brain',
  'Marketing': 'Megaphone',
  'Media': 'Film',
  'Microsoft Entra ID': 'ShieldCheck',
  'Migration': 'ArrowRightLeft',
  'Mixed Reality': 'Glasses',
  'Monitoring & Diagnostics': 'Activity',
  'Operations & Supply Chain': 'Truck',
  'Productivity': 'CheckSquare',
  'Sales': 'TrendingUp',
  'Security': 'Shield',
  'Task & Project Management': 'ListTodo',
  'Web': 'Globe',
};

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = CATEGORY_NAMES.map((name) => ({
  slug: slugify(name),
  name,
  icon: CATEGORY_ICON_NAMES[name] ?? 'Sparkles',
}));

export function getCategoryBySlug(slug: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryCounts(tools: AITool[]): Record<string, number> {
  const counts: Record<string, number> = {};
  tools.forEach((tool) => {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  });
  return counts;
}

export type ToolCategory =
  | 'Language Models'
  | 'Image Generation'
  | 'Code Assistant'
  | 'Data Analytics'
  | 'Voice & Audio'
  | 'Video Generation'
  | 'Document AI'
  | 'Search & Research'
  | 'AI Apps and Agents'
  | 'Analytics'
  | 'Blockchain'
  | 'Collaboration'
  | 'Commerce'
  | 'Compliance & Legal'
  | 'Customer Service'
  | 'Databases'
  | 'Developer Tools'
  | 'DevOps'
  | 'Finance'
  | 'Geolocation'
  | 'Human Resources'
  | 'Identity'
  | 'Infrastructure Services'
  | 'Integration'
  | 'Internet of Things'
  | 'IT & Management Tools'
  | 'Machine Learning'
  | 'Marketing'
  | 'Media'
  | 'Microsoft Entra ID'
  | 'Migration'
  | 'Mixed Reality'
  | 'Monitoring & Diagnostics'
  | 'Operations & Supply Chain'
  | 'Productivity'
  | 'Sales'
  | 'Security'
  | 'Task & Project Management'
  | 'Web';

export interface PricingPlan {
  name: string;
  price: number;
  period: 'monthly' | 'yearly' | 'per-call' | 'free';
  features: string[];
  popular?: boolean;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  subcategory: string;
  icon: string;
  rating: number;
  reviewCount: number;
  pricing: PricingPlan[];
  tags: string[];
  badge?: 'New' | 'Featured' | 'Popular' | 'Beta' | 'Enterprise';
  integrations: string[];
  apiCallsMonthly: number;
  activeUsers: number;
  uptime: number;
  company: string;
  color: string;
  gradient: string;
  featured: boolean;
  industries: string[];
  regions: string[];
  cloudProviders: string[];
  vendor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Developer' | 'Analyst';
  plan: 'Free' | 'Pro' | 'Enterprise';
  joinedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'api_call' | 'purchase' | 'review' | 'integration' | 'alert';
  message: string;
  tool: string;
  toolIcon: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  amount?: number;
}

export interface ChartDataPoint {
  month: string;
  apiCalls: number;
  revenue: number;
  users: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  color: string;
}

export interface FilterState {
  categories: string[];
  pricing: string[];
  rating: number | null;
  badge: string[];
  search: string;
  sort: 'popular' | 'rating' | 'newest' | 'price-low' | 'price-high';
}

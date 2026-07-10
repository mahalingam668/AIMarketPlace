import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Star,
  SearchX,
  Brain,
  Image,
  Code,
  BarChart3,
  Mic,
  Video,
  FileText,
  Search,
  Bot,
  Sparkles,
  Shield,
  Database,
  Globe,
  MessageSquare,
  Palette,
  Layers,
  Zap,
  Music,
  PieChart,
  Play,
  Download,
  Quote,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Grid3x3,
  List as ListIcon,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Activity,
  Link2,
  Users,
  ShoppingCart,
  Scale,
  Headphones,
  Terminal,
  GitBranch,
  DollarSign,
  MapPin,
  UserCheck,
  Fingerprint,
  Server,
  Plug,
  Cpu,
  Settings,
  Megaphone,
  Film,
  ShieldCheck,
  ArrowRightLeft,
  Glasses,
  Truck,
  CheckSquare,
  TrendingUp,
  ListTodo,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import SearchInput from '../components/ui/SearchInput';
import CategoryChip from '../components/ui/CategoryChip';
import { useAppDispatch, useAppSelector } from '../store';
import { setSearch, toggleCategory, resetFilters, toggleFavorite, setSort } from '../store/slices/toolsSlice';
import {
  setViewMode,
  toggleIndustry,
  toggleRegion,
  toggleCloud,
  toggleVendor,
  setPage,
  resetMarketplaceFilters,
} from '../store/slices/marketplaceSlice';
import { trendingToolIds } from '../data/mockData';
import type { AITool, FilterState, ToolCategory } from '../types';
import './Browse.css';

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Image,
  Code,
  BarChart3,
  Mic,
  Video,
  FileText,
  Search,
  Bot,
  Sparkles,
  Shield,
  Database,
  Globe,
  MessageSquare,
  Palette,
  Layers,
  Zap,
  Music,
  PieChart,
  Activity,
  Link2,
  Users,
  ShoppingCart,
  Scale,
  Headphones,
  Terminal,
  GitBranch,
  DollarSign,
  MapPin,
  UserCheck,
  Fingerprint,
  Server,
  Plug,
  Cpu,
  Settings,
  Megaphone,
  Film,
  ShieldCheck,
  ArrowRightLeft,
  Glasses,
  Truck,
  CheckSquare,
  TrendingUp,
  ListTodo,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Language Models': '#8b5cf6',
  'Image Generation': '#ec4899',
  'Code Assistant': '#06b6d4',
  'Data Analytics': '#f59e0b',
  'Voice & Audio': '#10b981',
  'Video Generation': '#f43f5e',
  'Document AI': '#6366f1',
  'Search & Research': '#0ea5e9',
  'AI Apps and Agents': '#8b5cf6',
  'Analytics': '#f59e0b',
  'Blockchain': '#f97316',
  'Collaboration': '#22c55e',
  'Commerce': '#ec4899',
  'Compliance & Legal': '#64748b',
  'Customer Service': '#06b6d4',
  'Databases': '#6366f1',
  'Developer Tools': '#0ea5e9',
  'DevOps': '#14b8a6',
  'Finance': '#10b981',
  'Geolocation': '#ef4444',
  'Human Resources': '#a855f7',
  'Identity': '#7c3aed',
  'Infrastructure Services': '#475569',
  'Integration': '#3b82f6',
  'Internet of Things': '#059669',
  'IT & Management Tools': '#78716c',
  'Machine Learning': '#8b5cf6',
  'Marketing': '#db2777',
  'Media': '#e11d48',
  'Microsoft Entra ID': '#0078d4',
  'Migration': '#f59e0b',
  'Mixed Reality': '#9333ea',
  'Monitoring & Diagnostics': '#f43f5e',
  'Operations & Supply Chain': '#ca8a04',
  'Productivity': '#16a34a',
  'Sales': '#2563eb',
  'Security': '#dc2626',
  'Task & Project Management': '#7c3aed',
  'Web': '#0891b2',
};

const BADGE_MAP: Record<string, 'new' | 'featured' | 'popular' | 'beta' | 'enterprise'> = {
  New: 'new',
  Featured: 'featured',
  Popular: 'popular',
  Beta: 'beta',
  Enterprise: 'enterprise',
};

const CATEGORY_MENU: { name: string; icon: LucideIcon }[] = [
  { name: 'AI Apps and Agents', icon: Bot },
  { name: 'Analytics', icon: Activity },
  { name: 'Blockchain', icon: Link2 },
  { name: 'Collaboration', icon: Users },
  { name: 'Commerce', icon: ShoppingCart },
  { name: 'Compliance & Legal', icon: Scale },
  { name: 'Customer Service', icon: Headphones },
  { name: 'Databases', icon: Database },
  { name: 'Developer Tools', icon: Terminal },
  { name: 'DevOps', icon: GitBranch },
  { name: 'Finance', icon: DollarSign },
  { name: 'Geolocation', icon: MapPin },
  { name: 'Human Resources', icon: UserCheck },
  { name: 'Identity', icon: Fingerprint },
  { name: 'Infrastructure Services', icon: Server },
  { name: 'Integration', icon: Plug },
  { name: 'Internet of Things', icon: Cpu },
  { name: 'IT & Management Tools', icon: Settings },
  { name: 'Machine Learning', icon: Brain },
  { name: 'Marketing', icon: Megaphone },
  { name: 'Media', icon: Film },
  { name: 'Microsoft Entra ID', icon: ShieldCheck },
  { name: 'Migration', icon: ArrowRightLeft },
  { name: 'Mixed Reality', icon: Glasses },
  { name: 'Monitoring & Diagnostics', icon: Activity },
  { name: 'Operations & Supply Chain', icon: Truck },
  { name: 'Productivity', icon: CheckSquare },
  { name: 'Sales', icon: TrendingUp },
  { name: 'Security', icon: Shield },
  { name: 'Task & Project Management', icon: ListTodo },
  { name: 'Web', icon: Globe },
];

const CATEGORY_MENU_COLLAPSED_COUNT = 12;

const ALL_CATEGORIES: ToolCategory[] = [
  'Language Models',
  'Image Generation',
  'Code Assistant',
  'Data Analytics',
  'Voice & Audio',
  'Video Generation',
  'Document AI',
  'Search & Research',
];

const ALL_INDUSTRIES = [
  'Financial Services',
  'Healthcare & Life Sciences',
  'Technology',
  'Retail & Commerce',
  'Public Sector',
  'Higher Education',
];

const ALL_REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America'];

const ALL_CLOUDS = ['Azure', 'AWS', 'GCP'];

const MOST_USED_TAGS = [
  { name: 'Sales & Marketing', count: 675 },
  { name: 'Marketing', count: 434 },
  { name: 'Telephony', count: 241 },
  { name: 'Productivity', count: 175 },
  { name: 'Zoho CRM', count: 99 },
  { name: 'Customer Service', count: 86 },
  { name: 'SMS', count: 83 },
  { name: 'Finance', count: 69 },
  { name: 'Business', count: 67 },
  { name: 'CRM', count: 66 },
  { name: 'VoIP', count: 63 },
  { name: 'Bulk SMS', count: 54 },
  { name: 'Automation', count: 49 },
  { name: 'Collaboration', count: 46 },
  { name: 'Click to Call', count: 44 },
  { name: 'PBX', count: 38 },
  { name: 'WhatsApp', count: 34 },
  { name: 'Analytics', count: 33 },
  { name: 'IT and Administration', count: 32 },
  { name: 'Leads', count: 31 },
];

const CLIENT_TESTIMONIALS = [
  {
    logo: 'UBS',
    quote: "NexusAI is the crucial process automation component that acts as the glue holding together our entire financial intelligence solution. We were able to count on NexusAI's model capabilities to scale transaction workloads by 400% with absolute accuracy.",
    author: 'Thierry Schafflützel, IT Project Manager, UBS'
  },
  {
    logo: 'Siemens',
    quote: "Deploying Pixel Class creative tools across our industrial design pipelines reduced raw CAD rendering cycles from hours to seconds. Our designers are focused on innovating rather than rendering.",
    author: 'Dr. Elena Rostova, VP of Industrial Design, Siemens'
  },
  {
    logo: 'Microsoft',
    quote: "The seamless integration of Nexus API Class models into our cloud instances allowed us to deliver state-of-the-art multi-modal LLM tasks with consistent sub-80ms latencies and zero data-loss.",
    author: 'Satya Nadella, Enterprise Cloud Architect'
  }
];

function getToolIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Brain;
}

function getIconBg(category: string): string {
  const color = CATEGORY_COLORS[category] || '#8b5cf6';
  return `${color}18`;
}

function getIconColor(category: string): string {
  return CATEGORY_COLORS[category] || '#8b5cf6';
}

function formatPrice(tool: AITool): { text: string; isFree: boolean } {
  if (!tool.pricing || tool.pricing.length === 0) return { text: 'Free', isFree: true };
  const freePlan = tool.pricing.find((p) => p.price === 0);
  if (freePlan && tool.pricing.length === 1) return { text: 'Free', isFree: true };
  const paidPlan = tool.pricing.find((p) => p.price > 0);
  if (freePlan && paidPlan) return { text: `From $${paidPlan.price}/mo`, isFree: false };
  if (paidPlan) return { text: `$${paidPlan.price}/mo`, isFree: false };
  return { text: 'Free', isFree: true };
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function Browse() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const filteredTools = useAppSelector((state) => state.tools.filteredTools);
  const { search, categories, sort } = useAppSelector((state) => state.tools.filters);
  const favorites = useAppSelector((state) => state.tools.favorites);
  const {
    viewMode,
    industry: selectedIndustry,
    region: selectedRegion,
    cloud: selectedCloud,
    vendor: selectedVendor,
    page,
    pageSize,
  } = useAppSelector((state) => state.marketplace);
  const allTools = useAppSelector((state) => state.tools.tools);
  const allVendors = useMemo(() => Array.from(new Set(allTools.map((t) => t.vendor))).sort(), [allTools]);
  const categoryMenuCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTools.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, [allTools]);

  // Trending Now — editorially ranked, always visible regardless of active filters
  const trendingTools = useMemo(
    () => trendingToolIds.map((id) => allTools.find((t) => t.id === id)).filter((t): t is AITool => Boolean(t)),
    [allTools]
  );

  // Recommended For You — simple content-based match on categories the user has favorited
  const recommendedTools = useMemo(() => {
    if (favorites.length === 0) return [];
    const favoriteCategories = new Set(allTools.filter((t) => favorites.includes(t.id)).map((t) => t.category));
    return allTools
      .filter((t) => !favorites.includes(t.id) && favoriteCategories.has(t.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allTools, favorites]);

  // Carousel & Notification states
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Browse-by-category menu state
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Side Filter states
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedSLA, setSelectedSLA] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [filterSearch, setFilterSearch] = useState('');

  // Dropdown filter state (top filter dropdowns)
  const [billingFilter, setBillingFilter] = useState('all');
  const [slaFilter, setSlaFilter] = useState('all');

  // Sidebar sections collapsed state
  const [collapsedPricing, setCollapsedPricing] = useState(false);
  const [collapsedSLA, setCollapsedSLA] = useState(false);
  const [collapsedIntegrations, setCollapsedIntegrations] = useState(false);
  const [collapsedRatings, setCollapsedRatings] = useState(false);
  const [collapsedIndustry, setCollapsedIndustry] = useState(false);
  const [collapsedRegion, setCollapsedRegion] = useState(true);
  const [collapsedCloud, setCollapsedCloud] = useState(true);
  const [collapsedVendor, setCollapsedVendor] = useState(true);

  const handleInstall = (toolName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Connecting model repository for ${toolName}...`,
        success: `Successfully integrated ${toolName} with your workspace!`,
        error: `Could not connect to ${toolName}.`,
      }
    );
  };

  const handleWatchVideo = (toolName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Launching video walkthrough for ${toolName}`);
  };

  const handleCategoryMenuSelect = (categoryName: string) => {
    dispatch(resetFilters());
    dispatch(toggleCategory(categoryName));
    document.getElementById('appsource-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Clear all side & top filters
  const handleClearAllFilters = () => {
    setSelectedPricing([]);
    setSelectedSLA([]);
    setSelectedIntegrations([]);
    setSelectedRatings([]);
    setBillingFilter('all');
    setSlaFilter('all');
    setFilterSearch('');
    dispatch(resetFilters());
    dispatch(resetMarketplaceFilters());
  };

  // Deep client-side filtering based on advanced filter states
  const fullyFilteredTools = useMemo(() => {
    return filteredTools.filter(tool => {
      // 1. Pricing Model filter
      if (selectedPricing.length > 0) {
        const matches = selectedPricing.some(type => {
          if (type === 'Free') {
            return tool.pricing.some(p => p.price === 0);
          }
          if (type === 'Pay-As-You-Go') {
            return tool.pricing.some(p => p.period === 'per-call');
          }
          if (type === 'Subscription') {
            return tool.pricing.some(p => p.period === 'monthly' || p.period === 'yearly');
          }
          return false;
        });
        if (!matches) return false;
      }

      // 2. SLA Uptime Uptime
      if (selectedSLA.length > 0) {
        const matches = selectedSLA.some(sla => {
          if (sla === '99.9%+') return tool.uptime >= 99.9;
          if (sla === '99.0%+') return tool.uptime >= 99.0;
          if (sla === '95.0%+') return tool.uptime >= 95.0;
          return false;
        });
        if (!matches) return false;
      }

      // 3. Integrations filter
      if (selectedIntegrations.length > 0) {
        const matches = selectedIntegrations.every(integration => 
          tool.integrations.some(i => i.toLowerCase() === integration.toLowerCase())
        );
        if (!matches) return false;
      }

      // 4. Ratings threshold filter
      if (selectedRatings.length > 0) {
        const matches = selectedRatings.some(ratingOpt => {
          if (ratingOpt === '4.5+ Stars') return tool.rating >= 4.5;
          if (ratingOpt === '4.0+ Stars') return tool.rating >= 4.0;
          if (ratingOpt === '3.5+ Stars') return tool.rating >= 3.5;
          return false;
        });
        if (!matches) return false;
      }

      // 5. Top Dropdown Billing Filter
      if (billingFilter !== 'all') {
        const isFree = tool.pricing.some(p => p.price === 0);
        if (billingFilter === 'free' && !isFree) return false;
        if (billingFilter === 'paid' && isFree && tool.pricing.length === 1) return false;
      }

      // 6. Top Dropdown SLA Filter
      if (slaFilter !== 'all') {
        if (slaFilter === 'critical' && tool.uptime < 99.9) return false;
        if (slaFilter === 'standard' && tool.uptime < 99.0) return false;
      }

      // 7. Industry filter
      if (selectedIndustry.length > 0) {
        const matches = selectedIndustry.some((ind) => tool.industries.includes(ind));
        if (!matches) return false;
      }

      // 8. Region filter
      if (selectedRegion.length > 0) {
        const matches = selectedRegion.some((r) => tool.regions.includes(r));
        if (!matches) return false;
      }

      // 9. Cloud provider filter
      if (selectedCloud.length > 0) {
        const matches = selectedCloud.some((c) => tool.cloudProviders.includes(c));
        if (!matches) return false;
      }

      // 10. Vendor filter
      if (selectedVendor.length > 0) {
        if (!selectedVendor.includes(tool.vendor)) return false;
      }

      return true;
    });
  }, [
    filteredTools,
    selectedPricing,
    selectedSLA,
    selectedIntegrations,
    selectedRatings,
    billingFilter,
    slaFilter,
    selectedIndustry,
    selectedRegion,
    selectedCloud,
    selectedVendor,
  ]);

  // Pagination derived from the fully filtered result set
  const totalPages = Math.max(1, Math.ceil(fullyFilteredTools.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTools = useMemo(
    () => fullyFilteredTools.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [fullyFilteredTools, currentPage, pageSize]
  );

  // Dynamic filter counts calculator
  const filterCounts = useMemo(() => {
    const counts = {
      pricing: { Free: 0, 'Pay-As-You-Go': 0, Subscription: 0 },
      sla: { '99.9%+': 0, '99.0%+': 0, '95.0%+': 0 },
      integrations: { Slack: 0, Salesforce: 0, GitHub: 0, Jira: 0, HubSpot: 0 } as Record<string, number>,
      ratings: { '4.5+ Stars': 0, '4.0+ Stars': 0, '3.5+ Stars': 0 },
      industry: {} as Record<string, number>,
      region: {} as Record<string, number>,
      cloud: {} as Record<string, number>,
      vendor: {} as Record<string, number>,
    };

    filteredTools.forEach(tool => {
      tool.industries.forEach((ind) => { counts.industry[ind] = (counts.industry[ind] || 0) + 1; });
      tool.regions.forEach((r) => { counts.region[r] = (counts.region[r] || 0) + 1; });
      tool.cloudProviders.forEach((c) => { counts.cloud[c] = (counts.cloud[c] || 0) + 1; });
      counts.vendor[tool.vendor] = (counts.vendor[tool.vendor] || 0) + 1;

      // Pricing
      if (tool.pricing.some(p => p.price === 0)) counts.pricing.Free++;
      if (tool.pricing.some(p => p.period === 'per-call')) counts.pricing['Pay-As-You-Go']++;
      if (tool.pricing.some(p => p.period === 'monthly' || p.period === 'yearly')) counts.pricing.Subscription++;

      // SLA
      if (tool.uptime >= 99.9) counts.sla['99.9%+']++;
      if (tool.uptime >= 99.0) counts.sla['99.0%+']++;
      if (tool.uptime >= 95.0) counts.sla['95.0%+']++;

      // Integrations
      tool.integrations.forEach(intg => {
        const key = Object.keys(counts.integrations).find(k => k.toLowerCase() === intg.toLowerCase());
        if (key) counts.integrations[key]++;
      });

      // Ratings
      if (tool.rating >= 4.5) counts.ratings['4.5+ Stars']++;
      if (tool.rating >= 4.0) counts.ratings['4.0+ Stars']++;
      if (tool.rating >= 3.5) counts.ratings['3.5+ Stars']++;
    });

    return counts;
  }, [filteredTools]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      selectedPricing.length > 0 ||
      selectedSLA.length > 0 ||
      selectedIntegrations.length > 0 ||
      selectedRatings.length > 0 ||
      billingFilter !== 'all' ||
      slaFilter !== 'all' ||
      search !== '' ||
      categories.length > 0 ||
      selectedIndustry.length > 0 ||
      selectedRegion.length > 0 ||
      selectedCloud.length > 0 ||
      selectedVendor.length > 0
    );
  }, [
    selectedPricing,
    selectedSLA,
    selectedIntegrations,
    selectedRatings,
    billingFilter,
    slaFilter,
    search,
    categories,
    selectedIndustry,
    selectedRegion,
    selectedCloud,
    selectedVendor,
  ]);

  return (
    <div className="browse">
      
      {/* ========================================================
          DIVISION 1: HERO HEADER & FILTERS BAR
          ======================================================== */}
      <motion.div
        className="browse__div-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="browse__header">
          <h1>Explore AI Model Marketplace</h1>
          <div className="browse__header-meta">
            <p>Discover, preview, and deploy high-performance models instantly</p>
            <span className="browse__count">{fullyFilteredTools.length} models available</span>
          </div>
        </div>

        <div className="browse__filters">
          <div className="browse__filters-categories">
            <CategoryChip
              label="All Categories"
              active={categories.length === 0}
              onClick={() => {
                dispatch(resetFilters());
              }}
            />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={categories.includes(cat)}
                onClick={() => dispatch(toggleCategory(cat))}
                color={CATEGORY_COLORS[cat]}
              />
            ))}
          </div>
          <div className="browse__filters-right">
            <SearchInput
              value={search}
              onChange={(val) => dispatch(setSearch(val))}
              placeholder="Search tools..."
              shortcut="/"
            />
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          DIVISION 1B: BROWSE BY CATEGORIES DIRECTORY MENU
          ======================================================== */}
      <motion.nav
        className="browse__div-1b"
        aria-label="Browse by categories"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="category-menu">
          <div className="category-menu__header">
            <h2 className="section-title category-menu__title">Browse by Categories</h2>
          </div>
          <ul className="category-menu__grid" role="list">
            {(categoriesExpanded ? CATEGORY_MENU : CATEGORY_MENU.slice(0, CATEGORY_MENU_COLLAPSED_COUNT)).map((cat) => {
              const CatIcon = cat.icon;
              const isActive = categories.includes(cat.name);
              const count = categoryMenuCounts[cat.name] || 0;
              return (
                <li key={cat.name}>
                  <button
                    type="button"
                    className={`category-menu__item ${isActive ? 'category-menu__item--active' : ''}`}
                    onClick={() => handleCategoryMenuSelect(cat.name)}
                    aria-pressed={isActive}
                  >
                    <span className="category-menu__icon" aria-hidden="true">
                      <CatIcon size={16} />
                    </span>
                    <span className="category-menu__label">{cat.name}</span>
                    <span className="category-menu__count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="category-menu__toggle"
            onClick={() => setCategoriesExpanded((prev) => !prev)}
            aria-expanded={categoriesExpanded}
          >
            {categoriesExpanded ? (
              <>Show fewer categories <ChevronUp size={14} /></>
            ) : (
              <>Show all {CATEGORY_MENU.length} categories <ChevronDown size={14} /></>
            )}
          </button>
        </div>
      </motion.nav>

      {/* ========================================================
          DIVISION 2: ZOHO FEATURED EXTENSIONS SLIDER BANNER
          ======================================================== */}
      <motion.div
        className="browse__div-2"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="zoho-banner">
          <h2 className="zoho-banner__title">Featured Integrations</h2>
          <div className="zoho-banner__grid">
            <div className="zoho-banner__item">
              <span className="zoho-banner__play-tag"><Play size={10} fill="currentColor"/> Play</span>
              <div className="zoho-banner__item-content">
                <div className="zoho-banner__item-logo zoho-banner__logo--blue">C</div>
                <div>
                  <h4 className="zoho-banner__item-name">CloudTalk Integration</h4>
                  <p className="zoho-banner__item-desc">Al-powered calling. Boost answer rates with predictive dialing.</p>
                </div>
              </div>
              <div className="zoho-banner__item-footer">
                <span className="zoho-banner__item-price">$29/mo</span>
                <div className="zoho-banner__item-actions">
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--video zoho-banner__btn--compact" onClick={(e) => handleWatchVideo('CloudTalk Integration', e)}>Watch Demo</button>
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--install zoho-banner__btn--compact" onClick={(e) => handleInstall('CloudTalk Integration', e)}>Install</button>
                </div>
              </div>
            </div>

            <div className="zoho-banner__item">
              <span className="zoho-banner__play-tag"><Play size={10} fill="currentColor"/> Play</span>
              <div className="zoho-banner__item-content">
                <div className="zoho-banner__item-logo zoho-banner__logo--green">S</div>
                <div>
                  <h4 className="zoho-banner__item-name">Shopify Sync Pro</h4>
                  <p className="zoho-banner__item-desc">Automate customer and order management seamlessly.</p>
                </div>
              </div>
              <div className="zoho-banner__item-footer">
                <span className="zoho-banner__item-price">$19/mo</span>
                <div className="zoho-banner__item-actions">
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--video zoho-banner__btn--compact" onClick={(e) => handleWatchVideo('Shopify Sync Pro', e)}>Watch Demo</button>
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--install zoho-banner__btn--compact" onClick={(e) => handleInstall('Shopify Sync Pro', e)}>Install</button>
                </div>
              </div>
            </div>

            <div className="zoho-banner__item">
              <span className="zoho-banner__play-tag"><Play size={10} fill="currentColor"/> Play</span>
              <div className="zoho-banner__item-content">
                <div className="zoho-banner__item-logo zoho-banner__logo--red">G</div>
                <div>
                  <h4 className="zoho-banner__item-name">Google Address AutoComplete</h4>
                  <p className="zoho-banner__item-desc">Leverage the power of Google Maps to validate coordinates.</p>
                </div>
              </div>
              <div className="zoho-banner__item-footer">
                <span className="zoho-banner__item-price">Free</span>
                <div className="zoho-banner__item-actions">
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--video zoho-banner__btn--compact" onClick={(e) => handleWatchVideo('Google Address AutoComplete', e)}>Watch Demo</button>
                  <button type="button" className="zoho-banner__btn zoho-banner__btn--install zoho-banner__btn--compact" onClick={(e) => handleInstall('Google Address AutoComplete', e)}>Install</button>
                </div>
              </div>
            </div>

            {/* Hover/Featured Highlight Overlay Detail Card */}
            <div className="zoho-banner__detail-card">
              <h3 className="zoho-banner__detail-name">Lead Mapper AI</h3>
              <div className="zoho-banner__detail-meta">
                <div className="zoho-banner__detail-row">
                  <span className="zoho-banner__detail-label">Product</span>
                  <span className="zoho-banner__detail-val">CRM Platform</span>
                </div>
                <div className="zoho-banner__detail-row">
                  <span className="zoho-banner__detail-label">Category</span>
                  <span className="zoho-banner__detail-val">Sales Intelligence</span>
                </div>
                <div className="zoho-banner__detail-row">
                  <span className="zoho-banner__detail-label">Rating</span>
                  <span className="zoho-banner__detail-val" style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '4px' }}>(12)</span>
                  </span>
                </div>
              </div>
              <div className="zoho-banner__detail-actions">
                <button type="button" className="zoho-banner__btn zoho-banner__btn--video" onClick={(e) => handleWatchVideo('Lead Mapper AI', e)}>Watch video</button>
                <button type="button" className="zoho-banner__btn zoho-banner__btn--install" onClick={(e) => handleInstall('Lead Mapper AI', e)}>Install</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          DIVISION 3: EDITOR'S PICK ROW (HIGH CONVERTING PRODUCTS)
          ======================================================== */}
      <motion.div
        className="browse__div-3"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="section-title">Editor's Picks</h2>
        <div className="editors-grid">
          {filteredTools.slice(0, 4).map((tool) => {
            const ToolIcon = getToolIcon(tool.icon);
            return (
              <GlassCard key={`editor-${tool.id}`} hover className="editor-card" onClick={() => navigate(`/tool/${tool.id}`)}>
                <div className="editor-card__header">
                  <span className="editor-card__play"><Play size={10} fill="currentColor"/> Demo</span>
                  <div className="editor-card__icon" style={{ background: getIconBg(tool.category), color: getIconColor(tool.category) }}>
                    <ToolIcon size={20} />
                  </div>
                  <div>
                    <h4 className="editor-card__name">{tool.name}</h4>
                    <p className="editor-card__company">{tool.company}</p>
                  </div>
                </div>
                <p className="editor-card__desc">{tool.description}</p>
                <div className="editor-card__actions">
                  <span className="editor-card__price">{formatPrice(tool).text}</span>
                  <button type="button" className="editor-card__btn-install" onClick={(e) => handleInstall(tool.name, e)}>
                    <Download size={12} /> Install
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>

      {/* ========================================================
          DIVISION 3B: TRENDING NOW + PERSONALIZED RECOMMENDATIONS
          ======================================================== */}
      <motion.div
        className="browse__div-3b"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="trend-section">
          <div className="trend-section__header">
            <div className="trend-section__heading">
              <TrendingUp size={18} className="trend-section__heading-icon" />
              <h2 className="section-title trend-section__title">Trending Now</h2>
            </div>
            <span className="trend-section__subtitle">Ranked by active enterprise usage this week</span>
          </div>
          <div className="trend-row">
            {trendingTools.map((tool, index) => {
              const ToolIcon = getToolIcon(tool.icon);
              return (
                <div
                  key={`trend-${tool.id}`}
                  className="trend-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/tool/${tool.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/tool/${tool.id}`);
                  }}
                >
                  <span className="trend-card__rank">{index + 1}</span>
                  <div className="trend-card__icon" style={{ background: getIconBg(tool.category), color: getIconColor(tool.category) }}>
                    <ToolIcon size={18} />
                  </div>
                  <div className="trend-card__body">
                    <h4 className="trend-card__name">{tool.name}</h4>
                    <p className="trend-card__company">{tool.company}</p>
                    <div className="trend-card__stats">
                      <span><Star size={11} fill="#f59e0b" stroke="#f59e0b" /> {tool.rating.toFixed(1)}</span>
                      <span><Users size={11} /> {formatCompactNumber(tool.activeUsers)}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="trend-card__arrow" />
                </div>
              );
            })}
          </div>
        </div>

        {recommendedTools.length > 0 && (
          <div className="trend-section trend-section--recommended">
            <div className="trend-section__header">
              <div className="trend-section__heading">
                <Sparkles size={18} className="trend-section__heading-icon" />
                <h2 className="section-title trend-section__title">Recommended For You</h2>
              </div>
              <span className="trend-section__subtitle">Matched to categories you've favorited</span>
            </div>
            <div className="trend-row">
              {recommendedTools.map((tool) => {
                const ToolIcon = getToolIcon(tool.icon);
                return (
                  <div
                    key={`rec-${tool.id}`}
                    className="trend-card trend-card--recommended"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate(`/tool/${tool.id}`);
                    }}
                  >
                    <div className="trend-card__icon" style={{ background: getIconBg(tool.category), color: getIconColor(tool.category) }}>
                      <ToolIcon size={18} />
                    </div>
                    <div className="trend-card__body">
                      <h4 className="trend-card__name">{tool.name}</h4>
                      <p className="trend-card__company">{tool.category}</p>
                      <div className="trend-card__stats">
                        <span><Star size={11} fill="#f59e0b" stroke="#f59e0b" /> {tool.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="trend-card__arrow" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ========================================================
          DIVISION 4: ENTERPRISE TESTIMONIAL CAROUSEL (REDWOOD STYLE)
          ======================================================== */}
      <motion.div
        className="browse__div-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="redwood-testimonial">
          <div className="redwood-testimonial__logo">
            <h3 className="redwood-testimonial__brand">
              <Quote size={28} className="redwood-testimonial__quote-icon" />
              {CLIENT_TESTIMONIALS[activeTestimonial].logo}
            </h3>
          </div>
          <div className="redwood-testimonial__body">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="redwood-testimonial__quote"
              >
                "{CLIENT_TESTIMONIALS[activeTestimonial].quote}"
              </motion.p>
            </AnimatePresence>
            <p className="redwood-testimonial__author">{CLIENT_TESTIMONIALS[activeTestimonial].author}</p>
          </div>
          <div className="redwood-testimonial__dots">
            {CLIENT_TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`redwood-testimonial__dot ${idx === activeTestimonial ? 'redwood-testimonial__dot--active' : ''}`}
                onClick={() => setActiveTestimonial(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          DIVISION 5: ZOHO STYLE MOST USED TAGS DIRECTORY
          ======================================================== */}
      <motion.div
        className="browse__div-5"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="section-title">Most Used Tags</h2>
        <div className="zoho-tags-board">
          {MOST_USED_TAGS.map((tag) => (
            <button
              key={tag.name}
              type="button"
              className="zoho-tag-pill"
              onClick={() => dispatch(setSearch(tag.name))}
            >
              {tag.name} <span className="zoho-tag-count">({tag.count})</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ========================================================
          DIVISION 6: MICROSOFT APPSOURCE COLLAPSIBLE SIDEBAR & CATALOG GRID
          ======================================================== */}
      <motion.div
        id="appsource-catalog"
        className="browse__div-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="appsource-layout">
          
          {/* Left Sidebar Filter Panel */}
          <aside className="appsource-sidebar">
            <div className="appsource-sidebar__header">
              <div className="appsource-sidebar__title">
                <Filter size={16} />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button type="button" className="appsource-sidebar__clear" onClick={handleClearAllFilters}>
                  Clear all
                </button>
              )}
            </div>

            {/* Sidebar Filter Search */}
            <div className="appsource-sidebar__search">
              <Search size={14} className="appsource-sidebar__search-icon" />
              <input
                type="text"
                placeholder="Search filters..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
              {filterSearch && <X size={14} className="appsource-sidebar__search-clear" onClick={() => setFilterSearch('')} />}
            </div>

            {/* Filter Section 1: Pricing Model */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedPricing(!collapsedPricing)}>
                <span>Pricing Model</span>
                {collapsedPricing ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              
              {!collapsedPricing && (
                <div className="appsource-sidebar__section-content">
                  {['Free', 'Pay-As-You-Go', 'Subscription'].map(type => {
                    const count = filterCounts.pricing[type as keyof typeof filterCounts.pricing] || 0;
                    if (filterSearch && !type.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={type} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedPricing.includes(type)}
                          onChange={() => setSelectedPricing(prev => prev.includes(type) ? prev.filter(x => x !== type) : [...prev, type])}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{type}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 2: SLA Guarantee */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedSLA(!collapsedSLA)}>
                <span>Uptime SLA</span>
                {collapsedSLA ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              
              {!collapsedSLA && (
                <div className="appsource-sidebar__section-content">
                  {['99.9%+', '99.0%+', '95.0%+'].map(sla => {
                    const count = filterCounts.sla[sla as keyof typeof filterCounts.sla] || 0;
                    if (filterSearch && !sla.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={sla} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedSLA.includes(sla)}
                          onChange={() => setSelectedSLA(prev => prev.includes(sla) ? prev.filter(x => x !== sla) : [...prev, sla])}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{sla}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 3: Enterprise Integrations */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedIntegrations(!collapsedIntegrations)}>
                <span>Integrations</span>
                {collapsedIntegrations ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              
              {!collapsedIntegrations && (
                <div className="appsource-sidebar__section-content">
                  {['Slack', 'Salesforce', 'GitHub', 'Jira', 'HubSpot'].map(intg => {
                    const count = filterCounts.integrations[intg] || 0;
                    if (filterSearch && !intg.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={intg} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedIntegrations.includes(intg)}
                          onChange={() => setSelectedIntegrations(prev => prev.includes(intg) ? prev.filter(x => x !== intg) : [...prev, intg])}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{intg}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 4: Rating Threshold */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedRatings(!collapsedRatings)}>
                <span>Rating</span>
                {collapsedRatings ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              
              {!collapsedRatings && (
                <div className="appsource-sidebar__section-content">
                  {['4.5+ Stars', '4.0+ Stars', '3.5+ Stars'].map(ratingOpt => {
                    const count = filterCounts.ratings[ratingOpt as keyof typeof filterCounts.ratings] || 0;
                    if (filterSearch && !ratingOpt.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={ratingOpt} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(ratingOpt)}
                          onChange={() => setSelectedRatings(prev => prev.includes(ratingOpt) ? prev.filter(x => x !== ratingOpt) : [...prev, ratingOpt])}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{ratingOpt}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 5: Industry */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedIndustry(!collapsedIndustry)}>
                <span>Industry</span>
                {collapsedIndustry ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              {!collapsedIndustry && (
                <div className="appsource-sidebar__section-content">
                  {ALL_INDUSTRIES.map(ind => {
                    const count = filterCounts.industry[ind] || 0;
                    if (filterSearch && !ind.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={ind} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedIndustry.includes(ind)}
                          onChange={() => dispatch(toggleIndustry(ind))}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{ind}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 6: Region */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedRegion(!collapsedRegion)}>
                <span>Region</span>
                {collapsedRegion ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              {!collapsedRegion && (
                <div className="appsource-sidebar__section-content">
                  {ALL_REGIONS.map(r => {
                    const count = filterCounts.region[r] || 0;
                    if (filterSearch && !r.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={r} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedRegion.includes(r)}
                          onChange={() => dispatch(toggleRegion(r))}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{r}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 7: Cloud Provider */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedCloud(!collapsedCloud)}>
                <span>Cloud Platform</span>
                {collapsedCloud ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              {!collapsedCloud && (
                <div className="appsource-sidebar__section-content">
                  {ALL_CLOUDS.map(c => {
                    const count = filterCounts.cloud[c] || 0;
                    if (filterSearch && !c.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={c} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedCloud.includes(c)}
                          onChange={() => dispatch(toggleCloud(c))}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{c}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Section 8: Vendor */}
            <div className="appsource-sidebar__section">
              <button type="button" className="appsource-sidebar__section-trigger" onClick={() => setCollapsedVendor(!collapsedVendor)}>
                <span>Vendor</span>
                {collapsedVendor ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              {!collapsedVendor && (
                <div className="appsource-sidebar__section-content">
                  {allVendors.map(v => {
                    const count = filterCounts.vendor[v] || 0;
                    if (filterSearch && !v.toLowerCase().includes(filterSearch.toLowerCase())) return null;
                    return (
                      <label key={v} className="appsource-sidebar__checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedVendor.includes(v)}
                          onChange={() => dispatch(toggleVendor(v))}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{v}</span>
                        <span className="checkbox-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* Right Main Grid & Dropdowns View */}
          <div className="appsource-main">
            
            {/* Top Dropdowns and Action bar */}
            <div className="appsource-topbar">
              <div className="appsource-topbar__left-heading">
                <span className="appsource-topbar__title">AI Extensions results</span>
                <span className="appsource-topbar__count">Showing {fullyFilteredTools.length} of {filteredTools.length} entries</span>
              </div>

              <div className="appsource-topbar__filters">
                <select
                  value={sort}
                  onChange={(e) => dispatch(setSort(e.target.value as FilterState['sort']))}
                  className="appsource-topbar__select"
                >
                  <option value="popular">Sort: Most Popular</option>
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Sort: Price Low to High</option>
                  <option value="price-high">Sort: Price High to Low</option>
                </select>

                <select
                  value={billingFilter}
                  onChange={(e) => setBillingFilter(e.target.value)}
                  className="appsource-topbar__select"
                >
                  <option value="all">Billing Type: All</option>
                  <option value="free">Free Plans Only</option>
                  <option value="paid">Commercial Plans</option>
                </select>

                <select
                  value={slaFilter}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="appsource-topbar__select"
                >
                  <option value="all">SLA Tier: All</option>
                  <option value="critical">Critical (99.9%+)</option>
                  <option value="standard">Standard (99.0%+)</option>
                </select>

                <div className="appsource-topbar__view-toggle">
                  <button
                    type="button"
                    className={viewMode === 'grid' ? 'appsource-topbar__view-btn appsource-topbar__view-btn--active' : 'appsource-topbar__view-btn'}
                    onClick={() => dispatch(setViewMode('grid'))}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={15} />
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'list' ? 'appsource-topbar__view-btn appsource-topbar__view-btn--active' : 'appsource-topbar__view-btn'}
                    onClick={() => dispatch(setViewMode('list'))}
                    aria-label="List view"
                  >
                    <ListIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pills Container */}
            {hasActiveFilters && (
              <div className="appsource-active-tags">
                {categories.map(cat => (
                  <span key={cat} className="active-tag">
                    Category: {cat}
                    <button type="button" onClick={() => dispatch(toggleCategory(cat))}><X size={10} /></button>
                  </span>
                ))}
                {search && (
                  <span className="active-tag">
                    Search: "{search}"
                    <button type="button" onClick={() => dispatch(setSearch(''))}><X size={10} /></button>
                  </span>
                )}
                {selectedPricing.map(type => (
                  <span key={type} className="active-tag">
                    Pricing: {type}
                    <button type="button" onClick={() => setSelectedPricing(prev => prev.filter(x => x !== type))}><X size={10} /></button>
                  </span>
                ))}
                {selectedSLA.map(sla => (
                  <span key={sla} className="active-tag">
                    SLA: {sla}
                    <button type="button" onClick={() => setSelectedSLA(prev => prev.filter(x => x !== sla))}><X size={10} /></button>
                  </span>
                ))}
                {selectedIntegrations.map(intg => (
                  <span key={intg} className="active-tag">
                    Integration: {intg}
                    <button type="button" onClick={() => setSelectedIntegrations(prev => prev.filter(x => x !== intg))}><X size={10} /></button>
                  </span>
                ))}
                {selectedRatings.map(ratingOpt => (
                  <span key={ratingOpt} className="active-tag">
                    Rating: {ratingOpt}
                    <button type="button" onClick={() => setSelectedRatings(prev => prev.filter(x => x !== ratingOpt))}><X size={10} /></button>
                  </span>
                ))}
                {billingFilter !== 'all' && (
                  <span className="active-tag">
                    Billing: {billingFilter === 'free' ? 'Free' : 'Commercial'}
                    <button type="button" onClick={() => setBillingFilter('all')}><X size={10} /></button>
                  </span>
                )}
                {slaFilter !== 'all' && (
                  <span className="active-tag">
                    SLA Guarantee: {slaFilter === 'critical' ? 'Critical' : 'Standard'}
                    <button type="button" onClick={() => setSlaFilter('all')}><X size={10} /></button>
                  </span>
                )}
                {selectedIndustry.map(ind => (
                  <span key={ind} className="active-tag">
                    Industry: {ind}
                    <button type="button" onClick={() => dispatch(toggleIndustry(ind))}><X size={10} /></button>
                  </span>
                ))}
                {selectedRegion.map(r => (
                  <span key={r} className="active-tag">
                    Region: {r}
                    <button type="button" onClick={() => dispatch(toggleRegion(r))}><X size={10} /></button>
                  </span>
                ))}
                {selectedCloud.map(c => (
                  <span key={c} className="active-tag">
                    Cloud: {c}
                    <button type="button" onClick={() => dispatch(toggleCloud(c))}><X size={10} /></button>
                  </span>
                ))}
                {selectedVendor.map(v => (
                  <span key={v} className="active-tag">
                    Vendor: {v}
                    <button type="button" onClick={() => dispatch(toggleVendor(v))}><X size={10} /></button>
                  </span>
                ))}
                <button type="button" className="active-tag-clear" onClick={handleClearAllFilters}>
                  Clear all
                </button>
              </div>
            )}

            {/* Extended Grid Layout */}
            {fullyFilteredTools.length > 0 ? (
              <div className={viewMode === 'list' ? 'appsource-grid appsource-grid--list' : 'appsource-grid'}>
                {paginatedTools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.icon);
                  const price = formatPrice(tool);
                  const isFavorite = favorites.includes(tool.id);
                  return (
                    <div key={tool.id} className="appsource-card" onClick={() => navigate(`/tool/${tool.id}`)}>
                      <button
                        type="button"
                        className={`appsource-card__bookmark ${isFavorite ? 'appsource-card__bookmark--active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleFavorite(tool.id));
                        }}
                        aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
                      >
                        <Bookmark size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      {tool.badge && (
                        <div className="appsource-card__badge-wrapper">
                          <Badge variant={BADGE_MAP[tool.badge] || 'new'} size="sm">
                            {tool.badge}
                          </Badge>
                        </div>
                      )}

                      <div className="appsource-card__visual">
                        <div className="appsource-card__visual-circle" style={{ background: getIconBg(tool.category), color: getIconColor(tool.category) }}>
                          <ToolIcon size={24} />
                        </div>
                      </div>

                      <div className="appsource-card__info">
                        <h3 className="appsource-card__name">{tool.name}</h3>
                        <p className="appsource-card__publisher">{tool.company}</p>
                        
                        <div className="appsource-card__category-badge">
                          <CheckCircle size={10} style={{ color: 'var(--accent-success)' }} />
                          <span>{tool.category}</span>
                        </div>

                        <p className="appsource-card__desc">{tool.description}</p>

                        <div className="appsource-card__footer">
                          <div className="appsource-card__footer-info">
                            <div className="appsource-card__rating">
                              <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                              <span className="appsource-card__rating-val">{tool.rating.toFixed(1)}</span>
                              <span className="appsource-card__reviews-count">({tool.reviewCount} ratings)</span>
                            </div>
                            
                            <div className="appsource-card__price-row">
                              <span className={`appsource-card__price ${price.isFree ? 'appsource-card__price--free' : ''}`}>
                                {price.text}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="appsource-card__btn-install"
                            onClick={(e) => handleInstall(tool.name, e)}
                          >
                            Get it now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="browse__empty">
                <div className="browse__empty-icon">
                  <SearchX size={28} />
                </div>
                <h3>No extensions match the selected filters</h3>
                <p>Try resetting the side checkboxes or top filters to discover more items.</p>
                <button
                  type="button"
                  className="browse__reset-btn"
                  onClick={handleClearAllFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {fullyFilteredTools.length > pageSize && (
              <div className="appsource-pagination">
                <button
                  type="button"
                  className="appsource-pagination__btn"
                  disabled={currentPage === 1}
                  onClick={() => dispatch(setPage(currentPage - 1))}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <div className="appsource-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`appsource-pagination__page ${p === currentPage ? 'appsource-pagination__page--active' : ''}`}
                      onClick={() => dispatch(setPage(p))}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="appsource-pagination__btn"
                  disabled={currentPage === totalPages}
                  onClick={() => dispatch(setPage(currentPage + 1))}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}

export default Browse;

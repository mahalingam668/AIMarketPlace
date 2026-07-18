import type { AITool } from '../../../types';

export interface MarketplaceSubCategory {
  slug: string;
  name: string;
}

export interface MarketplaceCategory {
  slug: string;
  name: string;
  icon: string;
  description: string;
  subCategories: MarketplaceSubCategory[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The platform's real AI Services taxonomy (blueprint §1.2 / Appendix A) —
 * the seven top-level groups a buyer actually browses, each with the
 * sub-categories called out in the blueprint appendix. This is intentionally
 * separate from ToolCategory (src/types/index.ts), the much larger generic
 * enterprise-SaaS taxonomy that Browse/Home/MegaMenu still use — retaxonomizing
 * that union and its ~150 seeded tools is a much bigger data migration than
 * this pass covers. LEGACY_CATEGORY_TO_TAXONOMY below bridges the two so
 * existing gig data has a home under the new groups without one.
 */
const AI_SERVICES_TAXONOMY: { name: string; icon: string; description: string; subCategories: string[] }[] = [
  {
    name: 'AI Mobile Development',
    icon: 'Smartphone',
    description: 'AI-powered apps, websites, chatbots, agents, and integrations.',
    subCategories: [
      'AI mobile apps',
      'AI websites & software',
      'AI chatbot development',
      'AI integrations',
      'AI agents',
      'AI fine-tuning',
      'AI technology consulting',
      // Added beyond the blueprint's original appendix list, same taxonomy group
      'AI workflow automation',
      'AI API & backend development',
      'AI browser extensions & plugins',
      'MLOps & deployment consulting',
    ],
  },
  {
    name: 'AI Artists',
    icon: 'Palette',
    description: 'Avatar design, Midjourney and Stable Diffusion artists, AI art.',
    subCategories: [
      'AI avatar design',
      'ComfyUI workflow creation',
      'Midjourney artists',
      'Stable Diffusion artists',
      'General AI art services',
      'AI logo & brand design',
      'AI game asset design',
      'AI 3D model generation',
      'AI NFT & digital collectible art',
    ],
  },
  {
    name: 'AI for Businesses',
    icon: 'Briefcase',
    description: 'AI consulting, strategy, and training for teams.',
    subCategories: [
      'AI consulting',
      'AI strategy',
      'AI lessons / training',
      'AI readiness assessments',
      'AI policy & governance advisory',
      'AI ROI & cost optimization consulting',
      'Custom AI workshops for teams',
    ],
  },
  {
    name: 'AI Video',
    icon: 'Video',
    description: 'AI music videos, video avatars, and AI-generated UGC.',
    subCategories: [
      'AI music videos',
      'AI video avatars',
      'AI-generated UGC',
      'AI video editing & post-production',
      'AI explainer & product demo videos',
      'AI dubbing & lip-sync localization',
      'AI motion graphics & animation',
    ],
  },
  {
    name: 'AI Audio',
    icon: 'Mic',
    description: 'Voice synthesis and text to speech.',
    subCategories: [
      'Voice synthesis and AI voice',
      'Text to speech',
      'AI music generation',
      'AI podcast editing & enhancement',
      'AI sound effects design',
      'AI audio transcription & captioning',
    ],
  },
  {
    name: 'AI Content',
    icon: 'FileText',
    description: 'Content editing and custom writing prompts.',
    subCategories: [
      'AI content editing',
      'Custom writing prompts',
      'AI copywriting & marketing content',
      'AI SEO content optimization',
      'AI ebook & long-form writing',
      'AI social media content creation',
    ],
  },
  {
    name: 'Data',
    icon: 'BarChart3',
    description: 'Data science & machine learning, analytics, and visualization.',
    subCategories: [
      'Data science & machine learning',
      'Data analytics',
      'Data visualization',
      'Data engineering & pipeline design',
      'Predictive analytics & forecasting',
      'Data annotation & labeling',
      'AI training data curation',
    ],
  },
];

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = AI_SERVICES_TAXONOMY.map((cat) => ({
  slug: slugify(cat.name),
  name: cat.name,
  icon: cat.icon,
  description: cat.description,
  subCategories: cat.subCategories.map((sub) => ({ slug: slugify(sub), name: sub })),
}));

export function getCategoryBySlug(slug: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);
}

/** Every legacy ToolCategory maps to exactly one AI-services group, so no
 * existing gig is orphaned by the retaxonomy. */
const LEGACY_CATEGORY_TO_TAXONOMY: Record<string, string> = {
  'Language Models': 'AI Mobile Development',
  'Image Generation': 'AI Artists',
  'Code Assistant': 'AI Mobile Development',
  'Data Analytics': 'Data',
  'Voice & Audio': 'AI Audio',
  'Video Generation': 'AI Video',
  'Document AI': 'AI Content',
  'Search & Research': 'AI Content',
  'AI Apps and Agents': 'AI Mobile Development',
  Analytics: 'Data',
  Blockchain: 'AI for Businesses',
  Collaboration: 'AI for Businesses',
  Commerce: 'AI for Businesses',
  'Compliance & Legal': 'AI for Businesses',
  'Customer Service': 'AI Mobile Development',
  Databases: 'Data',
  'Developer Tools': 'AI Mobile Development',
  DevOps: 'AI Mobile Development',
  Finance: 'AI for Businesses',
  Geolocation: 'AI for Businesses',
  'Human Resources': 'AI for Businesses',
  Identity: 'AI Mobile Development',
  'Infrastructure Services': 'AI Mobile Development',
  Integration: 'AI Mobile Development',
  'Internet of Things': 'AI Mobile Development',
  'IT & Management Tools': 'AI for Businesses',
  'Machine Learning': 'Data',
  Marketing: 'AI Content',
  Media: 'AI Video',
  'Microsoft Entra ID': 'AI Mobile Development',
  Migration: 'AI Mobile Development',
  'Mixed Reality': 'AI Artists',
  'Monitoring & Diagnostics': 'Data',
  'Operations & Supply Chain': 'AI for Businesses',
  Productivity: 'AI for Businesses',
  Sales: 'AI for Businesses',
  Security: 'AI for Businesses',
  'Task & Project Management': 'AI for Businesses',
  Web: 'AI Mobile Development',
};

export function taxonomyGroupForLegacyCategory(legacyCategory: string): string {
  return LEGACY_CATEGORY_TO_TAXONOMY[legacyCategory] ?? 'AI for Businesses';
}

export function getToolsForCategory(tools: AITool[], categoryName: string): AITool[] {
  return tools.filter((tool) => taxonomyGroupForLegacyCategory(tool.category) === categoryName);
}

export function getCategoryCounts(tools: AITool[]): Record<string, number> {
  const counts: Record<string, number> = {};
  tools.forEach((tool) => {
    const group = taxonomyGroupForLegacyCategory(tool.category);
    counts[group] = (counts[group] || 0) + 1;
  });
  return counts;
}

/** Cheapest listed price per category — the "starting price" the blueprint
 * wants shown on the category index (§2.2 step 2). */
export function getCategoryStartingPrices(tools: AITool[]): Record<string, number> {
  const prices: Record<string, number> = {};
  tools.forEach((tool) => {
    const group = taxonomyGroupForLegacyCategory(tool.category);
    const cheapest = tool.pricing.reduce((min, p) => Math.min(min, p.price), Infinity);
    if (!Number.isFinite(cheapest)) return;
    if (!(group in prices) || cheapest < prices[group]) {
      prices[group] = cheapest;
    }
  });
  return prices;
}

const SUB_CATEGORY_STOPWORDS = new Set(['ai', 'and', 'the', 'for', 'of', 'a', 'to', 'services', 'service', 'general']);

function keywordsFor(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !SUB_CATEGORY_STOPWORDS.has(word));
}

/** Best-effort keyword match between a sub-category label and a tool's
 * searchable text — there's no per-gig sub-category field in the underlying
 * data, so this is what powers the sub-category chips on the category page. */
export function toolMatchesSubCategory(tool: AITool, subCategoryName: string): boolean {
  const keywords = keywordsFor(subCategoryName);
  if (keywords.length === 0) return true;
  const haystack = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

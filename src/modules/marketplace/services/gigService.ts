import { aiTools } from '../../../data/mockData';
import { VENDOR_PROFILES } from '../../../data/vendorProfiles';
import type { AITool } from '../../../types';
import type { Gig, GigFaqItem, GigPackage, GigReview } from '../types/gig.types';

const SIMULATED_LATENCY_MS = 250;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const REVIEWER_TITLES = [
  'VP of Engineering',
  'Head of Product',
  'Senior Data Analyst',
  'Director of Operations',
  'Lead Software Engineer',
  'IT Program Manager',
  'Head of Customer Success',
  'Principal Architect',
];

function seedFromId(id: string): number {
  let seed = 0;
  for (let i = 0; i < id.length; i += 1) seed += id.charCodeAt(i);
  return seed;
}

function buildPackages(tool: AITool): GigPackage[] {
  const tiers: { tier: GigPackage['tier']; deliveryDays: number; revisions: string }[] = [
    { tier: 'Basic', deliveryDays: 5, revisions: '1 revision' },
    { tier: 'Standard', deliveryDays: 3, revisions: '3 revisions' },
    { tier: 'Premium', deliveryDays: 1, revisions: 'Unlimited revisions' },
  ];
  const plans = tool.pricing.length > 0 ? tool.pricing : [{ name: 'Standard', price: 0, period: 'monthly' as const, features: [] }];

  return tiers.map((t, i) => {
    // Spread the tool's real pricing plans across the 3 package tiers —
    // repeats the last plan if the tool has fewer than 3 defined.
    const plan = plans[Math.min(i, plans.length - 1)];
    return {
      tier: t.tier,
      name: plan.name,
      price: plan.price,
      deliveryDays: t.deliveryDays,
      revisions: t.revisions,
      features: plan.features.length > 0 ? plan.features : [`${tool.category} access`, 'Email support'],
    };
  });
}

function buildFaq(tool: AITool): GigFaqItem[] {
  return [
    {
      question: `What's included in the ${tool.name} packages?`,
      answer: `Every package includes access to ${tool.name}'s core ${tool.category.toLowerCase()} capabilities. Higher tiers add faster delivery, more revisions, and priority support — see the package comparison above for the full breakdown.`,
    },
    {
      question: 'How long does delivery typically take?',
      answer: `Standard delivery is ${tool.uptime >= 99.9 ? '1-3' : '3-5'} business days depending on the package you choose, with Premium offering the fastest turnaround.`,
    },
    {
      question: 'Do you offer integration support?',
      answer:
        tool.integrations.length > 0
          ? `Yes — ${tool.name} ships with pre-built integrations for ${tool.integrations.slice(0, 3).join(', ')}${tool.integrations.length > 3 ? ', and more' : ''}.`
          : `${tool.name} exposes a documented API; custom integration guidance is available on request.`,
    },
  ];
}

function buildReviews(tool: AITool): GigReview[] {
  const seed = seedFromId(tool.id);
  const count = 3;
  return Array.from({ length: count }, (_, i) => {
    const title = REVIEWER_TITLES[(seed + i * 7) % REVIEWER_TITLES.length];
    const ratingOffset = i === count - 1 ? 0 : (i % 2 === 0 ? 0 : -0.2);
    return {
      id: `${tool.id}-review-${i + 1}`,
      author: title,
      rating: Math.max(3.5, Math.min(5, Math.round((tool.rating + ratingOffset) * 10) / 10)),
      comment:
        i === 0
          ? `${tool.name} slotted into our stack faster than expected — the documentation and default configuration did most of the work for us.`
          : i === 1
            ? `Solid reliability at our scale. Support has been responsive whenever we've needed to escalate something.`
            : `Would recommend for teams evaluating ${tool.category.toLowerCase()} tools — pricing scales sensibly as usage grows.`,
      date: new Date(2025, (seed + i * 3) % 12, ((seed + i) % 27) + 1).toISOString().slice(0, 10),
    };
  });
}

function toGig(tool: AITool, index: number): Gig {
  const seller = VENDOR_PROFILES[index % VENDOR_PROFILES.length];
  const packages = buildPackages(tool);
  return {
    ...tool,
    sellerId: seller.id,
    packages,
    faq: buildFaq(tool),
    galleryIcons: [tool.icon, 'Sparkles', 'CheckCircle'],
    reviews: buildReviews(tool),
    deliveryDays: packages[0].deliveryDays,
    revisions: packages[0].revisions,
  };
}

// Built once at module load — the whole app shares this single derived list,
// same lifetime as the underlying aiTools/VENDOR_PROFILES mock arrays.
const GIGS: Gig[] = aiTools.map((tool, index) => toGig(tool, index));

export const gigService = {
  getGigs: (): Promise<Gig[]> => delay(GIGS),

  getGigById: (id: string): Promise<Gig | undefined> => delay(GIGS.find((g) => g.id === id)),

  getGigsByCategory: (category: string): Promise<Gig[]> => delay(GIGS.filter((g) => g.category === category)),

  getGigsBySeller: (sellerId: string): Promise<Gig[]> => delay(GIGS.filter((g) => g.sellerId === sellerId)),

  getRelatedGigs: (gig: Gig, limit = 4): Promise<Gig[]> =>
    delay(GIGS.filter((g) => g.category === gig.category && g.id !== gig.id).slice(0, limit)),

  searchGigs: (query: string): Promise<Gig[]> => {
    const q = query.trim().toLowerCase();
    if (!q) return delay([]);
    return delay(
      GIGS.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.company.toLowerCase().includes(q)
      )
    );
  },
};

export const gigKeys = {
  all: ['gigs'] as const,
  detail: (id: string) => ['gigs', id] as const,
  byCategory: (category: string) => ['gigs', 'category', category] as const,
  bySeller: (sellerId: string) => ['gigs', 'seller', sellerId] as const,
  related: (id: string) => ['gigs', id, 'related'] as const,
  search: (query: string) => ['gigs', 'search', query] as const,
};

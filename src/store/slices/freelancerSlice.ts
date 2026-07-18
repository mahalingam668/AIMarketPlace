import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GigPackage, PackageTier } from '../../modules/marketplace/types/gig.types';

export interface FreelancerProfile {
  displayName: string;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  languages: string[];
  location: string;
  available: boolean;
}

export type GigStatus = 'active' | 'paused' | 'draft';

// Same package-tier shape the public marketplace gig pages use (GigPackage) —
// a developer's gig and what a buyer sees on /gig/:id now describe pricing
// identically, instead of a flat `price` number that couldn't represent the
// blueprint's Basic/Standard/Premium packages at all.
const PACKAGE_TIER_DEFAULTS: Record<PackageTier, { deliveryDays: number; revisions: string }> = {
  Basic: { deliveryDays: 5, revisions: '1 revision' },
  Standard: { deliveryDays: 3, revisions: '3 revisions' },
  Premium: { deliveryDays: 1, revisions: 'Unlimited revisions' },
};

export function buildGigPackages(category: string, prices: Record<PackageTier, number>): GigPackage[] {
  return (Object.keys(PACKAGE_TIER_DEFAULTS) as PackageTier[]).map((tier) => ({
    tier,
    name: tier,
    price: prices[tier],
    deliveryDays: PACKAGE_TIER_DEFAULTS[tier].deliveryDays,
    revisions: PACKAGE_TIER_DEFAULTS[tier].revisions,
    features: [`${category || 'Service'} delivery`, PACKAGE_TIER_DEFAULTS[tier].revisions],
  }));
}

export interface FreelancerGig {
  id: string;
  title: string;
  category: string;
  status: GigStatus;
  packages: GigPackage[];
  impressions: number;
  clicks: number;
  orders: number;
  createdAt: string;
}

export type ProposalStatus = 'pending' | 'accepted' | 'declined';

export interface FreelancerProposal {
  id: string;
  jobTitle: string;
  clientName: string;
  bidAmount: number;
  deliveryDays: number;
  status: ProposalStatus;
  submittedAt: string;
  coverLetterExcerpt: string;
}

export interface EarningsPoint {
  month: string;
  earnings: number;
}

export type PayoutMethod = 'bank' | 'paypal';

export interface PayoutRecord {
  id: string;
  amount: number;
  method: PayoutMethod;
  status: 'completed' | 'processing';
  date: string;
}

interface FreelancerState {
  profile: FreelancerProfile;
  gigs: FreelancerGig[];
  proposals: FreelancerProposal[];
  earningsHistory: EarningsPoint[];
  walletBalance: number;
  pendingClearance: number;
  payoutHistory: PayoutRecord[];
}

const initialState: FreelancerState = {
  profile: {
    displayName: 'Arjun Mehta',
    title: 'Full-Stack Integration Developer',
    bio: 'I help teams wire AI marketplace tools into their existing CRM, ERP, and support-desk stacks via custom middleware. 5+ years shipping production integrations for mid-market SaaS teams.',
    hourlyRate: 65,
    skills: ['Node.js', 'REST APIs', 'Zapier', 'Webhooks', 'TypeScript'],
    languages: ['English', 'Hindi'],
    location: 'Bengaluru, India',
    available: true,
  },
  gigs: [
    {
      id: 'gig-crm-sync',
      title: 'I will build a custom CRM integration for your SaaS product',
      category: 'CRM Integration',
      status: 'active',
      packages: buildGigPackages('CRM Integration', { Basic: 220, Standard: 380, Premium: 650 }),
      impressions: 4820,
      clicks: 312,
      orders: 27,
      createdAt: '2026-02-14',
    },
    {
      id: 'gig-webhook-bridge',
      title: 'I will build a webhook bridge between two APIs',
      category: 'API Development',
      status: 'active',
      packages: buildGigPackages('API Development', { Basic: 150, Standard: 260, Premium: 420 }),
      impressions: 2960,
      clicks: 198,
      orders: 19,
      createdAt: '2026-03-02',
    },
    {
      id: 'gig-erp-sync',
      title: 'I will sync your ERP orders with any marketplace tool',
      category: 'Operations',
      status: 'paused',
      packages: buildGigPackages('Operations', { Basic: 340, Standard: 560, Premium: 890 }),
      impressions: 1140,
      clicks: 64,
      orders: 6,
      createdAt: '2026-01-20',
    },
    {
      id: 'gig-support-desk',
      title: 'I will connect your support desk to Slack and email alerts',
      category: 'Customer Service',
      status: 'draft',
      packages: buildGigPackages('Customer Service', { Basic: 120, Standard: 200, Premium: 320 }),
      impressions: 0,
      clicks: 0,
      orders: 0,
      createdAt: '2026-06-30',
    },
  ],
  proposals: [
    {
      id: 'prop-1',
      jobTitle: 'Integrate Salesforce with internal billing system',
      clientName: 'NorthPeak Robotics',
      bidAmount: 1800,
      deliveryDays: 14,
      status: 'pending',
      submittedAt: '2026-07-08',
      coverLetterExcerpt: "I've built this exact Salesforce ↔ billing sync pattern for two other SaaS teams this year...",
    },
    {
      id: 'prop-2',
      jobTitle: 'Build Zapier alternative middleware for internal tools',
      clientName: 'Fernhill Analytics',
      bidAmount: 2400,
      deliveryDays: 21,
      status: 'accepted',
      submittedAt: '2026-06-22',
      coverLetterExcerpt: 'Happy to scope this as a phased build — webhook ingestion first, transformation rules second...',
    },
    {
      id: 'prop-3',
      jobTitle: 'One-off script to migrate 40K contacts between CRMs',
      clientName: 'Solari Devices',
      bidAmount: 650,
      deliveryDays: 5,
      status: 'declined',
      submittedAt: '2026-06-10',
      coverLetterExcerpt: 'I can handle deduplication and field-mapping conflicts as part of the migration script...',
    },
    {
      id: 'prop-4',
      jobTitle: 'Ongoing support-desk automation retainer',
      clientName: 'Lumen Health Partners',
      bidAmount: 1200,
      deliveryDays: 30,
      status: 'pending',
      submittedAt: '2026-07-11',
      coverLetterExcerpt: 'A monthly retainer works well for this kind of iterative automation work — here is how I would structure it...',
    },
  ],
  earningsHistory: [
    { month: 'Feb', earnings: 2140 },
    { month: 'Mar', earnings: 2860 },
    { month: 'Apr', earnings: 2410 },
    { month: 'May', earnings: 3320 },
    { month: 'Jun', earnings: 3980 },
    { month: 'Jul', earnings: 2560 },
  ],
  walletBalance: 4260,
  pendingClearance: 1180,
  payoutHistory: [
    { id: 'payout-1', amount: 2200, method: 'bank', status: 'completed', date: '2026-06-28' },
    { id: 'payout-2', amount: 1450, method: 'paypal', status: 'completed', date: '2026-05-30' },
    { id: 'payout-3', amount: 1900, method: 'bank', status: 'completed', date: '2026-04-25' },
    { id: 'payout-4', amount: 600, method: 'paypal', status: 'processing', date: '2026-07-10' },
  ],
};

const freelancerSlice = createSlice({
  name: 'freelancer',
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<FreelancerProfile>) {
      state.profile = action.payload;
    },
    addGig(state, action: PayloadAction<FreelancerGig>) {
      state.gigs.unshift(action.payload);
    },
    updateGig(state, action: PayloadAction<FreelancerGig>) {
      const index = state.gigs.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) state.gigs[index] = action.payload;
    },
    updateGigStatus(state, action: PayloadAction<{ id: string; status: GigStatus }>) {
      const gig = state.gigs.find((g) => g.id === action.payload.id);
      if (gig) gig.status = action.payload.status;
    },
    deleteGig(state, action: PayloadAction<string>) {
      state.gigs = state.gigs.filter((g) => g.id !== action.payload);
    },
    requestWithdrawal(state, action: PayloadAction<{ amount: number; method: PayoutMethod }>) {
      const { amount, method } = action.payload;
      if (amount <= 0 || amount > state.walletBalance) return;
      state.walletBalance -= amount;
      state.payoutHistory.unshift({
        id: `payout-${Date.now()}`,
        amount,
        method,
        status: 'processing',
        date: new Date().toISOString().slice(0, 10),
      });
    },
  },
});

export const { updateProfile, addGig, updateGig, updateGigStatus, deleteGig, requestWithdrawal } = freelancerSlice.actions;
export default freelancerSlice.reducer;

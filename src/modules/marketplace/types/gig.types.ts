import type { AITool } from '../../../types';

export type PackageTier = 'Basic' | 'Standard' | 'Premium';

export interface GigPackage {
  tier: PackageTier;
  name: string;
  price: number;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface GigFaqItem {
  question: string;
  answer: string;
}

export interface GigReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * A Gig is an existing AITool plus the Fiverr-shape fields a marketplace
 * listing needs. Extending AITool (rather than wrapping it) keeps every
 * existing AITool consumer untouched while letting new pages just read
 * gig.name / gig.rating etc. directly.
 */
export interface Gig extends AITool {
  sellerId: string;
  packages: GigPackage[];
  faq: GigFaqItem[];
  galleryIcons: string[];
  reviews: GigReview[];
  deliveryDays: number;
  revisions: string;
}

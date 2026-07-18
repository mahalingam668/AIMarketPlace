import type { PackageTier } from '../types/gig.types';

const STORAGE_KEY = 'yakkay_pending_gig_selection';

export interface PendingGigSelection {
  gigId: string;
  gigName: string;
  tier: PackageTier;
}

/**
 * Bridges the visitor decision point (blueprint §2.2 step 5) across the
 * signup redirect: a guest picking a package is sent to /register before an
 * order can exist, so we hold onto their intent in sessionStorage rather than
 * losing it — same pattern as the blueprint's "sign-up abandonment" edge case.
 */
export function savePendingGigSelection(selection: PendingGigSelection): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // sessionStorage unavailable (e.g. private mode) — the signup flow still
    // works, it just won't resume back to the gig afterward.
  }
}

export function readPendingGigSelection(): PendingGigSelection | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingGigSelection) : null;
  } catch {
    return null;
  }
}

export function clearPendingGigSelection(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

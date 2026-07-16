export type AccountRole = 'Company' | 'Developer' | 'Admin';

/** Includes the unauthenticated case, for anywhere a check needs to cover both. */
export type Role = 'Guest' | AccountRole;

export type AccessArea = 'shared' | 'crm' | 'freelancer' | 'admin';

/** Single source of truth for which account types can reach which app areas. */
export function canAccess(role: Role, area: AccessArea): boolean {
  switch (area) {
    case 'shared':
      return role !== 'Guest';
    case 'crm':
      return role === 'Company' || role === 'Admin';
    case 'freelancer':
      return role === 'Developer' || role === 'Admin';
    case 'admin':
      return role === 'Admin';
    default: {
      const _exhaustive: never = area;
      return _exhaustive;
    }
  }
}

/** Where each role lands right after login/register. */
export const ROLE_LANDING_PATH: Record<AccountRole, string> = {
  Company: '/crm/dashboard',
  Developer: '/freelancer/dashboard',
  Admin: '/dashboard',
};

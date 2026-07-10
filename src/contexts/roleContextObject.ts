import { createContext } from 'react';
import type { CrmPermissions, CrmRole } from '../constants/crmRoles';

export interface RoleContextValue {
  role: CrmRole;
  setRole: (role: CrmRole) => void;
  permissions: CrmPermissions;
  hasPermission: (key: keyof CrmPermissions) => boolean;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

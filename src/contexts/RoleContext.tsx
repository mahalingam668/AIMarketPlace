import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CRM_ROLE_PERMISSIONS, CRM_ROLE_STORAGE_KEY, type CrmPermissions, type CrmRole } from '../constants/crmRoles';
import { RoleContext, type RoleContextValue } from './roleContextObject';

function loadStoredRole(): CrmRole {
  try {
    const raw = localStorage.getItem(CRM_ROLE_STORAGE_KEY);
    if (raw && raw in CRM_ROLE_PERMISSIONS) return raw as CrmRole;
  } catch {
    /* fall through to default */
  }
  return 'Super Admin';
}

/**
 * Frontend-only RBAC. There is no backend user/role system for the CRM
 * module, so this exposes a "Preview Role" switcher (see ThemeSettingsPage)
 * that lets an admin see exactly what each role would see — the same
 * `permissions` object drives both the Sidebar and every CrmRoute guard.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<CrmRole>(loadStoredRole);

  const setRole = useCallback((next: CrmRole) => {
    setRoleState(next);
    try {
      localStorage.setItem(CRM_ROLE_STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable — role still updates for this session */
    }
  }, []);

  const permissions = useMemo<CrmPermissions>(() => CRM_ROLE_PERMISSIONS[role], [role]);

  const hasPermission = useCallback((key: keyof CrmPermissions) => Boolean(permissions[key]), [permissions]);

  const value = useMemo<RoleContextValue>(
    () => ({ role, setRole, permissions, hasPermission }),
    [role, setRole, permissions, hasPermission]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

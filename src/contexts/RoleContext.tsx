import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALL_CRM_ROLES, CRM_ROLE_PERMISSIONS, CRM_ROLE_STORAGE_KEY, type CrmPermissions, type CrmRole } from '../constants/crmRoles';
import type { AccountRole } from '../modules/auth/roles';
import { useAppSelector } from '../store';
import { RoleContext, type RoleContextValue } from './roleContextObject';

/**
 * Which CRM preview roles each real account type may select. Company
 * accounts default to (and are capped at) 'Admin' — never the platform-wide
 * 'Super Admin'. Only a real Admin account can preview every CRM role.
 */
const CRM_ROLES_AVAILABLE_TO: Record<AccountRole, CrmRole[]> = {
  Admin: ALL_CRM_ROLES,
  Company: ['Admin', 'Product Manager', 'Content Manager', 'Viewer'],
  Developer: ['Viewer'],
};

function defaultRoleFor(accountRole: AccountRole | undefined): CrmRole {
  if (accountRole === 'Admin') return 'Super Admin';
  if (accountRole === 'Company') return 'Admin';
  return 'Viewer';
}

function loadStoredRole(availableRoles: CrmRole[], defaultRole: CrmRole): CrmRole {
  try {
    const raw = localStorage.getItem(CRM_ROLE_STORAGE_KEY);
    // Only honor a stored preview role if the current account is actually
    // allowed to hold it — otherwise a stale/tampered value could grant a
    // Company (or Developer) account CRM permissions above their real role.
    if (raw && availableRoles.includes(raw as CrmRole)) return raw as CrmRole;
  } catch {
    /* fall through to default */
  }
  return defaultRole;
}

/**
 * Frontend-only RBAC. There is no backend user/role system for the CRM
 * module, so this exposes a "Preview Role" switcher (see ThemeSettingsPage)
 * that lets an admin see exactly what each role would see — the same
 * `permissions` object drives both the Sidebar and every CrmRoute guard.
 * The available/default role is derived from the real logged-in account
 * (`authSlice`), not an ambient default, so a Company or Developer account
 * can never end up previewing as 'Super Admin'.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const accountRole = useAppSelector((s) => s.auth.user?.role);
  const availableRoles = useMemo(() => CRM_ROLES_AVAILABLE_TO[accountRole ?? 'Developer'], [accountRole]);
  const defaultRole = useMemo(() => defaultRoleFor(accountRole), [accountRole]);

  const [role, setRoleState] = useState<CrmRole>(() => loadStoredRole(availableRoles, defaultRole));

  // Re-clamp if the logged-in account changes mid-session (e.g. logout then
  // sign back in as a different role without a full page reload).
  useEffect(() => {
    if (!availableRoles.includes(role)) setRoleState(defaultRole);
  }, [availableRoles, defaultRole, role]);

  const setRole = useCallback(
    (next: CrmRole) => {
      if (!availableRoles.includes(next)) return;
      setRoleState(next);
      try {
        localStorage.setItem(CRM_ROLE_STORAGE_KEY, next);
      } catch {
        /* localStorage unavailable — role still updates for this session */
      }
    },
    [availableRoles]
  );

  const permissions = useMemo<CrmPermissions>(() => CRM_ROLE_PERMISSIONS[role], [role]);

  const hasPermission = useCallback((key: keyof CrmPermissions) => Boolean(permissions[key]), [permissions]);

  const value = useMemo<RoleContextValue>(
    () => ({ role, setRole, permissions, hasPermission, availableRoles }),
    [role, setRole, permissions, hasPermission, availableRoles]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

import { Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useCrmRole } from '../hooks/useCrmRole';
import type { CrmPermissions } from '../constants/crmRoles';

interface CrmRouteProps {
  permission: keyof CrmPermissions;
}

/**
 * Frontend-only RBAC gate for CRM routes. This sits *inside* the app's real
 * <ProtectedRoute> (session auth is still required) and additionally checks
 * the mock CRM role's permission map — the same object that hides/shows
 * Sidebar entries, so a hidden menu item and a blocked route always agree.
 */
function CrmRoute({ permission }: CrmRouteProps) {
  const navigate = useNavigate();
  const { role, hasPermission } = useCrmRole();

  if (!hasPermission(permission)) {
    return (
      <div className="crm-empty-state" style={{ padding: '64px 20px' }}>
        <div className="crm-empty-state__icon" style={{ color: 'var(--crm-error)' }}>
          <ShieldAlert size={26} />
        </div>
        <h3 className="crm-empty-state__title">Access Restricted</h3>
        <p className="crm-empty-state__message">
          The <strong>{role}</strong> role does not have access to this section. Switch roles from Theme Settings to preview a different view.
        </p>
        <button type="button" className="crm-btn crm-btn--primary" onClick={() => navigate('/crm/dashboard')}>
          Back to CRM Dashboard
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export default CrmRoute;

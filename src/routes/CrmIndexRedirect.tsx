import { Navigate } from 'react-router-dom';
import { useCrmRole } from '../hooks/useCrmRole';

const FALLBACK_ORDER: { permission: 'dashboard' | 'products' | 'pages' | 'settings'; path: string }[] = [
  { permission: 'dashboard', path: '/crm/dashboard' },
  { permission: 'products', path: '/crm/products' },
  { permission: 'pages', path: '/crm/pages' },
  { permission: 'settings', path: '/crm/settings' },
];

/** Lands the visitor on the first CRM section their role can actually see. */
function CrmIndexRedirect() {
  const { hasPermission } = useCrmRole();
  const target = FALLBACK_ORDER.find((entry) => hasPermission(entry.permission));
  return <Navigate to={target?.path ?? '/crm/dashboard'} replace />;
}

export default CrmIndexRedirect;

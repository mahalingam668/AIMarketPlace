import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import type { AccountRole } from './roles';

interface ProtectedRouteProps {
  /** When omitted, any authenticated account role may pass. */
  allow?: AccountRole[];
}

function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface ProtectedRouteProps {
  requireRole?: 'Admin';
}

function ProtectedRoute({ requireRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

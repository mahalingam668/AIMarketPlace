import { Outlet } from 'react-router-dom';
import '../modules/admin/admin.css';

/** Namespaces every admin-portal page under one scoped stylesheet import. */
function AdminRootLayout() {
  return (
    <div className="admin-portal">
      <Outlet />
    </div>
  );
}

export default AdminRootLayout;

import { Outlet } from 'react-router-dom';
import '../modules/freelancer/freelancer.css';

/** Namespaces every freelancer-portal page under one scoped stylesheet import. */
function FreelancerRootLayout() {
  return (
    <div className="freelancer-portal">
      <Outlet />
    </div>
  );
}

export default FreelancerRootLayout;

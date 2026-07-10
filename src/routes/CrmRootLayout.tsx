import { Outlet } from 'react-router-dom';
import { useCrmTheme } from '../hooks/useCrmTheme';
import '../modules/crm/crm.css';

/** Applies CRM theme tokens as scoped CSS variables to every page under `/crm`. */
function CrmRootLayout() {
  const { cssVars } = useCrmTheme();
  return (
    <div className="crm-root" style={cssVars}>
      <Outlet />
    </div>
  );
}

export default CrmRootLayout;

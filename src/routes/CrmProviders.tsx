import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { RoleProvider } from '../contexts/RoleContext';
import { ProductsProvider } from '../contexts/ProductsContext';
import { PageConfigurationProvider } from '../contexts/PageConfigurationContext';
import { MenuProvider } from '../contexts/MenuContext';

/**
 * Mounted around the AppLayout route (so Sidebar can read CRM role/menu
 * state), not just the `/crm/*` subtree. Order matters: MenuProvider reads
 * from both ProductsProvider and PageConfigurationProvider for live badge
 * counts, so it must be nested innermost.
 */
function CrmProviders() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <ProductsProvider>
          <PageConfigurationProvider>
            <MenuProvider>
              <Outlet />
            </MenuProvider>
          </PageConfigurationProvider>
        </ProductsProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default CrmProviders;

import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import MarketplaceLayout from './components/layouts/MarketplaceLayout';
import ProtectedRoute from './modules/auth/ProtectedRoute';

import Home from './pages/Home';
import Browse from './pages/Browse';
import ToolDetail from './pages/ToolDetail';
import Catalog from './pages/Catalog';
import Governance from './pages/Governance';
import Integrations from './pages/Integrations';
import Documentation from './pages/Documentation';
import Compare from './pages/Compare';
import Customers from './pages/Customers';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import RequestDemo from './pages/RequestDemo';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import CrmProviders from './routes/CrmProviders';
import CrmRootLayout from './routes/CrmRootLayout';
import CrmRoute from './routes/CrmRoute';
import CrmIndexRedirect from './routes/CrmIndexRedirect';
import CrmDashboard from './modules/crm/dashboard/CrmDashboard';
import ProductsPage from './modules/crm/products/ProductsPage';
import ProductDetailsPage from './modules/crm/products/ProductDetailsPage';
import PagesManagementPage from './modules/crm/pages/PagesManagementPage';
import DynamicPageView from './modules/crm/pages/DynamicPageView';
import MenuManagementPage from './modules/crm/settings/MenuManagementPage';
import ThemeSettingsPage from './modules/crm/settings/ThemeSettingsPage';

function App() {
  return (
    <Routes>
      {/* Public marketplace shell: sticky header + mega menu, no sidebar */}
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/tool/:id" element={<ToolDetail />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-demo" element={<RequestDemo />} />
      </Route>

      {/* Auth pages: no shell */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated workspace shell: sidebar + topbar */}
      <Route element={<ProtectedRoute />}>
        {/* CrmProviders wraps AppLayout (not just /crm/*) so the Sidebar's
            CRM nav group can read live role/menu/theme state on every
            authenticated page, not only while inside the CRM module. */}
        <Route element={<CrmProviders />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/crm" element={<CrmRootLayout />}>
              <Route index element={<CrmIndexRedirect />} />
              <Route element={<CrmRoute permission="dashboard" />}>
                <Route path="dashboard" element={<CrmDashboard />} />
              </Route>
              <Route element={<CrmRoute permission="products" />}>
                <Route path="products" element={<ProductsPage />} />
              </Route>
              <Route element={<CrmRoute permission="productDetails" />}>
                <Route path="products/details" element={<ProductDetailsPage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
              </Route>
              <Route element={<CrmRoute permission="pages" />}>
                <Route path="pages" element={<PagesManagementPage />} />
                <Route path="pages/view/:pageKey" element={<DynamicPageView />} />
              </Route>
              <Route element={<CrmRoute permission="menus" />}>
                <Route path="menus" element={<MenuManagementPage />} />
              </Route>
              <Route element={<CrmRoute permission="settings" />}>
                <Route path="settings" element={<ThemeSettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Admin-only workspace route */}
      <Route element={<ProtectedRoute requireRole="Admin" />}>
        <Route element={<CrmProviders />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

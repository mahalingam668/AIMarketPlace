import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import MarketplaceLayout from './components/layouts/MarketplaceLayout';
import ProtectedRoute from './modules/auth/ProtectedRoute';

import Home from './pages/Home';
import Browse from './pages/Browse';
import ToolDetail from './pages/ToolDetail';
import VendorDetail from './pages/VendorDetail';
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
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import BecomeASeller from './pages/BecomeASeller';
import TrustSafety from './pages/TrustSafety';

import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard';
import Analytics from './pages/Analytics';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Lazy-loaded — the first code-split routes in the app. Marketplace
// browsing pages are reached less often than the always-visited Home/
// Browse, so they don't need to be in the initial bundle.
const CategoriesIndexPage = lazy(() => import('./modules/marketplace/pages/CategoriesIndexPage'));
const CategoryBrowsePage = lazy(() => import('./modules/marketplace/pages/CategoryBrowsePage'));
const SearchResultsPage = lazy(() => import('./modules/marketplace/pages/SearchResultsPage'));
const GigDetailsPage = lazy(() => import('./modules/marketplace/pages/GigDetailsPage'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const Forbidden = lazy(() => import('./pages/Forbidden'));

function LazyPageFallback() {
  return <div style={{ minHeight: '60vh' }} aria-busy="true" />;
}

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
import PostProjectPage from './modules/crm/projects/PostProjectPage';

import FreelancerRootLayout from './routes/FreelancerRootLayout';
import FreelancerDashboard from './modules/freelancer/dashboard/FreelancerDashboard';
import FreelancerProfilePage from './modules/freelancer/profile/FreelancerProfilePage';
import FreelancerGigsPage from './modules/freelancer/gigs/FreelancerGigsPage';
import FreelancerProposalsPage from './modules/freelancer/proposals/FreelancerProposalsPage';
import FreelancerEarningsPage from './modules/freelancer/earnings/FreelancerEarningsPage';

import AdminRootLayout from './routes/AdminRootLayout';
import CategoryManagerPage from './modules/admin/categories/CategoryManagerPage';
import UserManagementPage from './modules/admin/users/UserManagementPage';
import DisputeCenterPage from './modules/admin/disputes/DisputeCenterPage';

function App() {
  return (
    <Routes>
      {/* Public marketplace shell: sticky header + mega menu, no sidebar */}
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/tool/:id" element={<ToolDetail />} />
        <Route path="/vendor/:id" element={<VendorDetail />} />
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
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/guest/dashboard" element={<GuestDashboard />} />

        {/* Gig marketplace (Phase 1 — read-only browsing) */}
        <Route
          path="/categories"
          element={
            <Suspense fallback={<LazyPageFallback />}>
              <CategoriesIndexPage />
            </Suspense>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <Suspense fallback={<LazyPageFallback />}>
              <CategoryBrowsePage />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<LazyPageFallback />}>
              <SearchResultsPage />
            </Suspense>
          }
        />
        <Route
          path="/gig/:id"
          element={
            <Suspense fallback={<LazyPageFallback />}>
              <GigDetailsPage />
            </Suspense>
          }
        />
      </Route>

      {/* Auth pages: no shell */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Status pages: no shell, same pattern as NotFound */}
      <Route
        path="/401"
        element={
          <Suspense fallback={<LazyPageFallback />}>
            <Unauthorized />
          </Suspense>
        }
      />
      <Route
        path="/403"
        element={
          <Suspense fallback={<LazyPageFallback />}>
            <Forbidden />
          </Suspense>
        }
      />

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

            {/* Company (vendor/business) workspace — Developer accounts are redirected out */}
            <Route element={<ProtectedRoute allow={['Company', 'Admin']} />}>
              <Route path="/crm" element={<CrmRootLayout />}>
                <Route index element={<CrmIndexRedirect />} />
                <Route element={<CrmRoute permission="dashboard" />}>
                  <Route path="dashboard" element={<CrmDashboard />} />
                </Route>
                <Route element={<CrmRoute permission="projects" />}>
                  <Route path="projects" element={<PostProjectPage />} />
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

            {/* Developer (freelancer) workspace — Company accounts are redirected out */}
            <Route element={<ProtectedRoute allow={['Developer', 'Admin']} />}>
              <Route path="/freelancer" element={<FreelancerRootLayout />}>
                <Route index element={<Navigate to="/freelancer/dashboard" replace />} />
                <Route path="dashboard" element={<FreelancerDashboard />} />
                <Route path="profile" element={<FreelancerProfilePage />} />
                <Route path="gigs" element={<FreelancerGigsPage />} />
                <Route path="proposals" element={<FreelancerProposalsPage />} />
                <Route path="earnings" element={<FreelancerEarningsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Admin-only workspace route */}
      <Route element={<ProtectedRoute allow={['Admin']} />}>
        <Route element={<CrmProviders />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminRootLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<CategoryManagerPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="disputes" element={<DisputeCenterPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

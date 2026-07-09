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
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Admin-only workspace route */}
      <Route element={<ProtectedRoute requireRole="Admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

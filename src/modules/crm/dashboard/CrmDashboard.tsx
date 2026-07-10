import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Package, CheckCircle2, FileEdit, FileStack, Users, Plus, Palette, ListTree, AlertTriangle, Info, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RoleSwitcher from '../components/RoleSwitcher';
import { CRM_ACTIVITIES, CRM_CATEGORY_STATS, CRM_TOTAL_USERS, CRM_USER_ACTIVITY } from '../data/activities.mock';
import { usePageConfiguration } from '../../../hooks/usePageConfiguration';
import { useCrmTheme } from '../../../hooks/useCrmTheme';
import { useCrmProducts } from '../../../hooks/useCrmProducts';

const DONUT_COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#0EA5E9', '#7C3AED', '#EC4899'];

function CrmDashboard() {
  const navigate = useNavigate();
  const { pageConfigs } = usePageConfiguration();
  const { theme } = useCrmTheme();
  const { products } = useCrmProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'Active').length;
    const draft = products.filter((p) => p.status === 'Draft').length;
    return {
      totalProducts: products.length,
      activeProducts: active,
      draftProducts: draft,
      totalPages: pageConfigs.length,
      totalUsers: CRM_TOTAL_USERS,
    };
  }, [products, pageConfigs.length]);

  const recentProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 4),
    [products]
  );

  const notifications = [
    { icon: AlertTriangle, tone: theme.warningColor, text: `${stats.draftProducts} products are still in Draft and not visible to buyers.` },
    { icon: Info, tone: theme.primaryColor, text: 'Theme Settings were last updated 2 days ago.' },
    { icon: Clock, tone: theme.successColor, text: 'Weekly usage report is ready to export.' },
  ];

  return (
    <div>
      <PageHeader pageKey="crm-dashboard" actions={<RoleSwitcher />} />

      {loading ? (
        <LoadingSkeleton count={4} height={84} />
      ) : (
        <div className="crm-grid crm-grid--stats" style={{ marginBottom: 20 }}>
          <DashboardCard icon={Package} label="Total Products" value={stats.totalProducts} accent={theme.primaryColor} trend={{ value: 8, direction: 'up' }} />
          <DashboardCard icon={CheckCircle2} label="Active Products" value={stats.activeProducts} accent={theme.successColor} trend={{ value: 4, direction: 'up' }} />
          <DashboardCard icon={FileEdit} label="Draft Products" value={stats.draftProducts} accent={theme.warningColor} />
          <DashboardCard icon={FileStack} label="Total Pages" value={stats.totalPages} accent={theme.secondaryColor} />
          <DashboardCard icon={Users} label="Total Users" value={stats.totalUsers} accent={theme.primaryColor} trend={{ value: 12, direction: 'up' }} />
        </div>
      )}

      <div className="crm-grid crm-grid--charts" style={{ marginBottom: 20 }}>
        <div className="crm-section">
          <h3 className="crm-section__title">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CRM_CATEGORY_STATS} dataKey="count" nameKey="category" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {CRM_CATEGORY_STATS.map((entry, i) => (
                  <Cell key={entry.category} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="crm-section">
          <h3 className="crm-section__title">User Activity (7 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CRM_USER_ACTIVITY}>
              <defs>
                <linearGradient id="crmUserActivityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.primaryColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={theme.primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke={theme.textColor} />
              <YAxis tick={{ fontSize: 11 }} stroke={theme.textColor} />
              <Tooltip />
              <Area type="monotone" dataKey="sessions" stroke={theme.primaryColor} fill="url(#crmUserActivityFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="crm-section">
          <h3 className="crm-section__title">Category Statistics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CRM_CATEGORY_STATS} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke={theme.textColor} allowDecimals={false} />
              <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 10 }} stroke={theme.textColor} />
              <Tooltip />
              <Bar dataKey="count" fill={theme.primaryColor} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="crm-grid crm-grid--widgets">
        <div className="crm-section">
          <h3 className="crm-section__title">Recent Products</h3>
          <div className="crm-widget-list">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="crm-section">
          <h3 className="crm-section__title">Recent Activities</h3>
          <div>
            {CRM_ACTIVITIES.slice(0, 5).map((activity) => (
              <div key={activity.id} className="crm-activity-row">
                <span className="crm-activity-row__dot" />
                <div>
                  <span className="crm-activity-row__actor">{activity.actor}</span> {activity.action}{' '}
                  <strong>{activity.target}</strong>
                  <span className="crm-activity-row__time">{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-section">
          <h3 className="crm-section__title">Quick Actions</h3>
          <div className="crm-quick-actions">
            <button type="button" className="crm-quick-action" onClick={() => navigate('/crm/products')}>
              <Plus size={15} /> Add a new product
            </button>
            <button type="button" className="crm-quick-action" onClick={() => navigate('/crm/pages')}>
              <ListTree size={15} /> Configure a page
            </button>
            <button type="button" className="crm-quick-action" onClick={() => navigate('/crm/settings')}>
              <Palette size={15} /> Edit theme colors
            </button>
          </div>
        </div>

        <div className="crm-section">
          <h3 className="crm-section__title">Notifications</h3>
          <div>
            {notifications.map((note, i) => {
              const Icon = note.icon;
              return (
                <div key={i} className="crm-notification-row">
                  <span className="crm-notification-row__icon" style={{ background: `${note.tone}26`, color: note.tone }}>
                    <Icon size={14} />
                  </span>
                  {note.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrmDashboard;

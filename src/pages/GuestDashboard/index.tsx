import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Package,
  Activity,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  Building2,
  Code2,
  LogIn,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import type { AccountRole } from '../../modules/auth/roles';
import { aiTools, categoryStats, trendingToolIds } from '../../data/mockData';
import './GuestDashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316'];

const PLATFORM_STATS = [
  { label: 'AI Tools in Catalog', value: '2,847', icon: Package },
  { label: 'API Calls / Day', value: '1.2M', icon: Activity },
  { label: 'Enterprise Teams', value: '48.2K', icon: Users },
  { label: 'Platform Uptime', value: '99.99%', icon: ShieldCheck },
];

const GET_STARTED_OPTIONS: { role: AccountRole; title: string; description: string; cta: string; icon: typeof Building2 }[] = [
  {
    role: 'Company',
    title: "I'm hiring",
    description: 'Create a Company workspace to list AI products and manage your team in the CRM.',
    cta: 'Create Company workspace',
    icon: Building2,
  },
  {
    role: 'Developer',
    title: "I'm offering services",
    description: 'Create a Developer workspace to manage gigs, proposals, and freelance work.',
    cta: 'Create Developer workspace',
    icon: Code2,
  },
];

function GuestDashboard() {
  const navigate = useNavigate();

  const totalCategories = useMemo(() => categoryStats.reduce((sum, c) => sum + c.count, 0), []);

  const trendingTools = useMemo(
    () =>
      trendingToolIds
        .slice(0, 5)
        .map((id) => aiTools.find((t) => t.id === id))
        .filter((t): t is (typeof aiTools)[number] => Boolean(t)),
    []
  );

  return (
    <motion.div className="guest-dashboard" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="guest-dashboard__header" variants={itemVariants}>
        <span className="guest-dashboard__eyebrow">Guest preview</span>
        <h1>See what's inside YAKKAY AI Line</h1>
        <p>A look at the marketplace before you create a workspace — no account needed.</p>
      </motion.div>

      <motion.div className="guest-dashboard__stat-grid" variants={containerVariants}>
        {PLATFORM_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} className="guest-dashboard__stat" variants={itemVariants}>
              <div className="guest-dashboard__stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="guest-dashboard__stat-value">{stat.value}</div>
                <div className="guest-dashboard__stat-label">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div className="guest-dashboard__charts-row" variants={itemVariants}>
        <div className="guest-dashboard__chart-card">
          <h3 className="guest-dashboard__section-title">Category Distribution</h3>
          <div className="guest-dashboard__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categoryStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1f36',
                    border: '1px solid rgba(148,163,184,0.1)',
                    borderRadius: 8,
                    color: '#f1f5f9',
                    fontSize: 13,
                  }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <text x="50%" y="47%" textAnchor="middle" dominantBaseline="central" className="guest-dashboard__pie-total-value">
                  {totalCategories}
                </text>
                <text x="50%" y="57%" textAnchor="middle" dominantBaseline="central" className="guest-dashboard__pie-total-label">
                  Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="guest-dashboard__pie-legend">
            {categoryStats.map((cat, index) => (
              <div key={cat.category} className="guest-dashboard__pie-legend-item">
                <span className="guest-dashboard__pie-legend-dot" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                {cat.category}
              </div>
            ))}
          </div>
        </div>

        <GlassCard padding="24px" className="guest-dashboard__trending-card">
          <h3 className="guest-dashboard__section-title">Trending Tools</h3>
          <div className="guest-dashboard__trending-list">
            {trendingTools.map((tool, index) => (
              <div key={tool.id} className="guest-dashboard__trending-item" onClick={() => navigate(`/tool/${tool.id}`)}>
                <span className="guest-dashboard__trending-rank">{index + 1}</span>
                <div className="guest-dashboard__trending-info">
                  <div className="guest-dashboard__trending-name">{tool.name}</div>
                  <div className="guest-dashboard__trending-meta">
                    <span className="guest-dashboard__trending-category">{tool.category}</span>
                    <span className="guest-dashboard__trending-rating">
                      <Star size={12} fill="#f59e0b" />
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="guest-dashboard__trending-arrow" />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="guest-dashboard__section-title">Get started</h3>
        <div className="guest-dashboard__get-started-grid">
          {GET_STARTED_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <GlassCard key={option.role} padding="24px" hover className="guest-dashboard__get-started-card">
                <div className="guest-dashboard__get-started-icon">
                  <Icon size={22} />
                </div>
                <h4>{option.title}</h4>
                <p>{option.description}</p>
                <button
                  type="button"
                  className="guest-dashboard__get-started-btn"
                  onClick={() => navigate('/register', { state: { role: option.role } })}
                >
                  {option.cta}
                  <ArrowRight size={15} />
                </button>
              </GlassCard>
            );
          })}
        </div>
        <button type="button" className="guest-dashboard__signin-link" onClick={() => navigate('/login')}>
          <LogIn size={14} />
          Already have a workspace? Sign in
        </button>
      </motion.div>
    </motion.div>
  );
}

export default GuestDashboard;

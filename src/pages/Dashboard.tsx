import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  Activity,
  Users,
  DollarSign,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Compass,
  Rocket,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import { currentUser, activityFeed, chartData, categoryStats, trendingToolIds, aiTools } from '../data/mockData';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316'];

const statusIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  warning: <AlertCircle size={16} />,
  error: <AlertCircle size={16} />,
  info: <Info size={16} />,
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomAreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="dashboard__tooltip">
      <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: '#94a3b8', fontSize: 13, margin: '2px 0' }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalCategories = useMemo(
    () => categoryStats.reduce((sum, c) => sum + c.count, 0),
    []
  );

  const trendingTools = useMemo(
    () =>
      trendingToolIds
        .slice(0, 5)
        .map((id) => aiTools.find((t) => t.id === id))
        .filter(Boolean),
    []
  );

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div className="dashboard__welcome" variants={itemVariants}>
        <h1>Welcome back, {currentUser.name}</h1>
        <p>{today}</p>
      </motion.div>

      {/* KPI Row */}
      <motion.div className="dashboard__kpi-grid" variants={containerVariants}>
        <StatCard
          title="Total AI Tools"
          value="2,847"
          change={12.5}
          icon={Package}
          color="#8b5cf6"
          delay={0}
        />
        <StatCard
          title="API Calls Today"
          value="1.2M"
          change={8.3}
          icon={Activity}
          color="#06b6d4"
          delay={0.1}
        />
        <StatCard
          title="Active Users"
          value="48.2K"
          change={15.7}
          icon={Users}
          color="#10b981"
          delay={0.2}
        />
        <StatCard
          title="Revenue"
          value="$284K"
          change={22.4}
          icon={DollarSign}
          color="#f59e0b"
          delay={0.3}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div className="dashboard__charts-row" variants={itemVariants}>
        {/* Area Chart */}
        <div className="dashboard__chart-card">
          <h3 className="dashboard__chart-title">API Usage Over Time</h3>
          <div className="dashboard__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="apiCalls"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  name="API Calls"
                  dot={false}
                  activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#0a0e1a' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart */}
        <div className="dashboard__chart-card">
          <h3 className="dashboard__chart-title">Category Distribution</h3>
          <div className="dashboard__chart-wrapper" style={{ height: 220 }}>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
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
                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="dashboard__pie-total-value"
                >
                  {totalCategories}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="dashboard__pie-total-label"
                >
                  Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard__pie-legend">
            {categoryStats.map((cat, index) => (
              <div key={cat.category} className="dashboard__pie-legend-item">
                <span
                  className="dashboard__pie-legend-dot"
                  style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                {cat.category}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div className="dashboard__bottom-row" variants={itemVariants}>
        {/* Activity Feed */}
        <GlassCard padding="24px">
          <h3 className="dashboard__section-title">Recent Activity</h3>
          <motion.ul
            className="dashboard__activity-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {activityFeed.map((item) => (
              <motion.li
                key={item.id}
                className="dashboard__activity-item"
                variants={listItemVariants}
              >
                <span
                  className={`dashboard__activity-dot dashboard__activity-dot--${item.status}`}
                />
                <span className="dashboard__activity-icon">
                  {statusIcons[item.status] || <Zap size={16} />}
                </span>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-message">{item.message}</div>
                  <div className="dashboard__activity-time">{item.timestamp}</div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </GlassCard>

        {/* Trending Tools */}
        <GlassCard padding="24px">
          <h3 className="dashboard__section-title">Trending Tools</h3>
          <motion.div
            className="dashboard__trending-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {trendingTools.map((tool, index) =>
              tool ? (
                <motion.div
                  key={tool.id}
                  className="dashboard__trending-item"
                  variants={listItemVariants}
                  onClick={() => navigate(`/tool/${tool.id}`)}
                >
                  <span className="dashboard__trending-rank">{index + 1}</span>
                  <div className="dashboard__trending-info">
                    <div className="dashboard__trending-name">{tool.name}</div>
                    <div className="dashboard__trending-meta">
                      <span className="dashboard__trending-category">{tool.category}</span>
                      <span className="dashboard__trending-rating">
                        <Star size={12} fill="#f59e0b" />
                        {tool.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="dashboard__trending-arrow" />
                </motion.div>
              ) : null,
            )}
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <GlassCard padding="24px">
          <h3 className="dashboard__section-title">Quick Actions</h3>
          <div className="dashboard__quick-actions">
            <button type="button" className="dashboard__quick-action" onClick={() => navigate('/browse')}>
              <Compass size={18} />
              Browse Marketplace
            </button>
            <button type="button" className="dashboard__quick-action" onClick={() => navigate('/governance')}>
              <ShieldCheck size={18} />
              Open Governance Center
            </button>
            <button type="button" className="dashboard__quick-action" onClick={() => navigate('/documentation')}>
              <BookOpen size={18} />
              Read Documentation
            </button>
            <button type="button" className="dashboard__quick-action dashboard__quick-action--primary" onClick={() => navigate('/request-demo')}>
              <Rocket size={18} />
              Request a Demo
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;

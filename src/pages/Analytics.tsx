import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Calendar,
  Clock,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Brain,
  Image,
  Code,
  BarChart3,
  Mic,
  Video,
  FileText,
  Search,
  Bot,
  Sparkles,
  Shield,
  Database,
  Globe,
  MessageSquare,
  Palette,
  Layers,
  Music,
  PieChart,
  type LucideIcon,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { chartData, aiTools } from '../data/mockData';
import './Analytics.css';

const iconMap: Record<string, LucideIcon> = {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Bot,
  Sparkles, Shield, Database, Globe, MessageSquare, Palette, Layers,
  Zap, Music, PieChart,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Language Models': '#8b5cf6',
  'Image Generation': '#ec4899',
  'Code Assistant': '#06b6d4',
  'Data Analytics': '#f59e0b',
  'Voice & Audio': '#10b981',
  'Video Generation': '#f43f5e',
  'Document AI': '#6366f1',
  'Search & Research': '#0ea5e9',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const rowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="analytics__tooltip">
      <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: '#94a3b8', fontSize: 13, margin: '3px 0' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: entry.color, marginRight: 6 }} />
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function Analytics() {
  const topTools = useMemo(() => {
    return [...aiTools]
      .sort((a, b) => b.apiCallsMonthly - a.apiCallsMonthly)
      .slice(0, 8)
      .map((tool, index) => ({
        ...tool,
        rank: index + 1,
        revenue: Math.round(tool.apiCallsMonthly * 0.003),
        growth: [18.2, 12.5, -3.4, 25.8, 8.1, -1.2, 15.4, 6.9][index],
      }));
  }, []);

  return (
    <motion.div
      className="analytics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="analytics__header" variants={itemVariants}>
        <h1>Analytics Overview</h1>
        <div className="analytics__date-range">
          <Calendar size={14} className="analytics__date-range-icon" />
          Jan 2024 — Dec 2024
        </div>
      </motion.div>

      {/* Revenue + API Calls Chart */}
      <motion.div className="analytics__chart-container" variants={itemVariants}>
        <div className="analytics__chart-header">
          <h3 className="analytics__chart-title">API Calls & Revenue Trends</h3>
          <div className="analytics__chart-legend">
            <span className="analytics__chart-legend-item">
              <span className="analytics__chart-legend-dot" style={{ background: '#8b5cf6' }} />
              API Calls
            </span>
            <span className="analytics__chart-legend-item">
              <span className="analytics__chart-legend-dot" style={{ background: '#06b6d4' }} />
              Revenue
            </span>
          </div>
        </div>
        <div className="analytics__chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
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
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="apiCalls"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#apiGradient)"
                name="API Calls"
                dot={false}
                activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#0a0e1a' }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                name="Revenue"
                dot={false}
                activeDot={{ r: 5, stroke: '#06b6d4', strokeWidth: 2, fill: '#0a0e1a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Usage Stats Row */}
      <motion.div className="analytics__stats-row" variants={itemVariants}>
        <GlassCard className="analytics__stat-card" padding="24px">
          <span className="analytics__stat-label">Peak Hours</span>
          <span className="analytics__stat-value">2–4 PM</span>
          <span className="analytics__stat-detail">
            <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            UTC, Mon–Fri
          </span>
        </GlassCard>
        <GlassCard className="analytics__stat-card" padding="24px">
          <span className="analytics__stat-label">Avg Response Time</span>
          <span className="analytics__stat-value">142ms</span>
          <span className="analytics__stat-detail">
            <Zap size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            <span className="analytics__stat-highlight">↓ 12% from last month</span>
          </span>
        </GlassCard>
        <GlassCard className="analytics__stat-card" padding="24px">
          <span className="analytics__stat-label">Error Rate</span>
          <span className="analytics__stat-value">0.12%</span>
          <span className="analytics__stat-detail">
            <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            <span className="analytics__stat-highlight">Well below 1% threshold</span>
          </span>
        </GlassCard>
      </motion.div>

      {/* Top Tools Table */}
      <motion.div className="analytics__table-container" variants={itemVariants}>
        <div className="analytics__table-header">
          <div>
            <h3 className="analytics__table-title">Top Tools by Usage</h3>
            <p className="analytics__table-subtitle">Ranked by monthly API calls</p>
          </div>
        </div>
        <div className="analytics__table-scroll">
          <table className="analytics__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tool</th>
                <th>Category</th>
                <th>API Calls</th>
                <th>Revenue</th>
                <th>Growth</th>
              </tr>
            </thead>
            <motion.tbody variants={rowVariants} initial="hidden" animate="visible">
              {topTools.map((tool) => {
                const ToolIcon = iconMap[tool.icon] || Brain;
                const iconColor = CATEGORY_COLORS[tool.category] || '#8b5cf6';
                const isPositive = tool.growth >= 0;
                return (
                  <motion.tr key={tool.id} variants={tableRowVariants}>
                    <td className="analytics__table-rank">{tool.rank}</td>
                    <td>
                      <div className="analytics__table-tool">
                        <div
                          className="analytics__table-tool-icon"
                          style={{ background: `${iconColor}18`, color: iconColor }}
                        >
                          <ToolIcon size={16} />
                        </div>
                        <div className="analytics__table-tool-info">
                          <span className="analytics__table-tool-name">{tool.name}</span>
                          <span className="analytics__table-tool-company">{tool.company}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="analytics__table-category">{tool.category}</span>
                    </td>
                    <td className="analytics__table-calls">
                      {formatNumber(tool.apiCallsMonthly)}
                    </td>
                    <td className="analytics__table-revenue">
                      ${formatNumber(tool.revenue)}
                    </td>
                    <td>
                      <span
                        className={`analytics__table-growth ${
                          isPositive ? 'analytics__table-growth--positive' : 'analytics__table-growth--negative'
                        }`}
                      >
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isPositive ? '+' : ''}{tool.growth.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Analytics;

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Package,
  Send,
  Wallet,
  Star,
  Plus,
  Search,
  UserCircle,
  Banknote,
} from 'lucide-react';
import { useAppSelector } from '../../../store';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';
import './FreelancerDashboardChart.css';

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function EarningsTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="fl-chart-tooltip">
      <p className="fl-chart-tooltip__label">{label}</p>
      <p className="fl-chart-tooltip__value">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function FreelancerDashboard() {
  const navigate = useNavigate();
  const { profile, gigs, proposals, earningsHistory, walletBalance, pendingClearance } = useAppSelector((s) => s.freelancer);

  const activeGigCount = useMemo(() => gigs.filter((g) => g.status === 'active').length, [gigs]);
  const pendingProposalCount = useMemo(() => proposals.filter((p) => p.status === 'pending').length, [proposals]);
  const thisMonthEarnings = earningsHistory[earningsHistory.length - 1]?.earnings ?? 0;
  const recentGigs = useMemo(() => [...gigs].slice(0, 3), [gigs]);
  const recentProposals = useMemo(() => [...proposals].slice(0, 3), [proposals]);

  return (
    <div>
      <div className="fl-header">
        <div>
          <h1 className="fl-header__title">Welcome back, {profile.displayName.split(' ')[0]}</h1>
          <p className="fl-header__subtitle">Here's how your freelance business is doing today.</p>
        </div>
        <div className="fl-header__actions">
          <button type="button" className="fl-btn" onClick={() => navigate('/freelancer/profile')}>
            <UserCircle size={14} /> Edit Profile
          </button>
          <button type="button" className="fl-btn fl-btn--primary" onClick={() => navigate('/freelancer/gigs')}>
            <Plus size={14} /> New Gig
          </button>
        </div>
      </div>

      <div className="fl-stats-row">
        <StatCard icon={Package} value={String(activeGigCount)} label="Active Gigs" />
        <StatCard icon={Send} value={String(pendingProposalCount)} label="Pending Proposals" />
        <StatCard icon={Wallet} value={formatCurrency(thisMonthEarnings)} label="This Month's Earnings" />
        <StatCard icon={Star} value={formatCurrency(walletBalance)} label="Wallet Balance" />
      </div>

      <div className="fl-widget-grid">
        <div className="fl-section">
          <div className="fl-section__header">
            <h3 className="fl-section__title">Earnings — Last 6 Months</h3>
          </div>
          <div className="fl-chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={earningsHistory}>
                <defs>
                  <linearGradient id="flEarningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<EarningsTooltip />} />
                <Area type="monotone" dataKey="earnings" stroke="var(--brand-blue)" strokeWidth={2} fill="url(#flEarningsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fl-section">
          <div className="fl-section__header">
            <h3 className="fl-section__title">Quick Actions</h3>
          </div>
          <div className="fl-list">
            <button type="button" className="fl-list-item" style={{ cursor: 'pointer', width: '100%', background: 'none', border: 'none', textAlign: 'left' }} onClick={() => navigate('/freelancer/gigs')}>
              <Plus size={16} />
              <div>
                <p className="fl-list-item__title">Create a new gig</p>
                <p className="fl-list-item__meta">Publish a new service listing</p>
              </div>
            </button>
            <button type="button" className="fl-list-item" style={{ cursor: 'pointer', width: '100%', background: 'none', border: 'none', textAlign: 'left' }} onClick={() => navigate('/browse')}>
              <Search size={16} />
              <div>
                <p className="fl-list-item__title">Browse open jobs</p>
                <p className="fl-list-item__meta">Find projects to submit proposals to</p>
              </div>
            </button>
            <button type="button" className="fl-list-item" style={{ cursor: 'pointer', width: '100%', background: 'none', border: 'none', textAlign: 'left' }} onClick={() => navigate('/freelancer/earnings')}>
              <Banknote size={16} />
              <div>
                <p className="fl-list-item__title">Withdraw earnings</p>
                <p className="fl-list-item__meta">{formatCurrency(pendingClearance)} pending clearance</p>
              </div>
            </button>
          </div>
        </div>

        <div className="fl-section">
          <div className="fl-section__header">
            <h3 className="fl-section__title">Recent Gigs</h3>
            <button type="button" className="fl-btn" onClick={() => navigate('/freelancer/gigs')}>Manage</button>
          </div>
          <div className="fl-list">
            {recentGigs.map((gig) => (
              <div className="fl-list-item" key={gig.id}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="fl-list-item__title">{gig.title}</p>
                  <p className="fl-list-item__meta">{gig.orders} orders · {gig.category}</p>
                </div>
                <StatusPill status={gig.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="fl-section">
          <div className="fl-section__header">
            <h3 className="fl-section__title">Recent Proposals</h3>
            <button type="button" className="fl-btn" onClick={() => navigate('/freelancer/proposals')}>View all</button>
          </div>
          <div className="fl-list">
            {recentProposals.map((proposal) => (
              <div className="fl-list-item" key={proposal.id}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="fl-list-item__title">{proposal.jobTitle}</p>
                  <p className="fl-list-item__meta">{proposal.clientName} · {formatCurrency(proposal.bidAmount)}</p>
                </div>
                <StatusPill status={proposal.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;

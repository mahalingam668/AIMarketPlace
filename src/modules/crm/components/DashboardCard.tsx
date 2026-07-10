import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface DashboardCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
  accent?: string;
}

function DashboardCard({ icon: Icon, label, value, trend, accent }: DashboardCardProps) {
  return (
    <div className="crm-dashboard-card">
      <div className="crm-dashboard-card__icon" style={accent ? { background: `${accent}1a`, color: accent } : undefined}>
        <Icon size={20} />
      </div>
      <div className="crm-dashboard-card__body">
        <span className="crm-dashboard-card__value">{value}</span>
        <span className="crm-dashboard-card__label">{label}</span>
      </div>
      {trend && (
        <span className={`crm-dashboard-card__trend crm-dashboard-card__trend--${trend.direction}`}>
          {trend.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trend.value}%
        </span>
      )}
    </div>
  );
}

export default DashboardCard;

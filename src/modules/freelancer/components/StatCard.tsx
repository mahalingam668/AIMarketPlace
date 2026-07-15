import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="fl-stat-card">
      <div className="fl-stat-card__icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="fl-stat-card__value">{value}</div>
        <div className="fl-stat-card__label">{label}</div>
      </div>
    </div>
  );
}

export default StatCard;

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0,
}) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        className="stat-card__header"
      >
        <div>
          <p className="stat-card__title">{title}</p>
        </div>
        <div
          className="stat-card__icon-wrapper"
          style={{ backgroundColor: `${color}26` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
      </div>

      <div className="stat-card__body">
        <h3 className="stat-card__value">{value}</h3>
        <span
          className={`stat-card__change ${
            isPositive ? 'stat-card__change--up' : 'stat-card__change--down'
          }`}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(change)}%
        </span>
      </div>

      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: color,
          filter: 'blur(60px)',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

export default StatCard;

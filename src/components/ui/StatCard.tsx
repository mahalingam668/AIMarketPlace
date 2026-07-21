import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
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
  /** Recent values (e.g. last 6 months) rendered as a compact trend line —
   * omit to show the card without one. */
  sparkline?: number[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0,
  sparkline,
}) => {
  const isPositive = change >= 0;
  const sparkGradientId = `stat-spark-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const sparkData = sparkline?.map((v, i) => ({ i, v }));

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
        <div className="stat-card__body-main">
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

        {sparkData && sparkData.length > 1 && (
          <div className="stat-card__sparkline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={sparkGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={color}
                  strokeWidth={1.75}
                  fill={`url(#${sparkGradientId})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
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

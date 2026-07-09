import { motion } from 'framer-motion';
import './GlassCard.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  padding?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  padding,
}) => {
  const classes = [
    'glass-card',
    glow ? 'glass-card--glow' : '',
    onClick ? 'glass-card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={classes}
      style={padding ? { padding } : undefined}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

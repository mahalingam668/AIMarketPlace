interface BadgeProps {
  variant: 'new' | 'featured' | 'popular' | 'beta' | 'enterprise' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantColorMap: Record<BadgeProps['variant'], string> = {
  new: '#8b5cf6',
  featured: '#f59e0b',
  popular: '#06b6d4',
  beta: '#10b981',
  enterprise: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'md' }) => {
  const color = variantColorMap[variant];
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: isSm ? '11px' : '12px',
        fontWeight: 600,
        lineHeight: 1,
        padding: isSm ? '2px 8px' : '4px 12px',
        borderRadius: '9999px',
        backgroundColor: `${color}26`,
        color: color,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        fontFamily: "'Inter', system-ui, sans-serif",
        textTransform: 'capitalize',
      }}
    >
      {children}
    </span>
  );
};

export default Badge;

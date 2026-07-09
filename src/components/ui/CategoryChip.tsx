interface CategoryChipProps {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  color?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  active = false,
  count,
  onClick,
  color = 'var(--brand-blue)',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        borderRadius: '9999px',
        border: active ? '1px solid transparent' : '1px solid var(--border-subtle)',
        background: active ? `color-mix(in srgb, ${color} 14%, transparent)` : 'transparent',
        color: active ? color : 'var(--text-muted)',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: 'pointer',
        transition: 'all 200ms ease',
        whiteSpace: 'nowrap',
        outline: 'none',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--brand-blue)';
          e.currentTarget.style.color = 'var(--brand-blue)';
          e.currentTarget.style.background = 'var(--brand-blue-lt)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {label}
      {count !== undefined && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '20px',
            padding: '0 6px',
            borderRadius: '9999px',
            background: active ? `color-mix(in srgb, ${color} 20%, transparent)` : 'var(--neutral-100)',
            color: active ? color : 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryChip;

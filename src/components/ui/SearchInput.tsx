import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search AI tools...',
  shortcut = '⌘K',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--surface-white)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '0 16px',
        height: '42px',
        minWidth: '280px',
        maxWidth: '420px',
        width: '100%',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
      }}
      onFocus={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'var(--brand-blue)';
        el.style.boxShadow = '0 0 0 3px var(--brand-blue-lt)';
      }}
      onBlur={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'var(--border-subtle)';
        el.style.boxShadow = 'none';
      }}
    >
      <Search
        size={16}
        style={{ color: 'var(--text-muted)', flexShrink: 0 }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: '0.01em',
        }}
      />
      {shortcut && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'var(--neutral-100)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            letterSpacing: '0.04em',
          }}
        >
          {shortcut}
        </span>
      )}
    </div>
  );
};

export default SearchInput;

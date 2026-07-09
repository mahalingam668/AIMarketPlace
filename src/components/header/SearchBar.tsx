import { useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'header' | 'hero';
}

function SearchBar({ value, onChange, onSubmit, placeholder = 'Search AI Solutions, Agents and Integrations', size = 'header' }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <form
      className={`search-bar search-bar--${size} ${focused ? 'search-bar--focused' : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      role="search"
    >
      <Search size={size === 'hero' ? 20 : 16} className="search-bar__icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="search-bar__input"
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange('')} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
      {size === 'hero' && (
        <button type="submit" className="search-bar__submit">
          Search
        </button>
      )}
    </form>
  );
}

export default SearchBar;

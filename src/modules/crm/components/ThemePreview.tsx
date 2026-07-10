import { Bell, Home, Package, Settings } from 'lucide-react';
import type { CrmThemeTokens } from '../../../constants/crmTheme';

/** Miniature mock-up that reflects theme tokens live, without touching any real CRM page. */
function ThemePreview({ theme }: { theme: CrmThemeTokens }) {
  return (
    <div className="crm-theme-preview" style={{ background: theme.backgroundColor, borderColor: theme.borderColor }}>
      <div className="crm-theme-preview__sidebar" style={{ background: theme.secondaryColor }}>
        {[Home, Package, Bell, Settings].map((Icon, i) => (
          <span
            key={i}
            className="crm-theme-preview__nav-icon"
            style={i === 0 ? { background: theme.primaryColor, color: '#fff' } : { color: 'rgba(255,255,255,0.6)' }}
          >
            <Icon size={14} />
          </span>
        ))}
      </div>
      <div className="crm-theme-preview__main">
        <div className="crm-theme-preview__topbar" style={{ background: theme.cardBackground, borderColor: theme.borderColor }}>
          <span style={{ color: theme.titleColor, fontWeight: 700, fontSize: 12 }}>Dashboard</span>
          <Bell size={13} style={{ color: theme.iconColor }} />
        </div>
        <div className="crm-theme-preview__card" style={{ background: theme.cardBackground, borderColor: theme.borderColor }}>
          <span className="crm-theme-preview__card-icon" style={{ background: `${theme.primaryColor}1a`, color: theme.iconColor }}>
            <Package size={14} />
          </span>
          <div>
            <div style={{ color: theme.titleColor, fontWeight: 700, fontSize: 13 }}>128</div>
            <div style={{ color: theme.textColor, fontSize: 10 }}>Total Products</div>
          </div>
        </div>
        <button
          type="button"
          className="crm-theme-preview__button"
          style={{ background: theme.primaryColor }}
          disabled
        >
          Primary Action
        </button>
      </div>
    </div>
  );
}

export default ThemePreview;

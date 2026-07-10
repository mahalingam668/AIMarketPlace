import { RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ThemePreview from '../components/ThemePreview';
import RoleSwitcher from '../components/RoleSwitcher';
import { useCrmTheme } from '../../../hooks/useCrmTheme';
import { useCrmRole } from '../../../hooks/useCrmRole';
import type { CrmThemeTokens } from '../../../constants/crmTheme';

const COLOR_FIELDS: { key: keyof CrmThemeTokens; label: string; hint: string }[] = [
  { key: 'primaryColor', label: 'Primary Color', hint: 'Buttons, active nav, chart accents' },
  { key: 'secondaryColor', label: 'Secondary Color', hint: 'Preview sidebar / dark surfaces' },
  { key: 'backgroundColor', label: 'Background Color', hint: 'Page background' },
  { key: 'surfaceColor', label: 'Surface Color', hint: 'Base surface tone' },
  { key: 'borderColor', label: 'Border Color', hint: 'Card & table borders' },
  { key: 'titleColor', label: 'Title Color', hint: 'Headings' },
  { key: 'textColor', label: 'Text Color', hint: 'Body copy' },
  { key: 'cardBackground', label: 'Card Background', hint: 'Cards, tables, drawers' },
  { key: 'iconColor', label: 'Icon Color', hint: 'Icon tiles' },
  { key: 'successColor', label: 'Success Color', hint: 'Active / published states' },
  { key: 'warningColor', label: 'Warning Color', hint: 'Draft states' },
  { key: 'errorColor', label: 'Error Color', hint: 'Deprecated / destructive actions' },
];

function ThemeSettingsPage() {
  const { theme, updateTheme, resetTheme } = useCrmTheme();
  const { permissions } = useCrmRole();

  return (
    <div>
      <PageHeader pageKey="crm-settings" actions={<RoleSwitcher />} />

      <div className="crm-grid crm-grid--widgets">
        <div className="crm-section" style={{ gridColumn: '1 / -1' }}>
          <h3 className="crm-section__title">Live Preview</h3>
          <ThemePreview theme={theme} />
        </div>

        <div className="crm-section" style={{ gridColumn: '1 / -1' }}>
          <h3 className="crm-section__title">Brand Colors</h3>
          <div className="crm-form-grid">
            {COLOR_FIELDS.map((field) => (
              <div className="crm-form-field" key={field.key}>
                <label htmlFor={`theme-${field.key}`}>{field.label}</label>
                <div className="crm-color-field">
                  <input
                    id={`theme-${field.key}`}
                    type="color"
                    value={theme[field.key]}
                    disabled={permissions.readOnly}
                    onChange={(e) => updateTheme({ [field.key]: e.target.value })}
                  />
                  <input
                    type="text"
                    value={theme[field.key]}
                    disabled={permissions.readOnly}
                    onChange={(e) => updateTheme({ [field.key]: e.target.value })}
                  />
                </div>
                <span className="crm-form-field__hint">{field.hint}</span>
              </div>
            ))}
          </div>

          <div className="crm-form-actions">
            <button type="button" className="crm-btn" onClick={resetTheme} disabled={permissions.readOnly}>
              <RotateCcw size={14} /> Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettingsPage;

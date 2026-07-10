import { useState } from 'react';
import { X } from 'lucide-react';
import type { CrmPageConfig } from '../data/pages.mock';

interface PageConfigDrawerProps {
  config: CrmPageConfig | null;
  onClose: () => void;
  onSave: (config: CrmPageConfig) => void;
}

const BANNER_PRESETS = [
  'linear-gradient(135deg, #2563EB, #0F172A)',
  'linear-gradient(135deg, #16A34A, #0F172A)',
  'linear-gradient(135deg, #F59E0B, #0F172A)',
  'linear-gradient(135deg, #DC2626, #0F172A)',
  'linear-gradient(135deg, #7C3AED, #2563EB)',
  'linear-gradient(135deg, #0EA5E9, #0F172A)',
];

function buildBlankConfig(): CrmPageConfig {
  return {
    key: `crm-custom-${Date.now()}`,
    title: '',
    subtitle: '',
    description: '',
    icon: 'FileText',
    banner: BANNER_PRESETS[0],
    backgroundColor: '#F8FAFC',
    titleColor: '#0F172A',
    textColor: '#64748B',
    cardBackground: '#FFFFFF',
    pageWidth: '100%',
    pageHeight: 'auto',
    displayOrder: 99,
    system: false,
  };
}

function PageConfigDrawer({ config, onClose, onSave }: PageConfigDrawerProps) {
  const [form, setForm] = useState<CrmPageConfig>(config ?? buildBlankConfig());
  const isEditing = Boolean(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="crm-drawer-overlay" onClick={onClose}>
      <div className="crm-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="crm-drawer__header">
          <h2>{isEditing ? `Edit ${config?.title || 'Page'}` : 'Add Page'}</h2>
          <button type="button" className="crm-drawer__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="crm-drawer__field-group">
          <div className="crm-form-field">
            <label htmlFor="page-title">Page Title</label>
            <input id="page-title" type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="crm-form-field">
            <label htmlFor="page-subtitle">Subtitle</label>
            <input id="page-subtitle" type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>

          <div className="crm-form-field">
            <label htmlFor="page-description">Description</label>
            <textarea id="page-description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="crm-form-field">
            <label>Banner</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BANNER_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setForm({ ...form, banner: preset })}
                  style={{
                    width: 40,
                    height: 28,
                    borderRadius: 6,
                    background: preset,
                    border: form.banner === preset ? '2px solid var(--crm-primary)' : '1px solid var(--crm-border)',
                    cursor: 'pointer',
                  }}
                  aria-label="Select banner gradient"
                />
              ))}
            </div>
          </div>

          <div className="crm-form-grid">
            <div className="crm-form-field">
              <label htmlFor="page-title-color">Title Color</label>
              <div className="crm-color-field">
                <input id="page-title-color" type="color" value={form.titleColor} onChange={(e) => setForm({ ...form, titleColor: e.target.value })} />
                <input type="text" value={form.titleColor} onChange={(e) => setForm({ ...form, titleColor: e.target.value })} />
              </div>
            </div>
            <div className="crm-form-field">
              <label htmlFor="page-text-color">Text Color</label>
              <div className="crm-color-field">
                <input id="page-text-color" type="color" value={form.textColor} onChange={(e) => setForm({ ...form, textColor: e.target.value })} />
                <input type="text" value={form.textColor} onChange={(e) => setForm({ ...form, textColor: e.target.value })} />
              </div>
            </div>
            <div className="crm-form-field">
              <label htmlFor="page-bg-color">Background Color</label>
              <div className="crm-color-field">
                <input id="page-bg-color" type="color" value={form.backgroundColor} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} />
                <input type="text" value={form.backgroundColor} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} />
              </div>
            </div>
            <div className="crm-form-field">
              <label htmlFor="page-card-bg">Card Background</label>
              <div className="crm-color-field">
                <input id="page-card-bg" type="color" value={form.cardBackground} onChange={(e) => setForm({ ...form, cardBackground: e.target.value })} />
                <input type="text" value={form.cardBackground} onChange={(e) => setForm({ ...form, cardBackground: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="crm-form-grid">
            <div className="crm-form-field">
              <label htmlFor="page-width">Page Width</label>
              <input id="page-width" type="text" value={form.pageWidth} onChange={(e) => setForm({ ...form, pageWidth: e.target.value })} />
              <span className="crm-form-field__hint">e.g. 100%, 1280px</span>
            </div>
            <div className="crm-form-field">
              <label htmlFor="page-height">Page Height</label>
              <input id="page-height" type="text" value={form.pageHeight} onChange={(e) => setForm({ ...form, pageHeight: e.target.value })} />
              <span className="crm-form-field__hint">e.g. auto, 100vh</span>
            </div>
            <div className="crm-form-field">
              <label htmlFor="page-order">Display Order</label>
              <input
                id="page-order"
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="crm-form-actions">
            <button type="submit" className="crm-btn crm-btn--primary">{isEditing ? 'Save Changes' : 'Create Page'}</button>
            <button type="button" className="crm-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PageConfigDrawer;

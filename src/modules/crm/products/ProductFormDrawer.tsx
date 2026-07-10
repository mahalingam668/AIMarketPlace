import { useState } from 'react';
import { X } from 'lucide-react';
import type { CrmProduct, CrmProductStatus } from '../data/products.mock';

interface ProductFormDrawerProps {
  product: CrmProduct | null;
  onClose: () => void;
  onSave: (product: CrmProduct) => void;
}

const STATUS_OPTIONS: CrmProductStatus[] = ['Active', 'Draft', 'Deprecated'];

function buildBlankProduct(): CrmProduct {
  const id = `crm-custom-${Date.now()}`;
  return {
    id,
    name: '',
    icon: 'Package',
    color: '#2563EB',
    gradient: 'linear-gradient(135deg, #2563EB, #0F172A)',
    category: 'Language Models',
    version: '1.0.0',
    status: 'Draft',
    createdDate: new Date().toISOString().slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    description: '',
    tags: [],
    features: [],
    screenshots: [],
    integrations: [],
    documentation: [],
  };
}

function ProductFormDrawer({ product, onClose, onSave }: ProductFormDrawerProps) {
  const [form, setForm] = useState<CrmProduct>(product ?? buildBlankProduct());
  const isEditing = Boolean(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, lastUpdated: new Date().toISOString().slice(0, 10) });
  };

  return (
    <div className="crm-drawer-overlay" onClick={onClose}>
      <div className="crm-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="crm-drawer__header">
          <h2>{isEditing ? `Edit ${product?.name}` : 'Add Product'}</h2>
          <button type="button" className="crm-drawer__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="crm-drawer__field-group">
          <div className="crm-form-field">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="crm-form-field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="crm-form-grid">
            <div className="crm-form-field">
              <label htmlFor="product-category">Category</label>
              <input
                id="product-category"
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="crm-form-field">
              <label htmlFor="product-version">Version</label>
              <input
                id="product-version"
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
              />
            </div>
          </div>

          <div className="crm-form-field">
            <label htmlFor="product-status">Status</label>
            <select
              id="product-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CrmProductStatus })}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="crm-form-field">
            <label htmlFor="product-tags">Tags (comma-separated)</label>
            <input
              id="product-tags"
              type="text"
              value={form.tags.join(', ')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            />
          </div>

          <div className="crm-form-actions">
            <button type="submit" className="crm-btn crm-btn--primary">{isEditing ? 'Save Changes' : 'Create Product'}</button>
            <button type="button" className="crm-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormDrawer;

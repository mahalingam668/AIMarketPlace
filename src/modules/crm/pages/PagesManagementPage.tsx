import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileStack, Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { resolveCrmIcon } from '../components/crmIcons';
import { usePageConfiguration } from '../../../hooks/usePageConfiguration';
import { useCrmRole } from '../../../hooks/useCrmRole';
import type { CrmPageConfig } from '../data/pages.mock';
import PageConfigDrawer from './PageConfigDrawer';

function PagesManagementPage() {
  const navigate = useNavigate();
  const { pageConfigs, updatePageConfig, addPageConfig, removePageConfig } = usePageConfiguration();
  const { permissions } = useCrmRole();

  const [editingConfig, setEditingConfig] = useState<CrmPageConfig | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CrmPageConfig | null>(null);

  const sorted = [...pageConfigs].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleSave = (config: CrmPageConfig) => {
    if (editingConfig) {
      updatePageConfig(config.key, config);
    } else {
      addPageConfig(config);
    }
    setEditingConfig(null);
    setShowAddDrawer(false);
  };

  const handleView = (config: CrmPageConfig) => {
    if (config.system) {
      const systemRoutes: Record<string, string> = {
        'crm-dashboard': '/crm/dashboard',
        'crm-products': '/crm/products',
        'crm-product-details': '/crm/products/details',
        'crm-pages': '/crm/pages',
        'crm-menus': '/crm/menus',
        'crm-settings': '/crm/settings',
      };
      navigate(systemRoutes[config.key] ?? '/crm/dashboard');
    } else {
      navigate(`/crm/pages/view/${config.key}`);
    }
  };

  return (
    <div>
      <PageHeader
        pageKey="crm-pages"
        actions={
          !permissions.readOnly && (
            <button type="button" className="crm-btn crm-btn--primary" onClick={() => setShowAddDrawer(true)}>
              <Plus size={15} /> Add Page
            </button>
          )
        }
      />

      {sorted.length === 0 ? (
        <EmptyState icon={FileStack} title="No pages configured yet" actionLabel="Add Page" onAction={() => setShowAddDrawer(true)} />
      ) : (
        <div className="crm-grid crm-grid--widgets">
          {sorted.map((config) => {
            const Icon = resolveCrmIcon(config.icon);
            return (
              <div key={config.key} className="crm-info-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: config.banner, color: '#fff', flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: 'var(--crm-title)', fontWeight: 700 }}>{config.title}</h4>
                    <p style={{ margin: 0, fontSize: 11.5, color: 'var(--crm-text)' }}>{config.subtitle || '—'}</p>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--crm-text)', margin: '0 0 14px 0' }}>{config.description || 'No description set.'}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="crm-btn" onClick={() => handleView(config)}>
                    <Eye size={14} /> View
                  </button>
                  <button type="button" className="crm-btn" disabled={permissions.readOnly} onClick={() => setEditingConfig(config)}>
                    <Pencil size={14} /> Edit
                  </button>
                  {!config.system && (
                    <button
                      type="button"
                      className="crm-btn crm-btn--danger"
                      disabled={permissions.readOnly}
                      onClick={() => setPendingDelete(config)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showAddDrawer || editingConfig) && (
        <PageConfigDrawer
          config={editingConfig}
          onClose={() => { setShowAddDrawer(false); setEditingConfig(null); }}
          onSave={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete page?"
          message={`"${pendingDelete.title}" will be removed. This cannot be undone.`}
          onConfirm={() => { removePageConfig(pendingDelete.key); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default PagesManagementPage;

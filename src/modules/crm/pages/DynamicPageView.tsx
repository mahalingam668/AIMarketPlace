import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { usePageConfiguration } from '../../../hooks/usePageConfiguration';

/**
 * Renders ANY page added via the Pages screen with no route-specific code —
 * this is what "no hardcoded pages" means in practice: a new config entry
 * is immediately viewable here without touching this component.
 */
function DynamicPageView() {
  const { pageKey } = useParams<{ pageKey: string }>();
  const navigate = useNavigate();
  const { getPageConfig } = usePageConfiguration();
  const config = pageKey ? getPageConfig(pageKey) : undefined;

  if (!config) {
    return (
      <EmptyState
        title="Page not found"
        message="This page may have been deleted from Menu & Page configuration."
        actionLabel="Back to Pages"
        onAction={() => navigate('/crm/pages')}
      />
    );
  }

  return (
    <div style={{ background: config.backgroundColor, padding: 24, borderRadius: 14, maxWidth: config.pageWidth, minHeight: config.pageHeight === 'auto' ? undefined : config.pageHeight }}>
      <button type="button" className="crm-btn" style={{ marginBottom: 16 }} onClick={() => navigate('/crm/pages')}>
        <ArrowLeft size={14} /> Back to Pages
      </button>
      <PageHeader pageKey={config.key} />
      <div className="crm-info-card" style={{ background: config.cardBackground }}>
        <p style={{ color: config.textColor, fontSize: 13.5, margin: 0 }}>
          {config.description || 'This page has no additional content yet — edit it from the Pages screen.'}
        </p>
      </div>
    </div>
  );
}

export default DynamicPageView;

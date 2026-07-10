import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Layers, Puzzle, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { resolveCrmIcon } from '../components/crmIcons';
import { useCrmProducts } from '../../../hooks/useCrmProducts';

type TabId = 'overview' | 'features' | 'screenshots' | 'documentation' | 'integrations';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'integrations', label: 'Integrations' },
];

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useCrmProducts();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const product = id ? products.find((p) => p.id === id) : products[0];

  if (!product) {
    return (
      <div>
        <PageHeader pageKey="crm-product-details" />
        <EmptyState
          title="Product not found"
          message="It may have been deleted. Pick another product from the catalog."
          actionLabel="Back to Products"
          onAction={() => navigate('/crm/products')}
        />
      </div>
    );
  }

  const Icon = resolveCrmIcon(product.icon);

  return (
    <div>
      <PageHeader pageKey="crm-product-details" />

      <button type="button" className="crm-btn" style={{ marginBottom: 16 }} onClick={() => navigate('/crm/products')}>
        <ArrowLeft size={14} /> Back to Products
      </button>

      <div className="crm-hero" style={{ background: product.gradient }}>
        <div className="crm-hero__row">
          <div className="crm-hero__icon">
            <Icon size={28} color="#fff" />
          </div>
          <div>
            <h2 className="crm-hero__name">{product.name}</h2>
            <div className="crm-hero__meta">
              <span>v{product.version}</span>
              <span>·</span>
              <StatusBadge status={product.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`crm-tabs__tab ${activeTab === tab.id ? 'crm-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="crm-grid crm-grid--widgets">
          <div className="crm-info-card">
            <p className="crm-info-card__label">Description</p>
            <p style={{ fontSize: 13.5, color: 'var(--crm-text)', margin: 0 }}>{product.description}</p>
          </div>
          <div className="crm-info-card">
            <p className="crm-info-card__label">Category</p>
            <p style={{ fontSize: 13.5, color: 'var(--crm-title)', fontWeight: 700, margin: 0 }}>{product.category}</p>
          </div>
          <div className="crm-info-card">
            <p className="crm-info-card__label">Tags</p>
            <div className="crm-tag-list">
              {product.tags.length > 0 ? product.tags.map((tag) => <span key={tag} className="crm-tag">{tag}</span>) : <span style={{ fontSize: 12.5, color: 'var(--crm-text)' }}>No tags</span>}
            </div>
          </div>
          <div className="crm-info-card">
            <p className="crm-info-card__label">Last Updated</p>
            <p style={{ fontSize: 13.5, color: 'var(--crm-title)', fontWeight: 700, margin: 0 }}>
              {new Date(product.lastUpdated).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="crm-info-card">
          {product.features.length > 0 ? (
            <ul className="crm-feature-list">
              {product.features.map((feature) => (
                <li key={feature}><Check size={15} /> {feature}</li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Layers} title="No features listed yet" />
          )}
        </div>
      )}

      {activeTab === 'screenshots' && (
        product.screenshots.length > 0 ? (
          <div className="crm-screenshot-grid">
            {product.screenshots.map((shot) => (
              <div key={shot.id} className="crm-screenshot" style={{ background: shot.swatch }}>
                {shot.caption}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={ImageIcon} title="No screenshots uploaded" message="Screenshots will appear here once added." />
        )
      )}

      {activeTab === 'documentation' && (
        product.documentation.length > 0 ? (
          <div className="crm-grid crm-grid--widgets">
            {product.documentation.map((doc) => (
              <div key={doc.title} className="crm-doc-card">
                <h4>{doc.title}</h4>
                <p>{doc.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="No documentation yet" />
        )
      )}

      {activeTab === 'integrations' && (
        product.integrations.length > 0 ? (
          <div className="crm-tag-list">
            {product.integrations.map((integration) => (
              <span key={integration} className="crm-integration-chip">
                <Puzzle size={13} /> {integration}
              </span>
            ))}
          </div>
        ) : (
          <EmptyState icon={Puzzle} title="No integrations connected" />
        )
      )}
    </div>
  );
}

export default ProductDetailsPage;

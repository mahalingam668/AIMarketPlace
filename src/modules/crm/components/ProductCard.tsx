import { useNavigate } from 'react-router-dom';
import type { CrmProduct } from '../data/products.mock';
import { resolveCrmIcon } from './crmIcons';
import StatusBadge from './StatusBadge';

function ProductCard({ product }: { product: CrmProduct }) {
  const navigate = useNavigate();
  const Icon = resolveCrmIcon(product.icon);

  return (
    <div
      className="crm-product-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/crm/products/${product.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/crm/products/${product.id}`);
      }}
    >
      <div className="crm-product-card__icon" style={{ background: product.gradient }}>
        <Icon size={18} color="#fff" />
      </div>
      <div className="crm-product-card__body">
        <h4 className="crm-product-card__name">{product.name}</h4>
        <p className="crm-product-card__meta">{product.category} · v{product.version}</p>
      </div>
      <StatusBadge status={product.status} />
    </div>
  );
}

export default ProductCard;

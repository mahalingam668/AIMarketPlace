import { ArrowDown, ArrowUp, Eye, Pencil, Trash2 } from 'lucide-react';
import type { CrmProduct } from '../data/products.mock';
import { resolveCrmIcon } from './crmIcons';
import StatusBadge from './StatusBadge';

export type ProductSortKey = 'name' | 'category' | 'version' | 'status' | 'createdDate';

interface ProductTableProps {
  products: CrmProduct[];
  sortKey: ProductSortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: ProductSortKey) => void;
  onView: (product: CrmProduct) => void;
  onEdit: (product: CrmProduct) => void;
  onDelete: (product: CrmProduct) => void;
  readOnly?: boolean;
}

const COLUMNS: { key: ProductSortKey; label: string }[] = [
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status' },
  { key: 'createdDate', label: 'Created Date' },
];

function ProductTable({ products, sortKey, sortDir, onSort, onView, onEdit, onDelete, readOnly }: ProductTableProps) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isActive = sortKey === col.key;
              return (
                <th key={col.key}>
                  <button type="button" className="crm-table__sort-btn" onClick={() => onSort(col.key)}>
                    {col.label}
                    {isActive && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </button>
                </th>
              );
            })}
            <th className="crm-table__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const Icon = resolveCrmIcon(product.icon);
            return (
              <tr key={product.id}>
                <td>
                  <div className="crm-table__product-cell">
                    <span className="crm-table__product-icon" style={{ background: product.gradient }}>
                      <Icon size={16} color="#fff" />
                    </span>
                    {product.name}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>v{product.version}</td>
                <td><StatusBadge status={product.status} /></td>
                <td>{new Date(product.createdDate).toLocaleDateString()}</td>
                <td>
                  <div className="crm-table__actions">
                    <button type="button" className="crm-table__action-btn" onClick={() => onView(product)} aria-label={`View ${product.name}`}>
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="crm-table__action-btn"
                      onClick={() => onEdit(product)}
                      disabled={readOnly}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="crm-table__action-btn crm-table__action-btn--danger"
                      onClick={() => onDelete(product)}
                      disabled={readOnly}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

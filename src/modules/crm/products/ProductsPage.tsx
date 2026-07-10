import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductTable, { type ProductSortKey } from '../components/ProductTable';
import ProductFormDrawer from './ProductFormDrawer';
import { useCrmProducts } from '../../../hooks/useCrmProducts';
import { useCrmRole } from '../../../hooks/useCrmRole';
import type { CrmProduct } from '../data/products.mock';

const PAGE_SIZE = 5;
const STATUS_FILTERS = ['All', 'Active', 'Draft', 'Deprecated'];

function ProductsPage() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useCrmProducts();
  const { permissions } = useCrmRole();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState<ProductSortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<CrmProduct | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CrmProduct | null>(null);

  const filtered = useMemo(() => {
    let result = products;
    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'createdDate') {
        return (new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) * dir;
      }
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir;
    });
  }, [products, statusFilter, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key: ProductSortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleSave = (product: CrmProduct) => {
    if (editingProduct) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setEditingProduct(null);
    setShowAddDrawer(false);
  };

  return (
    <div>
      <PageHeader
        pageKey="crm-products"
        actions={
          !permissions.readOnly && (
            <button type="button" className="crm-btn crm-btn--primary" onClick={() => setShowAddDrawer(true)}>
              <Plus size={15} /> Add Product
            </button>
          )
        }
      />

      <div className="crm-toolbar">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products or categories..." />
        <div className="crm-toolbar__filters">
          <select
            className="crm-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <LoadingSkeleton count={5} height={48} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products match your filters"
          message="Try clearing the search or status filter."
          actionLabel="Clear filters"
          onAction={() => { setSearch(''); setStatusFilter('All'); }}
        />
      ) : (
        <>
          <ProductTable
            products={paginated}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onView={(p) => navigate(`/crm/products/${p.id}`)}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={(p) => setPendingDelete(p)}
            readOnly={permissions.readOnly}
          />

          <div className="crm-pagination">
            <span className="crm-pagination__info">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="crm-pagination__controls">
              <button type="button" className="crm-pagination__btn" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`crm-pagination__btn ${p === currentPage ? 'crm-pagination__btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button type="button" className="crm-pagination__btn" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </>
      )}

      {(showAddDrawer || editingProduct) && (
        <ProductFormDrawer
          product={editingProduct}
          onClose={() => { setShowAddDrawer(false); setEditingProduct(null); }}
          onSave={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${pendingDelete.name}" will be removed from the catalog. This cannot be undone.`}
          onConfirm={() => { deleteProduct(pendingDelete.id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default ProductsPage;

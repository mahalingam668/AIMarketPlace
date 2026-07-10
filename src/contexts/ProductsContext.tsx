import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CRM_PRODUCTS, type CrmProduct } from '../modules/crm/data/products.mock';
import { ProductsContext, type ProductsContextValue } from './productsContextObject';

const PRODUCTS_STORAGE_KEY = 'crm.products.v1';

function loadStoredProducts(): CrmProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return CRM_PRODUCTS;
    return JSON.parse(raw) as CrmProduct[];
  } catch {
    return CRM_PRODUCTS;
  }
}

/**
 * In-memory (localStorage-backed) product store — this is the "no backend,
 * mock JSON" data source. Add/Edit/Delete on the Products page persist for
 * the session and are visible everywhere (Dashboard widgets, Product
 * Details, menu badge counts) since they all read from this one context.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CrmProduct[]>(loadStoredProducts);

  const persist = useCallback((next: CrmProduct[]) => {
    setProducts(next);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — store still updates for this session */
    }
  }, []);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addProduct = useCallback(
    (product: CrmProduct) => {
      persist([product, ...products]);
    },
    [products, persist]
  );

  const updateProduct = useCallback(
    (id: string, partial: Partial<CrmProduct>) => {
      persist(products.map((p) => (p.id === id ? { ...p, ...partial } : p)));
    },
    [products, persist]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persist(products.filter((p) => p.id !== id));
    },
    [products, persist]
  );

  const value = useMemo<ProductsContextValue>(
    () => ({ products, getProduct, addProduct, updateProduct, deleteProduct }),
    [products, getProduct, addProduct, updateProduct, deleteProduct]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

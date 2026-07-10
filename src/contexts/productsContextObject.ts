import { createContext } from 'react';
import type { CrmProduct } from '../modules/crm/data/products.mock';

export interface ProductsContextValue {
  products: CrmProduct[];
  getProduct: (id: string) => CrmProduct | undefined;
  addProduct: (product: CrmProduct) => void;
  updateProduct: (id: string, partial: Partial<CrmProduct>) => void;
  deleteProduct: (id: string) => void;
}

export const ProductsContext = createContext<ProductsContextValue | null>(null);

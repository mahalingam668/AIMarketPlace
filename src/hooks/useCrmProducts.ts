import { useContext } from 'react';
import { ProductsContext, type ProductsContextValue } from '../contexts/productsContextObject';

export function useCrmProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useCrmProducts must be used within a <ProductsProvider>');
  return ctx;
}

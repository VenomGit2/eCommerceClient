import { useCallback, useEffect, useRef, useState } from 'react';
import { getProduct } from '../services/productService';

export default function useProductSearch() {
  const controllerRef = useRef(null);
  const [state, setState] = useState({ product: null, loading: false, error: null, hasSearched: false });

  const search = useCallback(async (productId) => {
    const normalizedProductId = productId.trim();
    if (!normalizedProductId) return null;

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setState({ product: null, loading: true, error: null, hasSearched: true });

    try {
      const product = await getProduct(normalizedProductId, controllerRef.current.signal);
      setState({ product, loading: false, error: null, hasSearched: true });
      return product;
    } catch (error) {
      if (error.name !== 'AbortError') setState({ product: null, loading: false, error, hasSearched: true });
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    controllerRef.current?.abort();
    setState({ product: null, loading: false, error: null, hasSearched: false });
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, search, clear };
}


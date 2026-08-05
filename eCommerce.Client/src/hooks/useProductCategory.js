import { useCallback, useEffect, useRef, useState } from 'react';
import { getProductsByCategory } from '../services/productService';

export default function useProductCategory() {
  const controllerRef = useRef(null);
  const [state, setState] = useState({ products: [], loading: false, error: null, category: '' });

  const loadCategory = useCallback(async (category) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setState({ products: [], loading: true, error: null, category });
    try {
      const products = await getProductsByCategory(category, controllerRef.current.signal);
      setState({ products, loading: false, error: null, category });
      return products;
    } catch (error) {
      if (error.name !== 'AbortError') setState({ products: [], loading: false, error, category });
      return [];
    }
  }, []);

  const clearCategory = useCallback(() => {
    controllerRef.current?.abort();
    setState({ products: [], loading: false, error: null, category: '' });
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, loadCategory, clearCategory };
}

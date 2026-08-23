import { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from './useAxios';
import { getProducts } from '../services/productService';
import { getPage } from '../utils/apiResponse';

const PAGE_SIZE = 100;
const initialState = {
  products: [],
  pageNumber: 0,
  totalItems: 0,
  hasMore: false,
  loading: true,
  loadingMore: false,
  error: null,
};

export default function useProducts({ category = '' } = {}) {
  const API = useAxios();
  const controllerRef = useRef(null);
  const [state, setState] = useState(initialState);

  const loadPage = useCallback(async (pageNumber, append = false) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setState((current) => ({ ...current, loading: !append, loadingMore: append, error: null }));

    try {
      const response = await getProducts(API, {
        pageNumber,
        pageSize: PAGE_SIZE,
        category,
        signal: controllerRef.current.signal,
      });
      const page = getPage(response);

      setState((current) => {
        const combined = append ? [...current.products, ...page.items] : page.items;
        const products = [...new Map(combined.map((product) => [String(product.id), product])).values()];

        return {
          products,
          pageNumber: page.pageNumber,
          totalItems: page.totalItems,
          hasMore: page.hasMore,
          loading: false,
          loadingMore: false,
          error: null,
        };
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState((current) => ({
          ...current,
          loading: false,
          loadingMore: false,
          error,
        }));
      }
    }
  }, [API, category]);

  useEffect(() => {
    loadPage(1);
    return () => controllerRef.current?.abort();
  }, [loadPage]);

  return {
    ...state,
    loadMore: () => {
      if (state.hasMore && !state.loadingMore) loadPage(state.pageNumber + 1, true);
    },
    reload: () => loadPage(1),
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from './useAxios';
import { aiSearchProducts } from '../services/aiService';

const IDLE = { products: [], note: '', loading: false, error: '', searched: false };

export default function useAiSearch() {
  const API = useAxios();
  const [state, setState] = useState(IDLE);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const search = useCallback(async (query) => {
    const text = query.trim();
    if (!text) return;

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setState({ ...IDLE, loading: true });
    try {
      const { products, note } = await aiSearchProducts(API, text, controllerRef.current.signal);
      setState({ ...IDLE, products, note, searched: true });
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      setState({ ...IDLE, searched: true, error: requestError.message || 'AI search is unavailable right now.' });
    }
  }, [API]);

  const clear = useCallback(() => {
    controllerRef.current?.abort();
    setState(IDLE);
  }, []);

  return { ...state, search, clear };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from './useAxios';
import { aiCompareProducts } from '../services/aiService';

const IDLE = { result: null, loading: false, error: '' };

export default function useAiCompare() {
  const API = useAxios();
  const [state, setState] = useState(IDLE);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const compare = useCallback(async (productIds) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setState({ ...IDLE, loading: true });
    try {
      const result = await aiCompareProducts(API, productIds, controllerRef.current.signal);
      setState({ ...IDLE, result });
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      setState({ ...IDLE, error: requestError.message || 'The comparison is unavailable right now.' });
    }
  }, [API]);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState(IDLE);
  }, []);

  return { ...state, compare, reset };
}

import { useCallback, useEffect, useState } from 'react';

export default function useAsync(operation, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const execute = useCallback((signal) => {
    setState((current) => ({ ...current, loading: true, error: null }));
    return operation(signal).then(
      (data) => setState({ data, loading: false, error: null }),
      (error) => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error }); },
    );
  }, dependencies); // Dependencies are intentionally owned by the calling hook.

  useEffect(() => {
    const controller = new AbortController();
    execute(controller.signal);
    return () => controller.abort();
  }, [execute]);

  return { ...state, reload: () => execute() };
}


import { useCallback, useEffect, useMemo, useState } from 'react';
import WishlistContext from '../context/WishlistContext';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/wishlistService';
import { getCollection } from '../utils/apiResponse';

export default function WishlistContainer({ children }) {
  const API = useAxios();
  const { isAuthenticated, session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingIds, setPendingIds] = useState([]);
  const [loadedToken, setLoadedToken] = useState(null);

  const load = useCallback(async (signal) => {
    if (!isAuthenticated) {
      setItems([]);
      setLoadedToken(null);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await getWishlist(API, signal);
      setItems(getCollection(response));
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load your wishlist.');
    } finally {
      if (!signal?.aborted) {
        setLoadedToken(session?.token || null);
        setLoading(false);
      }
    }
  }, [API, isAuthenticated, session?.token]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, session?.token]);

  const isSaved = useCallback((productId) => items.some((item) => String(item.id) === String(productId)), [items]);
  const isPending = useCallback((productId) => pendingIds.some((id) => String(id) === String(productId)), [pendingIds]);
  const ready = !isAuthenticated || (loadedToken === session?.token && !error);

  const toggleItem = useCallback(async (product) => {
    const productId = product?.id;
    if (productId == null || !ready || isPending(productId)) return;
    const removing = isSaved(productId);
    setPendingIds((current) => [...current, productId]);
    setError('');
    try {
      if (removing) {
        await removeFromWishlist(API, productId);
        setItems((current) => current.filter((item) => String(item.id) !== String(productId)));
      } else {
        await addToWishlist(API, productId);
        setItems((current) => current.some((item) => String(item.id) === String(productId)) ? current : [...current, product]);
      }
    } catch (requestError) {
      setError(requestError.message || `Could not ${removing ? 'remove' : 'save'} this product.`);
      throw requestError;
    } finally {
      setPendingIds((current) => current.filter((id) => String(id) !== String(productId)));
    }
  }, [API, isPending, isSaved, ready]);

  const reload = useCallback(() => load(), [load]);

  const value = useMemo(() => ({
    items,
    itemCount: items.length,
    loading,
    ready,
    error,
    isAuthenticated,
    isPending,
    isSaved,
    reload,
    toggleItem,
  }), [items, loading, ready, error, isAuthenticated, isPending, isSaved, reload, toggleItem]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

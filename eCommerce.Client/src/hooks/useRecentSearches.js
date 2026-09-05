import { useCallback, useState } from 'react';

const STORAGE_KEY = 'recentProductSearches';
const MAX_RECENT = 6;

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(readStored);

  const addRecentSearch = useCallback((product) => {
    if (!product?.id) return;
    setRecentSearches((current) => {
      const entry = {
        id: product.id,
        name: product.name || product.productName || `Product ${product.id}`,
        imageUrl: product.imageUrl || null,
      };
      const withoutDuplicate = current.filter((item) => String(item.id) !== String(entry.id));
      const next = [entry, ...withoutDuplicate].slice(0, MAX_RECENT);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable (private mode, quota) - ignore, in-memory state still updates
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
export const CART_RECOVERY_STORAGE_KEY = 'circuit-and-grain.cart.v1';
export const CART_RECOVERY_DELAY_MS = 30 * 60 * 1000;
const CART_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

function sanitizeItem(item) {
  const id = item?.id ?? item?.productId ?? item?.productID;
  const quantity = Math.max(1, Math.floor(Number(item?.quantity) || 1));
  if (id == null || !item?.name) return null;
  return {
    ...item,
    id,
    name: String(item.name).slice(0, 200),
    quantity,
    price: Number(item.price ?? item.unitPrice) || 0,
  };
}

export function readCartSnapshot(storage = window.localStorage, now = Date.now()) {
  try {
    const parsed = JSON.parse(storage.getItem(CART_RECOVERY_STORAGE_KEY));
    const savedAt = Number(parsed?.savedAt);
    const items = Array.isArray(parsed?.items) ? parsed.items.map(sanitizeItem).filter(Boolean) : [];
    if (!items.length || !Number.isFinite(savedAt) || now - savedAt > CART_EXPIRY_MS || savedAt > now) {
      storage.removeItem(CART_RECOVERY_STORAGE_KEY);
      return { items: [], recovery: null };
    }
    return {
      items,
      recovery: now - savedAt >= CART_RECOVERY_DELAY_MS ? { savedAt } : null,
    };
  } catch {
    storage.removeItem(CART_RECOVERY_STORAGE_KEY);
    return { items: [], recovery: null };
  }
}

export function writeCartSnapshot(items, storage = window.localStorage, now = Date.now()) {
  const safeItems = items.map(sanitizeItem).filter(Boolean);
  if (!safeItems.length) {
    storage.removeItem(CART_RECOVERY_STORAGE_KEY);
    return;
  }
  storage.setItem(CART_RECOVERY_STORAGE_KEY, JSON.stringify({ version: 1, savedAt: now, items: safeItems }));
}

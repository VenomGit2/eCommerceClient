import { CART_RECOVERY_DELAY_MS, CART_RECOVERY_STORAGE_KEY, readCartSnapshot, writeCartSnapshot } from './cartRecovery';

describe('cart recovery', () => {
  const storage = (() => {
    const values = new Map();
    return {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    };
  })();

  afterEach(() => storage.removeItem(CART_RECOVERY_STORAGE_KEY));

  it('restores products and marks an old cart for recovery', () => {
    writeCartSnapshot([{ id: 'p1', name: 'Desk lamp', quantity: 2, price: 99 }], storage, 1000);

    const snapshot = readCartSnapshot(storage, 1000 + CART_RECOVERY_DELAY_MS);

    expect(snapshot.items).toMatchObject([{ id: 'p1', quantity: 2 }]);
    expect(snapshot.recovery).toEqual({ savedAt: 1000 });
  });

  it('does not prompt for a recent cart and removes a cleared cart', () => {
    writeCartSnapshot([{ id: 'p1', name: 'Desk lamp', quantity: 1 }], storage, 1000);
    expect(readCartSnapshot(storage, 2000).recovery).toBeNull();

    writeCartSnapshot([], storage, 3000);
    expect(readCartSnapshot(storage, 3000).items).toEqual([]);
  });
});

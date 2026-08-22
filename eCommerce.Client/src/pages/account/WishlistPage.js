import { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import Button from '../../components/common/Button';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { getWishlist, removeFromWishlist } from '../../services/wishlistService';
import { getCollection } from '../../utils/apiResponse';
import AccountTabs from '../../components/common/AccountTabs';

export default function WishlistPage() {
  const API = useAxios();
  const { session } = useAuth();
  const { addItem, items: cartItems } = useCart();
  const result = useAsync((signal) => getWishlist(API, signal), [API, session?.token]);
  const [removingId, setRemovingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const items = getCollection(result.data);

  const remove = async (productId) => {
    setRemovingId(productId);
    setActionError('');
    try {
      await removeFromWishlist(API, productId);
      await result.reload();
    } catch (error) {
      setActionError(error.message || 'Could not remove this product from your wishlist.');
    } finally {
      setRemovingId(null);
    }
  };

  if (result.loading) return null;
  if (result.error) return <ErrorMessage message={result.error.message} onRetry={result.reload} />;

  return (
    <section className="account-page">
      <AccountTabs />
      <div className="account-page__heading"><p className="eyebrow">Your account</p><h1>Wishlist</h1></div>
      {actionError && <ErrorMessage message={actionError} />}
      {items.length ? <div className="product-grid">{items.map((item) => (
        <div key={item.id}>
          <ProductCard product={item} onAdd={addItem} isInCart={cartItems.some((cartItem) => String(cartItem.id) === String(item.id))} />
          <Button variant="ghost" onClick={() => remove(item.id)} disabled={removingId === item.id}>
            {removingId === item.id ? 'Removing…' : 'Remove from wishlist'}
          </Button>
        </div>
      ))}</div> : <EmptyState title="Your wishlist is empty" message="Saved products will appear here." />}
    </section>
  );
}

import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import AccountTabs from '../../components/common/AccountTabs';

export default function WishlistPage() {
  const { addItem, items: cartItems } = useCart();
  const { items, loading, error, reload } = useWishlist();

  if (loading) return null;

  return (
    <section className="account-page">
      <AccountTabs />
      <div className="account-page__heading"><p className="eyebrow">Your account</p><h1>Wishlist</h1></div>
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {items.length ? <div className="product-grid">{items.map((item) => (
        <ProductCard key={item.id} product={item} onAdd={addItem} isInCart={cartItems.some((cartItem) => String(cartItem.id) === String(item.id))} />
      ))}</div> : <EmptyState title="Your wishlist is empty" message="Select the heart on any product to save it here." />}
    </section>
  );
}

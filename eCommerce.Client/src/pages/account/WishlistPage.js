import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { getWishlist } from '../../services/wishlistService';
import { getCollection } from '../../utils/apiResponse';
export default function WishlistPage() {
  const API = useAxios(); const { session } = useAuth(); const { addItem, items: cartItems } = useCart(); const result = useAsync((signal) => getWishlist(API, signal), [API, session?.token]); const items = getCollection(result.data);
  if (result.loading) return null; if (result.error) return <ErrorMessage message={result.error.message} onRetry={result.reload} />;
  return <section><h1>Wishlist</h1>{items.length ? <div className="product-grid">{items.map((item, index) => <ProductCard key={item.id ?? index} product={item} onAdd={addItem} isInCart={cartItems.some((cartItem) => String(cartItem.id) === String(item.id))} />)}</div> : <EmptyState title="Your wishlist is empty" message="Saved products will appear here." />}</section>;
}

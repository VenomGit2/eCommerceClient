import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import ProductCard from '../../components/ProductCard';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { getWishlist } from '../../services/wishlistService';
import { getCollection } from '../../utils/apiResponse';
export default function WishlistPage() {
  const { session } = useAuth(); const { addItem } = useCart(); const result = useAsync((signal) => getWishlist(session?.token, signal), [session?.token]); const items = getCollection(result.data);
  if (result.loading) return <Loader label="Loading wishlist" />; if (result.error) return <ErrorMessage message={result.error.message} onRetry={result.reload} />;
  return <section><h1>Wishlist</h1>{items.length ? <div className="product-grid">{items.map((item, index) => <ProductCard key={item.id ?? index} product={item} onAdd={addItem} />)}</div> : <EmptyState title="Your wishlist is empty" message="Saved products will appear here." />}</section>;
}


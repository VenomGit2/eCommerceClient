import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import useAsync from '../../hooks/useAsync';
import useCart from '../../hooks/useCart';
import { getProduct } from '../../services/productService';
import { getEntity } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';
export default function ProductDetailPage() {
  const { productId } = useParams(); const { addItem } = useCart();
  const [cartState, setCartState] = useState({ adding: false, added: false, error: '' });
  const loadProduct = useCallback((signal) => getProduct(productId, signal), [productId]);
  const { data, loading, error, reload } = useAsync(loadProduct, [loadProduct]); const product = getEntity(data);
  if (loading) return <Loader label="Loading product" />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (!product) return <ErrorMessage message="Product not found." />;
  const addToCart = async () => {
    if (cartState.adding || cartState.added) return;
    setCartState({ adding: true, added: false, error: '' });
    try {
      await addItem(product);
      setCartState({ adding: false, added: true, error: '' });
    } catch (requestError) {
      setCartState({ adding: false, added: false, error: requestError.message || 'Could not add this item to the cart.' });
    }
  };
  return <article className="product-detail">{product.imageUrl ? <img src={product.imageUrl} alt={product.name || 'Product'} /> : <div className="product-detail__placeholder" aria-hidden="true">{product.name?.charAt(0)}</div>}<div><p className="eyebrow">Product</p><h1>{product.name}</h1>{product.description && <p>{product.description}</p>}<p className="price">{formatCurrency(product.price, product.currency)}</p><Button onClick={addToCart} disabled={product.id == null || cartState.adding || cartState.added} aria-live="polite">{cartState.adding ? 'Adding…' : cartState.added ? 'Added to cart ✓' : 'Add to cart'}</Button>{cartState.error && <p className="field-error" role="alert">{cartState.error}</p>}</div></article>;
}

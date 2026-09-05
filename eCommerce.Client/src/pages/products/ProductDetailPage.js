import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import RatingBadge from '../../components/common/RatingBadge';
import ShareButton from '../../components/common/ShareButton';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductHighlights from '../../components/ProductHighlights';
import ProductDescription from '../../components/ProductDescription';
import ProductReviews from './ProductReviews';
import WishlistButton from '../../components/WishlistButton';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import usePageMeta from '../../hooks/usePageMeta';
import { ROUTES } from '../../routes/routePaths';
import { getProduct } from '../../services/productService';
import { getEntity } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';

export default function ProductDetailPage() {
  const API = useAxios();
  const { productId } = useParams();
  const { addItem, items } = useCart();
  const { isAdmin } = useAuth();
  const [cartState, setCartState] = useState({ adding: false, error: '' });
  const loadProduct = useCallback((signal) => getProduct(API, productId, signal), [API, productId]);
  const { data, loading, error, reload } = useAsync(loadProduct, [loadProduct]);
  const product = getEntity(data);

  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://ecommerceclient.insanedk46.workers.dev';
  usePageMeta(
    product
      ? {
          title: product.name,
          description: product.description || `Shop ${product.name} at Circuit & Grain.`,
          image: product.imageUrl || undefined,
          url: `${siteUrl.replace(/\/$/, '')}/products/${encodeURIComponent(productId)}`,
          type: 'product',
          price: product.price,
          currency: product.currency || 'USD',
        }
      : null,
    [product],
  );

  if (loading) return <div className="product-detail-skeleton" aria-label="Loading product" aria-busy="true"><span /><div><span /><span /><span /></div></div>;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (!product) return <ErrorMessage message="Product not found." />;

  const isInCart = items.some((item) => String(item.id) === String(product.id));
  const addToCart = async () => {
    if (cartState.adding || isInCart) return;
    setCartState({ adding: true, error: '' });
    try {
      await addItem(product);
      setCartState({ adding: false, error: '' });
    } catch (requestError) {
      setCartState({ adding: false, error: requestError.message || 'Could not add this item to the cart.' });
    }
  };

  return (
    <article className="product-detail">
      <div className="product-detail__sticky">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name || 'Product'} />
          : <div className="product-detail__placeholder" aria-hidden="true">{product.name?.charAt(0)}</div>}
        <div>
          <p className="eyebrow">Product</p>
          <h1>{product.name}</h1>
          <p className="price">{formatCurrency(product.price, product.currency)}</p>
        
            <div className="product-detail__rating-summary">
              <RatingBadge
                value={product.rating}
                ratingsCount={product.ratingsCount ?? product.reviewCount ?? 0}
                reviewCount={product.reviewCount ?? 0}
                size="lg"
              />
            </div>
     
          <div className="product-detail__actions">
            {isInCart
              ? <Link className="button button--primary" to={ROUTES.cart}>Go to cart <span aria-hidden="true">→</span></Link>
              : <Button onClick={addToCart} disabled={product.id == null || cartState.adding} aria-live="polite">{cartState.adding ? 'Adding…' : 'Add to cart'}</Button>}
            <ShareButton
              title={product.name || 'Product'}
              text={product.description ? `Check out ${product.name} at Circuit & Grain: ${product.description}` : `Check out ${product.name} at Circuit & Grain.`}
              label="Share product"
              dialogTitle="Share this product"
              className="product-detail__share"
              aria-label={`Share ${product.name || 'this product'}`}
            />
            <WishlistButton product={product} className="product-detail__wishlist" />
          </div>
          {cartState.error && <p className="field-error" role="alert">{cartState.error}</p>}
        </div>
      </div>

      <div className="product-detail__scroll">
        {/* <ProductHighlights text={product.description} /> */}
        <ProductDescription text={product.description} />
        <ProductReviews product={product} isAdmin={isAdmin} onReviewsChanged={reload} />
      </div>
    </article>
  );
}
import { resolveProductImageUrl } from '../../utils/productImage';

export default function OrderProductImage({ item, className = '' }) {
  const imageUrl = resolveProductImageUrl(
    item.productImageUrl,
    process.env.REACT_APP_PRODUCTS_API_BASE_URL,
  );

  if (!imageUrl) {
    return (
      <span className={`product-image-placeholder ${className}`.trim()} role="img" aria-label={`No image available for ${item.productName || 'this product'}`}>
        <span aria-hidden="true">No image</span>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={imageUrl}
      alt={item.productName || 'Ordered product'}
      loading="lazy"
      width="160"
      height="160"
    />
  );
}

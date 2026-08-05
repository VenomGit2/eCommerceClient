const IMAGE_SIZE = 800;

export function getProductImageUrl(productName, productId) {
  const searchTerm = String(productName || 'retail product')
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ',');
  const lock = encodeURIComponent(String(productId ?? searchTerm));

  return `https://loremflickr.com/${IMAGE_SIZE}/${IMAGE_SIZE}/${encodeURIComponent(searchTerm)},product?lock=${lock}`;
}

import { apiRequest, endpointPath } from './apiClient';
import { mapProduct } from './productService';
const path = () => endpointPath('REACT_APP_WISHLIST_PATH');
export async function getWishlist(token, signal) {
  const response = await apiRequest(path(), { token, signal });
  return { ...response, products: response.products?.map(mapProduct) || [] };
}
export const updateWishlist = (wishlist, token) => apiRequest(path(), { method: 'PUT', body: wishlist, token });

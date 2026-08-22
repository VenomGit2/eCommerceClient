import { endpointPath } from '../hooks/useAxios';
import { mapProduct } from './productService';
const path = () => endpointPath('REACT_APP_WISHLIST_PATH');
export async function getWishlist(API, signal) {
  const { data: response } = await API.get(path(), { signal });
  return { ...response, data: Array.isArray(response.data) ? response.data.map(mapProduct) : [] };
}
export async function addToWishlist(API, productId) {
  const { data } = await API.post(`${path()}/${encodeURIComponent(productId)}`);
  return data;
}
export async function removeFromWishlist(API, productId) {
  const { data } = await API.delete(`${path()}/${encodeURIComponent(productId)}`);
  return data;
}

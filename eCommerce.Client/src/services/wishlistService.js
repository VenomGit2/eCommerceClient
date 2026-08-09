import { endpointPath } from '../hooks/useAxios';
import { mapProduct } from './productService';
const path = () => endpointPath('REACT_APP_WISHLIST_PATH');
export async function getWishlist(API, signal) {
  const { data: response } = await API.get(path(), { signal });
  return { ...response, products: response.products?.map(mapProduct) || [] };
}
export async function updateWishlist(API, wishlist) {
  const { data } = await API.put(path(), wishlist);
  return data;
}

import { endpointPath } from '../hooks/useAxios';
import { mapProduct } from './productService';

const path = () => endpointPath('REACT_APP_WISHLIST_PATH');
const operationPath = (variableName) => endpointPath(variableName);

const wishlistConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_WISHLIST_API_BASE_URL'),
});

export async function getWishlist(API, signal) {
  const { data: response } = await API.get(path(), wishlistConfig({ signal }));
  return { ...response, data: Array.isArray(response.data) ? response.data.map(mapProduct) : [] };
}

export async function addToWishlist(API, productId) {
  const { data } = await API.post(`${path()}/${encodeURIComponent(productId)}`, null, wishlistConfig());
  return data;
}

export async function removeFromWishlist(API, productId) {
  const { data } = await API.delete(`${path()}/${encodeURIComponent(productId)}`, wishlistConfig());
  return data;
}

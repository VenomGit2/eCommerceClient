import { apiRequest, endpointPath } from './apiClient';
import { getProductImageUrl } from '../utils/productImage';
const productsPath = () => endpointPath('REACT_APP_PRODUCTS_PATH');
const operationPath = (variableName) => endpointPath(variableName);
const productRequest = (path, options = {}) => apiRequest(path, {
  ...options,
  baseURL: endpointPath('REACT_APP_PRODUCTS_API_BASE_URL'),
});

export const mapProduct = (product) => ({
  ...product,
  id: product.productId,
  name: product.productName,
  price: product.unitPrice,
  currency: 'USD',
  imageUrl: product.imageUrl || getProductImageUrl(product.productName, product.productId),
});

export async function getProducts(signal) {
  const response = await productRequest(productsPath(), { signal });
  return { ...response, data: Array.isArray(response.data) ? response.data.map(mapProduct) : [] };
}
export async function getProduct(id, signal) {
  const response = await productRequest(`${operationPath('REACT_APP_PRODUCT_SEARCH_PATH')}/${encodeURIComponent(id)}`, { signal });
  const product = Array.isArray(response.data) ? response.data[0] : response.data;
  return product ? mapProduct(product) : null;
}
export async function getProductsByCategory(category, signal) {
  const response = await productRequest(`${operationPath('REACT_APP_PRODUCT_SEARCH_PATH')}/${encodeURIComponent(category)}`, { signal });
  const products = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : response?.data
        ? [response.data]
        : [];
  return products.map(mapProduct);
}
export const createProduct = (product) => productRequest(operationPath('REACT_APP_PRODUCT_ADD_PATH'), { method: 'POST', body: product });
export const updateProduct = (id, product) => productRequest(operationPath('REACT_APP_PRODUCT_UPDATE_PATH'), { method: 'POST', body: { ...product, productId: id } });
export const deleteProduct = (id) => productRequest(`${operationPath('REACT_APP_PRODUCT_DELETE_PATH')}/${encodeURIComponent(id)}`, { method: 'POST' });

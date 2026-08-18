import { endpointPath } from '../hooks/useAxios';
import { resolveProductImageUrl as resolveImageUrl } from '../utils/productImage';
const productsPath = () => endpointPath('REACT_APP_PRODUCTS_PATH');
const operationPath = (variableName) => endpointPath(variableName);
const productConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_PRODUCTS_API_BASE_URL'),
});

const resolveProductImageUrl = (product) => {
  return resolveImageUrl(
    product.imageUrl,
    endpointPath('REACT_APP_PRODUCTS_API_BASE_URL'),
  );
};

export const mapProduct = (product) => ({
  ...product,
  id: product.productId,
  name: product.productName,
  price: product.unitPrice,
  currency: 'INR',
  imageUrl: resolveProductImageUrl(product),
});

export async function getProducts(API, signal) {
  const { data: response } = await API.get(productsPath(), productConfig({ signal }));
  return { ...response, data: Array.isArray(response.data) ? response.data.map(mapProduct) : [] };
}
export async function getProduct(API, id, signal) {
  const { data: response } = await API.get(`${operationPath('REACT_APP_PRODUCT_SEARCH_PATH')}/${encodeURIComponent(id)}`, productConfig({ signal }));
  const product = Array.isArray(response.data) ? response.data[0] : response.data;
  return product ? mapProduct(product) : null;
}
export async function getProductsByCategory(API, category, signal) {
  const { data: response } = await API.get(`${operationPath('REACT_APP_PRODUCT_SEARCH_PATH')}/${encodeURIComponent(category)}`, productConfig({ signal }));
  const products = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : response?.data
        ? [response.data]
        : [];
  return products.map(mapProduct);
}
export async function createProduct(API, product) {
  const { data } = await API.post(operationPath('REACT_APP_PRODUCT_ADD_PATH'), product, productConfig());
  return data;
}
export async function updateProduct(API, id, product) {
  const { data } = await API.post(operationPath('REACT_APP_PRODUCT_UPDATE_PATH'), { ...product, productId: id }, productConfig());
  return data;
}
export async function deleteProduct(API, id) {
  const { data } = await API.post(`${operationPath('REACT_APP_PRODUCT_DELETE_PATH')}/${encodeURIComponent(id)}`, null, productConfig());
  return data;
}

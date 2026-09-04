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
  rating: Number(product.rating) || 0,
  reviewCount: Number(product.reviewCount) || 0,
  ratingsCount: Number(product.ratingsCount) || 0,
});

export async function getProducts(
  API,
  { pageNumber = 1, pageSize = 100, category = '', signal } = {},
) {
  const params = { pageNumber, pageSize };
  if (category) params.category = category;

  const { data: response } = await API.get(productsPath(), productConfig({ params, signal }));
  const payload = response?.data ?? {};
  const rawItems = Array.isArray(payload) ? payload : payload.items;
  const items = Array.isArray(rawItems) ? rawItems.map(mapProduct) : [];
  const data = Array.isArray(payload) ? items : { ...payload, items };

  return { ...response, data };
}

export async function getProduct(API, id, signal) {
  const path = `${operationPath('REACT_APP_PRODUCT_SEARCH_PATH')}/${encodeURIComponent(id)}`;
  const { data: response } = await API.get(path, productConfig({ signal }));
  const product = Array.isArray(response?.data) ? response.data[0] : response?.data;

  return product ? mapProduct(product) : null;
}
export async function createProduct(API, product, image) {
  const formData = new FormData();
  formData.append('productName', product.productName);
  formData.append('category', product.category);
  formData.append('unitPrice', String(product.unitPrice));
  formData.append('quantityInStock', String(product.quantityInStock));
  formData.append('description', product.description ?? '');
  formData.append('image', image);

  const { data } = await API.post(operationPath('REACT_APP_PRODUCT_ADD_PATH'), formData, productConfig());
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
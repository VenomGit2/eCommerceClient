import { apiRequest, endpointPath } from './apiClient';

const orderRequest = (path, options = {}) => apiRequest(path, {
  ...options,
  baseURL: endpointPath('REACT_APP_ORDERS_API_BASE_URL'),
});

export const getCart = (token, signal) => orderRequest(
  endpointPath('REACT_APP_ORDERS_PATH'),
  { token, signal },
);

export const createCart = (cart, token) => orderRequest(
  endpointPath('REACT_APP_ORDER_CREATE_PATH'),
  { method: 'POST', body: cart, token },
);

export const updateCart = (cart, token) => orderRequest(
  endpointPath('REACT_APP_ORDER_UPDATE_PATH'),
  { method: 'PUT', body: cart, token },
);

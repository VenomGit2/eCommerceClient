import { apiRequest, endpointPath } from './apiClient';

const operationPath = (variableName) => endpointPath(variableName);
const orderRequest = (path, options = {}) => apiRequest(path, {
  ...options,
  baseURL: endpointPath('REACT_APP_ORDERS_API_BASE_URL'),
});

export const getOrders = (token, signal) => orderRequest(
  operationPath('REACT_APP_ORDERS_PATH'),
  { token, signal },
);

export const getOrder = (orderId, token, signal) => orderRequest(
  `${operationPath('REACT_APP_ORDER_SEARCH_PATH')}/${encodeURIComponent(orderId)}`,
  { token, signal },
);

export const createOrder = (order, token) => orderRequest(
  operationPath('REACT_APP_ORDER_CREATE_PATH'),
  { method: 'POST', token, body: order },
);

export const updateOrder = (order, token) => orderRequest(
  operationPath('REACT_APP_ORDER_UPDATE_PATH'),
  { method: 'PUT', token, body: order },
);

export const deleteOrder = (orderId, token) => orderRequest(
  `${operationPath('REACT_APP_ORDER_DELETE_PATH')}/${encodeURIComponent(orderId)}`,
  { method: 'GET', token },
);

import { endpointPath } from '../hooks/useAxios';

const operationPath = (variableName) => endpointPath(variableName);
const orderConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_ORDERS_API_BASE_URL'),
});

export async function getOrders(API, { pageNumber = 1, pageSize = 12, signal } = {}) {
  const config = orderConfig({
    params: { pageNumber, pageSize },
    signal,
  });
  const { data } = await API.get(operationPath('REACT_APP_ORDERS_PATH'), config);

  return data;
}

export async function getOrder(API, orderId, signal) {
  const { data } = await API.get(`${operationPath('REACT_APP_ORDER_SEARCH_PATH')}/${encodeURIComponent(orderId)}`, orderConfig({ signal }));
  return data;
}

export async function createOrder(API, order) {
  const { data } = await API.post(operationPath('REACT_APP_ORDER_CREATE_PATH'), order, orderConfig());
  return data;
}

export async function updateOrder(API, order) {
  const { data } = await API.put(operationPath('REACT_APP_ORDER_UPDATE_PATH'), order, orderConfig());
  return data;
}

export async function deleteOrder(API, orderId) {
  const { data } = await API.get(`${operationPath('REACT_APP_ORDER_DELETE_PATH')}/${encodeURIComponent(orderId)}`, orderConfig());
  return data;
}

export async function cancelOrder(API, orderId) {
  const path = `${operationPath('REACT_APP_ORDERS_PATH')}/${encodeURIComponent(orderId)}/cancel`;
  const { data } = await API.post(path, null, orderConfig());
  if (data?.success === false) throw new Error(data.error || 'The order could not be cancelled.');
  return data;
}

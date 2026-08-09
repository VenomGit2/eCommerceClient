import { endpointPath } from '../hooks/useAxios';

const orderConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_ORDERS_API_BASE_URL'),
});

export async function getCart(API, signal) {
  const { data } = await API.get(endpointPath('REACT_APP_ORDERS_PATH'), orderConfig({ signal }));
  return data;
}

export async function createCart(API, cart) {
  const { data } = await API.post(endpointPath('REACT_APP_ORDER_CREATE_PATH'), cart, orderConfig());
  return data;
}

export async function updateCart(API, cart) {
  const { data } = await API.put(endpointPath('REACT_APP_ORDER_UPDATE_PATH'), cart, orderConfig());
  return data;
}

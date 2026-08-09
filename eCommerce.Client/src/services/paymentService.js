import { endpointPath } from '../hooks/useAxios';

export async function submitPayment(API, payment) {
  const { data } = await API.post(endpointPath('REACT_APP_PAYMENTS_PATH'), payment);
  return data;
}

import { apiRequest, endpointPath } from './apiClient';
export const submitPayment = (payment, token) => apiRequest(endpointPath('REACT_APP_PAYMENTS_PATH'), { method: 'POST', body: payment, token });


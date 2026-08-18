import { endpointPath } from '../hooks/useAxios';

const paymentConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_ORDERS_API_BASE_URL'),
});

export async function createRazorpayCheckout(API, orderId) {
  const path = `${endpointPath('REACT_APP_PAYMENTS_PATH')}/orders/${encodeURIComponent(orderId)}`;
  const { data } = await API.post(path, null, paymentConfig());
  return data?.data;
}

export async function verifyRazorpayCheckout(API, payment) {
  const path = `${endpointPath('REACT_APP_PAYMENTS_PATH')}/verify`;
  const { data } = await API.post(path, payment, paymentConfig());
  return data;
}

export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded.'));
    document.body.appendChild(script);
  });
}

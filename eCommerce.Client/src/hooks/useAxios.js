import axios from 'axios';
import { clearOidcSession, getOidcAccessToken } from './useOidc';

let axiosInstance;
let activeRequests = 0;
const loadingListeners = new Set();
let redirectingToLogin = false;

function navigateToLogin(loginUrl) {
  window.history.replaceState(window.history.state, document.title, loginUrl);
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
}

export function endpointPath(variableName, suffix = '') {
  const environment = {
    REACT_APP_AUTH_LOGIN_PATH: process.env.REACT_APP_AUTH_LOGIN_PATH,
    REACT_APP_AUTH_REGISTER_PATH: process.env.REACT_APP_AUTH_REGISTER_PATH,
    REACT_APP_PRODUCTS_API_BASE_URL: process.env.REACT_APP_PRODUCTS_API_BASE_URL,
    REACT_APP_ORDERS_API_BASE_URL: process.env.REACT_APP_ORDERS_API_BASE_URL,
    REACT_APP_PRODUCTS_PATH: process.env.REACT_APP_PRODUCTS_PATH,
    REACT_APP_PRODUCT_SEARCH_PATH: process.env.REACT_APP_PRODUCT_SEARCH_PATH,
    REACT_APP_PRODUCT_ADD_PATH: process.env.REACT_APP_PRODUCT_ADD_PATH,
    REACT_APP_PRODUCT_UPDATE_PATH: process.env.REACT_APP_PRODUCT_UPDATE_PATH,
    REACT_APP_PRODUCT_DELETE_PATH: process.env.REACT_APP_PRODUCT_DELETE_PATH,
    REACT_APP_ORDERS_PATH: process.env.REACT_APP_ORDERS_PATH,
    REACT_APP_ORDER_SEARCH_PATH: process.env.REACT_APP_ORDER_SEARCH_PATH,
    REACT_APP_ORDER_CREATE_PATH: process.env.REACT_APP_ORDER_CREATE_PATH,
    REACT_APP_ORDER_UPDATE_PATH: process.env.REACT_APP_ORDER_UPDATE_PATH,
    REACT_APP_ORDER_DELETE_PATH: process.env.REACT_APP_ORDER_DELETE_PATH,
    REACT_APP_PAYMENTS_PATH: process.env.REACT_APP_PAYMENTS_PATH,
    REACT_APP_REVIEWS_PATH: process.env.REACT_APP_REVIEWS_PATH,
    REACT_APP_USERS_PATH: process.env.REACT_APP_USERS_PATH,
    REACT_APP_WISHLIST_PATH: process.env.REACT_APP_WISHLIST_PATH,
  };
  const value = environment[variableName];
  if (!value) throw new Error(`${variableName} is not configured.`);
  return `${value}${suffix}`;
}

function updateLoading(change, hideLoader) {
  if (hideLoader) return;
  activeRequests = Math.max(0, activeRequests + change);
  loadingListeners.forEach((listener) => listener(activeRequests > 0));
}

export function subscribeToApiLoading(listener) {
  loadingListeners.add(listener);
  listener(activeRequests > 0);
  return () => loadingListeners.delete(listener);
}

function createAxiosInstance() {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  if (!baseURL) throw new Error('REACT_APP_API_BASE_URL is not configured.');
  const ngrokHeaders = baseURL.includes('.ngrok-free.')
    ? { 'ngrok-skip-browser-warning': 'true' }
    : {};

  const instance = axios.create({
    baseURL,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...ngrokHeaders,
    },
  });

  instance.interceptors.request.use(async (config) => {
    updateLoading(1, config.hideLoader);
    try {
      if (config.data instanceof FormData) {
        if (typeof config.headers.delete === 'function') {
          config.headers.delete('Content-Type');
        } else {
          delete config.headers['Content-Type'];
        }
      }

      const accessToken = await getOidcAccessToken();
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    } catch (error) {
      updateLoading(-1, config.hideLoader);
      throw error;
    }
  }, (error) => {
    updateLoading(-1, error.config?.hideLoader);
    return Promise.reject(error);
  });

  instance.interceptors.response.use(
    (response) => {
      updateLoading(-1, response.config.hideLoader);
      return response;
    },
    (error) => {
      updateLoading(-1, error.config?.hideLoader);
      if (axios.isCancel(error)) {
        const abortError = new Error('The request was cancelled.');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
      }

      if (error.response?.status === 401 && !redirectingToLogin && window.location.pathname !== '/login') {
        redirectingToLogin = true;
        const returnPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const loginUrl = `/login?reason=login-required&returnTo=${encodeURIComponent(returnPath)}`;
        const unauthorizedMessage = error.response?.data?.message
          || error.response?.data?.title
          || 'Your session has expired or login is required. Please sign in to continue.';
        sessionStorage.setItem('authenticationMessage', unauthorizedMessage);
        clearOidcSession()
          .catch(() => {})
          .finally(() => {
            navigateToLogin(loginUrl);
            redirectingToLogin = false;
          });
      }

      const apiError = new Error(
        error.response?.data?.message
        || error.response?.data?.title
        || (typeof error.response?.data === 'string' ? error.response.data : '')
        || error.message
        || 'The request could not be completed.',
      );
      apiError.status = error.response?.status;
      apiError.details = error.response?.data;
      return Promise.reject(apiError);
    },
  );

  return instance;
}

export default function useAxios() {
  if (!axiosInstance) axiosInstance = createAxiosInstance();
  return axiosInstance;
}

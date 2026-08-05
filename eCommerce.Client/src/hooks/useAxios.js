import axios from 'axios';

let axiosInstance;

function createAxiosInstance() {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  if (!baseURL) throw new Error('REACT_APP_API_BASE_URL is not configured.');

  const instance = axios.create({
    baseURL,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    // Add the JWT Authorization header here when the backend token contract is finalized.
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error)) {
        const abortError = new Error('The request was cancelled.');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
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

export function getAxiosInstance() {
  if (!axiosInstance) axiosInstance = createAxiosInstance();
  return axiosInstance;
}

export default function useAxios() {
  return getAxiosInstance();
}


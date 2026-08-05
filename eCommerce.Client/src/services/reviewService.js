import { apiRequest, endpointPath } from './apiClient';
const path = () => endpointPath('REACT_APP_REVIEWS_PATH');
export const getReviews = (signal) => apiRequest(path(), { signal });
export const createReview = (review, token) => apiRequest(path(), { method: 'POST', body: review, token });


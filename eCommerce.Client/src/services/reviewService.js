import { endpointPath } from '../hooks/useAxios';
const path = () => endpointPath('REACT_APP_REVIEWS_PATH');
export async function getReviews(API, signal) {
  const { data } = await API.get(path(), { signal });
  return data;
}
export async function createReview(API, review) {
  const { data } = await API.post(path(), review);
  return data;
}

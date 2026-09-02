import { endpointPath } from '../hooks/useAxios';
import { getCollection } from '../utils/apiResponse';

const path = () => endpointPath('REACT_APP_REVIEWS_PATH');

export const mapReview = (review) => ({
  id: review.reviewId ?? review.id ?? review.commentId,
  productId: String(review.productId ?? review.productID ?? ''),
  author: review.userName ?? review.author ?? review.userEmail ?? review.user ?? 'Anonymous',
  rating: Number(review.rating ?? review.stars ?? 0),
  comment: review.comment ?? review.text ?? review.body ?? '',
  createdAt: review.createdAt ?? review.createdOn ?? review.date ?? null,
});

export async function getReviews(API, signal) {
  const { data } = await API.get(path(), { signal });
  return data;
}

export async function getProductReviews(API, productId, signal) {
  const data = await getReviews(API, signal);
  const productKey = String(productId);
  return getCollection(data)
    .map(mapReview)
    .filter((review) => review.productId === productKey)
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
}

export async function createReview(API, review) {
  const payload = {
    productId: review.productId,
    productID: review.productId,
    rating: review.rating,
    comment: review.comment,
    title: review.title ?? '',
  };
  const { data } = await API.post(path(), payload);
  return data;
}

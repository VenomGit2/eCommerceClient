import { endpointPath } from '../hooks/useAxios';
import { getCollection } from '../utils/apiResponse';

const path = () => endpointPath('REACT_APP_REVIEWS_PATH');
const reviewConfig = (config = {}) => ({
  ...config,
  baseURL: endpointPath('REACT_APP_REVIEWS_API_BASE_URL'),
});

export const mapReview = (review) => ({
  id: review.reviewId ?? review.id ?? review.commentId,
  productId: String(review.productId ?? review.productID ?? ''),
  author: review.userName ?? review.author ?? review.userEmail ?? review.user ?? 'Anonymous',
  rating: Number(review.rating ?? review.stars ?? 0),
  comment: review.comment ?? review.text ?? review.body ?? '',
  title: review.title ?? '',
  createdAt: review.createdAt ?? review.createdOn ?? review.date ?? null,
  userId: review.userId ?? review.userID ?? null,
  isVerifiedPurchase: Boolean(review.isVerifiedPurchase ?? review.verifiedPurchase ?? false),
  helpfulCount: Number(review.helpfulCount ?? review.helpful ?? 0),
  notHelpfulCount: Number(review.notHelpfulCount ?? review.notHelpful ?? 0),
});

export async function getReviews(API, signal) {
  const { data } = await API.get(path(), reviewConfig({ signal }));
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
  const { data } = await API.post(path(), payload, reviewConfig());
  return data;
}

export async function updateReview(API, reviewId, updates) {
  const payload = {
    reviewId,
    rating: updates.rating,
    comment: updates.comment,
    title: updates.title ?? '',
  };
  const { data } = await API.put(`${path()}/${reviewId}`, payload, reviewConfig());
  return data;
}

export async function deleteReview(API, reviewId) {
  await API.delete(`${path()}/${reviewId}`, reviewConfig());
}

export async function markReviewHelpful(API, reviewId) {
  const { data } = await API.post(`${path()}/${reviewId}/helpful`, null, reviewConfig());
  return data;
}

export async function markReviewNotHelpful(API, reviewId) {
  const { data } = await API.post(`${path()}/${reviewId}/not-helpful`, null, reviewConfig());
  return data;
}

import { endpointPath } from '../hooks/useAxios';
import { mapProduct } from './productService';

const aiPath = (suffix) => endpointPath('REACT_APP_AI_PATH', suffix);

// Model calls can take several seconds, so they must not trigger the full-screen loader.
const aiConfig = (config = {}) => ({ ...config, hideLoader: true });

const mapRecommendation = (item) => ({ product: mapProduct(item.product), reason: item.reason });

export async function aiSearchProducts(API, query, signal) {
  const { data: response } = await API.post(aiPath('search'), { query }, aiConfig({ signal }));
  const data = response?.data ?? {};
  return {
    note: data.note ?? '',
    products: (data.results ?? []).map(mapProduct),
  };
}

export async function sendAiChatMessage(API, { message, history, support = false }, signal) {
  const path = aiPath(support ? 'support/chat' : 'chat');
  const { data: response } = await API.post(path, { message, history }, aiConfig({ signal }));
  return response?.data?.reply ?? '';
}

export async function aiCompareProducts(API, productIds, signal) {
  const { data: response } = await API.post(aiPath('compare'), { productIds }, aiConfig({ signal }));
  const data = response?.data ?? {};
  return {
    analysis: data.analysis ?? '',
    products: (data.products ?? []).map(mapProduct),
  };
}

export async function getAiReviewSummary(API, productId, signal) {
  const { data: response } = await API.get(
    aiPath(`reviews/${encodeURIComponent(productId)}/summary`),
    aiConfig({ signal }),
  );
  return response?.data ?? null;
}

export async function getAiRecommendations(API, signal) {
  const { data: response } = await API.get(aiPath('recommendations'), aiConfig({ signal }));
  const data = response?.data ?? {};
  return {
    headline: data.headline ?? '',
    personalized: Boolean(data.personalized),
    items: (data.items ?? []).map(mapRecommendation),
  };
}

export async function generateProductDescription(API, { productName, category }, signal) {
  let response;
  try {
    ({ data: response } = await API.post(
      aiPath('products/description'),
      { productName, category },
      aiConfig({ signal }),
    ));
  } catch (error) {
    throw new Error(error.details?.error || error.message || 'Could not generate a description.');
  }
  const description = response?.data?.description?.trim();
  if (!description) throw new Error('Could not generate a description. Please try again.');
  return description;
}

export async function getAiCartRecoveryMessage(API, items, signal) {
  const products = items.slice(0, 8).map((item) => ({ name: item.name, quantity: item.quantity }));
  const message = `Write one warm, concise sentence inviting a shopper back to their saved cart. Mention at most two of these products by name. Do not invent discounts, prices, stock, urgency, or product features. Cart products: ${JSON.stringify(products)}`;
  const reply = await sendAiChatMessage(API, { message, history: [] }, signal);
  return reply.trim() || 'Welcome back. Your cart is saved and ready when you are.';
}

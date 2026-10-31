import { aiSearchProducts, generateProductDescription, getAiRecommendations, sendAiChatMessage } from './aiService';

describe('aiService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      REACT_APP_AI_PATH: 'api/ai/',
      REACT_APP_PRODUCTS_API_BASE_URL: 'https://products.example/',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const card = { productId: 'p1', productName: 'Laptop', unitPrice: 900, imageUrl: null, rating: 4.5, reviewCount: 2 };

  it('searches through the AI path without the global loader and maps products', async () => {
    const API = { post: jest.fn().mockResolvedValue({ data: { data: { results: [card], note: 'relaxed' } } }) };

    const result = await aiSearchProducts(API, 'cheap laptop');

    expect(API.post).toHaveBeenCalledWith('api/ai/search', { query: 'cheap laptop' }, { signal: undefined, hideLoader: true });
    expect(result.note).toBe('relaxed');
    expect(result.products[0]).toMatchObject({ id: 'p1', name: 'Laptop', price: 900 });
  });

  it('uses the support endpoint only when requested', async () => {
    const API = { post: jest.fn().mockResolvedValue({ data: { data: { reply: 'Shipped.' } } }) };

    const reply = await sendAiChatMessage(API, { message: 'Where is it?', history: [], support: true });

    expect(API.post.mock.calls[0][0]).toBe('api/ai/support/chat');
    expect(reply).toBe('Shipped.');
  });

  it('maps recommendations with their reasons', async () => {
    const API = { get: jest.fn().mockResolvedValue({ data: { data: { headline: 'Picked for you', personalized: true, items: [{ product: card, reason: 'Popular' }] } } }) };

    const result = await getAiRecommendations(API);

    expect(result.personalized).toBe(true);
    expect(result.items[0]).toMatchObject({ reason: 'Popular', product: { id: 'p1' } });
  });

  it('requests an editable product description from the authenticated AI endpoint', async () => {
    const API = { post: jest.fn().mockResolvedValue({ data: { data: { description: 'A compact desk lamp.' } } }) };

    const description = await generateProductDescription(API, { productName: 'Desk lamp', category: 'Furniture' });

    expect(API.post).toHaveBeenCalledWith(
      'api/ai/products/description',
      { productName: 'Desk lamp', category: 'Furniture' },
      { signal: undefined, hideLoader: true },
    );
    expect(description).toBe('A compact desk lamp.');
  });
});

import { createCart, updateCart } from './cartService';

describe('cartService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      REACT_APP_ORDERS_API_BASE_URL: 'https://orders.example/',
      REACT_APP_ORDER_CREATE_PATH: 'api/orders/createorder',
      REACT_APP_ORDER_UPDATE_PATH: 'api/orders/updateorder',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses API.post when creating a cart', async () => {
    const cart = { items: [{ id: 1, quantity: 1 }] };
    const API = { post: jest.fn().mockResolvedValue({ data: { id: 1 } }) };

    await createCart(API, cart);

    expect(API.post).toHaveBeenCalledWith('api/orders/createorder', cart, {
      baseURL: 'https://orders.example/',
    });
  });

  it('uses API.put when updating an existing cart', async () => {
    const cart = { items: [{ id: 1, quantity: 2 }] };
    const API = { put: jest.fn().mockResolvedValue({ data: { id: 1 } }) };

    await updateCart(API, cart);

    expect(API.put).toHaveBeenCalledWith('api/orders/updateorder', cart, {
      baseURL: 'https://orders.example/',
    });
  });
});

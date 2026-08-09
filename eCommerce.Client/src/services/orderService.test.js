import { createOrder } from './orderService';

describe('createOrder', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      REACT_APP_ORDERS_API_BASE_URL: 'https://orders.example/',
      REACT_APP_ORDER_CREATE_PATH: 'api/orders/createorder',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('posts the order payload through the supplied Axios instance', async () => {
    const order = { shippingAddress: '123 Main Street', items: [{ id: 1, quantity: 2 }] };
    const API = { post: jest.fn().mockResolvedValue({ data: { id: 42 } }) };

    await createOrder(API, order);

    expect(API.post).toHaveBeenCalledWith('api/orders/createorder', order, {
      baseURL: 'https://orders.example/',
    });
  });
});

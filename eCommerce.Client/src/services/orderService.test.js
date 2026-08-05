import { apiRequest, endpointPath } from './apiClient';
import { createOrder } from './orderService';

jest.mock('./apiClient', () => ({
  apiRequest: jest.fn(),
  endpointPath: jest.fn((variableName) => ({
    REACT_APP_ORDERS_API_BASE_URL: 'https://orders.example/',
    REACT_APP_ORDER_CREATE_PATH: 'api/orders/createorder',
  }[variableName])),
}));

describe('createOrder', () => {
  beforeEach(() => {
    endpointPath.mockImplementation((variableName) => ({
      REACT_APP_ORDERS_API_BASE_URL: 'https://orders.example/',
      REACT_APP_ORDER_CREATE_PATH: 'api/orders/createorder',
    }[variableName]));
  });

  it('posts the order payload to the create endpoint', async () => {
    const order = { shippingAddress: '123 Main Street', items: [{ id: 1, quantity: 2 }] };
    apiRequest.mockResolvedValueOnce({ id: 42 });

    await createOrder(order, 'access-token');

    expect(apiRequest).toHaveBeenCalledWith('api/orders/createorder', {
      method: 'POST',
      token: 'access-token',
      body: order,
      baseURL: 'https://orders.example/',
    });
  });
});

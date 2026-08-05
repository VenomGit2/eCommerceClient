import { apiRequest, endpointPath } from './apiClient';
import { createCart, updateCart } from './cartService';

jest.mock('./apiClient', () => ({
  apiRequest: jest.fn(),
  endpointPath: jest.fn(),
}));

describe('cartService', () => {
  beforeEach(() => {
    endpointPath.mockImplementation((variableName) => ({
      REACT_APP_ORDERS_API_BASE_URL: 'https://orders.example/',
      REACT_APP_ORDER_CREATE_PATH: 'api/orders/createorder',
      REACT_APP_ORDER_UPDATE_PATH: 'api/orders/updateorder',
    }[variableName]));
  });

  it('uses POST when creating a cart', async () => {
    const cart = { items: [{ id: 1, quantity: 1 }] };
    await createCart(cart, 'access-token');
    expect(apiRequest).toHaveBeenCalledWith('api/orders/createorder', {
      method: 'POST', body: cart, token: 'access-token', baseURL: 'https://orders.example/',
    });
  });

  it('uses PUT when updating an existing cart', async () => {
    const cart = { items: [{ id: 1, quantity: 2 }] };
    await updateCart(cart, 'access-token');
    expect(apiRequest).toHaveBeenCalledWith('api/orders/updateorder', {
      method: 'PUT', body: cart, token: 'access-token', baseURL: 'https://orders.example/',
    });
  });
});

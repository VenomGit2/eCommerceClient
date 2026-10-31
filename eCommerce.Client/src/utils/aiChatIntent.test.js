import { isAccountFollowUp, isPersonalAccountRequest, isShoppingRequest } from './aiChatIntent';

test('recognizes personal requests without gating general shopping questions', () => {
  expect(isPersonalAccountRequest('Where is my latest order?')).toBe(true);
  expect(isPersonalAccountRequest('Check my payment status')).toBe(true);
  expect(isPersonalAccountRequest('Show orders')).toBe(true);
  expect(isPersonalAccountRequest('What payment methods are available?')).toBe(false);
  expect(isPersonalAccountRequest('How do I track an order?')).toBe(false);
  expect(isShoppingRequest('Show me laptops in stock')).toBe(true);
  expect(isAccountFollowUp('Where is it now?')).toBe(true);
  expect(isAccountFollowUp('What products are available?')).toBe(false);
});

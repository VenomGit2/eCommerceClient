import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AiMessageContent from './AiMessageContent';

test('renders an order table as readable detail cards without losing surrounding text', () => {
  const reply = [
    'Here is your latest order:',
    '',
    '| Order ID | Total | Payment | Items |',
    '|----------|-------|---------|-------|',
    '| 1e36f225 | INR 1,299.99 | Paid | 1 × Apple iPhone 15 Pro Max |',
    '',
    'Next step – You will receive a tracking number once it ships.',
  ].join('\n');

  render(<AiMessageContent content={reply} />);

  const card = screen.getByRole('region', { name: 'Details 1' });
  expect(within(card).getByText('Order ID')).toBeInTheDocument();
  expect(within(card).getByText('1e36f225')).toBeInTheDocument();
  expect(within(card).getByText('INR 1,299.99')).toBeInTheDocument();
  expect(within(card).getByText('1 × Apple iPhone 15 Pro Max')).toBeInTheDocument();
  expect(screen.getByText('Here is your latest order:')).toBeInTheDocument();
  expect(screen.getByText(/You will receive a tracking number/)).toBeInTheDocument();
  expect(screen.queryByText(/\|----------\|/)).not.toBeInTheDocument();
});

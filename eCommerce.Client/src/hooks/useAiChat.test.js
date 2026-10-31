import { act, renderHook } from '@testing-library/react';
import useAiChat from './useAiChat';
import { sendAiChatMessage } from '../services/aiService';

jest.mock('./useAxios', () => jest.fn(() => ({})));
jest.mock('../services/aiService', () => ({ sendAiChatMessage: jest.fn() }));

beforeEach(() => sendAiChatMessage.mockReset());

test('asks a guest to sign in for personal order details without calling the API', async () => {
  const { result } = renderHook(() => useAiChat({ isAuthenticated: false }));

  await act(async () => result.current.send('Where is my latest order?'));

  expect(sendAiChatMessage).not.toHaveBeenCalled();
  expect(result.current.messages[1]).toMatchObject({ role: 'assistant', action: 'sign-in' });
});

test('uses one conversation and routes signed-in order questions to support', async () => {
  sendAiChatMessage.mockResolvedValueOnce('Here are some laptops.').mockResolvedValueOnce('Your order is reserved.');
  const { result } = renderHook(() => useAiChat({ isAuthenticated: true }));

  await act(async () => result.current.send('Find a laptop'));
  await act(async () => result.current.send('Where is my latest order?'));

  expect(sendAiChatMessage.mock.calls[0][1].support).toBe(false);
  expect(sendAiChatMessage.mock.calls[1][1].support).toBe(true);
  expect(sendAiChatMessage.mock.calls[1][1].history).toHaveLength(2);
  expect(result.current.messages).toHaveLength(4);
});

test('sends the selected assistant reply as context while showing only the follow-up as typed text', async () => {
  sendAiChatMessage.mockResolvedValueOnce('The TV is in stock.').mockResolvedValueOnce('It ships tomorrow.');
  const { result } = renderHook(() => useAiChat({ isAuthenticated: false }));

  await act(async () => result.current.send('Is the TV in stock?'));
  await act(async () => result.current.send('When does it ship?', result.current.messages[1]));

  expect(sendAiChatMessage.mock.calls[1][1].message).toContain('The TV is in stock.');
  expect(sendAiChatMessage.mock.calls[1][1].message).toContain('When does it ship?');
  expect(sendAiChatMessage.mock.calls[1][1].message).toBe('> The TV is in stock.\n\nWhen does it ship?');
  expect(result.current.messages[2]).toMatchObject({
    role: 'user',
    content: 'When does it ship?',
    replyTo: 'The TV is in stock.',
  });
});

test('keeps the latest question in its original language when replying to an older answer', async () => {
  sendAiChatMessage.mockResolvedValueOnce('The TV is in stock.').mockResolvedValueOnce('यह कल भेजा जाएगा।');
  const { result } = renderHook(() => useAiChat({ isAuthenticated: false }));

  await act(async () => result.current.send('Is the TV in stock?'));
  await act(async () => result.current.send('यह कब भेजा जाएगा?', result.current.messages[1]));

  expect(sendAiChatMessage.mock.calls[1][1].message).toBe('> The TV is in stock.\n\nयह कब भेजा जाएगा?');
});

test('clears personal conversation history when the user signs out', async () => {
  sendAiChatMessage.mockResolvedValue('Your order is reserved.');
  const { result, rerender } = renderHook(
    ({ isAuthenticated }) => useAiChat({ isAuthenticated }),
    { initialProps: { isAuthenticated: true } },
  );

  await act(async () => result.current.send('Where is my latest order?'));
  rerender({ isAuthenticated: false });

  expect(result.current.messages).toEqual([]);
});

test('ignores a reply that finishes after starting a new chat', async () => {
  let finishReply;
  sendAiChatMessage.mockImplementation(() => new Promise((resolve) => { finishReply = resolve; }));
  const { result } = renderHook(() => useAiChat({ isAuthenticated: false }));

  let pendingReply;
  act(() => { pendingReply = result.current.send('Find a laptop'); });
  act(() => result.current.reset());
  await act(async () => { finishReply('A late reply'); await pendingReply; });

  expect(result.current.messages).toEqual([]);
  expect(result.current.sending).toBe(false);
});

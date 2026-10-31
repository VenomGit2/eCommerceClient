import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AiChatWidget from './AiChatWidget';
import useAiChat from '../../hooks/useAiChat';
import useAuth from '../../hooks/useAuth';

jest.mock('../../hooks/useAiChat');
jest.mock('../../hooks/useAuth');

test('moves the chat, copies a reply, and starts a new conversation', async () => {
  const reset = jest.fn();
  const send = jest.fn().mockResolvedValue(true);
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  Element.prototype.scrollTo = jest.fn();
  window.requestAnimationFrame = (callback) => callback();
  useAuth.mockReturnValue({ isAuthenticated: false, isAdmin: false });
  useAiChat.mockReturnValue({
    messages: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hello back' },
    ],
    sending: false,
    error: '',
    send,
    reset,
  });

  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AiChatWidget /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Open Danny chat' }));
  expect(screen.getByRole('dialog', { name: 'Danny chat' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Move chat right' }));

  expect(screen.getByRole('dialog')).toHaveClass('ai-chat--right');
  expect(screen.queryByRole('button', { name: 'Move chat to bottom' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Expand chat' }));
  expect(screen.getByRole('dialog')).toHaveClass('ai-chat--center');
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Move chat left' }));
  expect(screen.getByRole('dialog')).toHaveClass('ai-chat--left');

  fireEvent.click(screen.getByRole('button', { name: 'Copy response' }));
  await waitFor(() => {
    expect(writeText).toHaveBeenCalledWith('Hello back');
    expect(screen.getByRole('button', { name: 'Response copied' })).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: 'Reply to this response' }));
  expect(screen.getByLabelText('Selected reply')).toHaveTextContent('Hello back');
  fireEvent.change(screen.getByLabelText('Message Danny'), { target: { value: 'What do you mean?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(send).toHaveBeenCalledWith('What do you mean?', { content: 'Hello back', support: undefined });
  expect(screen.queryByLabelText('Selected reply')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Reply to this response' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel reply' }));
  expect(screen.queryByLabelText('Selected reply')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Start a new chat' }));
  expect(reset).toHaveBeenCalledTimes(1);

  fireEvent.pointerDown(screen.getByLabelText('Message Danny'));
  expect(screen.getByRole('dialog', { name: 'Danny chat' })).toBeInTheDocument();
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole('dialog', { name: 'Danny chat' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Open Danny chat' })).toBeInTheDocument();
});

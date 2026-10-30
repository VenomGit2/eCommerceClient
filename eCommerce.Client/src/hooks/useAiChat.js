import { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from './useAxios';
import { sendAiChatMessage } from '../services/aiService';

export default function useAiChat({ support = false } = {}) {
  const API = useAxios();
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const send = useCallback(async (text) => {
    const message = text.trim();
    if (!message || sending) return false;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setSending(true);
    setError('');

    controllerRef.current = new AbortController();
    try {
      const reply = await sendAiChatMessage(API, { message, history, support }, controllerRef.current.signal);
      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
      return true;
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.status === 429
          ? 'You are sending messages too quickly. Please wait a moment.'
          : requestError.message || 'The assistant could not answer. Please try again.');
      }
      return false;
    } finally {
      setSending(false);
    }
  }, [API, messages, sending, support]);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setMessages([]);
    setError('');
    setSending(false);
  }, []);

  return { messages, sending, error, send, reset };
}

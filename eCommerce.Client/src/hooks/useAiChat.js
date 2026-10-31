import { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from './useAxios';
import { sendAiChatMessage } from '../services/aiService';
import { isAccountFollowUp, isPersonalAccountRequest } from '../utils/aiChatIntent';

const SIGN_IN_MESSAGE = 'Please sign in to see your personal order, delivery, or payment details.';
const REPLY_QUOTE_LIMIT = 700;

const withReplyContext = (content, replyTo) => {
  if (!replyTo?.content) return content;
  const quote = replyTo.content.trim().slice(0, REPLY_QUOTE_LIMIT);
  return `${quote.split(/\r?\n/).map((line) => `> ${line}`).join('\n')}\n\n${content}`;
};

export default function useAiChat({ isAuthenticated = false } = {}) {
  const API = useAxios();
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);
  const requestVersionRef = useRef(0);
  const topicRef = useRef('shopping');
  const wasAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => () => {
    requestVersionRef.current += 1;
    controllerRef.current?.abort();
  }, []);

  const send = useCallback(async (text, replyTo = null) => {
    const message = text.trim();
    if (!message || sending) return false;

    const support = isPersonalAccountRequest(message)
      || Boolean(replyTo?.support)
      || (topicRef.current === 'support' && isAccountFollowUp(message));
    topicRef.current = support ? 'support' : 'shopping';
    setError('');

    if (support && !isAuthenticated) {
      setMessages((current) => [
        ...current,
        { role: 'user', content: message, replyTo: replyTo?.content, local: true },
        { role: 'assistant', content: SIGN_IN_MESSAGE, action: 'sign-in', local: true },
      ]);
      return true;
    }

    const history = messages.filter((turn) => !turn.local).map((turn) => ({
      role: turn.role,
      content: turn.role === 'user' ? withReplyContext(turn.content, turn.replyTo && { content: turn.replyTo }) : turn.content,
    }));
    setMessages((current) => [...current, { role: 'user', content: message, replyTo: replyTo?.content, support }]);
    setSending(true);

    const requestVersion = ++requestVersionRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const reply = await sendAiChatMessage(API, { message: withReplyContext(message, replyTo), history, support }, controller.signal);
      if (requestVersion !== requestVersionRef.current) return false;
      setMessages((current) => [...current, { role: 'assistant', content: reply, support }]);
      return true;
    } catch (requestError) {
      if (requestVersion === requestVersionRef.current && requestError.name !== 'AbortError') {
        setError(requestError.status === 429
          ? 'You are sending messages too quickly. Please wait a moment.'
          : requestError.message || 'The assistant could not answer. Please try again.');
      }
      return false;
    } finally {
      if (requestVersion === requestVersionRef.current) {
        controllerRef.current = null;
        setSending(false);
      }
    }
  }, [API, isAuthenticated, messages, sending]);

  const reset = useCallback(() => {
    requestVersionRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setMessages([]);
    setError('');
    setSending(false);
    topicRef.current = 'shopping';
  }, []);

  useEffect(() => {
    if (wasAuthenticatedRef.current && !isAuthenticated) reset();
    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, reset]);

  return { messages, sending, error, send, reset };
}

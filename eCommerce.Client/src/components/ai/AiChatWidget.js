import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAiChat from '../../hooks/useAiChat';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const SHOP_HINT = 'Ask about products, stock, reviews or recommendations.';
const SUPPORT_HINT = 'Ask about your orders, delivery status or payments.';

export default function AiChatWidget() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('shop');
  const [draft, setDraft] = useState('');
  const shopChat = useAiChat();
  const supportChat = useAiChat({ support: true });
  const { reset: resetSupport } = supportChat;
  const listRef = useRef(null);

  const isSupport = mode === 'support' && isAuthenticated;
  const chat = isSupport ? supportChat : shopChat;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.messages, chat.sending, open]);

  useEffect(() => {
    if (!isAuthenticated) resetSupport();
  }, [isAuthenticated, resetSupport]);

  if (isAdmin) return null;

  const submit = async (event) => {
    event.preventDefault();
    const text = draft;
    setDraft('');
    await chat.send(text);
  };

  if (!open) {
    return (
      <button type="button" className="ai-chat__launcher" onClick={() => setOpen(true)} aria-label="Open shopping assistant">
        <span aria-hidden="true">AI</span> Ask us
      </button>
    );
  }

  return (
    <section className="ai-chat" role="dialog" aria-label="Shopping assistant">
      <header className="ai-chat__header">
        <div className="ai-chat__tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!isSupport} className={!isSupport ? 'is-active' : ''} onClick={() => setMode('shop')}>Shop help</button>
          <button type="button" role="tab" aria-selected={isSupport} className={isSupport ? 'is-active' : ''} onClick={() => setMode('support')}>Order support</button>
        </div>
        <button type="button" className="ai-chat__close" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
      </header>

      {mode === 'support' && !isAuthenticated
        ? <div className="ai-chat__body ai-chat__body--notice">
          <p>Please sign in to check your orders and payments.</p>
          <Link className="button button--primary" to={ROUTES.login} onClick={() => setOpen(false)}>Sign in</Link>
        </div>
        : <>
          <div className="ai-chat__body" ref={listRef} aria-live="polite">
            {chat.messages.length === 0 && <p className="ai-chat__hint">{isSupport ? SUPPORT_HINT : SHOP_HINT}</p>}
            {chat.messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`ai-chat__message ai-chat__message--${message.role}`}>{message.content}</p>
            ))}
            {chat.sending && <p className="ai-chat__message ai-chat__message--assistant ai-chat__typing">Thinking…</p>}
            {chat.error && <p className="field-error" role="alert">{chat.error}</p>}
          </div>
          <form className="ai-chat__form" onSubmit={submit}>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={isSupport ? 'Where is my order?' : 'Find me a laptop under 50000'}
              aria-label="Message"
              maxLength={500}
            />
            <button type="submit" className="button button--primary" disabled={chat.sending || !draft.trim()}>Send</button>
          </form>
        </>}
      <p className="ai-chat__disclaimer">AI answers can be inaccurate. Please check important details.</p>
    </section>
  );
}

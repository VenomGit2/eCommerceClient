import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AiMessageContent from './AiMessageContent';
import useAiChat from '../../hooks/useAiChat';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const CHAT_HINT = 'Ask about products, stock, orders, delivery or payments.';
const SUGGESTIONS = ['Find a laptop for work', 'Where is my latest order?'];
const POSITIONS = ['left', 'right', 'center'];

const POSITION_LABELS = {
  left: 'Move chat left',
  right: 'Move chat right',
  center: 'Expand chat',
};

const replyExcerpt = (content) => {
  const text = content.replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 180)}…` : text;
};

function PositionIcon({ position }) {
  if (position === 'center') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg>;
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      {position === 'left' && <path d="M8 4v16" />}
      {position === 'right' && <path d="M16 4v16" />}
    </svg>
  );
}

export default function AiChatWidget() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copyErrorIndex, setCopyErrorIndex] = useState(null);
  const [position, setPosition] = useState('left');
  const [navigationBottom, setNavigationBottom] = useState(97);
  const chat = useAiChat({ isAuthenticated });
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const composerRef = useRef(null);
  const launcherRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutsidePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [open]);

  useLayoutEffect(() => {
    const navigation = document.querySelector('.site-header');
    if (!navigation) return undefined;

    const updateNavigationBottom = () => {
      setNavigationBottom(Math.max(0, Math.ceil(navigation.getBoundingClientRect().bottom)));
    };

    updateNavigationBottom();
    window.addEventListener('scroll', updateNavigationBottom, { passive: true });
    window.addEventListener('resize', updateNavigationBottom);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateNavigationBottom);
    observer?.observe(navigation);

    return () => {
      window.removeEventListener('scroll', updateNavigationBottom);
      window.removeEventListener('resize', updateNavigationBottom);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.messages, chat.sending, open]);

  useEffect(() => {
    if (!composerRef.current) return;
    composerRef.current.style.height = 'auto';
    composerRef.current.style.height = `${Math.min(composerRef.current.scrollHeight, 112)}px`;
  }, [draft, open]);

  useEffect(() => {
    if (open) composerRef.current?.focus();
  }, [open]);

  if (isAdmin) return null;

  const chatPositionStyle = { '--ai-chat-top': `${navigationBottom}px` };

  const submit = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || chat.sending) return;
    setDraft('');
    setReplyTo(null);
    await chat.send(text, replyTo);
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const closeChat = () => {
    setOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const startNewChat = () => {
    chat.reset();
    setDraft('');
    setReplyTo(null);
    setCopiedIndex(null);
    setCopyErrorIndex(null);
    window.clearTimeout(copyTimeoutRef.current);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const copyResponse = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setCopyErrorIndex(null);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
      setCopyErrorIndex(index);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopyErrorIndex(null), 2000);
    }
  };

  const selectReply = (message) => {
    setReplyTo({ content: message.content, support: message.support });
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  if (!open) {
    return (
      <button ref={launcherRef} type="button" className={`ai-chat__launcher ai-chat__launcher--${position}`} onClick={() => setOpen(true)} aria-label="Open Danny chat">
        <img className="ai-chat__launcher-icon" src="/favicon.svg" alt="" /> Ask Danny
      </button>
    );
  }

  return (
    <>
    {position === 'center' && <div className="ai-chat__backdrop" style={chatPositionStyle} onClick={closeChat} aria-hidden="true" />}
    <section ref={panelRef} className={`ai-chat ai-chat--${position}`} style={chatPositionStyle} role="dialog" aria-label="Danny chat" aria-modal={position === 'center'} onKeyDown={(event) => { if (event.key === 'Escape') { if (replyTo) setReplyTo(null); else closeChat(); } }} data-lenis-prevent>
      <header className="ai-chat__header">
        <div className="ai-chat__identity">
          <img className="ai-chat__identity-icon" src="/favicon.svg" alt="" />
          <div>
            <strong>Danny</strong>
            {/* <span>Products, orders and more</span> */}
          </div>
        </div>
        <div className="ai-chat__header-actions">
          {POSITIONS.filter((choice) => choice !== position).map((choice) => (
            <button type="button" key={choice} className="ai-chat__position" onClick={() => { setPosition(choice); window.requestAnimationFrame(() => composerRef.current?.focus()); }} aria-label={POSITION_LABELS[choice]} title={POSITION_LABELS[choice]}>
              <PositionIcon position={choice} />
            </button>
          ))}
          {chat.messages.length > 0 && (
            <button type="button" className="ai-chat__new" onClick={startNewChat} aria-label="Start a new chat" title="Start a new chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.5-3A7.5 7.5 0 1 1 19 11.5Z" /><path d="M11.5 8.5v6m-3-3h6" /></svg>
              <span>New chat</span>
            </button>
          )}
          <button type="button" className="ai-chat__close" onClick={closeChat} aria-label="Close Danny chat">×</button>
        </div>
      </header>
      <div className="ai-chat__body chat-window-height" ref={listRef} role="log" aria-label="Danny conversation" aria-live="polite" aria-relevant="additions text">
        {chat.messages.length === 0 && (
          <div className="ai-chat__welcome">
            <div className="ai-chat__welcome-intro">
              <h4>How can we help today?</h4>
              {/* <p className="ai-chat__hint">{CHAT_HINT}</p> */}
            </div>
            <div className="ai-chat__suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => chat.send(suggestion)}>{suggestion}</button>
              ))}
            </div>
          </div>
        )}
        {chat.messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`ai-chat__turn ai-chat__turn--${message.role}`}>
            {message.role === 'assistant' && <img className="chat-window-icon chat-window-icon--assistant" src="/favicon.svg" alt="" />}
            <div className={`ai-chat__message chat-window ${message.role === 'user' ? 'chat-window-reverse bg-light ai-chat__message--user' : 'ai-chat__message--assistant'}`}>
              <span className="sr-only">{message.role === 'user' ? 'You: ' : 'Danny: '}</span>
              {message.role === 'user' && message.replyTo && <blockquote className="ai-chat__quoted-message">{replyExcerpt(message.replyTo)}</blockquote>}
              {message.role === 'assistant' ? <AiMessageContent content={message.content} /> : message.content}
              {message.action === 'sign-in' && <Link className="ai-chat__sign-in-link" to={ROUTES.login} onClick={() => setOpen(false)}>Sign in to continue</Link>}
              {message.role === 'assistant' && !message.action && <div className="ai-chat__message-actions">
                <button type="button" className="ai-chat__message-action" onClick={() => selectReply(message)} aria-label="Reply to this response">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 10 4 15l5 5" /><path d="M4 15h10a6 6 0 0 0 6-6V5" /></svg>
                  Reply
                </button>
                <button type="button" className="ai-chat__message-action" onClick={() => copyResponse(message.content, index)} aria-label={copiedIndex === index ? 'Response copied' : copyErrorIndex === index ? 'Could not copy response' : 'Copy response'}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
                  {copiedIndex === index ? 'Copied' : copyErrorIndex === index ? 'Copy failed' : 'Copy'}
                </button>
              </div>}
            </div>
            {message.role === 'user' && (
              <span className="chat-window-icon chat-window-icon--user" aria-hidden="true">
                <svg className="icon icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>
              </span>
            )}
          </div>
        ))}
        {chat.sending && <div className="ai-chat__turn ai-chat__turn--assistant"><img className="chat-window-icon chat-window-icon--assistant" src="/favicon.svg" alt="" /><p className="ai-chat__message ai-chat__message--assistant ai-chat__typing" role="status">Thinking…</p></div>}
        {chat.error && <p className="field-error" role="alert">{chat.error}</p>}
      </div>
      <form className="ai-chat__form" onSubmit={submit}>
        {replyTo && <div className="ai-chat__reply-preview" aria-label="Selected reply">
          <div className="ai-chat__reply-preview-text"><strong>Replying to Danny</strong><span>{replyExcerpt(replyTo.content)}</span></div>
          <button type="button" className="ai-chat__reply-cancel" onClick={() => { setReplyTo(null); composerRef.current?.focus(); }} aria-label="Cancel reply" title="Cancel reply">×</button>
        </div>}
        <label className="sr-only" htmlFor="ai-chat-message">Message Danny</label>
        <div className="ai-chat__composer">
          <textarea
            ref={composerRef}
            id="ai-chat-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder={replyTo ? 'Write a reply…' : 'Ask about products or orders…'}
            maxLength={500}
            rows={1}
          />
          <button type="submit" className="ai-chat__send" disabled={chat.sending || !draft.trim()} aria-label="Send message">
            <svg className="icon icon-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
          </button>
        </div>
      </form>
      <p className="ai-chat__disclaimer">AI answers can be inaccurate. Please check important details.</p>
    </section>
    </>
  );
}

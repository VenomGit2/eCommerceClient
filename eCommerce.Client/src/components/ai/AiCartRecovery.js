import { useEffect, useRef, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { getAiCartRecoveryMessage } from '../../services/aiService';

export default function AiCartRecovery({ items, onDismiss }) {
  const API = useAxios();
  const [message, setMessage] = useState('Welcome back. We kept your cart while you were away.');
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const dismissTimer = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getAiCartRecoveryMessage(API, items, controller.signal)
      .then((reply) => {
        setMessage(reply);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => controller.abort();
  }, [API, items]);

  useEffect(() => () => window.clearTimeout(dismissTimer.current), []);

  const dismiss = () => {
    setClosing(true);
    dismissTimer.current = window.setTimeout(onDismiss, 180);
  };

  return (
    <aside className={`cart-recovery${closing ? ' is-closing' : ''}`} aria-label="Recovered cart reminder">
      <span className="cart-recovery__label"><i aria-hidden="true" /> Cart saved</span>
      <div className="cart-recovery__message" aria-live="polite" aria-busy={loading}>
        {loading
          ? <span className="cart-recovery__thinking">Personalizing<span aria-hidden="true"><i /><i /><i /></span></span>
          : <p key={message}>{message}</p>}
      </div>
      <button type="button" className="cart-recovery__dismiss" onClick={dismiss} aria-label="Dismiss cart reminder">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
    </aside>
  );
}

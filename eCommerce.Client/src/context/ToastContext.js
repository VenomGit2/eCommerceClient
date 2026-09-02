import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Set());

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, { tone = 'success', duration = 4000 } = {}) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);
    const timeout = window.setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      dismissToast(id);
    }, duration);
    timeoutsRef.current.add(timeout);
  }, [dismissToast]);

  useEffect(() => () => timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout)), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.tone}`} key={toast.id} role="status">
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

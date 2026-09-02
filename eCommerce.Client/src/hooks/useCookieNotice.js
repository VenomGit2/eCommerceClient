import { useCallback, useState } from 'react';

const COOKIE_NOTICE_STORAGE_KEY = 'commerce.cookie-notice-dismissed';

function hasDismissedCookieNotice() {
  try {
    return localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export default function useCookieNotice() {
  const [isVisible, setIsVisible] = useState(() => !hasDismissedCookieNotice());

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'true');
    } catch {
      // Keep the notice dismissed for the current session if storage is unavailable.
    }

    setIsVisible(false);
  }, []);

  return { isVisible, dismiss };
}

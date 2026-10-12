import { useEffect, useState } from 'react';

const TOAST_DURATION = 3000;

export default function Toast({ notification, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, TOAST_DURATION);
    return () => window.clearTimeout(timer);
  }, [notification.id, onDismiss]);

  if (!visible) return null;

  return <div className="order-toast" role="status" aria-live="polite">
    <span aria-hidden="true">✓</span>
    <div><strong>{notification.message}</strong></div>
    <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
    <span className="toast-countdown" aria-hidden="true" />
  </div>;
}

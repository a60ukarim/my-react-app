import { useEffect } from 'react';

export default function Toast({ notification, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return <div className="order-toast" role="status" aria-live="polite">
    <span aria-hidden="true">✓</span>
    <div><strong>{notification.message}</strong></div>
    <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
  </div>;
}

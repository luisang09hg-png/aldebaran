import { useState, useCallback } from 'react';
import './Toast.css';

let toastId = 0;

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    info:    (msg) => show(msg, 'info'),
  };

  return { toasts, toast };
}

// ── Componente ────────────────────────────────────────────────────────────────
const icons = { success: '✅', error: '❌', info: 'ℹ️' };

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(({ id, message, type }) => (
        <div key={id} className={`toast ${type}`} role="alert">
          <span>{icons[type]}</span>
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';

export default function ErrorNotice({ message, type = 'error', autoDismiss = 6000, onClose }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (!message) return;
    const t = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, autoDismiss);
    return () => clearTimeout(t);
  }, [message, autoDismiss, onClose]);

  if (!message || !visible) return null;

  const ts = new Date().toLocaleString();
  return (
    <div className={`error-notice ${type}`} role="alert" aria-live="assertive" style={{ margin: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ display: 'block' }}>{type === 'error' ? 'Error' : 'Notice'}</strong>
          <div style={{ fontSize: '.92rem', color: '#0f172a' }}>{message}</div>
          <div style={{ fontSize: '.75rem', color: '#64748b', marginTop: 6 }}>at {ts}</div>
        </div>
        <div>
          <button onClick={() => { setVisible(false); onClose && onClose(); }} className="btn" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>✕</button>
        </div>
      </div>
    </div>
  );
}

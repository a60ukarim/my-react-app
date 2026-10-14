import { useEffect, useRef } from 'react';
import Toast from './toast';
import { useStore } from '../store';
import { Cart } from '../pages/store-pages';

export default function BagDrawer({ open, onClose }) {
  const drawer = useRef(null); const { notification, dismissToast } = useStore();
  useEffect(() => {
    if (open && !drawer.current.open) drawer.current.showModal();
    if (!open && drawer.current.open) drawer.current.close();
  }, [open]);
  return <dialog ref={drawer} className="bag-drawer" aria-label="Shopping bag" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === drawer.current) onClose(); }}>
    <div className="bag-drawer-inner" onClick={event => { if (event.target.closest('a')) onClose(); }}><button className="drawer-close" aria-label="Close shopping bag" onClick={onClose}>×</button>
      {open && <Cart drawer onClose={onClose} />}
    </div>{open && notification && <Toast key={notification.id} notification={notification} onDismiss={dismissToast} />}
  </dialog>;
}

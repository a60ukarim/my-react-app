import { useCallback, useRef, useState } from 'react';

import { StoreContext, readSaved } from './store';

import { numberOrders, nextInvoice } from './invoices';
import { attachOrderAccounts, belongsToAccount, loadAccounts, rememberAccount, savedAccount } from './accounts';
import { initialInventory, reconcileInventory } from './inventory';

import AppView from './components/app-view';

import './App.css';

export default function App() {
  return <LocalStore><AppView /></LocalStore>;
}

function LocalStore({ children }) {
  const [notification, setNotification] = useState(null);
  const notificationId = useRef(0);
  const notify = message => setNotification({ id: ++notificationId.current, message });
  const dismissToast = useCallback(() => setNotification(null), []);
  const [user, setUser] = useState(() => { const session = readSaved('user', null); return session ? savedAccount(localStorage, session.email) || session : null; });
  const [cart, setCart] = useState(() => readSaved('cart', []));
  const [favorites, setFavorites] = useState(() => readSaved('favorites', []));
  const [orders, setOrders] = useState(() => attachOrderAccounts(numberOrders(readSaved('orders', []), user?.email || readSaved('profile', null)?.email), loadAccounts(localStorage)));
  const [settings, setSettings] = useState(() => readSaved('settings', { dark: false, notifications: true }));
  const [inventory, setInventory] = useState(() => readSaved('inventory-by-size', initialInventory(cart, orders)));
  const [bagOpen, setBagOpen] = useState(false);
  const save = (key, value, setter) => { localStorage.setItem(`sole-${key}`, JSON.stringify(value)); setter(value); };
  const updateCart = items => {
    const nextInventory = reconcileInventory(inventory, cart, items);
    if (!nextInventory) { notify('Not enough stock available.'); return false; }
    save('inventory-by-size', nextInventory, setInventory);
    save('cart', items, setCart);
    return true;
  };
  const value = {
    user, cart, favorites, orders, settings, notify, notification, dismissToast, inventory, bagOpen, openBag: () => setBagOpen(true), closeBag: () => setBagOpen(false),
    login: (profile) => {
      const saved = savedAccount(localStorage, profile.email);
      const account = rememberAccount(localStorage, saved || profile);
      setUser(account);
      const restoredOrders = attachOrderAccounts(numberOrders(orders.map(order => order.customerEmail === 'legacy' ? { ...order, customerEmail: account.email } : order), account.email), loadAccounts(localStorage));
      save('orders', restoredOrders, setOrders); return { signedIn: true };
    },
    signup: profile => { value.login(profile); return { signedIn: true }; },
    logout: () => { localStorage.removeItem('sole-user'); setUser(null); setNotification(null); setBagOpen(false); },
    updateUser: (profile) => {
      const next = rememberAccount(localStorage, { ...profile, accountId: user.accountId }, user.email);
      if (!next) { notify('This email already belongs to another local account.'); return false; }
      save('orders', orders.map(order => belongsToAccount(order, user) ? { ...order, customerId: next.accountId } : order), setOrders);
      setUser(next);
      return true;
    },
    updateCart,
    toggleFavorite: (id) => { const removing = favorites.includes(id); save('favorites', removing ? favorites.filter(item => item !== id) : [...favorites, id], setFavorites); if (!removing) notify('Shoe saved to favorites!'); },
    updateSettings: (next) => { save('settings', next, setSettings); notify('Preferences saved successfully!'); },
    addToCart: (product, size, quantity = 1) => {
      const match = cart.find(item => item.id === product.id && item.size === size);
      const added = updateCart(match ? cart.map(item => item === match ? { ...item, quantity: item.quantity + quantity } : item) : [...cart, { ...product, size, quantity }]);
      if (added) notify('Added to bag successfully!');
      return added;
    },
    checkout: () => {
      if (!cart.length) return;
      const date = new Date().toISOString();
      const order = { ...nextInvoice(orders, user.email, date, user.accountId), customerId: user.accountId, customer: { name: user.name, email: user.email, phone: user.phone, address: user.address }, id: `SOLE-${Date.now()}`, date, items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) };
      save('orders', [order, ...orders], setOrders); save('cart', [], setCart); notify('Order placed successfully!'); return true;
    },
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

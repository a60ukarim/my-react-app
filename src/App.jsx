import { useCallback, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreContext, readSaved } from './store';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Navbar from './components/navbar';
import Toast from './components/toast';
import BagDrawer from './components/bag-drawer';
import { numberOrders, nextInvoice } from './invoices';
import { initialInventory, reconcileInventory } from './inventory';

import { Shop, Favorites, Cart, Orders, Profile, Settings } from './pages/store-pages';
import './App.css';

export default function App() {
  const [notification, setNotification] = useState(null);
  const notificationId = useRef(0);
  const notify = message => setNotification({ id: ++notificationId.current, message });
  const dismissToast = useCallback(() => setNotification(null), []);
  const [user, setUser] = useState(() => readSaved('user', null));
  const [cart, setCart] = useState(() => readSaved('cart', []));
  const [favorites, setFavorites] = useState(() => readSaved('favorites', []));
  const [orders, setOrders] = useState(() => numberOrders(readSaved('orders', []), user?.email || readSaved('profile', null)?.email));
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
    user, cart, favorites, orders, settings, notify, notification, dismissToast, inventory, openBag: () => setBagOpen(true), closeBag: () => setBagOpen(false),
    login: (profile) => save('user', profile, setUser),
    logout: () => { localStorage.removeItem('sole-user'); setUser(null); setNotification(null); setBagOpen(false); },
    updateUser: (profile) => save('user', profile, setUser),
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
      const order = { ...nextInvoice(orders, user.email, date), id: `SOLE-${Date.now()}`, date, items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) };
      save('orders', [order, ...orders], setOrders); save('cart', [], setCart); notify('Order placed successfully!');
    },
  };
  return <StoreContext.Provider value={value}><BrowserRouter><div className={settings.dark ? 'app dark' : 'app'}>
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route element={user ? <><Navbar /><main className="main-content"><Outlet /></main></> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard />} /><Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} /><Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} /><Route path="/profile" element={<Profile />} /><Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>{user && <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />}{user && !bagOpen && notification && <Toast key={notification.id} notification={notification} onDismiss={dismissToast} />}</div></BrowserRouter></StoreContext.Provider>;
}

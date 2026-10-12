import { useCallback, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreContext, readSaved } from './store';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Navbar from './components/navbar';
import Toast from './components/toast';

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
  const [orders, setOrders] = useState(() => readSaved('orders', []));
  const [settings, setSettings] = useState(() => readSaved('settings', { dark: false, notifications: true }));
  const save = (key, value, setter) => { localStorage.setItem(`sole-${key}`, JSON.stringify(value)); setter(value); };
  const value = {
    user, cart, favorites, orders, settings, notify,
    login: (profile) => save('user', profile, setUser),
    logout: () => { localStorage.removeItem('sole-user'); setUser(null); setNotification(null); },
    updateUser: (profile) => save('user', profile, setUser),
    updateCart: (items) => save('cart', items, setCart),
    toggleFavorite: (id) => { const removing = favorites.includes(id); save('favorites', removing ? favorites.filter(item => item !== id) : [...favorites, id], setFavorites); if (!removing) notify('Shoe saved to favorites!'); },
    updateSettings: (next) => { save('settings', next, setSettings); notify('Preferences saved successfully!'); },
    addToCart: (product, size) => {
      const match = cart.find(item => item.id === product.id && item.size === size);
      save('cart', match ? cart.map(item => item === match ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { ...product, size, quantity: 1 }], setCart);
    },
    checkout: () => {
      if (!cart.length) return;
      const order = { id: `SOLE-${Date.now()}`, date: new Date().toISOString(), items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) };
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
    </Routes>{user && notification && <Toast key={notification.id} notification={notification} onDismiss={dismissToast} />}</div></BrowserRouter></StoreContext.Provider>;
}

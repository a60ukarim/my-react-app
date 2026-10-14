import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Dashboard from '../pages/dashboard';
import Navbar from './navbar';
import Toast from './toast';
import BagDrawer from './bag-drawer';
import { Shop, Favorites, Cart, Orders, Profile, Settings } from '../pages/store-pages';

export default function AppView() {
  const { user, settings, bagOpen, closeBag, notification, dismissToast } = useStore();
  return (<BrowserRouter><div className={settings.dark ? 'app dark' : 'app'}>
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
    </Routes>{user && <BagDrawer open={bagOpen} onClose={closeBag} />}{user && !bagOpen && notification && <Toast key={notification.id} notification={notification} onDismiss={dismissToast} />}</div></BrowserRouter>
  );
}

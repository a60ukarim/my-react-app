import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store';
export default function Navbar() {
  const { logout, cart, openBag } = useStore();
  const [menu, setMenu] = useState(null);
  const location = useLocation();
  const opened = menu?.path === location.pathname ? menu.name : null;
  const toggle = name => setMenu(opened === name ? null : { name, path: location.pathname });
  return <header className="topbar" onKeyDown={event => { if (event.key === 'Escape') setMenu(null); }}><div className="navbar-left">
      <div className="dropdown"><button aria-label="Toggle navigation menu" aria-controls="navigation-menu" aria-expanded={opened === 'browse'} onClick={() => toggle('browse')}>☰</button>
        {opened === 'browse' && <nav id="navigation-menu" className="dropdown-panel navigation-menu" aria-label="Main navigation">
          {[
            ['/dashboard', '◈', 'Overview'],
            ['/shop', '◉', 'Shop shoes'],
            ['/favorites', '♡', 'Favorites'],
            ['/cart', '▢', 'Shopping bag'],
            ['/orders', '↗', 'Orders'],
            ['/profile', '♙', 'Profile'],
            ['/settings', '⚙', 'Settings'],
          ].map(([path, icon, title]) => <NavLink key={path} to={path} onClick={() => setMenu(null)}><span aria-hidden="true">{icon}</span>{title}</NavLink>)}
        </nav>}
      </div><Link className="brand" to="/dashboard">SOLE<span>SHOE STUDIO</span></Link></div>
    <div className="top-actions">
      <button className="cart-link" onClick={() => { setMenu(null); openBag(); }}>Bag <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button>

      <div className="dropdown"><button aria-label="Profile" aria-expanded={opened === 'profile'} onClick={() => toggle('profile')}><span className="avatar" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg></span></button>
        {opened === 'profile' && <nav className="dropdown-panel" aria-label="Profile menu"><Link to="/profile" onClick={() => setMenu(null)}>Profile</Link><Link to="/settings" onClick={() => setMenu(null)}>Settings</Link><button className="logout" onClick={logout}>Logout ↗</button></nav>}
      </div>
    </div>{opened && <button className="menu-backdrop" aria-label="Close menu" onClick={() => setMenu(null)} onKeyDown={event => { if (event.key === 'Escape') setMenu(null); }} />}
  </header>;
}

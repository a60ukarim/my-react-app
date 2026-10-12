import { NavLink } from 'react-router-dom';
export default function Sidebar() {
  return <aside className="side"><p className="eyebrow">YOUR SPACE</p><nav>{[['/dashboard', '◈', 'Overview'], ['/shop', '◉', 'Shop shoes'], ['/favorites', '♡', 'Favorites'], ['/cart', '▢', 'Shopping bag'], ['/orders', '↗', 'Orders'], ['/profile', '♙', 'Profile'], ['/settings', '⚙', 'Settings']].map(([path, icon, title]) => <NavLink key={path} to={path}><span>{icon}</span>{title}</NavLink>)}</nav><div className="side-note"><b>A better next step.</b><p>Find your everyday pair.</p><NavLink to="/shop">Discover the collection →</NavLink></div></aside>;
}

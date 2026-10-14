import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ProductCard } from './store-pages';
import { products } from '../products';
export default function Dashboard() {
  const { user } = useStore();
  return <><p className="eyebrow">YOUR DAILY ROTATION</p><div className="page-heading"><div><h1>Good to see you, {user.name.split(' ')[0]}.</h1><p>Your next favorite pair starts here.</p></div><span className="pill">AUTUMN / 2026</span></div>
    <section className="hero-banner"><div><p className="eyebrow">THE EVERYDAY COLLECTION</p><h2>Made to move.<br />Styled for you.</h2><p>From your first morning mile to your last city stop.<br />Find shoes that keep up with your day.</p><Link className="primary" to="/shop">Explore shoes ↗</Link></div><div className="hero-shoe"><Shoe /></div><span className="hero-caption">SOLE / AIRFLOW 01</span></section>
    <div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOUR DAY</p><h2>The current favorites</h2></div><Link to="/shop">View all shoes →</Link></div><div className="product-grid">{products.slice(0, 3).map(product => <ProductCard key={product.id} product={product} />)}</div></>;
}
function Shoe() { return <svg viewBox="0 0 440 260" aria-label="Illustration of an olive and cream sneaker" role="img"><ellipse cx="225" cy="223" rx="175" ry="16" fill="#000" opacity=".1"/><g transform="rotate(-14 220 130)"><path d="M55 160 90 74Q98 62 117 70L188 119 248 87 274 123 373 156Q406 166 406 194L55 196Z" fill="#d9e4ba" stroke="#283a24" strokeWidth="3"/><path d="m87 86 38 73 70 17 75-40-22-49-61 32-70-49Z" fill="#586f43"/><path d="m192 119 50 17-36 30-57-23Z" fill="#f5f0dd"/><path d="M51 185Q205 208 409 187L410 211Q190 236 48 208Z" fill="#faf4df" stroke="#283a24" strokeWidth="3"/><path d="m175 118 40 7m-49 4 38 9m-47 3 36 9" stroke="#faf4df" strokeWidth="7" strokeLinecap="round"/><path d="m286 149 72 20m-73-6 92 19" stroke="#a5b68c" strokeWidth="3"/></g></svg>; }

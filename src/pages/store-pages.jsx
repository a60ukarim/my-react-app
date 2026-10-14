import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { products } from '../products';
import { belongsToAccount } from '../accounts';
import { invoiceReference, searchOrders } from '../invoices';
import { removeOne } from '../inventory';
export function ShoeArt({ color }) { return <svg viewBox="0 0 320 180" role="img" aria-label="Shoe illustration"><ellipse cx="164" cy="148" rx="125" ry="9" fill="#000" opacity=".08"/><path d="M38 114 61 51Q67 44 78 51L131 86 172 70 200 98 266 115Q287 121 287 140H35Z" fill={color} /><path d="m64 59 26 55 49 11 36-31-3-24-41 16-53-35Z" fill="#ffffff" opacity=".3"/><path d="M34 133Q148 147 289 134V151Q150 165 32 148Z" fill="#fffaf0" stroke="#353b32" strokeWidth="2"/><path d="m123 86 31 7m-37 2 27 9m-34 0 25 9" stroke="#fffaf0" strokeWidth="5" strokeLinecap="round"/></svg>; }
export function ProductCard({ product }) {
 const { favorites, toggleFavorite, addToCart, inventory, openBag, cart } = useStore();
 const sizes = Object.keys(product.stockBySize).filter(s => (inventory[product.id]?.[s] ?? 0) > 0);
 const [size, setSize] = useState(() => sizes[0] || '');
 const selectedSize = sizes.includes(size) ? size : '';
 const available = inventory[product.id]?.[selectedSize] ?? 0;
 const reserved = cart.some(item => item.id === product.id);
 const unavailable = reserved ? 'Currently unavailable' : 'Sold out';
 return <article className="product-card">
   <div className="product-art" style={{ backgroundColor: `${product.color}22` }}>
     <span className="product-tag">{product.tag}</span>
     <button className="heart" aria-label={`${favorites.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${favorites.includes(product.id) ? 'from' : 'to'} favorites`} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)}>{favorites.includes(product.id) ? '♥' : '♡'}</button>
     <ShoeArt color={product.color} />
   </div>
   <div className="product-info"><p>{product.category}</p><div className="product-title"><h3>{product.name}</h3><b>${product.price}</b></div>
     <div className="product-actions">
       <label className="compact-size-picker">Available sizes<select aria-label={`Available sizes for ${product.name}`} value={selectedSize} disabled={!sizes.length} onChange={event => setSize(event.target.value)}>
         <option value="" disabled>{sizes.length ? 'Choose EU size' : 'No sizes available'}</option>
         {sizes.map(s => <option key={s} value={s}>EU {s} · {inventory[product.id][s]} left</option>)}
       </select></label>
       <button className="secondary" disabled={!available} onClick={() => addToCart(product, selectedSize)}>{sizes.length ? 'Add to bag +' : unavailable}</button>
     </div>
     <div className="product-footer"><small className="stock-label" aria-live="polite">{available ? `${available} pairs left in EU ${selectedSize}` : sizes.length ? 'Select an available size' : unavailable}</small><button className="text-button" onClick={openBag}>View bag →</button></div>
   </div>
 </article>;
}
function Heading({ label, title, text }) { return <><p className="eyebrow">{label}</p><div className="page-heading"><div><h1>{title}</h1><p>{text}</p></div></div></>; }
function Empty({ title, text }) { return <div className="empty"><span>↗</span><h2>{title}</h2><p>{text}</p><Link className="primary" to="/shop">Explore shoes</Link></div>; }
export function Shop() {
 const [params, setParams] = useSearchParams(); const category = params.get('category') || 'All'; const [search, setSearch] = useState(''); const [sort, setSort] = useState('featured');
 const shown = products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : a.id-b.id);
 return <><Heading label="THE COLLECTION" title="Find your next pair." text="Thoughtfully picked shoes for every kind of day." /><div className="filters"><div className="tabs">{['All', 'Running', 'Lifestyle', 'Sport'].map(c => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setParams(c === 'All' ? {} : { category: c })}>{c}</button>)}</div><input aria-label="Search shoes" placeholder="Search shoes…" value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Sort shoes" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><p className="muted">{shown.length} pairs in the collection</p><div className="product-grid">{shown.map(p => <ProductCard key={p.id} product={p} />)}</div>{!shown.length && <p role="status">No shoes match your search. Try another name or category.</p>}</>;
}
export function Favorites() { const { favorites } = useStore(); return <><Heading label="YOUR EDIT" title="Saved for later." text="All the pairs you have your eye on." />{favorites.length ? <div className="product-grid">{products.filter(p => favorites.includes(p.id)).map(p => <ProductCard key={p.id} product={p} />)}</div> : <Empty title="Your favorites start here." text="Tap the heart on a shoe to save it to your collection." />}</>; }
export function Cart({ drawer = false, onClose = () => {} }) {
 const confirmation = useRef(null); const { cart, updateCart, checkout, inventory, addToCart } = useStore(); const navigate = useNavigate(); const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
 return <><Heading label="ALMOST YOURS" title="Your shopping bag." text="Check your pairs and sizes before placing a demo order." />{cart.length ? <div className="cart-layout"><section className="panel">{cart.map(item => <article className="cart-row" key={`${item.id}-${item.size}`}><div className="mini-shoe"><ShoeArt color={item.color} /></div><div><h3>{item.name}</h3><p>EU {item.size} · ${item.price}</p></div><div><b>${item.price * item.quantity}</b><div className="bag-item-actions"><button type="button" className="quantity-minus" aria-label={`Remove one ${item.name} size ${item.size}`} title="Remove one pair" onClick={() => updateCart(removeOne(cart, item.id, item.size))}>−</button><span className="bag-quantity" aria-label={`Quantity: ${item.quantity}`} aria-live="polite">{item.quantity}</span><button type="button" className="quantity-minus quantity-plus" aria-label={`Add one ${item.name} size ${item.size}`} title="Add one pair" disabled={!(inventory[item.id]?.[item.size] > 0)} onClick={() => addToCart(item, item.size)}>+</button><button type="button" className="remove-product" aria-label={`Remove all ${item.name} size ${item.size}`} onClick={() => updateCart(cart.filter(p => !(p.id === item.id && p.size === item.size)))}>Remove product</button></div><small className="bag-stock" aria-live="polite">{(inventory[item.id]?.[item.size] ?? 0) > 0 ? `${inventory[item.id][item.size]} more available in EU ${item.size}` : 'No more available in this size'}</small></div></article>)}</section><aside className="panel summary"><h2>Order summary</h2><p>Subtotal <b>${total}</b></p><p>Delivery <b>Free</b></p><hr /><p>Total <b>${total}</b></p><button className="primary" onClick={() => confirmation.current.showModal()}>Place demo order →</button><dialog ref={confirmation} className="confirm-dialog" aria-labelledby="confirm-order-title"><h2 id="confirm-order-title">Confirm your order?</h2><p>Your total is <strong>${total}</strong>. This is a demo order; no payment will be charged.</p><div className="confirm-actions"><button className="secondary" onClick={() => confirmation.current.close()}>Cancel</button><button className="primary" onClick={() => { confirmation.current.close(); checkout(); if (drawer) onClose(); else navigate('/orders'); }}>Confirm order</button></div></dialog><small>Demonstration only. No payment is charged.</small><Link to="/shop" onClick={onClose}>Continue shopping</Link></aside></div> : <Empty title="Your bag is waiting." text="Choose a pair and select your size to get started." />}</>;
}
export function Orders() {
 const { orders, user } = useStore(); const [query, setQuery] = useState('');
 const ownOrders = orders.filter(order => belongsToAccount(order, user));
 const shown = searchOrders(ownOrders, query);
 return <><Heading label="YOUR JOURNEY" title="Your orders." text="Find a purchase by product name or invoice number." />
   {ownOrders.length ? <>
     <div className="order-search panel"><label htmlFor="order-search">Search your invoices<input id="order-search" type="search" placeholder="Product name, invoice number, or date…" value={query} onChange={event => setQuery(event.target.value)} /></label><small aria-live="polite">{shown.length} of {ownOrders.length} invoices</small></div>
     {shown.length ? shown.map(order => <article className="panel order" key={order.id}>
       <div className="section-heading"><div><p className="eyebrow">YOUR PURCHASE #{order.customerInvoiceNumber}</p><h3 className="invoice-title">Invoice {invoiceReference(order)}</h3><p>{order.invoiceDate} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><span className="pill">Demo order placed</span></div>
       <div className="invoice-numbers"><span>Company invoice today <b>#{order.companyInvoiceNumber}</b></span><span>Your invoice <b>#{order.customerInvoiceNumber}</b></span></div>
       {order.items.map(item => <div className="invoice-item" key={`${item.id}-${item.size}`}><div><strong>{item.name}</strong><small>EU {item.size} · Quantity {item.quantity}</small></div><b>${item.price * item.quantity}</b></div>)}
       <div className="invoice-total"><span>Total</span><strong>${order.total}</strong></div>
     </article>) : <div className="empty"><h2>No matching invoices.</h2><p>Try a product name or another invoice number.</p><button className="secondary" onClick={() => setQuery('')}>Clear search</button></div>}
   </> : <Empty title="Your first order is ahead." text="Place a demo order from your bag and it will appear here." />}
 </>;
}
export function Profile() {
 const { user, updateUser, notify } = useStore(); const [form, setForm] = useState(user);
 const changed = ['name', 'email', 'phone', 'address'].some(key => (form[key] || '').trim() !== (user[key] || '').trim());
 return <><Heading label="YOUR ACCOUNT" title="Make it yours." text="Update your personal details and delivery address." /><form className="panel detail-form" onSubmit={e => { e.preventDefault(); if (!changed || !form.name.trim()) return; const next = { ...form, name: form.name.trim(), email: form.email.trim() }; if (updateUser(next)) { setForm(next); notify('Profile saved successfully!'); } }}><div className="profile-intro"><span className="avatar large">{user.name.slice(0, 1).toUpperCase()}</span><div><h2>{user.name}</h2><p>{user.email}</p></div></div>{[['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['address', 'Delivery address', 'text']].map(([key, label, type]) => <label key={key}>{label}<input type={type} required={key === 'name' || key === 'email'} value={form[key] || ''} onChange={e => { setForm({ ...form, [key]: e.target.value }); }} /></label>)}<button className="primary" disabled={!changed}>Save profile</button></form></>;
}
export function Settings() {
 const { settings, updateSettings } = useStore();
 const update = next => updateSettings(next);
 return <><Heading label="YOUR PREFERENCES" title="A space that suits you." text="Personalize your experience. Changes are saved automatically." /><div className="panel detail-form"><label className="setting-row"><span><b>Dark appearance</b><small>Switch to a darker color palette.</small></span><input type="checkbox" role="switch" checked={settings.dark} onChange={e => update({ ...settings, dark: e.target.checked })} /></label><label className="setting-row"><span><b>Collection updates</b><small>Show collection news in your account.</small></span><input type="checkbox" role="switch" checked={settings.notifications} onChange={e => update({ ...settings, notifications: e.target.checked })} /></label>{settings.notifications && <div className="notice">Collection news: explore our new Court One sneaker in the shop. <Link to="/shop">Browse →</Link></div>}<p className="muted">This demo stores preferences on this browser. No emails are sent.</p></div></>;
}

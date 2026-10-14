import { products } from './products.js';

export function initialInventory(cart, orders) {
  const items = [...cart, ...orders.flatMap(order => order.items)];
  return Object.fromEntries(products.map(product => [product.id,
    Object.fromEntries(Object.entries(product.stockBySize).map(([size, count]) => {
      const used = items.filter(item => item.id === product.id && String(item.size) === size).reduce((sum, item) => sum + item.quantity, 0);
      return [size, Math.max(0, count - used)];
    })),
  ]));
}

// Reserve and release stock for the exact product AND size.
export function reconcileInventory(inventory, previous, next) {
  const stock = Object.fromEntries(Object.entries(inventory).map(([id, sizes]) => [id, { ...sizes }]));
  for (const item of previous) {
    if (!Number.isFinite(stock[item.id]?.[item.size])) return null;
    stock[item.id][item.size] += item.quantity;
  }
  for (const item of next) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(stock[item.id]?.[item.size]) || stock[item.id][item.size] < item.quantity) return null;
    stock[item.id][item.size] -= item.quantity;
  }
  return stock;
}

export function removeOne(cart, id, size) {
  return cart.flatMap(item => item.id === id && item.size === size
    ? item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
    : [item]);
}

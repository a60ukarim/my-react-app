import { products } from './products.js';

export function initialInventory(cart, orders) {
  return Object.fromEntries(products.map(product => {
    const used = [...cart, ...orders.flatMap(order => order.items)].filter(item => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
    return [product.id, Math.max(0, product.stock - used)];
  }));
}

// Return stock to the store when quantities drop; reserve it when they rise.
export function reconcileInventory(inventory, previous, next) {
  const stock = { ...inventory };
  for (const item of previous) stock[item.id] += item.quantity;
  for (const item of next) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(stock[item.id]) || stock[item.id] < item.quantity) return null;
    stock[item.id] -= item.quantity;
  }
  return stock;
}

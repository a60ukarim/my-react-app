// Company invoice sequences restart each Beirut calendar day.
export function invoiceDay(date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Beirut', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(date));
  const part = type => parts.find(item => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function customerKey(email) { return email.trim().toLowerCase(); }
export function invoiceReference(order) { return `SOLE-${order.invoiceDate.replaceAll('-', '')}-${String(order.companyInvoiceNumber).padStart(4, '0')}`; }

export function numberOrders(orders, legacyCustomer) {
  const daily = new Map(); const customer = new Map(); const numbered = new Map();
  const chronological = [...orders].sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const order of chronological) {
    const day = order.invoiceDate || invoiceDay(order.date);
    const owner = customerKey(order.customerEmail || legacyCustomer || 'legacy');
    const companyNumber = order.companyInvoiceNumber || (daily.get(day) || 0) + 1;
    const customerNumber = order.customerInvoiceNumber || (customer.get(owner) || 0) + 1;
    daily.set(day, Math.max(daily.get(day) || 0, companyNumber));
    customer.set(owner, Math.max(customer.get(owner) || 0, customerNumber));
    numbered.set(order.id, { ...order, invoiceDate: day, customerEmail: owner, companyInvoiceNumber: companyNumber, customerInvoiceNumber: customerNumber });
  }
  return orders.map(order => numbered.get(order.id));
}
export function nextInvoice(orders, email, date, accountId) {
  const day = invoiceDay(date); const owner = customerKey(email);
  return {
    invoiceDate: day, customerEmail: owner,
    companyInvoiceNumber: Math.max(0, ...orders.filter(order => order.invoiceDate === day).map(order => order.companyInvoiceNumber)) + 1,
    customerInvoiceNumber: Math.max(0, ...orders.filter(order => accountId && order.customerId ? order.customerId === accountId : order.customerEmail === owner).map(order => order.customerInvoiceNumber)) + 1,
  };
}
export function searchOrders(orders, query) {
  const term = query.trim().toLowerCase();
  return orders.filter(order => !term || [order.id, invoiceReference(order), String(order.companyInvoiceNumber), String(order.customerInvoiceNumber), order.invoiceDate, ...order.items.map(item => item.name)].some(value => value.toLowerCase().includes(term)));
}

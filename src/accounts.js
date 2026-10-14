export function normalizeEmail(email) { return email.trim().toLowerCase(); }
export function loadAccounts(storage) {
  const read = (key, fallback) => {
    try { return JSON.parse(storage.getItem(`sole-${key}`)) ?? fallback; } catch { return fallback; }
  };
  const accounts = read('accounts', {});
  for (const profile of [read('profile', null), read('user', null)]) {
    if (!profile?.email) continue;
    const email = normalizeEmail(profile.email);
    const previous = accounts[email];
    accounts[email] = { ...previous, ...profile, email, accountId: previous?.accountId || profile.accountId || `local-${email}` };
  }
  return accounts;
}
export function rememberAccount(storage, profile, previousEmail) {
  const accounts = loadAccounts(storage);
  const email = normalizeEmail(profile.email);
  const oldEmail = previousEmail ? normalizeEmail(previousEmail) : email;
  const next = { ...profile, email, accountId: profile.accountId || accounts[oldEmail]?.accountId || crypto.randomUUID() };
  if (accounts[email] && accounts[email].accountId !== next.accountId) return null;
  if (oldEmail !== email) delete accounts[oldEmail];
  accounts[email] = next;
  storage.setItem('sole-accounts', JSON.stringify(accounts));
  storage.setItem('sole-profile', JSON.stringify(next));
  storage.setItem('sole-user', JSON.stringify(next));
  return next;
}
export function savedAccount(storage, email) {
  return loadAccounts(storage)[normalizeEmail(email)] || null;
}
export function belongsToAccount(order, account) {
  return order.customerId ? order.customerId === account.accountId : normalizeEmail(order.customerEmail || '') === normalizeEmail(account.email);
}
export function attachOrderAccounts(orders, accounts) {
  return orders.map(order => {
    if (order.customerId) return order;
    const account = accounts[normalizeEmail(order.customerEmail || '')];
    return account ? { ...order, customerId: account.accountId } : order;
  });
}

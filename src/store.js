import { createContext, useContext } from 'react';
export const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);
export function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`sole-${key}`)) ?? fallback; } catch { return fallback; }
}

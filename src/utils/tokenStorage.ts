// tokenStorage.ts
const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(v: string) { localStorage.setItem(TOKEN_KEY, v); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export function setUser<T = any>(u: T) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
export function getUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) as T : null;
}
export function clearUser() { localStorage.removeItem(USER_KEY); }

// 👉 NO emite evento
export function clearAuth() {
  clearToken();
  clearUser();
}

// 👉 Úsalo solo cuando QUIERAS notificar a otros listeners
export function clearAuthAndBroadcast() {
  clearAuth();
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

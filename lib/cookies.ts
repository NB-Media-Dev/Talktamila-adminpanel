

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number = 7 * 24 * 60 * 60) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  return getCookie('Access_Token') || getCookie('tt_token');
}

export function setAuthToken(token: string, maxAgeSeconds: number = 7 * 24 * 60 * 60) {
  setCookie('Access_Token', token, maxAgeSeconds);
  setCookie('tt_token', token, maxAgeSeconds);
}

export function clearAuthToken() {
  deleteCookie('Access_Token');
  deleteCookie('tt_token');
}

import { getAuthToken } from '@/lib/cookies';

const PRODUCTION_BACKEND_URL = 'https://endearing-eagerness-production-9b9a.up.railway.app';

export function getBackendUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.PYTHON_BACKEND_URL || process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || PRODUCTION_BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL;
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    return `http://${hostname}:8000`;
  }
  return PRODUCTION_BACKEND_URL;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBackendUrl()}${endpoint}`;

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = getAuthToken();
  }


  const isFormUrlEncoded = options.body instanceof URLSearchParams;
  const isFormData = options.body instanceof FormData;

  const defaultHeaders: HeadersInit = {
 
    ...(isFormUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    ...((!isFormUrlEncoded && !isFormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));

    if (response.status === 422 && Array.isArray(errorBody.detail)) {
      const messages = errorBody.detail.map((e: { loc: string[]; msg: string }) =>
        `${e.loc.slice(1).join('.')}: ${e.msg}`
      ).join('; ');
      throw new Error(`Validation error — ${messages}`);
    }
    throw new Error(errorBody.detail || `Server Error Status: ${response.status}`);
  }

  return response.json();
}

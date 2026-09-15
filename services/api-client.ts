import { getAuthToken } from '@/lib/cookies';

const IS_SERVER = typeof window === 'undefined';
const BASE_URL = IS_SERVER
  ? process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'
  : process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  let token: string | null = null;
  if (!IS_SERVER) {
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

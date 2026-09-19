import { getAuthToken } from '@/lib/cookies';

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      return `http://${host}:8000`;
    }
    if (process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL;
    }
    return `http://${host}:8000`;
  }
  return process.env.PYTHON_BACKEND_URL || process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = getAuthToken();
  }

  const isFormUrlEncoded = options.body instanceof URLSearchParams;
  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined && options.body !== null;

  const defaultHeaders: Record<string, string> = {};

  if (isFormUrlEncoded) {
    defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (hasBody && !isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  } catch (networkError: any) {
    console.error(`[apiClient] Network request failed for ${options.method || 'GET'} ${url}:`, networkError);
    throw new Error(
      `Unable to connect to backend server at ${baseUrl}. Please ensure the backend is running. (${networkError?.message || networkError})`
    );
  }

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

  // Handle 204 No Content or empty responses gracefully
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

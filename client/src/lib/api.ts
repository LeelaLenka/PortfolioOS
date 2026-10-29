const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'portfolioos_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Small fetch wrapper: JSON in/out, bearer token, readable error messages */
export async function api<T = unknown>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = tokenStore.get();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Can’t reach the server. It may be waking up; try again in 30 seconds.');
  }
  const json = (await res.json().catch(() => ({}))) as { data?: T; message?: string };
  if (!res.ok) throw new ApiError(res.status, json.message ?? `Request failed (${res.status})`);
  return (json.data ?? (json as T)) as T;
}

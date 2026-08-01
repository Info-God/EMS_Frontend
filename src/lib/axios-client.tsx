import axios, { type InternalAxiosRequestConfig } from 'axios';

// Fields that must never appear in logs, on any request/response shape
// (JSON body, FormData field, or header) — checked case-insensitively.
const SENSITIVE_KEYS = new Set([
  'password',
  'password_confirmation',
  'old_password',
  'new_password',
  'current_password',
  'token',
  'authorization',
  'otp',
]);

const redactEntry = (key: string, value: unknown): unknown => {
  if (SENSITIVE_KEYS.has(key.toLowerCase())) return '[REDACTED]';
  if (typeof File !== 'undefined' && value instanceof File) {
    return `[File: ${value.name}, ${value.size}b, ${value.type || 'unknown-type'}]`;
  }
  return value;
};

const redactBody = (data: unknown): unknown => {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const out: Record<string, unknown> = {};
    data.forEach((value, key) => {
      out[key] = redactEntry(key, value);
    });
    return out;
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        redactEntry(key, value),
      ])
    );
  }
  return data;
};

let requestSeq = 0;

// Extra fields we stash on the axios config to correlate a request with its
// eventual response/error and to measure round-trip time. Axios passes the
// same config object through, so this survives the round trip.
type TrackedConfig = InternalAxiosRequestConfig & {
  __requestId?: string;
  __startedAt?: number;
};

const describe = (config: TrackedConfig) => ({
  id: config.__requestId,
  method: config.method?.toUpperCase(),
  url: `${config.baseURL ?? ''}${config.url ?? ''}`,
  userId: localStorage.getItem('user_id') || null,
});

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: log every outgoing call so a per-user bug report can
// be matched against exactly what their browser sent (params/body redacted).
axiosClient.interceptors.request.use((config: TrackedConfig) => {
  config.__requestId = `req_${Date.now()}_${++requestSeq}`;
  config.__startedAt = performance.now();

  console.log('[API Request]', {
    ...describe(config),
    params: config.params ?? null,
    body: redactBody(config.data),
  });

  return config;
});

// Response interceptor: log both success and failure so "works for A, fails
// for B" bugs are visible from the console without reproducing them locally.
axiosClient.interceptors.response.use(
  (response) => {
    const config = response.config as TrackedConfig;
    console.log('[API Response]', {
      ...describe(config),
      status: response.status,
      durationMs: config.__startedAt ? Math.round(performance.now() - config.__startedAt) : null,
      body: response.data,
    });
    return response;
  },
  (error) => {
    const config = (error.config ?? {}) as TrackedConfig;

    // Requests that never got a response at all (network error, CORS block,
    // timeout) have no `error.response` — that absence is itself useful signal.
    console.error('[API Error]', {
      ...describe(config),
      status: error.response?.status ?? null,
      durationMs: config.__startedAt ? Math.round(performance.now() - config.__startedAt) : null,
      body: error.response?.data ?? null,
      message: error.message,
    });

    // Check if the error response status is 401
    if (error.response && error.response.status === 401) {
      // Navigate to home page
      localStorage.removeItem("token")
      // window.location.href = '/';
    }

    // Reject the promise to allow error handling in calling code
    return Promise.reject(error);
  }
);

export default axiosClient;
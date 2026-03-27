const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.putpulse.com';

let apiBaseUrl = DEFAULT_API_BASE_URL;

const authRuntime = {
  getAccessToken: () => null,
  refreshAccessToken: async () => null,
  onUnauthorized: () => {},
};

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? null;
    this.data = data ?? null;
  }
}

const normalizeBaseUrl = (value) => {
  const fallback = value || DEFAULT_API_BASE_URL;
  return fallback.endsWith('/') ? fallback : `${fallback}/`;
};

const appendSearchParams = (url, params = {}) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === null || item === undefined || item === '') return;
        url.searchParams.append(key, String(item));
      });
      return;
    }

    url.searchParams.set(key, String(value));
  });
};

const resolveUrl = (path, params) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizeBaseUrl(apiBaseUrl));
  appendSearchParams(url, params);
  return url.toString();
};

const flattenErrorParts = (value) => {
  if (value === null || value === undefined || value === '') return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(flattenErrorParts);
  if (typeof value === 'object') return Object.values(value).flatMap(flattenErrorParts);
  return [String(value)];
};

export const extractApiErrorMessage = (data, fallback = 'Request failed.') => {
  if (typeof data === 'string' && data.trim()) return data.trim();
  if (!data || typeof data !== 'object') return fallback;

  const directMessage = [data.detail, data.message, data.error].find(
    (value) => typeof value === 'string' && value.trim(),
  );
  if (directMessage) return directMessage.trim();

  const parts = flattenErrorParts(data).map((part) => part.trim()).filter(Boolean);
  return parts.length ? parts.join(' ') : fallback;
};

const buildBody = (body) => {
  if (body === null || body === undefined) return undefined;
  if (body instanceof FormData || typeof body === 'string') return body;
  return JSON.stringify(body);
};

const buildHeaders = (headers = {}, body, accessToken) => {
  const requestHeaders = new Headers(headers);

  if (body !== null && body !== undefined && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (accessToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return requestHeaders;
};

const parseResponse = async (response) => {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
};

export const configureApiClient = ({
  getAccessToken,
  refreshAccessToken,
  onUnauthorized,
} = {}) => {
  if (typeof getAccessToken === 'function') authRuntime.getAccessToken = getAccessToken;
  if (typeof refreshAccessToken === 'function') authRuntime.refreshAccessToken = refreshAccessToken;
  if (typeof onUnauthorized === 'function') authRuntime.onUnauthorized = onUnauthorized;
};

export const setApiBaseUrl = (nextBaseUrl) => {
  if (!nextBaseUrl) return;
  apiBaseUrl = nextBaseUrl;
};

export const getApiBaseUrl = () => apiBaseUrl;

export const requestJson = async (
  path,
  {
    method = 'GET',
    params,
    body,
    headers,
    auth = true,
    skipRefresh = false,
    retryOnAuthFailure = true,
  } = {},
) => {
  const accessToken = auth ? await authRuntime.getAccessToken?.() : null;
  const response = await fetch(resolveUrl(path, params), {
    method,
    headers: buildHeaders(headers, body, accessToken),
    body: buildBody(body),
    credentials: 'include',
  });

  const data = await parseResponse(response);

  if (response.status === 401 && auth && !skipRefresh && retryOnAuthFailure) {
    const refreshedToken = await authRuntime.refreshAccessToken?.();

    if (refreshedToken) {
      return requestJson(path, {
        method,
        params,
        body,
        headers,
        auth,
        skipRefresh,
        retryOnAuthFailure: false,
      });
    }

    authRuntime.onUnauthorized?.();
  }

  if (!response.ok) {
    throw new ApiError(
      extractApiErrorMessage(data, `Request failed: ${response.status}`),
      { status: response.status, data },
    );
  }

  return data;
};

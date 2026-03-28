import { computed, reactive } from 'vue';
import { configureApiClient, extractApiErrorMessage, requestJson } from '../api/client';

const USER_STORAGE_KEY = 'putpulse.auth.user';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const readStoredUser = () => {
  if (!canUseStorage()) return null;

  try {
    const rawValue = window.sessionStorage.getItem(USER_STORAGE_KEY);
    if (!rawValue) return null;
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  if (!canUseStorage()) return;

  if (!user) {
    window.sessionStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  try {
    window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage quota / availability errors and keep in-memory auth working.
  }
};

const normalizeUserValue = (value) => {
  if (!value || typeof value !== 'object') return null;
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== ''),
  );
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null;

  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const deriveUserFromAccessToken = (accessToken) => {
  const payload = decodeJwtPayload(accessToken);
  if (!payload || typeof payload !== 'object') return null;

  const firstName = payload.first_name ?? payload.given_name ?? null;
  const lastName = payload.last_name ?? payload.family_name ?? null;
  const displayName = payload.name ?? null;
  const inferredUser = normalizeUserValue({
    id: payload.user_id ?? payload.sub ?? null,
    username: payload.username ?? payload.preferred_username ?? null,
    email: payload.email ?? null,
    first_name: firstName ?? (displayName ? displayName.split(/\s+/)[0] : null),
    last_name: lastName ?? (displayName ? displayName.split(/\s+/).slice(1).join(' ') || null : null),
  });

  return inferredUser && Object.keys(inferredUser).length ? inferredUser : null;
};

const mergeUsers = (...candidates) => {
  const merged = candidates.reduce((result, candidate) => {
    const normalized = normalizeUserValue(candidate);
    if (!normalized) return result;
    return { ...result, ...normalized };
  }, {});

  return Object.keys(merged).length ? merged : null;
};

const state = reactive({
  accessToken: null,
  user: readStoredUser(),
  initializing: false,
  initialized: false,
});

let refreshPromise = null;
let initializePromise = null;

const applyAuthResponse = (data) => {
  state.accessToken = data?.access ?? null;
  state.user = mergeUsers(state.user, deriveUserFromAccessToken(data?.access), data?.user);
  writeStoredUser(state.user);
};

const setAccessToken = (accessToken) => {
  state.accessToken = accessToken ?? null;
  if (!state.user && state.accessToken) {
    state.user = mergeUsers(deriveUserFromAccessToken(state.accessToken), readStoredUser());
    writeStoredUser(state.user);
  }
};

const setUser = (user) => {
  state.user = normalizeUserValue(user);
  writeStoredUser(state.user);
};

const clearSession = () => {
  state.accessToken = null;
  state.user = null;
  writeStoredUser(null);
};

export const isEmailNotVerifiedError = (error) => {
  const message = extractApiErrorMessage(error?.data, error?.message ?? '');
  return message.toLowerCase().includes('not verified');
};

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const data = await requestJson('/api/auth/refresh/', {
        method: 'POST',
        auth: false,
        skipRefresh: true,
      });

      if (!data?.access) {
        clearSession();
        return null;
      }

      applyAuthResponse(data);
      return state.accessToken;
    } catch {
      clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

configureApiClient({
  getAccessToken: () => state.accessToken,
  refreshAccessToken,
  onUnauthorized: clearSession,
});

const initialize = async () => {
  if (state.initialized) return state.accessToken;
  if (initializePromise) return initializePromise;

  state.initializing = true;
  state.user = mergeUsers(state.user, readStoredUser());

  initializePromise = (async () => {
    try {
      await refreshAccessToken();
      return state.accessToken;
    } finally {
      state.initialized = true;
      state.initializing = false;
      initializePromise = null;
    }
  })();

  return initializePromise;
};

const register = async (payload) =>
  requestJson('/api/auth/register/', {
    method: 'POST',
    body: payload,
    auth: false,
    skipRefresh: true,
  });

const verifyEmail = async (token) => {
  const data = await requestJson('/api/auth/verify-email/', {
    method: 'POST',
    body: { token },
    auth: false,
    skipRefresh: true,
  });

  applyAuthResponse(data);
  state.initialized = true;
  return data;
};

const login = async ({ identifier, password }) => {
  const data = await requestJson('/api/auth/login/', {
    method: 'POST',
    body: {
      identifier: identifier.trim(),
      password,
    },
    auth: false,
    skipRefresh: true,
  });

  applyAuthResponse(data);
  state.initialized = true;
  return data;
};

const resendVerification = async (identifier) =>
  requestJson('/api/auth/resend-verification/', {
    method: 'POST',
    body: { identifier },
    auth: false,
    skipRefresh: true,
  });

const logout = async () => {
  try {
    await requestJson('/api/auth/logout/', {
      method: 'POST',
      auth: false,
      skipRefresh: true,
    });
  } finally {
    clearSession();
  }
};

const displayName = computed(() => {
  const user = state.user;
  if (!user) return state.accessToken ? 'Signed in' : '';

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.username || user.email || 'Signed in';
});

const isAuthenticated = computed(() => Boolean(state.accessToken));

const authStore = {
  state,
  displayName,
  isAuthenticated,
  setAccessToken,
  setUser,
  initialize,
  register,
  verifyEmail,
  login,
  resendVerification,
  refreshAccessToken,
  logout,
  clearSession,
};

export const useAuthStore = () => authStore;

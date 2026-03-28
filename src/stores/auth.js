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

const normalizeDailyBriefStatus = (value, fallbackIsActive = null) => {
  if (typeof value === 'string' && value.trim()) return value.trim().toLowerCase().replace(/\s+/g, '_');
  if (fallbackIsActive === true) return 'active';
  if (fallbackIsActive === false) return 'unsubscribed';
  return null;
};

const normalizeDailyBriefSubscription = (value) => {
  if (!value || typeof value !== 'object') return null;

  const status = normalizeDailyBriefStatus(value.status, value.is_active);
  const email = typeof value.email === 'string' && value.email.trim() ? value.email.trim() : null;
  const normalized = {
    id: value.id ?? null,
    status,
    is_active: status === 'active',
    email,
    source: typeof value.source === 'string' && value.source.trim() ? value.source.trim() : null,
    subscribed_at: value.subscribed_at ?? value.subscribedAt ?? null,
    unsubscribed_at: value.unsubscribed_at ?? value.unsubscribedAt ?? null,
    confirmed_at: value.confirmed_at ?? value.confirmedAt ?? null,
  };

  const entries = Object.entries(normalized).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== '');
  return entries.length ? Object.fromEntries(entries) : null;
};

const extractDailyBriefSubscription = (value) => {
  const candidates = [
    value?.daily_brief_subscription,
    value?.dailyBriefSubscription,
    value?.subscription,
    value,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDailyBriefSubscription(candidate);
    if (normalized) return normalized;
  }

  return null;
};

const state = reactive({
  accessToken: null,
  user: readStoredUser(),
  dailyBriefSubscription: null,
  dailyBriefSubscriptionLoading: false,
  dailyBriefSubscriptionLoaded: false,
  initializing: false,
  initialized: false,
});

let refreshPromise = null;
let initializePromise = null;

const applyAuthResponse = (data) => {
  state.accessToken = data?.access ?? null;
  state.user = mergeUsers(state.user, deriveUserFromAccessToken(data?.access), data?.user);
  const dailyBriefSubscription = extractDailyBriefSubscription(data);
  if (dailyBriefSubscription) {
    state.dailyBriefSubscription = dailyBriefSubscription;
    state.dailyBriefSubscriptionLoaded = true;
  }
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
  state.dailyBriefSubscription = null;
  state.dailyBriefSubscriptionLoading = false;
  state.dailyBriefSubscriptionLoaded = false;
  writeStoredUser(null);
};

const setDailyBriefSubscription = (subscription) => {
  state.dailyBriefSubscription = extractDailyBriefSubscription(subscription);
  state.dailyBriefSubscriptionLoaded = true;
  return state.dailyBriefSubscription;
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

const fetchDailyBriefSubscription = async ({ force = false } = {}) => {
  if (!state.accessToken) {
    state.dailyBriefSubscription = null;
    state.dailyBriefSubscriptionLoaded = false;
    return null;
  }

  if (state.dailyBriefSubscriptionLoading) return state.dailyBriefSubscription;
  if (state.dailyBriefSubscriptionLoaded && !force) return state.dailyBriefSubscription;

  state.dailyBriefSubscriptionLoading = true;

  try {
    const data = await requestJson('/api/daily-brief-subscription/');
    return setDailyBriefSubscription(data);
  } catch (error) {
    if (error?.status === 404) {
      state.dailyBriefSubscription = null;
      state.dailyBriefSubscriptionLoaded = true;
      return null;
    }
    throw error;
  } finally {
    state.dailyBriefSubscriptionLoading = false;
  }
};

const subscribeToDailyBrief = async (payload = {}) => {
  const data = await requestJson('/api/daily-brief-subscription/subscribe/', {
    method: 'POST',
    body: payload,
  });

  const subscription = extractDailyBriefSubscription(data) ?? {
    status: 'active',
    is_active: true,
    email: state.user?.email ?? null,
  };

  return setDailyBriefSubscription(subscription);
};

const unsubscribeFromDailyBrief = async () => {
  const data = await requestJson('/api/daily-brief-subscription/unsubscribe/', {
    method: 'POST',
  });

  const subscription = extractDailyBriefSubscription(data) ?? {
    status: 'unsubscribed',
    is_active: false,
    email: state.user?.email ?? null,
  };

  return setDailyBriefSubscription(subscription);
};

const displayName = computed(() => {
  const user = state.user;
  if (!user) return state.accessToken ? 'Signed in' : '';

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.username || user.email || 'Signed in';
});

const isAuthenticated = computed(() => Boolean(state.accessToken));
const dailyBriefSubscription = computed(() => state.dailyBriefSubscription);
const dailyBriefSubscriptionStatus = computed(() => state.dailyBriefSubscription?.status ?? null);
const isDailyBriefSubscribed = computed(() => dailyBriefSubscriptionStatus.value === 'active');

const authStore = {
  state,
  displayName,
  isAuthenticated,
  dailyBriefSubscription,
  dailyBriefSubscriptionStatus,
  isDailyBriefSubscribed,
  setAccessToken,
  setUser,
  setDailyBriefSubscription,
  initialize,
  register,
  verifyEmail,
  login,
  resendVerification,
  fetchDailyBriefSubscription,
  subscribeToDailyBrief,
  unsubscribeFromDailyBrief,
  refreshAccessToken,
  logout,
  clearSession,
};

export const useAuthStore = () => authStore;

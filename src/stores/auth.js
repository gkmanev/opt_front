import { computed, reactive } from 'vue';
import { configureApiClient, extractApiErrorMessage, requestJson } from '../api/client';

const USER_STORAGE_KEY = 'putpulse.auth.user';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStoredUser = () => {
  if (!canUseStorage()) return null;

  try {
    const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);
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
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
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

const normalizePremiumSubscriptionRecord = (value) => {
  if (!value || typeof value !== 'object') {
    return {
      status: null,
      is_active: false,
      start_date: null,
      current_period_start: null,
      current_period_end: null,
      created_at: null,
      cancel_at_period_end: false,
      cancel_at: null,
      canceled_at: null,
      ended_at: null,
    };
  }

  const status = typeof value.status === 'string' && value.status.trim()
    ? value.status.trim().toLowerCase()
    : null;
  const isActive = Boolean(
    value.is_active
    ?? value.is_premium
    ?? (status === 'active' || status === 'trialing'),
  );

  return {
    status,
    is_active: isActive,
    start_date: value.start_date ?? null,
    current_period_start: value.current_period_start ?? null,
    current_period_end: value.current_period_end ?? null,
    created_at: value.created_at ?? null,
    cancel_at_period_end: Boolean(value.cancel_at_period_end),
    cancel_at: value.cancel_at ?? null,
    canceled_at: value.canceled_at ?? null,
    ended_at: value.ended_at ?? null,
  };
};

const normalizePremiumEntitlements = (value) => {
  if (!value || typeof value !== 'object') return null;

  const normalized = {
    daily_queries: value.daily_queries ?? null,
    max_scan_limit: value.max_scan_limit ?? null,
    max_extra_pages: value.max_extra_pages ?? null,
    daily_analyze_stock: value.daily_analyze_stock ?? null,
    max_history_items: value.max_history_items ?? null,
  };

  return Object.values(normalized).some((entryValue) => entryValue !== null && entryValue !== undefined)
    ? normalized
    : null;
};

const normalizePremiumSubscription = (value) => {
  if (!value || typeof value !== 'object') return null;

  const hasEndpointShape = 'subscription' in value
    || 'plan' in value
    || 'entitlements' in value
    || 'trial_days_left' in value
    || 'trial_expired' in value
    || 'has_full_access' in value;
  const subscription = normalizePremiumSubscriptionRecord(hasEndpointShape ? (value.subscription ?? value) : value);
  const normalizedPlan = typeof value.plan === 'string' && value.plan.trim()
    ? value.plan.trim().toLowerCase()
    : null;
  const isPremiumValue = normalizedPlan === 'pro' || subscription.is_active === true;
  const plan = normalizedPlan ?? (isPremiumValue ? 'pro' : 'free');

  return {
    plan,
    tier: isPremiumValue ? 'premium' : 'free',
    status: subscription.status,
    is_premium: isPremiumValue,
    is_active: subscription.is_active,
    subscription,
    start_date: subscription.start_date,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    created_at: subscription.created_at,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at,
    canceled_at: subscription.canceled_at,
    ended_at: subscription.ended_at,
    entitlements: normalizePremiumEntitlements(value.entitlements),
    trial_days_left: value.trial_days_left ?? null,
    trial_expired: value.trial_expired === true,
    has_full_access: value.has_full_access ?? null,
  };
};

const state = reactive({
  accessToken: null,
  user: readStoredUser(),
  dailyBriefSubscription: null,
  dailyBriefSubscriptionLoading: false,
  dailyBriefSubscriptionLoaded: false,
  premiumSubscription: null,
  premiumSubscriptionLoading: false,
  premiumSubscriptionLoaded: false,
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
  const premiumSubscription = normalizePremiumSubscription(data?.premium_subscription);
  if (premiumSubscription) {
    state.premiumSubscription = premiumSubscription;
    state.premiumSubscriptionLoaded = true;
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
  state.premiumSubscription = null;
  state.premiumSubscriptionLoading = false;
  state.premiumSubscriptionLoaded = false;
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
  let data;
  try {
    data = await requestJson('/api/daily-brief-subscription/subscribe/', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    if (error?.status === 404) {
      throw new Error('Daily Top 3 subscribe endpoint not found. Expected POST /api/daily-brief-subscription/subscribe/.');
    }
    throw error;
  }

  const subscription = extractDailyBriefSubscription(data) ?? {
    status: 'active',
    is_active: true,
    email: state.user?.email ?? null,
  };

  return setDailyBriefSubscription(subscription);
};

const unsubscribeFromDailyBrief = async () => {
  let data;
  try {
    data = await requestJson('/api/daily-brief-subscription/unsubscribe/', {
      method: 'POST',
    });
  } catch (error) {
    if (error?.status === 404) {
      throw new Error('Daily Top 3 unsubscribe endpoint not found. Expected POST /api/daily-brief-subscription/unsubscribe/.');
    }
    throw error;
  }

  const subscription = extractDailyBriefSubscription(data) ?? {
    status: 'unsubscribed',
    is_active: false,
    email: state.user?.email ?? null,
  };

  return setDailyBriefSubscription(subscription);
};

const fetchPremiumSubscription = async ({ force = false } = {}) => {
  if (!state.accessToken) {
    state.premiumSubscription = null;
    state.premiumSubscriptionLoaded = false;
    return null;
  }

  if (state.premiumSubscriptionLoading) return state.premiumSubscription;
  if (state.premiumSubscriptionLoaded && !force) return state.premiumSubscription;

  state.premiumSubscriptionLoading = true;

  try {
    const data = await requestJson('/api/premium-subscription/');
    state.premiumSubscription = normalizePremiumSubscription(data);
    state.premiumSubscriptionLoaded = true;
    return state.premiumSubscription;
  } catch (error) {
    if (error?.status === 404) {
      state.premiumSubscription = {
        plan: 'free',
        tier: 'free',
        status: null,
        is_premium: false,
        is_active: false,
        subscription: {
          status: null,
          is_active: false,
          current_period_end: null,
          created_at: null,
          cancel_at_period_end: false,
        },
        current_period_end: null,
        created_at: null,
        cancel_at_period_end: false,
        entitlements: {
          daily_queries: 5,
          max_scan_limit: 5,
          max_extra_pages: 0,
          daily_analyze_stock: 1,
          max_history_items: 8,
        },
        trial_days_left: null,
        trial_expired: false,
        has_full_access: false,
      };
      state.premiumSubscriptionLoaded = true;
      return state.premiumSubscription;
    }
    throw error;
  } finally {
    state.premiumSubscriptionLoading = false;
  }
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
const premiumSubscription = computed(() => state.premiumSubscription);
const isPremium = computed(() => state.premiumSubscription?.is_premium === true);

const authStore = {
  state,
  displayName,
  isAuthenticated,
  dailyBriefSubscription,
  dailyBriefSubscriptionStatus,
  isDailyBriefSubscribed,
  premiumSubscription,
  isPremium,
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
  fetchPremiumSubscription,
  refreshAccessToken,
  logout,
  clearSession,
};

export const useAuthStore = () => authStore;

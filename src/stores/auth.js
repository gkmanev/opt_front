import { computed, reactive } from 'vue';
import { configureApiClient, extractApiErrorMessage, requestJson } from '../api/client';

const state = reactive({
  accessToken: null,
  user: null,
  initializing: false,
  initialized: false,
});

let refreshPromise = null;
let initializePromise = null;

const applyAuthResponse = (data) => {
  state.accessToken = data?.access ?? null;
  state.user = data?.user ?? state.user ?? null;
};

const setAccessToken = (accessToken) => {
  state.accessToken = accessToken ?? null;
};

const setUser = (user) => {
  state.user = user ?? null;
};

const clearSession = () => {
  state.accessToken = null;
  state.user = null;
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

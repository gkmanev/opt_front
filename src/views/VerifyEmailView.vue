<template>
  <section class="auth-shell">
    <div class="auth-backdrop"></div>
    <div class="auth-layout auth-layout--narrow">
      <section class="auth-panel">
        <button class="auth-close" type="button" aria-label="Close" @click="emit('back-home')">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
        <button class="auth-home-link" type="button" @click="emit('back-home')">Back to app</button>

        <p class="auth-eyebrow">Verify email</p>
        <h1 v-if="status === 'loading'">Verifying your email...</h1>
        <h1 v-else-if="status === 'success'">Email verified</h1>
        <h1 v-else>Verification failed</h1>

        <p class="auth-copy">{{ message }}</p>

        <div v-if="status === 'loading'" class="auth-spinner" aria-hidden="true"></div>

        <div v-if="status !== 'loading'" class="auth-actions">
          <button class="btn btn-primary" type="button" @click="status === 'success' ? emit('verified') : emit('navigate-login')">
            {{ status === 'success' ? 'Continue to app' : 'Go to login' }}
          </button>
          <button v-if="status === 'error'" class="btn btn-outline" type="button" @click="emit('back-home')">
            Back home
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['verified', 'back-home', 'navigate-login']);

const auth = useAuthStore();

const status = ref('loading');
const message = ref('Confirming your verification token with the backend.');

let redirectTimer = null;

const runVerification = async () => {
  const token = new URLSearchParams(window.location.search).get('token');

  if (!token) {
    status.value = 'error';
    message.value = 'Missing verification token';
    return;
  }

  try {
    await auth.verifyEmail(token);
    status.value = 'success';
    message.value = 'Your account is active and the authenticated session is ready. Redirecting into the dashboard.';
    redirectTimer = window.setTimeout(() => emit('verified'), 700);
  } catch (error) {
    status.value = 'error';
    message.value = error.message || 'Invalid or expired verification link';
  }
};

onMounted(runVerification);

onUnmounted(() => {
  if (redirectTimer) window.clearTimeout(redirectTimer);
});
</script>

<style scoped>
.auth-shell {
  position: fixed;
  inset: 0;
  z-index: 80;
  overflow-y: auto;
  padding: 1rem;
  background: transparent;
  color: #f8fafc;
}

.auth-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(2, 6, 23, 0.32);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: auth-backdrop-in 700ms ease-out both;
}

.auth-layout {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  margin: 0 auto;
  min-height: calc(100vh - 2rem);
  display: grid;
  align-items: center;
  padding: 0;
  animation: auth-layout-enter 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.auth-layout--narrow {
  max-width: 560px;
}

.auth-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.4rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02) 32%, rgba(9, 14, 28, 0.92) 70%),
    rgba(9, 14, 28, 0.88);
  backdrop-filter: blur(18px) saturate(155%);
  -webkit-backdrop-filter: blur(18px) saturate(155%);
  box-shadow:
    0 22px 60px rgba(2, 6, 23, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 2rem;
  animation: auth-panel-enter 760ms cubic-bezier(0.16, 1, 0.3, 1) 40ms both;
}

.auth-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.4rem;
  border-radius: 0.5rem;
  line-height: 0;
  transition: color 0.15s ease, background 0.15s ease;
}

.auth-close:hover {
  color: #cbd5e1;
  background: rgba(148, 163, 184, 0.08);
}

.auth-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(125, 211, 252, 0.18), transparent 32%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 28%, transparent 72%, rgba(255, 255, 255, 0.04));
  pointer-events: none;
}

.auth-panel::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: calc(1.4rem - 1px);
  border: 1px solid rgba(255, 255, 255, 0.04);
  pointer-events: none;
}

.auth-home-link {
  border: none;
  background: none;
  color: #7dd3fc;
  font: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 2rem;
}

.auth-eyebrow {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.auth-panel h1 {
  margin: 0;
  font-size: 2rem;
}

.auth-copy {
  margin: 1rem 0 1.5rem;
  color: #94a3b8;
  line-height: 1.7;
}

.auth-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.auth-spinner {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  border: 3px solid rgba(148, 163, 184, 0.18);
  border-top-color: #22d3ee;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes auth-backdrop-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes auth-layout-enter {
  from {
    opacity: 0;
    transform: translateY(1.1rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes auth-panel-enter {
  from {
    opacity: 0;
    transform: translateY(1.6rem) scale(0.985);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@media (max-width: 640px) {
  .auth-panel {
    padding: 1.5rem;
  }
}
</style>

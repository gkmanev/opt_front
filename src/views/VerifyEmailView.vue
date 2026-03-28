<template>
  <section class="auth-shell">
    <div class="auth-backdrop"></div>
    <div class="auth-layout auth-layout--narrow">
      <section class="auth-panel">
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.16), transparent 24%),
    radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.16), transparent 28%),
    #020617;
  color: #f8fafc;
}

.auth-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.35), rgba(2, 6, 23, 0.88));
}

.auth-layout {
  position: relative;
  z-index: 1;
  width: min(1100px, calc(100% - 2rem));
  margin: 0 auto;
  min-height: 100vh;
  display: grid;
  align-items: center;
  padding: 2rem 0;
}

.auth-layout--narrow {
  max-width: 560px;
}

.auth-panel {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.4rem;
  background: rgba(9, 14, 28, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 22px 60px rgba(2, 6, 23, 0.45);
  padding: 2rem;
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
  font-size: clamp(2rem, 4vw, 2.75rem);
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

@media (max-width: 640px) {
  .auth-panel {
    padding: 1.5rem;
  }
}
</style>

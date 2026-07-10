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

        <div class="auth-form-header">
          <div>
            <p class="auth-eyebrow">Login</p>
            <h1>Welcome back</h1>
          </div>
          <button class="link-button" type="button" @click="emit('navigate-signup')">Create account</button>
        </div>

        <p class="auth-copy">
          {{ props.dailyBriefIntent
            ? 'Log in with your verified account to finish subscribing to the Daily Top 3. If the backend reports the account is unverified, you can resend the verification email here.'
            : 'Log in with a verified email address or username. If the backend reports the account is unverified, you can resend the verification email here.' }}
        </p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <label class="auth-field">
            <span>Email or username</span>
            <input v-model.trim="identifier" type="text" autocomplete="username" required />
          </label>

          <label class="auth-field">
            <span>Password</span>
            <input v-model="password" type="password" autocomplete="current-password" required />
          </label>

          <p v-if="errorMessage" class="auth-feedback auth-feedback--error">{{ errorMessage }}</p>
          <p v-if="statusMessage" class="auth-feedback auth-feedback--success">{{ statusMessage }}</p>

          <button class="btn btn-primary btn-block" type="submit" :disabled="submitting">
            {{ submitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div v-if="showResend" class="auth-resend">
          <div>
            <p class="auth-resend-title">Email not verified</p>
            <p class="auth-resend-copy">Resend the verification message to finish account activation.</p>
          </div>
          <button class="btn btn-outline" type="button" :disabled="resending || !identifier" @click="handleResend">
            {{ resending ? 'Sending...' : 'Resend verification' }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { isEmailNotVerifiedError, useAuthStore } from '../stores/auth';

const props = defineProps({
  dailyBriefIntent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['authenticated', 'back-home', 'navigate-signup']);

const auth = useAuthStore();

const identifier = ref('');
const password = ref('');
const submitting = ref(false);
const resending = ref(false);
const errorMessage = ref('');
const statusMessage = ref('');
const showResend = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = '';
  statusMessage.value = '';
  showResend.value = false;

  try {
    await auth.login({
      identifier: identifier.value,
      password: password.value,
    });
    emit('authenticated');
  } catch (error) {
    errorMessage.value = error.message || 'Unable to sign in.';
    showResend.value = isEmailNotVerifiedError(error);
  } finally {
    submitting.value = false;
  }
};

const handleResend = async () => {
  resending.value = true;
  errorMessage.value = '';
  statusMessage.value = '';

  try {
    await auth.resendVerification(identifier.value);
    statusMessage.value = 'Verification email sent. Check your inbox.';
  } catch (error) {
    errorMessage.value = error.message || 'Unable to resend verification email.';
  } finally {
    resending.value = false;
  }
};
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

.auth-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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

.auth-form {
  display: grid;
  gap: 1rem;
}

.auth-field {
  display: grid;
  gap: 0.45rem;
}

.auth-field span {
  font-size: 0.85rem;
  color: #cbd5e1;
}

.auth-field input {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.85rem;
  background: rgba(15, 23, 42, 0.84);
  color: #f8fafc;
  padding: 0.85rem 0.95rem;
  font: inherit;
}

.auth-field input:focus {
  outline: 2px solid rgba(34, 211, 238, 0.4);
  outline-offset: 2px;
}

.auth-feedback {
  margin: 0;
  padding: 0.8rem 0.95rem;
  border-radius: 0.85rem;
  font-size: 0.92rem;
}

.auth-feedback--error {
  background: rgba(127, 29, 29, 0.3);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.auth-feedback--success {
  background: rgba(20, 83, 45, 0.3);
  border: 1px solid rgba(74, 222, 128, 0.35);
  color: #bbf7d0;
}

.auth-resend {
  margin-top: 1rem;
  padding: 1rem 1.05rem;
  border-radius: 1rem;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: rgba(8, 47, 73, 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.auth-resend-title {
  margin: 0;
  font-weight: 600;
}

.auth-resend-copy {
  margin: 0.35rem 0 0;
  color: #cbd5e1;
  font-size: 0.92rem;
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

  .auth-form-header,
  .auth-resend {
    display: grid;
  }
}
</style>

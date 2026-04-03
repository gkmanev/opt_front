<template>
  <section class="auth-shell">
    <div class="auth-backdrop"></div>
    <div class="auth-layout auth-layout--narrow">
      <section class="auth-panel">
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top center, rgba(14, 165, 233, 0.16), transparent 28%),
    radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.14), transparent 24%),
    #020617;
  color: #f8fafc;
}

.auth-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.88));
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

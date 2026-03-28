<template>
  <section class="auth-shell">
    <div class="auth-backdrop"></div>
    <div class="auth-layout">
      <aside class="auth-panel auth-panel--accent">
        <button class="auth-home-link" type="button" @click="emit('back-home')">Back to app</button>
        <p class="auth-eyebrow">Register</p>
        <h1>{{ props.dailyBriefIntent ? 'Create your account for the Daily Top 3' : 'Create your PutPulse account' }}</h1>
        <p class="auth-copy">
          {{ props.dailyBriefIntent
            ? 'Create your free account, verify your email, and we will turn on the Daily Top 3 if you keep the opt-in selected.'
            : 'Start with registration, verify your email, then the backend will establish the authenticated session.' }}
        </p>
        <ul class="auth-points">
          <li>Username and email are both captured at sign-up.</li>
          <li>Email verification happens before local session creation.</li>
          <li v-if="props.dailyBriefIntent">Daily Top 3 email delivery starts only after verification.</li>
          <li>Access token stays in memory while refresh remains cookie-based.</li>
        </ul>
      </aside>

      <section class="auth-panel">
        <div v-if="registrationComplete" class="auth-success">
          <p class="auth-eyebrow">Check your inbox</p>
          <h2>Verify {{ submittedEmail }}</h2>
          <p class="auth-copy">
            {{ form.daily_brief_opt_in
              ? 'The account was created. Use the verification link from the email to finish activation and enable the Daily Top 3.'
              : 'The account was created. Use the verification link from the email to finish activation.' }}
          </p>
          <div class="auth-actions">
            <button class="btn btn-primary" type="button" @click="emit('navigate-login')">Go to login</button>
            <button class="btn btn-outline" type="button" @click="registrationComplete = false">Register another account</button>
          </div>
        </div>

        <form v-else class="auth-form" @submit.prevent="handleSubmit">
          <div class="auth-form-header">
            <h2>Create account</h2>
            <button class="link-button" type="button" @click="emit('navigate-login')">Already verified?</button>
          </div>

          <p v-if="props.dailyBriefIntent" class="auth-feedback auth-feedback--info">
            This account will be used for the Daily Top 3 email subscription.
          </p>

          <label class="auth-field">
            <span>Username</span>
            <input v-model.trim="form.username" type="text" autocomplete="username" required />
          </label>

          <div class="auth-grid">
            <label class="auth-field">
              <span>First name</span>
              <input v-model.trim="form.first_name" type="text" autocomplete="given-name" required />
            </label>

            <label class="auth-field">
              <span>Last name</span>
              <input v-model.trim="form.last_name" type="text" autocomplete="family-name" required />
            </label>
          </div>

          <label class="auth-field">
            <span>Email</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" required />
          </label>

          <label class="auth-field">
            <span>Password</span>
            <input v-model="form.password" type="password" autocomplete="new-password" minlength="8" required />
          </label>

          <label class="auth-checkbox">
            <input v-model="form.daily_brief_opt_in" type="checkbox" />
            <span>
              <strong>Email me the Daily Top 3</strong>
              <small>Available after email verification. You can unsubscribe later.</small>
            </span>
          </label>

          <p v-if="errorMessage" class="auth-feedback auth-feedback--error">{{ errorMessage }}</p>

          <button class="btn btn-primary btn-block" type="submit" :disabled="submitting">
            {{ submitting ? 'Creating account...' : 'Create account' }}
          </button>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  dailyBriefIntent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back-home', 'navigate-login']);

const auth = useAuthStore();

const form = reactive({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  daily_brief_opt_in: props.dailyBriefIntent,
});

const submitting = ref(false);
const errorMessage = ref('');
const registrationComplete = ref(false);
const submittedEmail = ref('');

const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = '';

  try {
    await auth.register({ ...form });
    submittedEmail.value = form.email;
    registrationComplete.value = true;
  } catch (error) {
    errorMessage.value = error.message || 'Unable to create your account.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auth-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.18), transparent 32%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2), transparent 28%),
    #020617;
  color: #f8fafc;
}

.auth-backdrop {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.28), rgba(2, 6, 23, 0.82)),
    linear-gradient(180deg, rgba(2, 6, 23, 0.16), transparent 48%);
}

.auth-layout {
  position: relative;
  z-index: 1;
  width: min(1100px, calc(100% - 2rem));
  margin: 0 auto;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(320px, 520px);
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem 0;
}

.auth-panel {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.4rem;
  background: rgba(9, 14, 28, 0.88);
  backdrop-filter: blur(12px);
  box-shadow: 0 22px 60px rgba(2, 6, 23, 0.45);
  padding: 2rem;
}

.auth-panel--accent {
  background:
    linear-gradient(180deg, rgba(6, 20, 38, 0.96), rgba(8, 15, 26, 0.92)),
    rgba(9, 14, 28, 0.88);
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
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.auth-panel h1,
.auth-panel h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.auth-panel h2 {
  font-size: 1.65rem;
}

.auth-copy {
  margin: 1rem 0 0;
  color: #94a3b8;
  line-height: 1.7;
}

.auth-points {
  margin: 1.5rem 0 0;
  padding-left: 1rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.auth-form {
  display: grid;
  gap: 1rem;
}

.auth-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.auth-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.auth-feedback--info {
  background: rgba(8, 47, 73, 0.42);
  border: 1px solid rgba(34, 211, 238, 0.24);
  color: #d7f7ff;
}

.auth-success {
  display: grid;
  gap: 1rem;
}

.auth-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.auth-checkbox {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 0.95rem;
  background: rgba(15, 23, 42, 0.55);
}

.auth-checkbox input {
  margin-top: 0.15rem;
}

.auth-checkbox span {
  display: grid;
  gap: 0.25rem;
  color: #e2e8f0;
}

.auth-checkbox small {
  color: #94a3b8;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .auth-layout {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .auth-panel {
    padding: 1.5rem;
  }

  .auth-grid,
  .auth-form-header {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>

<template>
  <section class="auth-shell">
    <div class="auth-backdrop"></div>
    <div class="auth-layout">

      <!-- Left: plan selector -->
      <aside class="auth-panel auth-panel--plans">
        <button class="auth-home-link" type="button" @click="emit('back-home')">Back to app</button>
        <p class="auth-eyebrow">Choose your plan</p>
        <h1>Start building your edge</h1>

        <div class="plan-cards">
          <!-- Basic -->
          <button
            class="plan-card"
            :class="{ 'plan-card--selected': selectedPlan === 'basic' }"
            type="button"
            @click="selectedPlan = 'basic'"
          >
            <div class="plan-card-top">
              <div class="plan-card-title-row">
                <span class="plan-card-name">Basic</span>
                <span class="plan-card-selector" aria-hidden="true"></span>
              </div>
              <div class="plan-card-price">
                <span class="plan-price-amount">Free</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>5 screener results / day</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Strategy guides</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Basic filters</li>
              <li><span class="plan-feat-dot plan-feat-dot--off"></span>Full screener access</li>
              <li><span class="plan-feat-dot plan-feat-dot--off"></span>Daily Top 3 briefing</li>
              <li><span class="plan-feat-dot plan-feat-dot--off"></span>Wheel setup details</li>
            </ul>
          </button>

          <!-- Pro -->
          <button
            class="plan-card plan-card--pro"
            :class="{ 'plan-card--selected': selectedPlan === 'pro' }"
            type="button"
            @click="selectedPlan = 'pro'"
          >
            <span class="plan-badge">Most popular</span>
            <div class="plan-card-top">
              <div class="plan-card-title-row">
                <span class="plan-card-name">Pro</span>
                <span class="plan-card-selector" aria-hidden="true"></span>
              </div>
              <div class="plan-card-price">
                <span class="plan-price-currency">$</span>
                <span class="plan-price-amount">20</span>
                <span class="plan-price-period">/ mo</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Everything in Basic</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Unlimited screener results</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>All filters + sorting</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Daily Top 3 email briefing</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Wheel setup details</li>
              <li><span class="plan-feat-dot plan-feat-dot--on"></span>Full data access</li>
            </ul>
          </button>
        </div>
      </aside>

      <!-- Right: registration form -->
      <section class="auth-panel">
        <div v-if="registrationComplete" class="auth-success">
          <p class="auth-eyebrow">Check your inbox</p>
          <h2>Verify {{ submittedEmail }}</h2>
          <p class="auth-copy">
            <template v-if="submittedPlan === 'pro'">
              Your account was created. Verify your email first — once you log in, we'll guide
              you straight to Pro checkout to complete your subscription.
            </template>
            <template v-else>
              {{ form.daily_brief_opt_in
                ? 'The account was created. Use the verification link to finish activation and enable the Daily Top 3.'
                : 'The account was created. Use the verification link to finish activation.' }}
            </template>
          </p>
          <div class="auth-actions">
            <button class="btn btn-primary" type="button" @click="emit('navigate-login')">Go to login</button>
            <button class="btn btn-outline" type="button" @click="resetForm">Register another account</button>
          </div>
        </div>

        <form v-else class="auth-form" @submit.prevent="handleSubmit">
          <div class="auth-form-header">
            <div class="auth-form-title-row">
              <h2>Create account</h2>
              <span class="selected-plan-badge" :class="`selected-plan-badge--${selectedPlan}`">
                {{ selectedPlan === 'pro' ? 'Pro · $20/mo' : 'Basic · Free' }}
              </span>
            </div>
            <button class="link-button" type="button" @click="emit('navigate-login')">Already have an account?</button>
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
            <template v-if="submitting">Creating account…</template>
            <template v-else-if="selectedPlan === 'pro'">Create account &amp; go Pro</template>
            <template v-else>Create free account</template>
          </button>
        </form>
      </section>

    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const PRO_INTENT_KEY = 'putpulse.pending.pro';
const SIGNUP_PLAN_KEY = 'putpulse.signup.plan';

const props = defineProps({
  dailyBriefIntent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back-home', 'navigate-login']);

const auth = useAuthStore();

const selectedPlan = ref('basic');

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
const submittedPlan = ref('basic');

onMounted(() => {
  const urlPlan = new URLSearchParams(window.location.search).get('plan');
  if (urlPlan === 'pro') {
    selectedPlan.value = 'pro';
    return;
  }
  try {
    if (sessionStorage.getItem(SIGNUP_PLAN_KEY) === 'pro') {
      selectedPlan.value = 'pro';
      sessionStorage.removeItem(SIGNUP_PLAN_KEY);
    }
  } catch { /* ignore */ }
});

const resetForm = () => {
  registrationComplete.value = false;
  form.username = '';
  form.email = '';
  form.password = '';
  form.first_name = '';
  form.last_name = '';
  form.daily_brief_opt_in = props.dailyBriefIntent;
};

const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = '';

  try {
    await auth.register({ ...form });
    submittedEmail.value = form.email;
    submittedPlan.value = selectedPlan.value;

    if (selectedPlan.value === 'pro') {
      try { sessionStorage.setItem(PRO_INTENT_KEY, '1'); } catch { /* ignore */ }
    }

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
  grid-template-columns: minmax(280px, 440px) minmax(320px, 520px);
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  padding: 0;
  animation: auth-layout-enter 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
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

.auth-panel--plans {
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
  margin-bottom: 1.5rem;
  display: block;
}

.auth-eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.auth-panel h1 {
  margin: 0 0 1.5rem;
  font-size: 1.75rem;
  line-height: 1.1;
}

.auth-panel h2 {
  margin: 0;
  font-size: 1.5rem;
}

/* ---- Plan cards ---- */
.plan-cards {
  display: grid;
  gap: 0.85rem;
}

.plan-card {
  position: relative;
  width: 100%;
  text-align: left;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1.1rem;
  padding: 1.1rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  color: #f8fafc;
  font: inherit;
}

.plan-card:hover {
  border-color: rgba(148, 163, 184, 0.3);
}

.plan-card--selected {
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.2), 0 8px 28px rgba(34, 211, 238, 0.1);
}

.plan-card--pro {
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 50%),
    rgba(15, 23, 42, 0.7);
}

.plan-badge {
  position: absolute;
  top: -0.6rem;
  left: 1.1rem;
  background: linear-gradient(90deg, #22d3ee, #60a5fa);
  color: #082f49;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.6rem;
  border-radius: 99px;
}

.plan-card-top {
  margin-bottom: 0.85rem;
}

.plan-card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.plan-card-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #cbd5e1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.plan-card-selector {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1.5px solid rgba(148, 163, 184, 0.35);
  transition: border-color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.plan-card--selected .plan-card-selector {
  border-color: #22d3ee;
  background: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2);
}

.plan-card-price {
  display: flex;
  align-items: baseline;
  gap: 0.1rem;
}

.plan-price-currency {
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
}

.plan-price-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1;
}

.plan-price-period {
  font-size: 0.82rem;
  color: #64748b;
  margin-left: 0.1rem;
}

.plan-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
  border-top: 1px solid rgba(51, 65, 85, 0.7);
  padding-top: 0.85rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #94a3b8;
}

.plan-feat-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.plan-feat-dot--on {
  background: #22d3ee;
}

.plan-feat-dot--off {
  background: rgba(100, 116, 139, 0.4);
}

/* ---- Form ---- */
.auth-form {
  display: grid;
  gap: 1rem;
}

.auth-form-header {
  display: grid;
  gap: 0.5rem;
}

.auth-form-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.selected-plan-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

.selected-plan-badge--basic {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.selected-plan-badge--pro {
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2));
  color: #67e8f9;
  border: 1px solid rgba(34, 211, 238, 0.35);
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

.auth-copy {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
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

.link-button {
  background: none;
  border: none;
  color: #7dd3fc;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.link-button:hover {
  color: #bae6fd;
}

.btn-block {
  width: 100%;
  justify-content: center;
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
  .auth-form-title-row {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>

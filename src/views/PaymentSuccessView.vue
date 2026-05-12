<template>
  <div class="ps-page container">
    <div class="ps-card">
      <template v-if="status === 'loading'">
        <div class="ps-spinner" aria-hidden="true"></div>
        <h1>Confirming your subscription&hellip;</h1>
        <p>Please wait while we verify your payment.</p>
      </template>

      <template v-else-if="status === 'success'">
        <div class="ps-icon ps-icon--success" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" aria-hidden="true">
            <path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1>You're all set!</h1>
        <p>Your Pro subscription is now active. Taking you to the screener&hellip;</p>
      </template>

      <template v-else>
        <div class="ps-icon ps-icon--warn" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" aria-hidden="true">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1>Payment received</h1>
        <p>Your payment was processed but the subscription is still activating. Please check the screener in a moment — it may take up to a minute.</p>
        <button class="btn btn-primary ps-cta" type="button" @click="emit('go-home')">
          Go to screener
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['go-home']);

const auth = useAuthStore();
const status = ref('loading');

onMounted(async () => {
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    await auth.fetchPremiumSubscription({ force: true });
    if (auth.isPremium.value) {
      status.value = 'success';
      setTimeout(() => emit('go-home'), 2500);
      return;
    }
  }
  status.value = 'timeout';
});
</script>

<style scoped>
.ps-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.ps-card {
  width: 100%;
  max-width: 480px;
  text-align: center;
  padding: 3rem 2rem;
  background:
    radial-gradient(circle at top center, rgba(34, 211, 238, 0.1), transparent 50%),
    rgba(9, 14, 28, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.ps-card h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #f8fafc;
}

.ps-card p {
  margin: 0;
  color: #94a3b8;
  line-height: 1.65;
  max-width: 36ch;
}

.ps-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.ps-icon--success {
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.35);
  color: #22d3ee;
}

.ps-icon--warn {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.ps-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(34, 211, 238, 0.2);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: ps-spin 0.8s linear infinite;
}

@keyframes ps-spin {
  to { transform: rotate(360deg); }
}

.ps-cta {
  margin-top: 0.5rem;
}
</style>

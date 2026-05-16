<template>
  <Teleport to="body">
    <Transition name="pricing-modal">
      <div
        v-if="open"
        class="pricing-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-title"
        @click.self="emit('close')"
      >
        <div class="pricing-modal">
          <button class="pricing-close" type="button" aria-label="Close" @click="emit('close')">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <div class="pricing-header">
            <p class="pricing-eyebrow">Premium</p>
            <h2 id="pricing-title">Unlock all screener ideas</h2>
            <p class="pricing-subtitle">
              Free accounts see the top 5 results. Premium gives you the full list — every
              opportunity the screener finds, updated daily.
            </p>
          </div>

          <div class="pricing-plans">
            <div class="pricing-plan">
              <div class="pricing-plan-header">
                <h3>Monthly</h3>
                <div class="pricing-amount">
                  <span class="pricing-currency">€</span>
                  <span class="pricing-price">{{ monthlyPrice }}</span>
                  <span class="pricing-period">/ mo</span>
                </div>
              </div>
              <button
                class="btn btn-outline pricing-plan-cta"
                type="button"
                :disabled="checkoutLoading"
                @click="checkout('monthly')"
              >
                Get Monthly
              </button>
            </div>

            <div class="pricing-plan pricing-plan--featured">
              <span class="pricing-badge">Best value</span>
              <div class="pricing-plan-header">
                <h3>Annual</h3>
                <div class="pricing-amount">
                  <span class="pricing-currency">€</span>
                  <span class="pricing-price">{{ annualPrice }}</span>
                  <span class="pricing-period">/ yr</span>
                </div>
                <p class="pricing-save">Save {{ annualSavePct }}% vs monthly</p>
              </div>
              <button
                class="btn btn-primary pricing-plan-cta"
                type="button"
                :disabled="checkoutLoading"
                @click="checkout('annual')"
              >
                Get Annual
              </button>
            </div>
          </div>

          <ul class="pricing-features">
            <li>
              <span class="pricing-check" aria-hidden="true"></span>
              Full screener — all weekly ideas, no row limit
            </li>
            <li>
              <span class="pricing-check" aria-hidden="true"></span>
              All filters: price, RSI, ROI, delta, score
            </li>
            <li>
              <span class="pricing-check" aria-hidden="true"></span>
              Daily Top 3 email briefing
            </li>
            <li>
              <span class="pricing-check" aria-hidden="true"></span>
              Wheel setup details for every ticker
            </li>
          </ul>

          <p v-if="checkoutError" class="pricing-error">{{ checkoutError }}</p>

          <p v-if="checkoutLoading" class="pricing-waiting">
            Redirecting to checkout&hellip;
          </p>

          <p class="pricing-signin-hint">
            Already a subscriber?
            <button type="button" class="pricing-signin-link" @click="emit('login-required')">Sign in</button>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useStripe } from '../composables/useStripe';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'checkout-success', 'login-required']);

const auth = useAuthStore();
const { openCheckout } = useStripe();

const monthlyPrice = import.meta.env.VITE_STRIPE_PRICE_MONTHLY_DISPLAY ?? '—';
const annualPrice = import.meta.env.VITE_STRIPE_PRICE_ANNUAL_DISPLAY ?? '—';
const annualSavePct = import.meta.env.VITE_STRIPE_ANNUAL_SAVE_PCT ?? '—';

const PRICE_IDS = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY,
  annual: import.meta.env.VITE_STRIPE_PRICE_ID_ANNUAL,
};

watch(() => props.open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = '';
});

const checkoutLoading = ref(false);
const checkoutError = ref(null);

const checkout = async (plan) => {
  if (!auth.isAuthenticated.value) {
    emit('login-required');
    return;
  }

  checkoutError.value = null;
  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    checkoutError.value = 'Checkout is not configured yet. Please try again later.';
    return;
  }

  checkoutLoading.value = true;
  try {
    await openCheckout({
      priceId,
      userId: auth.state.user?.id,
      userEmail: auth.state.user?.email,
      successUrl: `${window.location.origin}/payment-success`,
      cancelUrl: window.location.href,
    });
  } catch (err) {
    checkoutLoading.value = false;
    checkoutError.value = err?.message || 'Unable to open checkout. Please try again.';
  }
};
</script>

<style scoped>
.pricing-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.pricing-modal {
  position: relative;
  width: 100%;
  max-width: 560px;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.12), transparent 40%),
    linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 1));
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 32px 80px rgba(2, 6, 23, 0.6);
}

.pricing-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.4rem;
  border-radius: 0.5rem;
  line-height: 0;
  transition: color 0.15s;
}

.pricing-close:hover {
  color: #94a3b8;
}

.pricing-eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.pricing-header {
  margin-bottom: 1.75rem;
}

.pricing-header h2 {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
  color: #f8fafc;
}

.pricing-subtitle {
  margin: 0;
  color: #94a3b8;
  line-height: 1.65;
  font-size: 0.95rem;
}

.pricing-plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.pricing-plan {
  position: relative;
  padding: 1.25rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pricing-plan--featured {
  border-color: rgba(34, 211, 238, 0.35);
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.1), transparent 50%),
    rgba(15, 23, 42, 0.7);
}

.pricing-badge {
  position: absolute;
  top: -0.6rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #22d3ee, #60a5fa);
  color: #082f49;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  border-radius: 99px;
  white-space: nowrap;
}

.pricing-plan-header h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #cbd5e1;
  font-weight: 600;
}

.pricing-amount {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  color: #f8fafc;
}

.pricing-currency {
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
}

.pricing-price {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.pricing-period {
  font-size: 0.85rem;
  color: #64748b;
  margin-left: 0.1rem;
}

.pricing-save {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: #34d399;
  font-weight: 600;
}

.pricing-plan-cta {
  width: 100%;
  justify-content: center;
}

.pricing-features {
  list-style: none;
  margin: 0 0 0.5rem;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  border-top: 1px solid rgba(51, 65, 85, 0.7);
  padding-top: 1.5rem;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.pricing-check {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: rgba(34, 211, 238, 0.15);
  border: 1px solid #22d3ee;
  display: inline-block;
  flex-shrink: 0;
  position: relative;
}

.pricing-check::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: #22d3ee;
  border-radius: 50%;
}

.pricing-error {
  margin: 1rem 0 0;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  font-size: 0.88rem;
  line-height: 1.5;
}

.pricing-waiting {
  margin: 1rem 0 0;
  color: #67e8f9;
  font-size: 0.88rem;
  text-align: center;
}

.pricing-signin-hint {
  margin: 1.25rem 0 0;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
}

.pricing-signin-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #67e8f9;
  font-size: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.pricing-signin-link:hover {
  color: #a5f3fc;
}

.pricing-modal-enter-active,
.pricing-modal-leave-active {
  transition: opacity 0.2s ease;
}

.pricing-modal-enter-from,
.pricing-modal-leave-to {
  opacity: 0;
}

.pricing-modal-enter-active .pricing-modal,
.pricing-modal-leave-active .pricing-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.pricing-modal-enter-from .pricing-modal,
.pricing-modal-leave-to .pricing-modal {
  transform: translateY(12px);
  opacity: 0;
}

@media (max-width: 480px) {
  .pricing-plans {
    grid-template-columns: 1fr;
  }

  .pricing-modal {
    padding: 1.5rem;
  }
}
</style>

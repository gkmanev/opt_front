<template>
  <section class="profile-shell">
    <div class="container profile-layout">
      <section class="profile-hero">
        <div class="profile-avatar">{{ initials }}</div>
        <div class="profile-hero-copy">
          <p class="profile-eyebrow">{{ mode === 'settings' ? 'Settings' : 'Profile' }}</p>
          <h1>{{ mode === 'settings' ? 'Account settings' : displayName }}</h1>
          <p class="profile-subtitle">
            {{ mode === 'settings'
              ? 'Manage your identity, subscription, and session preferences from one place.'
              : 'Review your account details and return to the dashboard when you are ready to keep scanning ideas.' }}
          </p>
        </div>
      </section>

      <div class="profile-grid">
        <article class="profile-card">
          <div class="profile-card-header">
            <p class="profile-card-eyebrow">Account details</p>
            <h2>Identity</h2>
          </div>

          <dl class="profile-details">
            <div class="profile-detail-row">
              <dt>Display name</dt>
              <dd>{{ displayName }}</dd>
            </div>
            <div class="profile-detail-row">
              <dt>Email</dt>
              <dd>{{ emailValue }}</dd>
            </div>
            <div class="profile-detail-row">
              <dt>Username</dt>
              <dd>{{ usernameValue }}</dd>
            </div>
            <div class="profile-detail-row">
              <dt>Full name</dt>
              <dd>{{ fullNameValue }}</dd>
            </div>
          </dl>
        </article>

        <article class="profile-card profile-card--accent">
          <div class="profile-card-header">
            <p class="profile-card-eyebrow">Quick actions</p>
            <h2>Session</h2>
          </div>

          <p class="profile-session-copy">
            This session is active. You can jump back to the dashboard or sign out from here.
          </p>

          <div class="profile-actions">
            <button class="btn btn-primary" type="button" @click="emit('back-dashboard')">
              Back to dashboard
            </button>
            <button class="btn btn-outline" type="button" @click="emit('logout')">
              Logout
            </button>
          </div>
        </article>

        <article class="profile-card profile-card--subscription">
          <div class="profile-card-header">
            <p class="profile-card-eyebrow">Billing</p>
            <h2>Subscription</h2>
          </div>

          <dl class="profile-details">
            <div class="profile-detail-row">
              <dt>Plan</dt>
              <dd>
                <span
                  class="subscription-tier-badge"
                  :class="isPremium ? 'subscription-tier-badge--premium' : 'subscription-tier-badge--free'"
                >
                  {{ isPremium ? 'Pro' : 'Free' }}
                </span>
              </dd>
            </div>
            <div class="profile-detail-row">
              <dt>Status</dt>
              <dd>{{ subscriptionStatusLabel }}</dd>
            </div>
            <div v-if="subscriptionDate" class="profile-detail-row">
              <dt>{{ subscriptionDate.label }}</dt>
              <dd>{{ subscriptionDate.value }}</dd>
            </div>
            <div v-for="row in entitlementRows" :key="row.label" class="profile-detail-row">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>

          <div class="profile-actions">
            <button
              v-if="isPremium"
              class="btn btn-outline"
              type="button"
              :disabled="isOpeningCustomerPortal"
              @click="manageSubscription"
            >
              {{ isOpeningCustomerPortal ? 'Opening billing portal…' : 'Manage or cancel subscription' }}
            </button>
            <button v-if="!isPremium" class="btn btn-primary" type="button" @click="emit('open-pricing')">
              Upgrade to Pro
            </button>
          </div>
          <p v-if="customerPortalError" class="profile-billing-error" role="alert">
            {{ customerPortalError }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStripe } from '../composables/useStripe';

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  displayName: {
    type: String,
    default: 'Signed in',
  },
  mode: {
    type: String,
    default: 'profile',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  premiumSubscription: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['back-dashboard', 'logout', 'open-pricing']);
const { openCustomerPortal } = useStripe();
const isOpeningCustomerPortal = ref(false);
const customerPortalError = ref('');

const manageSubscription = async () => {
  customerPortalError.value = '';
  isOpeningCustomerPortal.value = true;

  try {
    await openCustomerPortal();
  } catch (error) {
    customerPortalError.value = error?.message || 'Unable to open the subscription management portal.';
  } finally {
    isOpeningCustomerPortal.value = false;
  }
};

const fallbackValue = 'Not provided';
const freeEntitlementFallback = {
  daily_queries: 5,
  max_scan_limit: 5,
  max_extra_pages: 0,
  daily_analyze_stock: 1,
  max_history_items: 8,
};

const fullNameValue = computed(() => {
  const fullName = [props.user?.first_name, props.user?.last_name].filter(Boolean).join(' ').trim();
  return fullName || fallbackValue;
});

const emailValue = computed(() => props.user?.email || fallbackValue);
const usernameValue = computed(() => props.user?.username || fallbackValue);

const initials = computed(() => {
  const seed = fullNameValue.value !== fallbackValue ? fullNameValue.value : props.displayName;
  return seed
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'OF';
});

const formatSubscriptionDate = (raw) => {
  if (!raw) return null;
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(raw));
  } catch {
    return null;
  }
};

const subscriptionDate = computed(() => {
  const subscription = props.premiumSubscription;
  if (!subscription) return null;

  const withDate = (label, rawDate) => {
    const value = formatSubscriptionDate(rawDate);
    return value ? { label, value } : null;
  };

  if (subscription.ended_at) {
    return withDate('Ended', subscription.ended_at);
  }
  if (subscription.cancel_at_period_end) {
    return withDate('Ends', subscription.current_period_end);
  }
  if (subscription.status === 'active') {
    return withDate('Renews', subscription.current_period_end);
  }
  if (subscription.status === 'trialing') {
    return withDate('Trial ends', subscription.current_period_end);
  }

  return null;
});

const subscriptionStatusLabel = computed(() => {
  const subscription = props.premiumSubscription;
  if (subscription?.ended_at) return 'Ended';
  if (subscription?.status === 'past_due') return 'Payment issue';
  if (subscription?.status === 'trialing') return 'Trial';
  if (subscription?.status === 'active') return 'Active';
  if (subscription?.status) return subscription.status;
  if (props.isPremium) return 'Active';
  return 'Free plan';
});

const entitlementRows = computed(() => {
  const entitlements = props.premiumSubscription?.entitlements ?? freeEntitlementFallback;
  const planIsPro = props.isPremium || props.premiumSubscription?.plan === 'pro';

  return [
    {
      label: 'AI chats',
      value: planIsPro ? 'Unlimited' : `${entitlements.daily_queries ?? freeEntitlementFallback.daily_queries} / day`,
    },
    {
      label: 'Stock analysis',
      value: planIsPro ? 'Unlimited' : `${entitlements.daily_analyze_stock ?? freeEntitlementFallback.daily_analyze_stock} / day`,
    },
    {
      label: 'Scan results',
      value: planIsPro ? 'Unlimited' : `${entitlements.max_scan_limit ?? freeEntitlementFallback.max_scan_limit} per scan`,
    },
    {
      label: 'Extra scan pages',
      value: planIsPro
        ? 'Unlimited'
        : Number(entitlements.max_extra_pages ?? freeEntitlementFallback.max_extra_pages) > 0
          ? `${entitlements.max_extra_pages ?? freeEntitlementFallback.max_extra_pages} pages`
          : 'None',
    },
    {
      label: 'History',
      value: planIsPro
        ? 'Full history'
        : `Last ${entitlements.max_history_items ?? freeEntitlementFallback.max_history_items} items`,
    },
  ];
});
</script>

<style scoped>
.profile-shell {
  padding: 3rem 0 0;
}

.profile-layout {
  display: grid;
  gap: 1.5rem;
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.18), transparent 30%),
    linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.96));
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.35);
}

.profile-avatar {
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 1.4rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
  color: #082f49;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.profile-eyebrow,
.profile-card-eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.profile-hero-copy h1,
.profile-card-header h2 {
  margin: 0;
}

.profile-hero-copy h1 {
  font-size: 2rem;
}

.profile-card-header h2 {
  font-size: 1.5rem;
}

.profile-subtitle,
.profile-session-copy {
  margin: 0.85rem 0 0;
  color: #94a3b8;
  line-height: 1.7;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.profile-card {
  padding: 1.5rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.24);
}

.profile-card--accent {
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.16), transparent 28%),
    rgba(15, 23, 42, 0.82);
}

.profile-card-header {
  margin-bottom: 1.25rem;
}

.profile-details {
  display: grid;
  gap: 0.9rem;
  margin: 0;
}

.profile-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.9);
}

.profile-detail-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.profile-detail-row dt {
  color: #94a3b8;
}

.profile-detail-row dd {
  margin: 0;
  text-align: right;
  color: #f8fafc;
  font-weight: 600;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.profile-card--subscription {
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.1), transparent 40%),
    rgba(15, 23, 42, 0.82);
}

.profile-billing-error {
  margin: 0.9rem 0 0;
  color: #fca5a5;
  font-size: 0.9rem;
  line-height: 1.5;
}

.subscription-tier-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.subscription-tier-badge--free {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.subscription-tier-badge--premium {
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2));
  color: #67e8f9;
  border: 1px solid rgba(34, 211, 238, 0.35);
}

@media (max-width: 640px) {
  .profile-shell {
    padding-top: 2rem;
  }

  .profile-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .profile-detail-row {
    flex-direction: column;
  }

  .profile-detail-row dd {
    text-align: left;
  }
}
</style>

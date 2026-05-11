<template>
  <div class="pricing-page">

    <!-- Hero -->
    <section class="pricing-hero container">
      <p class="pricing-eyebrow">Pricing</p>
      <h1>Simple, transparent pricing</h1>
      <p class="pricing-hero-sub">
        Start free and upgrade when you need the full screener.
        No surprises — cancel any time.
      </p>
    </section>

    <!-- Plan cards -->
    <section class="pricing-plans-section container">
      <div class="pricing-plan-grid">

        <!-- Basic -->
        <article class="pp-card">
          <div class="pp-card-header">
            <p class="pp-plan-name">Basic</p>
            <div class="pp-price-row">
              <span class="pp-price-amount">Free</span>
            </div>
            <p class="pp-plan-tagline">Great for getting started with options income</p>
          </div>
          <ul class="pp-features">
            <li v-for="f in basicFeatures" :key="f.label" class="pp-feature-row">
              <span class="pp-check pp-check--on" aria-hidden="true"></span>
              {{ f.label }}
            </li>
            <li v-for="f in proOnlyFeatures" :key="f.label" class="pp-feature-row pp-feature-row--locked">
              <span class="pp-check pp-check--off" aria-hidden="true"></span>
              {{ f.label }}
            </li>
          </ul>
          <div class="pp-card-cta">
            <button
              v-if="isPremium"
              class="btn btn-outline pp-cta-btn"
              type="button"
              disabled
            >
              Your current plan
            </button>
            <button
              v-else-if="isAuthenticated"
              class="btn btn-outline pp-cta-btn"
              type="button"
              disabled
            >
              Current plan
            </button>
            <a
              v-else
              class="btn btn-outline pp-cta-btn"
              href="/sign-up"
              @click="handleBasicClick"
            >
              Get started free
            </a>
          </div>
        </article>

        <!-- Pro -->
        <article class="pp-card pp-card--pro">
          <span class="pp-badge">Most popular</span>
          <div class="pp-card-header">
            <p class="pp-plan-name">Pro</p>
            <div class="pp-price-row">
              <span class="pp-price-currency">$</span>
              <span class="pp-price-amount">20</span>
              <span class="pp-price-period">/ month</span>
            </div>
            <p class="pp-plan-tagline">Full access for serious options income traders</p>
          </div>
          <ul class="pp-features">
            <li v-for="f in basicFeatures" :key="f.label" class="pp-feature-row">
              <span class="pp-check pp-check--on" aria-hidden="true"></span>
              {{ f.label }}
            </li>
            <li v-for="f in proOnlyFeatures" :key="f.label" class="pp-feature-row">
              <span class="pp-check pp-check--on" aria-hidden="true"></span>
              {{ f.label }}
            </li>
          </ul>
          <div class="pp-card-cta">
            <button
              v-if="isPremium"
              class="btn btn-primary pp-cta-btn"
              type="button"
              disabled
            >
              Your current plan
            </button>
            <button
              v-else-if="isAuthenticated"
              class="btn btn-primary pp-cta-btn"
              type="button"
              @click="emit('open-pricing')"
            >
              Upgrade to Pro
            </button>
            <a
              v-else
              class="btn btn-primary pp-cta-btn"
              href="/sign-up?plan=pro"
              @click="handleProClick"
            >
              Get Pro
            </a>
          </div>
        </article>

      </div>
    </section>

    <!-- Comparison table -->
    <section class="pricing-compare-section container">
      <h2 class="pricing-compare-title">Everything included</h2>
      <div class="pricing-compare-wrap">
        <table class="pricing-compare-table">
          <thead>
            <tr>
              <th class="compare-col-feature">Feature</th>
              <th class="compare-col-plan">Basic</th>
              <th class="compare-col-plan compare-col-plan--pro">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.feature">
              <td class="compare-feature-cell">{{ row.feature }}</td>
              <td class="compare-value-cell">
                <span v-if="row.basic === true" class="compare-check compare-check--yes" aria-label="Included">
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M2.5 8l4 4 7-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-else-if="row.basic === false" class="compare-check compare-check--no" aria-label="Not included">—</span>
                <span v-else class="compare-value-text">{{ row.basic }}</span>
              </td>
              <td class="compare-value-cell compare-value-cell--pro">
                <span v-if="row.pro === true" class="compare-check compare-check--yes" aria-label="Included">
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M2.5 8l4 4 7-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-else-if="row.pro === false" class="compare-check compare-check--no" aria-label="Not included">—</span>
                <span v-else class="compare-value-text">{{ row.pro }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- FAQ -->
    <section class="pricing-faq-section container">
      <h2 class="pricing-compare-title">Frequently asked questions</h2>
      <div class="pricing-faq-grid">
        <div v-for="item in faqs" :key="item.q" class="pricing-faq-item">
          <h3 class="pricing-faq-q">{{ item.q }}</h3>
          <p class="pricing-faq-a">{{ item.a }}</p>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="pricing-bottom-cta container">
      <h2>Ready to see every opportunity?</h2>
      <p>Start free and upgrade when you need the full list.</p>
      <div class="pricing-bottom-actions">
        <a
          v-if="!isAuthenticated"
          class="btn btn-primary"
          href="/sign-up?plan=pro"
          @click="handleProClick"
        >
          Start with Pro
        </a>
        <button
          v-else-if="!isPremium"
          class="btn btn-primary"
          type="button"
          @click="emit('open-pricing')"
        >
          Upgrade to Pro
        </button>
        <a
          v-if="!isAuthenticated"
          class="btn btn-outline"
          href="/sign-up"
          @click="handleBasicClick"
        >
          Get started free
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
const SIGNUP_PLAN_KEY = 'putpulse.signup.plan';

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open-pricing', 'navigate-route']);

const basicFeatures = [
  { label: '5 screener results per day' },
  { label: 'Strategy guides (CSP, CC, Wheel)' },
  { label: 'Price & RSI filters' },
  { label: 'Score & technicals column' },
];

const proOnlyFeatures = [
  { label: 'Unlimited screener results' },
  { label: 'All filters + ROI / delta targeting' },
  { label: 'Daily Top 3 email briefing' },
  { label: 'Wheel setup details per ticker' },
];

const comparisonRows = [
  { feature: 'Screener results', basic: '5 / day', pro: 'Unlimited' },
  { feature: 'Strategy guides', basic: true, pro: true },
  { feature: 'Price & RSI filters', basic: true, pro: true },
  { feature: 'Score & technicals', basic: true, pro: true },
  { feature: 'ROI & delta filter targeting', basic: false, pro: true },
  { feature: 'All filters + sorting', basic: false, pro: true },
  { feature: 'Wheel setup details', basic: false, pro: true },
  { feature: 'Daily Top 3 email briefing', basic: false, pro: true },
  { feature: 'Priority support', basic: false, pro: true },
];

const faqs = [
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. You can cancel your Pro subscription at any time from your Paddle billing portal. You keep Pro access until the end of the current billing period.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Payments are handled by Paddle, which supports all major credit and debit cards. Paddle acts as the merchant of record, so your invoice comes from Paddle.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'There is no time-limited free trial, but the Basic plan is free forever and gives you a genuine feel for the screener before you decide to upgrade.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Nothing is deleted. Your account stays active on the Basic plan and you keep access to all strategy guides. Only the screener row limit is re-applied.',
  },
];

const handleBasicClick = (event) => {
  try { sessionStorage.removeItem(SIGNUP_PLAN_KEY); } catch { /* ignore */ }
  emit('navigate-route', event, '/sign-up');
};

const handleProClick = (event) => {
  try { sessionStorage.setItem(SIGNUP_PLAN_KEY, 'pro'); } catch { /* ignore */ }
  emit('navigate-route', event, '/sign-up?plan=pro');
};
</script>

<style scoped>
.pricing-page {
  padding-bottom: 5rem;
}

/* Hero */
.pricing-hero {
  text-align: center;
  padding-top: 4rem;
  padding-bottom: 3rem;
}

.pricing-eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.pricing-hero h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
}

.pricing-hero-sub {
  margin: 0 auto;
  max-width: 46ch;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Plan grid */
.pricing-plans-section {
  padding-bottom: 3rem;
}

.pricing-plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 780px;
  margin: 0 auto;
}

.pp-card {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(9, 14, 28, 0.88);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.pp-card--pro {
  border-color: rgba(34, 211, 238, 0.3);
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.1), transparent 45%),
    rgba(9, 14, 28, 0.92);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.12), 0 24px 60px rgba(34, 211, 238, 0.08);
}

.pp-badge {
  position: absolute;
  top: -0.7rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
  color: #082f49;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.22rem 0.75rem;
  border-radius: 99px;
  white-space: nowrap;
}

.pp-plan-name {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #94a3b8;
}

.pp-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  margin-bottom: 0.6rem;
}

.pp-price-currency {
  font-size: 1.2rem;
  font-weight: 600;
  color: #94a3b8;
}

.pp-price-amount {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  color: #f8fafc;
}

.pp-price-period {
  font-size: 0.9rem;
  color: #64748b;
  margin-left: 0.15rem;
}

.pp-plan-tagline {
  margin: 0;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
}

.pp-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  border-top: 1px solid rgba(51, 65, 85, 0.7);
  padding-top: 1.25rem;
  flex: 1;
}

.pp-feature-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.pp-feature-row--locked {
  color: #475569;
}

.pp-check {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.pp-check--on {
  background: rgba(34, 211, 238, 0.15);
  border: 1px solid rgba(34, 211, 238, 0.4);
}

.pp-check--on::after {
  content: '';
  width: 0.4rem;
  height: 0.4rem;
  background: #22d3ee;
  border-radius: 50%;
}

.pp-check--off {
  border: 1px solid rgba(71, 85, 105, 0.5);
}

.pp-cta-btn {
  width: 100%;
  justify-content: center;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
}

/* Comparison table */
.pricing-compare-section {
  padding-bottom: 3rem;
}

.pricing-compare-title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.pricing-compare-wrap {
  overflow-x: auto;
  border-radius: 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.pricing-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.pricing-compare-table thead tr {
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
}

.pricing-compare-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(9, 14, 28, 0.9);
}

.compare-col-plan {
  text-align: center;
  width: 120px;
}

.compare-col-plan--pro {
  color: #67e8f9 !important;
}

.pricing-compare-table tbody tr {
  border-bottom: 1px solid rgba(30, 38, 49, 0.9);
}

.pricing-compare-table tbody tr:last-child {
  border-bottom: none;
}

.pricing-compare-table tbody tr:nth-child(odd) {
  background: rgba(15, 23, 42, 0.4);
}

.compare-feature-cell {
  padding: 0.85rem 1.25rem;
  color: #cbd5e1;
}

.compare-value-cell {
  padding: 0.85rem 1.25rem;
  text-align: center;
  color: #64748b;
}

.compare-value-cell--pro {
  background: rgba(34, 211, 238, 0.03);
}

.compare-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.compare-check--yes {
  color: #22d3ee;
}

.compare-check--no {
  color: #334155;
  font-size: 1rem;
}

.compare-value-text {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* FAQ */
.pricing-faq-section {
  padding-bottom: 3rem;
}

.pricing-faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  max-width: 860px;
  margin: 0 auto;
}

.pricing-faq-item {
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(9, 14, 28, 0.6);
}

.pricing-faq-q {
  margin: 0 0 0.6rem;
  font-size: 0.95rem;
  color: #e2e8f0;
  font-weight: 600;
  line-height: 1.4;
}

.pricing-faq-a {
  margin: 0;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.7;
}

/* Bottom CTA */
.pricing-bottom-cta {
  text-align: center;
  padding: 3rem 1rem;
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top center, rgba(34, 211, 238, 0.12), transparent 50%),
    rgba(9, 14, 28, 0.7);
  border: 1px solid rgba(34, 211, 238, 0.15);
  max-width: 600px;
}

.pricing-bottom-cta h2 {
  margin: 0 0 0.75rem;
  font-size: 1.75rem;
}

.pricing-bottom-cta p {
  margin: 0 0 1.75rem;
  color: #94a3b8;
}

.pricing-bottom-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .pricing-hero {
    padding-top: 2.5rem;
  }

  .pp-card {
    padding: 1.5rem;
  }

  .pricing-compare-table th,
  .compare-feature-cell,
  .compare-value-cell {
    padding: 0.75rem 0.85rem;
  }

  .pricing-bottom-cta {
    padding: 2rem 1.25rem;
  }
}
</style>

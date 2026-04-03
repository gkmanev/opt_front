<template>
  <div class="wheel-guide" :class="`wheel-guide--${variant}`">
    <header class="wheel-guide__header">
      <div>
        <p class="wheel-guide__eyebrow">How It Works</p>
        <component :is="headingTag" id="wheel-guide-title" class="wheel-guide__title">
          The Wheel Strategy: Your Guide to Consistent Options Income
        </component>
        <p class="wheel-guide__lead">
          The Wheel Strategy, also known as the "Triple Income" strategy, is a
          systematic options cycle designed to generate steady cash flow. It is
          widely considered a conservative approach because it focuses on
          high-quality stocks you would not mind owning for the long term.
        </p>
      </div>
      <button
        v-if="showClose"
        class="wheel-guide__close"
        type="button"
        @click="emit('close')"
      >
        Close
      </button>
    </header>

    <div class="wheel-guide__body">
      <section class="wheel-guide__section">
        <div class="wheel-guide-phase-grid">
          <article class="wheel-guide-phase-card">
            <div class="wheel-guide-phase-card__badge">Phase 1</div>
            <h3>Selling Cash-Secured Puts (CSP)</h3>
            <p class="wheel-guide-phase-card__summary">
              The cycle begins by selling a put option. You are getting paid to
              wait for a stock to drop to a price where you would be happy to buy
              it.
            </p>
            <dl class="wheel-guide-phase-card__details">
              <div>
                <dt>The Setup</dt>
                <dd>
                  You sell the right for someone else to sell you 100 shares at a
                  specific strike price. You must have the cash ready in your
                  account to secure this potential purchase.
                </dd>
              </div>
              <div>
                <dt>The Benefit</dt>
                <dd>
                  You collect an upfront premium. If the stock stays above your
                  price, you keep the money and repeat. If it drops, you are
                  assigned the shares at a discount.
                </dd>
              </div>
            </dl>
          </article>

          <article class="wheel-guide-phase-card wheel-guide-phase-card--accent">
            <div class="wheel-guide-phase-card__badge">Phase 2</div>
            <h3>Selling Covered Calls (CC)</h3>
            <p class="wheel-guide-phase-card__summary">
              Once you are assigned and own the 100 shares, you switch to selling
              calls.
            </p>
            <dl class="wheel-guide-phase-card__details">
              <div>
                <dt>The Setup</dt>
                <dd>
                  You sell the right for someone else to buy your 100 shares at a
                  specific price, usually higher than what you paid.
                </dd>
              </div>
              <div>
                <dt>The Benefit</dt>
                <dd>
                  You collect more premium while you wait. If the stock hits your
                  target, you sell the shares for a profit. If it stays flat, you
                  keep the shares and the cash, then sell another call next month.
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">The Full Wheel Cycle</p>
          <h3>Run the same disciplined loop over and over.</h3>
        </div>

        <figure class="wheel-guide-diagram-card">
          <img
            class="wheel-guide-diagram-card__image"
            :src="wheelCycleDiagram"
            alt="Wheel strategy cycle diagram showing phase one cash-secured puts, phase two covered calls, and restarting after shares are called away."
          >
          <figcaption class="wheel-guide-diagram-card__caption">
            Sell puts, accept assignment only on stocks you want to own, sell covered
            calls on those shares, then recycle capital after the shares are called away.
          </figcaption>
        </figure>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">Why Use Our App?</p>
          <h3>The hardest part is picking stocks that are actually wheelable.</h3>
          <p>
            Not every stock belongs in a wheel strategy. Highly volatile meme names
            can collapse and leave you holding weak shares. The app narrows the
            field with smart AI filters.
          </p>
        </div>

        <div class="wheel-guide-reason-grid">
          <article class="wheel-guide-reason-card">
            <h4>High Probability</h4>
            <p>
              We filter for stocks with steady price action and high liquidity,
              like Apple, Microsoft, or Coca-Cola.
            </p>
          </article>
          <article class="wheel-guide-reason-card">
            <h4>Optimal Premiums</h4>
            <p>
              The app identifies stocks where implied volatility is high enough to
              produce attractive income, but still low enough to remain safer.
            </p>
          </article>
          <article class="wheel-guide-reason-card">
            <h4>Fundamental Health</h4>
            <p>
              We prioritize companies with wide economic moats and predictable cash
              flows, so assignment means owning a stronger business.
            </p>
          </article>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">Top Opportunities for 2026</p>
          <h3>Current Prime Wheel candidates from Today's Top</h3>
        </div>

        <div v-if="visibleCandidates.length" class="wheel-guide-candidate-list">
          <article
            v-for="candidate in visibleCandidates"
            :key="`${candidate.ticker}-${candidate.date}`"
            class="wheel-guide-candidate-card"
          >
            <div class="wheel-guide-candidate-card__top">
              <strong>{{ candidate.ticker }}</strong>
              <span>{{ candidate.roi }}</span>
            </div>
            <div class="wheel-guide-candidate-card__meta">
              <span>Strike {{ candidate.strike }}</span>
              <span>Premium {{ candidate.estPremium }}</span>
              <span>Exp. {{ candidate.date }}</span>
            </div>
          </article>
        </div>
        <div v-else class="wheel-guide-candidate-empty">
          Today's Top candidates will appear here once the market scan loads.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import wheelCycleDiagram from '../assets/wheel-cycle.svg';

const props = defineProps({
  candidates: {
    type: Array,
    default: () => [],
  },
  headingTag: {
    type: String,
    default: 'h2',
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'modal',
  },
});

const emit = defineEmits(['close']);

const visibleCandidates = computed(() => props.candidates.slice(0, 3));
</script>

<style scoped>
.wheel-guide {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.98));
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
}

.wheel-guide--page {
  width: 100%;
}

.wheel-guide__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 28px 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.wheel-guide__eyebrow,
.wheel-guide-section-heading__eyebrow {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.wheel-guide__title {
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.08;
}

.wheel-guide--page .wheel-guide__title {
  font-size: 2rem;
}

.wheel-guide__lead {
  max-width: 68ch;
  margin: 14px 0 0;
  color: #475569;
  font-size: 1rem;
  line-height: 1.7;
}

.wheel-guide__close {
  align-self: flex-start;
  padding: 11px 16px;
  border: 0;
  border-radius: 999px;
  background: #0f172a;
  color: #f8fafc;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.wheel-guide__body {
  display: grid;
  gap: 28px;
  padding: 28px;
}

.wheel-guide__section {
  display: grid;
  gap: 18px;
}

.wheel-guide-phase-grid,
.wheel-guide-reason-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.wheel-guide-reason-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wheel-guide-phase-card,
.wheel-guide-reason-card,
.wheel-guide-candidate-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.wheel-guide-phase-card {
  padding: 22px;
}

.wheel-guide-phase-card--accent {
  background:
    linear-gradient(180deg, rgba(236, 254, 255, 0.95), rgba(255, 255, 255, 0.92));
}

.wheel-guide-phase-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(13, 148, 136, 0.12);
  color: #0f766e;
  font-size: 0.8rem;
  font-weight: 700;
}

.wheel-guide-phase-card h3,
.wheel-guide-section-heading h3,
.wheel-guide-reason-card h4 {
  margin: 12px 0 0;
  color: #0f172a;
}

.wheel-guide-phase-card__summary,
.wheel-guide-section-heading p,
.wheel-guide-reason-card p,
.wheel-guide-candidate-empty {
  margin: 10px 0 0;
  color: #475569;
  line-height: 1.7;
}

.wheel-guide-phase-card__details {
  display: grid;
  gap: 14px;
  margin: 18px 0 0;
}

.wheel-guide-phase-card__details div {
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
}

.wheel-guide-phase-card__details dt {
  margin: 0 0 6px;
  color: #0f172a;
  font-weight: 700;
}

.wheel-guide-phase-card__details dd {
  margin: 0;
  color: #475569;
  line-height: 1.65;
}

.wheel-guide-diagram-card {
  margin: 0;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.92));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.wheel-guide-diagram-card__image {
  display: block;
  width: 100%;
  height: auto;
}

.wheel-guide-diagram-card__caption {
  margin-top: 14px;
  color: #475569;
  line-height: 1.7;
  text-align: center;
}

.wheel-guide-reason-card {
  padding: 20px;
}

.wheel-guide-candidate-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.wheel-guide-candidate-card {
  padding: 18px;
}

.wheel-guide-candidate-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #0f172a;
}

.wheel-guide-candidate-card__top strong {
  font-size: 1.1rem;
}

.wheel-guide-candidate-card__top span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(13, 148, 136, 0.12);
  color: #0f766e;
  font-size: 0.88rem;
  font-weight: 700;
}

.wheel-guide-candidate-card__meta {
  display: grid;
  gap: 8px;
  margin-top: 16px;
  color: #475569;
}

.wheel-guide-candidate-empty {
  padding: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.4);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
}

@media (max-width: 960px) {
  .wheel-guide-phase-grid,
  .wheel-guide-reason-grid,
  .wheel-guide-candidate-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .wheel-guide__header {
    flex-direction: column;
    padding: 22px 22px 20px;
  }

  .wheel-guide__body {
    padding: 22px;
  }

  .wheel-guide__close {
    width: 100%;
  }
}
</style>

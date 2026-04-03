<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Wheel Strategy</span>
      </div>
      <span class="pill">Strategy Library</span>
      <h1 class="content-title">Wheel strategy: turn assignment into a repeatable income cycle</h1>
      <p class="content-intro">
        The wheel strategy links cash-secured puts and covered calls into one disciplined process.
        You start by selling puts on stocks you would be comfortable owning, accept assignment only on
        quality names, then sell covered calls until the shares are called away and the cycle resets.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Two-step options income workflow</span>
        <span class="content-meta-chip">Built around assignment-ready stocks</span>
        <span class="content-meta-chip">Updated April 1, 2026</span>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
        <a class="btn btn-outline" href="/" @click="navigateRoute($event, '/')">View Today's Top</a>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Phase One</div>
        <h2 class="content-panel-title">Sell cash-secured puts on stocks you already want to own</h2>
        <p class="content-panel-copy">
          The wheel only works if assignment is acceptable. That means the first decision is the business,
          not the premium. If the stock drops to your strike, owning it should still make sense.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Phase Two</div>
        <h2 class="content-panel-title">After assignment, sell covered calls to keep the income cycle moving</h2>
        <p class="content-panel-copy">
          Once you hold the shares, you switch from put premium to call premium. The goal is to get paid while
          waiting for an exit price you are happy to accept.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Discipline</div>
        <h2 class="content-panel-title">The edge comes from repeatable rules, not forcing premium every month</h2>
        <p class="content-panel-copy">
          Good wheel setups usually share the same traits: solid underlying businesses, usable option liquidity,
          defined entry prices, and position sizes you can hold through volatility.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">How It Works</div>
      <h2 class="content-section-title">The four-step wheel workflow</h2>
      <div class="content-grid">
        <article class="content-step">
          <span class="content-step-number">1</span>
          <h3>Screen for a business you would own without hesitation</h3>
          <p>
            Start with quality. A weak stock can turn a simple income strategy into a long recovery trade.
            Use <a href="/cash-secured-puts" @click="navigateRoute($event, '/cash-secured-puts')">cash-secured put discipline</a>
            before thinking about yield.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">2</span>
          <h3>Sell the put at a strike where assignment still feels like a good entry</h3>
          <p>
            Collect premium up front while you wait. If the option expires worthless, you can review a new
            contract. If the stock closes below the strike, you may be assigned 100 shares.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">3</span>
          <h3>Own the shares and sell covered calls at a price you are willing to exit</h3>
          <p>
            Covered calls turn the assigned stock into the next income leg. Keep the strike aligned with your
            cost basis, upside target, and willingness to let the shares go.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">4</span>
          <h3>When shares are called away, recycle the capital and restart the loop</h3>
          <p>
            The wheel becomes repeatable when you can move cleanly from puts to stock to calls and back to cash,
            without being forced into names or sizes you do not actually want.
          </p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card wheel-diagram-card">
      <div>
        <div class="section-eyebrow">The Full Cycle</div>
        <h2 class="content-section-title">See where puts, assignment, and covered calls connect</h2>
        <p class="content-panel-copy wheel-diagram-copy">
          The wheel works because each step sets up the next one. Selling puts defines the entry, assignment turns
          the option into a stock position, and covered calls define the exit while continuing to collect premium.
        </p>
      </div>
      <figure class="wheel-diagram-figure">
        <img
          class="wheel-diagram-image"
          :src="wheelCycleDiagram"
          alt="Wheel strategy diagram showing cash-secured puts, assignment into stock ownership, covered calls, and returning to cash after shares are called away."
        >
        <figcaption class="wheel-diagram-caption">
          Start with cash-secured puts, accept assignment only on stocks you want, then use covered calls to work
          the position back toward cash.
        </figcaption>
      </figure>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">Checklist</div>
      <h2 class="content-section-title">What makes a stock actually wheelable</h2>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Assignment quality</h3>
          <p>Only sell puts on companies you are prepared to own through a drawdown, not just until expiration.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Liquid options chain</h3>
          <p>Tighter spreads and better open interest make both the put leg and the covered-call leg easier to manage.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Defined entry and exit prices</h3>
          <p>The wheel gets sloppy when strikes are chosen for premium alone instead of a real buy price and real sell price.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Position sizing you can carry</h3>
          <p>Do not wheel names where 100 shares would distort the portfolio or create more concentration than you want.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Earnings and event awareness</h3>
          <p>One catalyst can change the assignment and covered-call profile overnight, so timing still matters.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Process consistency</h3>
          <p>The strategy is strongest when you can repeat the same filters and decision rules instead of improvising every cycle.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">Current Setups</div>
      <h2 class="content-section-title">Prime candidates from Today's Top</h2>
      <p class="content-panel-copy wheel-candidates-copy">
        These are the names that currently fit the site’s wheel-oriented shortlist best. They are still inputs for
        review, not automatic trades.
      </p>
      <div v-if="visibleCandidates.length" class="wheel-candidate-grid">
        <article
          v-for="candidate in visibleCandidates"
          :key="`${candidate.ticker}-${candidate.date}`"
          class="wheel-candidate-card"
        >
          <div class="wheel-candidate-card__top">
            <strong>{{ candidate.ticker }}</strong>
            <span>{{ candidate.roi }}</span>
          </div>
          <div class="wheel-candidate-card__meta">
            <span>Strike {{ candidate.strike }}</span>
            <span>Premium {{ candidate.estPremium }}</span>
            <span>Exp. {{ candidate.date }}</span>
          </div>
        </article>
      </div>
      <div v-else class="wheel-candidate-empty">
        Today's Top candidates will appear here once the market scan loads.
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Main Benefit</div>
        <h2 class="content-panel-title">You can keep generating income across both the cash and stock phases</h2>
        <p class="content-panel-copy">
          Instead of stopping at assignment, the wheel treats stock ownership as part of the plan. That gives the
          strategy more ways to stay productive over time.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Main Risk</div>
        <h2 class="content-panel-title">A bad underlying can trap the cycle and turn income into damage control</h2>
        <p class="content-panel-copy">
          Premium does not fix weak businesses or oversized positions. If the stock is wrong for the portfolio, the
          wheel can leave you repeatedly managing a problem instead of compounding a process.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-cta-card">
      <div>
        <div class="section-eyebrow">Next Step</div>
        <h2 class="content-section-title">Use the wheel on screened names, not random premium spikes</h2>
        <p class="content-panel-copy">
          PutPulse helps narrow the field to stocks with stronger fundamentals, cleaner setup quality, and more
          usable monthly income profiles before you commit capital.
        </p>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Create Free Account</a>
        <a class="btn btn-outline" href="/covered-calls" @click="navigateRoute($event, '/covered-calls')">Review Covered Calls</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import wheelCycleDiagram from '../assets/wheel-cycle.svg';

const emit = defineEmits(['navigate-route']);

const props = defineProps({
  candidates: {
    type: Array,
    default: () => [],
  },
});

const visibleCandidates = computed(() => props.candidates.slice(0, 3));

const navigateRoute = (event, path) => {
  emit('navigate-route', event, path);
};
</script>

<style scoped>
.wheel-diagram-card {
  gap: 1.2rem;
}

.wheel-diagram-copy,
.wheel-candidates-copy {
  max-width: 60rem;
}

.wheel-diagram-figure {
  margin: 0;
  padding: 1.15rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1rem;
  background:
    radial-gradient(circle at top, rgba(34, 211, 238, 0.08), transparent 48%),
    rgba(2, 6, 23, 0.42);
}

.wheel-diagram-image {
  display: block;
  width: 100%;
  height: auto;
}

.wheel-diagram-caption {
  margin-top: 0.9rem;
  color: #cbd5e1;
  line-height: 1.7;
  text-align: center;
}

.wheel-candidate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.wheel-candidate-card {
  padding: 1.15rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(2, 6, 23, 0.62));
}

.wheel-candidate-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.wheel-candidate-card__top strong {
  font-size: 1.05rem;
}

.wheel-candidate-card__top span {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.12);
  color: #67e8f9;
  font-size: 0.84rem;
  font-weight: 700;
}

.wheel-candidate-card__meta {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.95rem;
  color: #cbd5e1;
  font-size: 0.92rem;
}

.wheel-candidate-empty {
  padding: 1.15rem;
  border: 1px dashed rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  background: rgba(2, 6, 23, 0.34);
  color: #cbd5e1;
  line-height: 1.7;
}

@media (max-width: 700px) {
  .wheel-diagram-figure,
  .wheel-candidate-card,
  .wheel-candidate-empty {
    padding: 1rem;
  }
}
</style>

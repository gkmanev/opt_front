<template>
  <div class="wheel-guide" :class="`wheel-guide--${variant}`">
    <header class="wheel-guide__header">
      <div>
        <p class="wheel-guide__eyebrow">PutPulse Strategic Framework</p>
        <component :is="headingTag" id="wheel-guide-title" class="wheel-guide__title">
          Mastering Options Income: The PutPulse Strategic Framework
        </component>
        <p class="wheel-guide__lead">
          In today's volatile markets, the most successful investors do not just pick stocks.
          They execute a systematic framework that combines fundamental quality with
          income-generating options strategies. PutPulse is optimized for that dual approach,
          bridging long-term stock analysis with consistent Wheel strategy execution.
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
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">The Foundation</p>
          <h3>The Wheel Strategy: Consistent Options Income</h3>
          <p>
            The Wheel Strategy, also known as the "Triple Income" strategy, is a systematic
            options cycle designed to generate steady cash flow. It is widely considered a
            conservative approach because it focuses on high-quality stocks you would not mind
            owning for the long term.
          </p>
        </div>

        <div class="wheel-guide-phase-grid">
          <article
            v-for="phase in phases"
            :key="phase.title"
            class="wheel-guide-phase-card"
            :class="{ 'wheel-guide-phase-card--accent': phase.accent }"
          >
            <div
              class="wheel-guide-phase-card__badge"
              :class="phase.badgeClass"
            >
              {{ phase.phase }}
            </div>
            <h3>{{ phase.title }}</h3>
            <p class="wheel-guide-phase-card__summary">
              {{ phase.summary }}
            </p>
            <dl class="wheel-guide-phase-card__details">
              <div v-for="detail in phase.details" :key="detail.label">
                <dt>{{ detail.label }}</dt>
                <dd>{{ detail.value }}</dd>
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
          <svg
            class="wheel-guide-diagram-card__svg"
            viewBox="0 0 900 620"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="The Wheel cycle: sell a cash-secured put; if assigned, sell a covered call; when shares are called away, take profit and restart."
          >
            <defs>
              <marker id="wheel-guide-arrow-violet" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M0,0.8 L9.5,5 L0,9.2 L2.6,5 z" fill="#6d5bd0" />
              </marker>
              <marker id="wheel-guide-arrow-amber" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M0,0.8 L9.5,5 L0,9.2 L2.6,5 z" fill="#b97718" />
              </marker>
              <marker id="wheel-guide-arrow-teal" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M0,0.8 L9.5,5 L0,9.2 L2.6,5 z" fill="#0e8a6d" />
              </marker>
            </defs>

            <rect x="128" y="30" width="164" height="36" rx="18" fill="#dff2eb" stroke="#9ed4c3" />
            <text x="210" y="53" text-anchor="middle" font-size="15" font-weight="700" fill="#0e8a6d">1  Put premium</text>
            <line x1="210" y1="66" x2="210" y2="106" stroke="#9ed4c3" stroke-width="1.6" stroke-dasharray="2 5" stroke-linecap="round" />

            <rect x="606" y="30" width="168" height="36" rx="18" fill="#efecfb" stroke="#c6beec" />
            <text x="690" y="53" text-anchor="middle" font-size="15" font-weight="700" fill="#6d5bd0">2  Call premium</text>
            <line x1="690" y1="66" x2="690" y2="106" stroke="#c6beec" stroke-width="1.6" stroke-dasharray="2 5" stroke-linecap="round" />

            <circle cx="450" cy="330" r="82" fill="none" stroke="#d8d2c6" stroke-width="1.6" stroke-dasharray="1 9" stroke-linecap="round" />

            <path d="M 352 141 C 405 108, 495 108, 544 138" fill="none" stroke="#6d5bd0" stroke-width="2.6" stroke-linecap="round" marker-end="url(#wheel-guide-arrow-violet)" />
            <rect x="399" y="104" width="102" height="30" rx="15" fill="#ffffff" stroke="#c6beec" />
            <text x="450" y="124" text-anchor="middle" font-size="13.5" font-weight="600" fill="#6d5bd0">If assigned</text>

            <path d="M 726 206 C 772 320, 726 442, 598 502" fill="none" stroke="#b97718" stroke-width="2.6" stroke-linecap="round" marker-end="url(#wheel-guide-arrow-amber)" />
            <rect x="686" y="341" width="116" height="30" rx="15" fill="#ffffff" stroke="#e4c089" />
            <text x="744" y="361" text-anchor="middle" font-size="13.5" font-weight="600" fill="#b97718">Called away</text>

            <path d="M 302 502 C 174 442, 128 320, 174 206" fill="none" stroke="#0e8a6d" stroke-width="2.6" stroke-linecap="round" marker-end="url(#wheel-guide-arrow-teal)" />
            <rect x="98" y="341" width="116" height="30" rx="15" fill="#ffffff" stroke="#9ed4c3" />
            <text x="156" y="361" text-anchor="middle" font-size="13.5" font-weight="600" fill="#0e8a6d">Restart cycle</text>

            <rect x="70" y="108" width="280" height="92" rx="14" fill="#e7f5f0" stroke="#0e8a6d" stroke-width="1.5" />
            <text x="210" y="146" text-anchor="middle" font-size="19" font-weight="700" fill="#0e6b54">Phase 1</text>
            <text x="210" y="174" text-anchor="middle" font-size="15" fill="#0e8a6d">Sell a cash-secured put</text>

            <rect x="550" y="108" width="280" height="92" rx="14" fill="#efecfb" stroke="#6d5bd0" stroke-width="1.5" />
            <text x="690" y="146" text-anchor="middle" font-size="19" font-weight="700" fill="#4f3eaf">Phase 2</text>
            <text x="690" y="174" text-anchor="middle" font-size="15" fill="#6d5bd0">Sell a covered call</text>

            <rect x="310" y="478" width="280" height="92" rx="14" fill="#fdf3e3" stroke="#b97718" stroke-width="1.5" />
            <text x="450" y="516" text-anchor="middle" font-size="18" font-weight="700" fill="#8c5a0e">Shares called away</text>
            <text x="450" y="544" text-anchor="middle" font-size="15" fill="#a96f14">3  Take profit - restart</text>

            <circle cx="450" cy="330" r="58" fill="#f2efe8" stroke="#e2dccf" stroke-width="1.5" />
            <text x="450" y="325" text-anchor="middle" font-size="17" font-weight="700" fill="#4b4438">The</text>
            <text x="450" y="348" text-anchor="middle" font-size="17" font-weight="700" fill="#4b4438">Wheel</text>
          </svg>
          <figcaption class="wheel-guide-diagram-card__caption">
            Sell puts, accept assignment only on stocks you want to own, sell covered
            calls on those shares, then recycle capital after the shares are called away.
          </figcaption>
        </figure>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">Who Is PutPulse For?</p>
          <h3>Three investor profiles, one systematic workflow.</h3>
        </div>

        <div class="wheel-guide-list-card">
          <ul class="wheel-guide-clean-list">
            <li v-for="profile in profiles" :key="profile.title">
              <b>{{ profile.title }}</b>
              <p>{{ profile.copy }}</p>
            </li>
          </ul>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">Why Use Our App?</p>
          <h3>The hardest part is picking stocks that are actually wheelable.</h3>
          <p>
            Not every stock belongs in a wheel strategy. Highly volatile meme names can
            collapse and leave you holding weak shares. The app narrows the field with
            smart AI filters.
          </p>
        </div>

        <div class="wheel-guide-reason-grid">
          <article v-for="reason in reasons" :key="reason.title" class="wheel-guide-reason-card">
            <h4>{{ reason.title }}</h4>
            <p>{{ reason.copy }}</p>
          </article>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">The PutPulse Workflow</p>
          <h3>Quality first, always.</h3>
          <p>
            The framework follows a rigorous, data-driven workflow to ensure every trade
            is backed by sound logic.
          </p>
        </div>

        <div class="wheel-guide-workflow-card">
          <div class="wheel-guide-callout">
            <p>
              <b>Assignment is not a problem.</b> Because the framework prioritizes
              fundamentally strong companies, being assigned simply means acquiring a
              high-quality asset at a discount.
            </p>
          </div>

          <article v-for="step in workflowSteps" :key="step.number" class="wheel-guide-step">
            <span class="wheel-guide-step__number">{{ step.number }}</span>
            <div class="wheel-guide-step__body">
              <h4>{{ step.title }}</h4>
              <p>{{ step.copy }}</p>
              <ul v-if="step.points.length" class="wheel-guide-step__list">
                <li v-for="point in step.points" :key="point.label">
                  <b>{{ point.label }}:</b> {{ point.value }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-section-heading">
          <p class="wheel-guide-section-heading__eyebrow">Maximizing Your Results</p>
          <h3>Give the engine the right inputs.</h3>
          <p>
            To receive the most accurate and actionable analysis, the PutPulse engine
            works best when you provide specific parameters for your trade.
          </p>
        </div>

        <div class="wheel-guide-input-grid">
          <article v-for="input in inputs" :key="input.title" class="wheel-guide-input-card">
            <h4>{{ input.title }}</h4>
            <p>{{ input.copy }}</p>
          </article>
        </div>
      </section>

      <section class="wheel-guide__section">
        <div class="wheel-guide-bottom-card">
          <h3>The Bottom Line</h3>
          <p>
            The Wheel is a simple, repeatable loop: sell puts on stocks you'd love to own,
            collect premium, sell covered calls if assigned, and recycle capital when shares
            are called away. By combining rigorous fundamental screening with technical
            indicators and data-driven options analysis, PutPulse turns that loop into a
            professional-grade system for building a sustainable, income-generating portfolio.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
defineProps({
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

const phases = [
  {
    phase: 'Phase 1',
    title: 'Selling Cash-Secured Puts (CSP)',
    summary: 'The cycle begins by selling a put option. You are getting paid to wait for a stock to drop to a price where you would be happy to buy it.',
    badgeClass: 'wheel-guide-phase-card__badge--teal',
    accent: false,
    details: [
      {
        label: 'The Setup',
        value: 'You sell the right for someone else to sell you 100 shares at a specific strike price. You must have the cash ready in your account to secure this potential purchase.',
      },
      {
        label: 'The Benefit',
        value: 'You collect an upfront premium. If the stock stays above your price, you keep the money and repeat. If it drops, you are assigned the shares at a discount.',
      },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Selling Covered Calls (CC)',
    summary: 'Once you are assigned and own the 100 shares, you switch to selling calls.',
    badgeClass: 'wheel-guide-phase-card__badge--violet',
    accent: true,
    details: [
      {
        label: 'The Setup',
        value: 'You sell the right for someone else to buy your 100 shares at a specific price, usually higher than what you paid.',
      },
      {
        label: 'The Benefit',
        value: 'You collect more premium while you wait. If the stock hits your target, you sell the shares for a profit. If it stays flat, you keep the shares and the cash, then sell another call next month.',
      },
    ],
  },
];

const profiles = [
  {
    title: 'Monthly Income-Focused Investors',
    copy: 'For those prioritizing consistent cash flow, PutPulse specializes in building monthly option income plans. The platform identifies the best opportunities for selling cash-secured puts by evaluating real-time metrics to help investors maximize premium collection.',
  },
  {
    title: 'Long-Term Asset Owners',
    copy: 'Investors focused on owning high-quality businesses can use PutPulse to ensure they are only trading stocks that meet high standards for ownership. The framework evaluates moat quality and financial health with a quality score based on ROIC, margins, and free cash flow.',
  },
  {
    title: 'Systematic Traders',
    copy: 'Traders following the disciplined Wheel strategy can use the platform to manage the full lifecycle of a trade, from selling puts to selling covered calls after assignment, with reporting on premium yield, upside to strike, and call-away risk.',
  },
];

const reasons = [
  {
    title: 'High Probability',
    copy: 'We filter for stocks with steady price action and high liquidity, like Apple, Microsoft, or Coca-Cola.',
  },
  {
    title: 'Optimal Premiums',
    copy: 'The app identifies stocks where implied volatility is high enough to produce attractive income, but still low enough to remain safer.',
  },
  {
    title: 'Fundamental Health',
    copy: 'We prioritize companies with wide economic moats and predictable cash flows, so assignment means owning a stronger business.',
  },
];

const workflowSteps = [
  {
    number: 1,
    title: 'Long-Term Quality Analysis',
    copy: 'The first step is determining if the underlying asset is good to own. The system runs a deep-dive fundamentals report that includes:',
    points: [
      {
        label: 'Quality Classification',
        value: 'a score from 0-100 based on financial health.',
      },
      {
        label: 'Key Metrics',
        value: 'analysis of ROIC, margins, cash flow, and balance-sheet health.',
      },
      {
        label: 'Risk and Reward Signals',
        value: 'specific risk flags or positive signals before you commit capital.',
      },
    ],
  },
  {
    number: 2,
    title: 'Options Strategy and Technical Optimization',
    copy: 'Once a stock is vetted for quality, the platform evaluates the best available contracts by blending options data with technical indicators:',
    points: [
      {
        label: 'For Selling Puts (Wheel Phase 1)',
        value: 'the system reviews the options chain for the best mix of strike, DTE, delta, and IV while factoring in RSI and technical analysis scores to optimize entry points.',
      },
      {
        label: 'For Covered Calls (Wheel Phase 2)',
        value: 'it identifies calls that align with your goal, whether that is maximizing premium or exiting at a target price.',
      },
    ],
  },
  {
    number: 3,
    title: 'Risk Management and Warnings',
    copy: 'Every recommendation includes critical safety data, such as breakeven points, cash required, and warnings for upcoming events like earnings reports or ex-dividend dates that could impact your position.',
    points: [],
  },
];

const inputs = [
  {
    title: 'The Ticker',
    copy: 'Identify the specific asset you are interested in, such as AAPL.',
  },
  {
    title: 'Your Goal',
    copy: 'State whether you are aiming for pure income, want to keep your shares, or are focused on Wheel continuation.',
  },
  {
    title: 'Capital Constraints',
    copy: 'Providing your cash budget or max collateral keeps recommendations aligned with your portfolio size.',
  },
  {
    title: 'Cost Basis',
    copy: 'For covered calls, your cost basis helps the system identify strikes that protect your initial investment.',
  },
];
</script>

<style scoped>
.wheel-guide {
  --wheel-guide-bg: #f4f7f8;
  --wheel-guide-card: #ffffff;
  --wheel-guide-ink: #1b2a38;
  --wheel-guide-muted: #5b6b7a;
  --wheel-guide-line: #e4e9ec;
  --wheel-guide-shadow: 0 18px 40px rgba(27, 42, 56, 0.08);
  --wheel-guide-shadow-strong: 0 30px 80px rgba(15, 23, 42, 0.24);
  border: 1px solid rgba(228, 233, 236, 0.9);
  border-radius: 28px;
  background:
    radial-gradient(circle at top, rgba(14, 138, 109, 0.08), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 247, 248, 0.98));
  box-shadow: var(--wheel-guide-shadow-strong);
  color: var(--wheel-guide-ink);
}

.wheel-guide--page {
  width: 100%;
}

.wheel-guide__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 32px 24px;
  border-bottom: 1px solid rgba(228, 233, 236, 0.9);
}

.wheel-guide__eyebrow,
.wheel-guide-section-heading__eyebrow {
  margin: 0 0 10px;
  color: #0e8a6d;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.wheel-guide__title {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.wheel-guide__lead {
  max-width: 72ch;
  margin: 18px 0 0;
  color: var(--wheel-guide-muted);
  font-size: 1.02rem;
  line-height: 1.72;
}

.wheel-guide__close {
  align-self: flex-start;
  padding: 11px 16px;
  border: 0;
  border-radius: 999px;
  background: #102a24;
  color: #f4fbf8;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.wheel-guide__close:hover {
  transform: translateY(-1px);
  opacity: 0.94;
}

.wheel-guide__body {
  display: grid;
  gap: 30px;
  padding: 30px 32px 32px;
}

.wheel-guide__section {
  display: grid;
  gap: 18px;
}

.wheel-guide-section-heading {
  display: grid;
  gap: 4px;
}

.wheel-guide-section-heading h3 {
  margin: 0;
  font-size: clamp(1.45rem, 2vw, 1.8rem);
  line-height: 1.2;
}

.wheel-guide-section-heading p {
  margin: 0;
  color: var(--wheel-guide-muted);
  line-height: 1.68;
}

.wheel-guide-phase-grid,
.wheel-guide-reason-grid,
.wheel-guide-input-grid {
  display: grid;
  gap: 18px;
}

.wheel-guide-phase-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wheel-guide-reason-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wheel-guide-input-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wheel-guide-phase-card,
.wheel-guide-reason-card,
.wheel-guide-input-card,
.wheel-guide-list-card,
.wheel-guide-workflow-card,
.wheel-guide-diagram-card {
  border: 1px solid var(--wheel-guide-line);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--wheel-guide-shadow);
}

.wheel-guide-list-card,
.wheel-guide-workflow-card,
.wheel-guide-input-card {
  color: var(--wheel-guide-ink);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 248, 250, 0.96));
}

.wheel-guide-phase-card {
  padding: 24px;
}

.wheel-guide-phase-card--accent {
  background: linear-gradient(160deg, #f7f4ff, #eef6fc);
}

.wheel-guide-phase-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.wheel-guide-phase-card__badge--teal {
  background: #e7f5f0;
  color: #0e8a6d;
}

.wheel-guide-phase-card__badge--violet {
  background: #efecfb;
  color: #6d5bd0;
}

.wheel-guide-phase-card h3,
.wheel-guide-reason-card h4,
.wheel-guide-input-card h4,
.wheel-guide-step__body h4,
.wheel-guide-bottom-card h3 {
  margin: 14px 0 0;
  color: var(--wheel-guide-ink);
}

.wheel-guide-phase-card__summary,
.wheel-guide-reason-card p,
.wheel-guide-input-card p,
.wheel-guide-bottom-card p {
  margin: 12px 0 0;
  color: var(--wheel-guide-muted);
  line-height: 1.68;
}

.wheel-guide-phase-card__details {
  display: grid;
  gap: 12px;
  margin: 18px 0 0;
}

.wheel-guide-phase-card__details div {
  padding: 14px 16px;
  border: 1px solid rgba(228, 233, 236, 0.94);
  border-radius: 16px;
  background: #f6f8fa;
}

.wheel-guide-phase-card__details dt {
  margin: 0 0 6px;
  font-weight: 700;
}

.wheel-guide-phase-card__details dd {
  margin: 0;
  color: var(--wheel-guide-muted);
  line-height: 1.62;
}

.wheel-guide-diagram-card {
  margin: 0;
  padding: 24px 20px 18px;
}

.wheel-guide-diagram-card__svg {
  display: block;
  width: 100%;
  height: auto;
}

.wheel-guide-diagram-card__caption {
  margin-top: 16px;
  color: var(--wheel-guide-muted);
  text-align: center;
  line-height: 1.68;
}

.wheel-guide-clean-list {
  margin: 0;
  padding: 0 24px;
  list-style: none;
}

.wheel-guide-clean-list li {
  padding: 18px 0;
  border-bottom: 1px solid var(--wheel-guide-line);
}

.wheel-guide-clean-list li:last-child {
  border-bottom: 0;
}

.wheel-guide-clean-list b {
  display: block;
  margin-bottom: 4px;
  color: var(--wheel-guide-ink);
}

.wheel-guide-clean-list p,
.wheel-guide-callout p,
.wheel-guide-step__body p,
.wheel-guide-step__list li {
  margin: 0;
  color: var(--wheel-guide-muted);
  line-height: 1.65;
}

.wheel-guide-reason-card,
.wheel-guide-input-card {
  padding: 20px;
}

.wheel-guide-list-card {
  padding: 4px 0;
}

.wheel-guide-workflow-card {
  padding: 22px;
}

.wheel-guide-callout {
  margin-bottom: 18px;
  padding: 16px 18px;
  border-left: 4px solid #0e8a6d;
  border-radius: 0 14px 14px 0;
  background: #e7f5f0;
}

.wheel-guide-callout p {
  color: #14523f;
}

.wheel-guide-step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border: 1px solid rgba(228, 233, 236, 0.94);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
}

.wheel-guide-step + .wheel-guide-step {
  margin-top: 18px;
}

.wheel-guide-step__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e7f5f0;
  color: #0e8a6d;
  font-weight: 700;
  font-size: 0.92rem;
}

.wheel-guide-step__body {
  display: grid;
  gap: 8px;
}

.wheel-guide-step__body h4 {
  margin-top: 0;
}

.wheel-guide-step__list {
  margin: 0;
  padding-left: 18px;
}

.wheel-guide-step__list b {
  color: var(--wheel-guide-ink);
}

.wheel-guide-step__list li + li {
  margin-top: 6px;
}

.wheel-guide-bottom-card {
  padding: 28px;
  border-radius: 22px;
  background: linear-gradient(150deg, #10312a, #173b4a);
  color: #eaf4f1;
}

.wheel-guide-bottom-card h3 {
  margin-top: 0;
  color: #ffffff;
}

.wheel-guide-bottom-card p {
  color: #c8dcd6;
  max-width: 72ch;
}

@media (max-width: 960px) {
  .wheel-guide-phase-grid,
  .wheel-guide-reason-grid,
  .wheel-guide-input-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .wheel-guide {
    border-radius: 22px;
  }

  .wheel-guide__header {
    flex-direction: column;
    padding: 24px 22px 20px;
  }

  .wheel-guide__body {
    gap: 24px;
    padding: 24px 22px 22px;
  }

  .wheel-guide__close {
    width: 100%;
  }

  .wheel-guide-phase-card,
  .wheel-guide-reason-card,
  .wheel-guide-input-card,
  .wheel-guide-workflow-card,
  .wheel-guide-diagram-card,
  .wheel-guide-bottom-card {
    padding-left: 18px;
    padding-right: 18px;
  }

  .wheel-guide-clean-list {
    padding: 0 18px;
  }

  .wheel-guide-step {
    flex-direction: column;
  }
}
</style>

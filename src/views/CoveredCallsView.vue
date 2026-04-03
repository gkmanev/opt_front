<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Covered Calls</span>
      </div>
      <span class="pill">Strategy Library</span>
      <h1 class="content-title">Covered calls: generate income from shares you already own</h1>
      <p class="content-intro">
        A covered call lets you collect option premium on stock you already hold. In exchange, you agree to sell
        those shares at a chosen strike price if the stock rises above it before expiration.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Share-backed income strategy</span>
        <span class="content-meta-chip">Pairs naturally with the wheel strategy</span>
        <span class="content-meta-chip">Updated April 1, 2026</span>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
        <a class="btn btn-outline" href="/wheel-strategy" @click="navigateRoute($event, '/wheel-strategy')">See the wheel strategy</a>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Core Tradeoff</div>
        <h2 class="content-panel-title">You get immediate premium but cap upside above the strike</h2>
        <p class="content-panel-copy">
          Covered calls work best when you are willing to sell the shares at a specific price. If the stock rallies
          through the strike, your gains stop there and the shares can be called away.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Best Fit</div>
        <h2 class="content-panel-title">Useful on stocks you already own and would sell higher</h2>
        <p class="content-panel-copy">
          The strategy fits investors who want to turn a long stock position into an income-producing position without
          adding naked option risk.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Connection</div>
        <h2 class="content-panel-title">The covered call is the second half of the wheel</h2>
        <p class="content-panel-copy">
          After assignment from a cash-secured put, many investors use covered calls to continue collecting premium
          until the shares are eventually sold away.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">How It Works</div>
      <h2 class="content-section-title">The covered call workflow</h2>
      <div class="content-grid">
        <article class="content-step">
          <span class="content-step-number">1</span>
          <h3>Own at least 100 shares</h3>
          <p>
            One covered call contract usually requires 100 shares of the underlying stock. The shares are what make the option
            "covered."
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">2</span>
          <h3>Choose a strike where you are willing to sell</h3>
          <p>
            If the strike is too close, you may lose shares you wanted to keep. If it is too far away, premium may be too small
            to justify the trade.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">3</span>
          <h3>Sell the call and collect premium</h3>
          <p>
            If the stock stays below the strike, the option can expire worthless and you keep both the shares and the income.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">4</span>
          <h3>Let shares go or sell another call</h3>
          <p>
            If the shares are called away, you exit at the strike price. If not, you can review whether to sell another call
            for the next expiration cycle.
          </p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">Execution Checklist</div>
      <h2 class="content-section-title">What matters before selling a covered call</h2>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Know your exit price</h3>
          <p>Sell calls only at strikes where you are genuinely happy to let the shares go.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Track your cost basis</h3>
          <p>Premium reduces your effective cost basis, but it does not erase stock downside if the shares keep falling.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Check the earnings calendar</h3>
          <p>Calls sold into earnings can be assigned faster than expected if the stock gaps higher.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Use liquid chains</h3>
          <p>Tighter spreads make it easier to manage or close the trade if the stock moves sharply.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Avoid forcing income on weak holdings</h3>
          <p>If you no longer want to own the stock, selling calls is often the wrong fix. Reassess the underlying first.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Coordinate with portfolio goals</h3>
          <p>Covered calls are strongest when they support your broader sell discipline rather than override it.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Main Benefit</div>
        <h2 class="content-panel-title">Turns idle shares into an income-producing position</h2>
        <p class="content-panel-copy">
          Instead of waiting passively, a covered call lets long stock positions earn premium during sideways or moderately bullish
          periods.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Main Limitation</div>
        <h2 class="content-panel-title">You give up part of a sharp upside move</h2>
        <p class="content-panel-copy">
          Once the strike is sold, you no longer have unlimited upside during that contract cycle. The premium is the tradeoff.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-cta-card">
      <div>
        <div class="section-eyebrow">Next Step</div>
        <h2 class="content-section-title">Use covered calls on stocks you would own without the option</h2>
        <p class="content-panel-copy">
          PutPulse helps screen for quality names and premium setups so covered calls fit a disciplined stock process instead of a
          premium-chasing process.
        </p>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Create Free Account</a>
        <a class="btn btn-outline" href="/cash-secured-puts" @click="navigateRoute($event, '/cash-secured-puts')">Review Put Strategy</a>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['navigate-route']);

const navigateRoute = (event, path) => {
  emit('navigate-route', event, path);
};
</script>

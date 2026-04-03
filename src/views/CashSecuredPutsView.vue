<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Cash-Secured Puts</span>
      </div>
      <span class="pill">Strategy Library</span>
      <h1 class="content-title">Cash-secured puts: collect premium at prices you want to own</h1>
      <p class="content-intro">
        A cash-secured put lets you get paid for naming the price where you are willing to buy a stock.
        The trade works best when you already want to own the company and are comfortable holding the shares
        if assignment happens.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Income-focused options strategy</span>
        <span class="content-meta-chip">Best for quality stocks you already want to own</span>
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
        <div class="section-eyebrow">Why Investors Use It</div>
        <h2 class="content-panel-title">Get paid while waiting for your entry price</h2>
        <p class="content-panel-copy">
          Instead of placing a limit order and waiting, you sell a put and collect premium up front. If the
          stock stays above your strike, you keep the income. If it drops below the strike, you may buy shares
          at the price you already selected.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Capital Requirement</div>
        <h2 class="content-panel-title">Keep enough cash to buy 100 shares</h2>
        <p class="content-panel-copy">
          A truly cash-secured put means your account holds the cash required to purchase 100 shares at the
          strike price. That turns assignment into a planned outcome instead of a forced scramble for capital.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Best Fit</div>
        <h2 class="content-panel-title">Neutral to moderately bullish outlook</h2>
        <p class="content-panel-copy">
          This strategy is strongest when you want exposure to a stock at a lower price, expect stable or
          modestly positive price action, and prefer steady premium over unlimited upside.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">How It Works</div>
      <h2 class="content-section-title">The four-step cash-secured put workflow</h2>
      <div class="content-grid">
        <article class="content-step">
          <span class="content-step-number">1</span>
          <h3>Choose a stock you would own anyway</h3>
          <p>
            Start with a fundamentally strong company. If the business quality is weak, assignment becomes a
            problem instead of an opportunity.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">2</span>
          <h3>Select the strike and expiration</h3>
          <p>
            Pick the price where you are happy to buy shares and an expiration that offers an acceptable balance
            between time premium, liquidity, and assignment risk.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">3</span>
          <h3>Sell the put and collect premium</h3>
          <p>
            Premium arrives immediately. From there, your outcomes are simple: the option expires worthless and
            you keep the cash, or you buy the shares at the strike.
          </p>
        </article>
        <article class="content-step">
          <span class="content-step-number">4</span>
          <h3>Decide whether to repeat, roll, or accept assignment</h3>
          <p>
            If the setup still matches your thesis, you can sell another put. If assignment happens on a quality
            name, that can become the entry into a <a href="/wheel-strategy" @click="navigateRoute($event, '/wheel-strategy')">wheel strategy</a>.
          </p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">Screening Checklist</div>
      <h2 class="content-section-title">What to check before selling a put</h2>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Business quality</h3>
          <p>Use companies with durable cash flow, reasonable balance sheets, and fundamentals you trust through volatility.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Entry price discipline</h3>
          <p>Do not sell strikes above prices where you would actually want to own the shares. Your strike is your commitment price.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Earnings calendar</h3>
          <p>Avoid selling puts into earnings unless you deliberately want event risk. A single report can change the trade profile fast.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Liquidity</h3>
          <p>Look for tight bid-ask spreads and enough open interest so you are not giving away too much edge on entry or exit.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Return on collateral</h3>
          <p>Measure premium relative to the cash tied up. A high raw premium is meaningless if the collateral requirement is too large.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Portfolio concentration</h3>
          <p>Even good companies can fall together in a market shock. Spread positions across sectors and keep assignment sizing realistic.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Main Risk</div>
        <h2 class="content-panel-title">You can still lose money if the stock falls hard</h2>
        <p class="content-panel-copy">
          Premium cushions your entry price a bit, but it does not remove downside risk. A cash-secured put is not a free-income trade.
          It is a stock-acquisition strategy with premium attached.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Opportunity Cost</div>
        <h2 class="content-panel-title">Your upside is capped at the premium collected</h2>
        <p class="content-panel-copy">
          If the stock rallies sharply, you do not participate the way a shareholder would. The trade gives up unlimited upside in
          exchange for defined premium and a better entry price target.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-cta-card">
      <div>
        <div class="section-eyebrow">Next Step</div>
        <h2 class="content-section-title">Use screened setups instead of guessing at strikes</h2>
        <p class="content-panel-copy">
          PutPulse highlights fundamentally stronger companies, premium levels, and monthly ROI so you can review cash-secured put
          ideas faster and move from research to execution with more structure.
        </p>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Create Free Account</a>
        <a class="btn btn-outline" href="/wheel-strategy" @click="navigateRoute($event, '/wheel-strategy')">Read Wheel Strategy Guide</a>
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

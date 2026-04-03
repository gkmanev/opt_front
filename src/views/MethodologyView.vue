<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Methodology</span>
      </div>
      <span class="pill">Trust Center</span>
      <h1 class="content-title">Methodology: how PutPulse narrows option setups into a usable shortlist</h1>
      <p class="content-intro">
        PutPulse is built around a simple principle: premium alone is not enough. The platform is designed to surface
        cash-secured put and wheel-friendly setups on businesses you could reasonably own if assignment happens.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Updated April 1, 2026</span>
        <span class="content-meta-chip">Selection process overview</span>
        <span class="content-meta-chip">Educational, not advisory</span>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/" @click="navigateRoute($event, '/')">View Today's Top</a>
        <a class="btn btn-outline" href="/contact" @click="navigateRoute($event, '/contact')">Ask a Question</a>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Step 1</div>
        <h2 class="content-panel-title">Start with companies worth owning</h2>
        <p class="content-panel-copy">
          The first filter is the underlying business, not the contract. PutPulse prioritizes stronger companies so
          assignment remains a manageable outcome instead of an immediate regret.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Step 2</div>
        <h2 class="content-panel-title">Screen for option income that is meaningful on collateral</h2>
        <p class="content-panel-copy">
          Premium is evaluated relative to the capital required. A contract may look attractive in raw dollars while
          being weak in return-on-collateral terms.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Step 3</div>
        <h2 class="content-panel-title">Favor setups that fit a repeatable wheel workflow</h2>
        <p class="content-panel-copy">
          If a setup would be difficult to carry into assignment or covered calls, it is weaker for PutPulse's
          intended use case even if the premium looks high.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">Selection Criteria</div>
      <h2 class="content-section-title">What goes into the shortlist</h2>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Fundamental quality</h3>
          <p>Preference goes to companies with stronger business quality and balance-sheet resilience.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Technical context</h3>
          <p>Setup quality improves when the price action is not working aggressively against the position.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Monthly ROI profile</h3>
          <p>PutPulse highlights premium levels that are meaningful for the collateral committed, not just eye-catching in isolation.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Delta and assignment profile</h3>
          <p>Contracts are evaluated through the lens of assignment readiness rather than premium maximization.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Liquidity and spreads</h3>
          <p>Wide spreads can make attractive setups less usable in practice, especially when management is needed.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Event awareness</h3>
          <p>Earnings dates and other catalysts matter because a single event can change the entire trade profile.</p>
        </article>
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

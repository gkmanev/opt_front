<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>About</span>
      </div>
      <span class="pill">Trust Center</span>
      <h1 class="content-title">About PutPulse</h1>
      <p class="content-intro">
        PutPulse is focused on helping investors review option income setups with more structure. The product is built
        around cash-secured puts, covered calls, and wheel-style workflows on companies you would be comfortable owning.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Options research workflow</span>
        <span class="content-meta-chip">Assignment-ready mindset</span>
        <span class="content-meta-chip">Educational, not advisory</span>
      </div>
      <div class="content-actions">
        <a class="btn btn-primary" href="/methodology" @click="navigateRoute($event, '/methodology')">See Methodology</a>
        <a class="btn btn-outline" href="/contact" @click="navigateRoute($event, '/contact')">Contact</a>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="content-grid">
      <article class="card content-panel">
        <div class="section-eyebrow">Mission</div>
        <h2 class="content-panel-title">Reduce noise in options research</h2>
        <p class="content-panel-copy">
          Many option screens optimize for activity or premium alone. PutPulse is oriented around narrowing the field to
          setups that make sense inside a repeatable income process.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Audience</div>
        <h2 class="content-panel-title">Built for investors who care about assignment quality</h2>
        <p class="content-panel-copy">
          The platform is a better fit for users who think in terms of collateral, stock ownership, and systematic follow-through
          than for users chasing one-off option premium.
        </p>
      </article>
      <article class="card content-panel">
        <div class="section-eyebrow">Philosophy</div>
        <h2 class="content-panel-title">Process before prediction</h2>
        <p class="content-panel-copy">
          PutPulse does not claim to predict markets perfectly. The product aims to improve decision quality by making setup
          selection more disciplined and more transparent.
        </p>
      </article>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">What PutPulse Emphasizes</div>
      <h2 class="content-section-title">The principles behind the product</h2>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Assignment is a real possibility</h3>
          <p>Strategies are framed around the outcomes that can actually happen, not just the outcome you hope for.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Stock quality matters</h3>
          <p>The underlying business is central because option income strategies can quickly become stock ownership strategies.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Return should be measured on committed capital</h3>
          <p>Premium is evaluated in the context of collateral and portfolio usage, not only as an absolute number.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Research should be transparent</h3>
          <p>Users should understand why a setup appears and what assumptions still require their own judgment.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Tools should shorten review time, not replace risk management</h3>
          <p>PutPulse is designed to support analysis, not to outsource accountability for the trade.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Educational framing matters</h3>
          <p>The product is for informational and educational use. Users remain responsible for their own investment decisions.</p>
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

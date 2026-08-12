<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>PutPulse vs ChatGPT</span>
      </div>
      <span class="pill">Built for options investors</span>
      <h1 class="content-title">PutPulse vs ChatGPT</h1>
      <p class="content-intro">
        <strong>ChatGPT is a general-purpose AI assistant. PutPulse is built specifically for options investors.</strong>
      </p>
      <div class="content-actions">
        <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
        <a class="btn btn-outline" href="/agent" @click="navigateRoute($event, '/agent')">Try PutPulse Agent</a>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-card">
      <div class="section-eyebrow">The difference</div>
      <h2 class="content-section-title">AI grounded in the latest market information</h2>
      <p class="content-panel-copy">
        PutPulse combines AI with <strong>live options chains and current market data</strong>, so it can screen and
        analyze opportunities with current financial and options-market data rather than relying only on an AI model's
        general knowledge.
      </p>
      <div class="content-checklist">
        <article class="content-checklist-item">
          <h3>Live options chains</h3>
          <p>Live option prices, Greeks, volume, and open interest.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Current market context</h3>
          <p>The latest stock price and technical indicators.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Financial statements</h3>
          <p>Latest balance sheet data, income statements, and cash flow statements.</p>
        </article>
        <article class="content-checklist-item">
          <h3>Company fundamentals</h3>
          <p>Earnings dates and company fundamentals to support options research.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="card content-cta-card">
      <div>
        <div class="section-eyebrow">PutPulse</div>
        <h2 class="content-section-title">AI + live options data + current fundamentals + purpose-built screening.</h2>
      </div>
      <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['navigate-route']);

const navigateRoute = (event, path) => emit('navigate-route', event, path);
</script>

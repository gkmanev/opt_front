<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Refund Policy</span>
      </div>
      <span class="pill">Legal</span>
      <h1 class="content-title">Refund Policy</h1>
      <p class="content-intro">
        We believe you deserve to work with a company that is transparent and straightforward
        about billing. This page explains exactly how refunds work at PutPulse.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Effective: July 30, 2026</span>
        <span class="content-meta-chip">Last updated: July 30, 2026</span>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="terms-layout">

      <!-- Sticky TOC -->
      <nav class="terms-toc" aria-label="Table of contents">
        <p class="terms-toc-label">On this page</p>
        <ol class="terms-toc-list">
          <li><a href="#free-plan">1. Free Plan</a></li>
          <li><a href="#cancellation">2. Cancellation</a></li>
          <li><a href="#monthly">3. Monthly Plan Refunds</a></li>
          <li><a href="#promotions">4. Promotions &amp; Discounts</a></li>
          <li><a href="#disputes">5. Disputes</a></li>
          <li><a href="#contact">6. Contact Us</a></li>
        </ol>
      </nav>

      <!-- Body -->
      <div class="terms-body">

        <article id="free-plan" class="terms-section">
          <h2>1. Free Plan</h2>
          <p>
            To demonstrate our commitment to you, PutPulse offers a fully functional
            <strong>Free plan at no cost</strong> — no credit card required and no trial period that
            expires. The Free plan includes 5 AI chats per day, 1 full stock analysis per day, 5
            screener results per scan, and the most recent 8 conversation-history items.
          </p>
          <p>
            Upgrading to Pro removes these limits and provides unlimited chats, stock analyses, and
            screener access, plus full conversation history.
            <a href="/pricing" @click="navigateRoute($event, '/pricing')">View pricing.</a>
          </p>
        </article>

        <article id="cancellation" class="terms-section">
          <h2>2. Cancellation</h2>
          <p>
            There are no contracts or long-term commitments. You can cancel your Pro subscription
            at any time through your Stripe billing portal — no forms, no phone
            calls, no waiting.
          </p>
          <p>
            When you cancel, your Pro subscription remains <strong>active for the remainder of the
            current paid billing period</strong>. When that period ends, your account automatically
            reverts to the Free plan. You keep your account and access to all
            free features indefinitely.
          </p>
        </article>

        <article id="monthly" class="terms-section">
          <h2>3. Monthly Plan Refunds</h2>
          <p>
            <strong>Monthly Pro subscriptions are non-refundable, except where required by applicable
            law.</strong> Because the Free plan is available without an expiring trial, you have every
            opportunity to evaluate PutPulse before
            committing to a paid plan.
          </p>
          <p>
            If you cancel a monthly subscription, your access continues until the end of the
            current billing period. You will not be charged again after that.
          </p>
        </article>

        <article id="promotions" class="terms-section">
          <h2>4. Promotions &amp; Discounts</h2>
          <p>
            Subscriptions purchased under a promotional price (for example, a seasonal discount or
            limited-time offer) are <strong>non-refundable</strong> and all sales are final.
          </p>
          <p>
            Promotional pricing locks in the discounted rate for the duration of the promotion's
            stated terms. Your plan will renew automatically at the promotional or regularly
            discounted rate as specified at the time of purchase. You can cancel to avoid
            auto-renewal; your access will remain active until the end of the
            current billing cycle.
          </p>
        </article>

        <article id="disputes" class="terms-section">
          <h2>5. Disputes</h2>
          <p>
            If you believe you have been charged in error, please contact us <strong>before</strong>
            filing a dispute or chargeback with your bank or card issuer. We are happy to investigate
            and resolve billing issues quickly.
          </p>
          <p>
            Chargebacks initiated without first contacting us may result in immediate suspension of
            your account while the dispute is under review.
          </p>
        </article>

        <article id="contact" class="terms-section">
          <h2>6. Contact Us</h2>
          <p>
            We are proud of PutPulse and the support we provide, and we want every interaction to
            be straightforward and fair. If you have any questions about this policy before
            upgrading — or at any point during your subscription — please reach out via our
            <a href="/contact" @click="navigateRoute($event, '/contact')">contact page</a> and
            we will be happy to help.
          </p>
        </article>

      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['navigate-route']);
const navigateRoute = (event, path) => emit('navigate-route', event, path);
</script>

<style scoped>
.terms-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 3rem;
  align-items: start;
}

.terms-toc {
  position: sticky;
  top: 5rem;
}

.terms-toc-label {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 700;
}

.terms-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.1rem;
  border-left: 1px solid rgba(51, 65, 85, 0.8);
  padding-left: 1rem;
}

.terms-toc-list li {
  font-size: 0.82rem;
  line-height: 1.6;
}

.terms-toc-list a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s;
}

.terms-toc-list a:hover {
  color: #cbd5e1;
}

.terms-body {
  display: grid;
  gap: 0;
}

.terms-section {
  padding: 2rem 0;
  border-bottom: 1px solid rgba(30, 38, 49, 0.9);
}

.terms-section:last-child {
  border-bottom: none;
}

.terms-section h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #f8fafc;
  scroll-margin-top: 5rem;
}

.terms-section p {
  margin: 0 0 0.9rem;
  color: #94a3b8;
  line-height: 1.75;
  font-size: 0.93rem;
}

.terms-section p:last-child {
  margin-bottom: 0;
}

.terms-section ul {
  margin: 0.5rem 0 0.9rem 1.1rem;
  padding: 0;
  color: #94a3b8;
  line-height: 1.75;
  font-size: 0.93rem;
  display: grid;
  gap: 0.5rem;
}

.terms-section a {
  color: #67e8f9;
  text-decoration: none;
}

.terms-section a:hover {
  text-decoration: underline;
}

.terms-section strong {
  color: #e2e8f0;
}

@media (max-width: 860px) {
  .terms-layout {
    grid-template-columns: 1fr;
  }

  .terms-toc {
    position: static;
    padding: 1.25rem;
    border-radius: 1rem;
    border: 1px solid rgba(148, 163, 184, 0.14);
    background: rgba(9, 14, 28, 0.6);
  }
}

@media (max-width: 640px) {
  .terms-section h2 {
    font-size: 1.1rem;
  }
}
</style>

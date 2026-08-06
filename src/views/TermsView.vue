<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Terms of Service</span>
      </div>
      <span class="pill">Legal</span>
      <h1 class="content-title">Terms of Service</h1>
      <p class="content-intro">
        Please read these terms carefully before using PutPulse. By creating an account or
        accessing the service you agree to be bound by them.
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
          <li><a href="#acceptance">1. Acceptance of Terms</a></li>
          <li><a href="#service">2. Description of Service</a></li>
          <li><a href="#accounts">3. User Accounts</a></li>
          <li><a href="#subscriptions">4. Subscriptions &amp; Payments</a></li>
          <li><a href="#acceptable-use">5. Acceptable Use</a></li>
          <li><a href="#ip">6. Intellectual Property</a></li>
          <li><a href="#disclaimer">7. Financial Disclaimer</a></li>
          <li><a href="#liability">8. Limitation of Liability</a></li>
          <li><a href="#termination">9. Termination</a></li>
          <li><a href="#changes">10. Changes to Terms</a></li>
          <li><a href="#contact">11. Contact</a></li>
        </ol>
      </nav>

      <!-- Body -->
      <div class="terms-body">

        <article id="acceptance" class="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using PutPulse (the "Service"), you confirm that you are at least 18 years
            of age, have the legal capacity to enter into a binding agreement, and accept these Terms of
            Service ("Terms") in full. If you do not agree with any part of these Terms, you must not use
            the Service.
          </p>
          <p>
            These Terms constitute the entire agreement between you and PutPulse regarding your use of the
            Service and supersede all prior agreements or understandings.
          </p>
        </article>

        <article id="service" class="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            PutPulse is an options research and education platform that provides screened cash-secured put
            opportunities, covered call ideas, wheel strategy workflows, and related educational content
            (collectively, the "Service"). The Service is offered under two plans:
          </p>
          <ul>
            <li>
              <strong>Free</strong> — 5 AI chats per day, 1 full stock analysis per day, 5 screener
              results per scan, and the most recent 8 conversation-history items. No payment is required.
            </li>
            <li>
              <strong>Pro</strong> — Unlimited AI chats, stock analyses, and screener access, plus full
              conversation history. Pro is available for a recurring monthly subscription fee as stated
              at checkout.
            </li>
          </ul>
          <p>
            PutPulse reserves the right to modify, suspend, or discontinue any part of the Service at any
            time with reasonable notice where practicable.
          </p>
        </article>

        <article id="accounts" class="terms-section">
          <h2>3. User Accounts</h2>
          <p>
            To access personalised features you must register for an account by providing a valid email
            address, a username, and a password. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Verify your email address before your account is activated.</li>
            <li>
              Keep your password secure and not share it with any third party. You are responsible for
              all activity that occurs under your account.
            </li>
            <li>
              Notify PutPulse immediately at
              <a href="/contact" @click="navigateRoute($event, '/contact')">our contact page</a> if you
              suspect unauthorised use of your account.
            </li>
          </ul>
          <p>
            PutPulse reserves the right to suspend or delete accounts that violate these Terms, provide
            false information, or remain inactive for an extended period.
          </p>
        </article>

        <article id="subscriptions" class="terms-section">
          <h2>4. Subscriptions &amp; Payments</h2>
          <h3>Billing</h3>
          <p>
            Pro subscriptions are billed on a recurring monthly basis. Payments are processed securely by
            <strong>Stripe</strong>. By subscribing, you authorise Stripe to charge your payment method on
            each renewal date.
          </p>
          <h3>Cancellation</h3>
          <p>
            You may cancel your Pro subscription at any time via your Stripe billing portal. Cancellation
            takes effect at the end of the current billing period — you retain Pro access until that date
            and are not charged again after cancellation.
          </p>
          <h3>Refunds</h3>
          <p>
            Subscription fees are generally non-refundable except where required by applicable law or at
            PutPulse's discretion. Refund requests should be directed to
            <a href="/contact" @click="navigateRoute($event, '/contact')">our contact page</a>.
          </p>
          <h3>Price changes</h3>
          <p>
            PutPulse may change the subscription price with at least 30 days' prior notice. Continued use
            of the Service after the effective date of a price change constitutes your acceptance of the
            new price.
          </p>
          <h3>Taxes</h3>
          <p>
            Applicable sales taxes and VAT, if any, are shown at checkout and depend on your jurisdiction.
          </p>
        </article>

        <article id="acceptable-use" class="terms-section">
          <h2>5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Scrape, crawl, or systematically extract data without written permission.</li>
            <li>
              Reproduce, redistribute, or resell screener data or any other Service output for
              commercial purposes.
            </li>
            <li>Attempt to reverse-engineer, decompile, or otherwise access the source code.</li>
            <li>Upload or transmit malicious code, viruses, or any disruptive content.</li>
            <li>
              Circumvent any access controls, rate limits, or subscription restrictions, including
              sharing login credentials to give multiple individuals access to a single paid account.
            </li>
            <li>Violate any applicable local, national, or international law or regulation.</li>
          </ul>
          <p>
            Violation of these restrictions may result in immediate suspension or termination of your
            account without refund.
          </p>
        </article>

        <article id="ip" class="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content, design, data compilations, algorithms, and software comprising the Service are
            the exclusive property of PutPulse or its licensors and are protected by copyright, trade
            secret, and other intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable, revocable licence to access and
            use the Service for your own personal, non-commercial research purposes only. This licence
            does not include any right to reproduce, distribute, modify, or create derivative works from
            Service content.
          </p>
        </article>

        <article id="disclaimer" class="terms-section">
          <h2>7. Financial Disclaimer</h2>
          <p>
            <strong>
              The Service is provided for informational and educational purposes only and does not
              constitute financial, investment, legal, or tax advice.
            </strong>
          </p>
          <p>
            Screener results, strategy guides, and all other content are generated algorithmically or
            editorially for research purposes. Nothing on the Service constitutes a recommendation to
            buy, sell, or hold any security. Options trading involves substantial risk of loss and is
            not suitable for all investors.
          </p>
          <p>
            Past performance of any strategy or screener output is not indicative of future results.
            You are solely responsible for your investment decisions and for ensuring those decisions
            comply with applicable regulations in your jurisdiction.
          </p>
          <p>
            PutPulse makes no representation that the data is accurate, complete, or up to date.
            Market data may be delayed and should be independently verified before making any trade.
          </p>
        </article>

        <article id="liability" class="terms-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, PutPulse and its affiliates, officers,
            employees, and licensors shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages — including loss of profits, data, or goodwill — arising
            from your use of or inability to use the Service, even if advised of the possibility of
            such damages.
          </p>
          <p>
            In no event shall PutPulse's total cumulative liability to you exceed the greater of (a) the
            amount you paid to PutPulse in the twelve months preceding the claim, or (b) USD $50.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties or the limitation of
            liability for certain types of damages; in such jurisdictions PutPulse's liability is limited
            to the minimum extent permitted by law.
          </p>
        </article>

        <article id="termination" class="terms-section">
          <h2>9. Termination</h2>
          <p>
            You may stop using the Service and delete your account at any time by contacting us. Upon
            termination, your right to access the Service ceases immediately.
          </p>
          <p>
            PutPulse may terminate or suspend your account without notice if you breach these Terms, if
            required by law, or if we reasonably believe your use poses a risk to other users or to the
            integrity of the Service. Active paid subscriptions will be cancelled and any prepaid
            amounts for the unused portion of the current billing period may be refunded at PutPulse's
            discretion.
          </p>
          <p>
            Provisions that by their nature should survive termination — including intellectual property
            rights, the financial disclaimer, and limitation of liability — will continue to apply.
          </p>
        </article>

        <article id="changes" class="terms-section">
          <h2>10. Changes to Terms</h2>
          <p>
            PutPulse reserves the right to update these Terms at any time. When we make material
            changes, we will update the "Last updated" date at the top of this page and, where
            appropriate, notify you by email. Your continued use of the Service after such changes
            constitutes your acceptance of the revised Terms.
          </p>
        </article>

        <article id="contact" class="terms-section">
          <h2>11. Contact</h2>
          <p>
            If you have questions about these Terms, please reach out via our
            <a href="/contact" @click="navigateRoute($event, '/contact')">contact page</a>.
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

/* TOC */
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

/* Body */
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

.terms-section h3 {
  margin: 1.25rem 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #cbd5e1;
  letter-spacing: 0.03em;
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
  gap: 0.35rem;
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

<template>
  <section class="content-page-hero">
    <div class="container">
      <div class="content-breadcrumbs">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <span>/</span>
        <span>Privacy Policy</span>
      </div>
      <span class="pill">Legal</span>
      <h1 class="content-title">Privacy Policy</h1>
      <p class="content-intro">
        This policy explains what data PutPulse collects, why we collect it, how we use it,
        and the choices you have over your information.
      </p>
      <div class="content-meta-row">
        <span class="content-meta-chip">Effective: May 11, 2026</span>
        <span class="content-meta-chip">Last updated: May 11, 2026</span>
      </div>
    </div>
  </section>

  <section class="container content-section">
    <div class="terms-layout">

      <!-- Sticky TOC -->
      <nav class="terms-toc" aria-label="Table of contents">
        <p class="terms-toc-label">On this page</p>
        <ol class="terms-toc-list">
          <li><a href="#controller">1. Data Controller</a></li>
          <li><a href="#data-collected">2. Data We Collect</a></li>
          <li><a href="#how-we-use">3. How We Use Your Data</a></li>
          <li><a href="#legal-basis">4. Legal Basis</a></li>
          <li><a href="#sharing">5. Sharing &amp; Processors</a></li>
          <li><a href="#cookies">6. Cookies &amp; Storage</a></li>
          <li><a href="#retention">7. Data Retention</a></li>
          <li><a href="#security">8. Security</a></li>
          <li><a href="#rights">9. Your Rights</a></li>
          <li><a href="#children">10. Children's Privacy</a></li>
          <li><a href="#changes">11. Changes to This Policy</a></li>
          <li><a href="#contact">12. Contact</a></li>
        </ol>
      </nav>

      <!-- Body -->
      <div class="terms-body">

        <article id="controller" class="terms-section">
          <h2>1. Data Controller</h2>
          <p>
            PutPulse ("we", "us", "our") is the data controller responsible for personal data
            processed through the Service. For privacy questions or requests please use our
            <a href="/contact" @click="navigateRoute($event, '/contact')">contact page</a>.
          </p>
        </article>

        <article id="data-collected" class="terms-section">
          <h2>2. Data We Collect</h2>

          <h3>Account data</h3>
          <p>
            When you register we collect your username, first name, last name, email address, and a
            hashed password. You must verify your email before your account is activated.
          </p>

          <h3>Subscription &amp; billing data</h3>
          <p>
            If you subscribe to Pro, payment is handled entirely by <strong>Paddle</strong>. PutPulse
            does not store card numbers or full payment details. We receive from Paddle: a subscription
            ID, a customer ID, subscription status, and billing period dates in order to manage your
            plan access.
          </p>

          <h3>Usage data</h3>
          <p>
            We collect standard server-side logs that may include your IP address, browser type,
            pages visited, and timestamps. This data is used for security monitoring and diagnosing
            technical issues.
          </p>

          <h3>Email preference data</h3>
          <p>
            If you opt in to the Daily Top 3 email briefing, we store your email address and
            subscription status (active, pending verification, unsubscribed) alongside the date
            you subscribed or unsubscribed.
          </p>

          <h3>Data you do not provide</h3>
          <p>
            PutPulse does not purchase third-party marketing lists, run behavioural advertising, or
            build profiles from external data brokers.
          </p>
        </article>

        <article id="how-we-use" class="terms-section">
          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>
              <strong>Account management</strong> — create and authenticate your account, send the
              email verification link, and allow you to log in.
            </li>
            <li>
              <strong>Service delivery</strong> — enforce your plan limits (Basic vs. Pro), return
              screener results appropriate to your tier, and display your profile information.
            </li>
            <li>
              <strong>Subscription management</strong> — process Paddle webhook events to activate,
              update, or cancel your Pro subscription.
            </li>
            <li>
              <strong>Email briefings</strong> — send the Daily Top 3 email if you have opted in and
              your email is verified.
            </li>
            <li>
              <strong>Security &amp; fraud prevention</strong> — detect and investigate suspicious
              activity and protect the integrity of the Service.
            </li>
            <li>
              <strong>Legal compliance</strong> — retain records as required by applicable law and
              respond to lawful requests from authorities.
            </li>
          </ul>
          <p>We do not sell your personal data to third parties.</p>
        </article>

        <article id="legal-basis" class="terms-section">
          <h2>4. Legal Basis for Processing</h2>
          <p>Where GDPR or equivalent legislation applies, we rely on the following bases:</p>
          <ul>
            <li>
              <strong>Contract</strong> — processing necessary to create and manage your account and
              fulfil your subscription.
            </li>
            <li>
              <strong>Legitimate interests</strong> — security monitoring, fraud prevention, and
              service improvement, where these interests are not overridden by your rights.
            </li>
            <li>
              <strong>Consent</strong> — sending the Daily Top 3 email briefing (opt-in at
              registration, withdrawable at any time).
            </li>
            <li>
              <strong>Legal obligation</strong> — retaining records required by law.
            </li>
          </ul>
        </article>

        <article id="sharing" class="terms-section">
          <h2>5. Sharing &amp; Third-Party Processors</h2>
          <p>
            We share your data only with the service providers necessary to operate PutPulse and
            only to the extent required for those purposes:
          </p>
          <ul>
            <li>
              <strong>Paddle</strong> — payment processing and subscription management. Paddle acts
              as merchant of record and processes billing data under their own
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener">privacy policy</a>.
            </li>
            <li>
              <strong>Hosting &amp; infrastructure providers</strong> — cloud servers and CDN
              services used to run the application and deliver static assets.
            </li>
            <li>
              <strong>Email delivery provider</strong> — transactional email (verification links,
              Daily Top 3 briefings) sent via a third-party SMTP service.
            </li>
          </ul>
          <p>
            All processors are bound by data processing agreements and may not use your data for
            their own purposes beyond what is needed to perform services for us.
          </p>
          <p>
            We may disclose personal data if required by law, court order, or to protect the rights,
            property, or safety of PutPulse or others.
          </p>
        </article>

        <article id="cookies" class="terms-section">
          <h2>6. Cookies &amp; Browser Storage</h2>

          <h3>Authentication cookie</h3>
          <p>
            A single HTTP-only, Secure cookie is set after login to hold your refresh token. It is
            required for the Service to function and cannot be opted out of while you are logged in.
            It is deleted when you log out or when it expires.
          </p>

          <h3>Session storage</h3>
          <p>
            Your user profile (username, name, email) is stored in <code>sessionStorage</code> under
            the key <code>putpulse.auth.user</code> to avoid redundant API calls within a browser
            session. This data is cleared when the browser tab or session closes.
          </p>

          <h3>No analytics or advertising cookies</h3>
          <p>
            PutPulse does not set third-party analytics, advertising, or tracking cookies. We do not
            use Google Analytics, Facebook Pixel, or similar tracking tools.
          </p>
        </article>

        <article id="retention" class="terms-section">
          <h2>7. Data Retention</h2>
          <ul>
            <li>
              <strong>Account data</strong> — retained while your account is active and for up to
              90 days after deletion to allow recovery and fulfil any outstanding legal obligations.
            </li>
            <li>
              <strong>Billing records</strong> — retained for a minimum of 7 years as required by
              financial regulations.
            </li>
            <li>
              <strong>Email subscription data</strong> — retained while active; anonymised within
              30 days of unsubscribing unless required for legal compliance.
            </li>
            <li>
              <strong>Server logs</strong> — retained for up to 90 days for security and
              troubleshooting purposes.
            </li>
          </ul>
        </article>

        <article id="security" class="terms-section">
          <h2>8. Security</h2>
          <p>
            We apply industry-standard safeguards including TLS encryption in transit, hashed
            password storage (never stored in plain text), HTTP-only cookies for refresh tokens,
            and access controls limiting who can reach production data.
          </p>
          <p>
            No method of transmission or storage is 100% secure. If you discover a security
            vulnerability, please report it responsibly via our
            <a href="/contact" @click="navigateRoute($event, '/contact')">contact page</a>.
          </p>
        </article>

        <article id="rights" class="terms-section">
          <h2>9. Your Rights</h2>
          <p>
            Depending on your jurisdiction you may have some or all of the following rights regarding
            your personal data:
          </p>
          <ul>
            <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
            <li><strong>Rectification</strong> — ask us to correct inaccurate data.</li>
            <li><strong>Erasure</strong> — request deletion of your account and associated data, subject to retention obligations.</li>
            <li><strong>Restriction</strong> — ask us to pause processing while a dispute is resolved.</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interests.</li>
            <li>
              <strong>Withdraw consent</strong> — unsubscribe from the Daily Top 3 email at any time
              from your profile page without affecting other account features.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us via our
            <a href="/contact" @click="navigateRoute($event, '/contact')">contact page</a>.
            We will respond within 30 days. You also have the right to lodge a complaint with
            your local data protection authority.
          </p>
        </article>

        <article id="children" class="terms-section">
          <h2>10. Children's Privacy</h2>
          <p>
            The Service is not directed at children under the age of 18. We do not knowingly collect
            personal data from anyone under 18. If you believe a minor has provided us with personal
            data, please contact us and we will delete it promptly.
          </p>
        </article>

        <article id="changes" class="terms-section">
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make material changes we will
            update the "Last updated" date at the top of this page and, where appropriate, notify you
            by email. Continued use of the Service after changes are posted constitutes acceptance of
            the revised policy.
          </p>
        </article>

        <article id="contact" class="terms-section">
          <h2>12. Contact</h2>
          <p>
            For privacy questions, data requests, or to report a concern, please use our
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

.terms-section code {
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
  background: rgba(51, 65, 85, 0.5);
  padding: 0.1em 0.35em;
  border-radius: 0.3rem;
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

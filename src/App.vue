<template>
  <div class="app-shell">
    <div class="page" :class="{ 'page--auth-overlay': isAuthOverlayRoute }">
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand brand-button" :href="brandHomePath" @click="handleBrandLinkClick">
          <span class="status-dot"></span>
          <div>
            <span class="brand-name">PutPulse</span>
            <!-- <span class="brand-meta">Updated in real-time • Last sync 10s ago</span> -->
          </div>
        </a>
        <button
          class="header-menu-toggle"
          type="button"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="site-mobile-nav"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          id="site-mobile-nav"
          class="header-menu-shell"
          :class="{ 'is-open': isMobileMenuOpen }"
        >
          <nav class="header-nav" aria-label="Strategy pages">
            <button
              class="header-nav-link header-nav-link--button"
              :class="{ 'is-active': isWheelGuideOpen }"
              type="button"
              @click="openWheelGuideFromNav"
            >
              How It Works
            </button>
            <a
              class="header-nav-link"
              :class="{ 'is-active': displayRoute === '/pricing' }"
              href="/pricing"
              @click="handleRouteLinkClick($event, '/pricing')"
            >
              Pricing
            </a>
            <a
              class="header-nav-link"
              :class="{ 'is-active': displayRoute === '/' || displayRoute === '/agent' }"
              href="/agent"
              @click="handleRouteLinkClick($event, '/agent')"
            >
              AI Agent
            </a>
          </nav>
        </div>
        <div class="header-actions">
          <template v-if="isAuthenticated">
            <div ref="accountMenuRef" class="account-menu">
              <button
                class="account-menu-trigger"
                :class="{ 'is-active': isAccountMenuOpen || displayRoute === '/profile' || displayRoute === '/settings' }"
                type="button"
                aria-haspopup="menu"
                :aria-expanded="isAccountMenuOpen ? 'true' : 'false'"
                aria-label="Open account menu"
                @click="toggleAccountMenu"
              >
                <span class="account-menu-avatar">{{ authInitials }}</span>
                <svg class="account-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M5.5 7.5 10 12l4.5-4.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                  />
                </svg>
              </button>

              <transition name="account-menu-fade">
                <div v-if="isAccountMenuOpen" class="account-menu-popover" role="menu">
                  <div class="account-menu-summary">
                    <p class="account-menu-name">{{ authDisplayName }}</p>
                    <p class="account-menu-meta">{{ accountMenuMeta }}</p>
                  </div>
                  <button class="account-menu-item" type="button" @click="goToProfileFromMenu">Profile</button>
                  <button class="account-menu-item" type="button" @click="goToSettingsFromMenu">Settings</button>
                  <button
                    v-if="isFreeUser"
                    class="account-menu-item account-menu-item--accent"
                    type="button"
                    @click="openPricingFromMenu"
                  >
                    Upgrade to Pro
                  </button>
                  <button
                    class="account-menu-item account-menu-item--danger"
                    type="button"
                    @click="handleLogout"
                  >
                    Logout
                  </button>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <a class="btn btn-ghost header-guest-action" href="/login" @click="handleLoginLinkClick">Login</a>
            <a class="btn btn-primary header-guest-action" href="/sign-up" @click="handleSignUpLinkClick">Start For Free</a>
          </template>
        </div>
      </div>
    </header>

    <ProfileView
      v-if="displayRoute === '/profile' || displayRoute === '/settings'"
      :user="auth.state.user"
      :display-name="authDisplayName"
      :is-premium="isPremium"
      :premium-subscription="auth.state.premiumSubscription"
      :mode="displayRoute === '/settings' ? 'settings' : 'profile'"
      @back-dashboard="goToDashboard"
      @logout="handleLogout"
      @open-pricing="openPricingModal"
    />

    <AboutView
      v-else-if="displayRoute === '/about'"
      @navigate-route="handleRouteLinkClick"
    />

    <CashSecuredPutsView
      v-else-if="displayRoute === '/cash-secured-puts'"
      @navigate-route="handleRouteLinkClick"
    />

    <ContactView
      v-else-if="displayRoute === '/contact'"
      @navigate-route="handleRouteLinkClick"
    />

    <CoveredCallsView
      v-else-if="displayRoute === '/covered-calls'"
      @navigate-route="handleRouteLinkClick"
    />

    <MethodologyView
      v-else-if="displayRoute === '/methodology'"
      @navigate-route="handleRouteLinkClick"
    />

    <PricingView
      v-else-if="displayRoute === '/pricing'"
      :is-authenticated="isAuthenticated"
      :is-premium="isPremium"
      @open-pricing="openPricingModal"
      @navigate-route="handleRouteLinkClick"
    />

    <TermsView
      v-else-if="displayRoute === '/terms'"
      @navigate-route="handleRouteLinkClick"
    />

    <PrivacyView
      v-else-if="displayRoute === '/privacy'"
      @navigate-route="handleRouteLinkClick"
    />

    <RefundView
      v-else-if="displayRoute === '/refund-policy'"
      @navigate-route="handleRouteLinkClick"
    />

    <PaymentSuccessView
      v-else-if="displayRoute === '/payment-success'"
      @go-home="goHome"
    />

    <AgentChatView
      v-else-if="displayRoute === '/' || displayRoute === '/agent'"
      @login-required="goToLogin"
      @open-wheel-guide="openWheelGuide"
    />

    <WheelStrategyView
      v-else-if="displayRoute === '/wheel-strategy'"
      :candidates="dailyBriefRows"
      @navigate-route="handleRouteLinkClick"
    />

    <template v-else-if="displayRoute === '/dashboard' && currentPage === 'home'">
    <section class="container hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="pill">Beginner Friendly • Consistent Cash Flow</span>
          <h1>Get consistent monthly income by selling PUTs</h1>
          <p class="hero-highlight">
            Data-driven put-selling ideas on stocks you'd be comfortable owning
          </p>
          <p class="hero-subtitle">
            Find the best cash secured put-selling opportunities on high-quality stocks with strong fundamentals and attractive premiums.
            Here, assignment is a feature, not a bug — it’s simply the first step toward generating additional income with covered calls.
          </p>
          <div class="hero-stats">
            <div class="stat-card">
              <span class="icon icon-green">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 17l6-6 4 4 7-7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 7h6v6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span><strong>{{ heroAverageMonthlyRoi }}</strong> Avg. Monthly ROI</span>
            </div>
            <div class="stat-card">
              <span class="icon icon-blue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 3v18h18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7 15v3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 11v7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 7v11"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span><strong>{{ heroTopThreeTicker }}</strong> Strike <strong>{{ heroTopThreeStrike }}</strong> Premium <strong>{{ heroTopThreePremium }}</strong></span>
            </div>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/sign-up" @click="handleSignUpLinkClick">Start For Free</a>
            <button class="btn btn-outline" type="button" @click="openWheelGuide">See How It Works</button>
          </div>
        </div>

        <div class="strategy-card">
          <div class="strategy-header">
            <!-- <span class="strategy-eyebrow">THE STRATEGY POST</span> -->
          </div>
          <h3>Who it's for:</h3>
          <div class="audience-list">
            <div class="audience-item">
              <span class="icon icon-green">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div>
                <div class="audience-title">Monthly Income - Focused Investors</div>
                <div class="audience-text">Generate monthly income from selling cash secured puts</div>
              </div>
            </div>
            <div class="audience-item">
              <span class="icon icon-blue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M12 6v6l4 2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div>
                <div class="audience-title">Long-Term Asset Owners</div>
                <div class="audience-text">Acquire high-quality stocks at a discount if assigned.</div>
              </div>
            </div>
            <div class="audience-item">
              <span class="icon icon-purple">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div>
                <div class="audience-title">Systematic Traders</div>
                <div class="audience-text">Follow a disciplined workflow: Get assigned, then sell covered calls.</div>
              </div>
            </div>
          </div>

          <div class="strategy-footer">
            <!-- <button class="btn btn-muted" type="button" @click="currentPage = 'dailyBrief'">See Daily Brief</button> -->
          </div>
        </div>
      </div>
    </section>

    <section class="container strategy-guide-section">
      <div class="card wheel-guide-card">
        <div class="wheel-guide-badge">
          <span class="wheel-guide-badge-dot"></span>
          Strategy Guide
        </div>

        <p class="wheel-guide-title">Cash Secured Put / Wheel - Systematic Income Setup</p>
        <p class="wheel-guide-subtitle">
          Cash-secured puts with ~30 DTE targeting 2.5-3.5% monthly ROI. Only Fundamentally strong companies. Assignment = Oportunity, not a bug.
        </p>

        <div class="wheel-guide-grid">
          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--teal">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <rect x="1" y="1" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" />
                <path d="M4 7l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Market cap</div>
              <div class="wheel-guide-rule-value">&gt; $5B</div>
              <div class="wheel-guide-rule-hint">Fundamentally strong companies only</div>
            </div>
          </div>

          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--blue">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <polyline points="2,10 5,6 8,8 12,3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Technicals</div>
              <div class="wheel-guide-rule-value">Hold / Buy / Strong Buy</div>
              <div class="wheel-guide-rule-hint">No bearish signals</div>
            </div>
          </div>

          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--teal">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.2" />
                <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Delta</div>
              <div class="wheel-guide-rule-value">&lt;= 0.34 abs delta</div>
              <div class="wheel-guide-rule-hint">Lower probability of assignment</div>
            </div>
          </div>

          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--blue">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.2" />
                <path d="M7 4v3l2 1.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Expiration</div>
              <div class="wheel-guide-rule-value">~30 DTE</div>
              <div class="wheel-guide-rule-hint">20-40 day sweet spot</div>
            </div>
          </div>

          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--teal">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2" y="5" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2" />
                <path d="M5 5V4a2 2 0 0 1 4 0v1" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Target ROI</div>
              <div class="wheel-guide-rule-value">2.5-3.5% / month</div>
              <div class="wheel-guide-rule-hint">Per position, ~30-42% annualized</div>
            </div>
          </div>

          <div class="wheel-guide-rule">
            <div class="wheel-guide-icon wheel-guide-icon--blue">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="4" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.2" />
                <circle cx="10" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.2" />
                <circle cx="7" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.2" />
                <line x1="5.6" y1="5.4" x2="4.8" y2="6.6" stroke="currentColor" stroke-width="1" opacity="0.6" />
                <line x1="8.4" y1="5.4" x2="9.2" y2="6.6" stroke="currentColor" stroke-width="1" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div class="wheel-guide-rule-label">Diversification</div>
              <div class="wheel-guide-rule-value">8-10 positions</div>
              <div class="wheel-guide-rule-hint">Spread across different sectors</div>
            </div>
          </div>
        </div>

        <div class="wheel-guide-divider"></div>

        <div class="wheel-guide-footer">
          <div class="wheel-guide-roi-block">
            <div class="wheel-guide-roi-value">{{ heroAverageMonthlyRoi }}</div>
            <div class="wheel-guide-roi-meta">
              <span class="wheel-guide-roi-label">avg monthly yield</span>
              <span class="wheel-guide-roi-sub">30-day weighted average</span>
            </div>
          </div>

          <div class="wheel-guide-warning">
            <span class="wheel-guide-warning-dot"></span>
            <span>
              Skip any trade with earnings <strong>before</strong> the expiration date - earnings risk is not worth the premium.
            </span>
          </div>
        </div>
      </div>
    </section>

    <DailyBrief
      :show-back="false"
      :open-ticker="openTicker"
      :rows="dailyBriefRows"
      :loading="dailyBriefLoading"
      :subscribe-label="dailyBriefSubscribeLabel"
      :subscribe-description="dailyBriefSubscribeDescription"
      :subscribe-message="dailyBriefCtaMessage"
      :subscribe-tone="dailyBriefCtaTone"
      :subscribe-disabled="dailyBriefSubscribeDisabled"
      @subscribe="handleDailyBriefSubscribe"
    />

    <section class="container kpi-grid">
      <div class="card kpi-card kpi-card--green">
        <div class="kpi-header">
          <span class="icon icon-green">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 17l6-6 4 4 7-7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 7h6v6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="kpi-copy">
            <span class="section-eyebrow">SCREENED PUTS TODAY</span>
            <div class="kpi-stat">{{ filteredWeeklyIdeaGroups.length }}</div>
            <p class="kpi-subtitle">active opportunities</p>
          </div>
        </div>
        <div class="kpi-footer">
          <div class="kpi-tags">
            <span class="kpi-tag">ROI &ge; 2%</span>
            <span class="kpi-tag">Fundamental Strength &ge; 75</span>
            <span class="kpi-tag">Neutral &amp; above</span>
          </div>
          <span class="badge-live"><span class="live-dot"></span>Live</span>
        </div>
      </div>

      <div class="card kpi-card kpi-card--blue">
        <div class="kpi-header">
          <span class="icon icon-blue">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 3v18h18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 15v3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 11v7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 7v11"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="kpi-copy">
            <span class="section-eyebrow">AVG. MONTHLY YIELD</span>
            <div class="kpi-stat">2.87%</div>
            <p class="kpi-subtitle">monthly premium</p>
          </div>
        </div>
        <div class="kpi-footer">
          <div class="kpi-tags">
            <span class="kpi-tag">30-day weighted average</span>
            <span class="kpi-tag kpi-tag--positive">Quality Companies Only</span>
          </div>
        </div>
      </div>
    </section>


    <section id="screener-section" class="container">
      <div class="card">
        <div class="card-header">
          <h2>The Best Put-Selling Opportunities Now</h2>
          <p class="muted">Only Companies Worth Owning</p>
          <p class="muted">Eearning dates after the expiration</p>
        </div>

        <div class="filter-panel">
          <div class="filter-title">
            <span class="icon icon-cyan">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polygon
                  points="22 3 2 3 10 12 10 19 14 21 14 12 22 3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Filter Options</span>
          </div>

          <div class="filter-ranges">
            <div>
              <label class="filter-label">Price range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</label>
              <div class="range-inputs">
                <label class="range-field">
                  <span>Min</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    :value="priceRange[0]"
                    class="range-input"
                    @input="onPriceMinChange"
                  />
                </label>
                <label class="range-field">
                  <span>Max</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    :value="priceRange[1]"
                    class="range-input"
                    @input="onPriceMaxChange"
                  />
                </label>
              </div>
              <div class="range-sliders">
                <div class="range-track">
                  <div class="range-track-fill" :style="priceRangeStyle"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  :value="priceRange[0]"
                  class="slider slider-min"
                  @input="onPriceMinChange"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  :value="priceRange[1]"
                  class="slider slider-max"
                  @input="onPriceMaxChange"
                />
              </div>
              <div class="filter-scale">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
            <div>
              <label class="filter-label">RSI range: {{ rsiRange[0] }} - {{ rsiRange[1] }}</label>
              <div class="range-inputs">
                <label class="range-field">
                  <span>Min</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    :value="rsiRange[0]"
                    class="range-input"
                    @input="onRsiMinChange"
                  />
                </label>
                <label class="range-field">
                  <span>Max</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    :value="rsiRange[1]"
                    class="range-input"
                    @input="onRsiMaxChange"
                  />
                </label>
              </div>
              <div class="range-sliders">
                <div class="range-track">
                  <div class="range-track-fill" :style="rsiRangeStyle"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="rsiRange[0]"
                  class="slider slider-min"
                  @input="onRsiMinChange"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="rsiRange[1]"
                  class="slider slider-max"
                  @input="onRsiMaxChange"
                />
              </div>
              <div class="filter-scale">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
            <div>
              <label class="filter-label">
                Abs delta range: {{ formatAbsDeltaValue(deltaRange[0]) }} - {{ formatAbsDeltaValue(deltaRange[1]) }}
              </label>
              <div class="range-inputs">
                <label class="range-field">
                  <span>Min</span>
                  <input
                    type="number"
                    min="0.2"
                    max="0.4"
                    step="0.02"
                    :value="deltaRange[0]"
                    class="range-input"
                    @input="onDeltaMinChange"
                  />
                </label>
                <label class="range-field">
                  <span>Max</span>
                  <input
                    type="number"
                    min="0.2"
                    max="0.4"
                    step="0.02"
                    :value="deltaRange[1]"
                    class="range-input"
                    @input="onDeltaMaxChange"
                  />
                </label>
              </div>
              <div class="range-sliders">
                <div class="range-track">
                  <div class="range-track-fill" :style="deltaRangeStyle"></div>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.4"
                  step="0.02"
                  :value="deltaRange[0]"
                  class="slider slider-min"
                  @input="onDeltaMinChange"
                />
                <input
                  type="range"
                  min="0.2"
                  max="0.4"
                  step="0.02"
                  :value="deltaRange[1]"
                  class="slider slider-max"
                  @input="onDeltaMaxChange"
                />
              </div>
              <div class="filter-scale">
                <span>0.20</span>
                <span>0.40</span>
              </div>
            </div>
          </div>

          <div class="filter-dropdowns">
            <div>
              <label class="filter-label">ROI</label>
              <select class="select" :value="minRoi" @change="onMinRoiChange">
                <option value="">Any ROI</option>
                <option value="2">&gt; 2%</option>
                <option value="2.5">&gt; 2.5%</option>
                <option value="3">&gt; 3%</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Spread</label>
              <select class="select" :value="maxSpread" @change="onMaxSpreadChange">
                <option value="">Any Spread</option>
                <option value="1.5">&lt; 1.5</option>
                <option value="1">&lt; 1</option>
                <option value="0.5">&lt; 0.5</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Technicals</label>
              <select class="select" :value="tvFilter" @change="onTvFilterChange">
                <option value="">Any Rating</option>
                <option value="neutral">Neutral &amp; above</option>
                <option value="buy">Buy &amp; above</option>
                <option value="strongbuy">Strong Buy only</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Fundamental Strength</label>
              <select class="select" :value="minScore" @change="onMinScoreChange">
                <option value="">Any Fundamental Strength</option>
                <option value="50">&gt; 50</option>
                <option value="60">&gt; 60</option>
                <option value="75">&gt; 75</option>
                <option value="85">&gt; 85</option>
              </select>
            </div>
            <div class="filter-actions">
              <button class="btn btn-primary" type="button" @click="applyFilters">
                Apply Filters
              </button>
              <button class="btn btn-muted" type="button" @click="resetFilters">Reset</button>
            </div>
          </div>
        </div>

        <div class="weekly-column-controls">
          <span class="filter-label">Columns</span>
          <div class="filter-checkbox-row weekly-column-toggles">
            <label class="filter-checkbox-label">
              <input v-model="showMidColumn" class="filter-checkbox" type="checkbox" />
              <span>Mid</span>
            </label>
            <label class="filter-checkbox-label">
              <input v-model="showDeltaColumn" class="filter-checkbox" type="checkbox" />
              <span>Delta</span>
            </label>
            <label class="filter-checkbox-label">
              <input v-model="showVolumeColumn" class="filter-checkbox" type="checkbox" />
              <span>Volume</span>
            </label>
            <label class="filter-checkbox-label">
              <input v-model="showIvColumn" class="filter-checkbox" type="checkbox" />
              <span>IV</span>
            </label>
            <label class="filter-checkbox-label">
              <input v-model="showRsiColumn" class="filter-checkbox" type="checkbox" />
              <span>RSI</span>
            </label>
          </div>
        </div>

        <div class="table-wrap weekly-ideas-table-wrap">
          <div class="weekly-ideas-table-scroll">
            <table class="weekly-ideas-table">
              <thead>
                <tr>
                  <th class="weekly-col-ticker">Ticker</th>
                  <th class="weekly-col-contracts">Expiration</th>
                  <th class="align-right">Price / Strike</th>
                  <th v-if="showMidColumn" class="align-right">Mid</th>
                  <th v-if="showDeltaColumn" class="align-right">Delta</th>
                  <th class="align-right">Chance of Profit</th>
                  <th v-if="showVolumeColumn" class="align-right">Volume</th>
                  <th v-if="showIvColumn" class="align-right">IV</th>
                  <th v-if="showRsiColumn" class="align-right">RSI</th>
                  <th class="align-right">ROI / mo</th>
                  <th class="align-right weekly-col-score">Score / Technicals</th>
                  <th class="weekly-col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="weeklyIdeasLoading" class="weekly-empty-row">
                  <td :colspan="weeklyVisibleColumnCount">Loading...</td>
                </tr>
                <tr v-else-if="weeklyIdeasError" class="weekly-empty-row">
                  <td :colspan="weeklyVisibleColumnCount">Unable to load symbols. Please try again.</td>
                </tr>
                <tr v-else-if="!filteredWeeklyIdeaGroups.length" class="weekly-empty-row">
                  <td :colspan="weeklyVisibleColumnCount">No symbols available.</td>
                </tr>
                <template v-else v-for="group in paginatedWeeklyIdeaGroups" :key="group.id">
                  <tr
                    class="ticker-group-row"
                    :class="{ 'ticker-group-row--expanded': isWheelSetupExpanded(group.id) }"
                  >
                    <td class="weekly-col-ticker" data-label="Ticker">
                      <span class="ticker-symbol">{{ group.ticker }}</span>
                    </td>
                    <td class="weekly-col-contracts" data-label="Expiration">
                      <span class="contracts-summary-date">{{ group.bestContract.date }}</span>
                    </td>
                    <td class="align-right weekly-value weekly-price-strike" data-label="Price / Strike">
                      <div class="weekly-price-strike-content">
                        <span>{{ group.price }}</span>
                        <span class="weekly-price-strike-sep">/</span>
                        <span>{{ group.bestContract.strike }}</span>
                      </div>
                    </td>
                    <td v-if="showMidColumn" class="align-right weekly-value" data-label="Mid">{{ group.bestContract.mid }}</td>
                    <td v-if="showDeltaColumn" class="align-right weekly-value weekly-value--muted delta-txt" data-label="Delta">{{ group.bestContract.delta }}</td>
                    <td class="align-right weekly-value weekly-value--muted profit-txt" data-label="Chance of Profit">
                      {{ formatChanceOfProfit(group.bestContract.rawAbsDelta) }}
                    </td>
                    <td v-if="showVolumeColumn" class="align-right weekly-value weekly-value--muted" data-label="Volume">{{ group.bestContract.volume }}</td>
                    <td v-if="showIvColumn" class="align-right weekly-value weekly-value--muted" data-label="IV">{{ group.bestContract.iv }}</td>
                    <td v-if="showRsiColumn" class="align-right weekly-value weekly-value--muted" data-label="RSI">{{ group.rsi }}</td>
                    <td class="align-right" data-label="ROI">
                      <span class="roi-pill" :class="roiPillClass(group.bestContract.roiValue)">
                        {{ group.bestContract.roi }}
                      </span>
                    </td>
                    <td class="align-right weekly-col-score" data-label="Score / Signal">
                      <span class="weekly-score-badge" :class="scoreSignalBadgeClass(group.rawScore, group.tvTechnicals)">
                        <span class="weekly-score-badge-metric">
                          <span class="weekly-score-badge-value">{{ scoreSignalValue(group.rawScore) }}</span>
                          <span class="weekly-score-badge-denom">/100</span>
                        </span>
                        <span class="weekly-score-badge-signal-row">
                          <span class="weekly-score-badge-dot" aria-hidden="true"></span>
                          <span class="weekly-score-badge-signal">{{ group.tvTechnicals }}</span>
                        </span>
                      </span>
                    </td>
                    <td class="weekly-col-actions" data-label="Actions">
                      <div class="weekly-actions-cell">
                        <button
                          class="table-action-button table-action-button--details"
                          type="button"
                          :disabled="!group.hasTicker"
                          @click="group.hasTicker && openTicker(group.ticker)"
                        >
                          <span class="table-action-button-icon" aria-hidden="true">
                            <svg viewBox="0 0 20 20">
                              <circle cx="8.25" cy="8.25" r="4.75" />
                              <path d="M11.8 11.8 16 16" />
                            </svg>
                          </span>
                          <span class="table-action-button-label">Details</span>
                        </button>
                        <button
                          class="table-action-button table-action-button--wheel"
                          :class="{ 'is-expanded': isWheelSetupExpanded(group.id) }"
                          type="button"
                          :aria-expanded="isWheelSetupExpanded(group.id)"
                          :aria-label="`${isWheelSetupExpanded(group.id) ? 'Hide' : 'Show'} wheel setup for ${group.ticker}`"
                          @click="toggleWheelSetup(group.id)"
                        >
                          <span class="table-action-button-icon" aria-hidden="true">
                            <svg viewBox="0 0 20 20">
                              <circle cx="10" cy="10" r="2.2" />
                              <path d="M10 4.1 11.15 4.4 11.7 5.55 12.95 5.9 14 5.35 14.95 6.3 14.4 7.35 14.75 8.6 15.9 9.15 15.9 10.85 14.75 11.4 14.4 12.65 14.95 13.7 14 14.65 12.95 14.1 11.7 14.45 11.15 15.6 10 15.9 8.85 15.6 8.3 14.45 7.05 14.1 6 14.65 5.05 13.7 5.6 12.65 5.25 11.4 4.1 10.85 4.1 9.15 5.25 8.6 5.6 7.35 5.05 6.3 6 5.35 7.05 5.9 8.3 5.55 8.85 4.4Z" />
                            </svg>
                          </span>
                          <span class="table-action-button-label">Wheel</span>
                          <span class="group-toggle-icon" aria-hidden="true"></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="isWheelSetupExpanded(group.id)" class="wheel-setup-row">
                    <td :colspan="weeklyVisibleColumnCount" class="contracts-cell">
                      <div class="wheel-setup-row-inner">
                        <div class="contracts-panel wheel-setup-panel">
                          <div class="wheel-setup-header">
                            <div class="wheel-setup-header-copy">
                              <span class="wheel-setup-symbol">{{ group.ticker }}</span>
                              <span class="wheel-setup-expiry">Best contract exp. {{ group.bestContract.date }}</span>
                            </div>
                            <span class="wheel-setup-badge">Wheel Trade Setup</span>
                          </div>
                          <div class="wheel-setup-grid">
                            <section class="wheel-setup-card">
                              <span class="wheel-setup-label">Put Sale</span>
                              <dl class="wheel-setup-metrics">
                                <div>
                                  <dt>Strike</dt>
                                  <dd>{{ group.bestContract.strike }}</dd>
                                </div>
                                <div>
                                  <dt>Premium</dt>
                                  <dd>{{ group.wheelSetup.putPremium }}</dd>
                                </div>
                                <div>
                                  <dt>ROI</dt>
                                  <dd>{{ group.bestContract.roi }}</dd>
                                </div>
                              </dl>
                            </section>
                            <section class="wheel-setup-card">
                              <span class="wheel-setup-label">If Assigned</span>
                              <div class="wheel-setup-emphasis">{{ group.wheelSetup.costBasis }}</div>
                              <div class="wheel-setup-subtext">Cost Basis</div>
                            </section>
                            <section class="wheel-setup-card">
                              <span class="wheel-setup-label">Covered Call Opportunity</span>
                              <div class="wheel-setup-call-line">
                                <span>{{ group.wheelSetup.coveredCallLabel }}</span>
                                <strong>{{ group.wheelSetup.coveredCallPremium }}</strong>
                              </div>
                              <div class="wheel-setup-subtext">{{ group.wheelSetup.coveredCallNote }}</div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="isFreeUser && weeklyIdeasHasMore" class="locked-rows-row">
                  <td :colspan="weeklyVisibleColumnCount" class="locked-rows-cell">
                    <div class="locked-rows-overlay">
                      <p class="locked-rows-label">More ideas are hidden on the free plan.</p>
                      <button class="btn btn-primary" type="button" @click="openPricingModal">
                        Upgrade to Pro
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-footer">
          <span class="muted">
            Showing {{ weeklyPageStart }}-{{ weeklyPageEnd }} of {{ filteredWeeklyIdeaGroups.length }} tickers
            · lowest-delta contract + wheel setup
          </span>
          <div class="pagination">
            <button
              class="btn btn-muted"
              type="button"
              :disabled="weeklyCurrentPage === 1 || !filteredWeeklyIdeaGroups.length"
              @click="goToWeeklyPage(weeklyCurrentPage - 1)"
            >
              Previous
            </button>
            <button class="btn btn-muted" type="button">
              {{ weeklyCurrentPage }} / {{ weeklyTotalPages }}
            </button>
            <button
              class="btn btn-primary"
              type="button"
              :disabled="weeklyCurrentPage === weeklyTotalPages || !filteredWeeklyIdeaGroups.length"
              @click="goToWeeklyPage(weeklyCurrentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>

        <button class="btn btn-muted btn-block" type="button">Export Results</button>
      </div>
    </section>

    <section class="container trust-center-section">
      <div class="card">
        <div class="strategy-library-grid">
          <a
            class="strategy-library-card"
            href="/methodology"
            @click="handleRouteLinkClick($event, '/methodology')"
          >
            <span class="strategy-library-tag">Process</span>
            <h3>Methodology</h3>
            <p>Understand how PutPulse narrows candidates into a shortlist and how to interpret the output.</p>
            <span class="strategy-library-link">Read the page</span>
          </a>

          <a
            class="strategy-library-card"
            href="/about"
            @click="handleRouteLinkClick($event, '/about')"
          >
            <span class="strategy-library-tag">Company</span>
            <h3>About</h3>
            <p>Learn what PutPulse is built for, who it is for, and what the product is intended to help with.</p>
            <span class="strategy-library-link">Read the page</span>
          </a>

          <a
            class="strategy-library-card"
            href="/contact"
            @click="handleRouteLinkClick($event, '/contact')"
          >
            <span class="strategy-library-tag">Support</span>
            <h3>Contact</h3>
            <p>Find the support channel, what to include in product questions, and what support can actually answer.</p>
            <span class="strategy-library-link">Read the page</span>
          </a>
        </div>
      </div>
    </section>

    <section class="container cta">
      <div class="cta-card">
        <h2>Ready to start generating income?</h2>
        <p class="cta-lead">
          Join <strong>thousands of investors</strong> using data-driven strategies to sell
          puts on <span class="cta-lead-accent">quality companies</span>
        </p>
        <div class="cta-actions">
          <a class="btn btn-primary" href="/sign-up" @click="handleSignUpLinkClick">Start For Free</a>
          <button class="btn btn-outline" type="button" @click="openWheelGuide">See How It Works</button>
        </div>
      </div>
    </section>
    </template>

    <footer v-if="showPublicFooter" class="container site-footer">
      <div class="site-footer-links">
        <a class="site-footer-link" href="/" @click="handleRouteLinkClick($event, '/')">Home</a>
        <a class="site-footer-link" href="/about" @click="handleRouteLinkClick($event, '/about')">About</a>
        <a class="site-footer-link" href="/contact" @click="handleRouteLinkClick($event, '/contact')">Contact</a>
        <a class="site-footer-link" href="/methodology" @click="handleRouteLinkClick($event, '/methodology')">Methodology</a>
        <a class="site-footer-link" href="/pricing" @click="handleRouteLinkClick($event, '/pricing')">Pricing</a>
        <a class="site-footer-link" href="/terms" @click="handleRouteLinkClick($event, '/terms')">Terms of Service</a>
        <a class="site-footer-link" href="/privacy" @click="handleRouteLinkClick($event, '/privacy')">Privacy Policy</a>
        <a class="site-footer-link" href="/refund-policy" @click="handleRouteLinkClick($event, '/refund-policy')">Refund Policy</a>
        <a class="site-footer-link" href="/sign-up" @click="handleRouteLinkClick($event, '/sign-up')">Start For Free</a>
      </div>
      <p class="site-footer-disclaimer">
        This application is for informational and educational purposes only and does not
        constitute financial, investment, or trading advice. Options trading involves
        significant risk and may not be suitable for all investors. Past performance is
        not indicative of future results. You are solely responsible for your investment
        decisions.
      </p>
    </footer>

    <WheelStrategyGuide
      :open="isWheelGuideOpen"
      :candidates="dailyBriefRows"
      @close="closeWheelGuide"
    />

    <PricingModal
      :open="isPricingModalOpen"
      @close="isPricingModalOpen = false"
      @checkout-success="handleCheckoutSuccess"
      @login-required="isPricingModalOpen = false; goToLogin()"
    />

    <teleport to="body">
      <transition name="ticker-panel">
        <div v-if="isModalOpen" class="ticker-panel-backdrop" @click.self="closeModal">
          <aside class="ticker-panel" aria-label="Ticker details">
            <header class="ticker-panel-header">
              <div class="ticker-panel-header-top">
                <span class="ticker-panel-label">Ticker overview</span>
                <button class="ticker-panel-close" type="button" @click="closeModal">Close</button>
              </div>
              <div class="ticker-panel-title-row">
                <span class="ticker-panel-symbol">{{ activeTicker }}</span>
                <span class="ticker-panel-company">{{ activeTickerCompany }}</span>
              </div>
              <div class="ticker-panel-price-row">
                <span class="ticker-panel-price">{{ activeTickerDisplayPrice }}</span>
                <span class="ticker-panel-price-accent">{{ activeTickerDisplayRoi }}</span>
                <span class="ticker-panel-price-meta">{{ activeTickerPriceMeta }}</span>
              </div>
            </header>
            <div class="ticker-panel-body">
              <section class="ticker-panel-section">
                <div class="ticker-signal-grid">
                  <article class="ticker-signal-tile">
                    <div class="ticker-signal-label">Fund. score</div>
                    <div class="ticker-score-wrap">
                      <svg class="ticker-score-ring" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                        <circle cx="14" cy="14" r="11" class="ticker-score-ring-track" />
                        <circle cx="14" cy="14" r="11" class="ticker-score-ring-progress" :style="{ strokeDashoffset: activeTickerScoreRingOffset }" />
                      </svg>
                      <span class="ticker-score-num">{{ activeTickerScoreValue }}</span>
                    </div>
                    <div class="ticker-signal-sub">out of 100</div>
                  </article>
                  <article class="ticker-signal-tile">
                    <div class="ticker-signal-label">Technical</div>
                    <span class="ticker-technical-badge" :class="tickerTechnicalBadgeClass(activeTickerTechnical)">
                      {{ activeTickerTechnical }}
                    </span>
                    <div class="ticker-signal-sub">signal</div>
                  </article>
                  <article class="ticker-signal-tile">
                    <div class="ticker-signal-label">Strategy</div>
                    <span class="ticker-contract-badge">{{ activeTickerStrategyLabel }}</span>
                    <div class="ticker-signal-sub">{{ activeTickerStrategyMeta }}</div>
                  </article>
                </div>
              </section>

              <section class="ticker-panel-section">
                <div class="ticker-section-label">Symbol overview</div>
                <div ref="symbolOverviewContainer" class="tradingview-wrapper tradingview-wrapper--overview"></div>
                <div class="ticker-timeframe-row">
                  <button
                    v-for="timeframe in overviewTimeframeOptions"
                    :key="timeframe"
                    class="ticker-timeframe-btn"
                    :class="{ 'is-active': overviewTimeframe === timeframe }"
                    type="button"
                    @click="overviewTimeframe = timeframe"
                  >
                    {{ timeframe }}
                  </button>
                </div>
              </section>

              <section class="ticker-panel-section">
                <div class="ticker-section-label">Key facts</div>
                <div class="ticker-facts-card">
                  <div ref="symbolProfileContainer" class="tradingview-wrapper tradingview-wrapper--facts"></div>
                </div>
              </section>
            </div>
            <div class="ticker-panel-footer">
              
            </div>
          </aside>
        </div>
      </transition>
    </teleport>

    <CookieBanner @navigate-route="handleRouteLinkClick" />
    </div>

    <transition name="auth-overlay-fade" appear mode="out-in">
      <SignUpView
        v-if="currentRoute === '/sign-up'"
        :daily-brief-intent="dailyBriefAuthIntent"
        @back-home="dismissAuthOverlay"
        @navigate-login="goToLogin({ preserveDailyBriefIntent: dailyBriefAuthIntent })"
      />
      <VerifyEmailView
        v-else-if="currentRoute === '/verify-email'"
        @back-home="dismissAuthOverlay"
        @navigate-login="goToLogin"
        @verified="handleAuthenticated"
      />
      <LoginView
        v-else-if="currentRoute === '/login'"
        :daily-brief-intent="dailyBriefAuthIntent"
        @authenticated="handleAuthenticated"
        @back-home="dismissAuthOverlay"
        @navigate-signup="goToSignUp({ preserveDailyBriefIntent: dailyBriefAuthIntent })"
      />
    </transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ApiError } from './api/client';
import { getApiBaseUrl, getDailyBriefs, getSymbols, setApiBaseUrl } from './api/investingApi';
import DailyBrief from './components/DailyBrief.vue';
import CookieBanner from './components/CookieBanner.vue';
import PricingModal from './components/PricingModal.vue';
import WheelStrategyGuide from './components/WheelStrategyGuide.vue';
import { useAuthStore } from './stores/auth';
import AboutView from './views/AboutView.vue';
import CashSecuredPutsView from './views/CashSecuredPutsView.vue';
import CoveredCallsView from './views/CoveredCallsView.vue';
import LoginView from './views/LoginView.vue';
import ContactView from './views/ContactView.vue';
import MethodologyView from './views/MethodologyView.vue';
import PricingView from './views/PricingView.vue';
import ProfileView from './views/ProfileView.vue';
import PrivacyView from './views/PrivacyView.vue';
import RefundView from './views/RefundView.vue';
import TermsView from './views/TermsView.vue';
import SignUpView from './views/SignUpView.vue';
import VerifyEmailView from './views/VerifyEmailView.vue';
import WheelStrategyView from './views/WheelStrategyView.vue';
import PaymentSuccessView from './views/PaymentSuccessView.vue';
import AgentChatView from './views/AgentChatView.vue';

const auth = useAuthStore();
const mobileNavBreakpoint = 768;
const routePath = ref(window.location.pathname || '/');
const isMobileMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);
const accountMenuRef = ref(null);
const isScreenerTabSelected = ref(false);
const legacyRouteRedirects = new Map([
  ['/daily-brief', '/'],
]);
const knownRoutes = new Set([
  '/',
  '/about',
  '/pricing',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/cash-secured-puts',
  '/contact',
  '/covered-calls',
  '/agent',
  '/dashboard',
  '/login',
  '/methodology',
  '/profile',
  '/payment-success',
  '/settings',
  '/sign-up',
  '/verify-email',
  '/wheel-strategy',
]);
const authRoutes = new Set(['/login', '/sign-up', '/verify-email']);
const authBackdropRoute = ref('/');
let authOverlayScrollY = 0;
let isAuthOverlayScrollLocked = false;
const marketingRoutes = new Set([
  '/about',
  '/pricing',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/cash-secured-puts',
  '/contact',
  '/covered-calls',
  '/methodology',
  '/wheel-strategy',
]);
const dailyBriefAuthIntent = ref(false);
const dailyBriefCtaMessage = ref('');
const dailyBriefCtaTone = ref('neutral');
const dailyBriefCtaPending = ref(false);

const syncRoute = () => {
  const currentPath = window.location.pathname || '/';
  const redirectPath = legacyRouteRedirects.get(currentPath);

  if (redirectPath) {
    window.history.replaceState({}, '', redirectPath);
    routePath.value = redirectPath;
    return;
  }

  routePath.value = currentPath;
};

const navigateTo = (path, { replace = false } = {}) => {
  const nextPath = path || '/';
  const qIndex = nextPath.indexOf('?');
  const pathname = qIndex === -1 ? nextPath : nextPath.slice(0, qIndex);
  const search = qIndex === -1 ? '' : nextPath.slice(qIndex);
  const targetPath = knownRoutes.has(pathname) ? pathname : '/';
  const fullTarget = targetPath === '/' ? '/' : targetPath + search;
  const currentPath = window.location.pathname || '/';

  if (currentPath === targetPath && !search) {
    syncRoute();
    return;
  }

  window.history[replace ? 'replaceState' : 'pushState']({}, '', fullTarget);
  syncRoute();
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const PRO_INTENT_KEY = 'putpulse.pending.pro';

const currentRoute = computed(() => (knownRoutes.has(routePath.value) ? routePath.value : '/'));
const sanitizeAuthBackdropRoute = (route) => {
  if (!route || !knownRoutes.has(route) || authRoutes.has(route)) return '/';
  if (route === '/profile' || route === '/settings' || route === '/payment-success') return '/';
  return route;
};
const isAuthOverlayRoute = computed(() => authRoutes.has(currentRoute.value));
const displayRoute = computed(() => (isAuthOverlayRoute.value ? authBackdropRoute.value : currentRoute.value));
const isAuthenticated = auth.isAuthenticated;
const isPremium = auth.isPremium;
const isFreeUser = computed(() => isAuthenticated.value && !isPremium.value);
const isStaffUser = computed(() => auth.state.user?.is_staff === true || auth.state.user?.is_superuser === true);
const brandHomePath = computed(() => (isStaffUser.value ? '/dashboard' : '/'));
const authDisplayName = auth.displayName;
const deriveUserType = (user) => {
  if (!user) return 'anonymous';
  if (user.is_superuser === true) return 'superuser';
  if (user.is_staff === true) return 'staff';
  return 'regular';
};
const authInitials = computed(() => {
  const seed = String(authDisplayName.value || auth.state.user?.username || auth.state.user?.email || 'PutPulse').trim();
  return seed
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'PP';
});
const accountMenuMeta = computed(() => auth.state.user?.email || auth.state.user?.username || 'Signed in account');
const isPricingModalOpen = ref(false);
const openPricingModal = () => { isPricingModalOpen.value = true; };
const configuredSiteUrl = String(import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '');
const runtimeSiteUrl = typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : '';
const siteUrl = configuredSiteUrl || runtimeSiteUrl || 'https://putpulse.com';
const defaultSocialImageUrl = `${siteUrl}/putpulse-dot.svg`;
const dailyBriefDestinationEmail = computed(() =>
  auth.dailyBriefSubscription.value?.email ?? auth.state.user?.email ?? 'your email',
);
const dailyBriefSubscribeLabel = computed(() => {
  if (!isAuthenticated.value) return 'Sign Up for Daily Top 3';
  if (dailyBriefCtaPending.value) return 'Subscribing to Daily Top 3...';
  if (auth.dailyBriefSubscriptionStatus.value === 'active') return 'Subscribed to Daily Top 3';
  if (auth.dailyBriefSubscriptionStatus.value === 'pending_verification') return 'Subscription Pending Verification';
  return 'Subscribe to Daily Top 3';
});
const dailyBriefSubscribeDescription = computed(() => {
  if (!isAuthenticated.value) return 'Create a free account to receive the Daily Top 3 by email.';
  if (auth.dailyBriefSubscriptionStatus.value === 'active') {
    return `The Daily Top 3 is already set to go to ${dailyBriefDestinationEmail.value}.`;
  }
  if (auth.dailyBriefSubscriptionStatus.value === 'pending_verification') {
    return 'Verify your account email to activate the Daily Top 3 subscription.';
  }
  return 'Subscribe with your verified account to get the shortlist before the open.';
});
const dailyBriefSubscribeDisabled = computed(() =>
  dailyBriefCtaPending.value
  || (isAuthenticated.value
    && (auth.dailyBriefSubscriptionStatus.value === 'active'
      || auth.dailyBriefSubscriptionStatus.value === 'pending_verification')),
);
const clearDailyBriefAuthIntent = () => {
  dailyBriefAuthIntent.value = false;
};

const setDailyBriefCtaFeedback = (message = '', tone = 'neutral') => {
  dailyBriefCtaMessage.value = message;
  dailyBriefCtaTone.value = tone;
};

const resetDailyBriefCtaFeedback = () => {
  setDailyBriefCtaFeedback('', 'neutral');
};

const lockAuthOverlayScroll = () => {
  if (typeof document === 'undefined') return;
  if (isAuthOverlayScrollLocked) return;
  authOverlayScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${authOverlayScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  isAuthOverlayScrollLocked = true;
};

const unlockAuthOverlayScroll = () => {
  if (typeof document === 'undefined') return;
  if (!isAuthOverlayScrollLocked) return;
  const scrollY = authOverlayScrollY;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  isAuthOverlayScrollLocked = false;
  window.scrollTo({ top: scrollY, behavior: 'auto' });
};

const closeAccountMenu = () => {
  isAccountMenuOpen.value = false;
};

const goHome = () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  isScreenerTabSelected.value = false;
  clearDailyBriefAuthIntent();
  resetDailyBriefCtaFeedback();
  currentPage.value = 'home';
  navigateTo('/', { replace: currentRoute.value !== '/' });
};
const goToDashboard = ({ preserveDailyBriefIntent = false } = {}) => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  isScreenerTabSelected.value = false;
  if (!preserveDailyBriefIntent) clearDailyBriefAuthIntent();
  currentPage.value = 'home';
  navigateTo('/dashboard', { replace: currentRoute.value !== '/dashboard' });
};
const goToLogin = ({ preserveDailyBriefIntent = false } = {}) => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  if (!preserveDailyBriefIntent) clearDailyBriefAuthIntent();
  if (!preserveDailyBriefIntent) resetDailyBriefCtaFeedback();
  navigateTo('/login');
};
const dismissAuthOverlay = () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  clearDailyBriefAuthIntent();
  resetDailyBriefCtaFeedback();
  const targetRoute = sanitizeAuthBackdropRoute(authBackdropRoute.value);
  navigateTo(targetRoute, { replace: true });
};
const goToProfile = () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  isScreenerTabSelected.value = false;
  clearDailyBriefAuthIntent();
  navigateTo('/profile');
};
const goToSettings = () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  isScreenerTabSelected.value = false;
  clearDailyBriefAuthIntent();
  navigateTo('/settings');
};
const goToSignUp = ({ preserveDailyBriefIntent = false } = {}) => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  if (!preserveDailyBriefIntent) clearDailyBriefAuthIntent();
  if (!preserveDailyBriefIntent) resetDailyBriefCtaFeedback();
  navigateTo('/sign-up');
};
const openPricingFromMenu = () => {
  closeAccountMenu();
  openPricingModal();
};

const openWheelGuideFromNav = () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  openWheelGuide();
};
const goToProfileFromMenu = () => {
  goToProfile();
};
const goToSettingsFromMenu = () => {
  goToSettings();
};
const completeDailyBriefIntent = async () => {
  dailyBriefCtaPending.value = true;
  resetDailyBriefCtaFeedback();

  try {
    await auth.fetchDailyBriefSubscription({ force: true });

    if (auth.dailyBriefSubscriptionStatus.value !== 'active') {
      await auth.subscribeToDailyBrief({ source: 'daily_brief_cta' });
    }

    setDailyBriefCtaFeedback(`Subscribed. We will send the Daily Top 3 to ${dailyBriefDestinationEmail.value}.`, 'success');
  } catch (error) {
    setDailyBriefCtaFeedback(error.message || 'Unable to update the Daily Top 3 subscription.', 'error');
  } finally {
    dailyBriefCtaPending.value = false;
    clearDailyBriefAuthIntent();
  }
};
const handleDailyBriefSubscribe = () => {
  resetDailyBriefCtaFeedback();

  if (!isAuthenticated.value) {
    dailyBriefAuthIntent.value = true;
    goToSignUp({ preserveDailyBriefIntent: true });
    return;
  }

  if (auth.dailyBriefSubscriptionStatus.value === 'active') {
    setDailyBriefCtaFeedback(`Daily Top 3 is already going to ${dailyBriefDestinationEmail.value}.`);
    return;
  }

  void completeDailyBriefIntent();
};
const isAuthResolved = computed(() => auth.state.initialized && !auth.state.initializing);

const priceRange = ref([0, 500]);
const rsiRange = ref([0, 100]);
const deltaBounds = { min: 0.2, max: 0.4, step: 0.02 };
const defaultDeltaRange = [deltaBounds.min, deltaBounds.max];
const deltaRange = ref([...defaultDeltaRange]);
const appliedDeltaRange = ref([...defaultDeltaRange]);

const priceRangeStyle = computed(() => ({
  left: `${(priceRange.value[0] / 500) * 100}%`,
  width: `${((priceRange.value[1] - priceRange.value[0]) / 500) * 100}%`,
}));

const rsiRangeStyle = computed(() => ({
  left: `${(rsiRange.value[0] / 100) * 100}%`,
  width: `${((rsiRange.value[1] - rsiRange.value[0]) / 100) * 100}%`,
}));

const deltaRangeStyle = computed(() => ({
  left: `${((deltaRange.value[0] - deltaBounds.min) / (deltaBounds.max - deltaBounds.min)) * 100}%`,
  width: `${((deltaRange.value[1] - deltaRange.value[0]) / (deltaBounds.max - deltaBounds.min)) * 100}%`,
}));
const minRoi = ref('2');
const appliedMinRoi = ref('2');
const maxSpread = ref('');
const appliedMaxSpread = ref('');
const tvFilter = ref('neutral');
const appliedTvFilter = ref('neutral');
const minScore = ref('75');
const appliedMinScore = ref('75');
const showMidColumn = ref(false);
const showDeltaColumn = ref(true);
const showVolumeColumn = ref(false);
const showIvColumn = ref(false);
const showRsiColumn = ref(false);
const currentPage = ref('home');
const contentLastUpdated = '2026-04-01';
const seoConfig = computed(() => {
  if (currentRoute.value === '/') {
    return {
      title: 'PutPulse AI Agent',
      description:
        'Use the PutPulse AI agent to research setups, ask trading workflow questions, and explore option ideas from a single chat interface.',
      robots: 'index,follow',
      canonicalPath: '/',
    };
  }

  if (currentRoute.value === '/agent') {
    return {
      title: 'PutPulse AI Agent',
      description:
        'Use the PutPulse AI agent to research setups, ask trading workflow questions, and explore option ideas from a single chat interface.',
      robots: 'noindex,follow',
      canonicalPath: '/',
    };
  }

  if (currentRoute.value === '/') {
    if (currentPage.value === 'dailyBrief') {
      return {
        title: 'Daily Top 3 | PutPulse',
        description:
          'Review today’s curated Daily Top 3 cash-secured put ideas and premium setups from PutPulse.',
        robots: 'index,follow',
        canonicalPath: '/',
      };
    }

    return {
      title: 'PutPulse | Cash-Secured Put Ideas and Wheel Strategy Insights',
      description:
        'Find cash-secured put-selling opportunities on fundamentally strong stocks, track monthly ROI targets, and follow a disciplined wheel strategy workflow.',
      robots: 'index,follow',
      canonicalPath: '/',
    };
  }

  if (currentRoute.value === '/cash-secured-puts') {
    return {
      title: 'Cash-Secured Puts Guide | PutPulse',
      description:
        'Learn how cash-secured puts work, how assignment fits the strategy, and what to check before selling puts on stocks you want to own.',
      robots: 'index,follow',
      canonicalPath: '/cash-secured-puts',
    };
  }

  if (currentRoute.value === '/methodology') {
    return {
      title: 'Methodology | PutPulse',
      description:
        'See how PutPulse narrows option setups into a shortlist and how to use the research output inside a disciplined options workflow.',
      robots: 'index,follow',
      canonicalPath: '/methodology',
    };
  }

  if (currentRoute.value === '/about') {
    return {
      title: 'About PutPulse',
      description:
        'Learn what PutPulse is built for, who it serves, and how the product approaches option income research on quality stocks.',
      robots: 'index,follow',
      canonicalPath: '/about',
    };
  }

  if (currentRoute.value === '/contact') {
    return {
      title: 'Contact PutPulse',
      description:
        'Contact PutPulse for product questions, support issues, methodology questions, and partnership inquiries.',
      robots: 'index,follow',
      canonicalPath: '/contact',
    };
  }

  if (currentRoute.value === '/pricing') {
    return {
      title: 'Pricing | PutPulse',
      description:
        'PutPulse pricing — Free includes 10 chats per day, 1 full stock analysis per day, and 5 screener results per scan; Pro unlocks unlimited AI research and full history.',
      robots: 'index,follow',
      canonicalPath: '/pricing',
    };
  }

  if (currentRoute.value === '/terms') {
    return {
      title: 'Terms of Service | PutPulse',
      description:
        'Read the PutPulse Terms of Service covering account usage, subscriptions, payments, intellectual property, and financial disclaimers.',
      robots: 'index,follow',
      canonicalPath: '/terms',
    };
  }

  if (currentRoute.value === '/privacy') {
    return {
      title: 'Privacy Policy | PutPulse',
      description:
        'Read the PutPulse Privacy Policy — what data we collect, how we use it, third-party processors, your rights, and how to contact us.',
      robots: 'index,follow',
      canonicalPath: '/privacy',
    };
  }

  if (currentRoute.value === '/refund-policy') {
    return {
      title: 'Refund Policy | PutPulse',
      description:
        'PutPulse refund policy — free Basic plan, no-contract Pro subscriptions, monthly and annual refund terms, and how to request a refund.',
      robots: 'index,follow',
      canonicalPath: '/refund-policy',
    };
  }

  if (currentRoute.value === '/covered-calls') {
    return {
      title: 'Covered Calls Guide | PutPulse',
      description:
        'Learn how covered calls work, when to sell calls against stock you own, and how the strategy fits into a disciplined income workflow.',
      robots: 'index,follow',
      canonicalPath: '/covered-calls',
    };
  }

  if (currentRoute.value === '/dashboard') {
    return {
      title: 'Dashboard | PutPulse',
      description:
        'Review filtered cash-secured put opportunities, daily brief picks, and wheel strategy setups inside your PutPulse dashboard.',
      robots: 'noindex,follow',
      canonicalPath: '/dashboard',
    };
  }

  if (currentRoute.value === '/login') {
    return {
      title: 'Login | PutPulse',
      description: 'Log in to access your PutPulse dashboard and daily cash-secured put ideas.',
      robots: 'noindex,follow',
      canonicalPath: '/login',
    };
  }

  if (currentRoute.value === '/sign-up') {
    return {
      title: 'Start For Free | PutPulse',
      description:
        'Create a PutPulse account to access daily cash-secured put ideas and wheel strategy workflows.',
      robots: 'noindex,follow',
      canonicalPath: '/sign-up',
    };
  }

  if (currentRoute.value === '/verify-email') {
    return {
      title: 'Verify Email | PutPulse',
      description: 'Verify your email address to activate your PutPulse account.',
      robots: 'noindex,follow',
      canonicalPath: '/verify-email',
    };
  }

  if (currentRoute.value === '/settings') {
    return {
      title: 'Settings | PutPulse',
      description: 'Manage your PutPulse account settings, subscription, and session preferences.',
      robots: 'noindex,follow',
      canonicalPath: '/settings',
    };
  }

  if (currentRoute.value === '/wheel-strategy') {
    return {
      title: 'Wheel Strategy Guide | PutPulse',
      description:
        'Understand the wheel strategy workflow: sell cash-secured puts, accept assignment on quality stocks, and sell covered calls with discipline.',
      robots: 'index,follow',
      canonicalPath: '/wheel-strategy',
    };
  }

  return {
    title: 'Profile | PutPulse',
    description: 'Manage your PutPulse profile and subscription settings.',
    robots: 'noindex,follow',
    canonicalPath: '/profile',
  };
});
const showPublicFooter = computed(() => marketingRoutes.has(currentRoute.value));
const routeStructuredData = computed(() => {
  if (currentRoute.value === '/cash-secured-puts') {
    const pageUrl = buildCanonicalUrl('/cash-secured-puts');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Cash-Secured Puts Guide',
        description:
          'Learn how cash-secured puts work, how assignment fits the strategy, and what to check before selling puts on stocks you want to own.',
        mainEntityOfPage: pageUrl,
        dateModified: contentLastUpdated,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ];
  }

  if (currentRoute.value === '/methodology') {
    const pageUrl = buildCanonicalUrl('/methodology');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'PutPulse Methodology',
        description:
          'See how PutPulse narrows option setups into a shortlist and how to use the research output inside a disciplined options workflow.',
        mainEntityOfPage: pageUrl,
        dateModified: contentLastUpdated,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ];
  }

  if (currentRoute.value === '/about') {
    const pageUrl = buildCanonicalUrl('/about');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About PutPulse',
        description:
          'Learn what PutPulse is built for, who it serves, and how the product approaches option income research on quality stocks.',
        url: pageUrl,
        isPartOf: `${siteUrl}/#website`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PutPulse',
        url: siteUrl,
        description:
          'PutPulse is an educational options research product focused on cash-secured puts, covered calls, and wheel strategy workflows.',
      },
    ];
  }

  if (currentRoute.value === '/contact') {
    const pageUrl = buildCanonicalUrl('/contact');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact PutPulse',
        description:
          'Contact PutPulse via admin@putpulse.com.',
        url: pageUrl,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PutPulse',
        url: siteUrl,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'admin@putpulse.com',
            availableLanguage: ['en'],
          },
        ],
      },
    ];
  }

  if (currentRoute.value === '/covered-calls') {
    const pageUrl = buildCanonicalUrl('/covered-calls');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Covered Calls Guide',
        description:
          'Learn how covered calls work, when to sell calls against stock you own, and how the strategy fits into a disciplined income workflow.',
        mainEntityOfPage: pageUrl,
        dateModified: contentLastUpdated,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ];
  }

  if (currentRoute.value === '/wheel-strategy') {
    const pageUrl = buildCanonicalUrl('/wheel-strategy');

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Wheel Strategy Guide',
        description:
          'Understand the wheel strategy workflow: sell cash-secured puts, accept assignment on quality stocks, and sell covered calls with discipline.',
        mainEntityOfPage: pageUrl,
        dateModified: contentLastUpdated,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ];
  }

  return [];
});
const isWheelGuideOpen = ref(false);
const isModalOpen = ref(false);
const activeTicker = ref('');
const overviewTimeframe = ref('1Y');
const symbolOverviewContainer = ref(null);
const symbolProfileContainer = ref(null);

const cloudApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? getApiBaseUrl();
const localApiBaseUrl = import.meta.env.VITE_LOCAL_API_BASE_URL ?? '';
const useLocalApiByDefault = Boolean(localApiBaseUrl) && ['1', 'true', 'yes'].includes(
  String(import.meta.env.VITE_USE_LOCAL_API ?? '').toLowerCase(),
);
const resolvedApiBaseUrl = useLocalApiByDefault ? localApiBaseUrl : cloudApiBaseUrl;
setApiBaseUrl(resolvedApiBaseUrl);

const expandedWheelGroups = ref({});

const compareContractsByLowestDelta = (a, b) => {
  const deltaDiff = (a?.rawAbsDelta ?? Number.POSITIVE_INFINITY) - (b?.rawAbsDelta ?? Number.POSITIVE_INFINITY);
  if (deltaDiff !== 0) return deltaDiff;

  const roiDiff = (b?.roiValue ?? Number.NEGATIVE_INFINITY) - (a?.roiValue ?? Number.NEGATIVE_INFINITY);
  if (roiDiff !== 0) return roiDiff;

  return (b?.rawMid ?? Number.NEGATIVE_INFINITY) - (a?.rawMid ?? Number.NEGATIVE_INFINITY);
};

const formatContractPremium = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '—';
  return `$${Math.round(number * 100).toLocaleString('en-US')}`;
};

const formatCurrencyAmount = (value, digits = 2) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '—';
  return `$${number.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};

const formatSignedValue = (value, digits = 2) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return `${number > 0 ? '+' : ''}${number.toFixed(digits)}`;
};

const formatCurrencyPair = (bid, ask) => {
  const bidValue = Number(bid);
  const askValue = Number(ask);
  if (Number.isNaN(bidValue) || Number.isNaN(askValue)) return '—';
  return `${formatCurrencyAmount(bidValue)} / ${formatCurrencyAmount(askValue)}`;
};

const getStrikeIncrement = (strike) => {
  const value = Number(strike);
  if (Number.isNaN(value)) return 5;
  if (value < 25) return 1;
  if (value < 50) return 2.5;
  return 5;
};

const buildWheelSetup = (contract) => {
  const strikeValue = Number(contract?.rawStrike);
  const premiumValue = Number(contract?.rawMid);

  const hasStrike = !Number.isNaN(strikeValue);
  const hasPremium = !Number.isNaN(premiumValue);
  const callIncrement = getStrikeIncrement(hasStrike ? strikeValue : contract?.rawPrice);
  const coveredCallStrike = hasStrike ? strikeValue + callIncrement : Number.NaN;
  const estimatedCallPremium = hasPremium ? Math.max(25, Math.round((premiumValue * 100 * 0.6) / 5) * 5) : Number.NaN;

  return {
    statusLabel: 'Wheel live',
    activeStep: 0,
    putPremium: hasPremium ? formatContractPremium(premiumValue) : '—',
    costBasis: hasStrike && hasPremium ? formatCurrencyAmount(strikeValue - premiumValue) : '—',
    coveredCallLabel: Number.isNaN(coveredCallStrike) ? '—' : `${formatNumber(coveredCallStrike)}C`,
    coveredCallPremium: Number.isNaN(estimatedCallPremium) ? '—' : `$${estimatedCallPremium.toLocaleString('en-US')}`,
    coveredCallNote: 'Estimated next call premium from current put pricing',
    steps: [
      {
        id: 'put-sale',
        title: 'Sell cash-secured put',
        value: `${contract?.strike ?? '—'} strike · ${hasPremium ? formatContractPremium(premiumValue) : '—'}`,
        note: `Current entry setup expiring ${contract?.date ?? '—'} with ${contract?.roi ?? '—'} expected monthly ROI`,
      },
      {
        id: 'assigned',
        title: 'If assigned',
        value: `100 shares near ${hasStrike && hasPremium ? formatCurrencyAmount(strikeValue - premiumValue) : '—'}`,
        note: 'Assignment turns the premium into a lower effective share cost basis.',
      },
      {
        id: 'covered-call',
        title: 'Sell covered call',
        value: `${Number.isNaN(coveredCallStrike) ? '—' : `${formatNumber(coveredCallStrike)}C`} · ${Number.isNaN(estimatedCallPremium) ? '—' : `$${estimatedCallPremium.toLocaleString('en-US')}`}`,
        note: 'Recycle the position into the covered-call leg once shares are in the account.',
      },
    ],
  };
};


const getBreakdownTone = (value, positiveThreshold, neutralThreshold = null) => {
  const number = Number(value);
  if (Number.isNaN(number)) return 'muted';
  if (number >= positiveThreshold) return 'positive';
  if (neutralThreshold !== null && number >= neutralThreshold) return 'neutral';
  return 'muted';
};

const getTechnicalTone = (rating) => {
  if (rating === 'Strong Buy' || rating === 'Buy') return 'positive';
  if (rating === 'Neutral') return 'neutral';
  return 'muted';
};

const buildGroupDetailPanel = (group, contract) => {
  const collateralValue = Number(contract?.rawStrike) * 100;
  const spreadValue = Number(contract?.spreadValue);
  const rawScore = Number(group?.rawScore);
  const rawRoi = Number(contract?.roiValue);
  const executionNoteParts = [];

  if (hasDisplayValue(contract?.volume)) executionNoteParts.push(`${contract.volume} vol`);
  if (hasDisplayValue(contract?.iv)) executionNoteParts.push(`${contract.iv} IV`);

  return {
    greeks: [
      { label: 'Delta', value: contract?.delta ?? '—' },
      { label: 'Gamma', value: formatSignedValue(contract?.rawGamma, 3) },
      { label: 'Theta', value: formatSignedValue(contract?.rawTheta, 3) },
      { label: 'Vega', value: formatSignedValue(contract?.rawVega, 3) },
    ],
    position: [
      { label: 'Premium', value: contract?.rawMid !== null ? formatContractPremium(contract.rawMid) : '—' },
      { label: 'Collateral', value: Number.isNaN(collateralValue) ? '—' : formatCurrencyAmount(collateralValue, 0) },
      { label: 'Break-even', value: group?.wheelSetup?.costBasis ?? '—' },
      { label: 'Bid / Ask', value: formatCurrencyPair(contract?.rawBid, contract?.rawAsk) },
      { label: 'Spread', value: Number.isNaN(spreadValue) ? '—' : formatCurrencyAmount(spreadValue) },
      { label: 'Expires', value: contract?.date ?? '—' },
    ],
    scoreBreakdown: [
      {
        label: 'Fundamentals',
        value: group?.score ?? '—',
        note: Number.isNaN(rawScore) ? 'No ownership score returned.' : 'Ownership-quality score used for assignment comfort.',
        tone: getBreakdownTone(rawScore, 75, 60),
      },
      {
        label: 'Technical signal',
        value: group?.tvTechnicals ?? '—',
        note: 'TradingView 1M signal for current momentum confirmation.',
        tone: getTechnicalTone(group?.tvTechnicals),
      },
      {
        label: 'Premium yield',
        value: contract?.roi ?? '—',
        note: `${contract?.mid ?? '—'} mid premium on the selected strike.`,
        tone: getBreakdownTone(rawRoi, 2, 1),
      },
      {
        label: 'Execution',
        value: Number.isNaN(spreadValue) ? '—' : formatCurrencyAmount(spreadValue),
        note: executionNoteParts.length ? executionNoteParts.join(' · ') : `RSI ${group?.rsi ?? '—'}`,
        tone: Number.isNaN(spreadValue) ? 'muted' : spreadValue <= 0.5 ? 'positive' : spreadValue <= 1.5 ? 'neutral' : 'muted',
      },
    ],
  };
};

const dailyBriefEntries = ref([]);

const dailyBriefCandidateRows = computed(() =>
  expandedWeeklyIdeaRows.value.filter((row) =>
    hasDisplayValue(row.ticker)
    && row.hasOptionData
    && row.rawScore !== null
    && !Number.isNaN(row.rawScore)
    && row.rawScore > 80
    && row.rawRsi !== null
    && row.rawRsi >= 30
    && row.rawRsi <= 70
    && (row.tvTechnicals === 'Buy' || row.tvTechnicals === 'Strong Buy')
    && row.spreadValue !== null
    && row.spreadValue < 1.5
    && row.rawStrike !== null
    && row.rawPrice !== null
    && row.rawStrike < row.rawPrice
    && row.rawAbsDelta !== null
    && row.rawAbsDelta < 0.32
    && row.roiValue !== null),
);

const rankedDailyBriefRows = computed(() => {
  const bestRowByTicker = new Map();

  dailyBriefCandidateRows.value.forEach((row) => {
    const tickerKey = normalizeTickerSymbol(row.ticker);
    if (!tickerKey) return;

    const existing = bestRowByTicker.get(tickerKey);
    if (!existing || compareDailyBriefRows(row, existing) < 0) {
      bestRowByTicker.set(tickerKey, row);
    }
  });

  return Array.from(bestRowByTicker.values()).sort(compareDailyBriefRows);
});

const topThreeRows = computed(() => rankedDailyBriefRows.value.slice(0, 3));

const legacyDailyBriefRows = computed(() =>
  topThreeRows.value.map((row) => ({
    ticker: row.ticker,
    price: row.price,
    strike: row.strike,
    delta: row.delta,
    roi: row.roi,
    date: row.date,
    estPremium: row.rawMid != null ? `~$${Math.round(row.rawMid * 100)}` : '—',
    estCollateral: row.rawStrike != null ? `~$${Math.round(row.rawStrike * 100).toLocaleString()}` : '—',
  }))
);

const dailyBriefRows = computed(() =>
  dailyBriefEntries.value.map((entry) => {
    const optionData = entry?.option_data && typeof entry.option_data === 'object' ? entry.option_data : {};
    const ticker = normalizeTickerSymbol(entry?.ticker ?? optionData?.root);
    const matchingWeeklyIdea = weeklyIdeas.value.find((idea) => normalizeTickerSymbol(idea?.ticker) === ticker);
    const rawPrice = firstDefined(entry?.price, entry?.stock_price, entry?.underlying_price, matchingWeeklyIdea?.price);
    const rawStrike = firstDefined(entry?.strike_price, optionData?.strike_price, optionData?.strike);
    const rawMid = firstDefined(entry?.mid, optionData?.mid);
    const rawRoi = firstDefined(entry?.roi, optionData?.roi);
    const rawDelta = firstDefined(entry?.delta, optionData?.delta);
    const rawExpiration = firstDefined(entry?.date, entry?.expiration, optionData?.expiration, entry?.option_exp);

    return {
      ticker: ticker || '—',
      price: formatNumber(rawPrice),
      strike: rawStrike != null ? formatNumber(rawStrike) : '—',
      delta: formatDelta(rawDelta),
      roi: formatPercent(rawRoi),
      date: formatOptionDate(rawExpiration),
      estPremium:
        rawMid != null && !Number.isNaN(Number(rawMid))
          ? `~$${Math.round(Number(rawMid) * 100).toLocaleString('en-US')}`
          : '—',
      estCollateral:
        rawStrike != null && !Number.isNaN(Number(rawStrike))
          ? `~$${Math.round(Number(rawStrike) * 100).toLocaleString('en-US')}`
          : '—',
    };
  }),
);

const heroTopThreeRow = ref(null);

const heroTopThreeTicker = computed(() => heroTopThreeRow.value?.ticker ?? '—');
const heroTopThreeStrike = computed(() => heroTopThreeRow.value?.strike ?? '—');
const heroTopThreePremium = computed(() => heroTopThreeRow.value?.estPremium ?? '—');

const weeklyIdeas = ref([]);
const weeklyIdeasHasMore = ref(false);
const dailyBriefLoading = ref(false);
const dailyBriefError = ref(false);
const weeklyIdeasLoading = ref(false);
const weeklyIdeasError = ref(false);
const weeklyPageSize = 6;
const weeklyFetchPageSize = 25;
const weeklyCurrentPage = ref(1);

const weeklyTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredWeeklyIdeaGroups.value.length / weeklyPageSize)),
);

const overviewTimeframeOptions = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

const activeTickerRows = computed(() =>
  expandedWeeklyIdeaRows.value.filter((row) => row.ticker === activeTicker.value),
);

const activeTickerBestRow = computed(() => {
  const rows = [...activeTickerRows.value];
  if (!rows.length) return null;
  rows.sort(compareContractsByLowestDelta);
  return rows[0];
});

const activeTickerSymbolData = computed(() =>
  weeklyIdeas.value.find((symbol) => symbol.ticker === activeTicker.value) ?? null,
);

const activeTickerCompany = computed(() => {
  const candidate = firstDefined(
    activeTickerSymbolData.value?.company,
    activeTickerSymbolData.value?.company_name,
    activeTickerSymbolData.value?.issuer_name,
    activeTickerSymbolData.value?.description_name,
    activeTickerSymbolData.value?.display_name,
  );
  if (!candidate || candidate === activeTicker.value) return 'Option candidate';
  return String(candidate);
});

const activeTickerDisplayPrice = computed(() => {
  const row = activeTickerBestRow.value;
  return row?.rawPrice != null ? `$${formatNumber(row.rawPrice)}` : '—';
});

const activeTickerDisplayRoi = computed(() => activeTickerBestRow.value?.roi ?? '—');

const activeTickerPriceMeta = computed(() => {
  const row = activeTickerBestRow.value;
  if (!row?.date) return 'best contract';
  return `exp. ${row.date}`;
});

const activeTickerScoreValue = computed(() => scoreSignalValue(activeTickerBestRow.value?.rawScore));

const activeTickerScoreRingOffset = computed(() => {
  const score = Number(activeTickerBestRow.value?.rawScore);
  const circumference = 69.115;
  if (Number.isNaN(score)) return `${circumference}`;
  return `${circumference - (Math.max(0, Math.min(score, 100)) / 100) * circumference}`;
});

const activeTickerTechnical = computed(() => activeTickerBestRow.value?.tvTechnicals ?? '—');

const activeTickerStrategyLabel = computed(() => {
  const row = activeTickerBestRow.value;
  if (!row?.strike || row.strike === '—') return 'Put';
  return `Put · ${row.strike}`;
});

const activeTickerStrategyMeta = computed(() => {
  const row = activeTickerBestRow.value;
  if (!row?.date) return 'no expiry';
  return `exp. ${row.date}`;
});

const weeklyVisibleColumnCount = computed(() =>
  7
  + (showMidColumn.value ? 1 : 0)
  + (showDeltaColumn.value ? 1 : 0)
  + (showVolumeColumn.value ? 1 : 0)
  + (showIvColumn.value ? 1 : 0)
  + (showRsiColumn.value ? 1 : 0),
);

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
};

const formatFixedNumber = (value, digits = 2) => {
  if (value === null || value === undefined || value === '') return 'вЂ”';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return number.toFixed(digits);
};

const formatTechnicalScore = (score) => {
  if (score === null || score === undefined) return null;
  if (typeof score === 'string') {
    const normalized = score.trim().toLowerCase().replace(/[_-]+/g, ' ');
    if (!normalized) return null;
    if (normalized === 'strong buy') return 'Strong Buy';
    if (normalized === 'buy') return 'Buy';
    if (normalized === 'neutral') return 'Neutral';
    if (normalized === 'sell') return 'Sell';
    if (normalized === 'strong sell') return 'Strong Sell';
    return score;
  }
  if (score >= 0.5) return 'Strong Buy';
  if (score >= 0.1) return 'Buy';
  if (score > -0.1) return 'Neutral';
  if (score > -0.5) return 'Sell';
  return 'Strong Sell';
};

const getDailyBriefTechnicalRank = (rating) => {
  if (rating === 'Strong Buy') return 0;
  if (rating === 'Buy') return 1;
  return 2;
};

const normalizeTickerSymbol = (ticker) => String(ticker ?? '').trim().toUpperCase();

const compareDailyBriefRows = (a, b) => {
  const roiDiff = (b?.roiValue ?? Number.NEGATIVE_INFINITY) - (a?.roiValue ?? Number.NEGATIVE_INFINITY);
  if (roiDiff !== 0) return roiDiff;

  const scoreDiff = (b?.rawScore ?? Number.NEGATIVE_INFINITY) - (a?.rawScore ?? Number.NEGATIVE_INFINITY);
  if (scoreDiff !== 0) return scoreDiff;

  const technicalDiff = getDailyBriefTechnicalRank(a?.tvTechnicals) - getDailyBriefTechnicalRank(b?.tvTechnicals);
  if (technicalDiff !== 0) return technicalDiff;

  return String(a?.ticker ?? '').localeCompare(String(b?.ticker ?? ''), 'en-US');
};

const scoreSignalValue = (score) => {
  const number = Number(score);
  if (Number.isNaN(number)) return '--';
  return String(Math.round(number));
};

const scoreSignalBadgeClass = (score, rating) => {
  const number = Number(score);
  if (rating === 'Strong Buy' || rating === 'Buy') {
    return number >= 75 ? 'weekly-score-badge--positive' : 'weekly-score-badge--neutral';
  }
  if (rating === 'Neutral') return 'weekly-score-badge--neutral';
  if (rating === 'Sell' || rating === 'Strong Sell') return 'weekly-score-badge--negative';
  return Number.isNaN(number) ? 'weekly-score-badge--muted' : 'weekly-score-badge--neutral';
};

const tickerTechnicalBadgeClass = (rating) => {
  if (rating === 'Strong Buy' || rating === 'Buy') return 'ticker-technical-badge--positive';
  if (rating === 'Neutral') return 'ticker-technical-badge--neutral';
  if (rating === 'Sell' || rating === 'Strong Sell') return 'ticker-technical-badge--negative';
  return 'ticker-technical-badge--muted';
};

const roiPillClass = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return 'roi-pill--muted';
  if (number > 0) return 'roi-pill--positive';
  if (number < 0) return 'roi-pill--negative';
  return 'roi-pill--muted';
};

const formatStrengthScore = (score) => {
  if (score === null || score === undefined || score === '') return '—';
  const number = Number(score);
  if (Number.isNaN(number)) return score;
  return `${Math.round(number)}/100`;
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number)}%`;
};

const formatDelta = (value) => {
  if (value === null || value === undefined || value === '') return '--';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return number.toFixed(2);
};

const formatWholeNumber = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number);
};

const formatImpliedVolatility = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string' && value.includes('%')) return value;
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  const normalizedValue = Math.abs(number) <= 1 ? number * 100 : number;
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(normalizedValue)}%`;
};

const formatAbsDeltaValue = (value) => {
  if (value === null || value === undefined || value === '') return '--';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return Math.abs(number).toFixed(2);
};

const formatChanceOfProfit = (absDelta) => {
  if (absDelta === null || absDelta === undefined || absDelta === '') return '—';
  const number = Number(absDelta);
  if (Number.isNaN(number)) return absDelta;
  const probability = Math.max(0, 100 - (Math.abs(number) * 100));
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(probability)}%`;
};

const formatOptionDate = (value) => {
  if (value === null || value === undefined || value === '') return 'вЂ”';
  const stringValue = String(value);
  if (/^\d{8}$/.test(stringValue)) {
    return `${stringValue.slice(0, 4)}-${stringValue.slice(4, 6)}-${stringValue.slice(6, 8)}`;
  }
  return stringValue;
};

const firstDefined = (...values) => values.find((value) => value !== null && value !== undefined && value !== '');
const hasDisplayValue = (value) => value !== null && value !== undefined && /[A-Za-z0-9]/.test(String(value));
const isMissingDateValue = (value) => {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '' || normalized === 'null' || normalized === 'none' || normalized === 'n/a' || normalized === 'na';
};
const formatDateInput = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const normalizeComparableDate = (value) => {
  if (isMissingDateValue(value)) return '';
  const stringValue = String(value).trim();
  if (/^\d{8}$/.test(stringValue)) {
    return `${stringValue.slice(0, 4)}-${stringValue.slice(4, 6)}-${stringValue.slice(6, 8)}`;
  }
  return formatDateInput(stringValue);
};
const passesEarningsTimingFilter = (nextEarningsDate, expirationDate) => {
  const normalizedNextEarningsDate = normalizeComparableDate(nextEarningsDate);
  if (!normalizedNextEarningsDate) return true;
  const normalizedExpirationDate = normalizeComparableDate(expirationDate);
  if (!normalizedExpirationDate) return true;
  return normalizedNextEarningsDate > normalizedExpirationDate;
};

const weeklyIdeaRows = computed(() =>
  weeklyIdeas.value.map((symbol) => {
    const roiValue = Number(symbol.roi);
    return {
      id: symbol.ticker ?? 'unknown',
      ticker: symbol.ticker ?? '—',
      rawPrice: symbol.price != null ? Number(symbol.price) : null,
      price: formatNumber(symbol.price),
      rsi: formatNumber(symbol.rsi),
      roiValue: Number.isNaN(roiValue) ? null : roiValue,
      roi: formatPercent(symbol.roi),
      date: symbol.option_exp ?? '—',
      mid: symbol.mid != null ? `$${Number(symbol.mid).toFixed(2)}` : '—',
      rawMid: symbol.mid != null ? Number(symbol.mid) : null,
      rawStrike: symbol.strike_price != null ? Number(symbol.strike_price) : null,
      delta: formatDelta(symbol.option_data?.delta),
      spreadValue: symbol.ask != null && symbol.bid != null
        ? Number(symbol.ask) - Number(symbol.bid)
        : null,
      strike: symbol.strike_price != null ? formatNumber(symbol.strike_price) : '—',
      rawScore: symbol.score != null ? Number(symbol.score) : null,
      score: formatStrengthScore(symbol.score),
      tvTechnicals: formatTechnicalScore(symbol.technical_score) ?? '—',
    };
  }));

const expandedWeeklyIdeaRows = computed(() =>
  weeklyIdeas.value.flatMap((symbol) => {
    const primaryOption =
      symbol.option_data && typeof symbol.option_data === 'object' ? symbol.option_data : null;
    const contracts = primaryOption
      ? [primaryOption, ...(Array.isArray(primaryOption.alternatives) ? primaryOption.alternatives : [])]
      : [null];

    return contracts.map((contract, index) => {
      const roiSource = firstDefined(contract?.roi, symbol.roi);
      const priceSource = firstDefined(symbol.price);
      const strikeSource = firstDefined(contract?.strike_price, contract?.strike, symbol.strike_price, symbol.strike);
      const midSource = firstDefined(contract?.mid, symbol.mid);
      const bidSource = firstDefined(contract?.bid, symbol.bid);
      const askSource = firstDefined(contract?.ask, symbol.ask);
      const deltaSource = firstDefined(contract?.delta, symbol.option_data?.delta, symbol.delta);
      const volumeSource = firstDefined(contract?.volume, contract?.option_volume, contract?.trade_volume, symbol.option_data?.volume, symbol.volume);
      const ivSource = firstDefined(
        contract?.iv,
        contract?.implied_volatility,
        contract?.implied_vol,
        contract?.volatility,
        symbol.option_data?.iv,
        symbol.option_data?.implied_volatility,
        symbol.iv,
      );
      const gammaSource = firstDefined(contract?.gamma, contract?.greeks?.gamma, symbol.option_data?.gamma, symbol.option_data?.greeks?.gamma);
      const thetaSource = firstDefined(contract?.theta, contract?.greeks?.theta, symbol.option_data?.theta, symbol.option_data?.greeks?.theta);
      const vegaSource = firstDefined(contract?.vega, contract?.greeks?.vega, symbol.option_data?.vega, symbol.option_data?.greeks?.vega);
      const contractSymbol = firstDefined(contract?.option_symbol, symbol.option_symbol);
      const expirationSource = firstDefined(contract?.expiration, symbol.option_exp, symbol.expiration);
      const nextEarningsDateSource = firstDefined(
        symbol.next_earnings_date,
        symbol.nextEarningsDate,
        symbol.earnings_date,
        symbol.earningsDate,
      );
      const roiValue = Number(roiSource);
      const priceValue = priceSource != null ? Number(priceSource) : null;
      const strikeValue = strikeSource != null ? Number(strikeSource) : null;
      const midValue = midSource != null ? Number(midSource) : null;
      const bidValue = bidSource != null ? Number(bidSource) : null;
      const askValue = askSource != null ? Number(askSource) : null;
      const deltaValue = deltaSource != null ? Number(deltaSource) : null;
      const gammaValue = gammaSource != null ? Number(gammaSource) : null;
      const thetaValue = thetaSource != null ? Number(thetaSource) : null;
      const vegaValue = vegaSource != null ? Number(vegaSource) : null;

      return {
        id:
          contractSymbol
          ?? `${symbol.ticker ?? 'unknown'}-${expirationSource ?? 'na'}-${strikeSource ?? index}-${index}`,
        ticker: symbol.ticker ?? 'вЂ”',
        rawPrice: priceValue === null || Number.isNaN(priceValue) ? null : priceValue,
        price: formatNumber(priceSource),
        rawRsi: symbol.rsi != null && !Number.isNaN(Number(symbol.rsi)) ? Number(symbol.rsi) : null,
        rsi: formatNumber(symbol.rsi),
        roiValue: Number.isNaN(roiValue) ? null : roiValue,
        roi: formatPercent(roiSource),
        date: formatOptionDate(expirationSource),
        mid: midValue === null || Number.isNaN(midValue) ? 'вЂ”' : `$${midValue.toFixed(2)}`,
        rawMid: midValue === null || Number.isNaN(midValue) ? null : midValue,
        rawBid: bidValue === null || Number.isNaN(bidValue) ? null : bidValue,
        rawAsk: askValue === null || Number.isNaN(askValue) ? null : askValue,
        rawStrike: strikeValue === null || Number.isNaN(strikeValue) ? null : strikeValue,
        rawExpirationDate: expirationSource ?? null,
        rawNextEarningsDate: nextEarningsDateSource ?? null,
        rawDelta: deltaValue === null || Number.isNaN(deltaValue) ? null : deltaValue,
        rawAbsDelta: deltaValue === null || Number.isNaN(deltaValue) ? null : Math.abs(deltaValue),
        rawGamma: gammaValue === null || Number.isNaN(gammaValue) ? null : gammaValue,
        rawTheta: thetaValue === null || Number.isNaN(thetaValue) ? null : thetaValue,
        rawVega: vegaValue === null || Number.isNaN(vegaValue) ? null : vegaValue,
        delta: formatDelta(deltaSource),
        rawVolume: volumeSource != null ? Number(volumeSource) : null,
        volume: formatWholeNumber(volumeSource),
        rawIv: ivSource != null ? Number(ivSource) : null,
        iv: formatImpliedVolatility(ivSource),
        spreadValue:
          bidValue === null || askValue === null || Number.isNaN(bidValue) || Number.isNaN(askValue)
            ? null
            : askValue - bidValue,
        strike: strikeSource != null ? formatNumber(strikeSource) : 'вЂ”',
        hasOptionData: primaryOption !== null,
        rawScore: symbol.score != null ? Number(symbol.score) : null,
        score: formatStrengthScore(symbol.score),
      tvTechnicals: formatTechnicalScore(symbol.technical_score) ?? 'вЂ”',
      };
    });
  }));

const filteredWeeklyIdeaRows = computed(() => {
  let rows = expandedWeeklyIdeaRows.value.filter((row) => row.roiValue !== null
    && row.rawStrike !== null
    && row.rawPrice !== null
    && row.rawStrike < row.rawPrice
    && passesEarningsTimingFilter(row.rawNextEarningsDate, row.rawExpirationDate));

  const roiThreshold = appliedMinRoi.value === '' ? null : Number(appliedMinRoi.value);
  if (roiThreshold !== null && !Number.isNaN(roiThreshold)) {
    rows = rows.filter((row) => row.roiValue !== null && row.roiValue >= roiThreshold);
  }

  const spreadThreshold = appliedMaxSpread.value === '' ? null : Number(appliedMaxSpread.value);
  if (spreadThreshold !== null && !Number.isNaN(spreadThreshold)) {
    rows = rows.filter((row) => row.spreadValue !== null && row.spreadValue < spreadThreshold);
  }

  if (appliedTvFilter.value) {
    const allowed =
      appliedTvFilter.value === 'strongbuy'
        ? new Set(['Strong Buy'])
        : appliedTvFilter.value === 'buy'
          ? new Set(['Buy', 'Strong Buy'])
          : new Set(['Neutral', 'Buy', 'Strong Buy']);
    rows = rows.filter((row) => allowed.has(row.tvTechnicals));
  }

  const scoreThreshold = appliedMinScore.value === '' ? null : Number(appliedMinScore.value);
  if (scoreThreshold !== null && !Number.isNaN(scoreThreshold)) {
    rows = rows.filter((row) => row.rawScore !== null && !Number.isNaN(row.rawScore) && row.rawScore > scoreThreshold);
  }

  rows = rows.filter((row) =>
    row.rawAbsDelta !== null
    && row.rawAbsDelta >= appliedDeltaRange.value[0]
    && row.rawAbsDelta <= appliedDeltaRange.value[1]);

  return rows;
});

const filteredWeeklyIdeaGroups = computed(() => {
  const groups = new Map();

  filteredWeeklyIdeaRows.value.forEach((row, index) => {
    const groupId = hasDisplayValue(row.ticker) ? `ticker:${row.ticker}` : `contract:${row.id ?? index}`;
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        hasTicker: hasDisplayValue(row.ticker),
        ticker: hasDisplayValue(row.ticker) ? row.ticker : '—',
        price: row.price,
        rsi: row.rsi,
        rawScore: row.rawScore,
        score: row.score,
        tvTechnicals: row.tvTechnicals,
        contracts: [],
      });
    }

    groups.get(groupId).contracts.push(row);
  });

  return Array.from(groups.values()).map((group) => {
    const contracts = [...group.contracts].sort(compareContractsByLowestDelta);
    const bestContract = contracts[0];
    const wheelSetup = buildWheelSetup(bestContract);

    return {
      ...group,
      bestContract,
      wheelSetup,
      detailPanel: buildGroupDetailPanel({ ...group, wheelSetup }, bestContract),
    };
  });
});

const heroAverageMonthlyRoi = computed(() => {
  const roiValues = filteredWeeklyIdeaGroups.value
    .map((group) => group.bestContract?.roiValue)
    .filter((value) => value !== null && value !== undefined && !Number.isNaN(Number(value)));

  if (!roiValues.length) return '—';

  const average = roiValues.reduce((sum, value) => sum + Number(value), 0) / roiValues.length;
  return `${average.toFixed(2)}%`;
});

const paginatedWeeklyIdeaGroups = computed(() => {
  const start = (weeklyCurrentPage.value - 1) * weeklyPageSize;
  return filteredWeeklyIdeaGroups.value.slice(start, start + weeklyPageSize);
});

const weeklyPageStart = computed(() =>
  filteredWeeklyIdeaGroups.value.length ? (weeklyCurrentPage.value - 1) * weeklyPageSize + 1 : 0,
);

const weeklyPageEnd = computed(() =>
  Math.min(weeklyCurrentPage.value * weeklyPageSize, filteredWeeklyIdeaGroups.value.length),
);

const goToWeeklyPage = (page) => {
  const next = Math.min(Math.max(page, 1), weeklyTotalPages.value);
  weeklyCurrentPage.value = next;
};

const isWheelSetupExpanded = (groupId) => Boolean(expandedWheelGroups.value[groupId]);

const toggleWheelSetup = (groupId) => {
  expandedWheelGroups.value = {
    ...expandedWheelGroups.value,
    [groupId]: !expandedWheelGroups.value[groupId],
  };
};

const buildCurrentFilters = () => {
  const minRoiValue = minRoi.value === '' ? null : Number(minRoi.value);
  return {
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
    minRsi: rsiRange.value[0],
    maxRsi: rsiRange.value[1],
    minRoi: Number.isNaN(minRoiValue) ? null : minRoiValue,
  };
};

const ensurePremiumStatusLoaded = async ({ force = false } = {}) => {
  if (!isAuthenticated.value) return;
  if (!force && auth.state.premiumSubscriptionLoaded) return;

  try {
    await auth.fetchPremiumSubscription({ force });
  } catch {
    // If subscription lookup fails, keep the last known state and let the screener fetch proceed.
  }
};

const fetchWeeklyIdeas = async (filters = {}) => {
  weeklyIdeasLoading.value = true;
  weeklyIdeasError.value = false;
  try {
    await ensurePremiumStatusLoaded();

    const aggregatedResults = [];
    let page = 1;
    let hasMore = false;
    let shouldContinue = true;
    const canLoadAllPages = isPremium.value;

    while (shouldContinue) {
      const response = await getSymbols({
        ...filters,
        page,
        pageSize: weeklyFetchPageSize,
      });

      aggregatedResults.push(...response.results);
      hasMore = response.hasMore;

      if (!response.results.length || !hasMore) {
        shouldContinue = false;
        continue;
      }

      if (!canLoadAllPages) {
        shouldContinue = false;
        continue;
      }

      page += 1;
    }

    weeklyIdeas.value = aggregatedResults;
    weeklyIdeasHasMore.value = !canLoadAllPages && hasMore;
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      isPricingModalOpen.value = true;
    } else {
      console.error('Failed to fetch symbols', error);
      weeklyIdeas.value = [];
      weeklyIdeasHasMore.value = false;
      weeklyIdeasError.value = true;
    }
    return false;
  } finally {
    weeklyIdeasLoading.value = false;
  }
};

const fetchDailyBriefRows = async () => {
  dailyBriefLoading.value = true;
  dailyBriefError.value = false;
  try {
    const data = await getDailyBriefs();
    const todayEditionDate = formatDateInput(new Date());
    const rows = Array.isArray(data) ? data : [];
    dailyBriefEntries.value = rows
      .filter((row) => formatDateInput(row?.edition_date) === todayEditionDate)
      .sort((a, b) => {
        const rankA = Number(a?.rank);
        const rankB = Number(b?.rank);
        if (!Number.isNaN(rankA) && !Number.isNaN(rankB) && rankA !== rankB) {
          return rankA - rankB;
        }
        return String(a?.ticker ?? '').localeCompare(String(b?.ticker ?? ''), 'en-US');
      });
  } catch (error) {
    console.error('Failed to fetch daily briefs', error);
    dailyBriefEntries.value = [];
    dailyBriefError.value = true;
  } finally {
    dailyBriefLoading.value = false;
  }
};

watch(weeklyTotalPages, (value) => {
  if (weeklyCurrentPage.value > value) {
    weeklyCurrentPage.value = value;
  }
});

watch(
  dailyBriefRows,
  (rows) => {
    if (!rows.length) {
      heroTopThreeRow.value = null;
      return;
    }

    const randomIndex = Math.floor(Math.random() * rows.length);
    heroTopThreeRow.value = rows[randomIndex];
  },
  { immediate: true },
);

watch(filteredWeeklyIdeaGroups, (groups) => {
  const validGroupIds = new Set(groups.map((group) => group.id));
  expandedWheelGroups.value = Object.fromEntries(
    Object.entries(expandedWheelGroups.value).filter(([groupId, isExpanded]) => isExpanded && validGroupIds.has(groupId)),
  );
});

const handleAuthenticated = async () => {
  const shouldCompleteDailyBriefIntent = dailyBriefAuthIntent.value;
  currentPage.value = 'home';
  goToDashboard({ preserveDailyBriefIntent: shouldCompleteDailyBriefIntent });

  if (shouldCompleteDailyBriefIntent) {
    await completeDailyBriefIntent();
  }
};

const handleLogout = async () => {
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  isScreenerTabSelected.value = false;
  await auth.logout();
  clearDailyBriefAuthIntent();
  resetDailyBriefCtaFeedback();
  currentPage.value = 'home';
  navigateTo('/', { replace: true });
};

const shouldHandleClientNavigation = (event) =>
  event
  && !event.defaultPrevented
  && event.button === 0
  && !event.metaKey
  && !event.ctrlKey
  && !event.shiftKey
  && !event.altKey;

const handleNavigationLink = (event, navigate) => {
  if (!shouldHandleClientNavigation(event)) return;
  event.preventDefault();
  isMobileMenuOpen.value = false;
  closeAccountMenu();
  navigate();
};

const toggleMobileMenu = () => {
  closeAccountMenu();
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleAccountMenu = () => {
  isMobileMenuOpen.value = false;
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

const syncMobileMenu = () => {
  if (window.innerWidth > mobileNavBreakpoint) {
    isMobileMenuOpen.value = false;
  }
};

const handleDocumentPointerDown = (event) => {
  if (!isAccountMenuOpen.value) return;
  if (accountMenuRef.value?.contains(event.target)) return;
  closeAccountMenu();
};

const handleDocumentKeydown = (event) => {
  if (event.key === 'Escape') {
    closeAccountMenu();
    isMobileMenuOpen.value = false;
  }
};

const navigatePublicPath = (path) => {
  if (path === '/') {
    goHome();
    return;
  }

  if (path === '/login') {
    goToLogin();
    return;
  }

  if (path === '/sign-up') {
    goToSignUp();
    return;
  }

  if (path.startsWith('/sign-up?')) {
    isMobileMenuOpen.value = false;
    clearDailyBriefAuthIntent();
    resetDailyBriefCtaFeedback();
    navigateTo(path);
    return;
  }

  navigateTo(path);
};

const handleRouteLinkClick = (event, path) => {
  handleNavigationLink(event, () => navigatePublicPath(path));
};

const handleHomeLinkClick = (event) => {
  handleRouteLinkClick(event, '/');
};

const handleBrandLinkClick = (event) => {
  handleRouteLinkClick(event, brandHomePath.value);
};

const handleLoginLinkClick = (event) => {
  handleRouteLinkClick(event, '/login');
};

const handleSignUpLinkClick = (event) => {
  handleRouteLinkClick(event, '/sign-up');
};

const ensureMetaTag = (attribute, value) => {
  if (typeof document === 'undefined') return null;

  let tag = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  return tag;
};

const setMetaContent = (attribute, value, content) => {
  const tag = ensureMetaTag(attribute, value);
  if (!tag) return;
  tag.setAttribute('content', content);
};

const ensureCanonicalLink = () => {
  if (typeof document === 'undefined') return null;

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  return link;
};

const buildCanonicalUrl = (path) => `${siteUrl}${path === '/' ? '/' : path}`;

const clearRouteStructuredData = () => {
  if (typeof document === 'undefined') return;

  document.head
    .querySelectorAll('script[data-putpulse-route-jsonld="true"]')
    .forEach((scriptTag) => scriptTag.remove());
};

const setRouteStructuredData = (items) => {
  if (typeof document === 'undefined') return;

  clearRouteStructuredData();

  items.forEach((item) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.putpulseRouteJsonld = 'true';
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
};

const applySeoMetadata = () => {
  if (typeof document === 'undefined') return;

  const { title, description, robots, canonicalPath } = seoConfig.value;
  document.title = title;

  setMetaContent('name', 'description', description);
  setMetaContent('name', 'robots', robots);
  setMetaContent('property', 'og:type', 'website');
  setMetaContent('property', 'og:site_name', 'PutPulse');
  setMetaContent('property', 'og:title', title);
  setMetaContent('property', 'og:description', description);
  setMetaContent('property', 'og:url', buildCanonicalUrl(canonicalPath));
  setMetaContent('property', 'og:image', defaultSocialImageUrl);
  setMetaContent('name', 'twitter:card', 'summary');
  setMetaContent('name', 'twitter:title', title);
  setMetaContent('name', 'twitter:description', description);
  setMetaContent('name', 'twitter:image', defaultSocialImageUrl);

  const canonicalLink = ensureCanonicalLink();
  if (canonicalLink) {
    canonicalLink.setAttribute('href', buildCanonicalUrl(canonicalPath));
  }

  setRouteStructuredData(routeStructuredData.value);
};

onMounted(async () => {
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('resize', syncMobileMenu);
  document.addEventListener('pointerdown', handleDocumentPointerDown);
  document.addEventListener('keydown', handleDocumentKeydown);
  syncMobileMenu();
  syncRoute();
  await auth.initialize();
  fetchDailyBriefRows();
  fetchWeeklyIdeas();
});

onUnmounted(() => {
  window.removeEventListener('popstate', syncRoute);
  window.removeEventListener('resize', syncMobileMenu);
  document.removeEventListener('pointerdown', handleDocumentPointerDown);
  document.removeEventListener('keydown', handleDocumentKeydown);
  unlockAuthOverlayScroll();
});

watch([currentRoute, isAuthenticated, isAuthResolved], ([route, signedIn, authResolved]) => {
  if (!authResolved) return;

  if (route === '/dashboard' && !isStaffUser.value) {
    navigateTo('/', { replace: true });
    return;
  }

  if (signedIn) {
    auth.fetchDailyBriefSubscription().catch(() => {});
    auth.fetchPremiumSubscription().catch(() => {}).then(() => {
      try {
        if (!auth.isPremium.value && sessionStorage.getItem(PRO_INTENT_KEY)) {
          sessionStorage.removeItem(PRO_INTENT_KEY);
          isPricingModalOpen.value = true;
        }
      } catch { /* ignore storage errors */ }
    });
  }

  if (signedIn && authRoutes.has(route) && route !== '/verify-email') {
    void handleAuthenticated();
    return;
  }

  if (!signedIn && (route === '/profile' || route === '/settings')) {
    navigateTo('/login', { replace: true });
  }
}, { immediate: true });

watch(
  currentRoute,
  (route, previousRoute) => {
    if (authRoutes.has(route)) {
      if (!authRoutes.has(previousRoute)) {
        authBackdropRoute.value = sanitizeAuthBackdropRoute(previousRoute);
      }
      return;
    }

    authBackdropRoute.value = sanitizeAuthBackdropRoute(route);
  },
  { immediate: true },
);

watch(
  isAuthOverlayRoute,
  (isOpen) => {
    if (isOpen) {
      lockAuthOverlayScroll();
      return;
    }

    unlockAuthOverlayScroll();
  },
  { immediate: true },
);

watch([currentRoute, currentPage], () => {
  applySeoMetadata();
}, { immediate: true });

watch(
  () => auth.state.user,
  (user) => {
    if (!user) return;
    console.log('Current user type', {
      type: deriveUserType(user),
      is_staff: user.is_staff ?? null,
      is_superuser: user.is_superuser ?? null,
      is_active: user.is_active ?? null,
      username: user.username ?? null,
      email: user.email ?? null,
    });
  },
  { immediate: true },
);

watch(currentRoute, (route) => {
  closeAccountMenu();
  if (route !== '/' && route !== '/dashboard') {
    isScreenerTabSelected.value = false;
  }
});

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
const clampSteppedValue = (value, min, max, step) => {
  const clamped = clampValue(value, min, max);
  const snapped = Math.round((clamped - min) / step) * step + min;
  return Number(snapped.toFixed(2));
};

const onPriceMinChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMin = clampValue(Number.isNaN(rawValue) ? 0 : rawValue, 0, 500);
  const nextMax = Math.max(nextMin, priceRange.value[1]);
  priceRange.value = [nextMin, nextMax];
};

const onPriceMaxChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMax = clampValue(Number.isNaN(rawValue) ? 500 : rawValue, 0, 500);
  const nextMin = Math.min(priceRange.value[0], nextMax);
  priceRange.value = [nextMin, nextMax];
};

const onRsiMinChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMin = clampValue(Number.isNaN(rawValue) ? 0 : rawValue, 0, 100);
  const nextMax = Math.max(nextMin, rsiRange.value[1]);
  rsiRange.value = [nextMin, nextMax];
};

const onRsiMaxChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMax = clampValue(Number.isNaN(rawValue) ? 100 : rawValue, 0, 100);
  const nextMin = Math.min(rsiRange.value[0], nextMax);
  rsiRange.value = [nextMin, nextMax];
};

const onDeltaMinChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMin = clampSteppedValue(
    Number.isNaN(rawValue) ? deltaBounds.min : rawValue,
    deltaBounds.min,
    deltaBounds.max,
    deltaBounds.step,
  );
  const nextMax = Math.max(nextMin, deltaRange.value[1]);
  deltaRange.value = [nextMin, nextMax];
};

const onDeltaMaxChange = (event) => {
  const rawValue = Number(event.target.value);
  const nextMax = clampSteppedValue(
    Number.isNaN(rawValue) ? deltaBounds.max : rawValue,
    deltaBounds.min,
    deltaBounds.max,
    deltaBounds.step,
  );
  const nextMin = Math.min(deltaRange.value[0], nextMax);
  deltaRange.value = [nextMin, nextMax];
};

const onMinRoiChange = (event) => {
  minRoi.value = event.target.value;
};

const onMaxSpreadChange = (event) => {
  maxSpread.value = event.target.value;
};

const onTvFilterChange = (event) => {
  tvFilter.value = event.target.value;
};

const onMinScoreChange = (event) => {
  minScore.value = event.target.value;
};

const applyFilters = async () => {
  weeklyCurrentPage.value = 1;
  const success = await fetchWeeklyIdeas(buildCurrentFilters());
  if (success) {
    appliedMinRoi.value = minRoi.value;
    appliedMaxSpread.value = maxSpread.value;
    appliedTvFilter.value = tvFilter.value;
    appliedMinScore.value = minScore.value;
    appliedDeltaRange.value = [...deltaRange.value];
  }
};

const handleCheckoutSuccess = async () => {
  await ensurePremiumStatusLoaded({ force: true });
  await fetchWeeklyIdeas(buildCurrentFilters());
};

const resetFilters = () => {
  priceRange.value = [0, 500];
  rsiRange.value = [0, 100];
  deltaRange.value = [...defaultDeltaRange];
  appliedDeltaRange.value = [...defaultDeltaRange];
  minRoi.value = '2';
  appliedMinRoi.value = '2';
  maxSpread.value = '';
  appliedMaxSpread.value = '';
  tvFilter.value = 'neutral';
  appliedTvFilter.value = 'neutral';
  minScore.value = '75';
  appliedMinScore.value = '75';
  weeklyCurrentPage.value = 1;
  fetchWeeklyIdeas(buildCurrentFilters());
};

const buildTradingViewSymbol = (ticker) => {
  if (!ticker) return '';
  return ticker.trim();
};

const buildTradingViewSymbolPageLink = (ticker) => {
  if (!ticker) return '';
  const cleaned = ticker.trim();
  const normalized = cleaned.includes(':') ? cleaned.replace(':', '-') : cleaned;
  return `https://www.tradingview.com/symbols/${normalized}/`;
};

const renderSymbolOverviewWidget = () => {
  if (!symbolOverviewContainer.value || !activeTicker.value) return;
  symbolOverviewContainer.value.innerHTML = '';
  const timeframeConfigMap = {
    '1D': { symbolRange: '1d', dateRanges: ['1d|1'] },
    '1M': { symbolRange: '1m', dateRanges: ['1m|30'] },
    '3M': { symbolRange: '3m', dateRanges: ['3m|60'] },
    '1Y': { symbolRange: '12m', dateRanges: ['12m|1D'] },
    '5Y': { symbolRange: '60m', dateRanges: ['60m|1W'] },
    All: { symbolRange: 'all', dateRanges: ['all|1M'] },
  };
  const timeframeConfig = timeframeConfigMap[overviewTimeframe.value] ?? timeframeConfigMap['1Y'];
  const container = document.createElement('div');
  container.className = 'tradingview-widget-container tradingview-widget-container--symbol-overview';

  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';

  const link = document.createElement('a');
  link.href = buildTradingViewSymbolPageLink(activeTicker.value);
  link.rel = 'noopener nofollow';
  link.target = '_blank';

  const linkText = document.createElement('span');
  linkText.className = 'blue-text';
  linkText.textContent = `${activeTicker.value} stock price`;

  const trademark = document.createElement('span');
  trademark.className = 'trademark';
  trademark.textContent = ' by TradingView';

  link.appendChild(linkText);
  copyright.append(link, trademark);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
  script.async = true;
  script.textContent = JSON.stringify({
    lineWidth: 2,
    lineType: 0,
    chartType: 'area',
    fontColor: 'rgb(106, 109, 120)',
    gridLineColor: 'rgba(242, 242, 242, 0.06)',
    volumeUpColor: 'rgba(34, 171, 148, 0.5)',
    volumeDownColor: 'rgba(247, 82, 95, 0.5)',
    backgroundColor: '#0d1117',
    widgetFontColor: '#DBDBDB',
    upColor: '#22ab94',
    downColor: '#f7525f',
    borderUpColor: '#22ab94',
    borderDownColor: '#f7525f',
    wickUpColor: '#22ab94',
    wickDownColor: '#f7525f',
    colorTheme: 'dark',
    isTransparent: false,
    locale: 'en',
    chartOnly: false,
    scalePosition: 'right',
    scaleMode: 'Normal',
    fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
    valuesTracking: '1',
    changeMode: 'price-and-percent',
    symbols: [[activeTicker.value, `${buildTradingViewSymbol(activeTicker.value)}|${timeframeConfig.symbolRange}`]],
    dateRanges: timeframeConfig.dateRanges,
    fontSize: '10',
    headerFontSize: 'medium',
    autosize: true,
    width: '100%',
    height: 300,
    noTimeScale: false,
    hideDateRanges: false,
    showMA: true,
    maLength: 9,
    maLineColor: 'rgba(255, 238, 88, 1)',
    maLineWidth: 1,
    hideMarketStatus: false,
    hideSymbolLogo: false,
  });

  container.append(widget, copyright, script);
  symbolOverviewContainer.value.appendChild(container);
};

const renderSymbolProfileWidget = () => {
  if (!symbolProfileContainer.value || !activeTicker.value) return;
  symbolProfileContainer.value.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'tradingview-widget-container tradingview-widget-container--symbol-profile';

  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';

  const link = document.createElement('a');
  link.href = buildTradingViewSymbolPageLink(activeTicker.value);
  link.rel = 'noopener nofollow';
  link.target = '_blank';

  const linkText = document.createElement('span');
  linkText.className = 'blue-text';
  linkText.textContent = `${activeTicker.value} profile`;

  const trademark = document.createElement('span');
  trademark.className = 'trademark';
  trademark.textContent = ' by TradingView';

  link.appendChild(linkText);
  copyright.append(link, trademark);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
  script.async = true;
  script.textContent = JSON.stringify({
    colorTheme: 'dark',
    backgroundColor: 'rgba(1, 2, 4, 0.95)',
    isTransparent: false,
    symbol: buildTradingViewSymbol(activeTicker.value),
    width: 400,
    height: 450,
  });

  container.append(widget, copyright, script);
  symbolProfileContainer.value.appendChild(container);
};

const renderModalCharts = () => {
  renderSymbolOverviewWidget();
  renderSymbolProfileWidget();
};

const openTicker = (ticker) => {
  overviewTimeframe.value = '1Y';
  activeTicker.value = ticker;
  isModalOpen.value = true;
};

const openWheelGuide = () => {
  isWheelGuideOpen.value = true;
};

const closeWheelGuide = () => {
  isWheelGuideOpen.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
  activeTicker.value = '';
};

watch(isModalOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
}, { immediate: true });

watch(
  [isModalOpen, activeTicker, overviewTimeframe],
  ([isOpen, ticker, timeframe], [wasOpen, previousTicker, previousTimeframe]) => {
    if (!isOpen || !ticker) return;
    if (isOpen === wasOpen && ticker === previousTicker && timeframe === previousTimeframe) return;
    nextTick(() => {
      if (!isModalOpen.value || !activeTicker.value) return;
      renderModalCharts();
    });
  },
  { flush: 'post' },
);
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}

.page {
  transition: filter 220ms ease, transform 220ms ease;
  transform-origin: center top;
}

.page--auth-overlay {
  filter: blur(18px);
  transform: scale(1.01);
  pointer-events: none;
  user-select: none;
}

.auth-overlay-fade-enter-active,
.auth-overlay-fade-leave-active {
  transition: opacity 180ms ease;
}

.auth-overlay-fade-enter-from,
.auth-overlay-fade-leave-to {
  opacity: 0;
}
</style>


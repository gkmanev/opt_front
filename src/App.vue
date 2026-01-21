<template>
  <div class="page">
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">
          <span class="status-dot"></span>
          <div>
            <span class="brand-name">OptionFlow</span>
            <span class="brand-meta">Updated in real-time • Last sync 10s ago</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" type="button">Strategy Library</button>
          <button class="btn btn-primary" type="button">View Live Candidates</button>
        </div>
      </div>
    </header>

    <section class="container hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="pill">CASH FLOW SYSTEM • PUT STRATEGIES</span>
          <h1>Get paid to buy great companies</h1>
          <p class="hero-highlight">
            Data-driven put-selling ideas on stocks you'd be comfortable owning
          </p>
          <p class="hero-subtitle">
            Find high-quality stocks with liquid options, strong fundamentals, and attractive
            premium—all assignment is a feature, not a bug.
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
              <span><strong>+34%</strong> Avg. Put ROI 12m</span>
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
              <span><strong>NFT</strong> Premium <strong>$373.60</strong></span>
            </div>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button">
              <span class="icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              View Live Candidates
            </button>
            <button class="btn btn-outline" type="button">See How It Works</button>
          </div>
        </div>

        <div class="strategy-card">
          <div class="strategy-header">
            <span class="strategy-eyebrow">THE STRATEGY POST</span>
            <button class="icon-button" type="button" @click="expandedStrategy = !expandedStrategy">
              <svg
                class="chevron"
                :class="{ expanded: expandedStrategy }"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
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
                <div class="audience-title">Investors seeking income</div>
                <div class="audience-text">Generate monthly income from selling puts</div>
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
                <div class="audience-title">Happy to own the underlying</div>
                <div class="audience-text">If assigned at strike price</div>
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
                <div class="audience-title">Disciplined workflow seekers</div>
                <div class="audience-text">Get assigned, sell covered calls</div>
              </div>
            </div>
          </div>

          <div v-if="expandedStrategy" class="strategy-footer">
            <button class="btn btn-muted" type="button">See Daily Brief</button>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="card">
        <div class="card-header">
          <span class="section-eyebrow">SCREENER CASHFLOW</span>
          <h2>Income Engine: Sell Puts — Wheel If Assigned</h2>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-label">Strategy Focus</div>
            <div class="info-value">Strong Buy fundamentals + high options volume</div>
          </div>
          <div class="info-card">
            <div class="info-label">Monthly Target</div>
            <div class="info-value">+2% monthly ROI at ~0.3% delta puts</div>
          </div>
          <div class="info-card">
            <div class="info-label">Assignment Strategy</div>
            <div class="info-value">Assignment OK: 20%+ long stocks of pleasure</div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticker</th>
                <th class="align-right">Price</th>
                <th class="align-right">ROI</th>
                <th class="align-right">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in incomeRows" :key="row.ticker">
                <td class="ticker">{{ row.ticker }}</td>
                <td class="align-right">{{ row.price }}</td>
                <td class="align-right">
                  <span class="roi-positive">{{ row.roi }}</span>
                </td>
                <td class="align-right muted">{{ row.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button class="btn btn-outline btn-block" type="button">Explore Top Puts</button>
      </div>
    </section>

    <section class="container kpi-grid">
      <div class="card kpi-card">
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
          <div>
            <span class="section-eyebrow">PUT COMPONENTS</span>
            <h3>58 Today</h3>
          </div>
        </div>
        <div class="kpi-row">
          <span class="muted">Earning rated puts</span>
          <span class="highlight">Live</span>
        </div>
      </div>

      <div class="card kpi-card">
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
          <div>
            <span class="section-eyebrow">PAY-OUT RATE</span>
            <h3>2.87% Monthly</h3>
          </div>
        </div>
        <div class="kpi-row">
          <span class="muted">Weighted ideal 30-day</span>
          <span class="highlight roi-positive">Rolling weekly</span>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="card">
        <div class="card-header split">
          <div>
            <span class="section-eyebrow">PREMIUM SCREENED PUT</span>
            <h2>Top 3 Today</h2>
          </div>
          <span class="badge">Strong Buy</span>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Expiration Date</th>
                <th class="align-right">Price</th>
                <th class="align-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in topThreeRows" :key="row.ticker">
                <td class="ticker">{{ row.ticker }}</td>
                <td class="muted">{{ row.date }}</td>
                <td class="align-right">{{ row.price }}</td>
                <td class="align-right roi-positive">{{ row.roi }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-footer">
          <button class="btn btn-muted" type="button">Fundamentals: Strong Buy</button>
          <button class="btn btn-outline" type="button">Full Screener →</button>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="card">
        <div class="card-header">
          <h2>Weekly Options Ideas</h2>
          <p class="muted">Screened options from our selected filter feed</p>
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

          <div class="filter-grid">
            <div>
              <label class="filter-label">Price range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</label>
              <input
                type="range"
                min="0"
                max="500"
                :value="priceRange[1]"
                class="slider"
                @input="onPriceRange"
              />
              <div class="filter-scale">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
            <div>
              <label class="filter-label">ROI range: {{ roiRange[0] }}% - {{ roiRange[1] }}%</label>
              <input
                type="range"
                min="0"
                max="100"
                :value="roiRange[1]"
                class="slider"
                @input="onRoiRange"
              />
              <div class="filter-scale">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label class="filter-label">Max Risk/Reward</label>
              <select class="select">
                <option>Any R/R</option>
                <option>Conservative (1:2)</option>
                <option>Moderate (1:3)</option>
                <option>Aggressive (1:4+)</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Peak of weakness</label>
              <select class="select">
                <option>Any</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn btn-primary btn-block" type="button">Apply Filters</button>
            <button class="btn btn-muted" type="button">Reset</button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Market</th>
                <th>Details</th>
                <th class="align-right">Exp Date</th>
                <th class="align-right">Price</th>
                <th class="align-right">Delta</th>
                <th class="align-right">ROI</th>
                <th class="align-right">ROI 1</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in weeklyIdeas" :key="row.ticker">
                <td class="ticker">{{ row.ticker }}</td>
                <td>
                  <button class="link-button" type="button">{{ row.details }}</button>
                </td>
                <td class="align-right muted">{{ row.date }}</td>
                <td class="align-right">{{ row.price }}</td>
                <td class="align-right" :class="row.delta === '—' ? 'muted' : row.positive ? 'roi-positive' : 'roi-negative'">
                  {{ row.delta }}
                </td>
                <td class="align-right roi-primary">{{ row.roi }}</td>
                <td
                  class="align-right"
                  :class="row.roi1 === '—' ? 'muted' : row.positive ? 'roi-positive' : 'roi-negative'"
                >
                  {{ row.roi1 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span class="muted">Showing 1-6 of 38</span>
          <div class="pagination">
            <button class="btn btn-muted" type="button">Previous</button>
            <button class="btn btn-muted" type="button">1 / 8</button>
            <button class="btn btn-primary" type="button">Next</button>
          </div>
        </div>

        <button class="btn btn-muted btn-block" type="button">Export Results</button>
      </div>
    </section>

    <section class="container cta">
      <div class="cta-card">
        <h2>Ready to start generating income?</h2>
        <p>
          Join thousands of investors using data-driven strategies to sell puts on quality
          companies
        </p>
        <div class="cta-actions">
          <button class="btn btn-primary" type="button">Get Started Today</button>
          <button class="btn btn-outline" type="button">Learn More</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const priceRange = ref([0, 500]);
const roiRange = ref([0, 100]);
const expandedStrategy = ref(false);

const incomeRows = [
  { ticker: 'SMG', price: '$67.45', roi: '6.85%', date: 'Feb 16, 2026' },
  { ticker: 'RCI', price: '$21.10', roi: '5.61%', date: 'Feb 28, 2026' },
  { ticker: 'ALAB', price: '$160.09', roi: '6.22%', date: 'Feb 28, 2026' },
];

const topThreeRows = [
  { ticker: 'SMG', date: 'Feb 16, 2026', price: '$67.45', roi: '6.85%' },
  { ticker: 'RCI', date: 'Feb 28, 2026', price: '$21.10', roi: '5.61%' },
  { ticker: 'ALAB', date: 'Feb 28, 2026', price: '$160.09', roi: '6.22%' },
];

const weeklyIdeas = [
  {
    ticker: 'AA',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '60.07',
    delta: '-0.21%',
    roi: '$7.01',
    roi1: '3.83%',
    positive: true,
  },
  {
    ticker: 'AAL',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '15.71',
    delta: '—',
    roi: '$1.01',
    roi1: '—',
    positive: false,
  },
  {
    ticker: 'AEM',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '107.48',
    delta: '-0.21%',
    roi: '$8.51',
    roi1: '2.62%',
    positive: true,
  },
  {
    ticker: 'AG',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '21.5',
    delta: '-0.28%',
    roi: '$2.21',
    roi1: '-0.61%',
    positive: false,
  },
  {
    ticker: 'ALAB',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '182',
    delta: '-0.21%',
    roi: '$8.47',
    roi1: '6.22%',
    positive: true,
  },
  {
    ticker: 'AMRT',
    details: 'Details',
    date: 'Feb 28, 2026',
    price: '129.83',
    delta: '-0.28%',
    roi: '$2.42',
    roi1: '3.98%',
    positive: true,
  },
];

const onPriceRange = (event) => {
  priceRange.value = [0, Number(event.target.value)];
};

const onRoiRange = (event) => {
  roiRange.value = [0, Number(event.target.value)];
};
</script>

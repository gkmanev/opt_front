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
              <label class="filter-label">ROI</label>
              <select class="select" :value="minRoi" @change="onMinRoiChange">
                <option value="">Any ROI</option>
                <option value="2">&gt; 2%</option>
                <option value="2.5">&gt; 2.5%</option>
                <option value="3">&gt; 3%</option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn btn-primary btn-block" type="button" @click="applyFilters">
              Apply Filters
            </button>
            <button class="btn btn-muted" type="button" @click="resetFilters">Reset</button>
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
                <th class="align-right">Bid/Ask</th>
                <th class="align-right">Delta</th>
                <th class="align-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="weeklyIdeasLoading">
                <td class="muted" colspan="7">Loading weekly ideas...</td>
              </tr>
              <tr v-else-if="weeklyIdeasError">
                <td class="muted" colspan="7">Unable to load weekly ideas. Please try again.</td>
              </tr>
              <tr v-else-if="!weeklyIdeaRows.length">
                <td class="muted" colspan="7">No weekly ideas available.</td>
              </tr>
              <template v-else>
                <tr v-for="row in paginatedWeeklyIdeas" :key="row.id">
                  <td class="ticker">{{ row.ticker }}</td>
                  <td>
                    <button
                      class="link-button"
                      type="button"
                      :disabled="!row.ticker"
                      @click="openTicker(row.ticker)"
                    >
                      {{ row.details }}
                    </button>
                  </td>
                  <td class="align-right muted">{{ row.date }}</td>
                  <td class="align-right">{{ row.price }}</td>
                  <td class="align-right">{{ row.bidAsk }}</td>
                  <td
                    class="align-right"
                    :class="row.delta === '—' ? 'muted' : row.positive ? 'roi-positive' : 'roi-negative'"
                  >
                    {{ row.delta }}
                  </td>
                  <td class="align-right roi-primary">{{ row.roi }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span class="muted"
            >Showing {{ weeklyPageStart }}-{{ weeklyPageEnd }} of {{ weeklyIdeaRows.length }}</span
          >
          <div class="pagination">
            <button
              class="btn btn-muted"
              type="button"
              :disabled="weeklyCurrentPage === 1 || !weeklyIdeaRows.length"
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
              :disabled="weeklyCurrentPage === weeklyTotalPages || !weeklyIdeaRows.length"
              @click="goToWeeklyPage(weeklyCurrentPage + 1)"
            >
              Next
            </button>
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

    <teleport to="body">
      <transition name="ticker-panel">
        <div v-if="isModalOpen" class="ticker-panel-backdrop" @click.self="closeModal">
          <aside class="ticker-panel" aria-label="Ticker details">
            <header class="ticker-panel-header">
              <div>
                <p class="section-eyebrow">Ticker overview</p>
                <h3>{{ activeTicker }}</h3>
                <p class="ticker-panel-subtitle">
                  TradingView charts, sentiment, and key metrics at a glance.
                </p>
              </div>
              <button class="btn btn-muted" type="button" @click="closeModal">Close</button>
            </header>
            <div class="ticker-panel-body">
              <div class="ticker-panel-grid">
                <section class="ticker-panel-card">
                  <p class="panel-label">Technical analysis</p>
                  <div ref="widgetContainer" class="tradingview-wrapper"></div>
                </section>
                <section class="ticker-panel-card">
                  <p class="panel-label">Symbol overview</p>
                  <div ref="symbolOverviewContainer" class="tradingview-wrapper"></div>
                </section>
                <section class="ticker-panel-card">
                  <p class="panel-label">Key facts</p>
                  <div ref="symbolProfileContainer" class="tradingview-wrapper"></div>
                </section>
              </div>
            </div>
            <div class="ticker-panel-footer">
              <span class="muted">Earning rated puts</span>
              <span class="highlight">Live</span>
            </div>
          </aside>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { getInvestments } from './api/investingApi';

const priceRange = ref([0, 500]);
const rsiRange = ref([0, 100]);
const minRoi = ref('');
const expandedStrategy = ref(false);
const isModalOpen = ref(false);
const activeTicker = ref('');
const widgetContainer = ref(null);
const symbolOverviewContainer = ref(null);
const symbolProfileContainer = ref(null);

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

const weeklyIdeas = ref([]);
const weeklyIdeasLoading = ref(false);
const weeklyIdeasError = ref(false);

const weeklyPageSize = 6;
const weeklyCurrentPage = ref(1);

const weeklyTotalPages = computed(() =>
  Math.max(1, Math.ceil(weeklyIdeaRows.value.length / weeklyPageSize)),
);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number)}%`;
};

const weeklyIdeaRows = computed(() =>
  weeklyIdeas.value.map((idea) => {
    const deltaValue = Number(idea.delta);
    const roiValue = Number(idea.roi);
    return {
      id: `${idea.ticker ?? 'unknown'}-${idea.exp_date ?? idea.expiration_date ?? idea.expDate ?? ''}-${idea.strike ?? ''}`,
      ticker: idea.ticker ?? '—',
      details: idea.ticker ? 'Details' : '—',
      date: formatDate(idea.exp_date ?? idea.expiration_date ?? idea.expDate),
      price: formatNumber(idea.price),
      bidAsk: formatNumber(idea.bid_ask_spread),
      delta: formatPercent(idea.delta),
      roi: formatPercent(idea.roi),
      positive: (!Number.isNaN(deltaValue) && deltaValue >= 0) || (!Number.isNaN(roiValue) && roiValue >= 0),
    };
  }),
);

const paginatedWeeklyIdeas = computed(() => {
  const start = (weeklyCurrentPage.value - 1) * weeklyPageSize;
  return weeklyIdeaRows.value.slice(start, start + weeklyPageSize);
});

const weeklyPageStart = computed(() =>
  weeklyIdeaRows.value.length ? (weeklyCurrentPage.value - 1) * weeklyPageSize + 1 : 0,
);

const weeklyPageEnd = computed(() =>
  Math.min(weeklyCurrentPage.value * weeklyPageSize, weeklyIdeaRows.value.length),
);

const goToWeeklyPage = (page) => {
  const next = Math.min(Math.max(page, 1), weeklyTotalPages.value);
  weeklyCurrentPage.value = next;
};

const fetchWeeklyIdeas = async (filters = {}) => {
  weeklyIdeasLoading.value = true;
  weeklyIdeasError.value = false;
  try {
    weeklyIdeas.value = await getInvestments(filters);
  } catch (error) {
    console.error('Failed to fetch weekly ideas', error);
    weeklyIdeas.value = [];
    weeklyIdeasError.value = true;
  } finally {
    weeklyIdeasLoading.value = false;
  }
};

watch(weeklyTotalPages, (value) => {
  if (weeklyCurrentPage.value > value) {
    weeklyCurrentPage.value = value;
  }
});

onMounted(() => {
  fetchWeeklyIdeas();
});

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

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

const onMinRoiChange = (event) => {
  minRoi.value = event.target.value;
};

const applyFilters = () => {
  const minRoiValue = minRoi.value === '' ? null : Number(minRoi.value);
  fetchWeeklyIdeas({
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
    minRsi: rsiRange.value[0],
    maxRsi: rsiRange.value[1],
    minRoi: Number.isNaN(minRoiValue) ? null : minRoiValue,
  });
};

const resetFilters = () => {
  priceRange.value = [0, 500];
  rsiRange.value = [0, 100];
  minRoi.value = '';
  fetchWeeklyIdeas();
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

const buildTradingViewTechnicalLink = (ticker) => {
  if (!ticker) return '';
  const cleaned = ticker.trim();
  const normalized = cleaned.includes(':') ? cleaned.replace(':', '-') : cleaned;
  return `https://www.tradingview.com/symbols/${normalized}/technicals/`;
};

const renderWidget = () => {
  if (!widgetContainer.value || !activeTicker.value) return;
  widgetContainer.value.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'tradingview-widget-container tradingview-widget-container--technical';

  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';

  const link = document.createElement('a');
  link.href = buildTradingViewTechnicalLink(activeTicker.value);
  link.rel = 'noopener nofollow';
  link.target = '_blank';

  const linkText = document.createElement('span');
  linkText.className = 'blue-text';
  linkText.textContent = `${activeTicker.value} stock analysis`;

  const trademark = document.createElement('span');
  trademark.className = 'trademark';
  trademark.textContent = ' by TradingView';

  link.appendChild(linkText);
  copyright.append(link, trademark);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
  script.async = true;
  script.textContent = JSON.stringify({
    colorTheme: 'dark',
    interval: '1M',
    symbol: buildTradingViewSymbol(activeTicker.value),
  });

  container.append(widget, copyright, script);
  widgetContainer.value.appendChild(container);
};

const renderSymbolOverviewWidget = () => {
  if (!symbolOverviewContainer.value || !activeTicker.value) return;
  symbolOverviewContainer.value.innerHTML = '';
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
    backgroundColor: 'rgba(15, 23, 42, 1)',
    widgetFontColor: '#e2e8f0',
    colorTheme: 'dark',
    isTransparent: false,
    locale: 'en',
    symbols: [[activeTicker.value, `${buildTradingViewSymbol(activeTicker.value)}|1D`]],
    width: '100%',
    height: '100%',
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
    isTransparent: false,
    symbol: buildTradingViewSymbol(activeTicker.value),
    width: '100%',
    height: '100%',
  });

  container.append(widget, copyright, script);
  symbolProfileContainer.value.appendChild(container);
};

const renderModalCharts = () => {
  renderWidget();
  renderSymbolOverviewWidget();
  renderSymbolProfileWidget();
};

const openTicker = (ticker) => {
  activeTicker.value = ticker;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  activeTicker.value = '';
};

watch(
  [isModalOpen, activeTicker],
  ([isOpen, ticker], [wasOpen, previousTicker]) => {
    if (!isOpen || !ticker) return;
    if (isOpen === wasOpen && ticker === previousTicker) return;
    nextTick(() => {
      if (!isModalOpen.value || !activeTicker.value) return;
      renderModalCharts();
    });
  },
  { flush: 'post' },
);
</script>

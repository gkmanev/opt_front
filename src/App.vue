<template>
  <div class="app">
    <header class="hero hero--options">
      <nav class="nav">
        <div class="logo">
          <span class="pulse"></span>
          <div>
            <p>OptionsFlow</p>
            <small>Connected to {{ apiBaseUrl }}</small>
          </div>
        </div>
        <div class="actions">
          <button class="ghost" type="button">Strategy Library</button>
          <button class="primary" type="button" @click="refresh">View Live Candidates</button>
        </div>
      </nav>
      <div class="hero-body">
        <div>
          <p class="eyebrow">Wheel + LEAP Screeners</p>
          <h1>Generate Monthly Options Income + Long-Term Growth from Blue-Chip Quality Stocks</h1>
          <p class="lead">
            Our screeners spot cash-secured puts (&gt;2% monthly ROI on Strong Buy fundamentals)
            and LEAP calls (70-75 delta, 1+ year) for wheel &amp; growth.
          </p>
          <div class="hero-actions">
            <button class="primary" type="button">View Live Candidates</button>
            <button class="ghost" type="button">See How It Works</button>
          </div>
          <div class="ticker-preview">
            <span class="ticker-dot"></span>
            <span>AAPL - Put ROI 2.4%</span>
            <span class="divider">|</span>
            <span>MSFT - LEAP Upside 32%</span>
          </div>
        </div>
        <div class="hero-card">
          <div class="glow"></div>
          <p class="eyebrow">Live Strategy Pulse</p>
          <h3>Income &amp; Growth mix is trending higher</h3>
          <p class="subtle">
            Put candidates are holding above 2.1% ROI with bullish fundamentals while LEAP
            upside targets remain above 25%.
          </p>
          <div class="pill-row">
            <span class="pill">Strong Buy Bias</span>
            <span class="pill">High Options Volume</span>
            <span class="pill">Delta 0.70+</span>
          </div>
          <button class="ghost" type="button">See Daily Brief</button>
        </div>
      </div>
    </header>

    <main>
      <section class="screener-preview">
        <header class="section-header">
          <div>
            <p class="eyebrow">Screener Cards Preview</p>
            <h2>Two engines. One disciplined options workflow.</h2>
          </div>
        </header>
        <div class="screener-grid">
          <article class="card screener-card">
            <div class="card-icon">💰</div>
            <h3>Income Engine: Sell Puts → Wheel If Assigned</h3>
            <ul class="feature-list">
              <li>Strong Buy fundamentals + high options volume</li>
              <li>&gt;2% monthly ROI at -0.35 delta puts</li>
              <li>Assignment OK: Own great stocks at discount</li>
            </ul>
            <div class="table-snippet">
              <div class="table-row table-head">
                <span>Ticker</span>
                <span>Fund.</span>
                <span>Put ROI</span>
                <span>Breakeven</span>
              </div>
              <div class="table-row" v-for="row in putPreview" :key="row.ticker">
                <span>{{ row.ticker }}</span>
                <span>{{ row.fund }}</span>
                <span>{{ row.roi }}</span>
                <span>{{ row.breakeven }}</span>
              </div>
            </div>
            <button class="primary" type="button">Explore Top Puts</button>
          </article>

          <article class="card screener-card">
            <div class="card-icon">🚀</div>
            <h3>Growth Engine: LEAP Calls for Upside</h3>
            <ul class="feature-list">
              <li>Growth picks with solid due diligence</li>
              <li>70-75 delta, ≥1yr expiry leverage</li>
              <li>Less capital than 100 shares</li>
            </ul>
            <div class="table-snippet">
              <div class="table-row table-head">
                <span>Ticker</span>
                <span>Delta</span>
                <span>Upside</span>
                <span>Expiry</span>
              </div>
              <div class="table-row" v-for="row in leapPreview" :key="row.ticker">
                <span>{{ row.ticker }}</span>
                <span>{{ row.delta }}</span>
                <span>{{ row.upside }}</span>
                <span>{{ row.expiry }}</span>
              </div>
            </div>
            <button class="primary" type="button">Explore Top LEAPs</button>
          </article>
        </div>
      </section>

      <section class="kpi-strip" aria-label="Key performance indicators">
        <article v-for="kpi in kpiCards" :key="kpi.label" class="card kpi-card">
          <p class="eyebrow">{{ kpi.label }}</p>
          <h3>{{ kpi.value }}</h3>
          <p class="subtle">{{ kpi.subtext }}</p>
          <div class="kpi-meta" :class="kpi.trendClass">
            <span>{{ kpi.trend }}</span>
            <span class="sparkline">{{ kpi.sparkline }}</span>
          </div>
        </article>
      </section>

      <section class="dashboard-cards">
        <article class="card dashboard-card">
          <header>
            <div>
              <p class="eyebrow">Income (Puts/Wheel)</p>
              <h3>Top 3 Today</h3>
            </div>
            <span class="badge">Strong Buy</span>
          </header>
          <div class="table-snippet">
            <div class="table-row table-head">
              <span>Ticker</span>
              <span>ROI</span>
              <span>Breakeven</span>
            </div>
            <div class="table-row" v-for="row in topIncome" :key="row.ticker">
              <span>{{ row.ticker }}</span>
              <span>{{ row.roi }}</span>
              <span>{{ row.breakeven }}</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="badge">Fundamentals: Strong Buy</span>
            <button class="ghost" type="button">→ Full Screener</button>
          </div>
        </article>

        <article class="card dashboard-card">
          <header>
            <div>
              <p class="eyebrow">Growth (LEAP Calls)</p>
              <h3>Top 3 Today</h3>
            </div>
            <span class="badge">Jan'27+</span>
          </header>
          <div class="table-snippet">
            <div class="table-row table-head">
              <span>Ticker</span>
              <span>Delta</span>
              <span>Upside</span>
            </div>
            <div class="table-row" v-for="row in topGrowth" :key="row.ticker">
              <span>{{ row.ticker }}</span>
              <span>{{ row.delta }}</span>
              <span>{{ row.upside }}</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="badge">Expiry: Jan'27+</span>
            <button class="ghost" type="button">→ Full Screener</button>
          </div>
        </article>
      </section>

      <div v-if="loading" class="card loading">
        <p>Syncing with your options API…</p>
      </div>
      <div v-else>
        <div v-if="error" class="card warning">
          <p>{{ error }}</p>
          <p class="subtle">Showing latest cached insights so the dashboard remains usable.</p>
        </div>

        <InvestmentsTable
          :investments="investments"
          :min-price="minPrice"
          :max-price="maxPrice"
          :min-rsi="minRsi"
          :max-rsi="maxRsi"
          :min-roi="minRoi"
          :min-delta="minDelta"
          :screener-type="screenerType"
          @update:min-price="minPrice = $event"
          @update:max-price="maxPrice = $event"
          @update:min-rsi="minRsi = $event"
          @update:max-rsi="maxRsi = $event"
          @update:min-roi="minRoi = $event"
          @update:min-delta="minDelta = $event"
          @update:screener-type="screenerType = $event"
          @select-ticker="openTicker"
        />
      </div>
    </main>

    <teleport to="body">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <p class="eyebrow">Ticker overview</p>
              <h3>{{ activeTicker }}</h3>
            </div>
            <button class="ghost" type="button" @click="closeModal">Close</button>
          </header>
          <div class="modal-body">
            <div class="modal-grid">
              <section class="modal-panel">
                <p class="panel-label">Technical analysis</p>
                <div ref="widgetContainer" class="tradingview-wrapper"></div>
              </section>
              <section class="modal-panel">
                <p class="panel-label">Symbol overview</p>
                <div ref="symbolOverviewContainer" class="tradingview-wrapper"></div>
              </section>
              <section class="modal-panel">
                <p class="panel-label">Key facts</p>
                <div ref="symbolProfileContainer" class="tradingview-wrapper"></div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { apiBaseUrl, getWeeklyInvestments } from './api/investingApi';
import InvestmentsTable from './components/InvestmentsTable.vue';

const loading = ref(true);
const error = ref('');
const investments = ref([]);
const minPrice = ref(0);
const maxPrice = ref(200);
const minRsi = ref(0);
const maxRsi = ref(100);
const minRoi = ref(null);
const minDelta = ref(null);
const maxDelta = ref(null);
const screenerType = ref('Stocks by Quant');
const isModalOpen = ref(false);
const activeTicker = ref('');
const widgetContainer = ref(null);
const symbolOverviewContainer = ref(null);
const symbolProfileContainer = ref(null);

const putPreview = ref([
  { ticker: 'KO', fund: 'SBuy', roi: '2.3%', breakeven: '$58.20' },
  { ticker: 'PG', fund: 'Buy', roi: '2.1%', breakeven: '$142.50' },
  { ticker: 'JNJ', fund: 'SBuy', roi: '2.4%', breakeven: '$145.00' },
]);

const leapPreview = ref([
  { ticker: 'AAPL', delta: '0.72', upside: '28%', expiry: "Jan'27" },
  { ticker: 'MSFT', delta: '0.71', upside: '32%', expiry: "Dec'27" },
  { ticker: 'NVDA', delta: '0.73', upside: '25%', expiry: "Jan'27" },
]);

const kpiCards = ref([
  {
    label: 'Put Candidates',
    value: '12 Today',
    subtext: 'Cash-secured puts',
    trend: '+2 new',
    sparkline: '▲',
    trendClass: 'positive',
  },
  {
    label: 'Avg Put ROI',
    value: '2.3% Monthly',
    subtext: 'Targeted delta -0.35',
    trend: '+0.2%',
    sparkline: '↗',
    trendClass: 'positive',
  },
  {
    label: 'LEAP Candidates',
    value: '8 Today',
    subtext: '70-75 delta calls',
    trend: '+1 new',
    sparkline: '▲',
    trendClass: 'positive',
  },
  {
    label: 'Avg LEAP Upside',
    value: '28%',
    subtext: '1+ year horizon',
    trend: '+3%',
    sparkline: '↗',
    trendClass: 'positive',
  },
]);

const topIncome = ref([
  { ticker: 'KO', roi: '2.3%', breakeven: '$58.20' },
  { ticker: 'PG', roi: '2.1%', breakeven: '$142.50' },
  { ticker: 'JNJ', roi: '2.4%', breakeven: '$145.00' },
]);

const topGrowth = ref([
  { ticker: 'AAPL', delta: '0.72', upside: '28%' },
  { ticker: 'MSFT', delta: '0.71', upside: '32%' },
  { ticker: 'NVDA', delta: '0.73', upside: '25%' },
]);

const fallback = {
  investments: [
    {
      ticker: 'SPY',
      exp_date: '2024-08-02',
      price: 2.15,
      delta: 0.32,
      rsi: 58,
      roi: 12.4,
    },
    {
      ticker: 'QQQ',
      exp_date: '2024-08-02',
      price: 1.88,
      delta: 0.28,
      rsi: 61,
      roi: 10.1,
    },
    {
      ticker: 'TSLA',
      exp_date: '2024-08-02',
      price: 3.42,
      delta: -0.21,
      rsi: 44,
      roi: -4.6,
    },
  ],
};

const applyData = (data) => {
  investments.value = data.investments;
};

const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const investmentsData = await getWeeklyInvestments({
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      minRsi: minRsi.value,
      maxRsi: maxRsi.value,
      minRoi: minRoi.value,
      minDelta: minDelta.value,
      maxDelta: maxDelta.value,
      screenerType: screenerType.value,
    });

    applyData({
      investments: investmentsData,
    });
  } catch (err) {
    applyData({
      investments: fallback.investments,
    });
    error.value =
      'We could not reach the weekly investments API. Set VITE_API_BASE_URL to your backend address to see live data.';
  } finally {
    loading.value = false;
  }
};

const refresh = () => {
  loadData();
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
  script.text = JSON.stringify({
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
  script.text = JSON.stringify({
    backgroundColor: 'rgba(31, 31, 31, 1)',
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
  linkText.textContent = `${activeTicker.value} key facts`;

  const trademark = document.createElement('span');
  trademark.className = 'trademark';
  trademark.textContent = ' by TradingView';

  link.appendChild(linkText);
  copyright.append(link, trademark);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
  script.async = true;
  script.text = JSON.stringify({
    symbol: buildTradingViewSymbol(activeTicker.value),
    colorTheme: 'dark',
    isTransparent: false,
    locale: 'en',
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
  if (!ticker) return;
  activeTicker.value = ticker.trim();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  activeTicker.value = '';
  if (widgetContainer.value) {
    widgetContainer.value.innerHTML = '';
  }
  if (symbolOverviewContainer.value) {
    symbolOverviewContainer.value.innerHTML = '';
  }
  if (symbolProfileContainer.value) {
    symbolProfileContainer.value.innerHTML = '';
  }
};

let priceFilterTimer;
watch([minPrice, maxPrice, minRsi, maxRsi, minRoi, minDelta, maxDelta, screenerType], () => {
  clearTimeout(priceFilterTimer);
  priceFilterTimer = setTimeout(() => {
    loadData();
  }, 300);
});

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

onMounted(loadData);
</script>

<template>
  <div class="app">
    <header class="hero">
      <nav class="nav">
        <div class="logo">
          <span class="pulse"></span>
          <div>
            <p>Investing Pulse</p>
            <small>Connected to {{ apiBaseUrl }}</small>
          </div>
        </div>
        <div class="actions">
          <button class="ghost" type="button">Alerts</button>
          <button class="primary" type="button" @click="refresh">Refresh</button>
        </div>
      </nav>
      <div class="hero-body">
        <div>
          <p class="eyebrow">Portfolio Overview</p>
          <h1>Make confident moves with real-time portfolio intelligence.</h1>
          <p class="lead">
            A modern, data-rich dashboard that tracks your holdings, risk exposure, and market momentum.
          </p>
          <div class="hero-metrics">
            <div>
              <strong>{{ summarySnapshot.openPositions }}</strong>
              <span>Open positions</span>
            </div>
            <div>
              <strong>{{ summarySnapshot.watchlist }}</strong>
              <span>Watchlist alerts</span>
            </div>
            <div>
              <strong>{{ summarySnapshot.cashRunway }}</strong>
              <span>Cash runway</span>
            </div>
          </div>
        </div>
        <div class="hero-card">
          <div class="glow"></div>
          <h3>Risk posture</h3>
          <p class="subtle">{{ summarySnapshot.riskSummary }}</p>
          <div class="pill-row">
            <span v-for="tag in summarySnapshot.tags" :key="tag" class="pill">{{ tag }}</span>
          </div>
          <button class="ghost" type="button">Review hedges</button>
        </div>
      </div>
    </header>

    <main>
      <div v-if="loading" class="card loading">
        <p>Syncing with your investing API…</p>
      </div>
      <div v-else>
        <div v-if="error" class="card warning">
          <p>{{ error }}</p>
          <p class="subtle">Showing latest cached insights so the dashboard remains usable.</p>
        </div>

        <SummaryCards :summary="summary" />
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
        <MarketMovers :movers="movers" @select-ticker="openTicker" />
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
import SummaryCards from './components/SummaryCards.vue';
import InvestmentsTable from './components/InvestmentsTable.vue';
import MarketMovers from './components/MarketMovers.vue';

const loading = ref(true);
const error = ref('');
const summary = ref({
  totalValue: 0,
  dayChange: 0,
  dayChangePct: 0,
  cash: 0,
  riskScore: 0,
});
const movers = ref({ gainers: [], losers: [] });
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

const summarySnapshot = ref({
  openPositions: 0,
  watchlist: 0,
  cashRunway: '0 days',
  riskSummary: 'Portfolio risk data will load once the API responds.',
  tags: ['Diversified', 'Long-term', 'US equities'],
});

const fallback = {
  summary: {
    totalValue: 248930,
    dayChange: 1250,
    dayChangePct: 0.8,
    cash: 31200,
    riskScore: 62,
  },
  movers: {
    gainers: [
      { ticker: 'PLTR', name: 'Palantir', change: 6.1 },
      { ticker: 'META', name: 'Meta', change: 4.3 },
      { ticker: 'AMD', name: 'AMD', change: 3.9 },
    ],
    losers: [
      { ticker: 'SHOP', name: 'Shopify', change: -3.2 },
      { ticker: 'PYPL', name: 'PayPal', change: -2.7 },
      { ticker: 'DIS', name: 'Disney', change: -2.1 },
    ],
  },
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
  snapshot: {
    openPositions: 14,
    watchlist: 6,
    cashRunway: '48 days',
    riskSummary: 'Moderate risk profile with tech-heavy tilt.',
    tags: ['Tech tilt', 'Growth', 'Options enabled'],
  },
};

const applyData = (data) => {
  summary.value = data.summary;
  movers.value = data.movers;
  summarySnapshot.value = data.snapshot;
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
    console.log('investmentsData', investmentsData);

    applyData({
      summary: fallback.summary,
      movers: fallback.movers,
      investments: investmentsData,
      snapshot: fallback.snapshot,
    });
  } catch (err) {
    applyData({
      summary: fallback.summary,
      movers: fallback.movers,
      investments: [],
      snapshot: fallback.snapshot,
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
    displayMode: 'single',
    isTransparent: true,
    locale: 'en',
    interval: '1m',
    disableInterval: false,
    width: '100%',
    height: '100%',
    symbol: buildTradingViewSymbol(activeTicker.value),
    showIntervalTabs: true,
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
    lineWidth: 2,
    lineType: 0,
    chartType: 'area',
    fontColor: 'rgb(106, 109, 120)',
    gridLineColor: 'rgba(242, 242, 242, 0.06)',
    volumeUpColor: 'rgba(34, 171, 148, 0.5)',
    volumeDownColor: 'rgba(247, 82, 95, 0.5)',
    backgroundColor: '#10162b',
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
    symbols: [[activeTicker.value, `${buildTradingViewSymbol(activeTicker.value)}|1D`]],
    dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
    fontSize: '10',
    headerFontSize: 'medium',
    autosize: true,
    width: '100%',
    height: '100%',
    noTimeScale: false,
    hideDateRanges: false,
    showMA: true,
    maLength: 9,
    maLineColor: '#2962FF',
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

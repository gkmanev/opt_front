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
                <p class="panel-label">Bands indicator</p>
                <div ref="bandsChartContainer" class="bands-chart"></div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
const bandsChartContainer = ref(null);
let bandsChart = null;
let bandsResizeObserver = null;
let lightweightChartsPromise = null;

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

const buildTradingViewLink = (ticker) => {
  if (!ticker) return '';
  const cleaned = ticker.trim();
  const normalized = cleaned.includes(':') ? cleaned.replace(':', '-') : cleaned;
  return `https://www.tradingview.com/symbols/${normalized}/technicals/`;
};

const buildTradingViewSymbol = (ticker) => {
  if (!ticker) return '';
  return ticker.trim();
};

const loadLightweightCharts = () => {
  if (window.LightweightCharts) {
    return Promise.resolve(window.LightweightCharts);
  }
  if (lightweightChartsPromise) {
    return lightweightChartsPromise;
  }

  lightweightChartsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    script.onload = () => resolve(window.LightweightCharts);
    script.onerror = () => reject(new Error('Failed to load lightweight charts.'));
    document.head.appendChild(script);
  });

  return lightweightChartsPromise;
};

const renderWidget = () => {
  if (!widgetContainer.value || !activeTicker.value) return;
  widgetContainer.value.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'tradingview-widget-container';

  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';

  const link = document.createElement('a');
  link.href = buildTradingViewLink(activeTicker.value);
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
    colorTheme: 'light',
    displayMode: 'single',
    isTransparent: false,
    locale: 'en',
    interval: '1m',
    disableInterval: false,
    width: '100%',
    height: '100%',
    symbol: buildTradingViewSymbol(activeTicker.value),
    showIntervalTabs: true,
  });

  container.append(widget, copyright, script);
  widgetContainer.value.appendChild(container);
};

const mulberry32 = (seed) => {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const buildSeed = (ticker) =>
  ticker
    .toUpperCase()
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

const generateCandleData = (ticker) => {
  const seed = buildSeed(ticker);
  const rand = mulberry32(seed);
  const data = [];
  const now = new Date();
  let lastClose = 90 + (seed % 40);

  for (let i = 90; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const drift = (rand() - 0.5) * 2;
    const open = lastClose + drift;
    const close = open + (rand() - 0.5) * 3;
    const high = Math.max(open, close) + rand() * 2.2;
    const low = Math.min(open, close) - rand() * 2.2;
    lastClose = close;

    data.push({
      time: Math.floor(date.getTime() / 1000),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });
  }

  return data;
};

const calculateBands = (candles, period = 20, multiplier = 2) => {
  const middle = [];
  const upper = [];
  const lower = [];
  const closes = candles.map((candle) => candle.close);

  for (let i = period - 1; i < candles.length; i += 1) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, value) => sum + value, 0) / period;
    const variance =
      slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;
    const deviation = Math.sqrt(variance);
    const time = candles[i].time;
    middle.push({ time, value: Number(mean.toFixed(2)) });
    upper.push({ time, value: Number((mean + multiplier * deviation).toFixed(2)) });
    lower.push({ time, value: Number((mean - multiplier * deviation).toFixed(2)) });
  }

  return { middle, upper, lower };
};

const renderBandsChart = async () => {
  if (!bandsChartContainer.value || !activeTicker.value) return;

  if (bandsChart) {
    bandsChart.remove();
    bandsChart = null;
  }

  bandsChartContainer.value.innerHTML =
    '<p class="subtle">Loading bands indicator…</p>';

  let createChart;
  try {
    ({ createChart } = await loadLightweightCharts());
  } catch (error) {
    bandsChartContainer.value.innerHTML =
      '<p class="subtle">Unable to load bands indicator.</p>';
    return;
  }

  bandsChartContainer.value.innerHTML = '';

  const chart = createChart(bandsChartContainer.value, {
    height: 260,
    layout: {
      background: { color: 'transparent' },
      textColor: '#d7dbee',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.08)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.08)' },
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: '#36d399',
    downColor: '#f87171',
    borderVisible: false,
    wickUpColor: '#36d399',
    wickDownColor: '#f87171',
  });

  const middleSeries = chart.addLineSeries({
    color: '#fbbf24',
    lineWidth: 2,
  });
  const upperSeries = chart.addLineSeries({
    color: '#7dd3fc',
    lineWidth: 1,
  });
  const lowerSeries = chart.addLineSeries({
    color: '#7dd3fc',
    lineWidth: 1,
  });

  const candles = generateCandleData(activeTicker.value);
  const bands = calculateBands(candles);

  candleSeries.setData(candles);
  middleSeries.setData(bands.middle);
  upperSeries.setData(bands.upper);
  lowerSeries.setData(bands.lower);
  chart.timeScale().fitContent();

  bandsChart = chart;

  if (bandsResizeObserver) {
    bandsResizeObserver.disconnect();
  }
  bandsResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      chart.applyOptions({ width: entry.contentRect.width });
    }
  });
  bandsResizeObserver.observe(bandsChartContainer.value);
};

const renderModalCharts = async () => {
  renderWidget();
  await renderBandsChart();
};

const openTicker = (ticker) => {
  if (!ticker) return;
  activeTicker.value = ticker.trim();
  isModalOpen.value = true;
  nextTick(renderModalCharts);
};

const closeModal = () => {
  isModalOpen.value = false;
  activeTicker.value = '';
  if (widgetContainer.value) {
    widgetContainer.value.innerHTML = '';
  }
  if (bandsResizeObserver) {
    bandsResizeObserver.disconnect();
    bandsResizeObserver = null;
  }
  if (bandsChart) {
    bandsChart.remove();
    bandsChart = null;
  }
};

let priceFilterTimer;
watch([minPrice, maxPrice, minRsi, maxRsi, minRoi, minDelta, maxDelta, screenerType], () => {
  clearTimeout(priceFilterTimer);
  priceFilterTimer = setTimeout(() => {
    loadData();
  }, 300);
});

watch([isModalOpen, activeTicker], ([isOpen]) => {
  if (isOpen) {
    nextTick(renderModalCharts);
  }
});

onMounted(loadData);

onBeforeUnmount(() => {
  if (bandsResizeObserver) {
    bandsResizeObserver.disconnect();
  }
  if (bandsChart) {
    bandsChart.remove();
  }
});
</script>

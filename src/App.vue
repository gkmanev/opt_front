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
        <InvestmentsTable :investments="investments" />
        <PositionsTable :positions="positions" />
        <MarketMovers :movers="movers" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {
  apiBaseUrl,
  getMarketMovers,
  getPositions,
  getSummary,
  getWeeklyInvestments,
} from './api/investingApi';
import SummaryCards from './components/SummaryCards.vue';
import InvestmentsTable from './components/InvestmentsTable.vue';
import PositionsTable from './components/PositionsTable.vue';
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
const positions = ref([]);
const movers = ref({ gainers: [], losers: [] });
const investments = ref([]);

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
  positions: [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      value: 58400,
      avgCost: 154,
      dayChange: 1.2,
      allocation: 23,
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA',
      value: 46120,
      avgCost: 468,
      dayChange: 2.9,
      allocation: 18,
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft',
      value: 40210,
      avgCost: 295,
      dayChange: -0.4,
      allocation: 16,
    },
    {
      ticker: 'TSLA',
      name: 'Tesla',
      value: 29850,
      avgCost: 212,
      dayChange: -1.1,
      allocation: 12,
    },
  ],
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
  positions.value = data.positions;
  movers.value = data.movers;
  summarySnapshot.value = data.snapshot;
  investments.value = data.investments;
};

const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const [summaryData, positionsData, moversData, investmentsData] = await Promise.all([
      getSummary(),
      getPositions(),
      getMarketMovers(),
      getWeeklyInvestments(),
    ]);

    applyData({
      summary: summaryData,
      positions: positionsData,
      movers: moversData,
      investments: investmentsData,
      snapshot: {
        openPositions: positionsData.length,
        watchlist: moversData.losers?.length ?? 0,
        cashRunway: summaryData.cashRunway ?? 'N/A',
        riskSummary: summaryData.riskSummary ?? 'Risk signals are within expected thresholds.',
        tags: summaryData.tags ?? ['Diversified', 'Options enabled'],
      },
    });
  } catch (err) {
    applyData(fallback);
    error.value =
      'We could not reach the investing API. Set VITE_API_BASE_URL to your backend address to see live data.';
  } finally {
    loading.value = false;
  }
};

const refresh = () => {
  loadData();
};

onMounted(loadData);
</script>

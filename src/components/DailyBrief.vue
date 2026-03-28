<template>
  <section class="container screener-section">
    <div class="card screener-card">
      <button v-if="showBack" class="btn btn-muted back-btn" type="button" @click="emit('back')">
        Back
      </button>

      <div class="screener-header">
        <div class="screener-header-left">
          <span class="section-eyebrow">CASHFLOW SCREENER</span>
          <h2>Today's Top <span class="pick-count">{{ enrichedIncomeRows.length }}</span> picks</h2>
        </div>
        <div class="screener-strategy-strip">
          <span class="strategy-pill">
            <svg class="pill-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 11l4-4 3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Strong fundamentals only
          </span>
          <span class="strategy-pill">
            <svg class="pill-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 5v3.5l2 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            Target &gt; 2%/mo
          </span>
          <span class="strategy-pill">
            <svg class="pill-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2l1.5 3.5H13l-3 2.5 1 3.5L8 9.5 5 11.5l1-3.5L3 5.5h3.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
            If assigned -> sell covered calls
          </span>
          <span class="strategy-pill">
            <svg class="pill-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 10l4-4 3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Buy &amp; Strong Buy technicals
          </span>
        </div>
      </div>

      <div class="table-wrap screener-table-wrap">
        <table class="screener-table">
          <thead>
            <tr>
              <th class="col-rank">#</th>
              <th class="col-ticker">Ticker</th>
              <th class="col-price">Stock Price</th>
              <th class="col-strike">Strike</th>
              <th class="col-delta">Delta</th>
              <th class="col-premium">Est. Premium / Collateral</th>
              <th class="col-roi">Monthly ROI</th>
              <th class="col-expires">Expires</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" style="padding: 1.2rem 1rem; color: rgba(255,255,255,0.4);">Loading...</td>
            </tr>
            <tr v-else-if="!enrichedIncomeRows.length">
              <td colspan="9" style="padding: 1.2rem 1rem; color: rgba(255,255,255,0.4);">No qualifying picks today.</td>
            </tr>
            <tr
              v-else
              v-for="(row, index) in enrichedIncomeRows"
              :key="row.ticker"
              class="screener-row"
              :class="{ 'screener-row--expired': row.isExpired, 'screener-row--top': index === 0 }"
              tabindex="0"
              @click="openTicker(row.ticker)"
              @keydown.enter="openTicker(row.ticker)"
            >
              <td class="col-rank">
                <span class="rank-badge" :class="`rank-badge--${index + 1}`">{{ index + 1 }}</span>
              </td>
              <td class="col-ticker">
                <span class="ticker">{{ row.ticker }}</span>
              </td>
              <td class="col-price">{{ row.price }}</td>
              <td class="col-strike">{{ row.strike }}</td>
              <td class="col-delta">{{ row.delta }}</td>
              <td class="col-premium">
                <span class="premium-value">{{ row.estPremium }}</span>
                <span class="premium-sep">/</span>
                <span class="collateral-value muted">{{ row.estCollateral }} collateral</span>
              </td>
              <td class="col-roi">
                <span class="roi-pill" :class="row.isExpired ? 'roi-pill--muted' : 'roi-pill--positive'">
                  {{ row.roi }}
                </span>
              </td>
              <td class="col-expires">
                <span v-if="row.isExpired" class="expired-badge">EXPIRED</span>
                <span :class="row.isExpired ? 'expired-date' : 'muted'">{{ row.date }}</span>
              </td>
              <td class="col-action">
                <span class="row-cta">Ticker details -></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="screener-footer">
        <div class="screener-footer-copy">
          <span class="screener-footer-meta muted">Showing top 3 curated picks today</span>
          <span class="screener-footer-text">Want the shortlist in your inbox before the open?</span>
        </div>
        <button class="btn btn-primary" type="button" @click="emit('subscribe')">Get Tomorrow's Top 3</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  openTicker: {
    type: Function,
    default: () => {},
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  rows: {
    type: Array,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back', 'subscribe']);

const today = new Date();

const enrichedIncomeRows = computed(() =>
  (props.rows ?? []).map((row) => ({
    ...row,
    isExpired: new Date(row.date) < today,
  })),
);
</script>

<style scoped>
.back-btn {
  margin-bottom: 1.5rem;
}

.screener-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin-bottom: 1.5rem;
}

.screener-header-left h2 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pick-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-size: 1rem;
  font-weight: 900;
  margin-top: 8px;
}

.screener-strategy-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.strategy-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.strategy-pill--green {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.08);
  color: #4ade80;
}

.pill-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  opacity: 0.7;
}

.screener-table-wrap {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.screener-table {
  width: 100%;
  border-collapse: collapse;
}

.screener-table thead th {
  padding: 0.65rem 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.38);
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  white-space: nowrap;
}

.screener-table thead th.col-roi,
.screener-table thead th.col-price,
.screener-table thead th.col-strike,
.screener-table thead th.col-delta,
.screener-table thead th.col-expires {
  text-align: right;
}

.screener-row {
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.screener-row:last-child {
  border-bottom: none;
}

.screener-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.screener-row:hover .row-cta {
  opacity: 1;
  transform: translateX(0);
}

.screener-row--top {
  background: rgba(34, 197, 94, 0.03);
}

.screener-row--expired {
  opacity: 0.55;
}

.screener-table td {
  padding: 0.9rem 1rem;
  font-size: 0.9rem;
  vertical-align: middle;
}

.col-rank {
  width: 44px;
}

.col-ticker {
  min-width: 100px;
}

.col-price,
.col-strike,
.col-delta,
.col-roi,
.col-expires {
  text-align: right;
}

.col-action {
  width: 100px;
  text-align: right;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  font-size: 0.72rem;
  font-weight: 700;
}

.rank-badge--1 {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.rank-badge--2 {
  background: rgba(148, 163, 184, 0.12);
  color: #94a3b8;
}

.rank-badge--3 {
  background: rgba(180, 120, 80, 0.12);
  color: #b47850;
}

.ticker {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}

.expired-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.18);
  color: #f87171;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  vertical-align: middle;
}

.expired-date {
  color: #f87171;
  font-size: 0.82rem;
}

.col-premium {
  font-size: 0.85rem;
}

.premium-value {
  color: #e2e8f0;
  font-weight: 500;
}

.premium-sep {
  margin: 0 0.35rem;
  opacity: 0.35;
}

.collateral-value {
  font-size: 0.8rem;
}

.roi-pill {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
}

.roi-pill--positive {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.roi-pill--muted {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.35);
}

.row-cta {
  display: inline-block;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.muted {
  color: rgba(255, 255, 255, 0.4);
}

.screener-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.screener-footer-copy {
  display: grid;
  gap: 0.25rem;
}

.screener-footer-meta {
  font-size: 0.82rem;
}

.screener-footer-text {
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.4;
}

@media (max-width: 700px) {
  .screener-header {
    flex-direction: column;
  }

  .col-premium,
  .col-action {
    display: none;
  }

  .screener-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

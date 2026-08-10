<template>
  <section v-if="columns.length" class="structured-table" :aria-label="block.title || 'Results table'">
    <h3 v-if="block.title" class="structured-table__title">{{ block.title }}</h3>
    <div class="structured-table__scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{ 'is-sortable': column.sortable }"
              :aria-sort="sortColumn === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined"
            >
              <button v-if="column.sortable" type="button" @click="toggleSort(column.key)">
                {{ column.label }}
                <span aria-hidden="true">{{ sortColumn === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </button>
              <template v-else>{{ column.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in sortedRows" :key="rowIndex">
            <td v-for="column in columns" :key="column.key">
              <div v-if="column.type === 'ticker' && tickerValue(row[column.key])" class="structured-table__ticker-actions">
                <a
                  class="structured-table__ticker"
                  href="#"
                  @click.prevent="emit('select-ticker', tickerValue(row[column.key]))"
                >{{ tickerValue(row[column.key]) }}</a>
                <button
                  class="structured-table__watchlist-toggle"
                  :class="{ 'is-saved': isTickerWatched(row[column.key]) }"
                  type="button"
                  :disabled="isTickerPending(row[column.key])"
                  :aria-label="isTickerWatched(row[column.key]) ? `Remove ${tickerValue(row[column.key])} from watchlist` : `Add ${tickerValue(row[column.key])} to watchlist`"
                  @click="emit('toggle-watchlist', tickerValue(row[column.key]))"
                >{{ isTickerWatched(row[column.key]) ? '★' : '☆' }}</button>
              </div>
              <div v-else-if="isVolumeColumn(column)" class="structured-table__volume">
                <span class="structured-table__volume-value">{{ formatValue(row[column.key], column.type) }}</span>
                <span
                  v-if="volumePercent(row[column.key]) !== null"
                  class="structured-table__volume-bar"
                  :aria-label="`${formatValue(row[column.key], column.type)} volume`"
                  role="img"
                >
                  <span class="structured-table__volume-fill" :style="{ width: `${volumePercent(row[column.key])}%` }"></span>
                </span>
              </div>
              <template v-else>{{ formatValue(row[column.key], column.type) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
  watchlistTickers: {
    type: Array,
    default: () => [],
  },
  watchlistPendingTickers: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['select-ticker', 'toggle-watchlist']);

const sortColumn = ref('');
const sortDirection = ref('asc');
const columns = computed(() => Array.isArray(props.block?.columns) ? props.block.columns.filter((column) => column?.key && column?.label) : []);
const rows = computed(() => Array.isArray(props.block?.rows) ? props.block.rows : []);
const volumeColumnKeys = computed(() => new Set(
  columns.value
    .filter((column) => /(?:^|[_\\s-])volume(?:$|[_\\s-])|volume/i.test(`${column.key} ${column.label}`))
    .map((column) => column.key),
));

const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
const percentFormatter = new Intl.NumberFormat(undefined, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const asNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const volumeNumber = (value) => {
  const numeric = asNumber(value);
  if (numeric !== null) return numeric;
  if (typeof value !== 'string') return null;
  const match = value.trim().replace(/,/g, '').match(/^(-?[\\d.]+)\\s*([kmb])?$/i);
  if (!match) return null;
  const multipliers = { k: 1e3, m: 1e6, b: 1e9 };
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed * (multipliers[match[2]?.toLowerCase()] ?? 1) : null;
};

const isVolumeColumn = (column) => volumeColumnKeys.value.has(column.key);
const maxVolume = computed(() => {
  const volumeKey = Array.from(volumeColumnKeys.value)[0];
  return Math.max(0, ...rows.value.map((row) => volumeNumber(volumeKey ? row?.[volumeKey] : null) ?? 0));
});
const volumePercent = (value) => {
  const volume = volumeNumber(value);
  if (volume === null || maxVolume.value <= 0) return null;
  return Math.max(4, Math.round((volume / maxVolume.value) * 100));
};

const localDate = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatValue = (value, type) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = asNumber(value);
  if (type === 'currency') return number === null ? '—' : currencyFormatter.format(number);
  if (type === 'percent') return number === null ? '—' : percentFormatter.format(number / 100);
  if (type === 'number') return number === null ? '—' : numberFormatter.format(number);
  if (type === 'date') {
    const date = localDate(value);
    return date ? dateFormatter.format(date) : '—';
  }
  return String(value);
};

const tickerValue = (value) => typeof value === 'string' || typeof value === 'number' ? String(value).trim().toUpperCase() : '';
const isTickerWatched = (value) => props.watchlistTickers.includes(tickerValue(value));
const isTickerPending = (value) => props.watchlistPendingTickers.includes(tickerValue(value));

const toggleSort = (key) => {
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }
  sortColumn.value = key;
  sortDirection.value = 'asc';
};

const sortedRows = computed(() => {
  if (!sortColumn.value) return rows.value;
  const column = columns.value.find((item) => item.key === sortColumn.value);
  if (!column) return rows.value;
  const direction = sortDirection.value === 'asc' ? 1 : -1;
  return [...rows.value].sort((left, right) => {
    const leftValue = left?.[column.key];
    const rightValue = right?.[column.key];
    if (column.type === 'number' || column.type === 'currency' || column.type === 'percent') {
      return ((asNumber(leftValue) ?? -Infinity) - (asNumber(rightValue) ?? -Infinity)) * direction;
    }
    if (column.type === 'date') {
      return ((localDate(leftValue)?.getTime() ?? -Infinity) - (localDate(rightValue)?.getTime() ?? -Infinity)) * direction;
    }
    return String(leftValue ?? '').localeCompare(String(rightValue ?? '')) * direction;
  });
});
</script>

<style scoped>
.structured-table { margin: 0.75rem 0 1rem; max-width: 100%; }
.structured-table__title { margin: 0 0 0.45rem; color: #f1f5f9; font-size: 0.95rem; }
.structured-table__scroll { overflow-x: auto; border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 0.55rem; -webkit-overflow-scrolling: touch; }
table { width: 100%; min-width: max-content; border-collapse: collapse; font-size: 0.82rem; }
th, td { padding: 0.55rem 0.7rem; white-space: nowrap; text-align: left; border-bottom: 1px solid rgba(148, 163, 184, 0.13); }
th { position: sticky; top: 0; background: #1e293b; color: #cbd5e1; font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; }
th button { display: inline-flex; gap: 0.35rem; align-items: center; border: 0; padding: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; text-transform: inherit; letter-spacing: inherit; }
th.is-sortable button:hover { color: #7dd3fc; }
tbody tr:nth-child(even) { background: rgba(15, 23, 42, 0.35); }
tbody tr:last-child td { border-bottom: 0; }
.structured-table__ticker { color: #4ade80; font-weight: 700; text-decoration: none; }
.structured-table__ticker:hover { text-decoration: underline; }
.structured-table__ticker-actions { display: inline-flex; align-items: center; gap: 0.3rem; }
.structured-table__volume { display: grid; gap: 0.3rem; min-width: 5.5rem; }
.structured-table__volume-value { font-variant-numeric: tabular-nums; }
.structured-table__volume-bar { display: block; width: 100%; height: 0.3rem; overflow: hidden; border-radius: 999px; background: rgba(148, 163, 184, 0.22); }
.structured-table__volume-fill { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #38bdf8, #4ade80); transition: width 180ms ease-out; }
.structured-table__watchlist-toggle { border: 0; padding: 0; background: transparent; color: #94a3b8; font: inherit; cursor: pointer; }
.structured-table__watchlist-toggle:hover, .structured-table__watchlist-toggle:focus-visible, .structured-table__watchlist-toggle.is-saved { color: #fbbf24; }
.structured-table__watchlist-toggle:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; border-radius: 0.2rem; }
@media (max-width: 600px) { .structured-table__title { color: #020617; } th { background: #e2e8f0; color: #334155; } }
</style>

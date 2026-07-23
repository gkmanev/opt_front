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
              <a
                v-if="column.type === 'ticker' && tickerValue(row[column.key])"
                class="structured-table__ticker"
                :href="tickerHref(row[column.key])"
                target="_blank"
                rel="noopener noreferrer"
              >{{ tickerValue(row[column.key]) }}</a>
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
});

const sortColumn = ref('');
const sortDirection = ref('asc');
const columns = computed(() => Array.isArray(props.block?.columns) ? props.block.columns.filter((column) => column?.key && column?.label) : []);
const rows = computed(() => Array.isArray(props.block?.rows) ? props.block.rows : []);

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
const tickerHref = (value) => `https://finance.yahoo.com/quote/${encodeURIComponent(tickerValue(value))}`;

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
@media (max-width: 600px) { .structured-table__title { color: #020617; } th { background: #e2e8f0; color: #334155; } }
</style>

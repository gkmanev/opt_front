<template>
  <section class="card table-card">
    <header>
      <div>
        <h3>Weekly Options Ideas</h3>
        <p class="subtle">Screened options from the custom filter feed.</p>
      </div>
      <button class="ghost" type="button">Export</button>
    </header>
    <div class="table investments-table">
      <div class="table-row table-head">
        <span>Ticker</span>
        <span>Exp. Date</span>
        <span>Price</span>
        <span>Delta</span>
        <span>RSI</span>
        <span>ROI</span>
      </div>
      <div v-for="idea in investments" :key="ideaKey(idea)" class="table-row">
        <span class="ticker">
          <strong>{{ idea.ticker ?? '—' }}</strong>
        </span>
        <span>{{ formatDate(idea.exp_date ?? idea.expiration_date ?? idea.expDate) }}</span>
        <span>{{ formatNumber(idea.price) }}</span>
        <span :class="numberClass(idea.delta)">{{ formatNumber(idea.delta, true) }}</span>
        <span :class="numberClass(idea.rsi)">{{ formatNumber(idea.rsi) }}</span>
        <span :class="numberClass(idea.roi)">{{ formatNumber(idea.roi, true) }}</span>
      </div>
      <p v-if="!investments.length" class="subtle">No weekly options ideas available.</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  investments: {
    type: Array,
    required: true,
  },
});

const ideaKey = (idea) =>
  `${idea.ticker ?? 'unknown'}-${idea.exp_date ?? idea.expiration_date ?? idea.expDate ?? ''}-${idea.strike ?? ''}`;

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

const formatNumber = (value, isPercent = false) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(number);
  return isPercent ? `${formatted}%` : formatted;
};

const numberClass = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '';
  if (number > 0) return 'positive';
  if (number < 0) return 'negative';
  return '';
};
</script>

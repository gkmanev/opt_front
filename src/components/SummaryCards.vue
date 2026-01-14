<template>
  <section class="summary-grid">
    <article class="card">
      <p class="eyebrow">Total Value</p>
      <h2>{{ formatCurrency(summary.totalValue) }}</h2>
      <p class="delta" :class="summary.dayChange >= 0 ? 'positive' : 'negative'">
        {{ summary.dayChange >= 0 ? '+' : '' }}{{ formatCurrency(summary.dayChange) }}
        <span>({{ summary.dayChangePct }}%)</span>
      </p>
    </article>
    <article class="card">
      <p class="eyebrow">Available Cash</p>
      <h2>{{ formatCurrency(summary.cash) }}</h2>
      <p class="subtle">Ready for new opportunities</p>
    </article>
    <article class="card">
      <p class="eyebrow">Risk Score</p>
      <h2>{{ summary.riskScore }}</h2>
      <div class="progress">
        <span :style="{ width: `${summary.riskScore}%` }"></span>
      </div>
      <p class="subtle">Balanced allocation</p>
    </article>
  </section>
</template>

<script setup>
const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
</script>

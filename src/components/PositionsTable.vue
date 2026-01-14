<template>
  <section class="card table-card">
    <header>
      <div>
        <h3>Top Positions</h3>
        <p class="subtle">Largest allocations in your portfolio.</p>
      </div>
      <button class="ghost" type="button">View all</button>
    </header>
    <div class="table">
      <div class="table-row table-head">
        <span>Ticker</span>
        <span>Position</span>
        <span>Avg Cost</span>
        <span>Day</span>
        <span>Allocation</span>
      </div>
      <div v-for="position in positions" :key="position.ticker" class="table-row">
        <span class="ticker">
          <strong>{{ position.ticker }}</strong>
          <small>{{ position.name }}</small>
        </span>
        <span>{{ formatCurrency(position.value) }}</span>
        <span>{{ formatCurrency(position.avgCost) }}</span>
        <span :class="position.dayChange >= 0 ? 'positive' : 'negative'">
          {{ position.dayChange >= 0 ? '+' : '' }}{{ position.dayChange }}%
        </span>
        <span>{{ position.allocation }}%</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  positions: {
    type: Array,
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

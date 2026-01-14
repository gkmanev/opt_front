<template>
  <section class="grid-two">
    <article class="card">
      <header class="stack">
        <h3>Market Movers</h3>
        <p class="subtle">Top gainers across watchlists.</p>
      </header>
      <ul class="list">
        <li v-for="mover in movers.gainers" :key="mover.ticker">
          <div>
            <strong>{{ mover.ticker }}</strong>
            <small>{{ mover.name }}</small>
          </div>
          <span class="positive">+{{ mover.change }}%</span>
        </li>
      </ul>
    </article>
    <article class="card">
      <header class="stack">
        <h3>Watchlist Alerts</h3>
        <p class="subtle">Largest drawdowns today.</p>
      </header>
      <ul class="list">
        <li v-for="mover in movers.losers" :key="mover.ticker">
          <div>
            <strong>{{ mover.ticker }}</strong>
            <small>{{ mover.name }}</small>
          </div>
          <span class="negative">{{ mover.change }}%</span>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup>
defineProps({
  movers: {
    type: Object,
    required: true,
  },
});
</script>

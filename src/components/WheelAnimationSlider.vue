<template>
  <div class="wheel-stage" :class="{ 'wheel-stage--reduced': prefersReducedMotion }">
    <header class="wheel-stage__header">
      <div class="wheel-stage__brand">
        <span class="wheel-stage__dot"></span>
        <b>PutPulse</b>
      </div>
      <div class="wheel-stage__label">The Wheel - in 4 steps</div>
    </header>

    <svg class="wheel-stage__ekg" viewBox="0 0 820 74" preserveAspectRatio="none" aria-hidden="true">
      <path class="wheel-stage__ekg-base" d="M0,44 H88 l8,-20 8,34 8,-14 H298 l8,-20 8,34 8,-14 H508 l8,-20 8,34 8,-14 H718 l8,-20 8,34 8,-14 H820" />
      <path class="wheel-stage__ekg-live" d="M0,44 H88 l8,-20 8,34 8,-14 H298 l8,-20 8,34 8,-14 H508 l8,-20 8,34 8,-14 H718 l8,-20 8,34 8,-14 H820" />
      <g
        v-for="(step, index) in steps"
        :key="step.navLabel"
        class="wheel-stage__node"
        :class="{ 'is-active': index === activeStep }"
        @click="showStep(index)"
      >
        <circle class="wheel-stage__node-ring" :cx="step.cx" cy="44" r="7" />
        <circle class="wheel-stage__node-dot" :cx="step.cx" cy="44" r="6" />
        <text :x="step.cx" y="68">{{ step.navLabel }}</text>
      </g>
    </svg>

    <div class="wheel-stage__scenes">
      <section
        v-for="(step, index) in steps"
        :key="step.eyebrow"
        class="wheel-stage__scene"
        :class="{ 'is-active': index === activeStep }"
      >
        <div class="wheel-stage__copy">
          <div class="wheel-stage__eyebrow">{{ step.eyebrow }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>

        <div class="wheel-stage__visual">
          <div v-if="index === 0" class="wheel-chat">
            <div class="wheel-chat__bubble wheel-chat__bubble--you">I have $10,000. I want $300-$500 / month.</div>
            <div class="wheel-chat__bubble wheel-chat__bubble--typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wheel-chat__bubble wheel-chat__bubble--agent">Building a <b>wheel-style CSP plan</b> that fits your $10,000 - screening quality stocks first...</div>
          </div>

          <div v-else-if="index === 1" class="wheel-quality">
            <div class="wheel-gauge">
              <svg viewBox="0 0 190 190">
                <circle class="wheel-gauge__track" cx="95" cy="95" r="80" />
                <circle
                  class="wheel-gauge__fill"
                  cx="95"
                  cy="95"
                  r="80"
                  :style="{ strokeDashoffset: qualityDashOffset }"
                />
              </svg>
              <div class="wheel-gauge__content">
                <b>{{ displayedQualityScore }}</b>
                <small>quality score</small>
              </div>
            </div>
            <div class="wheel-quality__chips">
              <span
                v-for="chip in qualityChips"
                :key="chip.label"
                class="wheel-quality__chip"
                :class="chip.kind"
              >
                {{ chip.label }}
              </span>
            </div>
          </div>

          <div v-else-if="index === 2" class="wheel-trade">
            <div class="wheel-trade__head">
              <b>CSP ALLOCATION</b>
              <span>FITS $10,000</span>
            </div>
            <div class="wheel-trade__rows wheel-trade__rows--head">
              <span>TICKER</span>
              <span>STRIKE</span>
              <span>DTE</span>
              <span>PREMIUM</span>
            </div>
            <div
              v-for="trade in tradeRows"
              :key="trade.ticker"
              class="wheel-trade__rows"
            >
              <span><b>{{ trade.ticker }}</b></span>
              <span>{{ trade.strike }}</span>
              <span>{{ trade.dte }}</span>
              <span class="is-gold">{{ trade.premium }}</span>
            </div>
            <div class="wheel-trade__foot">
              <span>Cash required</span>
              <b>$9,700 <em>/ $10,000</em></b>
            </div>
          </div>

          <div v-else class="wheel-loop">
            <span class="wheel-loop__step">sell put - collect</span>
            <div class="wheel-loop__row">
              <span class="wheel-loop__step wheel-loop__step--side">called away -> repeat</span>
              <div class="wheel-loop__center">
                <svg viewBox="0 0 240 240" aria-hidden="true">
                  <circle class="wheel-loop__orbit" cx="120" cy="120" r="88" />
                  <circle class="wheel-loop__runner" cx="120" cy="120" r="88" />
                </svg>
                <div class="wheel-loop__value">
                  <b>${{ displayedIncome }}</b>
                  <small>est. income / mo</small>
                </div>
              </div>
              <span class="wheel-loop__step wheel-loop__step--side">assigned -> own shares</span>
            </div>
            <span class="wheel-loop__step">sell covered calls</span>
          </div>
        </div>
      </section>
    </div>

    <footer class="wheel-stage__footer">
      <button
        v-for="(step, index) in steps"
        :key="step.navLabel"
        class="wheel-stage__pager"
        :class="{ 'is-active': index === activeStep }"
        type="button"
        :aria-label="`Step ${index + 1}`"
        @click="showStep(index)"
      >
        <span class="wheel-stage__pager-progress"></span>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const AUTO_DURATION_MS = 4800;
const GAUGE_CIRCUMFERENCE = 502;
const QUALITY_SCORE_TARGET = 87;
const INCOME_TARGET = 538;

const steps = [
  {
    cx: 100,
    navLabel: '1 - ASK',
    eyebrow: 'Step 1 - Just ask',
    title: 'Tell the agent your budget and goal.',
    description: 'No screeners to configure. One message is enough - the AI agent turns it into a full income plan.',
  },
  {
    cx: 310,
    navLabel: '2 - QUALITY',
    eyebrow: 'Step 2 - Quality first',
    title: 'Only stocks worth owning.',
    description: 'The Wheel works when assignment is a win, not a worry. Every ticker gets a 0-100 quality score from ROIC, margins, cash flow, and balance-sheet health.',
  },
  {
    cx: 520,
    navLabel: '3 - SELL PUT',
    eyebrow: 'Step 3 - Your CSP plan',
    title: 'An allocation that fits your cash.',
    description: 'Live-chain contracts ranked by ROI, with delta, expiry, and premium - sized so total collateral never exceeds your budget.',
  },
  {
    cx: 730,
    navLabel: '4 - THE WHEEL',
    eyebrow: 'Step 4 - Keep the wheel turning',
    title: 'Every outcome pays you.',
    description: "Puts expire? Keep the premium and sell again. Assigned? You own quality stocks at a discount, then sell covered calls until they are called away and repeat.",
  },
];

const qualityChips = [
  { label: 'ROIC 24%', kind: 'is-good' },
  { label: 'FCF up', kind: 'is-good' },
  { label: 'Debt low', kind: 'is-good' },
  { label: '1 risk flag', kind: 'is-warn' },
];

const tradeRows = [
  { ticker: 'BIRK', strike: '$40', dte: '43d', premium: '$265' },
  { ticker: 'UMC', strike: '$23', dte: '8d', premium: '$72' },
  { ticker: 'B', strike: '$34', dte: '22d', premium: '$61' },
];

const activeStep = ref(0);
const displayedQualityScore = ref(0);
const displayedIncome = ref(0);
const prefersReducedMotion = ref(false);

let autoTimerId = null;
let qualityFrameId = null;
let incomeFrameId = null;
let mediaQueryList = null;

const qualityDashOffset = computed(() => {
  const progress = displayedQualityScore.value / QUALITY_SCORE_TARGET;
  return GAUGE_CIRCUMFERENCE - (GAUGE_CIRCUMFERENCE - 66) * progress;
});

const cancelFrame = (frameId) => {
  if (frameId !== null) cancelAnimationFrame(frameId);
};

const animateValue = (target, setter) => {
  if (prefersReducedMotion.value) {
    setter(target);
    return null;
  }

  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / 1500, 1);
    const eased = 1 - (1 - progress) ** 3;
    setter(Math.round(target * eased));
    if (progress < 1) {
      return requestAnimationFrame(tick);
    }
    return null;
  };

  return requestAnimationFrame(tick);
};

const restartAnimations = () => {
  cancelFrame(qualityFrameId);
  cancelFrame(incomeFrameId);
  qualityFrameId = null;
  incomeFrameId = null;

  displayedQualityScore.value = activeStep.value === 1 ? 0 : QUALITY_SCORE_TARGET;
  displayedIncome.value = activeStep.value === 3 ? 0 : INCOME_TARGET;

  if (activeStep.value === 1) {
    qualityFrameId = animateValue(QUALITY_SCORE_TARGET, (value) => {
      displayedQualityScore.value = value;
    });
  }

  if (activeStep.value === 3) {
    incomeFrameId = animateValue(INCOME_TARGET, (value) => {
      displayedIncome.value = value;
    });
  }
};

const startAutoCycle = () => {
  if (autoTimerId !== null) clearInterval(autoTimerId);
  autoTimerId = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.length;
    restartAnimations();
  }, AUTO_DURATION_MS);
};

const showStep = (index) => {
  activeStep.value = index;
  restartAnimations();
  startAutoCycle();
};

const syncMotionPreference = () => {
  prefersReducedMotion.value = Boolean(mediaQueryList?.matches);
};

onMounted(() => {
  mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotionPreference();
  mediaQueryList.addEventListener?.('change', syncMotionPreference);
  restartAnimations();
  startAutoCycle();
});

onUnmounted(() => {
  if (autoTimerId !== null) clearInterval(autoTimerId);
  cancelFrame(qualityFrameId);
  cancelFrame(incomeFrameId);
  mediaQueryList?.removeEventListener?.('change', syncMotionPreference);
});
</script>

<style scoped>
.wheel-stage {
  --wheel-ink: #0a1120;
  --wheel-panel: #101a2e;
  --wheel-panel-2: #0d1526;
  --wheel-line: #1d2a44;
  --wheel-text: #f3f7fc;
  --wheel-muted: #8fa3bf;
  --wheel-pulse: #38bdf8;
  --wheel-income: #f5c05a;
  --wheel-good: #4ade80;
  --wheel-warn: #fb7185;
  position: relative;
  width: 100%;
  background:
    radial-gradient(120% 100% at 50% 0%, #0e1830 0%, var(--wheel-ink) 60%);
  border: 1px solid var(--wheel-line);
  border-radius: 22px;
  color: var(--wheel-text);
  overflow: hidden;
  box-shadow: 0 28px 60px rgba(2, 6, 23, 0.35);
}

.wheel-stage__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.6rem 0.4rem;
}

.wheel-stage__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.wheel-stage__brand b {
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: 0.01em;
}

.wheel-stage__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--wheel-pulse);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
}

.wheel-stage__label,
.wheel-stage__eyebrow,
.wheel-stage__node text,
.wheel-quality__chip,
.wheel-loop__step,
.wheel-trade__rows--head,
.wheel-gauge__content small,
.wheel-loop__value small {
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
}

.wheel-stage__label {
  padding: 0.35rem 0.8rem;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 999px;
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--wheel-pulse);
}

.wheel-stage__ekg {
  display: block;
  width: 100%;
  height: 74px;
  padding: 0 10px;
}

.wheel-stage__ekg-base {
  fill: none;
  stroke: var(--wheel-line);
  stroke-width: 1.5;
}

.wheel-stage__ekg-live {
  fill: none;
  stroke: var(--wheel-pulse);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 120 1200;
  animation: wheel-trace 4.8s linear infinite;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
}

.wheel-stage__node {
  cursor: pointer;
}

.wheel-stage__node-dot {
  fill: var(--wheel-panel);
  stroke: var(--wheel-line);
  stroke-width: 1.5;
  transition: 0.3s;
}

.wheel-stage__node text {
  fill: var(--wheel-muted);
  font-size: 9.5px;
  text-anchor: middle;
  letter-spacing: 0.06em;
  transition: 0.3s;
}

.wheel-stage__node-ring {
  fill: none;
  stroke: none;
}

.wheel-stage__node.is-active .wheel-stage__node-dot {
  fill: var(--wheel-pulse);
  stroke: var(--wheel-pulse);
}

.wheel-stage__node.is-active text {
  fill: var(--wheel-text);
}

.wheel-stage__node.is-active .wheel-stage__node-ring {
  stroke: var(--wheel-pulse);
  stroke-width: 1.5;
  opacity: 0;
  animation: wheel-ringout 1.4s ease-out infinite;
}

.wheel-stage__scenes {
  position: relative;
  height: 310px;
  margin: 0.2rem 1.6rem 0;
}

.wheel-stage__scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  gap: 26px;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.wheel-stage__scene.is-active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.wheel-stage__copy,
.wheel-stage__visual {
  flex: 1;
  min-width: 0;
}

.wheel-stage__copy h3 {
  margin: 0 0 0.65rem;
  font-size: clamp(1.25rem, 3vw, 1.7rem);
  line-height: 1.15;
  font-weight: 900;
}

.wheel-stage__copy p {
  margin: 0;
  max-width: 34ch;
  color: var(--wheel-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  font-weight: 600;
}

.wheel-stage__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-stage__eyebrow {
  margin-bottom: 0.7rem;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--wheel-pulse);
}

.wheel-chat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 320px;
}

.wheel-chat__bubble {
  max-width: 88%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.45;
  opacity: 0;
  transform: translateY(8px);
}

.wheel-stage__scene.is-active .wheel-chat__bubble {
  animation: wheel-bubin 0.45s ease forwards;
}

.wheel-stage__scene.is-active .wheel-chat__bubble--you {
  animation-delay: 0.35s;
}

.wheel-stage__scene.is-active .wheel-chat__bubble--typing {
  animation-delay: 1s;
}

.wheel-stage__scene.is-active .wheel-chat__bubble--agent {
  animation-delay: 2.1s;
}

.wheel-chat__bubble--you {
  align-self: flex-end;
  background: var(--wheel-pulse);
  color: #06283d;
  border-bottom-right-radius: 4px;
}

.wheel-chat__bubble--agent,
.wheel-chat__bubble--typing {
  align-self: flex-start;
  background: var(--wheel-panel);
  border: 1px solid var(--wheel-line);
  border-bottom-left-radius: 4px;
  color: var(--wheel-text);
}

.wheel-chat__bubble--agent b {
  color: var(--wheel-pulse);
}

.wheel-chat__bubble--typing {
  display: flex;
  gap: 5px;
  padding: 13px 16px;
}

.wheel-chat__bubble--typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--wheel-muted);
  animation: wheel-tblink 1s infinite;
}

.wheel-chat__bubble--typing span:nth-child(2) {
  animation-delay: 0.18s;
}

.wheel-chat__bubble--typing span:nth-child(3) {
  animation-delay: 0.36s;
}

.wheel-quality {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-gauge {
  position: relative;
  width: 190px;
  height: 190px;
}

.wheel-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.wheel-gauge__track {
  fill: none;
  stroke: var(--wheel-line);
  stroke-width: 11;
}

.wheel-gauge__fill {
  fill: none;
  stroke: var(--wheel-good);
  stroke-width: 11;
  stroke-linecap: round;
  stroke-dasharray: 502;
  transition: stroke-dashoffset 0.28s ease;
}

.wheel-gauge__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wheel-gauge__content b {
  font-size: 42px;
  font-weight: 700;
  color: var(--wheel-good);
}

.wheel-gauge__content small,
.wheel-loop__value small {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--wheel-muted);
}

.wheel-quality__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
}

.wheel-quality__chip {
  padding: 5px 10px;
  border: 1px solid var(--wheel-line);
  border-radius: 999px;
  background: var(--wheel-panel-2);
  color: var(--wheel-muted);
  font-size: 11px;
  opacity: 0;
  transform: translateY(6px);
}

.wheel-stage__scene.is-active .wheel-quality__chip {
  animation: wheel-chipin 0.5s ease forwards;
}

.wheel-stage__scene.is-active .wheel-quality__chip:nth-child(1) {
  animation-delay: 0.5s;
}

.wheel-stage__scene.is-active .wheel-quality__chip:nth-child(2) {
  animation-delay: 0.7s;
}

.wheel-stage__scene.is-active .wheel-quality__chip:nth-child(3) {
  animation-delay: 0.9s;
}

.wheel-stage__scene.is-active .wheel-quality__chip:nth-child(4) {
  animation-delay: 1.1s;
}

.wheel-quality__chip.is-good {
  color: var(--wheel-good);
  border-color: rgba(74, 222, 128, 0.35);
}

.wheel-quality__chip.is-warn {
  color: var(--wheel-warn);
  border-color: rgba(251, 113, 133, 0.35);
}

.wheel-trade {
  width: 100%;
  max-width: 320px;
  border: 1px solid var(--wheel-line);
  border-radius: 16px;
  background: var(--wheel-panel);
  overflow: hidden;
}

.wheel-trade__head,
.wheel-trade__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  background: var(--wheel-panel-2);
}

.wheel-trade__head {
  border-bottom: 1px solid var(--wheel-line);
}

.wheel-trade__head b {
  font-size: 13px;
  letter-spacing: 0.03em;
}

.wheel-trade__head span {
  font-size: 10.5px;
  color: var(--wheel-pulse);
}

.wheel-trade__rows {
  display: grid;
  grid-template-columns: 1.3fr 1fr 0.8fr 1fr;
  gap: 6px;
  padding: 9px 14px;
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  border-top: 1px solid var(--wheel-line);
  opacity: 0;
  transform: translateY(6px);
}

.wheel-stage__scene.is-active .wheel-trade__rows {
  animation: wheel-chipin 0.45s ease forwards;
}

.wheel-stage__scene.is-active .wheel-trade__rows:nth-child(2) {
  animation-delay: 0.3s;
}

.wheel-stage__scene.is-active .wheel-trade__rows:nth-child(3) {
  animation-delay: 0.5s;
}

.wheel-stage__scene.is-active .wheel-trade__rows:nth-child(4) {
  animation-delay: 0.7s;
}

.wheel-stage__scene.is-active .wheel-trade__rows:nth-child(5) {
  animation-delay: 0.9s;
}

.wheel-trade__rows--head {
  border-top: 0;
  padding-bottom: 5px;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--wheel-muted);
}

.wheel-trade__rows span:last-child {
  text-align: right;
}

.wheel-trade__rows .is-gold {
  color: var(--wheel-income);
  font-weight: 600;
}

.wheel-trade__foot {
  border-top: 1px solid var(--wheel-line);
  color: var(--wheel-muted);
  font-size: 11px;
  opacity: 0;
}

.wheel-trade__foot b {
  color: var(--wheel-good);
  font-size: 12px;
}

.wheel-trade__foot em {
  color: var(--wheel-muted);
  font-style: normal;
  font-weight: 400;
}

.wheel-stage__scene.is-active .wheel-trade__foot {
  animation: wheel-chipin 0.45s ease 1.15s forwards;
}

.wheel-loop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.wheel-loop__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.wheel-loop__center {
  position: relative;
  width: 190px;
  height: 190px;
  flex: 0 0 auto;
}

.wheel-loop__center svg {
  width: 100%;
  height: 100%;
}

.wheel-loop__orbit {
  fill: none;
  stroke: var(--wheel-line);
  stroke-width: 1.5;
  stroke-dasharray: 4 6;
}

.wheel-loop__runner {
  fill: none;
  stroke: var(--wheel-income);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 70 620;
  animation: wheel-orbit 3.2s linear infinite;
  filter: drop-shadow(0 0 6px rgba(245, 192, 90, 0.5));
}

.wheel-loop__value {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.wheel-loop__value b {
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 26px;
  color: var(--wheel-income);
}

.wheel-loop__step {
  padding: 4px 9px;
  border: 1px solid var(--wheel-line);
  border-radius: 999px;
  background: var(--wheel-panel-2);
  color: var(--wheel-muted);
  font-size: 9.5px;
  white-space: nowrap;
}

.wheel-loop__step--side {
  max-width: 92px;
  min-width: 0;
  border-radius: 12px;
  white-space: normal;
  text-align: center;
  line-height: 1.4;
  flex: 0 1 auto;
}

.wheel-stage__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 16px 0 20px;
}

.wheel-stage__pager {
  width: 26px;
  height: 4px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: var(--wheel-line);
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.wheel-stage__pager-progress {
  position: absolute;
  inset: 0;
  background: var(--wheel-pulse);
  transform: scaleX(0);
  transform-origin: left;
}

.wheel-stage__pager.is-active .wheel-stage__pager-progress {
  animation: wheel-progress 4.8s linear forwards;
}

.wheel-stage--reduced .wheel-stage__ekg-live,
.wheel-stage--reduced .wheel-loop__runner,
.wheel-stage--reduced .wheel-stage__pager.is-active .wheel-stage__pager-progress,
.wheel-stage--reduced .wheel-stage__node.is-active .wheel-stage__node-ring,
.wheel-stage--reduced .wheel-stage__scene.is-active .wheel-chat__bubble,
.wheel-stage--reduced .wheel-stage__scene.is-active .wheel-quality__chip,
.wheel-stage--reduced .wheel-stage__scene.is-active .wheel-trade__rows,
.wheel-stage--reduced .wheel-stage__scene.is-active .wheel-trade__foot {
  animation: none;
}

.wheel-stage--reduced .wheel-chat__bubble,
.wheel-stage--reduced .wheel-quality__chip,
.wheel-stage--reduced .wheel-trade__rows,
.wheel-stage--reduced .wheel-trade__foot {
  opacity: 1;
  transform: none;
}

@keyframes wheel-trace {
  from { stroke-dashoffset: 1320; }
  to { stroke-dashoffset: 0; }
}

@keyframes wheel-ringout {
  0% { r: 7; opacity: 0.8; }
  100% { r: 18; opacity: 0; }
}

@keyframes wheel-bubin {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes wheel-tblink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes wheel-chipin {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes wheel-orbit {
  from { stroke-dashoffset: 690; }
  to { stroke-dashoffset: 0; }
}

@keyframes wheel-progress {
  to { transform: scaleX(1); }
}

@media (max-width: 640px) {
  .wheel-stage__header {
    padding: 1.05rem 1rem 0.2rem;
  }

  .wheel-stage__label {
    display: none;
  }

  .wheel-stage__node text {
    font-size: 8px;
  }

  .wheel-stage__scenes {
    height: 430px;
    margin: 0.2rem 1rem 0;
  }

  .wheel-stage__scene {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    overflow: hidden;
  }

  .wheel-stage__copy p {
    max-width: none;
  }

  .wheel-stage__visual {
    width: 100%;
  }

  .wheel-gauge {
    width: 150px;
    height: 150px;
  }

  .wheel-gauge__content b {
    font-size: 32px;
  }

  .wheel-loop__center {
    width: 140px;
    height: 140px;
  }

  .wheel-loop__value b {
    font-size: 20px;
  }

  .wheel-loop__row {
    gap: 6px;
  }

  .wheel-loop__step {
    font-size: 8.5px;
  }

  .wheel-loop__step--side {
    max-width: 76px;
  }
}
</style>

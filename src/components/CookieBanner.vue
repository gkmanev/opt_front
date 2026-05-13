<template>
  <teleport to="body">
    <transition name="cookie-banner">
      <div v-if="visible" class="cookie-banner" role="region" aria-label="Cookie notice">
        <p class="cookie-banner-text">
          We use a single essential cookie to keep you logged in. No tracking, no ads.
          <a class="cookie-banner-link" href="/privacy#cookies" @click="onPrivacyClick">Learn more</a>
        </p>
        <button class="cookie-banner-btn" type="button" @click="accept">Accept</button>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';

const STORAGE_KEY = 'putpulse.cookie-consent';

const visible = ref(localStorage.getItem(STORAGE_KEY) !== 'accepted');

const emit = defineEmits(['navigate-route']);

function accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  visible.value = false;
}

function onPrivacyClick(event) {
  emit('navigate-route', event, '/privacy');
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.9rem 1.25rem;
  background: rgba(9, 14, 28, 0.97);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  max-width: calc(100vw - 2rem);
  width: max-content;
}

.cookie-banner-text {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  white-space: nowrap;
}

.cookie-banner-link {
  color: #67e8f9;
  text-decoration: none;
  margin-left: 0.25rem;
}

.cookie-banner-link:hover {
  text-decoration: underline;
}

.cookie-banner-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 0.6rem;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: filter 0.2s;
}

.cookie-banner-btn:hover {
  filter: brightness(1.1);
}

.cookie-banner-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-banner-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.cookie-banner-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

.cookie-banner-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

@media (max-width: 560px) {
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    bottom: 1rem;
    width: calc(100vw - 2rem);
  }

  .cookie-banner-text {
    white-space: normal;
  }
}
</style>

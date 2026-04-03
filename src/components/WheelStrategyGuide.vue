<template>
  <teleport to="body">
    <transition name="wheel-guide-modal">
      <div
        v-if="open"
        class="wheel-guide-modal-backdrop"
        @click.self="emit('close')"
      >
        <section
          class="wheel-guide-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wheel-guide-title"
        >
          <WheelStrategyGuideContent
            :candidates="candidates"
            show-close
            @close="emit('close')"
          />
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onUnmounted, watch } from 'vue';
import WheelStrategyGuideContent from './WheelStrategyGuideContent.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close']);

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.open) {
    emit('close');
  }
};

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
      return;
    }
    window.removeEventListener('keydown', handleKeydown);
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.wheel-guide-modal-enter-active,
.wheel-guide-modal-leave-active {
  transition: opacity 0.2s ease;
}

.wheel-guide-modal-enter-from,
.wheel-guide-modal-leave-to {
  opacity: 0;
}

.wheel-guide-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(13, 148, 136, 0.14), transparent 35%),
    rgba(8, 15, 28, 0.78);
  backdrop-filter: blur(12px);
}

.wheel-guide-modal {
  width: min(1080px, 100%);
  max-height: min(90vh, 920px);
  overflow: auto;
}

@media (max-width: 720px) {
  .wheel-guide-modal-backdrop {
    padding: 14px;
  }

  .wheel-guide-modal {
    max-height: 94vh;
  }
}
</style>

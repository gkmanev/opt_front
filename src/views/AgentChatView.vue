<template>
  <div class="agent-page-shell">
    <section class="agent-page" :class="{ 'agent-page--hero': isHeroMode }">

    <!-- Ambient glow (hero only) -->
    <div v-if="isHeroMode" class="agent-glow-bg" aria-hidden="true">
      <div class="agent-glow agent-glow--1"></div>
      <div class="agent-glow agent-glow--2"></div>
      <div class="agent-glow agent-glow--3"></div>
    </div>

    <aside v-if="auth.isAuthenticated.value" class="agent-history-sidebar" aria-label="Chat history">
      <button class="agent-new-chat-btn" type="button" @click="startNewConversation">
        <span aria-hidden="true">+</span> New chat
      </button>
      <div class="agent-history-sidebar__heading">Historical queries</div>
      <div v-if="isLoadingConversations" class="agent-history-sidebar__empty">Loading chats…</div>
      <div v-else-if="conversations.length" class="agent-history-sidebar__list">
        <button
          v-for="conversation in conversations"
          :key="conversation.id"
          class="agent-history-item"
          :class="{ 'is-active': conversation.id === activeConversationId }"
          type="button"
          :disabled="isLoadingConversation"
          @click="selectConversation(conversation)"
        >
          <span class="agent-history-item__title-row">
            <span class="agent-history-item__title">{{ conversation.title }}</span>
          </span>
          <span v-if="conversation.preview" class="agent-history-item__preview">{{ conversation.preview }}</span>
        </button>
      </div>
      <div v-else class="agent-history-sidebar__empty">Your historical queries will appear here.</div>
    </aside>

    <!-- Hero heading -->
    <Transition name="hero-fade">
      <div v-if="isHeroMode" class="agent-hero-content">
        <span class="agent-hero-eyebrow">Beginner Friendly • Consistent Cash Flow</span>
        <h1 class="agent-hero-title">Get consistent monthly income by selling Puts (The Wheel Strategy)</h1>
        <p class="agent-hero-subtitle">Data-driven put-selling ideas on stocks you'd be comfortable owning</p>
      </div>
    </Transition>

    <!-- Chat header + messages (active conversation) -->
    <div v-if="!isHeroMode" class="container agent-chat-wrap">
      <div class="agent-chat-header">
        <div class="agent-header-copy">
          <span class="section-eyebrow">PutPulse Assistant</span>
          <h1 class="agent-title">Ask the PutPulse AI</h1>
          <p class="agent-subtitle muted">Ask anything about options strategies, stocks, or investment ideas.</p>
        </div>
        <button
          v-if="conversationHistory.length"
          class="btn btn-muted agent-clear-btn"
          type="button"
          @click="startNewConversation"
        >
          New chat
        </button>
      </div>

      <div class="agent-messages" ref="messagesEl">
        <template v-for="(msg, idx) in conversationHistory" :key="idx">
          <div
            class="agent-message"
            :class="msg.role === 'user' ? 'agent-message--user' : 'agent-message--assistant'"
          >
            <span class="agent-message-role">
              {{ msg.role === 'user' ? 'You' : 'PutPulse AI' }}
              <span v-if="msg.role === 'assistant' && formatAnswerTimestamp(msg.finishedAt)" class="agent-message-timestamp">· {{ formatAnswerTimestamp(msg.finishedAt) }}</span>
            </span>
            <template v-if="msg.role === 'assistant'">
              <StructuredTable
                v-for="(block, blockIndex) in structuredTableBlocks(msg)"
                :key="`${block.type}-${blockIndex}`"
                :block="block"
                :watchlist-tickers="watchlistTickers"
                :watchlist-pending-tickers="watchlistPendingTickers"
                @select-ticker="requestTickerDetails"
                @toggle-watchlist="requestWatchlistToggle"
              />
              <div
                class="agent-bubble agent-bubble--md"
                v-html="renderMarkdown(msg.content, structuredTableBlocks(msg).length > 0)"
                @click="handleMarkdownTickerClick"
              ></div>
            </template>
            <div v-else class="agent-bubble">{{ msg.content }}</div>
          </div>
        </template>

      </div>

      <section v-if="usageLimitReached" class="agent-limit-card" role="status" aria-live="polite">
        <div class="agent-limit-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8v4l2.5 2.5" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div class="agent-limit-card__content">
          <h2>{{ usageLimitTitle }}</h2>
          <p>{{ usageLimitDescription }}</p>
          <div class="agent-limit-card__actions">
            <template v-if="auth.isAuthenticated.value">
              <button class="btn btn-primary" type="button" @click="requestUpgrade">Explore plans</button>
            </template>
            <template v-else>
              <button class="btn btn-primary" type="button" @click="requestSignUp">Create free account</button>
              <button class="agent-limit-card__login" type="button" @click="requestLogin">Already have an account? Log in</button>
            </template>
          </div>
        </div>
      </section>

      <div v-if="jobError" class="agent-error" role="alert">{{ jobError }}</div>

      <form class="agent-composer agent-composer--chat" @submit.prevent="sendMessage">
        <textarea
          ref="inputEl"
          v-model="userInput"
          class="agent-input"
          :placeholder="composerPlaceholder"
          rows="1"
          :disabled="isSending || usageLimitReached"
          @input="autoResize"
        ></textarea>
        <div class="agent-composer-toolbar">
          <span v-if="isSending" class="agent-status-label">{{ sendButtonLabel }}</span>
          <span v-else class="agent-composer-hint">Try a prompt or type your own question</span>
          <button
            class="agent-send-btn"
            :class="{ 'agent-send-btn--ready': userInput.trim() && !isSending && !usageLimitReached }"
            type="submit"
            :disabled="isSending || usageLimitReached || !userInput.trim()"
            aria-label="Send"
          >
            <svg v-if="!isSending" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span v-if="!isSending" class="agent-send-btn-label">Send</span>
            <span v-else class="agent-send-spinner" aria-hidden="true"></span>
          </button>
        </div>
      </form>
    </div>

    <!-- Composer area -->
    <div
      v-if="isHeroMode"
      class="agent-composer-outer agent-composer-outer--hero"
    >
      <div class="agent-prompt-chips agent-prompt-chips--hero">
        <button
          v-for="prompt in quickPromptChips"
          :key="prompt"
          class="agent-prompt-chip"
          type="button"
          @click="useSuggestion(prompt)"
        >
          {{ prompt }}
        </button>
      </div>

      <!-- Carousel suggestion (hero only) -->
      <div v-if="isHeroMode" class="agent-suggestions">
        <div class="agent-carousel">
          <button class="agent-carousel-arrow" type="button" @click="prevSuggestion" aria-label="Previous suggestion">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
          <div class="agent-carousel-track">
            <Transition :name="carouselTransition" mode="out-in">
              <button
                :key="currentSuggestionIndex"
                class="agent-suggestion-btn"
                type="button"
                @click="useSuggestion(suggestions[currentSuggestionIndex].text)"
              >
                <span class="agent-suggestion-icon" v-html="suggestions[currentSuggestionIndex].icon"></span>
                <span class="agent-suggestion-label">{{ suggestions[currentSuggestionIndex].text }}</span>
              </button>
            </Transition>
          </div>
          <button class="agent-carousel-arrow" type="button" @click="nextSuggestion" aria-label="Next suggestion">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        <div class="agent-suggestion-dots">
          <button
            v-for="(_, i) in suggestions"
            :key="i"
            class="agent-suggestion-dot"
            :class="{ 'agent-suggestion-dot--active': i === currentSuggestionIndex }"
            type="button"
            @click="goToSuggestion(i)"
            :aria-label="`Suggestion ${i + 1}`"
          ></button>
        </div>
      </div>

      <!-- Composer card -->
      <form class="agent-composer" @submit.prevent="sendMessage">
        <textarea
          ref="inputEl"
          v-model="userInput"
          class="agent-input"
          :placeholder="composerPlaceholder"
          rows="1"
          :disabled="isSending || usageLimitReached"
          @input="autoResize"
        ></textarea>
        <div class="agent-composer-toolbar">
          <span v-if="isSending" class="agent-status-label">{{ sendButtonLabel }}</span>
          <span v-else class="agent-composer-hint">Try a prompt or type your own question</span>
          <button
            class="agent-send-btn"
            :class="{ 'agent-send-btn--ready': userInput.trim() && !isSending && !usageLimitReached }"
            type="submit"
            :disabled="isSending || usageLimitReached || !userInput.trim()"
            aria-label="Send"
          >
            <svg v-if="!isSending" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span v-if="!isSending" class="agent-send-btn-label">Send</span>
            <span v-else class="agent-send-spinner" aria-hidden="true"></span>
          </button>
        </div>
      </form>
    </div>

    </section>

    <section class="agent-wheel-surface">
      <section
        class="agent-wheel-section"
        :class="[
          'agent-wheel-section--shell',
          { 'agent-wheel-section--hero': isHeroMode },
        ]"
      >
        <div class="agent-wheel-section__header">
          <span class="section-eyebrow">How It Works</span>
          <h2 class="agent-wheel-section__title">See the Wheel process from ask to allocation to repeat income.</h2>
          <p class="agent-wheel-section__copy">
            This slider walks through how PutPulse turns one prompt into a quality screen,
            a cash-secured put plan, and a repeatable Wheel workflow.
          </p>
        </div>
        <WheelAnimationSlider />
        <div class="agent-wheel-cta">
          <h3 class="agent-wheel-cta__title">Ready to start generating income?</h3>
          <p class="agent-wheel-cta__copy">
            Join thousands of investors using data-driven strategies to sell puts on
            <span class="agent-wheel-cta__accent">quality companies</span>
          </p>
          <div class="agent-wheel-cta__actions">
            <a class="btn btn-primary" href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
            <button class="btn btn-outline" type="button" @click="emit('open-wheel-guide')">See How It Works</button>
          </div>
        </div>
      </section>
    </section>

    <footer class="agent-site-footer">
      <div class="agent-site-footer__links" aria-label="Site links">
        <a href="/" @click="navigateRoute($event, '/')">Home</a>
        <a href="/about" @click="navigateRoute($event, '/about')">About</a>
        <a href="/contact" @click="navigateRoute($event, '/contact')">Contact</a>
        <a href="/pricing" @click="navigateRoute($event, '/pricing')">Pricing</a>
        <a href="/terms" @click="navigateRoute($event, '/terms')">Terms of Service</a>
        <a href="/privacy" @click="navigateRoute($event, '/privacy')">Privacy Policy</a>
        <a href="/refund-policy" @click="navigateRoute($event, '/refund-policy')">Refund Policy</a>
        <a href="/sign-up" @click="navigateRoute($event, '/sign-up')">Start For Free</a>
      </div>
      <p class="agent-site-footer__disclaimer">
        This application is for informational and educational purposes only and does not constitute
        financial, investment, or trading advice. Options trading involves significant risk and may not
        be suitable for all investors. Past performance is not indicative of future results. You are
        solely responsible for your investment decisions.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { requestJson } from '../api/client';
import { getDeviceFingerprint } from '../api/deviceFingerprint';
import { useAuthStore } from '../stores/auth';
import WheelAnimationSlider from '../components/WheelAnimationSlider.vue';
import StructuredTable from '../components/StructuredTable.vue';

marked.use({ breaks: true, gfm: true });

const props = defineProps({
  watchlistTickers: {
    type: Array,
    default: () => [],
  },
  watchlistPendingTickers: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['login-required', 'sign-up-required', 'open-pricing', 'open-ticker', 'toggle-watchlist', 'open-wheel-guide', 'navigate-route']);
const auth = useAuthStore();

const navigateRoute = (event, path) => emit('navigate-route', event, path);

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 120000;
const QUEUED_LABEL = 'Queued...';
const THINKING_LABEL = 'Thinking...';

const isQueuedStatus = (status) => ['pending', 'queued'].includes(String(status ?? '').toLowerCase());

const isUsageLimitReached = (value) => {
  if (typeof value === 'string') return /(?:daily|weekly)(?:_[a-z_]+)?_limit_reached/i.test(value);
  if (Array.isArray(value)) return value.some(isUsageLimitReached);
  if (value && typeof value === 'object') return Object.values(value).some(isUsageLimitReached);
  return false;
};

const isAnalyzeStockUsageLimit = (value) => {
  if (typeof value === 'string') return /(?:daily|weekly)_analyze_stock_limit_reached/i.test(value);
  if (Array.isArray(value)) return value.some(isAnalyzeStockUsageLimit);
  if (value && typeof value === 'object') return Object.values(value).some(isAnalyzeStockUsageLimit);
  return false;
};

const usageLimitPeriod = (value) => {
  if (typeof value === 'string') return /weekly_limit_reached/i.test(value) ? 'weekly' : 'daily';
  if (Array.isArray(value)) return value.find(isUsageLimitReached) ? usageLimitPeriod(value.find(isUsageLimitReached)) : 'daily';
  if (value && typeof value === 'object') {
    const limitValue = Object.values(value).find(isUsageLimitReached);
    return limitValue ? usageLimitPeriod(limitValue) : 'daily';
  }
  return 'daily';
};

const showUsageLimit = (value, assistantMessageIndex) => {
  if (!isUsageLimitReached(value)) return false;
  cancelActiveJob();
  jobError.value = '';
  reachedUsageLimitPeriod.value = usageLimitPeriod(value);
  usageLimitReached.value = true;
  if (Number.isInteger(assistantMessageIndex)) {
    conversationHistory.value.splice(assistantMessageIndex, 1);
  }
  if (isAnalyzeStockUsageLimit(value) && auth.isAuthenticated.value) {
    emit('open-pricing');
  }
  void scrollToBottom();
  return true;
};

const renderMarkdown = (text, omitTables = false) => {
  const html = DOMPurify.sanitize(marked.parse(text ?? ''));
  const el = document.createElement('div');
  el.innerHTML = html;
  if (omitTables) {
    el.querySelectorAll('table').forEach((table) => table.remove());
  }
  el.querySelectorAll('table').forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach((tr) => {
      [...tr.querySelectorAll('td')].forEach((td, index) => {
        const header = headers[index] ?? '';
        if (header) td.setAttribute('data-label', header);

        if (/ticker|symbol/i.test(header)) {
          td.classList.add('md-ticker-cell');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'md-ticker-text md-ticker-button';
          button.dataset.ticker = td.textContent.trim().toUpperCase();
          while (td.firstChild) {
            button.appendChild(td.firstChild);
          }
          td.appendChild(button);
          const watchlistButton = document.createElement('button');
          watchlistButton.type = 'button';
          watchlistButton.className = 'md-watchlist-button';
          watchlistButton.dataset.ticker = button.dataset.ticker;
          const isWatched = props.watchlistTickers.includes(button.dataset.ticker);
          watchlistButton.classList.toggle('is-saved', isWatched);
          watchlistButton.setAttribute('aria-label', `${isWatched ? 'Remove' : 'Add'} ${button.dataset.ticker} ${isWatched ? 'from' : 'to'} watchlist`);
          watchlistButton.textContent = isWatched ? '★' : '☆';
          td.appendChild(watchlistButton);
        }
      });
    });
    const wrap = document.createElement('div');
    wrap.className = 'md-table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
  return el.innerHTML;
};

const responseBlocks = (result) => Array.isArray(result?.blocks) ? result.blocks : [];
const messageBlocks = (message) => Array.isArray(message?.blocks) ? message.blocks : [];
const isRenderableStructuredTable = (block) => (
  Array.isArray(block?.columns)
  && block.columns.some((column) => column?.key && column?.label)
  && Array.isArray(block?.rows)
  && block.rows.length > 0
);
const structuredTableBlocks = (message) => messageBlocks(message).filter(isRenderableStructuredTable);

const logCompletedResponse = (data, answer, blocks) => {
  console.groupCollapsed('Agent completed response');
  console.log('Raw backend response:', data);
  console.log('Answer:', answer);
  console.log('Blocks:', blocks);
  const tables = blocks.filter(isRenderableStructuredTable);
  console.log('Renderable structured tables:', tables);
  tables.forEach((table, index) => {
    const volumeColumn = table.columns.find((column) => column?.key === 'option_volume');
    console.group(`Table ${index + 1}: ${table.title || 'Untitled'}`);
    console.log('Columns:', table.columns);
    console.table(table.rows);
    if (volumeColumn) {
      console.log('option_volume values:', table.rows.map((row) => row?.option_volume));
    } else {
      console.warn('No option_volume column returned by the endpoint.');
    }
    console.groupEnd();
  });
  console.groupEnd();
};

const quickPromptChips = [
  'How It Works',  
  'Find income-generating put ideas under 200$',
  'Build a monthly income plan',
  'What makes a stock worth selling puts on?',
];

const wheelGuidePrompts = new Set(['How It Works']);

const suggestions = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    text: 'Screen high-quality stocks for cash-secured puts with 2–3% monthly ROI and strong fundamentals.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    text: 'I have $25,000. Build a wheel strategy income plan with position sizing and monthly targets.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    text: 'Walk me through the full wheel cycle: selling a put, getting assigned, then selling a covered call.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    text: 'Why is assignment a feature and not a bug? Explain the wheel strategy logic for a beginner.',
  },
];

const userInput = ref('');
const conversationHistory = ref([]);
const conversations = ref([]);
const screeningRuns = ref([]);
const activeConversationId = ref(null);
const isLoadingConversations = ref(false);
const isLoadingConversation = ref(false);
const isSending = ref(false);
const currentJobId = ref(null);
const jobStatus = ref('');
const jobError = ref('');
const usageLimitReached = ref(false);
const reachedUsageLimitPeriod = ref('daily');
const messagesEl = ref(null);
const inputEl = ref(null);
const activePollToken = ref(0);
let pollTimeoutId = null;
const runElements = new Map();

const isHeroMode = computed(() => !conversationHistory.value.length);
const sendButtonLabel = computed(() => (isQueuedStatus(jobStatus.value) ? QUEUED_LABEL : THINKING_LABEL));
const composerPlaceholder = computed(() => (
  usageLimitReached.value
    ? auth.isAuthenticated.value
      ? 'Your AI question limit has been reached. Upgrade to continue.'
      : 'Create a free account to continue asking the AI.'
    : 'Ask the AI to screen puts, build an income plan, or explain the wheel strategy...'
));
const usageLimitTitle = computed(() => (
  auth.isAuthenticated.value
    ? `You’ve reached your ${reachedUsageLimitPeriod.value} AI question limit`
    : `You’ve reached this ${reachedUsageLimitPeriod.value === 'daily' ? 'day’s' : 'week’s'} free AI questions`
));
const usageLimitDescription = computed(() => (
  auth.isAuthenticated.value
    ? 'Upgrade your plan for more AI research, full chat history, and uninterrupted strategy analysis.'
    : 'Create a free PutPulse account to keep exploring strategies, save your chats, and get more AI access.'
));

const currentSuggestionIndex = ref(0);
const carouselTransition = ref('carousel-next');
let suggestionIntervalId = null;

const resetSuggestionInterval = () => {
  if (suggestionIntervalId !== null) clearInterval(suggestionIntervalId);
  suggestionIntervalId = setInterval(() => {
    carouselTransition.value = 'carousel-next';
    currentSuggestionIndex.value = (currentSuggestionIndex.value + 1) % suggestions.length;
  }, 3500);
};

const nextSuggestion = () => {
  carouselTransition.value = 'carousel-next';
  currentSuggestionIndex.value = (currentSuggestionIndex.value + 1) % suggestions.length;
  resetSuggestionInterval();
};

const prevSuggestion = () => {
  carouselTransition.value = 'carousel-prev';
  currentSuggestionIndex.value = (currentSuggestionIndex.value - 1 + suggestions.length) % suggestions.length;
  resetSuggestionInterval();
};

const goToSuggestion = (i) => {
  carouselTransition.value = i > currentSuggestionIndex.value ? 'carousel-next' : 'carousel-prev';
  currentSuggestionIndex.value = i;
  resetSuggestionInterval();
};

onMounted(() => {
  resetSuggestionInterval();
  void loadConversations();
});

const scrollToBottom = async () => {
  await nextTick();
  messagesEl.value?.lastElementChild?.scrollIntoView({ block: 'nearest' });
};

const scrollToConversationStart = async () => {
  await nextTick();
  messagesEl.value?.firstElementChild?.scrollIntoView({ block: 'start' });
};

const extractHistoryItems = (data) => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  return [data.results, data.history, data.items, data.data]
    .find((value) => Array.isArray(value)) ?? [];
};

const normalizeHistoryMessage = (message) => {
  if (!message || typeof message !== 'object') return null;
  const role = message.role === 'assistant' ? 'assistant' : message.role === 'user' ? 'user' : null;
  const content = typeof message.content === 'string' ? message.content.trim() : '';
  return role && content ? {
    role,
    content,
    ...(role === 'assistant' && responseBlocks(message).length ? { blocks: responseBlocks(message) } : {}),
    ...(role === 'assistant' && (message.finished_at ?? message.finishedAt ?? message.completed_at) ? { finishedAt: message.finished_at ?? message.finishedAt ?? message.completed_at } : {}),
  } : null;
};

const normalizeHistoryItem = (item) => {
  const message = normalizeHistoryMessage(item);
  if (message) return [message];
  if (!item || typeof item !== 'object') return [];

  const query = [item.query, item.question, item.prompt].find((value) => typeof value === 'string' && value.trim());
  const answer = [item.answer, item.response].find((value) => typeof value === 'string' && value.trim());
  const messages = [];
  if (query) messages.push({ role: 'user', content: query.trim() });
  if (answer) {
    messages.push({
      role: 'assistant',
      content: answer.trim(),
      ...(responseBlocks(item).length ? { blocks: responseBlocks(item) } : {}),
      ...(item.finished_at ?? item.finishedAt ?? item.completed_at ? { finishedAt: item.finished_at ?? item.finishedAt ?? item.completed_at } : {}),
    });
  }
  return messages;
};

const normalizeConversation = (item) => {
  if (!item || typeof item !== 'object') return null;
  const id = item.conversation_id ?? item.conversationId ?? item.id;
  if (id === null || id === undefined || id === '') return null;
  const title = [item.title, item.query, item.question, item.prompt]
    .find((value) => typeof value === 'string' && value.trim())?.trim() ?? 'New conversation';
  const preview = [item.preview, item.answer, item.response]
    .find((value) => typeof value === 'string' && value.trim())?.trim() ?? '';
  return { id: String(id), title, preview, freshness: item.freshness };
};

const normalizeScreeningRun = (run) => {
  if (!run || typeof run !== 'object') return null;
  const jobId = run.job_id ?? run.jobId ?? run.id;
  if (jobId === null || jobId === undefined) return null;
  return {
    jobId: String(jobId),
    query: typeof run.query === 'string' ? run.query : '',
    answer: typeof run.answer === 'string' ? run.answer : '',
    blocks: responseBlocks(run),
    dataAsOf: run.data_as_of ?? run.dataAsOf ?? null,
    finishedAt: run.finished_at ?? run.finishedAt ?? run.completed_at ?? null,
    dataStatus: run.data_status ?? run.dataStatus ?? '',
    snapshotNotice: run.snapshot_notice ?? run.snapshotNotice ?? '',
    refreshOfRunId: run.refresh_of_run_id ?? run.refreshOfRunId ?? null,
    refreshAction: run.refresh_action ?? run.refreshAction ?? null,
  };
};

const extractScreeningRuns = (data) => Array.isArray(data?.screening_runs)
  ? data.screening_runs.map(normalizeScreeningRun).filter(Boolean)
  : [];

const attachRunTimestamps = (messages, runs) => messages.map((message) => {
  if (message.role !== 'assistant') return message;
  const matchingRun = runs.find((run) => run.answer.trim() === message.content.trim());
  if (!matchingRun) return message;
  return {
    ...message,
    ...(message.finishedAt || !matchingRun.finishedAt ? {} : { finishedAt: matchingRun.finishedAt }),
    isHistoricalMarketData: true,
  };
});

const formatDataStatus = (status) => String(status ?? '')
  .replace(/_/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Not screened';

const formatRunDate = (date) => {
  if (!date) return 'Screening run';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'Screening run' : new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
  }).format(parsed);
};

const formatDataAsOf = (date) => {
  if (!date) return 'Not available';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not available';
  return `${new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
  }).format(parsed)} ET`;
};

const formatAnswerTimestamp = (finishedAt) => {
  if (!finishedAt || Number.isNaN(new Date(finishedAt).getTime())) return null;
  return `${new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/New_York',
  }).format(new Date(finishedAt))} ET`;
};

const runLabel = (run) => run.refreshOfRunId ? 'Refreshed screen' : 'Original screen';
const setRunElement = (jobId, element) => {
  if (element) runElements.set(String(jobId), element);
  else runElements.delete(String(jobId));
};
const scrollToRun = (jobId) => runElements.get(String(jobId))?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const loadConversations = async () => {
  if (!auth.isAuthenticated.value || isLoadingConversations.value) return;

  isLoadingConversations.value = true;
  try {
    const data = await requestJson('/api/agent/', {
      method: 'GET',
      params: { limit: 50 },
      auth: true,
    });
    conversations.value = extractHistoryItems(data)
      .map(normalizeConversation)
      .filter((conversation) => conversation?.freshness === 'historical')
      .slice(0, 5);
  } catch (err) {
    if (err?.status === 401) handleUnauthorized();
    else console.warn('Failed to load agent conversations.', err);
  } finally {
    isLoadingConversations.value = false;
  }
};

const startNewConversation = () => {
  cancelActiveJob();
  activeConversationId.value = null;
  conversationHistory.value = [];
  screeningRuns.value = [];
  jobError.value = '';
  usageLimitReached.value = false;
  reachedUsageLimitPeriod.value = 'daily';
  userInput.value = '';
  if (inputEl.value) inputEl.value.style.height = 'auto';
  void nextTick(() => inputEl.value?.focus());
};

const selectConversation = async (conversation) => {
  if (!conversation?.id || isLoadingConversation.value || isSending.value) return;

  cancelActiveJob();
  isLoadingConversation.value = true;
  jobError.value = '';
  try {
    const data = await requestJson('/api/agent/', {
      method: 'GET',
      params: { conversation_id: conversation.id },
      auth: true,
    });
    const runs = extractScreeningRuns(data);
    const messages = attachRunTimestamps(extractHistoryItems(data)
      .flatMap(normalizeHistoryItem), runs);
    conversationHistory.value = messages;
    screeningRuns.value = runs;
    activeConversationId.value = conversation.id;
    usageLimitReached.value = false;
    await scrollToConversationStart();
  } catch (err) {
    if (err?.status === 401) handleUnauthorized();
    else jobError.value = err.message || 'Failed to load this conversation. Please try again.';
  } finally {
    isLoadingConversation.value = false;
  }
};

const refreshRun = async (run) => {
  if (!run?.refreshAction?.refreshRunId || isSending.value) return;
  cancelActiveJob();
  jobError.value = '';
  isSending.value = true;
  jobStatus.value = 'pending';
  const pollToken = activePollToken.value + 1;
  const pollStartedAt = Date.now();
  activePollToken.value = pollToken;

  try {
    const deviceFingerprint = getDeviceFingerprint();
    const data = await requestJson('/api/agent/', {
      method: 'POST',
      body: { refresh_run_id: run.refreshAction.refreshRunId },
      headers: deviceFingerprint ? { 'X-Device-Fingerprint': deviceFingerprint } : undefined,
      auth: true,
    });
    const jobId = data?.job_id;
    if (!jobId) throw new Error('The server did not return a job ID.');
    currentJobId.value = jobId;
    jobStatus.value = String(data?.status ?? 'pending').toLowerCase();
    scheduleRefreshPoll(jobId, pollToken, pollStartedAt);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;
    if (err?.status === 401) return handleUnauthorized();
    jobError.value = err.message || 'Unable to refresh this screen. Please try again.';
    resetJobState();
  }
};

const scheduleRefreshPoll = (jobId, pollToken, pollStartedAt) => {
  clearPollTimeout();
  pollTimeoutId = window.setTimeout(() => void pollRefreshJob(jobId, pollToken, pollStartedAt), POLL_INTERVAL_MS);
};

const pollRefreshJob = async (jobId, pollToken, pollStartedAt) => {
  if (!jobId || pollToken !== activePollToken.value) return;
  if (Date.now() - pollStartedAt >= POLL_TIMEOUT_MS) {
    jobError.value = 'The refresh stayed queued for too long. Please try again.';
    resetJobState();
    return;
  }
  try {
    const data = await requestJson(`/api/agent/${jobId}/`, { method: 'GET', params: { _ts: Date.now() }, auth: true });
    if (pollToken !== activePollToken.value) return;
    const status = String(data?.status ?? '').toLowerCase();
    currentJobId.value = jobId;
    jobStatus.value = status;
    if (status === 'completed') {
      resetJobState();
      const conversation = conversations.value.find((item) => item.id === activeConversationId.value);
      if (conversation) await selectConversation(conversation);
      else if (activeConversationId.value) {
        const response = await requestJson('/api/agent/', { method: 'GET', params: { conversation_id: activeConversationId.value }, auth: true });
        conversationHistory.value = extractHistoryItems(response).flatMap(normalizeHistoryItem);
        screeningRuns.value = extractScreeningRuns(response);
      }
      void loadConversations();
      return;
    }
    if (status === 'failed') {
      jobError.value = typeof data?.error === 'string' ? data.error : 'The refresh failed. Please try again.';
      resetJobState();
      return;
    }
    scheduleRefreshPoll(jobId, pollToken, pollStartedAt);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;
    if (err?.status === 401) return handleUnauthorized();
    jobError.value = err.message || 'Failed to check refresh status. Please try again.';
    resetJobState();
  }
};

watch(auth.isAuthenticated, (isAuthenticated, wasAuthenticated) => {
  if (isAuthenticated && !wasAuthenticated) void loadConversations();
  if (!isAuthenticated && wasAuthenticated) startNewConversation();
});

const autoResize = () => {
  if (!inputEl.value) return;
  inputEl.value.style.height = 'auto';
  inputEl.value.style.height = `${Math.min(inputEl.value.scrollHeight, 160)}px`;
};

const clearPollTimeout = () => {
  if (pollTimeoutId !== null) {
    window.clearTimeout(pollTimeoutId);
    pollTimeoutId = null;
  }
};

const handleUnauthorized = () => {
  cancelActiveJob();
  jobError.value = '';
  emit('login-required');
};

const resetJobState = () => {
  clearPollTimeout();
  currentJobId.value = null;
  jobStatus.value = '';
  isSending.value = false;
};

const cancelActiveJob = () => {
  activePollToken.value += 1;
  resetJobState();
};

const updateAssistantMessage = async (messageIndex, content, blocks = undefined, finishedAt = undefined) => {
  if (!conversationHistory.value[messageIndex]) return;
  conversationHistory.value[messageIndex] = {
    ...conversationHistory.value[messageIndex],
    content,
    ...(blocks === undefined ? {} : { blocks }),
    ...(finishedAt === undefined ? {} : { finishedAt }),
  };
  await scrollToBottom();
};

const logUsedTools = (data) => {
  console.log('Agent used_tools:', Array.isArray(data?.used_tools) ? data.used_tools : []);
  console.log('Agent used_tool:', data?.used_tool ?? null);
};

const schedulePoll = (jobId, messageIndex, pollToken, pollStartedAt) => {
  clearPollTimeout();
  pollTimeoutId = window.setTimeout(() => {
    void pollJob(jobId, messageIndex, pollToken, pollStartedAt);
  }, POLL_INTERVAL_MS);
};

const pollJob = async (jobId, messageIndex, pollToken, pollStartedAt) => {
  if (!jobId || pollToken !== activePollToken.value) return;

  if (Date.now() - pollStartedAt >= POLL_TIMEOUT_MS) {
    const message = 'The agent stayed queued for too long. This usually means the backend worker did not pick up the job.';
    jobError.value = message;
    await updateAssistantMessage(messageIndex, `Error: ${message}`);
    resetJobState();
    return;
  }

  try {
    const deviceFingerprint = getDeviceFingerprint();
    const data = await requestJson(`/api/agent/${jobId}/`, {
      method: 'GET',
      params: { _ts: Date.now() },
      headers: deviceFingerprint ? { 'X-Device-Fingerprint': deviceFingerprint } : undefined,
      auth: true,
    });

    if (pollToken !== activePollToken.value) return;

    const status = String(data?.status ?? '').toLowerCase();
    const answer = typeof data?.answer === 'string' ? data.answer : '';
    const blocks = responseBlocks(data);
    const error = typeof data?.error === 'string' ? data.error : '';
    console.debug('Agent job status', { jobId, status });

    currentJobId.value = jobId;
    jobStatus.value = status;

    if (status === 'completed') {
      if (showUsageLimit(data, messageIndex)) return;
      jobError.value = '';
      logUsedTools(data);
      logCompletedResponse(data, answer, blocks);
      await updateAssistantMessage(messageIndex, answer || 'No response returned.', blocks, data?.finished_at);
      resetJobState();
      void loadConversations();
      return;
    }

    if (status === 'failed') {
      if (showUsageLimit(data, messageIndex)) return;
      const message = error || 'The agent request failed. Please try again.';
      jobError.value = message;
      await updateAssistantMessage(messageIndex, `Error: ${message}`);
      resetJobState();
      return;
    }

    await updateAssistantMessage(messageIndex, isQueuedStatus(status) ? QUEUED_LABEL : THINKING_LABEL);
    schedulePoll(jobId, messageIndex, pollToken, pollStartedAt);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;
    if (showUsageLimit(err?.data ?? err?.message, messageIndex)) return;
    if (err?.status === 401) {
      handleUnauthorized();
      return;
    }

    const message = err.message || 'Failed to check agent status. Please try again.';
    jobError.value = message;
    await updateAssistantMessage(messageIndex, `Error: ${message}`);
    resetJobState();
  }
};

const sendMessage = async () => {
  const query = userInput.value.trim();
  if (!query || isSending.value || usageLimitReached.value) return;

  cancelActiveJob();
  jobError.value = '';
  userInput.value = '';
  if (inputEl.value) inputEl.value.style.height = 'auto';

    const historyBeforeQuery = [...conversationHistory.value];
  const nextHistory = [
    ...historyBeforeQuery,
    { role: 'user', content: query },
    { role: 'assistant', content: QUEUED_LABEL },
  ];
  const assistantMessageIndex = nextHistory.length - 1;
  conversationHistory.value = nextHistory;
  await scrollToBottom();

  isSending.value = true;
  jobStatus.value = 'pending';

  const pollToken = activePollToken.value + 1;
  const pollStartedAt = Date.now();
  activePollToken.value = pollToken;

  try {
    const deviceFingerprint = getDeviceFingerprint();
    const data = await requestJson('/api/agent/', {
      method: 'POST',
      body: {
        query,
        history: historyBeforeQuery.map(({ role, content }) => ({ role, content })),
        ...(activeConversationId.value ? { conversation_id: activeConversationId.value } : {}),
      },
      headers: deviceFingerprint ? { 'X-Device-Fingerprint': deviceFingerprint } : undefined,
      auth: true,
    });

    if (pollToken !== activePollToken.value) return;

    const jobId = data?.job_id;
    const status = String(data?.status ?? '').toLowerCase();
    const answer = typeof data?.answer === 'string' ? data.answer : '';
    const blocks = responseBlocks(data);
    const error = typeof data?.error === 'string' ? data.error : '';
    if (data?.conversation_id ?? data?.conversationId) {
      activeConversationId.value = String(data.conversation_id ?? data.conversationId);
    }

    if (!jobId) {
      throw new Error('The server did not return a job ID.');
    }

    currentJobId.value = jobId;
    jobStatus.value = status || 'pending';
    jobError.value = '';

    if (status === 'completed') {
      if (showUsageLimit(data, assistantMessageIndex)) return;
      logUsedTools(data);
      logCompletedResponse(data, answer, blocks);
      await updateAssistantMessage(assistantMessageIndex, answer || 'No response returned.', blocks, data?.finished_at);
      resetJobState();
      void loadConversations();
      return;
    }

    if (status === 'failed') {
      if (showUsageLimit(data, assistantMessageIndex)) return;
      const message = error || 'The agent request failed. Please try again.';
      jobError.value = message;
      await updateAssistantMessage(assistantMessageIndex, `Error: ${message}`);
      resetJobState();
      return;
    }

    await updateAssistantMessage(
      assistantMessageIndex,
      isQueuedStatus(status) ? QUEUED_LABEL : THINKING_LABEL,
    );
    schedulePoll(jobId, assistantMessageIndex, pollToken, pollStartedAt);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;
    if (showUsageLimit(err?.data ?? err?.message, assistantMessageIndex)) return;
    if (err?.status === 401) {
      conversationHistory.value = historyBeforeQuery;
      userInput.value = query;
      if (inputEl.value) {
        inputEl.value.style.height = 'auto';
        autoResize();
      }
      handleUnauthorized();
      return;
    }

    const message = err.message || 'Something went wrong. Please try again.';
    jobError.value = message;
    await updateAssistantMessage(assistantMessageIndex, `Error: ${message}`);
    resetJobState();
  } finally {
    await nextTick();
    inputEl.value?.focus();
  }
};

const useSuggestion = (text) => {
  if (wheelGuidePrompts.has(text)) {
    emit('open-wheel-guide');
    return;
  }
  userInput.value = text;
  void sendMessage();
};

const requestSignUp = () => emit('sign-up-required');
const requestLogin = () => emit('login-required');
const requestUpgrade = () => emit('open-pricing');
const requestTickerDetails = (ticker) => {
  if (ticker) emit('open-ticker', ticker);
};
const requestWatchlistToggle = (ticker) => {
  if (ticker) emit('toggle-watchlist', ticker);
};
const handleMarkdownTickerClick = (event) => {
  const watchlistButton = event.target.closest('.md-watchlist-button');
  if (watchlistButton?.dataset.ticker) {
    requestWatchlistToggle(watchlistButton.dataset.ticker);
    return;
  }
  const tickerButton = event.target.closest('.md-ticker-button');
  if (tickerButton?.dataset.ticker) requestTickerDetails(tickerButton.dataset.ticker);
};

onUnmounted(() => {
  cancelActiveJob();
  if (suggestionIntervalId !== null) clearInterval(suggestionIntervalId);
});
</script>

<style scoped>
/* ── Page shell ─────────────────────────────────────────────────────────── */
.agent-page-shell {
  display: flex;
  flex-direction: column;
}

.agent-site-footer {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 2.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}

.agent-site-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem 1.1rem;
}

.agent-site-footer__links a {
  color: #94a3b8;
  font-size: 0.82rem;
  text-decoration: none;
}

.agent-site-footer__links a:hover {
  color: #67e8f9;
}

.agent-site-footer__disclaimer {
  max-width: 800px;
  margin: 1.25rem auto 0;
  color: #64748b;
  font-size: 0.78rem;
  line-height: 1.65;
  text-align: center;
}

.agent-page {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem 0 3rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 34%),
    radial-gradient(circle at 85% 20%, rgba(59, 130, 246, 0.14), transparent 28%),
    linear-gradient(180deg, #020617 0%, #08111f 52%, #0f172a 100%);
}

.agent-page--hero {
  min-height: calc(100vh - 4rem);
  justify-content: flex-start;
  align-items: center;
  padding: 2.25rem 1rem 3rem;
}

.agent-history-sidebar {
  position: absolute;
  z-index: 2;
  top: 2rem;
  left: max(1rem, calc(50% - 620px));
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 13.5rem;
  padding: 0.85rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.22);
  backdrop-filter: blur(12px);
}

.agent-new-chat-btn {
  width: 100%;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 0.6rem;
  padding: 0.58rem 0.7rem;
  background: rgba(14, 116, 144, 0.25);
  color: #e0f2fe;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 650;
  text-align: left;
  cursor: pointer;
}

.agent-new-chat-btn:hover { background: rgba(14, 116, 144, 0.42); }
.agent-new-chat-btn span { margin-right: 0.35rem; font-size: 1.1rem; line-height: 0; }
.agent-history-sidebar__heading { padding: 0.1rem 0.25rem; color: #94a3b8; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.agent-history-sidebar__list { display: grid; gap: 0.3rem; max-height: 19rem; overflow-y: auto; }
.agent-history-item { display: grid; gap: 0.2rem; width: 100%; padding: 0.55rem 0.6rem; border: 1px solid transparent; border-radius: 0.55rem; background: transparent; color: #cbd5e1; font: inherit; text-align: left; cursor: pointer; }
.agent-history-item:hover, .agent-history-item.is-active { border-color: rgba(56, 189, 248, 0.25); background: rgba(30, 41, 59, 0.75); }
.agent-history-item:disabled { cursor: wait; opacity: 0.6; }
.agent-history-item__title-row { display: flex; align-items: center; gap: 0.4rem; min-width: 0; }
.agent-history-item__title, .agent-history-item__preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agent-history-item__title-row .agent-history-item__title { min-width: 0; flex: 1; }
.agent-history-item__title { color: #e2e8f0; font-size: 0.78rem; font-weight: 600; }
.agent-history-item__preview { color: #94a3b8; font-size: 0.7rem; }
.agent-history-sidebar__list:not(.agent-history-sidebar__list--runs) .agent-history-item__title { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.agent-history-sidebar__list:not(.agent-history-sidebar__list--runs) .agent-history-item__preview { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal; }
.agent-history-item__freshness { flex: 0 0 auto; color: #fbbf24; font-size: 0.61rem; font-weight: 700; text-transform: uppercase; }
.agent-history-sidebar__empty { padding: 0.25rem; color: #64748b; font-size: 0.75rem; line-height: 1.45; }

.agent-wheel-surface {
  position: relative;
  padding: 3.1rem 0 3.5rem;
  background:
    radial-gradient(circle at 18% 0%, rgba(45, 212, 191, 0.14), transparent 24%),
    radial-gradient(circle at 82% 18%, rgba(125, 211, 252, 0.1), transparent 26%),
    linear-gradient(180deg, #111827 0%, #172033 42%, #0f172a 100%);
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.agent-wheel-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(148, 163, 184, 0.05), transparent 22%),
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.018) 0,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px,
      transparent 18px
    );
  pointer-events: none;
}

.agent-wheel-section {
  display: grid;
  gap: 1rem;
  width: 100%;
  margin-top: 0;
  position: relative;
  z-index: 1;
}

.agent-wheel-section--shell {
  width: min(1120px, calc(100% - 3rem));
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.agent-wheel-section--hero {
  margin-top: 0;
}

.agent-wheel-section__header {
  display: grid;
  gap: 0.45rem;
  max-width: 52rem;
}

.agent-wheel-section__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.4vw, 1.9rem);
  line-height: 1.15;
  color: #f8fafc;
}

.agent-wheel-section__copy {
  margin: 0;
  color: #94a3b8;
  line-height: 1.65;
  font-size: 0.95rem;
}

.agent-wheel-cta {
  display: grid;
  gap: 0.95rem;
  margin-top: 1.1rem;
  padding: 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    radial-gradient(circle at top, rgba(34, 211, 238, 0.08), transparent 48%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.76));
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.24);
}

.agent-wheel-cta__title {
  margin: 0;
  font-size: clamp(1.35rem, 2.3vw, 2rem);
  line-height: 1.12;
  color: #f8fafc;
}

.agent-wheel-cta__copy {
  margin: 0;
  max-width: 40rem;
  color: #cbd5e1;
  line-height: 1.7;
  font-size: 0.98rem;
}

.agent-wheel-cta__accent {
  color: #f8fafc;
  font-weight: 700;
}

.agent-wheel-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

/* ── Ambient glow ──────────────────────────────────────────────────────── */
.agent-glow-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.agent-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.agent-glow--1 {
  width: 55%;
  height: 55%;
  top: -8%;
  left: 15%;
  background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.11) 0%, transparent 70%);
}

.agent-glow--2 {
  width: 45%;
  height: 45%;
  bottom: 5%;
  right: 5%;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.09) 0%, transparent 70%);
}

.agent-glow--3 {
  width: 35%;
  height: 35%;
  bottom: 0;
  left: 0;
  background: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.07) 0%, transparent 70%);
}

/* ── Hero heading ──────────────────────────────────────────────────────── */
.agent-hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-width: 720px;
  width: 100%;
  z-index: 1;
}

.agent-hero-eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 2rem;
  padding: 0.3rem 0.9rem;
}

.agent-hero-title {
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #f8fafc;
}

.agent-hero-subtitle {
  margin: 0;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: #94a3b8;
  max-width: 520px;
  line-height: 1.6;
}

/* hero-fade transition */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Chat layout (active conversation) ────────────────────────────────── */
.agent-chat-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

/* The history panel is absolutely positioned on larger screens. Reserve its
   column in an active chat so expanding messages never slide beneath it. */
.agent-page:not(.agent-page--hero) .agent-chat-wrap {
  padding-left: 15.5rem;
}

.agent-chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
}

.agent-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.agent-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f8fafc;
}

.agent-subtitle {
  margin: 0;
  font-size: 0.88rem;
}

.agent-clear-btn {
  flex-shrink: 0;
  font-size: 0.8rem;
  padding: 0.4rem 0.85rem;
}

/* ── Messages ──────────────────────────────────────────────────────────── */
.agent-messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 240px;
  padding: 0 0.25rem 2rem 0;
}
.agent-screening-run { scroll-margin-top: 1rem; margin: 1.25rem 0; padding: 1rem; border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 0.75rem; background: rgba(15, 23, 42, 0.36); }
.agent-screening-run__heading { display: flex; justify-content: space-between; gap: 1rem; color: #cbd5e1; font-size: 0.82rem; }
.agent-screening-run__heading strong { color: #f8fafc; }
.agent-screening-run__metadata { display: grid; gap: 0.2rem; margin-top: 0.75rem; color: #94a3b8; font-size: 0.76rem; }
.agent-snapshot-warning { margin-top: 0.75rem; padding: 0.7rem 0.8rem; border: 1px solid rgba(251, 191, 36, 0.42); border-radius: 0.5rem; background: rgba(120, 53, 15, 0.25); color: #fde68a; font-size: 0.8rem; line-height: 1.45; }
.agent-refresh-btn { margin-top: 0.75rem; font-size: 0.78rem; }
.agent-screening-run .agent-message { margin-top: 0.9rem; }

.agent-message {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 80%;
  min-width: 0;
}

.agent-message--user {
  align-self: flex-end;
  align-items: flex-end;
}

.agent-message--assistant {
  align-self: flex-start;
  align-items: flex-start;
}

.agent-message-role {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}
.agent-message-timestamp { color: #64748b; font-weight: 500; }

.agent-bubble {
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  line-height: 1.55;
  word-break: break-word;
  max-width: 100%;
}

.agent-message--user .agent-bubble {
  white-space: pre-wrap;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(59, 130, 246, 0.15));
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-bottom-right-radius: 0.25rem;
  color: #e2e8f0;
}

.agent-message--assistant .agent-bubble {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-bottom-left-radius: 0.25rem;
  color: #cbd5e1;
}

/* ── Markdown styles ───────────────────────────────────────────────────── */
.agent-bubble--md :deep(p) { margin: 0 0 0.6em; }
.agent-bubble--md :deep(p:last-child) { margin-bottom: 0; }
.agent-bubble--md :deep(h1),
.agent-bubble--md :deep(h2),
.agent-bubble--md :deep(h3),
.agent-bubble--md :deep(h4) {
  color: #f1f5f9;
  font-weight: 600;
  margin: 0.9em 0 0.4em;
  line-height: 1.3;
}
.agent-bubble--md :deep(h1) { font-size: 1.1rem; }
.agent-bubble--md :deep(h2) { font-size: 1rem; }
.agent-bubble--md :deep(h3),
.agent-bubble--md :deep(h4) { font-size: 0.9rem; }
.agent-bubble--md :deep(ul),
.agent-bubble--md :deep(ol) {
  margin: 0.4em 0 0.6em;
  padding-left: 1.4em;
}
.agent-bubble--md :deep(li) { margin: 0.15em 0; }
.agent-bubble--md :deep(strong) { color: #f1f5f9; font-weight: 600; }
.agent-bubble--md :deep(.md-ticker-cell) { color: #4ade80; }
.agent-bubble--md :deep(.md-ticker-text) { color: #4ade80; font-weight: 700; }
.agent-bubble--md :deep(.md-ticker-button) { padding: 0; border: 0; background: transparent; cursor: pointer; font: inherit; }
.agent-bubble--md :deep(.md-ticker-button:hover),
.agent-bubble--md :deep(.md-ticker-button:focus-visible) { color: #67e8f9; text-decoration: underline; }
.agent-bubble--md :deep(.md-watchlist-button) { margin-left: 0.3rem; border: 0; padding: 0; background: transparent; color: #94a3b8; font: inherit; cursor: pointer; }
.agent-bubble--md :deep(.md-watchlist-button:hover),
.agent-bubble--md :deep(.md-watchlist-button:focus-visible),
.agent-bubble--md :deep(.md-watchlist-button.is-saved) { color: #fbbf24; }
.agent-bubble--md :deep(em) { color: #94a3b8; }
.agent-bubble--md :deep(code) {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 0.3rem;
  padding: 0.1em 0.4em;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.82em;
  color: #7dd3fc;
}
.agent-bubble--md :deep(pre) {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  margin: 0.6em 0;
}
.agent-bubble--md :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.83em;
  color: #e2e8f0;
}
.agent-bubble--md :deep(blockquote) {
  border-left: 3px solid rgba(34, 211, 238, 0.4);
  margin: 0.5em 0;
  padding: 0.1em 0.75em;
  color: #94a3b8;
}
.agent-bubble--md :deep(.md-table-wrap) {
  overflow-x: auto;
  margin: 0.6em 0;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  -webkit-overflow-scrolling: touch;
}
.agent-bubble--md :deep(table) {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.85rem;
  min-width: 480px;
}
.agent-bubble--md :deep(th),
.agent-bubble--md :deep(td) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  border-right: 1px solid rgba(148, 163, 184, 0.08);
  padding: 0.4rem 0.7rem;
  text-align: left;
  white-space: nowrap;
}
.agent-bubble--md :deep(th:last-child),
.agent-bubble--md :deep(td:last-child) { border-right: none; }
.agent-bubble--md :deep(th) {
  background: rgba(30, 41, 59, 0.9);
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  position: sticky;
  top: 0;
}
.agent-bubble--md :deep(tbody tr:last-child td) { border-bottom: none; }
.agent-bubble--md :deep(tr:nth-child(even) td) { background: rgba(15, 23, 42, 0.4); }
.agent-bubble--md :deep(hr) {
  border: none;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  margin: 0.75em 0;
}
.agent-bubble--md :deep(a) {
  color: #38bdf8;
  text-decoration: underline;
  text-decoration-color: rgba(56, 189, 248, 0.4);
}

@media (max-width: 900px) {
  .agent-history-sidebar {
    position: relative;
    top: auto;
    left: auto;
    width: calc(100% - 2rem);
    margin: 0 1rem 1rem;
  }

  .agent-page:not(.agent-page--hero) .agent-chat-wrap {
    padding-left: 0;
  }

  .agent-history-sidebar__list {
    display: flex;
    max-height: none;
    overflow-x: auto;
  }

  .agent-history-item { flex: 0 0 10.5rem; }

  .agent-wheel-section {
    gap: 0.85rem;
  }

  .agent-bubble--md :deep(.md-table-wrap) {
    overflow-x: visible;
    border: none;
    background: transparent;
  }
  .agent-bubble--md :deep(table),
  .agent-bubble--md :deep(tbody) {
    display: block;
    min-width: unset;
    width: 100%;
  }
  .agent-bubble--md :deep(thead) { display: none; }
  .agent-bubble--md :deep(tr) {
    display: block;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 0.6rem;
    margin-bottom: 0.6rem;
    padding: 0.25rem 0;
  }
  .agent-bubble--md :deep(tr:nth-child(even) td) { background: transparent; }
  .agent-bubble--md :deep(td) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    border-right: none;
    border-bottom: 2px solid rgba(148, 163, 184, 0.08);
    white-space: normal;
    font-size: 0.83rem;
  }
  .agent-bubble--md :deep(td:last-child) { border-bottom: none; }
  .agent-bubble--md :deep(td::before) {
    content: attr(data-label);
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    flex-shrink: 0;
    min-width: 40%;
  }
}

/* ── Error ─────────────────────────────────────────────────────────────── */
.agent-limit-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.1rem 1.2rem;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.2), rgba(30, 64, 175, 0.16));
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.18);
}

.agent-limit-card__icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(34, 211, 238, 0.14);
  color: #67e8f9;
}

.agent-limit-card__icon svg {
  width: 1.3rem;
  height: 1.3rem;
}

.agent-limit-card__content h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 1rem;
  line-height: 1.35;
}

.agent-limit-card__content p {
  margin: 0.35rem 0 0;
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
}

.agent-limit-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem 1rem;
  margin-top: 0.9rem;
}

.agent-limit-card__actions .btn {
  min-height: 2.4rem;
  padding: 0.5rem 0.95rem;
  font-size: 0.82rem;
}

.agent-limit-card__login {
  padding: 0;
  border: none;
  background: transparent;
  color: #7dd3fc;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.agent-limit-card__login:hover {
  color: #e0f2fe;
  text-decoration: underline;
}

.agent-error {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 0.75rem;
  color: #fca5a5;
  font-size: 0.875rem;
}

/* ── Composer outer ────────────────────────────────────────────────────── */
.agent-composer-outer {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: min(1120px, calc(100% - 3rem));
  min-width: 0;
  margin: 0 auto;
  padding: 0;
  z-index: 1;
}

.agent-composer-outer--hero {
  max-width: 720px;
}

.agent-prompt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
}

.agent-prompt-chips--hero {
  justify-content: center;
}

.agent-prompt-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  max-width: 100%;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.agent-prompt-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.45);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
}

/* ── Composer card ─────────────────────────────────────────────────────── */
.agent-composer {
  width: 100%;
  min-width: 0;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1.25rem;
  padding: 1rem 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.agent-composer--chat {
  margin-top: 1rem;
}

.agent-composer:focus-within {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(56, 189, 248, 0.2);
}

/* Hero mode: larger box */
.agent-composer-outer--hero .agent-composer {
  border-radius: 1.5rem;
  padding: 1.25rem 1.25rem 1rem;
  min-height: 7rem;
}

/* ── Input ─────────────────────────────────────────────────────────────── */
.agent-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #0f172a;
  font: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  overflow-y: auto;
  min-height: 3rem;
  max-height: 200px;
}

.agent-input::placeholder {
  color: #94a3b8;
}

.agent-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Composer toolbar ──────────────────────────────────────────────────── */
.agent-composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.agent-status-label,
.agent-composer-hint {
  font-size: 0.75rem;
  color: #94a3b8;
}

.agent-status-label {
  color: #64748b;
  font-style: italic;
}

/* ── Send button ───────────────────────────────────────────────────────── */
.agent-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-width: 5.1rem;
  height: 2.5rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: #cbd5e1;
  border: none;
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s, opacity 0.15s, color 0.15s, box-shadow 0.15s;
}

.agent-send-btn--ready {
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: #04111d;
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.28);
}

.agent-send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #67e8f9, #60a5fa);
  transform: scale(1.06);
}

.agent-send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.agent-send-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.agent-send-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(12, 18, 33, 0.3);
  border-top-color: #0c1221;
  border-radius: 50%;
  animation: agent-spin 0.6s linear infinite;
}

.agent-send-btn-label {
  font-size: 0.82rem;
  font-weight: 700;
}

@keyframes agent-spin {
  to { transform: rotate(360deg); }
}

/* ── Carousel suggestions ──────────────────────────────────────────────── */
.agent-suggestions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
}

.agent-carousel {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  max-width: 760px;
}

.agent-carousel-track {
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  overflow: hidden;
}

.agent-carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  padding: 0;
}

.agent-carousel-arrow:hover {
  border-color: rgba(34, 211, 238, 0.35);
  color: #e2e8f0;
  background: rgba(34, 211, 238, 0.06);
}

.agent-suggestion-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 2rem;
  color: #94a3b8;
  font: inherit;
  font-size: 0.85rem;
  padding: 0.5rem 1.1rem;
  cursor: pointer;
  width: 100%;
  max-width: 100%;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.35;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.agent-suggestion-btn:hover {
  border-color: rgba(34, 211, 238, 0.4);
  color: #e2e8f0;
  background: rgba(34, 211, 238, 0.06);
}

.agent-suggestion-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #38bdf8;
}

.agent-suggestion-label {
  min-width: 0;
}

/* directional slide transitions */
.carousel-next-enter-active,
.carousel-next-leave-active,
.carousel-prev-enter-active,
.carousel-prev-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
  position: absolute;
}

.carousel-next-enter-from { opacity: 0; transform: translateX(28px); }
.carousel-next-leave-to   { opacity: 0; transform: translateX(-28px); }
.carousel-prev-enter-from { opacity: 0; transform: translateX(-28px); }
.carousel-prev-leave-to   { opacity: 0; transform: translateX(28px); }

/* dots */
.agent-suggestion-dots {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.agent-suggestion-dot {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.agent-suggestion-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.32);
  transition: background 0.25s, width 0.25s, transform 0.25s;
}

.agent-suggestion-dot--active {
  transform: scale(1.02);
}

.agent-suggestion-dot--active::before {
  background: #38bdf8;
  width: 20px;
}

.agent-suggestion-dot:hover:not(.agent-suggestion-dot--active)::before {
  background: rgba(148, 163, 184, 0.6);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .agent-page--hero {
    padding: 1.4rem 0.75rem 2rem;
  }

  .agent-wheel-section--shell {
    width: min(1120px, calc(100% - 1.25rem));
  }

  .agent-wheel-surface {
    padding: 2.35rem 0 2.75rem;
  }

  .agent-wheel-cta {
    padding: 1.2rem;
  }

  .agent-wheel-cta__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .agent-chat-header {
    flex-direction: column;
    align-items: stretch;
  }

  .agent-clear-btn {
    align-self: flex-start;
  }

  .agent-limit-card {
    gap: 0.8rem;
    padding: 1rem;
  }

  .agent-limit-card__actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.7rem;
  }

  .agent-messages {
    gap: 0.85rem;
    max-height: none;
    padding-right: 0;
  }

  .agent-message {
    max-width: 100%;
  }

  .agent-message--assistant {
    width: 100%;
  }

  .agent-message-role {
    padding-inline: 0.2rem;
    color: #94a3b8;
  }

  .agent-message--assistant .agent-bubble {
    width: 100%;
    padding: 0.95rem 1rem;
    background: rgba(248, 250, 252, 0.98);
    border-color: rgba(203, 213, 225, 0.9);
    border-bottom-left-radius: 1rem;
    color: #0f172a;
    box-shadow: 0 14px 32px rgba(2, 6, 23, 0.18);
  }

  .agent-message--assistant .agent-bubble--md :deep(h1),
  .agent-message--assistant .agent-bubble--md :deep(h2),
  .agent-message--assistant .agent-bubble--md :deep(h3),
  .agent-message--assistant .agent-bubble--md :deep(h4),
  .agent-message--assistant .agent-bubble--md :deep(strong) {
    color: #020617;
  }

  .agent-message--assistant .agent-bubble--md :deep(.md-ticker-cell),
  .agent-message--assistant .agent-bubble--md :deep(.md-ticker-text) {
    color: #16a34a;
  }

  .agent-message--assistant .agent-bubble--md :deep(em),
  .agent-message--assistant .agent-bubble--md :deep(blockquote) {
    color: #475569;
  }

  .agent-message--assistant .agent-bubble--md :deep(code) {
    background: rgba(226, 232, 240, 0.9);
    border-color: rgba(148, 163, 184, 0.35);
    color: #0f172a;
  }

  .agent-message--assistant .agent-bubble--md :deep(pre) {
    background: #0f172a;
    border-color: rgba(15, 23, 42, 0.92);
  }

  .agent-message--assistant .agent-bubble--md :deep(pre code) {
    color: #e2e8f0;
  }

  .agent-message--assistant .agent-bubble--md :deep(blockquote) {
    background: rgba(241, 245, 249, 0.9);
    border-left-color: rgba(14, 165, 233, 0.55);
    border-radius: 0.75rem;
    padding: 0.65rem 0.85rem;
  }

  .agent-message--assistant .agent-bubble--md :deep(th) {
    background: rgba(226, 232, 240, 0.95);
    color: #334155;
  }

  .agent-message--assistant .agent-bubble--md :deep(tr) {
    background: rgba(241, 245, 249, 0.95);
    border-color: rgba(203, 213, 225, 0.9);
  }

  .agent-message--assistant .agent-bubble--md :deep(td::before) {
    color: #475569;
  }

  .agent-composer-toolbar {
    align-items: flex-end;
    gap: 0.75rem;
  }

  .agent-composer-hint {
    display: block;
    line-height: 1.45;
  }

  .agent-prompt-chip {
    width: 100%;
    justify-content: center;
  }
}
</style>

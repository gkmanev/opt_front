<template>
  <section class="agent-page" :class="{ 'agent-page--hero': isHeroMode }">

    <!-- Ambient glow (hero only) -->
    <div v-if="isHeroMode" class="agent-glow-bg" aria-hidden="true">
      <div class="agent-glow agent-glow--1"></div>
      <div class="agent-glow agent-glow--2"></div>
      <div class="agent-glow agent-glow--3"></div>
    </div>

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
          <span class="section-eyebrow">AI Assistant</span>
          <h1 class="agent-title">Ask the AI Agent</h1>
          <p class="agent-subtitle muted">Ask anything about options strategies, stocks, or investment ideas.</p>
        </div>
        <button
          v-if="conversationHistory.length"
          class="btn btn-muted agent-clear-btn"
          type="button"
          @click="clearConversation"
        >
          Clear
        </button>
      </div>

      <div class="agent-messages" ref="messagesEl">
        <template v-for="(msg, idx) in conversationHistory" :key="idx">
          <div
            class="agent-message"
            :class="msg.role === 'user' ? 'agent-message--user' : 'agent-message--assistant'"
          >
            <span class="agent-message-role">{{ msg.role === 'user' ? 'You' : 'AI' }}</span>
            <div
              v-if="msg.role === 'assistant'"
              class="agent-bubble agent-bubble--md"
              v-html="renderMarkdown(msg.content)"
            ></div>
            <div v-else class="agent-bubble">{{ msg.content }}</div>
          </div>
        </template>
      </div>

      <div v-if="jobError" class="agent-error" role="alert">{{ jobError }}</div>

      <form class="agent-composer agent-composer--chat" @submit.prevent="sendMessage">
        <textarea
          ref="inputEl"
          v-model="userInput"
          class="agent-input"
          placeholder="Ask the AI to screen puts, build an income plan, or explain the wheel strategy..."
          rows="1"
          :disabled="isSending"
          @input="autoResize"
        ></textarea>
        <div class="agent-composer-toolbar">
          <span v-if="isSending" class="agent-status-label">{{ sendButtonLabel }}</span>
          <span v-else class="agent-composer-hint">Try a prompt or type your own question</span>
          <button
            class="agent-send-btn"
            :class="{ 'agent-send-btn--ready': userInput.trim() && !isSending }"
            type="submit"
            :disabled="isSending || !userInput.trim()"
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
                <span class="agent-suggestion-icon">{{ suggestions[currentSuggestionIndex].icon }}</span>
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
          placeholder="Ask the AI to screen puts, build an income plan, or explain the wheel strategy..."
          rows="1"
          :disabled="isSending"
          @input="autoResize"
        ></textarea>
        <div class="agent-composer-toolbar">
          <span v-if="isSending" class="agent-status-label">{{ sendButtonLabel }}</span>
          <span v-else class="agent-composer-hint">Try a prompt or type your own question</span>
          <button
            class="agent-send-btn"
            :class="{ 'agent-send-btn--ready': userInput.trim() && !isSending }"
            type="submit"
            :disabled="isSending || !userInput.trim()"
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
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { requestJson } from '../api/client';

marked.use({ breaks: true, gfm: true });

const POLL_INTERVAL_MS = 1500;
const QUEUED_LABEL = 'Queued...';
const THINKING_LABEL = 'Thinking...';

const renderMarkdown = (text) => {
  const html = DOMPurify.sanitize(marked.parse(text ?? ''));
  const el = document.createElement('div');
  el.innerHTML = html;
  el.querySelectorAll('table').forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach((tr) => {
      [...tr.querySelectorAll('td')].forEach((td, index) => {
        if (headers[index]) td.setAttribute('data-label', headers[index]);
      });
    });
    const wrap = document.createElement('div');
    wrap.className = 'md-table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
  return el.innerHTML;
};

const quickPromptChips = [
  'Find income-generating put ideas under 200$',
  'Build a monthly income plan',
  'What makes a stock worth selling puts on?',
];

const suggestions = [
  { icon: 'PUT', text: 'Screen high-quality stocks for cash-secured puts with 2–3% monthly ROI and strong fundamentals.' },
  { icon: '$25K', text: 'I have $25,000. Build a wheel strategy income plan with position sizing and monthly targets.' },
  { icon: 'CYCLE', text: 'Walk me through the full wheel cycle: selling a put, getting assigned, then selling a covered call.' },
  { icon: 'WHY', text: 'Why is assignment a feature and not a bug? Explain the wheel strategy logic for a beginner.' },
];

const userInput = ref('');
const conversationHistory = ref([]);
const isSending = ref(false);
const currentJobId = ref(null);
const jobStatus = ref('');
const jobError = ref('');
const messagesEl = ref(null);
const inputEl = ref(null);
const activePollToken = ref(0);
let pollTimeoutId = null;

const isHeroMode = computed(() => !conversationHistory.value.length);
const sendButtonLabel = computed(() => (jobStatus.value === 'pending' ? QUEUED_LABEL : THINKING_LABEL));

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
});

const scrollToBottom = async () => {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
};

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

const updateAssistantMessage = async (messageIndex, content) => {
  if (!conversationHistory.value[messageIndex]) return;
  conversationHistory.value[messageIndex] = {
    ...conversationHistory.value[messageIndex],
    content,
  };
  await scrollToBottom();
};

const schedulePoll = (jobId, messageIndex, pollToken) => {
  clearPollTimeout();
  pollTimeoutId = window.setTimeout(() => {
    void pollJob(jobId, messageIndex, pollToken);
  }, POLL_INTERVAL_MS);
};

const pollJob = async (jobId, messageIndex, pollToken) => {
  if (!jobId || pollToken !== activePollToken.value) return;

  try {
    const data = await requestJson(`/api/agent/${jobId}/`, {
      method: 'GET',
      auth: true,
    });

    if (pollToken !== activePollToken.value) return;

    const status = String(data?.status ?? '').toLowerCase();
    const answer = typeof data?.answer === 'string' ? data.answer : '';
    const error = typeof data?.error === 'string' ? data.error : '';

    currentJobId.value = jobId;
    jobStatus.value = status;

    if (status === 'completed') {
      jobError.value = '';
      await updateAssistantMessage(messageIndex, answer || 'No response returned.');
      resetJobState();
      return;
    }

    if (status === 'failed') {
      const message = error || 'The agent request failed. Please try again.';
      jobError.value = message;
      await updateAssistantMessage(messageIndex, `Error: ${message}`);
      resetJobState();
      return;
    }

    await updateAssistantMessage(messageIndex, status === 'pending' ? QUEUED_LABEL : THINKING_LABEL);
    schedulePoll(jobId, messageIndex, pollToken);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;

    const message = err.message || 'Failed to check agent status. Please try again.';
    jobError.value = message;
    await updateAssistantMessage(messageIndex, `Error: ${message}`);
    resetJobState();
  }
};

const sendMessage = async () => {
  const query = userInput.value.trim();
  if (!query || isSending.value) return;

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
  activePollToken.value = pollToken;

  try {
    const data = await requestJson('/api/agent/', {
      method: 'POST',
      body: { query, history: historyBeforeQuery },
      auth: true,
    });

    if (pollToken !== activePollToken.value) return;

    const jobId = data?.job_id;
    const status = String(data?.status ?? '').toLowerCase();
    const answer = typeof data?.answer === 'string' ? data.answer : '';
    const error = typeof data?.error === 'string' ? data.error : '';

    if (!jobId) {
      throw new Error('The server did not return a job ID.');
    }

    currentJobId.value = jobId;
    jobStatus.value = status || 'pending';
    jobError.value = '';

    if (status === 'completed') {
      await updateAssistantMessage(assistantMessageIndex, answer || 'No response returned.');
      resetJobState();
      return;
    }

    if (status === 'failed') {
      const message = error || 'The agent request failed. Please try again.';
      jobError.value = message;
      await updateAssistantMessage(assistantMessageIndex, `Error: ${message}`);
      resetJobState();
      return;
    }

    await updateAssistantMessage(
      assistantMessageIndex,
      status === 'running' ? THINKING_LABEL : QUEUED_LABEL,
    );
    schedulePoll(jobId, assistantMessageIndex, pollToken);
  } catch (err) {
    if (pollToken !== activePollToken.value) return;

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
  userInput.value = text;
  void sendMessage();
};

const clearConversation = () => {
  cancelActiveJob();
  conversationHistory.value = [];
  jobError.value = '';
  userInput.value = '';
  if (inputEl.value) inputEl.value.style.height = 'auto';
};

onUnmounted(() => {
  cancelActiveJob();
  if (suggestionIntervalId !== null) clearInterval(suggestionIntervalId);
});
</script>

<style scoped>
/* ── Page shell ─────────────────────────────────────────────────────────── */
.agent-page {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem 0 3rem;
  overflow: hidden;
}

.agent-page--hero {
  min-height: calc(100vh - 4rem);
  justify-content: flex-start;
  align-items: center;
  padding: 2.25rem 1rem 3rem;
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
  max-height: 52vh;
  overflow-y: auto;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.2) transparent;
}

.agent-messages::-webkit-scrollbar { width: 4px; }
.agent-messages::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.25);
  border-radius: 999px;
}

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

@media (max-width: 640px) {
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
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
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
  min-height: 3rem;
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
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
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

  .agent-message {
    max-width: 92%;
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

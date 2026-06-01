<template>
  <section class="agent-page">
    <div class="container agent-layout">
      <div class="agent-card card">
        <div class="agent-header">
          <div class="agent-header-copy">
            <span class="section-eyebrow">AI Assistant</span>
            <h1 class="agent-title">Ask the AI Agent</h1>
            <p class="agent-subtitle muted">
              Ask anything about options strategies, stocks, or investment ideas.
            </p>
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
          <div v-if="!conversationHistory.length && !isLoading" class="agent-empty">
            <div class="agent-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <p class="agent-empty-text">Start a conversation below</p>
            <div class="agent-suggestions">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion.text"
                class="agent-suggestion-btn"
                type="button"
                @click="useSuggestion(suggestion.text)"
              >
                <span class="agent-suggestion-icon">{{ suggestion.icon }}</span>
                <span>{{ suggestion.text }}</span>
              </button>
            </div>
          </div>

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

          <div v-if="isLoading" class="agent-message agent-message--assistant">
            <span class="agent-message-role">AI</span>
            <div class="agent-bubble agent-bubble--loading">
              <span class="agent-dot"></span>
              <span class="agent-dot"></span>
              <span class="agent-dot"></span>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="agent-error" role="alert">
          {{ errorMessage }}
        </div>

        <form class="agent-form" @submit.prevent="sendMessage">
          <textarea
            ref="inputEl"
            v-model="userInput"
            class="agent-input"
            placeholder="Ask about options strategies, stocks, or investment ideas…"
            rows="1"
            :disabled="isLoading"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
          ></textarea>
          <button
            class="btn btn-primary agent-send-btn"
            type="submit"
            :disabled="isLoading || !userInput.trim()"
          >
            <svg v-if="!isLoading" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span v-else class="agent-send-spinner" aria-hidden="true"></span>
            <span class="agent-send-label">{{ isLoading ? 'Thinking…' : 'Send' }}</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { requestJson } from '../api/client';

marked.use({ breaks: true, gfm: true });

const renderMarkdown = (text) => {
  const html = DOMPurify.sanitize(marked.parse(text ?? ''));
  const el = document.createElement('div');
  el.innerHTML = html;
  el.querySelectorAll('table').forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach((tr) => {
      [...tr.querySelectorAll('td')].forEach((td, i) => {
        if (headers[i]) td.setAttribute('data-label', headers[i]);
      });
    });
    const wrap = document.createElement('div');
    wrap.className = 'md-table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
  return el.innerHTML;
};

const suggestions = [
  { icon: '📉', text: 'Top PUT selling opportunities right now' },
  { icon: '⚖️', text: 'Compare TSLA vs NVDA PUT options' },
  { icon: '🔍', text: 'Analyze NVDA fundamentals' },
  { icon: '📊', text: 'Best high IV stocks for selling covered calls' },
  { icon: '🛡️', text: 'Defensive options strategies for a bear market' },
  { icon: '💡', text: 'Explain the wheel strategy with examples' },
];

const userInput = ref('');
const conversationHistory = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const messagesEl = ref(null);
const inputEl = ref(null);

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

const sendMessage = async () => {
  const query = userInput.value.trim();
  if (!query || isLoading.value) return;

  errorMessage.value = '';
  userInput.value = '';
  if (inputEl.value) inputEl.value.style.height = 'auto';

  const historyBeforeQuery = [...conversationHistory.value];
  conversationHistory.value = [...historyBeforeQuery, { role: 'user', content: query }];
  await scrollToBottom();

  isLoading.value = true;

  try {
    const data = await requestJson('/api/agent/', {
      method: 'POST',
      body: { query, history: historyBeforeQuery },
      auth: true,
    });
    conversationHistory.value = data.history;
    await scrollToBottom();
  } catch (err) {
    conversationHistory.value = historyBeforeQuery;
    errorMessage.value = err.message || 'Something went wrong. Please try again.';
  } finally {
    isLoading.value = false;
    await nextTick();
    inputEl.value?.focus();
  }
};

const useSuggestion = (text) => {
  userInput.value = text;
  sendMessage();
};

const clearConversation = () => {
  conversationHistory.value = [];
  errorMessage.value = '';
  userInput.value = '';
  if (inputEl.value) inputEl.value.style.height = 'auto';
};
</script>

<style scoped>
.agent-page {
  padding: 2rem 0 4rem;
}

.agent-layout {
  display: flex;
  flex-direction: column;
}

.agent-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  max-height: calc(100vh - 10rem);
}

.agent-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.agent-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.agent-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
}

.agent-subtitle {
  margin: 0;
  font-size: 0.9rem;
}

.agent-clear-btn {
  flex-shrink: 0;
  font-size: 0.8rem;
  padding: 0.45rem 0.9rem;
}

.agent-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 280px;
  max-height: 55vh;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.2) transparent;
}

.agent-messages::-webkit-scrollbar {
  width: 4px;
}

.agent-messages::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.25);
  border-radius: 999px;
}

.agent-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
  min-height: 200px;
  color: #64748b;
}

.agent-empty-icon {
  width: 48px;
  height: 48px;
  color: #334155;
}

.agent-empty-icon svg {
  width: 100%;
  height: 100%;
}

.agent-empty-text {
  margin: 0;
  font-size: 0.9rem;
}

.agent-message {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 80%;
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
}

.agent-message--user .agent-bubble {
  white-space: pre-wrap;
}

/* markdown content resets */
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
.agent-bubble--md :deep(td:last-child) {
  border-right: none;
}
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
.agent-bubble--md :deep(tbody tr:last-child td) {
  border-bottom: none;
}
.agent-bubble--md :deep(tr:nth-child(even) td) {
  background: rgba(15, 23, 42, 0.4);
}

/* mobile: flip table to card list */
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
  .agent-bubble--md :deep(thead) {
    display: none;
  }
  .agent-bubble--md :deep(tr) {
    display: block;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 0.6rem;
    margin-bottom: 0.6rem;
    padding: 0.25rem 0;
  }
  .agent-bubble--md :deep(tr:nth-child(even) td) {
    background: transparent;
  }
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
  .agent-bubble--md :deep(td:last-child) {
    border-bottom: none;
  }
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

.agent-message--user .agent-bubble {
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

.agent-bubble--loading {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.8rem 1.2rem;
}

.agent-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748b;
  animation: agent-dot-pulse 1.2s ease-in-out infinite;
}

.agent-dot:nth-child(2) { animation-delay: 0.2s; }
.agent-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes agent-dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.agent-error {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 0.75rem;
  color: #fca5a5;
  font-size: 0.875rem;
}

.agent-form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  padding-top: 1.25rem;
}

.agent-input {
  flex: 1;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  color: #f8fafc;
  font: inherit;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  resize: none;
  overflow: hidden;
  min-height: 2.75rem;
  max-height: 160px;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.agent-input::placeholder {
  color: #475569;
}

.agent-input:focus {
  outline: none;
  border-color: rgba(34, 211, 238, 0.4);
}

.agent-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agent-send-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  padding: 0.7rem 1.1rem;
  font-size: 0.875rem;
}

.agent-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: none;
}

.agent-send-label {
  font-size: 0.875rem;
}

.agent-send-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: agent-spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes agent-spin {
  to { transform: rotate(360deg); }
}

.agent-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 520px;
  margin-top: 0.5rem;
}

.agent-suggestion-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 2rem;
  color: #94a3b8;
  font: inherit;
  font-size: 0.8rem;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  text-align: left;
}

.agent-suggestion-btn:hover {
  border-color: rgba(34, 211, 238, 0.4);
  color: #e2e8f0;
  background: rgba(34, 211, 238, 0.06);
}

.agent-suggestion-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .agent-card {
    padding: 1.25rem;
  }

  .agent-message {
    max-width: 92%;
  }

  .agent-send-label {
    display: none;
  }

  .agent-send-btn {
    padding: 0.7rem;
  }
}
</style>

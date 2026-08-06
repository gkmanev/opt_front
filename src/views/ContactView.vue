<template>
  <section class="content-page-hero contact-page">
    <div class="container contact-layout">
      <div class="contact-intro">
        <div class="content-breadcrumbs">
          <a href="/" @click="navigateRoute($event, '/')">Home</a>
          <span>/</span>
          <span>Contact</span>
        </div>
        <span class="pill">Trust Center</span>
        <h1 class="content-title">Contact PutPulse</h1>
        <p class="content-intro">
          Have a question about PutPulse, your account, billing, or the product? Send us a message
          and we’ll get back to you as soon as we can.
        </p>
        <p class="contact-note">
          For account-specific help, please include the email address associated with your account.
        </p>
      </div>

      <form class="contact-form" @submit.prevent="sendMessage">
        <div class="contact-field-grid">
          <label class="contact-field">
            <span>Name</span>
            <input v-model.trim="form.name" type="text" name="name" autocomplete="name" required>
          </label>
          <label class="contact-field">
            <span>Email address</span>
            <input v-model.trim="form.email" type="email" name="email" autocomplete="email" required>
          </label>
        </div>

        <label class="contact-field">
          <span>Subject</span>
          <select v-model="form.subject" name="subject" required>
            <option value="">Choose a topic</option>
            <option>Account support</option>
            <option>Billing or subscription</option>
            <option>Product question</option>
            <option>Privacy or legal request</option>
            <option>Other</option>
          </select>
        </label>

        <label class="contact-field">
          <span>Message</span>
          <textarea
            v-model.trim="form.message"
            name="message"
            rows="7"
            maxlength="5000"
            required
            placeholder="How can we help?"
          />
        </label>

        <p v-if="statusMessage" class="contact-feedback" role="status">{{ statusMessage }}</p>

        <div class="contact-actions">
          <button class="btn btn-primary" type="submit">Send message</button>
          <a class="contact-email-link" href="mailto:admin@putpulse.com">Email us directly</a>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['navigate-route']);

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});
const statusMessage = ref('');

const navigateRoute = (event, path) => {
  emit('navigate-route', event, path);
};

const sendMessage = () => {
  const subject = `[PutPulse] ${form.subject}`;
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    '',
    form.message,
  ].join('\n');

  window.location.href = `mailto:admin@putpulse.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  statusMessage.value = 'Your email app should open with your message ready to send.';
};
</script>

<style scoped>
.contact-page {
  padding-bottom: 5rem;
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(340px, 1.1fr);
  gap: 3rem;
  align-items: start;
}

.contact-intro .content-intro {
  margin-bottom: 1.25rem;
}

.contact-note {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 0.92rem;
}

.contact-form {
  display: grid;
  gap: 1.1rem;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1.25rem;
  background: rgba(9, 14, 28, 0.72);
}

.contact-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.contact-field {
  display: grid;
  gap: 0.45rem;
  color: #cbd5e1;
  font-size: 0.86rem;
  font-weight: 600;
}

.contact-field input,
.contact-field select,
.contact-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 0.65rem;
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font: inherit;
  font-weight: 400;
  line-height: 1.45;
  padding: 0.72rem 0.8rem;
}

.contact-field textarea {
  min-height: 9rem;
  resize: vertical;
}

.contact-field input:focus,
.contact-field select:focus,
.contact-field textarea:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.13);
}

.contact-feedback {
  margin: 0;
  color: #67e8f9;
  font-size: 0.88rem;
  line-height: 1.5;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.contact-email-link {
  color: #67e8f9;
  font-size: 0.9rem;
  text-decoration: none;
}

.contact-email-link:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 520px) {
  .contact-field-grid {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: 1.2rem;
  }
}
</style>

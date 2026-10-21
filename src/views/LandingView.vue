<template>
  <div class="landing" lang="bg">
    <header class="landing-header">
      <a href="#top" class="landing-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" :fill="accent" />
          <path d="M16 23s-7-4.3-7-9.2A3.8 3.8 0 0 1 16 11.6a3.8 3.8 0 0 1 7 2.2C23 18.7 16 23 16 23z" fill="#FFFFFF" />
        </svg>
        <span>PutPulse</span>
      </a>
      <nav class="landing-nav">
        <a href="#features">Функции</a>
        <a href="#how">Как работи</a>
        <a href="#contact">Контакти</a>
        <a href="#contact" class="landing-nav-cta">Поръчай</a>
      </nav>
    </header>

    <section id="top" class="landing-hero">
      <div class="landing-hero-text">
        <div class="landing-pill">Сигнално устройство за възрастни хора</div>
        <h1>Спокойствие за вас.<br />Сигурност за тях.</h1>
        <p>
          Гривна с бутон SOS, която следи пулса, кръвното и температурата и показва къде е вашият близък — от всяка
          точка на света.
        </p>
        <div class="landing-actions">
          <a href="#contact" class="landing-btn landing-btn--primary">Поръчай гривна</a>
          <a href="#how" class="landing-btn landing-btn--outline">Как работи</a>
        </div>
      </div>
      <div class="landing-hero-art">
        <div class="landing-hero-frame">
          <img :src="braceletImage" alt="Сигнална гривна с бутон SOS" />
        </div>
      </div>
    </section>

    <section id="features" class="landing-features">
      <div class="landing-container">
        <h2>Какво прави гривната</h2>
        <div class="landing-feature-grid">
          <div v-for="feature in features" :key="feature.title" class="landing-feature">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              :stroke="accent"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              v-html="feature.icon"
            />
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="how" class="landing-container landing-how">
      <h2>Как работи</h2>
      <div class="landing-step-grid">
        <div v-for="step in steps" :key="step.num" class="landing-step">
          <div class="landing-step-num">{{ step.num }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </div>
    </section>

    <section id="contact" class="landing-contact-wrap">
      <div class="landing-contact">
        <div class="landing-contact-text">
          <h2>Бъдете до тях, дори когато не сте</h2>
        </div>
        <div class="landing-actions">
          <button type="button" class="landing-btn landing-btn--primary" @click="openContact">Пишете ни</button>
        </div>
      </div>
    </section>

    <div v-if="isContactOpen" class="landing-modal-backdrop" @click.self="closeContact">
      <div class="landing-modal" role="dialog" aria-modal="true" aria-labelledby="landing-modal-title">
        <button type="button" class="landing-modal-close" aria-label="Затвори" @click="closeContact">×</button>
        <h2 id="landing-modal-title">Пишете ни</h2>
        <form class="landing-form" @submit.prevent="sendMessage">
          <label class="landing-field">
            <span>Име</span>
            <input ref="nameInput" v-model.trim="form.name" type="text" autocomplete="name" required />
          </label>
          <label class="landing-field">
            <span>Email</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" required />
          </label>
          <label class="landing-field">
            <span>Коментар</span>
            <textarea v-model.trim="form.comment" rows="5" required></textarea>
          </label>
          <button type="submit" class="landing-btn landing-btn--primary">Изпрати</button>
        </form>
      </div>
    </div>

    <footer class="landing-footer">
      <div>
        <span>© 2026 PutPulse · ЕджСинк Системс ООД</span>
        <span>гр. Червен Бряг, ул. Шипка, 11 · <a href="mailto:office@putpulse.com">office@putpulse.com</a></span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import braceletImage from '../assets/sos-bracelet.png';

const accent = '#C4500E';
const contactEmail = 'office@putpulse.com';

const isContactOpen = ref(false);
const nameInput = ref(null);
const form = reactive({ name: '', email: '', comment: '' });

const openContact = async () => {
  isContactOpen.value = true;
  await nextTick();
  nameInput.value?.focus();
};

const closeContact = () => {
  isContactOpen.value = false;
};

const sendMessage = () => {
  const subject = `Запитване от ${form.name}`;
  const body = `Име: ${form.name}\nEmail: ${form.email}\n\n${form.comment}`;
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.name = '';
  form.email = '';
  form.comment = '';
  closeContact();
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isContactOpen.value) closeContact();
};

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const features = [
  {
    title: 'Бутон SOS',
    text: 'Едно натискане и вие получавате сигнал и обаждане.',
    icon: '<circle cx="12" cy="12" r="9"></circle><path d="M9 9.5h6M9 14.5h6"></path>',
  },
  {
    title: 'Пулс и кръвно',
    text: 'Автоматично измерване всеки ден, без нужда от действие.',
    icon: '<path d="M3 12h4l2-5 4 10 2-5h6"></path>',
  },
  {
    title: 'Температура',
    text: 'Следите показателите в уеб платформата по всяко време.',
    icon: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>',
  },
  {
    title: 'Местоположение',
    text: 'Виждате на картата къде е вашият близък.',
    icon: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle>',
  },
];

const steps = [
  { num: '01', title: 'Гривната', text: 'Носи се като часовник. Измерва показателите и изпраща сигнал при нужда.' },
  { num: '02', title: 'Уеб платформата', text: 'От телефон или компютър виждате данните и получавате известия.' },
  { num: '03', title: 'Социален асистент', text: 'По желание — редовни посещения у дома от наш асистент.' },
];

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (document.querySelector('link[data-landing-font]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
  link.dataset.landingFont = '';
  document.head.appendChild(link);
});
</script>

<style scoped>
.landing {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #1e1e1e;
  background: #fbf8f4;
  min-height: 100vh;
}

.landing a {
  color: #c4500e;
}

.landing a:hover {
  color: #9a3d08;
}

.landing h1,
.landing h2,
.landing h3,
.landing p {
  margin: 0;
}

.landing h2 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.landing-container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.landing-header {
  max-width: 1160px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.landing .landing-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1e1e1e;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.landing-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  font-size: 16px;
  font-weight: 500;
}

.landing .landing-nav a {
  color: #1e1e1e;
  text-decoration: none;
}

.landing .landing-nav .landing-nav-cta {
  background: #1e1e1e;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 600;
}

.landing-hero {
  max-width: 1160px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 48px;
}

.landing-hero-text {
  flex: 1 1 440px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.landing-pill {
  font-size: 15px;
  font-weight: 600;
  color: #9a3d08;
  background: #fbe9dd;
  padding: 8px 14px;
  border-radius: 999px;
  align-self: flex-start;
}

.landing h1 {
  font-size: clamp(40px, 5.5vw, 64px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.landing-hero-text p {
  font-size: 20px;
  line-height: 1.55;
  color: #5c5a57;
  max-width: 34ch;
}

.landing-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.landing-hero-text .landing-actions {
  margin-top: 8px;
}

.landing .landing-btn {
  text-decoration: none;
  padding: 16px 28px;
  border-radius: 999px;
  font-size: 18px;
}

.landing .landing-btn--primary {
  background: #c4500e;
  color: #ffffff;
  font-weight: 700;
}

.landing button.landing-btn {
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.landing button.landing-btn--primary:hover {
  background: #9a3d08;
}

.landing-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(30, 30, 30, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.landing-modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  background: #fbf8f4;
  border-radius: 24px;
  padding: 40px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.landing .landing-modal h2 {
  font-size: 28px;
}

.landing-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: #f1ebe3;
  color: #1e1e1e;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.landing-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.landing-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
}

.landing-field input,
.landing-field textarea {
  font: inherit;
  font-weight: 400;
  font-size: 17px;
  color: #1e1e1e;
  background: #ffffff;
  border: 1.5px solid #d9d3cb;
  border-radius: 14px;
  padding: 12px 14px;
}

.landing-field textarea {
  resize: vertical;
}

.landing-field input:focus,
.landing-field textarea:focus {
  outline: none;
  border-color: #c4500e;
}

.landing-form .landing-btn {
  margin-top: 8px;
  align-self: flex-start;
}

.landing .landing-btn--outline {
  color: #1e1e1e;
  font-weight: 600;
  border: 1.5px solid #d9d3cb;
}

.landing .landing-btn--dark-outline {
  color: #ffffff;
  font-weight: 600;
  border: 1.5px solid #5c5a57;
}

.landing-hero-art {
  flex: 1 1 400px;
  display: flex;
  justify-content: center;
}

.landing-hero-frame {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1 / 1;
  background: #f1ebe3;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-hero-frame img {
  mix-blend-mode: multiply;
  width: 78%;
  height: auto;
  display: block;
}

.landing-features {
  background: #ffffff;
  border-top: 1px solid #ede7df;
  border-bottom: 1px solid #ede7df;
}

.landing-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
}

.landing-feature,
.landing-step {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.landing-feature h3 {
  font-size: 20px;
  font-weight: 700;
}

.landing-feature p,
.landing-step p {
  font-size: 17px;
  line-height: 1.55;
  color: #5c5a57;
}

.landing-step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.landing-step {
  background: #ffffff;
  border: 1px solid #ede7df;
  border-radius: 24px;
  padding: 32px;
}

.landing-step-num {
  font-size: 15px;
  font-weight: 700;
  color: #9a3d08;
}

.landing-step h3 {
  font-size: 22px;
  font-weight: 700;
}

.landing-contact-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.landing-contact {
  background: #1e1e1e;
  color: #ffffff;
  border-radius: 32px;
  padding: 56px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.landing-contact-text {
  flex: 1 1 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.landing-contact-text p {
  font-size: 18px;
  line-height: 1.55;
  color: #cfcac4;
}

.landing-footer {
  border-top: 1px solid #ede7df;
}

.landing-footer > div {
  max-width: 1160px;
  margin: 0 auto;
  padding: 28px 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  color: #5c5a57;
}
</style>

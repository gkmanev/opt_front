import { ref } from 'vue';

const paddleReady = ref(false);
let initPromise = null;

const initialize = async () => {
  if (paddleReady.value) return;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    const poll = () => {
      if (window.Paddle) {
        const isSandbox = import.meta.env.VITE_PADDLE_SANDBOX === 'true';
        if (isSandbox) window.Paddle.Environment.set('sandbox');
        window.Paddle.Setup({ token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN });
        paddleReady.value = true;
        resolve();
      } else {
        setTimeout(poll, 50);
      }
    };
    poll();
  });

  return initPromise;
};

export const usePaddle = () => {
  const openCheckout = async ({ priceId, userId, userEmail, onSuccess }) => {
    await initialize();
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { user_id: String(userId) },
      settings: { displayMode: 'overlay', theme: 'dark' },
      successCallback: onSuccess,
    });
  };

  return { openCheckout, paddleReady };
};

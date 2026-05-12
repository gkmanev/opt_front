import { requestJson } from '../api/client';

export const useStripe = () => {
  const openCheckout = async ({ priceId, userId, userEmail, successUrl, cancelUrl }) => {
    const data = await requestJson('/api/create-stripe-checkout-session/', {
      method: 'POST',
      body: {
        price_id: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: userEmail,
        metadata: { user_id: String(userId) },
      },
    });
    window.location.href = data.checkout_url;
  };

  return { openCheckout };
};

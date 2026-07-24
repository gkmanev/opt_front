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

  const openCustomerPortal = async () => {
    const data = await requestJson('/api/create-stripe-customer-portal-session/', {
      method: 'POST',
    });

    if (!data?.portal_url) {
      throw new Error('Unable to open the subscription management portal.');
    }

    window.location.assign(data.portal_url);
  };

  return { openCheckout, openCustomerPortal };
};

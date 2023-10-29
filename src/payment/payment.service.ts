import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor() {
    // Initialize the Stripe instance with your secret key
    this.stripe = new Stripe('API KEY HERE', {
      // @ts-ignore
      apiVersion: '2020-08-27',
    });
  }

  /*
  async createCheckoutSession() {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [{ price: 'price_1O52FfHN833uAyuLXi83NFEv', quantity: 1 }],
      mode: 'subscription', // Change mode to subscription as the product starhire sells now is suscription basis
      success_url: 'https://www.google.com',
      cancel_url: 'http://localhost:3000' + '/pay/failed/checkout/session',
    });

    return session;
  }
  */

  async createCheckoutSession(clientReferenceId) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1O52FfHN833uAyuLXi83NFEv',
          quantity: 1,
        },
      ],
      client_reference_id: clientReferenceId, // Add the client_reference_id here
      mode: 'subscription',
      success_url: 'https://www.google.com',
      cancel_url: 'http://localhost:3000' + '/pay/failed/checkout/session',
    });

    return session;
  }

  async handleSubscription(subscriptionId: string) {
    try {
      // Retrieve the subscription from Stripe
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      // Extract the customer ID
      const customerId = subscription.customer;
      console.log(customerId);

      // Update your database or application state with this association
      // Now you have linked the customer with the subscription

      // Continue with any other actions or logic needed

      return 'Subscription successfully processed';
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw new Error('Failed to process subscription');
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      // Retrieve the subscription
      //const subscription =
      //await this.stripe.subscriptions.retrieve(subscriptionId);

      // Cancel the subscription at the end of the billing period
      const canceledSubscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        },
      );

      // Handle any additional logic in your application (e.g., updating user status)

      return 'Subscription successfully canceled';
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
}
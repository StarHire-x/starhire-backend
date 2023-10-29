import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment-dto';
import { Stripe } from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
  @Get()
  async createCheckoutSession(@Body() paymentData: { userId: string }) {
    const session = await this.paymentService.createCheckoutSession();
    return { session };
  }
  */

  @Post('create-checkout-session')
  async createCheckoutSessionWithPost(@Body() paymentData: CreatePaymentDto) {
    const session = await this.paymentService.createCheckoutSessionW(
      paymentData.userId,
    );
    return { session };
  }

  @Post('stripe')
  async handleStripeWebhook(@Body() event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      //const subscriptionId = session.subscription;
      const subscriptionId = session.subscription as string;

      // Now you have the subscription ID, you can process it as needed
      //this.paymentService.processSubscription(subscriptionId);

      // Respond to the webhook request with a 200 OK status
      console.log(subscriptionId);
      await this.paymentService.handleSubscription(subscriptionId);
      return 'Webhook received and processed';
    }
  }
  @Post('cancel')
  async cancelSubscription(@Body() body: { subscriptionId: string }) {
    try {
      const result = await this.paymentService.cancelSubscription(
        body.subscriptionId,
      );
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
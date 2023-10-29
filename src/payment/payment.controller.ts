import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment-dto';
import { Stripe } from 'stripe';
import { Public } from 'src/users/public.decorator';

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

  @Public()
  @Post('create-checkout-session')
  async createCheckoutSessionWithPost(@Body() paymentData: CreatePaymentDto) {
    const session = await this.paymentService.createCheckoutSession(
      paymentData.userId,
    );
    return { session };
  }

  @Public()
  @Post('stripe')
  async handleStripeWebhook(@Body() event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const subscriptionId = session.subscription as string;
      const clientReferenceId = session.client_reference_id as string;

      //console.log('Subscription ID:', subscriptionId);
      //console.log('Client Reference ID:', clientReferenceId);

      await this.paymentService.handleSubscription(
        subscriptionId,
        clientReferenceId,
      );

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
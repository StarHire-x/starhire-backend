import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment-dto';
import { Stripe } from 'stripe';
import { Public } from 'src/users/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
      const stripeCustId = session.customer as string;

      await this.paymentService.handleSubscription(
        subscriptionId,
        clientReferenceId,
        stripeCustId,
      );

      return 'Webhook received and processed';
    }
  }

  @Public()
  @Get(':subscriptionId/billing-cycle-details')
  async getBillingCycleDetails(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    try {
      const billingCycleDetails =
        await this.paymentService.getSubCycleDetails(subscriptionId);
      return {
        success: true,
        data: billingCycleDetails,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve billing cycle details',
        error: error.message,
      };
    }
  }

  @Public()
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

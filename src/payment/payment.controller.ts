import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment-dto';
import { Stripe } from 'stripe';
import { Public } from 'src/users/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  //@Public()
  @Post('create-checkout-session')
  async createCheckoutSessionWithPost(@Body() paymentData: CreatePaymentDto) {
    console.log(paymentData);
    return await this.paymentService.createCheckoutSession(paymentData.userId);
    //return { session };
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
  @Get('billing-cycle-details/:subscriptionId')
  async getBillingCycleDetails(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    try {
      const billingCycleDetails =
        await this.paymentService.getSubCycleDetails(subscriptionId);
      return billingCycleDetails;
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
  async cancelSubscription(@Body() body: { userId: string }) {
    try {
      const result = await this.paymentService.cancelSubscription(body.userId);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

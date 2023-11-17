import { Controller, Post, Body, Get, Param , Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../payment/dto/create-payment-dto';
import { Stripe } from 'stripe';
import { Public } from '../users/public.decorator';
import { InvoiceService } from 'src/invoice/invoice.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Public()
  @Post('create-checkout-session')
  async createCheckoutSessionWithPost(@Body() paymentData: CreatePaymentDto) {
    console.log(paymentData);
    return await this.paymentService.createCheckoutSession(paymentData.userId);
    //return { session };
  }

  @Public()
  @Post('stripe')
  async handleStripeWebhook(@Body() event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
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
        // break;

        case 'customer.subscription.deleted':
          const stripeCustomerId = event.data.object.customer as string;
          console.log('I am the delete web hook ' + stripeCustomerId);
          await this.paymentService.deleteSubscription(stripeCustomerId);
          return 'Webhook received and processed';
        // break;

        case 'invoice.payment_succeeded':
          const stripeInvoiceId = event.data.object.id as string;
          console.log(`stripe invoice id: ${stripeInvoiceId}`);

          await this.invoiceService.updateInvoiceStatusForStripePayment(
            stripeInvoiceId,
          );

          return 'webhook received and processed';
        // break;

        case 'customer.deleted':
          console.log("customer deleted triggered!");
          const deletedStripeCustId = event.data.object.id as string;
          console.log(`deleted striped cust id: ${deletedStripeCustId}`);
          const response = await this.paymentService.removeStripeDataFromCustomer(deletedStripeCustId);
          console.log(response);
          return 'webhook received and processed';

        default:
          return 'Webhook received but not processed';
      }
    } catch (error) {
      return 'Error processing webhook: ' + error.message;
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

  @Public()
  @Get('all-invoices/:customerId')
  async getAllInvoiceFromACustomer(@Param('customerId') customerId: string) {
    try {
      const invoices =
        await this.paymentService.getAllInvoiceFromACustomer(customerId);
      return invoices;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve Invoices',
        error: error.message,
      };
    }
  }
}

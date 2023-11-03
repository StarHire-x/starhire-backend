import { HttpStatus, Injectable, Query } from '@nestjs/common';
import Stripe from 'stripe';
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '.env') });
import { Corporate } from '../entities/corporate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorporateService } from '../corporate/corporate.service';
import CorporatePromotionStatusEnum from '../enums/corporatePromotionStatus.enum';
import { UpdateCorporateDto } from '../corporate/dto/update-corporate.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private corporateService: CorporateService;

  constructor(corporateService: CorporateService) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      //@ts-ignore
      apiVersion: '2022-11-15',
    });
    this.corporateService = corporateService;
  }

  async createCheckoutSession(clientReferenceId) {
    const corporateResponse =
      await this.corporateService.findByUserId(clientReferenceId);

    if (corporateResponse && corporateResponse.data) {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1O52FfHN833uAyuLXi83NFEv',
            quantity: 1,
          },
        ],
        client_reference_id: clientReferenceId,
        mode: 'subscription',
        success_url: 'http://localhost:3001/payment/success',
        cancel_url: 'http://localhost:3001/payment/failure',
      });

      //return session;
      return {
        statusCode: HttpStatus.OK,
        message: 'Checkout session created',
        data: session.url,
      };
    }
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Unable to create checkout session!!',
    };
  }

  // This method will only get called on successful payment using the webhook
  async handleSubscription(
    subscriptionId: string,
    clientReferenceId: string,
    stripeCustId: string,
  ) {
    try {
      console.log('sub ID = ' + subscriptionId);
      console.log('user ID = ' + clientReferenceId);

      const corporateResponse =
        await this.corporateService.findByUserId(clientReferenceId);

      if (corporateResponse && corporateResponse.data) {
        const corporate = corporateResponse.data;

        if (corporate) {
          const corporateUpdateDto = new UpdateCorporateDto();
          corporateUpdateDto.corporatePromotionStatus =
            CorporatePromotionStatusEnum.PREMIUM;

          corporateUpdateDto.stripeSubId = subscriptionId;
          corporateUpdateDto.stripeCustId = stripeCustId;

          await this.corporateService.update(
            clientReferenceId,
            corporateUpdateDto,
          );
        } else {
          throw new Error('Corporate not found for the given user ID');
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Subscription successfully processed',
          data: corporate,
        };
      } else {
        throw new Error('Corporate data not found for the given user ID');
      }
    } catch (error) {
      console.error('Error Processing subscription:', error);
      throw new Error('Failed to process subscription');
    }
  }

  async cancelSubscription(userId: string) {
    try {
      const corporateResponse =
        await this.corporateService.findByUserId(userId);

      if (corporateResponse && corporateResponse.data) {
        const corporate = corporateResponse.data;

        if (corporate) {
          const canceledSubscription = await this.stripe.subscriptions.cancel(
            corporate.stripeSubId,
          );
        } else {
          throw new Error('Corporate not found for the given user ID');
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Subscription successfully canceled',
        };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Failed to unsubscribe, contact our admins33',
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return {
        status: 500,
        error:
          'Failed to unsubscribe, There is not such Subscription: ' +
          error.message,
      };
    }
  }

  async deleteSubscription(stripeCustId: string) {
    try {
      const corporateResponse =
        await this.corporateService.findCorporateByStripeCustId(stripeCustId);

      if (corporateResponse && corporateResponse.data) {
        const corporate = corporateResponse.data;

        const corporateUpdateDto = new UpdateCorporateDto();

        corporateUpdateDto.corporatePromotionStatus =
          CorporatePromotionStatusEnum.REGULAR;

        corporateUpdateDto.stripeSubId = null;
        corporateUpdateDto.stripeCustId = null;

        await this.corporateService.update(
          corporate.userId,
          corporateUpdateDto,
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'Subscription successfully canceled',
        };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Failed to unsubscribe, contact our admins 11',
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      //throw new Error('Failed to cancel subscription');
      return {
        status: 500,
        error: 'Failed to unsubscribe, contact our admins22',
      };
    }
  }

  async getSubCycleDetails(subscriptionId: string) {
    try {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      const currentPeriodStart = new Date(
        subscription.current_period_start * 1000,
      );
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

      const responseData = {
        nextBillingCycleStart: currentPeriodStart,
        nextBillingCycleEnd: currentPeriodEnd,
      };

      return { statusCode: 200, data: responseData };
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return { status: 500, error: 'Failed to retrieve billing cycle details' };
    }
  }

  async getAllInvoiceFromACustomer(customerId: string) {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
      });

      const invoiceUrls = invoices.data.map(
        (invoice) => invoice.hosted_invoice_url,
      );

      console.log(invoiceUrls);
      return { statusCode: 200, data: invoices };
    } catch (error) {
      throw new Error(`Error listing invoices: ${error.message}`);
    }
  }
}

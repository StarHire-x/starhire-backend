import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CorporateTypeform } from 'src/entities/corporateTypeform.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeformService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CorporateTypeform)
    private readonly corporateTypeFormRepository: Repository<CorporateTypeform>,
  ) {}

  async fetchAllCorporateResponses() {
    try {
      const responseObservable = this.httpService.get(
        process.env.CORPORATE_TYPEFORM_URL,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.TYPEFORM_AUTH_TOKEN}`,
          },
        },
      );

      const response: AxiosResponse = await lastValueFrom(responseObservable);

      if (response.status === 200) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Responses successfully fetched',
          data: response.data,
        };
      } else {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
    } catch (error) {
      console.log(
        'Encountered an unexpected problem when fetching typeform response',
        error.message,
      );
      throw error;
    }
  }

  async getCorporateInfoByEmail(email: string) {
    try {
      const corporateInfo = this.corporateTypeFormRepository.findOne({
        where: { email: email },
      });
      if (corporateInfo) {
        return corporateInfo;
      }
      return [];
    } catch (error) {
      console.error('Error in getCorporateResponseByEmail:', error);
      throw error;
    }
  }

  findAllCorporate() {
    return this.fetchAllCorporateResponses();
  }

  async getCorporateResponseByEmail(email: string) {
    const response = (await this.fetchAllCorporateResponses()).data;
    const responseDataArray = response.items;
    const numResponses = response.total_items;

    for (const corporateResponse of responseDataArray) {
      const responseId = corporateResponse.response_id;
      const answersArray = corporateResponse.answers;
      const emailAnswerObject = answersArray.find((answerObject) => {
        return answerObject.field.type === 'email';
      });
      if (emailAnswerObject && emailAnswerObject.email === email) {
        return corporateResponse;
      }
    }
    return [];
  }

  async saveCorporateResponseByEmail(email: string) {
    const corporateResponse = await this.getCorporateResponseByEmail(email);
    if (corporateResponse.length === 0) {
      throw new HttpException(
        'Your typeform response could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Corporate Typeform Response has already been saved
    const corporateInfo = await this.getCorporateInfoByEmail(email);
    if (corporateInfo) {
      return corporateInfo;
    }

    // Extracting response and email field from typeform response object
    const corporateTypeform = new CorporateTypeform();
    const responseId = corporateResponse.response_id;
    corporateTypeform.responseId = responseId;
    corporateTypeform.email = email;

    // Iterate through the typeform answer object
    const answerArray = corporateResponse.answers;
    for (const answerObject of answerArray) {
      const fieldId = answerObject.field.id;
      const fieldName = typeformFieldNameMapping[fieldId];
      let fieldValue = '';

      if (fieldId === 'wV082U1xrwMG') {
        // Single choice
        const choice = answerObject.choice;
        fieldValue = choice.label;
      } else if (fieldId === 'o1fqUVreUxhf') {
        // skip email
        continue;
      } else if (fieldId in typeformFieldTypeText) {
        // text fields
        fieldValue = answerObject.text;
      } else {
        // Multiple choice
        const responseObject = answerObject.choices;
        const labelsArray = responseObject.labels;
        for (const label of labelsArray) {
          fieldValue += label;
          fieldValue += '_';
        }
        fieldValue = fieldValue.slice(0, -1);
      }
      corporateTypeform[fieldName] = fieldValue;
    }
    const savedCorporateTypeform =
      await this.corporateTypeFormRepository.save(corporateTypeform);
    return savedCorporateTypeform;
  }
}

const typeformFieldNameMapping = {
  vPCppHgr2VuK: 'firstName',
  o1fqUVreUxhf: 'email',
  AoIMKWblS8tv: 'schoolName',
  Y7VXG0LshPrQ: 'address',
  SfKPMosQGSTf: 'city',
  Va3ptJEA35JY: 'state',
  R6dDb3zcCq5X: 'country',
  XHkxGkMTUn2Y: 'postalCode',
  ikbqwmWaQRLl: 'regions',
  xzm3zUEt2b4P: 'jobTitle',
  wV082U1xrwMG: 'numberOfRoles',
  qOS2tbjqxII6: 'jobType',
  rasnoPtNpNgy: 'schedule',
  pfvKn6CnPjEo: 'payRange',
  zeQpEok1cRqO: 'supplementalPay',
  g1WUZd0wn6UH: 'otherBenefits',
  '77AzLt6BSUSA': 'startDate',
  TOuD0BPTX8Px: 'jobDescription',
  SE6XAo8CQKzx: 'experienceRequired',
  ih9nWYYwbFco: 'certificationsRequired',
  ojxcsBhQ5W2o: 'typeOfWorkers',
  TMhSqiyfBsy1: 'requiredLanguages',
  '0pWqNAqSmKiz': 'otherConsiderations',
};

const typeformFieldTypeText = {
  vPCppHgr2VuK: 'firstName',
  AoIMKWblS8tv: 'schoolName',
  Y7VXG0LshPrQ: 'address',
  SfKPMosQGSTf: 'city',
  Va3ptJEA35JY: 'state',
  R6dDb3zcCq5X: 'country',
  XHkxGkMTUn2Y: 'postalCode',
  xzm3zUEt2b4P: 'jobTitle',
  pfvKn6CnPjEo: 'payRange',
  '77AzLt6BSUSA': 'startDate',
  TOuD0BPTX8Px: 'jobDescription',
  '0pWqNAqSmKiz': 'otherConsiderations',
};

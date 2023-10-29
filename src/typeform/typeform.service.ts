import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CorporateTypeform } from 'src/entities/corporateTypeform.entity';
import { Repository } from 'typeorm';
import { Corporate } from 'src/entities/corporate.entity';
import { JobListingService } from 'src/job-listing/job-listing.service';
import { CreateJobListingDto } from 'src/job-listing/dto/create-job-listing.dto';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

@Injectable()
export class TypeformService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CorporateTypeform)
    private readonly corporateTypeFormRepository: Repository<CorporateTypeform>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    private jobListingService: JobListingService,
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

      // Single choice field (numberOfRoles)
      if (fieldId === 'wV082U1xrwMG') {
        const choice = answerObject.choice;
        fieldValue = choice.label;
        // Single choice field (school category)
      } else if (fieldId === 'RdXmXPgAKFQH') {
        const choice = answerObject.choice;
        fieldValue = choice.label;
        // skip email field
      } else if (fieldId === 'o1fqUVreUxhf') {
        continue;
        // Date field
      } else if (fieldId === '77AzLt6BSUSA') {
        fieldValue = answerObject.date;
        // text fields
      } else if (fieldId in typeformFieldTypeText) {
        fieldValue = answerObject.text;
        // Multiple choice fields
      } else {
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

  async updateCorporateAccountDetails(accountInfo) {
    // find corporate Account by email
    const corporateEmail = accountInfo.email;
    const corporateAccount = await this.corporateRepository.findOne({
      where: { email: corporateEmail },
    });

    // Check whether the following fields are present in account info & update them in corporate info
    if ('schoolName' in accountInfo) {
      corporateAccount.companyName = accountInfo['schoolName'];
    }
    if ('address' in accountInfo) {
      corporateAccount.companyAddress = accountInfo['address'];
    }
    if ('schoolCategory' in accountInfo) {
      corporateAccount.schoolCategory = accountInfo['schoolCategory'];
    }
    if ('postalCode' in accountInfo) {
      corporateAccount.postalCode = accountInfo['postalCode'];
    }
    if ('regions' in accountInfo) {
      corporateAccount.regions = accountInfo['regions'];
    }
    await this.corporateRepository.save(corporateAccount);
    return corporateAccount;

    // Additional fields provided by typeform to be included in Corporate Entity class
    // firstName, postalCode, regions
  }

  async createJobListings(corporateTypeformInfo) {
    // find corporate Account by email
    const corporateEmail = corporateTypeformInfo.email;
    const corporateAccount = await this.corporateRepository.findOne({
      where: { email: corporateEmail },
    });

    const dto: CreateJobListingDto = new CreateJobListingDto();
    dto.title = corporateTypeformInfo.jobTitle || '';
    dto.overview = corporateTypeformInfo.jobDescription || '';
    dto.responsibilities = '';
    dto.requirements = corporateTypeformInfo.experienceRequired || '';
    dto.requiredDocuments = '';
    dto.jobLocation = corporateTypeformInfo.address || '';
    dto.averageSalary = 0;
    dto.jobStartDate = corporateTypeformInfo.startDate || null;
    dto.jobListingStatus = JobListingStatusEnum.UNVERIFIED;
    dto.corporateId = corporateAccount.userId;

    dto.payRange = corporateTypeformInfo.payRange || '';
    dto.jobType = corporateTypeformInfo.jobType || '';
    dto.schedule = corporateTypeformInfo.schedule || '';
    dto.supplementalPay = corporateTypeformInfo.supplementalPay || '';
    dto.otherBenefits = corporateTypeformInfo.otherBenefits || '';
    dto.certificationsRequired = corporateTypeformInfo.certificationsRequired || '';
    dto.typeOfWorkers = corporateTypeformInfo.typeOfWorkers || '';
    dto.requiredLanguages = corporateTypeformInfo.requiredLanguages || '';
    dto.otherConsiderations = corporateTypeformInfo.otherConsiderations || '';

    const jobListing = await this.jobListingService.create(dto);
    return jobListing;
  }

  async handleFormSubmit(email: string) {
    // Retrieve the typeform response & save it in the sql db
    const corporateTypeformInfo =
      await this.saveCorporateResponseByEmail(email);

    // Update the corporate account details
    const corporateAccount = await this.updateCorporateAccountDetails(
      corporateTypeformInfo,
    );
    // return corporateAccount;

    // Create the job listing
    const jobListing = await this.createJobListings(corporateTypeformInfo);
    return jobListing;
  }
}

const typeformFieldNameMapping = {
  vPCppHgr2VuK: 'firstName',
  o1fqUVreUxhf: 'email',
  AoIMKWblS8tv: 'schoolName',
  RdXmXPgAKFQH: 'schoolCategory',
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
  cSBLo66frmcG: 'payRange',
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
  '77AzLt6BSUSA': 'startDate',
  TOuD0BPTX8Px: 'jobDescription',
  '0pWqNAqSmKiz': 'otherConsiderations',
};

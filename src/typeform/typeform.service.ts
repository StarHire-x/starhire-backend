import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class TypeformService {
  constructor(private readonly httpService: HttpService) {}

  async fetchTypeFormResponses() {
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

  findAll() {
    return this.fetchTypeFormResponses();
  }
}

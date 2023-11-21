import { Injectable } from '@nestjs/common';
import { TGoogleAuthTokenResponse } from 'src';
import { IHandleAuthentication } from 'src/interface';

@Injectable()
export class GoogleAuthMainService
  implements IHandleAuthentication<TGoogleAuthTokenResponse>
{
  async handleResponseData(
    data: TGoogleAuthTokenResponse,
  ): Promise<Record<string, any>> {
    return {
      message: 'FROM MAIN MODULE',
      client: data,
    };
  }
}

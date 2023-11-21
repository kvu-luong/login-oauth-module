import { Injectable } from '@nestjs/common';
import { TGoogleAuthTokenResponse } from 'src';
import { IHandleAuthentication } from 'src/interface';

@Injectable()
export class AppService
  implements IHandleAuthentication<TGoogleAuthTokenResponse>
{
  getHello(): string {
    return 'Hello World!';
  }

  async handleResponseData(data: TGoogleAuthTokenResponse): Promise<boolean> {
    console.log(data, 'from main project');
    return true;
  }
}

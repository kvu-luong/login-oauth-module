import { Injectable } from '@nestjs/common';
import { TFBResponseTokenEndPoint } from 'src';
import { IHandleAuthentication } from 'src/interface';

@Injectable()
export class FacebookAuthMainService
  implements IHandleAuthentication<TFBResponseTokenEndPoint>
{
  async handleResponseData(
    data: TFBResponseTokenEndPoint,
  ): Promise<Record<string, any>> {
    return {
      message: 'FB: FROM MAIN MODULE',
      client: data,
    };
  }
}

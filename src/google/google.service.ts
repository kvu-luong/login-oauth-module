import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GOOGLE_AUTH_CODE_URL,
  GOOGLE_AUTH_INSTANCE,
  GOOGLE_AUTH_TOKEN_URL,
  GOOGLE_CALLBACK_URL,
  GOOGLE_LOGIN_OPTION,
} from './google.constants';
import {
  TGoogleLoginOptions,
  TGoogleAuthCodeResponse,
  TGoogleAuthTokenResponse,
  TAuthCodePayload,
} from './google.type';
import * as qs from 'qs';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { throwError } from 'src/common/error';
import { AppException } from 'src/common/exception';
import {
  IAuthorizationSocialPlatform,
  IHandleAuthentication,
} from 'src/interface';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class GoogleAuthService
  implements
    IAuthorizationSocialPlatform<
      TAuthCodePayload,
      string,
      TGoogleAuthCodeResponse,
      TGoogleAuthTokenResponse
    >
{
  private readonly logger = new Logger(GoogleAuthService.name);
  constructor(
    @Inject(GOOGLE_LOGIN_OPTION)
    private readonly options: TGoogleLoginOptions<TGoogleAuthTokenResponse>,
    private readonly httpService: HttpService,
    private readonly moduleRef: ModuleRef,
  ) {}

  requestAuth(payload: TAuthCodePayload): string {
    const { clientId, scope, baseUrl, loginHint, hd } = this.options;
    const { state } = payload;
    const googleAuthCodePayload = {
      response_type: 'code',
      client_id: clientId,
      scope: scope.join(' '),
      redirect_uri: `${baseUrl}/${GOOGLE_CALLBACK_URL}`,
      state,
      loginHint,
      hd,
    };
    const queryString = qs.stringify(googleAuthCodePayload);
    return `${GOOGLE_AUTH_CODE_URL}?${queryString}`;
  }

  async handleCallback(
    payload: TGoogleAuthCodeResponse,
  ): Promise<TGoogleAuthTokenResponse> {
    const { callback, origin } = payload;

    // Validate state to prevent CSRF
    if (callback.state !== origin.state) {
      throw new AppException({
        message: 'Invalid state from callback request',
        httpStatus: 422,
      });
    }

    // Make a request to google to get a token
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const requestPayload = {
      code: callback.code,
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      redirect_uri: `${this.options.baseUrl}/${GOOGLE_CALLBACK_URL}`,
      grant_type: 'authorization_code',
    };

    const { data } = await firstValueFrom(
      this.httpService.post(GOOGLE_AUTH_TOKEN_URL, requestPayload, header).pipe(
        catchError((error) => {
          this.logger.error(
            `Verify access token failed::${GOOGLE_AUTH_TOKEN_URL}`,
          );
          throw throwError(error);
        }),
      ),
    );

    // Return data to let main instance continue handle this information.
    const service =
      this.moduleRef.get<IHandleAuthentication<TGoogleAuthTokenResponse>>(
        GOOGLE_AUTH_INSTANCE,
      );

    return await service.handleResponseData(data);
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import * as qs from 'qs';
import {
  IAuthorizationSocialPlatform,
  IHandleAuthentication,
} from 'src/interface';
import {
  FBResponseType,
  TFBRequestAuthCodePayload,
  TFBRequestTokenPayload,
  TFacebookLoginOptions,
  TRequestAuthCodePayload,
  TFBRequestTokenEndPointPayload,
  TFBResponseTokenEndPoint,
  CodeChallengeMethod,
} from './facebook.type';
import {
  FACEBOOK_AUTH_CODE_URL,
  FACEBOOK_AUTH_INSTANCE,
  FACEBOOK_AUTH_TOKEN_URL,
  FACEBOOK_CALLBACK_URL,
  FACEBOOK_LOGIN_OPTION,
} from './facebook.constants';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { AppException } from 'src/common/exception';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class FacebookAuthService
  implements
    IAuthorizationSocialPlatform<
      TFBRequestAuthCodePayload,
      string,
      TFBRequestTokenPayload,
      string
    >
{
  constructor(
    @Inject(FACEBOOK_LOGIN_OPTION)
    private readonly options: TFacebookLoginOptions<TFBResponseTokenEndPoint>,
    private readonly httpService: HttpService,
    private readonly moduleRef: ModuleRef,
  ) {}
  private readonly logger = new Logger(FacebookAuthService.name);
  requestAuth(payload: TFBRequestAuthCodePayload): string {
    const { clientId, scope, baseUrl } = this.options;
    const { state, nonce, codeChallenge } = payload;
    const facebookAuthCodePayload: TRequestAuthCodePayload = {
      response_type: FBResponseType.CODE,
      client_id: clientId,
      scope: scope.join(' '),
      redirect_uri: `${baseUrl}/${FACEBOOK_CALLBACK_URL}`,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
    };

    const queryString = qs.stringify(facebookAuthCodePayload);
    return `${FACEBOOK_AUTH_CODE_URL}?${queryString}`;
  }
  async handleCallback(payload: TFBRequestTokenPayload) {
    const { callback, origin } = payload;
    // Validate state to prevent CSRF
    if (callback.state !== origin.state) {
      throw new AppException({
        message: 'Invalid state from callback request',
        httpStatus: 422,
      });
    }
    // Make a request to facebook token endpoint
    const requestPayload: TFBRequestTokenEndPointPayload = {
      code: callback.code,
      client_id: this.options.clientId,
      redirect_uri: `${this.options.baseUrl}/${FACEBOOK_CALLBACK_URL}`,
      code_verifier: origin.codeVerifier,
      client_secret: this.options.clientSecret,
    };
    const queryString = qs.stringify(requestPayload);
    const requestUrl = `${FACEBOOK_AUTH_TOKEN_URL}?${queryString}`;

    const { data } = await firstValueFrom(
      this.httpService.get(requestUrl).pipe(
        catchError((error) => {
          this.logger.error(
            `FB access token failed::${FACEBOOK_AUTH_CODE_URL}`,
          );
          throw throwError(error);
        }),
      ),
    );

    // Return data to let main instance continue handle this information.
    const service = this.moduleRef.get<
      IHandleAuthentication<TFBResponseTokenEndPoint>
    >(FACEBOOK_AUTH_INSTANCE);

    return await service.handleResponseData(data);
  }
}

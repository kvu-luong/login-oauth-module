import { Provider } from '@nestjs/common';
import { GOOGLE_LOGIN_OPTION } from './google.constants';
import { TGoogleAuthTokenResponse, TGoogleLoginOptions } from './google.type';

export function createProvider(
  googleLoginOptions: TGoogleLoginOptions<TGoogleAuthTokenResponse>,
): Provider<TGoogleLoginOptions<TGoogleAuthTokenResponse>> {
  return {
    provide: GOOGLE_LOGIN_OPTION,
    useValue: googleLoginOptions,
  };
}

import { Provider } from '@nestjs/common';
import {
  TFBResponseTokenEndPoint,
  TFacebookLoginOptions,
} from './facebook.type';
import { FACEBOOK_LOGIN_OPTION } from './facebook.constants';

export function createProvider(
  facebookLoginOptions: TFacebookLoginOptions<TFBResponseTokenEndPoint>,
): Provider<TFacebookLoginOptions<TFBResponseTokenEndPoint>> {
  return {
    provide: FACEBOOK_LOGIN_OPTION,
    useValue: facebookLoginOptions,
  };
}

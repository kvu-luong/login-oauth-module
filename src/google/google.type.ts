import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { IHandleAuthentication } from 'src/interface';
export enum Scope {
  OPENID = 'openid',
  EMAIL = 'email',
  PROFILE = 'profile',
}

export type TGoogleLoginOptions<T> = {
  clientId: string;
  clientSecret: string;
  scope: Array<Scope>;
  loginHint?: string;
  hd?: string;
  baseUrl: string;
  service: ClassConstructor<IHandleAuthentication<T>>;
  module:
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>;
};

export type TGoogleAuthCodeRequest = {
  responseType: string;
  clientId: string;
  scope: Array<Scope>;
  redirectUri: string;
  state: string;
  nonce: string;
  loginHint?: string;
  hd?: string;
};

export type TGoogleAuthCodeResponse = {
  callback: {
    state: string;
    code: string;
  };
  origin: {
    state: string;
  };
};

export type TGoogleAuthTokenRequest = {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType: string;
};

export type TGoogleAuthTokenResponse = {
  accessToken: string;
  expiresIn: number;
  idToken: string;
  scope: string;
  tokenType: string;
  refreshToken: string;
};

export type TGoogleAuthUser = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  at_hash: string;
  hd: string;
  email: string;
  email_verified: string;
  iat: number;
  exp: number;
  nonce: string;
};

export type TAuthCodePayload = {
  state: string;
  nonce?: string;
};

export type TAuthCallBackPayload = {
  state: string;
  code: string;
};

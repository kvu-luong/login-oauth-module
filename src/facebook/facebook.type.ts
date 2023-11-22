import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { IHandleAuthentication } from 'src/interface';

export enum FBScope {
  OPENID = 'openid',
}

export enum CodeChallengeMethod {
  S256 = 'S256',
}

export enum FBResponseType {
  CODE = 'code',
}

export type TFacebookLoginOptions<T> = {
  clientId: string;
  clientSecret?: string;
  scope: Array<string>;
  baseUrl: string;
  service: ClassConstructor<IHandleAuthentication<T>>;
  module:
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>;
};

export type TRequestAuthCodePayload = {
  client_id: string;
  scope: string;
  response_type: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  nonce?: string;
};

export type TFBRequestAuthCodePayload = {
  state: string;
  nonce: string;
  codeChallenge: string;
};

export type TFBResponseAuthCode = {
  state: string;
  code: string;
};

export type TFBRequestTokenPayload = {
  callback: {
    state: string;
    code: string;
  };
  origin: {
    state: string;
    codeVerifier: string;
  };
};

export type TFBRequestTokenEndPointPayload = {
  client_id: string;
  client_secret?: string;
  redirect_uri: string;
  code_verifier: string;
  code: string;
};

export type TFBResponseTokenEndPoint = {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
};

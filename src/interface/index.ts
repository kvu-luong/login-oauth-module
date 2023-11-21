export interface IAuthorizationSocialPlatform<T, TR, K, KR> {
  requestAuth: (payload: T) => TR;
  handleCallback: (payload: K) => Promise<KR>;
}

export interface IHandleAuthentication<T> {
  handleResponseData: (data: T) => Promise<any>;
}

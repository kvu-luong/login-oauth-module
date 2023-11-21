export interface ErrorResponse {
  message: string;
  error?: string;
  httpStatus?: number;
  data?: any;
}
export declare class AppException extends Error {
  error: any;
  httpStatus: any;
  data: any;
  constructor(params: ErrorResponse);
}

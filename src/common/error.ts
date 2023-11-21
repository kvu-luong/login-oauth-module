import { get } from 'lodash';
import { AppException } from './exception';
export function throwError(error: any) {
  const response = get(error, 'response');
  const error_description = get(
    response,
    'data.error_description',
    error.message,
  );
  const code = get(response, 'data.code', '');
  const status = get(response, 'status');
  return new AppException({
    error: `SOCIAL AUTHORIZATION ERROR ${code}`,
    message: error_description,
    httpStatus: status,
  });
}

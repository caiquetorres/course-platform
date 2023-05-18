import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiUnauthorized() {
  return ApiUnauthorizedResponse({
    description: 'The token is invalid or missing',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or missing authentication token',
        error: 'Unauthorized',
      },
    },
  });
}

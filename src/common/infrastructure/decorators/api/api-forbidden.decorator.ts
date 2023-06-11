import { ApiForbiddenResponse } from '@nestjs/swagger';

export function ApiForbidden() {
  return ApiForbiddenResponse({
    description: 'The user does not have permission to access this resource',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to access this resource',
        error: 'Forbidden',
      },
    },
  });
}

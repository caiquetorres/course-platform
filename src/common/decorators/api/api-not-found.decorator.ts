import { Type } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { IBase } from '../../interfaces/base.interface';

import '../../extensions/string.extension';

export function ApiNotFound<T extends IBase>(entity: string | Type<T>) {
  let entityName: string;

  if (typeof entity === 'string') {
    entityName = entity;
  } else {
    entityName = entity.name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  return ApiNotFoundResponse({
    description: `Entity not found`,
    schema: {
      example: {
        statusCode: 404,
        message: `${entityName} with id '64382a95836b96e2e7cbefbe' not found`,
        error: 'Not Found',
      },
    },
  });
}

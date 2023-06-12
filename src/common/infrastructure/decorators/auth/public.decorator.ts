import { SetMetadata, applyDecorators } from '@nestjs/common';

import { AllowFor } from './allow-for.decorator';

import { IS_PUBLIC } from '../../../domain/constants/public.constant';

/**
 * Marks a route as public.
 *
 * As its result, any parameter marked with `RequestUser` will receive a
 * guest user by default.
 */
export function Public(): MethodDecorator {
  return applyDecorators(AllowFor(/.*/), SetMetadata(IS_PUBLIC, true));
}

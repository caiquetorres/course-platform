import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

import { EnvService } from '../../../../env/env.service';

/**
 * Factory class for creating ThrottlerModuleOptions.
 */
@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly _envService: EnvService) {}

  /**
   * Returns the options required for Throttler module.
   *
   * @returns options object for Throttler module.
   */
  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      ttl: this._envService.get('THROTTLER_TTL'),
      limit: this._envService.get('THROTTLER_LIMIT'),
    };
  }
}

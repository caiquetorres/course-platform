import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { EnvService } from '../../../../env/env.service';

/**
 * Factory class for creating JwtModuleOptions.
 */
@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private readonly _envService: EnvService) {}

  /**
   * Returns the options required for JWT module.
   *
   * @returns options object for JWT module.
   */
  createJwtOptions(): JwtModuleOptions {
    return {
      privateKey: this._envService.get('JWT_SECRET'),
    };
  }
}

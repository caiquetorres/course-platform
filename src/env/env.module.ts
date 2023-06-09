import {
  DynamicModule,
  Global,
  InternalServerErrorException,
  Module,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvVariables } from './models/env-variables.model';

import { EnvService } from './env.service';

import { IEnvModuleOptions } from './interfaces/env-module-options.interface';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

@Global()
@Module({})
export class EnvModule {
  static forRoot(options?: IEnvModuleOptions): DynamicModule {
    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          validate: EnvModule.validate,
        }),
      ],
      providers: [EnvService],
      exports: [EnvService],
    };
  }

  /**
   * Method that validates all the environment variables before the
   * application starts.
   *
   * @param config defines the variables and it values.
   * @returns an object that represents the variables and it values.
   */
  private static validate(config: Record<string, unknown>): EnvVariables {
    const validatedConfig = plainToClass(EnvVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length) {
      const errorSentence = `Invalid environment variables\n- ${errors
        .map((error) => error.constraints)
        .map((constraint) => Object.values(constraint))
        .flat()
        .join('.\n- ')}`;

      Logger.error(errorSentence, 'EnvModule');
      throw new InternalServerErrorException(errorSentence);
    }

    return validatedConfig;
  }
}

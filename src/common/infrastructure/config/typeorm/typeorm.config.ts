import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { EnvService } from '../../../../env/env.service';

import * as path from 'path';

/**
 * Configuration responsible for setting up the `Type Orm` package inside
 * the application.
 */
@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly env: EnvService) {}

  /**
   * Method that creates the `TypeOrm` configuration.
   *
   * @returns an object that stores all the configuration.
   */
  createTypeOrmOptions() {
    const entitiesPath = path.resolve(
      __dirname,
      '../../../..',
      '**',
      '*.entity.{js,ts}',
    );
    const migrationsPath = path.resolve(
      __dirname,
      '../../../..',
      'common/infrastructure/migrations/*.{js,ts}',
    );

    const options = {
      type: this.env.get('DB_TYPE'),
      host: this.env.get('DB_HOST'),
      port: this.env.get('DB_PORT'),
      username: this.env.get('DB_USERNAME'),
      password: this.env.get('DB_PASSWORD'),
      database: this.env.get('DB_DATABASE'),
      migrationsRun: this.env.get('DB_MIGRATIONS_RUN'),
      logging: this.env.get('NODE_ENV') === 'development',
      entities: [entitiesPath],
      migrations: [migrationsPath],
      synchronize: false,
    } as TypeOrmModuleOptions;

    return options;
  }
}

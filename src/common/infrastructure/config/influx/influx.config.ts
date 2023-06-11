import { Injectable } from '@nestjs/common';

import { EnvService } from '../../../../env/env.service';

import { IInfluxModuleOptionsFactory } from '../../../../influx/interfaces/influx-module-options-factory.interface';
import { IInfluxModuleOptions } from '../../../../influx/interfaces/influx-module-options.interface';

/**
 * Configuration responsible for setting up the `Type Orm` package inside
 * the application.
 */
@Injectable()
export class InfluxConfig implements IInfluxModuleOptionsFactory {
  constructor(private readonly _env: EnvService) {}

  createInfluxOptions(): IInfluxModuleOptions {
    return {
      url: this._env.get('INFLUXDB_URL'),
      token: this._env.get('INFLUXDB_TOKEN'),
    };
  }
}

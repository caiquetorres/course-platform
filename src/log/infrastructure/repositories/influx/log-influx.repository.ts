import { Injectable } from '@nestjs/common';

import { Log } from '../../../domain/models/log';

import { EnvService } from '../../../../env/env.service';
import { InfluxService } from '../../../../influx/influx.service';

import { PointBuilder } from '../../../../influx/builders/point.builder';
import { LogRepository } from '../log.repository';

@Injectable()
export class LogInfluxTypeOrmRepository extends LogRepository {
  constructor(
    private readonly _influxService: InfluxService,
    private readonly _env: EnvService,
  ) {
    super();
  }

  override async save(log: Log): Promise<void> {
    const point = new PointBuilder('logs')
      .withTimestamp(log.timestamp)
      .withString('resource', log.resource)
      .withString('user', log.userId)
      .withString('action', log.action)
      .withInt('credits', log.credits)
      .build();

    await this._influxService.insertPoint(
      this._env.get('INFLUXDB_ORG'),
      'logs',
      point,
    );
  }
}

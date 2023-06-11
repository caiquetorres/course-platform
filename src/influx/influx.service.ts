import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { InfluxOptionsConstant } from './constants/module.constant';
import { IInfluxModuleOptions } from './interfaces/influx-module-options.interface';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { interval, lastValueFrom } from 'rxjs';

/**
 * Service that deals with the InfluxDB connection, writing and querying
 * behaviors.
 */
@Injectable()
export class InfluxService {
  /**
   * Property that defines an object that represents the influx client.
   */
  private readonly influx: InfluxDB;

  /**
   * Property that defines an object that represents the logger instance
   * used to log strings or objects related with this service.
   */
  private readonly logger = new Logger(InfluxService.name);

  constructor(
    @Inject(InfluxOptionsConstant)
    private readonly _options: IInfluxModuleOptions,
    private readonly _httpService: HttpService,
  ) {
    this.influx = new InfluxDB(_options);
    this._ping();
  }

  async insertPoint(organization: string, bucket: string, ...points: Point[]) {
    const writeApi = this.influx.getWriteApi(organization, bucket);
    writeApi.writePoints(points);
    await writeApi.close();
  }

  /**
   * Method that pings the influx database to test it connection
   *
   * @returns an observable related to the ping result.
   */
  private async _ping(): Promise<void> {
    try {
      await lastValueFrom(this._httpService.get<void>(this._options.url));
    } catch (err) {
      console.log(this._options.url);
      this.logger.error('Unable to connect to the Influx database', err);
      await lastValueFrom(interval(2000));
      this._ping();
      throw err;
    }
  }
}

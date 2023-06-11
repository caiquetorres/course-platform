import { Module } from '@nestjs/common';

import { LogInfluxTypeOrmRepository as LogInfluxRepository } from './infrastructure/repositories/influx/log-influx.repository';
import { LogRepository } from './infrastructure/repositories/log.repository';

@Module({
  providers: [
    {
      provide: LogRepository,
      useClass: LogInfluxRepository,
    },
  ],
  exports: [LogRepository],
})
export class LogModule {}

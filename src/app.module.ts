import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateLimitGuard } from './common/guards/rate-limit/rate-limit.guard';

import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { ThrottlerConfig } from './common/config/throttler/throttler.config';
import { TypeOrmConfig } from './common/config/typeorm/typeorm.config';
import { PathLoggerMiddleware } from './common/middlewares/path-logger.middleware';
import { EnvModule } from './env/env.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EnvModule.forRoot({ envFilePath: ['.env'] }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfig }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PathLoggerMiddleware).forRoutes('*');
  }
}

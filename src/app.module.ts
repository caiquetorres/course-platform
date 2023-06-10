import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { InfluxConfig } from './common/infrastructure/config/influx/influx.config';
import { TypeOrmConfig } from './common/infrastructure/config/typeorm/typeorm.config';
import { CourseModule } from './course/course.module';
import { EnvModule } from './env/env.module';
import { InfluxModule } from './influx/influx.module';
import { LogModule } from './log/log.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CourseModule,
    ProjectModule,
    LogModule,
    EnvModule.forRoot({ envFilePath: ['.env'] }),
    InfluxModule.forRootAsync({ useClass: InfluxConfig }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
  ],
  controllers: [AppController],
})
export class AppModule {}

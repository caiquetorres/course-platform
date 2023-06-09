import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from './common/infrastructure/config/typeorm/typeorm.config';
import { CourseModule } from './course/course.module';
import { EnvModule } from './env/env.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CourseModule,
    ProjectModule,
    EnvModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './infrastructure/services/auth.service';

import { AuthController } from './presentation/auth.controller';

import { JwtConfig } from '../common/infrastructure/config/jwt/jwt.config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { LoginUseCase } from './usecases/login.usecase';

@Module({
  imports: [UserModule, JwtModule.registerAsync({ useClass: JwtConfig })],
  providers: [LoginUseCase, AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

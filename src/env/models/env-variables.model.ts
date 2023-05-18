import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * Class that represents how environment variables should be set before
 * the application starts.
 */
export class EnvVariables {
  @IsNotEmpty({ message: 'It is required to set the "NODE_ENV"' })
  @IsString({ message: 'It is required to set a valid string value' })
  @IsIn(['test', 'development', 'production'])
  NODE_ENV: 'test' | 'development' | 'production';

  @IsOptional()
  @IsString({ message: 'It is required to set a valid string value' })
  PACKAGE_VERSION?: string;

  @IsOptional()
  @IsNumber({}, { message: 'It is required to set a number value' })
  PORT?: number;

  //#region Database

  @IsNotEmpty({ message: 'It is required to send the database type' })
  @IsString({ message: 'It is required to send a valid string value' })
  @IsIn(['postgres', 'mysql', 'sqlite'])
  DB_TYPE: 'postgres' | 'mysql' | 'sqlite';

  @IsOptional()
  @IsString({ message: 'It is required to send a valid string value' })
  DB_DATABASE?: string;

  @IsOptional()
  @IsNumber({}, { message: 'It is required to send a number value' })
  DB_PORT?: number;

  @IsOptional()
  @IsString({ message: 'It is required to send a valid string value' })
  DB_URL?: string;

  @IsOptional()
  @IsString({ message: 'It is required to send a valid string value' })
  DB_HOST?: string;

  @IsOptional()
  @IsString({ message: 'It is required to send a valid string value' })
  DB_USERNAME?: string;

  @IsOptional()
  @IsString({ message: 'It is required to send a valid string value' })
  DB_PASSWORD?: string;

  @IsNotEmpty({ message: 'Is is required to set DB_MIGRATIONS_RUN' })
  @IsBoolean({ message: 'It is required to send a boolean value' })
  DB_MIGRATIONS_RUN: boolean;

  @IsNotEmpty({ message: 'Is is required to set DB_SSL' })
  @IsBoolean({ message: 'It is required to send a boolean value' })
  DB_SSL: boolean;

  //#endregion

  //#region JWT

  @IsNotEmpty({ message: 'It is required to set the "JWT_SECRET"' })
  @IsString({ message: 'It is required to set a valid string value' })
  JWT_SECRET: string;

  @IsOptional()
  @IsString({ message: 'It is required to set a valid string value' })
  JWT_EXPIRES_IN?: string;

  //#endregion

  //#region Throttler

  @IsNotEmpty({ message: 'It is required to set the throttler ttl' })
  @IsNumber({}, { message: 'It is required to set a number value' })
  THROTTLER_TTL: number;

  @IsNotEmpty({ message: 'It is required to set the throttler limit' })
  @IsNumber({}, { message: 'It is required to set a number value' })
  THROTTLER_LIMIT: number;

  //#endregion

  //#region Swagger

  @IsNotEmpty({ message: 'It is required to set the swagger title' })
  @IsString({ message: 'It is required to set a valid string value' })
  SWAGGER_TITLE: string;

  @IsOptional()
  @IsString({ message: 'It is required to set a valid string value' })
  SWAGGER_DESCRIPTION?: string;

  @IsNotEmpty({ message: 'It is required to set the swagger version' })
  @IsString({ message: 'It is required to set a valid string value' })
  SWAGGER_VERSION: string;

  @IsOptional()
  @IsString({ message: 'It is required to set a valid string value' })
  SWAGGER_TAG?: string;

  //#endregion
}

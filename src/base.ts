import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { JwtGuard } from './common/guards/jwt/jwt.guard';
import { RolesGuard } from './common/guards/roles/roles.guard';

import { EnvService } from './env/env.service';

/**
 * Function that creates a `Nest` application.
 *
 * @returns an object that represents the application.
 */
export async function setupApp(app: INestApplication) {
  const envService = app.get(EnvService);
  const reflector = app.get(Reflector);

  setupPipes(app);
  setupGuards(app, reflector);
  setupSwagger(app, envService);

  app.enableCors();
}

/**
 * Function that setup all the application base guards.
 *
 * @param app defines an object that represents the application instance.
 * @param reflector defines an object that contains abstractions
 * responsible for dealing with the Reflect API.
 */
function setupGuards(app: INestApplication, reflector: Reflector) {
  app.useGlobalGuards(new JwtGuard(reflector), new RolesGuard(reflector));
}

/**
 * Function that setup all the global application pipes.
 *
 * @param app defines an object that represents the application instance.
 */
function setupPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
}

/**
 * Function that setup the swagger.
 *
 * @param app defines an object that represents the application instance.
 * @param env defines an object that represents the application environment
 * service.
 */
function setupSwagger(app: INestApplication, env: EnvService) {
  const config = new DocumentBuilder()
    .setTitle(env.get('SWAGGER_TITLE'))
    .setDescription(env.get('SWAGGER_DESCRIPTION'))
    .setVersion(env.get('SWAGGER_VERSION'))
    .addTag(env.get('SWAGGER_TAG'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`swagger`, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });
}

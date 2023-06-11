import { NestFactory } from '@nestjs/core';

import { EnvService } from './env/env.service';

import { AppModule } from './app.module';
import { setupApp } from './base';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupApp(app);

  const envService = app.get(EnvService);
  await app.listen(envService.get('PORT') || 3000);
}
bootstrap();

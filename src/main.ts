import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupApp } from './base';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);

  await app.listen(3000);
}
bootstrap();

import { Controller, Get } from '@nestjs/common';

import { Public } from './common/infrastructure/decorators/auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('ping')
  ping() {
    return 'pong';
  }
}

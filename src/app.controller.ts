import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from './common/decorators/auth/public.decorator';

@Controller()
export class AppController {
  /**
   * Method that returns a simple 'pong'.
   *
   * @returns 'pong'
   */
  @ApiOperation({ summary: 'Test the api connection' })
  @ApiOkResponse({
    schema: {
      example: 'pong',
    },
  })
  @SkipThrottle()
  @Public()
  @Get('ping')
  ping() {
    return 'pong';
  }
}

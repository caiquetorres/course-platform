import { HttpException, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Guard responsible for protecting routes against multiple requests.
 */
@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  throwThrottlingException() {
    throw new HttpException('Too many requests received', 429);
  }
}

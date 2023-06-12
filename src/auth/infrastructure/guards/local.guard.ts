import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Implements a guard that provides local authentication strategy.
 */
@Injectable()
export class LocalGuard extends AuthGuard('local') {}

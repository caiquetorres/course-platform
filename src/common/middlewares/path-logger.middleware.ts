import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware responsible for logging the route that is being consumed.
 */
@Injectable()
export class PathLoggerMiddleware implements NestMiddleware {
  /**
   * The middleware logger instance.
   */
  private readonly _logger = new Logger('PathLogger');

  /**
   * Method that logs, on the console, the route that is being consumed.
   *
   * @param request defines the incoming request.
   * @param response defines the api response.
   * @param next defines the function that is called in order of moving
   * the request to the next step.
   */
  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      this._logger.debug(`${method} ${originalUrl} ${response.statusCode}`);
    });

    next();
  }
}

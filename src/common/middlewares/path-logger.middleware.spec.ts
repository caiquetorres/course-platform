import { PathLoggerMiddleware } from './path-logger.middleware';

describe('PathLoggerMiddleware (unit)', () => {
  it('should be defined', () => {
    const middleware = new PathLoggerMiddleware();
    expect(middleware).toBeDefined();
  });
});

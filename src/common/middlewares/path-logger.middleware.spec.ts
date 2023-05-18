import { PathLoggerMiddleware } from './path-logger.middleware';

describe('PathLoggerMiddleware', () => {
  it('should be defined', () => {
    const middleware = new PathLoggerMiddleware();
    expect(middleware).toBeDefined();
  });
});

import { Username } from '../../../src/user/domain/value-objects/username';

describe('Username (unit)', () => {
  it('should create the email', () => {
    const email = new Username('janedoe');
    expect(email.value).toBe('janedoe');
  });

  it('should create the email', () => {
    expect(() => new Username('janedoe')).not.toThrow(Error);
  });

  it('should throw an error due to the email invalidation', () => {
    expect(() => new Username('janedoe123')).toThrow(Error);
  });
});

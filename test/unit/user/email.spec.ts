import { Email } from '../../../src/user/domain/value-objects/email';

describe('Email (unit)', () => {
  it('should create the email', () => {
    const email = new Email('janedoe@email.com');
    expect(email.value).toBe('janedoe@email.com');
  });

  it('should create the email', () => {
    expect(() => new Email('janedoe@email.com')).not.toThrow(Error);
  });

  it('should throw an error due to the email invalidation', () => {
    expect(() => new Email('janedoe')).toThrow(Error);
  });
});

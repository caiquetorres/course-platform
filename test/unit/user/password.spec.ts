import { Password } from '../../../src/user/domain/value-objects/password';

describe('Password (unit)', () => {
  it('should hash the password', () => {
    const password = Password.from('JaneDoe123*');
    expect(password.value).not.toBe('JaneDoe123*');
  });

  it('should create the password', () => {
    expect(() => Password.from('JaneDoe123*')).not.toThrow(Error);
  });

  it('should throw an error due to the password invalidation', () => {
    expect(() => Password.from('janedoe')).toThrow(Error);
  });
});

import bcryptjs from 'bcryptjs';

export class Password {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    Object.freeze(this);
  }

  static from(value: string) {
    value = Password._hash(value);
    return new Password(value);
  }

  private static _hash(password: string): string {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
  }
}

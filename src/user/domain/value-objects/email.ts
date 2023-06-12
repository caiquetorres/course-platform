import { isEmail } from 'class-validator';

export class Email {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    this._validate(this.value);
    Object.freeze(this);
  }

  private _validate(email: string) {
    if (!isEmail(email)) {
      throw new Error(`Invalid email '${email}'`);
    }
  }
}

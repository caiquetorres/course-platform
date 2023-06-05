import { InvalidUserEmailError } from '../errors/invalid-user-email.error';
import { isEmail } from 'class-validator';

export class Email {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    this._validate();
    Object.freeze(this);
  }

  toString() {
    return this.value;
  }

  private _validate() {
    if (!isEmail(this._value)) {
      throw new InvalidUserEmailError(this._value);
    }
  }
}

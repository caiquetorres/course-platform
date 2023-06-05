import { InvalidUserUsernameError } from '../errors/invalid-user-username.error';

export class Username {
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
    const regex = /^[a-z]+$/i;
    if (!regex.test(this.value)) {
      throw new InvalidUserUsernameError();
    }
  }
}

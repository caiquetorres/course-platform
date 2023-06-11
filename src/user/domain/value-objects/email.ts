export class Email {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: string) {
    Object.freeze(this);
  }

  toString() {
    return this.value;
  }
}

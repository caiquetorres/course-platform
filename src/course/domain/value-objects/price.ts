export class Price {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: number) {
    if (this.value < 0) {
      throw new Error('Invalid price');
    }

    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }
}

export class Price {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: number) {
    if (this.value === undefined) {
      throw new Error();
    }
    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }
}

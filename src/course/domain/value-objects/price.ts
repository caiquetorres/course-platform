export class Price {
  get value() {
    return this._value;
  }

  constructor(private readonly _value: number) {}

  valueOf() {
    return this.value;
  }
}
